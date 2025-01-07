import { ironSession } from 'next-iron-session';
import { createHash } from 'crypto';
import { BasicAuthConfiguration, config } from 'libs/server/config';
import { Middleware, NextHandler } from 'next-connect';

const generateHash = (input: string): string => {
    return createHash('sha256')
        .update(input)
        .digest('hex');
};

const sessionOptions = () => ({
    cookieName: 'notea-auth',
    password: generateHash('noteax' + 
        (config().auth as BasicAuthConfiguration).username + 
        (config().auth as BasicAuthConfiguration).password),  // NOTE(tecc): in the future, if this field becomes null, it will be an issue
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
        secure: config().server.useSecureCookies,
    },
});

let _useSession: Middleware<any, any>;
export const useSession: Middleware<any, any> = (...args: [any, any, NextHandler]) => {
    _useSession ??= ironSession(sessionOptions());
    _useSession(...args);
};
