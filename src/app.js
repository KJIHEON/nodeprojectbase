/**
 * app.js
 * --
 * 2023-04-07 @seongh7800
 */

import '../env/env';
import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
/* Swagger */
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './config/swaggerConfig';
/* Routes */
import { routes } from './api';
/* ORM */
import models from './models';
/* Loging */
import morgan from 'morgan';
import { logger, stream, createMorganFormat } from './utils/winstonLogger';
import { ALLOWED_DOMAIN } from './utils/constants';

/* ENV setup */
dotenv.config();
/* express setup */
const app = express();
/* log color setup */
const errMessageColor = '\x1b[33m%s\x1b[0m';
/* swagger setup */
const swaggerSpec = swaggerJSDoc(swaggerConfig());
app.disable('x-powered-by');
// CORS 허용
const prod = process.env.NODE_ENV == 'production';
if (prod) {
  app.use(
    cors({
      origin: ALLOWED_DOMAIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
      credentials: true, // enable set cookie
    })
  );
} else {
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
      credentials: true, // enable set cookie
    })
  );
}
/* 데이터 베이스 연결 */
// models.sequelize
//   .sync({ force: true }) // true 로 설정 시 서버 실행 시마다 테이블 재생성
//   .then(() => {
//     console.log('데이터베이스 연결 성공');
//   })
//   .catch((err) => {
//     console.error('ERR~~', err);
//   });

/**
 * HTTP Logging
 * --
 * 로깅옵션별 양식
  - combined 
  [:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"]
  - common 
  [:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]]
  - dev 
  [:method :url :status :response-time ms - :res[content-length]]
  - short
  [:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms]
  - tiny
  [:method :url :status :res[content-length] - :response-time ms]
 */
//SECTION: 로그 설정
let responseData;
// 미들웨어 설정
app.use((req, res, next) => {
  // res.json() 메서드를 오버라이드하여 응답 데이터를 기록
  const originalJson = res.json;
  res.json = function (data) {
    responseData = data;
    originalJson.call(this, data);
  };
  next();
});
app.use(
  morgan(
    (tokens, req, res) => {
      const morganFormat = createMorganFormat(tokens, req, res, responseData);
      return JSON.stringify(morganFormat);
    },
    { stream }
  )
);

//!SECTION
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(morgan('dev'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 스웨거 라우터 */
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Routes */
routes.forEach((route) => {
  app[route.method](
    `/api/v1${route.path}`,
    [...route.middleware],
    route.controller
  );
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err) {
    logger.error(`[Global error handler] Error: ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(errMessageColor, '----------------------------------------');
      console.log('Error Message: \x1b[33m%s\x1b[0m', err.message);
      console.log(errMessageColor, '----------------------------------------');

      /* 에러메시지 전체보기를 하려면 아래코드 주석해제 */
      // console.log('Error : ', err);
    }
  }
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    error: err,
  });
});

module.exports = app;
