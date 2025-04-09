import express, { Express, Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import createMemoryStore from "memorystore";
import { createServer } from "http";

// 환경 설정 로깅
const isProduction = process.env.NODE_ENV === "production";
// 개발 환경으로 강제 설정
const forceDevelopment = true;
const effectiveProduction = forceDevelopment ? false : isProduction;

log(`환경 설정: 개발 모드=${!effectiveProduction}`);

const app: Express = express();
const server = createServer(app);

// CORS 설정 추가 (도메인 간 인증을 위한 설정) - Replit 환경에서는 모든 출처 허용
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// 쿠키 파서 추가
app.use(cookieParser());

// 세션 미들웨어 설정
const MemoryStore = createMemoryStore(session);
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // 24시간마다 만료된 세션 정리
    }),
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // HTTP에서 쿠키가 작동하도록 항상 false로 설정
      sameSite: "lax", // 크로스 사이트 요청에서도 쿠키 전송 허용
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      path: "/",
      domain: undefined,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 4000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 4000;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
