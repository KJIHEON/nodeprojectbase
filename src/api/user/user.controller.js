import Container from 'typedi';
import Service from './user.service';
import { UserAuthenticator } from '../../middlewares/Authenticator';
import JWTManager from '../../utils/JWTManager';

export default [
  /**
   * (POST) 유저 회원가입
   * --
   */
  {
    path: '/user',
    method: 'post',
    middleware: [],
    controller: async (req, res, next) => {
      try {
        const ServiceInstance = Container.get(Service);
        const data = await ServiceInstance.createUser(req.body);
        return res.status(200).json({
          status: 200,
          message: 'success',
          data,
        });
      } catch (e) {
        return res.status(200).json({
          status: 500,
          message: 'Server error',
          data: e.message,
        });
      }
    },
  },

  /**
   * (POST) 유저 로그인
   * --
   */
  {
    path: '/user/login',
    method: 'post',
    middleware: [],
    controller: async (req, res, next) => {
      try {
        const ServiceInstance = Container.get(Service);
        const data = await ServiceInstance.login(req.body);
        if (data) {
          const jwt = new JWTManager();
          const token = await jwt.createToken(data, `${24 * 30}h`);

          return res.status(200).json({
            status: 200,
            message: 'success',
            data: {
              ...data,
              token,
            },
          });
        } else {
          return res.status(200).json({
            status: 204,
            message: 'Not Found Data',
          });
        }
      } catch (e) {
        return res.status(200).json({
          status: 500,
          message: 'Server error',
          data: e.message,
        });
      }
    },
  },

  /**
   * (GET) 유저 단일 조회
   * --
   */
  {
    path: '/user/:user_id',
    method: 'get',
    middleware: [UserAuthenticator],
    controller: async (req, res, next) => {
      try {
        const { user_id } = req.params;
        const ServiceInstance = Container.get(Service);
        const data = await ServiceInstance.findOneUser(user_id);
        return res.status(200).json({
          status: 200,
          message: 'success',
          data,
        });
      } catch (e) {
        return res.status(200).json({
          status: 500,
          message: 'Server error',
          data: e.message,
        });
      }
    },
  },

  /**
   * (GET) 유저 전체 조회
   * --
   */
  {
    path: '/users',
    method: 'get',
    middleware: [],
    controller: async (req, res, next) => {
      try {
        const ServiceInstance = Container.get(Service);
        const data = await ServiceInstance.findAllUser();
        return res.status(200).json({
          status: 200,
          message: 'success',
          data,
        });
      } catch (e) {
        return res.status(200).json({
          status: 500,
          message: 'Server error',
          data: e.message,
        });
      }
    },
  },

  /**
   * (PUT) 유저 정보 수정
   * --
   */
  {
    path: '/user/:user_id',
    method: 'put',
    middleware: [],
    controller: async (req, res, next) => {
      try {
        const { user_id } = req.params;
        const ServiceInstance = Container.get(Service);
        const data = await ServiceInstance.updateUser(user_id, req.body);
        return res.status(200).json({
          status: 200,
          message: 'success',
          data,
        });
      } catch (e) {
        return res.status(200).json({
          status: 500,
          message: 'Server error',
          data: e.message,
        });
      }
    },
  },

  /**
   * (DELETE) 유저 삭제
   * --
   */
  {
    path: '/user/:user_id',
    method: 'delete',
    middleware: [],
    controller: async (req, res, next) => {
      try {
        const { user_id } = req.params;
        const ServiceInstance = Container.get(Service);
        const data = await ServiceInstance.deleteUser(user_id);
        return res.status(200).json({
          status: 200,
          message: 'success',
          data,
        });
      } catch (e) {
        return res.status(200).json({
          status: 500,
          message: 'Server error',
          data: e.message,
        });
      }
    },
  },
];
