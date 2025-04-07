import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import cookieParser from "cookie-parser";

// 환경 설정 로깅
const isProduction = process.env.NODE_ENV === 'production';
console.log('환경 설정:', { 
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction,
  SESSION_SECRET: process.env.SESSION_SECRET ? '[설정됨]' : '[설정안됨]'
});

const app = express();

// CORS 설정 추가 (도메인 간 인증을 위한 설정)
const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, origin?: boolean | string) => void) {
    // 허용할 도메인 목록
    const allowedOrigins = [
      'https://chukgo.kr',
      'https://www.chukgo.kr',
      'https://soccer-forland-bikekim0527.replit.app',
      'https://e86b4446-0b3c-4054-bc06-598b63fcc248-00-1ju27h41dvhaj.spock.replit.dev'
    ];
    
    // origin이 없는 경우 (같은 도메인) 또는 허용된 도메인이면 허용
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS 거부된 도메인:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};
app.use(cors(corsOptions));

// 쿠키 파서 추가
app.use(cookieParser());

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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
