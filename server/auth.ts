import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
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
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "soccer-coach-finder-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  };

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
        
        // 개발 환경에서는 비밀번호 일치 여부만 확인
        // 실제 환경에서는 해싱된 비밀번호 비교 필요
        const passwordMatch = user.password === password;
        console.log("Password match:", passwordMatch, "Expected:", user.password, "Received:", password);
        //const passwordMatch = await comparePasswords(password, user.password);
        
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
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "로그아웃 성공" });
    });
  });

  app.get("/api/user", (req, res) => {
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
  return { requireAuth, requireCoach };
}