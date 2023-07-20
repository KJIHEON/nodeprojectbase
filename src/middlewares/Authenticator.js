import JWTManager from '../utils/JWTManager';

/**
 * 관리자 인증
 * --
 *  */
export const AdminAuthenticator = async (req, res, next) => {
  OriginAuthenticator(req, res, next, 'admin');
};
/**
 * 기관 인증
 * --
 *  */
export const AgencyAuthenticator = async (req, res, next) => {
  OriginAuthenticator(req, res, next, 'agency');
};
/**
 * 강사 인증
 * --
 *  */
export const TeacherAuthenticator = async (req, res, next) => {
  OriginAuthenticator(req, res, next, 'teacher');
};
/**
 * 유저 인증
 * --
 *  */
export const UserAuthenticator = async (req, res, next) => {
  OriginAuthenticator(req, res, next, 'user');
};
/**
 * 토큰 인증
 * --
 *  */
export const AuthAuthenticator = async (req, res, next) => {
  OriginAuthenticator(req, res, next, 'auth');
};

/**
 * 통합 검증
 * --
 *  */
const OriginAuthenticator = async (req, res, next, type) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(200).json({
        status: 401,
        message: 'accece denied',
      });
    }
    const tokentype = authorization.split(' ')[0];
    const token = authorization.split(' ')[1];
    if (tokentype !== 'Bearer') {
      return res.status(200).json({
        status: 401,
        message: 'accece denied',
      });
    }
    // const token = authorization.split("Bearer ")[1]
    const jwt = new JWTManager();
    const { status, data } = await jwt.verify(token);
    req.userInfo = data;
    // console.log(data, '검증 데이터');
    if (status) {
      if (type == 'auth') {
        next();
      } else {
        if (type == 'admin' && data.admin_id !== undefined) {
          next();
        } else if (
          type == 'teacher' &&
          (data.user_id !== undefined ||
            data.admin_id !== undefined ||
            data.agency_id !== undefined)
        ) {
          next();
        } else if (
          type == 'agency' &&
          (data.agency_id !== undefined || data.admin_id !== undefined)
        ) {
          next();
        } else if (
          type == 'user' &&
          (data.user_id !== undefined ||
            data.admin_id !== undefined ||
            data.agency_id !== undefined)
        ) {
          next();
        } else {
          return res.status(200).json({
            status: 401,
            message: 'accece denied',
          });
        }
      }
    } else {
      return res.status(200).json({
        status: 401,
        message: 'accece denied',
      });
    }
  } catch (e) {
    return res.status(500).json({
      resultMessage: 'Server error',
    });
  }
};
