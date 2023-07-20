import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default class Authenticator {
  /* 토큰 생성  */
  async createToken(data, expiresIn) {
    return JWT.sign(data, process.env.JWTSECRETKEY, { expiresIn });
  }
  /* 토큰 검증 */
  async verify(token) {
    try {
      const decode = JWT.verify(token, process.env.JWTSECRETKEY);
      if (decode) return decode;
      else return false;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
