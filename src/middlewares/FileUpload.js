import multer from 'multer';
import { uploadFile } from '../utils/S3FileUpload';

// multer는 미들웨어 형태로 구동된다
// 프로미스 객체 생성하여 직접 구현
// 참고 : https://github.com/vercel/next.js/discussions/37886
//reject :에러 객체시 프로미스 거부
//result :에러 객체 아닐시 프로미스 이행 후 함수 반환
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

/**
 * multer 업로드 함수
 * ---
 */
export async function handler(req, res, next) {
  // console.log('들어가기전');
  if (req.method === 'POST' || req.method === 'PUT') {
    // 메모리 스토리지 엔진
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    try {
      // // 파라미터로 들어가는 텍스트(image)는
      // // req에서 이미지 파일 첨부한 key와 동일하게 맞춰야한다.
      await runMiddleware(req, res, upload.single('file'));
      const fileBuffer = req.file.buffer;
      const fileName = req.body.name; //키값
      const fileType = req.file.mimetype;
      if (fileType.startsWith('image/')) {
        // 이미지 파일 업로드 로직 실행
        await uploadFile(fileBuffer, fileName, fileType);
      } else if (fileType.startsWith('application/')) {
        // PDF 파일 업로드 로직 실행
        await uploadFile(fileBuffer, fileName, fileType);
      } else if (fileType.startsWith('text/')) {
        await uploadFile(fileBuffer, fileName, fileType);
      } else {
        // 지원하지 않는 파일 형식
        return res.status(200).json({
          resultMessage: 'Unsupported file type',
        });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        resultMessage: 'Server error [FileUpload handler]',
      });
    }
  } else {
    return res.status(500).json({
      resultMessage: 'Method error [FileUpload handler] Not Post',
    });
  }
}
/**
 * multer 배열 업로드 함수
 * ---
 */
export async function multiplehandler(req, res, next) {
  // console.log('들어가기전');
  if (req.method === 'POST' || req.method === 'PUT') {
    const { type } = req.body;
    if (type === 'code') {
      next();
    } else {
      // 메모리 스토리지 엔진
      const storage = multer.memoryStorage();
      const upload = multer({ storage: storage });
      try {
        // // 파라미터로 들어가는 텍스트(image)는
        // // req에서 이미지 파일 첨부한 key와 동일하게 맞춰야한다.
        await runMiddleware(req, res, upload.array('file'));
        const filesList = req?.files;
        const files = filesList?.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        }));
        req.filesInfo = files;
        next();
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          resultMessage: 'Server error [FileUpload multiplehandler]',
        });
      }
    }
  } else {
    return res.status(500).json({
      resultMessage: 'Method error [FileUpload handler] Not Post',
    });
  }
}
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '4mb', // 업로드 이미지 용량 제한
  },
};
