import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import model  from './models'
import { routes } from './api'
import { stream } from './utill/winston'
import { logger } from './utill/winston'
dotenv.config()
// console.log(model)
const app = express()

const port = 3000
app.set('port',port)

//데이터 베이스 연결
model.sequelize
  .sync({ force: false }) // true 로 설정 시 서버 실행 시마다 테이블 재생성
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(err => {
    console.error('ERR~~', err);
  })

app.use(express.json())
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

/* routes */
routes.forEach((route)=>{
  app[route.method](
    `${route.path}`,
    [...route.middleware],
    route.controller
  )
})

app.listen(app.get('port'),()=>{
  console.log(`${app.get('port')}로 실행중`)
}).on('error',err => {
  console.log('Error message ' + err);
})
/*  */
app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  if (err) {
    /* 스웨거 저장 부분 */
    logger.error(`[Global error handler] Error: ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(errMessageColor, '----------------------------------------');
      console.log('Error Message: \x1b[33m%s\x1b[0m', err.message);
      console.log(errMessageColor, '----------------------------------------');
      
    
      //에러메시지 전체보기를 하려면 아래코드 주석해제 
      // console.log('Error : ', err);
    }
  }
  // res.status(err.status || 500);
  res.status(err.status || 500).send({
    status: err.status || 500,
    error: err.message,
  });
});
 

// error handler
