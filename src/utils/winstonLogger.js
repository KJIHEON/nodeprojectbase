import fs from 'fs';
import winston, { format } from 'winston';
import moment from 'moment';
import schedule from 'node-schedule';
import { uploadFile } from './S3FileUpload';
// import FcmManager from './FcmManager';
// import * as serviceAccount from '../config/firebase.config.json';
const { combine, label, printf } = format;

// const fcmManager = new FcmManager({
//   credential: serviceAccount,
//   databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
// });

const S3_LOG = process.env.S3_LOG === 'true' ? true : false;
/**
 * 오늘날짜 조회
 * --
 */
const getToday = () => {
  // const d = new Date();
  const d = moment();
  const dd = {
    year: `${d.year()}`,
    month: d.month() + 1 < 10 ? `0${d.month() + 1}` : `${d.month() + 1}`,
    day: d.date() < 10 ? `0${d.date()}` : `${d.date()}`,
  };
  const yd = d.clone().subtract(1, 'day').startOf('day');
  const ydd = {
    yesterDayYear: yd.format('YYYY'),
    yesterDayMonth: yd.format('MM'),
    yesterDay: yd.format('DD'),
  };
  return {
    ...dd,
    date: `${dd.year}${dd.month}${dd.day}`,
    ...ydd,
  };
};
let today = getToday();
let todayLog = null;

/**
 * 디렉터리정보 조회
 * --
 */
const getDirPath = () => {
  const td = getToday();
  const { year, month, day, yesterDayYear, yesterDayMonth, yesterDay } = td;
  today = { ...td };

  // Root Dir
  const rootDir = __dirname;
  // 로그폴더
  const logFolderDir = `${rootDir}/../../logs`;
  // 연
  const logYearDir = `${logFolderDir}/${year}`;
  // 월
  const logMonthDir = `${logYearDir}/${month}`;
  // 월
  // const logDayDir = `${logMonthDir}/${day}`;

  // 전날 연
  const logYesterDayYearDir = `${logFolderDir}/${yesterDayYear}`;
  // 전날 월
  const logYesterDayMonthDir = `${logYearDir}/${yesterDayMonth}`;
  // 전날 월
  // const logDayDir = `${logMonthDir}/${day}`;

  return {
    rootDir,
    logFolderDir,
    logYearDir,
    logMonthDir,
    logYesterDayYearDir,
    logYesterDayMonthDir,
    // logDayDir,
  };
};

/**
 * 로그패스 생성
 * --
 */
const createLogDir = () => {
  const { logFolderDir, logYearDir, logMonthDir, logDayDir } = getDirPath();

  const logDir = __dirname + '/../logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  // 연 - 폴더생성
  if (!fs.existsSync(logYearDir)) {
    fs.mkdirSync(logYearDir);
  }
  // 월 - 폴더생성
  if (!fs.existsSync(logMonthDir)) {
    fs.mkdirSync(logMonthDir);
  }
  // 일 - 폴더생성
  // if (!fs.existsSync(logDayDir)) {
  //   fs.mkdirSync(logDayDir);
  // }
};

/**
 *  로그 포멧 생성
 * --
 */
const myFormat = printf((info) => {
  const { level, label, message } = info;
  const infoMessage = level === 'info' ? JSON.parse(message) : { message };
  const logMessage = {
    label,
    level,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    ...infoMessage,
  };
  return JSON.stringify(logMessage);
});
/**
 * 로그파일 생성 옵션
 * --
 */
const fileOption = () => {
  // const { logDayDir } = getDirPath();
  const { logMonthDir } = getDirPath();
  return {
    // dirname: logDayDir,
    dirname: logMonthDir,
    json: true,
    // maxsize: 5242880, // 5MB
    // maxFiles: 5,
    // colorize: false,
    format: combine(
      label({ label: 'BRAINHEAL' }),
      myFormat // log 출력 포맷
    ),
  };
};

//파이어 베이스
// const infoTransport = saveFirebase
//   ? fcmManager
//   : new winston.transports.File({
//       filename: `combined_${getToday().day}.log`,
//       level: 'info',
//       ...fileOption(),
//     });

// const logger = new winston.createLogger({
//   transports: [infoTransport, errorTransport],
// });

/**
 * 로그 인스턴스 생성
 * --
 */
const createLoggerForDay = () => {
  const infoTransport = new winston.transports.File({
    filename: `combined_${getToday().day}.log`,
    level: 'info',
    ...fileOption(),
  });
  const errorTransport = new winston.transports.File({
    filename: `error_${getToday().day}.log`,
    level: 'error',
    ...fileOption(),
  });
  const logger = new winston.createLogger({
    transports: [infoTransport, errorTransport],
  });
  return logger;
};
// 초기 로거 인스턴스 생성
let logger = createLoggerForDay();

const stream = {
  write: (message) => {
    const d = getToday();
    // 날짜가 바꼈을 때
    const isLogging = process.env.INFO_LOG === 'true' ? true : false;
    if (isLogging) {
      if (!todayLog || today.date !== d.date) {
        console.log('날짜 바뀜', todayLog, today.date, d.date);
        createLogDir();
        logger = createLoggerForDay();
        today = { ...d };
        todayLog = d.date;
        // console.log('message: ', message.level);
      }
      logger = createLoggerForDay();
      logger.info(message);
    }
  },
};

/**
 * 모건 포멧
 * @param {*} tokens
 * @param {*} req
 * @param {*} res
 * @param {*} responseData
 * @returns
 */
const createMorganFormat = (tokens, req, res, responseData) => {
  const status = responseData?.status;
  const logData = {
    originalUrl: tokens.url(req, res),
    method: tokens.method(req, res),
    statusCode: status,
    context: req.protocol,
    ip: tokens['remote-addr'](req, res),
    userAgent: tokens['user-agent'](req, res),
    logVersion: 'V1',
    times: tokens['response-time'](req, res) + 'ms',
  };
  return logData;
};
//로그 파일 S3저장
const projectName = 'TEST';

S3_LOG &&
  /**
   * 로그 버킷 업로드 스케줄
   * 매일 00시 10분에 업로드 후 전날 로그 삭제
   * --
   */
  schedule.scheduleJob(
    { hour: 0, minute: 10, second: 0, tz: 'Asia/Seoul' },
    async () => {
      try {
        const ydd = getToday();
        const { yesterDayYear, yesterDayMonth, yesterDay, day } = ydd;
        const { logYesterDayMonthDir, logMonthDir } = getDirPath();
        const yesterDayInfoFilePath =
          logYesterDayMonthDir + `/combined_${yesterDay}.log`;
        const yesterDayErrorFilePath =
          logYesterDayMonthDir + `/error_${yesterDay}.log`;
        //어제 파일 있는지 확인 없으면 저장안하고 있으면 S3에 저장
        if (fs.existsSync(yesterDayInfoFilePath)) {
          const infoFileBuffer = fs.readFileSync(yesterDayInfoFilePath);
          const fileName = `logs/${projectName}/${yesterDayYear}/${yesterDayMonth}/combined_${yesterDay}.log`;
          const result = await uploadFile(infoFileBuffer, fileName);
          if (result === 200) {
            console.log(yesterDayInfoFilePath, result);
            fs.unlinkSync(yesterDayInfoFilePath);
          }
        }
        if (fs.existsSync(yesterDayErrorFilePath)) {
          const errorFileBuffer = fs.readFileSync(yesterDayErrorFilePath);
          const fileName = `logs/${projectName}/${yesterDayYear}/${yesterDayMonth}/error_${yesterDay}.log`;
          const result = await uploadFile(errorFileBuffer, fileName);
          if (result === 200) {
            console.log(yesterDayErrorFilePath, result);
            fs.unlinkSync(yesterDayErrorFilePath);
          }
        }
        //금일 로그 파일 확인 없으면 생성 로직
        const todayInfoLogPath = logMonthDir + `/combined_${day}.log`;
        const todayErrorLogPath = logMonthDir + `/error_${day}.log`;
        if (!fs.existsSync(todayInfoLogPath)) {
          console.log(
            `${todayInfoLogPath} 파일이 존재하지 않습니다. 파일을 생성합니다.`
          );
          fs.unlinkSync(todayInfoLogPath);
        }

        if (!fs.existsSync(todayErrorLogPath)) {
          console.log(
            `${todayErrorLogPath} 파일이 존재하지 않습니다. 파일을 생성합니다.`
          );
          fs.unlinkSync(todayErrorLogPath);
        }
      } catch (e) {
        console.log(e.message);
        return e;
      }
    }
  );

export { logger, stream, createMorganFormat };
