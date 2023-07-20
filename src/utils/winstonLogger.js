import fs from 'fs';
import winston, { format } from 'winston';
import moment from 'moment';

const { timestamp, combine, label, printf } = format;

/**
 * 오늘날짜 조회
 * --
 */
const getToday = () => {
  const d = new Date();
  const dd = {
    year: `${d.getFullYear()}`,
    month:
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`,
    day: d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`,
    timestamp: d.getTime() / 1000,
  };
  return {
    ...dd,
    date: `${dd.year}${dd.month}${dd.day}`,
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
  const { year, month, day } = td;
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
  const logDayDir = `${logMonthDir}/${day}`;

  return {
    rootDir,
    logFolderDir,
    logYearDir,
    logMonthDir,
    logDayDir,
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
  if (!fs.existsSync(logDayDir)) {
    fs.mkdirSync(logDayDir);
  }
}; // createLogDir()

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `{"timestamp": "${moment().format(
    'YYYY-MM-DD HH:mm:ss'
  )}", "Level": "${level}", "message": ${message}}`;
});

/**
 * 로그파일 생성 옵션
 * --
 */
const fileOption = () => {
  const { logDayDir } = getDirPath();
  return {
    dirname: logDayDir,
    json: true,
    // maxsize: 5242880, // 5MB
    // maxFiles: 5,
    // colorize: false,
    format: combine(
      label({ label: 'winston-test' }),
      timestamp(),
      myFormat // log 출력 포맷
    ),
  };
};

//
const infoTransport = new winston.transports.File({
  filename: `info.log`,
  level: 'info',
  ...fileOption(),
});

//
const errorTransport = new winston.transports.File({
  filename: 'error.log',
  level: 'error',
  ...fileOption(),
});

//
const logger = winston.createLogger({
  transports: [infoTransport, errorTransport],
  // format: combine(myFormat),
});

const stream = {
  write: (message) => {
    const d = getToday();

    // 날짜가 바꼈을 때
    if (!todayLog || today.date !== d.date) {
      createLogDir();
      today = { ...d };
      todayLog = d.date;
      // console.log('message: ', message.level);
    }
    logger.info(message);
  },
};

export { logger, stream };
