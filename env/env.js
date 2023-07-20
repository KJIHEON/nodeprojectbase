import path from 'path';
import dotenv from 'dotenv';

// 단일 엔트리 지점으로 환경변수 설정
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '.env.production') });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '.env.development') });
} else {
  // throw new Error('process.env.NODE_ENV is undefined');
  dotenv.config({ path: path.join(__dirname, '.env.local') });
}
