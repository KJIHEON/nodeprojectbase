import models from '../../models';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Hooks from '../../utils/sequelizeHooks';
import { logger } from '../../utils/winstonLogger';
dotenv.config();

export default class ApiService {
  constructor() {}

  /**
   * (POST) 유저 회원가입
   * --
   */
  async createUser(body) {
    try {
      /* 패스워드 암호화 */
      body.password = await bcrypt.hash(
        body.password,
        parseInt(process.env.SALT)
      );
      return await models.user.create(body);
    } catch (e) {
      logger.error(`[user][createUser] Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * (POST) 유저 로그인
   * --
   */
  async login(body) {
    try {
      const { user_account, password } = body;
      const data = await models.user.findOne({ where: { user_account } });
      /* 패스워트 검사 */
      const passwordCompare = bcrypt.compareSync(
        password,
        data.dataValues.password
      );
      if (passwordCompare) {
        delete data.dataValues.password;
        return {
          ...data.dataValues,
        };
      } else return null;
    } catch (e) {
      logger.error(`[user][login] Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * (GET) 유저 단일 조회
   * --
   */
  async findOneUser(user_id) {
    try {
      const hooks = new Hooks();
      const data = await models.user.findOne({
        where: { user_id },
        attributes: { exclude: ['password'] },
      });
      return hooks.changeDate(data, 'user');
    } catch (e) {
      logger.error(`[user][findOneUser] Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * (GET) 유저 전체 조회
   * --
   */
  async findAllUser() {
    try {
      const hooks = new Hooks();
      const data = await models.user.findAll({
        attributes: { exclude: ['password'] },
      });
      return hooks.changeDate(data, 'user');
    } catch (e) {
      logger.error(`[user][findAllUser] Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * (PUT) 유저 정보 수정
   * --
   */
  async updateUser(user_id, body) {
    try {
      if (body.password) {
        body.password = await bcrypt.hash(
          body.password,
          parseInt(process.env.SALT)
        );
      }
      return await models.user.update(body, {
        where: { user_id },
        individualHooks: true,
      });
    } catch (e) {
      logger.error(`[user][updateUser] Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * (DELETE) 유저 삭제
   * --
   */
  async deleteUser(user_id) {
    try {
      return await models.user.destroy({ where: { user_id } });
    } catch (e) {
      logger.error(`[user][deleteUser] Error: ${e.message}`);
      throw e;
    }
  }
}
