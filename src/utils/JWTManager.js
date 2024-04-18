import JWT from 'jsonwebtoken';

export default class JWTManager {
  constructor() {}

  /* 토큰 생성 */
  async createToken(data, expiresIn) {
    return JWT.sign(data, process.env.SECRET, { expiresIn });
  }

  /* 토큰 검증 */
  async verify(token) {
    try {
      const decode = JWT.verify(token, process.env.SECRET);
      if (decode) return { status: true, data: decode };
      else return false;
    } catch (e) {
      return false;
    }
  }
}
