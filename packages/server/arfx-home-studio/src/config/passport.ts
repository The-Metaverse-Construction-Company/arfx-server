import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import { jwtSecret } from './vars';
import * as authProviders from '../api/domain/services/authProviders';
import User from '../api/models/user.model';

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const JWTAuthHandler = async (payload: any, done: any = () => null) => {
  try {
    const user = await User.findById(payload.referenceId);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = (service: string) => async (token: string, done: any = () => null) => {
  try {
    //@ts-expect-error
    const userData = await authProviders[service](token);
    //@ts-expect-error
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
export const jwt = new JwtStrategy(jwtOptions, JWTAuthHandler);
export const facebook = new BearerStrategy(oAuth('facebook'));
export const google = new BearerStrategy(oAuth('google'));
