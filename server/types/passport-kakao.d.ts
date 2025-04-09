declare module 'passport-kakao' {
  import { Strategy } from 'passport';
  
  export interface KakaoStrategyOptions {
    clientID: string;
    clientSecret?: string;
    callbackURL: string;
    passReqToCallback?: boolean;
  }

  export interface KakaoProfile {
    id: number;
    username: string;
    displayName: string;
    _json: {
      id: number;
      properties: {
        nickname: string;
        profile_image?: string;
        thumbnail_image?: string;
      };
      kakao_account?: {
        email?: string;
        profile?: {
          nickname: string;
          profile_image_url?: string;
        };
      };
    };
  }

  export class Strategy extends Strategy {
    constructor(
      options: KakaoStrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: KakaoProfile,
        done: (error: any, user?: any, info?: any) => void
      ) => void
    );
    name: string;
  }
} 