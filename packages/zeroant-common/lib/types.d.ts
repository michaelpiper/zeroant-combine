import { type CurrentAdmin } from 'adminjs';
import { type opts as SessionOptions } from 'koa-session';
export type KoaAuthenticateFunction = (email: string, password: string) => Promise<CurrentAdmin | null>;
export interface KoaAuthOptions {
    authenticate: KoaAuthenticateFunction;
    sessionOptions?: Partial<SessionOptions>;
}
