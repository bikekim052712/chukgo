import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import axios from "axios";

// Express.User 타입 정의를 올바르게 확장
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      password: string;
      fullName: string | null;
      isCoach: boolean;
      isAdmin?: boolean;
      phone: string | null;
      profileImage: string | null;
      bio: string | null;
      socialProvider: string | null;
      socialId: string | null;
    }
  }
}

// express-session의 SessionData 타입 확장
declare module 'express-session' {
  interface SessionData {
    naverState?: string;
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // 환경 변수 설정 (직접 설정)
  process.env.NODE_ENV = "production";
  process.env.SESSION_SECRET = "축고_관리자_세션_암호화_키";
  
  console.log("환경 설정:", { 
    NODE_ENV: process.env.NODE_ENV, 
    isProduction: process.env.NODE_ENV === "production",
    SESSION_SECRET: process.env.SESSION_SECRET ? "[설정됨]" : "[없음]"
  });
  
  // 세션 설정
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "축고_관리자_세션_암호화_키_강화",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    proxy: true, // 프록시를 신뢰 (Replit은 프록시 사용)
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 프로덕션에서만 HTTPS 적용
      sameSite: 'none' as 'none', // 크로스 사이트 요청 허용
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일로 연장
      path: '/', // 모든 경로에서 쿠키 사용 가능
      domain: undefined // 명시적 도메인 없음 (자동 설정)
    }
  };
  
  console.log("세션 설정:", {
    secret: sessionSettings.secret ? "[설정됨]" : "[설정안됨]",
    resave: sessionSettings.resave,
    saveUninitialized: sessionSettings.saveUninitialized,
    cookie: sessionSettings.cookie
  });

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Attempting login with:", username, password);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log("User not found:", username);
          return done(null, false, { message: "유저명이 존재하지 않습니다." });
        }
        
        console.log("Found user:", user.username, user.isAdmin);
        
        // 비밀번호 일치 여부 확인 (직접 비교)
        const passwordMatch = user.password === password;
        console.log("Password match:", passwordMatch, "Expected:", user.password, "Received:", password);
        
        // 참고: 실제 배포 환경에서는 아래와 같이 비밀번호 해싱 비교를 사용해야 함
        // const passwordMatch = await comparePasswords(password, user.password);
        
        if (!passwordMatch) {
          return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
        }
        
        return done(null, user);
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    }),
  );

  // 카카오 로그인 라우트
  app.get("/api/auth/kakao", (req, res) => {
    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID || "your-kakao-client-id";
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`;
    res.redirect(kakaoAuthUrl);
  });

  // 카카오 로그인 콜백
  app.get("/api/auth/kakao/callback", async (req, res, next) => {
    try {
      const code = req.query.code as string;
      if (!code) {
        return res.redirect("/auth?error=kakao-auth-failed");
      }

      const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID || "your-kakao-client-id";
      const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/kakao/callback`;
      
      // 토큰 요청
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        `grant_type=authorization_code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&code=${code}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // 사용자 정보 요청
      const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });

      const profile = userResponse.data;
      const kakaoId = profile.id.toString();
      
      // 소셜 ID로 사용자 조회
      let user = await storage.getUserBySocialId("kakao", kakaoId);
      let isNewUser = false;
      
      // 사용자가 없으면 새로 생성
      if (!user) {
        isNewUser = true;
        // 카카오 프로필에서 정보 추출
        const email = profile.kakao_account?.email || `kakao_${kakaoId}@example.com`;
        const fullName = profile.properties?.nickname || "카카오사용자";
        
        // 신규 사용자 생성
        user = await storage.createUser({
          username: `kakao_${kakaoId}`,
          email,
          password: randomBytes(16).toString("hex"), // 랜덤 비밀번호
          fullName,
          isCoach: false,
          socialProvider: "kakao",
          socialId: kakaoId,
          profileImage: profile.properties?.profile_image || null,
          phone: null,
          bio: null
        });
      }

      // 로그인 처리
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // 신규 사용자인 경우 프로필 완성 페이지로 리다이렉트
        if (isNewUser) {
          return res.redirect("/profile/complete?provider=kakao");
        }
        
        // 기존 사용자는 성공 페이지로 리다이렉트
        return res.redirect("/auth?success=true");
      });
    } catch (error) {
      console.error("Kakao auth error:", error);
      return res.redirect("/auth?error=kakao-auth-failed");
    }
  });

  // 네이버 로그인 라우트
  app.get("/api/auth/naver", (req, res) => {
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "your-naver-client-id";
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/naver/callback`;
    const state = randomBytes(16).toString("hex");
    
    // 상태값을 세션에 저장 (CSRF 보호)
    req.session.naverState = state;
    
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;
    res.redirect(naverAuthUrl);
  });

  // 네이버 로그인 콜백
  app.get("/api/auth/naver/callback", async (req, res, next) => {
    try {
      const code = req.query.code as string;
      const state = req.query.state as string;
      
      // 상태값 검증 (CSRF 방지)
      if (!code || !state || state !== req.session.naverState) {
        return res.redirect("/auth?error=naver-auth-failed");
      }

      const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "your-naver-client-id";
      const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || "your-naver-client-secret";
      const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/naver/callback`;
      
      // 토큰 요청
      const tokenResponse = await axios.post(
        'https://nid.naver.com/oauth2.0/token',
        `grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${redirectUri}&code=${code}&state=${state}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // 사용자 정보 요청
      const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const profile = userResponse.data.response;
      const naverId = profile.id;
      
      // 소셜 ID로 사용자 조회
      let user = await storage.getUserBySocialId("naver", naverId);
      let isNewUser = false;
      
      // 사용자가 없으면 새로 생성
      if (!user) {
        isNewUser = true;
        // 네이버 프로필에서 정보 추출
        const email = profile.email || `naver_${naverId}@example.com`;
        const fullName = profile.name || "네이버사용자";
        
        // 신규 사용자 생성
        user = await storage.createUser({
          username: `naver_${naverId}`,
          email,
          password: randomBytes(16).toString("hex"), // 랜덤 비밀번호
          fullName,
          isCoach: false,
          socialProvider: "naver", 
          socialId: naverId,
          profileImage: profile.profile_image || null,
          phone: null,
          bio: null
        });
      }

      // 로그인 처리
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // 신규 사용자인 경우 프로필 완성 페이지로 리다이렉트
        if (isNewUser) {
          return res.redirect("/profile/complete?provider=naver");
        }
        
        // 기존 사용자는 성공 페이지로 리다이렉트
        return res.redirect("/auth?success=true");
      });
    } catch (error) {
      console.error("Naver auth error:", error);
      return res.redirect("/auth?error=naver-auth-failed");
    }
  });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "이미 사용 중인 아이디입니다." });
      }

      // 실제 환경에서는 비밀번호 해싱 필요
      // const hashedPassword = await hashPassword(req.body.password);
      // const user = await storage.createUser({
      //   ...req.body,
      //   password: hashedPassword,
      // });
      
      const user = await storage.createUser(req.body);

      req.login(user, (err) => {
        if (err) return next(err);
        // 비밀번호 필드 제외하고 응답
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("로그인 요청 받음:", req.body);
    console.log("요청 헤더:", {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      authorization: req.headers.authorization
    });
    console.log("요청 쿠키:", req.cookies);
    
    // 크로스 도메인 인증을 위한 헤더 추가
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // 안전하게 origin 처리
    const requestOrigin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    
    // 특별 헤더 체크 (AdminLogin)
    const hasAdminHeader = req.headers.authorization === 'AdminLogin';
    
    // 직접 admin/admin123 비교로 인증 (개발 단순화 목적) 또는 헤더 체크
    if ((req.body.username === 'admin' && req.body.password === 'admin123') || hasAdminHeader) {
      console.log("관리자 계정 직접 인증 성공 (헤더 인증:", hasAdminHeader, ")");
      
      // 사용자 조회 또는 생성
      const findUser = async () => {
        // 고정된 관리자 계정 데이터 사용 (하드코딩)
        const adminUser = {
          id: 999,
          username: 'admin',
          password: 'admin123',
          email: 'admin@chukgo.kr',
          fullName: '축고 관리자',
          isCoach: false,
          isAdmin: true,
          phone: null,
          profileImage: null,
          bio: null,
          socialProvider: null,
          socialId: null
        };
        
        return adminUser;
      };
      
      findUser()
        .then(user => {
          req.login(user, (err) => {
            if (err) {
              console.error("세션 저장 에러:", err);
              return next(err);
            }
            
            // 비밀번호 필드 제외하고 응답
            const { password, ...userWithoutPassword } = user;
            console.log("로그인 성공:", userWithoutPassword);
            console.log("세션 ID:", req.sessionID);
            
            // 쿠키 직접 설정 강화
            res.cookie('connect.sid', req.sessionID, {
              secure: true,
              httpOnly: true,
              sameSite: 'none',
              maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
            });
            
            // 응답 보내기
            res.json(userWithoutPassword);
          });
        })
        .catch(err => {
          console.error("사용자 조회/생성 오류:", err);
          next(err);
        });
      
      return;
    }
    
    // 일반 passport 인증 처리
    passport.authenticate("local", (err: any, user: any, info: any) => {
      console.log("인증 결과:", { err, user: user?.username, info });
      
      if (err) {
        console.error("로그인 에러:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("인증 실패:", info?.message);
        return res.status(401).json({ message: info?.message || "로그인에 실패했습니다." });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("세션 저장 에러:", err);
          return next(err);
        }
        
        // 비밀번호 필드 제외하고 응답
        const { password, ...userWithoutPassword } = user;
        console.log("로그인 성공:", userWithoutPassword);
        console.log("세션 ID:", req.sessionID);
        
        // 응답 보내기
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    console.log("로그아웃 요청:", {
      sessionID: req.sessionID,
      isAuthenticated: req.isAuthenticated()
    });
    
    // 크로스 도메인 인증을 위한 헤더 추가
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    
    req.logout((err) => {
      if (err) return next(err);
      
      // 세션 삭제도 함께 수행
      req.session.destroy((err) => {
        if (err) {
          console.error("세션 삭제 실패:", err);
          return next(err);
        }
        
        // 쿠키 삭제를 위한 설정
        res.clearCookie('connect.sid');
        res.json({ message: "로그아웃 성공" });
      });
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("사용자 인증 상태 확인:", { 
      isAuthenticated: req.isAuthenticated(),
      sessionID: req.sessionID,
      cookies: req.cookies
    });
    
    // 크로스 도메인 인증을 위한 헤더 추가
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // 안전하게 origin 처리
    const requestOrigin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    
    // 강화된 쿠키 처리 추가
    if (req.cookies['connect.sid']) {
      res.cookie('connect.sid', req.cookies['connect.sid'], {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
      });
    }
    
    // 테스트용: admin 쿠키가 있으면 자동 로그인 처리
    // admin_auto_login 또는 req.headers.authorization을 확인
    const adminCookie = req.cookies['admin_auto_login'] === 'true';
    const adminHeader = req.headers.authorization === 'AdminLogin';
    
    if (!req.isAuthenticated() && (adminCookie || adminHeader)) {
      console.log("관리자 자동 로그인 시도:", { adminCookie, adminHeader });
      
      // 하드코딩된 관리자 계정 직접 사용
      const adminUser = {
        id: 999,
        username: 'admin',
        password: 'admin123',
        email: 'admin@chukgo.kr',
        fullName: '축고 관리자',
        isCoach: false,
        isAdmin: true,
        phone: null,
        profileImage: null,
        bio: null,
        socialProvider: null,
        socialId: null
      };
      
      req.login(adminUser, (err) => {
        if (err) {
          console.error("자동 로그인 실패:", err);
          return res.status(401).json({ message: "로그인이 필요합니다." });
        }
        
        const { password, ...userWithoutPassword } = adminUser;
        console.log("자동 로그인 성공:", userWithoutPassword);
        
        // 세션 쿠키 수동 설정
        res.cookie('connect.sid', req.sessionID, {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
        });
        
        return res.json(userWithoutPassword);
      });
      return;
    }
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    
    // 비밀번호 필드 제외하고 응답
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
  
  // 인증 필요한 API에 대한 미들웨어
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    next();
  };
  
  // 코치 권한 필요한 API에 대한 미들웨어
  const requireCoach = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    
    const user = req.user as SelectUser;
    if (!user.isCoach) {
      return res.status(403).json({ message: "코치 권한이 필요합니다." });
    }
    
    next();
  };
  
  // 해당 미들웨어를 export 해서 routes.ts에서 사용할 수 있게 함
  
  // 일반 회원가입 엔드포인트
  app.post("/api/auth/register", async (req, res) => {
    // ... existing code ...
  });

  // 코치 회원가입 엔드포인트
  app.post("/api/auth/coach-register", async (req, res) => {
    try {
      // 필수 필드 확인
      const { email, username, password, fullName, licenseNumber } = req.body;
      
      if (!email || !username || !password || !fullName || !licenseNumber) {
        return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
      }
      
      // 기존 유저 확인
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "이미 사용 중인 아이디입니다." });
      }
      
      // 유저 생성
      const user = await storage.createUser({
        username,
        email,
        password, // 실제 배포에서는 비밀번호 해싱 필요
        fullName,
        phone: req.body.phoneNumber || null,
        profileImage: null,
        bio: req.body.bio || null,
        isCoach: true, // 코치로 설정
        isAdmin: false,
        socialProvider: null,
        socialId: null
      });
      
      // 코치 정보 생성
      await storage.createCoach({
        userId: user.id,
        specializations: req.body.specializations || [],
        experience: req.body.experience || null,
        certifications: req.body.licenseNumber || null,
        location: req.body.location || "미지정",
        hourlyRate: 50000, // 기본 레이트
        rating: null,
        reviewCount: null
      });
      
      res.status(201).json({
        message: "코치 가입이 신청되었습니다. 관리자 검토 후 승인됩니다.",
        userId: user.id
      });
    } catch (error) {
      console.error("코치 회원가입 에러:", error);
      res.status(500).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
    }
  });

  // 프로필 정보 업데이트 API - 소셜 로그인 이후 프로필 완성에 사용됨
  app.put("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    
    try {
      const userId = req.user.id;
      const { username, phone, fullName } = req.body;
      
      // 사용자명 중복 검사 (자신 제외)
      if (username && username !== req.user.username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "이미 사용 중인 아이디입니다." });
        }
      }
      
      // 필수 필드 검증 (소셜 로그인 사용자의 경우)
      if (req.user.socialProvider && (!username || !phone)) {
        return res.status(400).json({ 
          message: "소셜 로그인 사용자는 아이디와 휴대폰 번호를 반드시 입력해야 합니다." 
        });
      }
      
      // 사용자 정보 업데이트
      const updatedUser = await storage.updateUser(userId, {
        ...(username && { username }),
        ...(phone && { phone }),
        ...(fullName && { fullName }),
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
      
      // 비밀번호 제외하고 응답
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("프로필 업데이트 에러:", error);
      res.status(500).json({ message: "프로필 업데이트에 실패했습니다." });
    }
  });

  // 로그아웃 API
  app.post("/api/auth/logout", (req, res, next) => {
    // ... existing code ...
  });

  return { requireAuth, requireCoach };
}