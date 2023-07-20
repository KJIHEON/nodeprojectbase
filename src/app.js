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
import errorhandler from 'errorhandler';
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
import { logger, stream } from './utils/winstonLogger';

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
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
    credentials: true, // enable set cookie
  })
);
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

app.use(morgan('combined', { stream }));

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

// app.get(
//   '*',
//   wrapAsync(async function (req, res) {
//     await new Promise((resolve) => setTimeout(() => resolve(), 50));
//     // 비동기 에러
//     throw new Error('에러 발생!');
//   })
// );

// app.use(function (err, req, res, next) {
//   logger.error(`[Global error handler] Error: ${err.message}`);
//   console.log(errMessageColor, '----------------------------------------');
//   console.log('Error Message: \x1b[33m%s\x1b[0m', err.message);
//   console.log(errMessageColor, '----------------------------------------');
//   res.json({ status: err.status, message: err.message });
// });

// function wrapAsync(fn) {
//   return function (req, res, next) {
//     // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달
//     // (이 경우에는 오류 처리기)
//     fn(req, res, next).catch(next);
//   };
// }

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
