declare module 'passport-naver' {
  import { Strategy } from 'passport';
  
  export interface NaverStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback?: boolean;
  }

  export interface NaverProfile {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    _json?: {
      email?: string;
      nickname?: string;
      profile_image?: string;
      age?: string;
      birthday?: string;
      gender?: string;
    };
  }

  export class Strategy extends Strategy {
    constructor(
      options: NaverStrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: NaverProfile,
        done: (error: any, user?: any, info?: any) => void
      ) => void
    );
    name: string;
  }
} 