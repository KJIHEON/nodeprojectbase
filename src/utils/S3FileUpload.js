// s3 접근하기 위해 불러옴
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
// //.env 네이버 정보 읽어오기
const type = process.env.S3_TYPE === 'NAVER' ? true : false;
console.log(type ? '네이버' : '아마존');
const AccessKey = type
  ? process.env.NAVER_ACCESS_KEY
  : process.env.AWS_ACCESS_KEY;

const SecretKey = type
  ? process.env.NAVER_SECRET_KEY
  : process.env.AWS_SECRET_KEY;

const Bucket = type
  ? process.env.NAVER_BUCKET_NAME
  : process.env.AWS_BUCKET_NAME;

const BucketRegion = type
  ? process.env.NAVER_BUCKET_REGION
  : process.env.AWS_BUCKET_REGION;
const Endpoint = type ? process.env.NAVER_BUCKET_ENDPOINT : null;

const s3 = type
  ? new S3Client({
      credentials: {
        accessKeyId: AccessKey,
        secretAccessKey: SecretKey,
      },
      region: BucketRegion,
      endpoint: Endpoint,
    })
  : new S3Client({
      credentials: {
        accessKeyId: AccessKey,
        secretAccessKey: SecretKey,
      },
      region: BucketRegion,
    });

/**
 * file 업로드
 * ---
 */
export const uploadFile = async (fileBuffer, fileName, mimetype) => {
  const uploadParams = type
    ? {
        Bucket: Bucket,
        Key: fileName,
        Body: fileBuffer,
        ACL: 'public-read', //권한
        ContentType: mimetype,
      }
    : {
        Bucket: Bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
      };
  // console.log('uploadParams', uploadParams);
  const res = await s3.send(new PutObjectCommand(uploadParams));
  return res.$metadata.httpStatusCode;
};
/**
 * file getFileObject blob 변환(O)
 * ---
 */
export const getFileObject = async (key) => {
  const params = {
    Bucket: Bucket,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  let bufferData = Buffer.from([]);
  response.Body.on('data', (chunk) => {
    bufferData = Buffer.concat([bufferData, chunk]);
  });

  // response.Body의 데이터를 모두 읽을 때까지 대기합니다.
  await new Promise((resolve) => {
    response.Body.on('end', () => {
      resolve();
    });
  });
  // console.log(bufferData, 'bufferData');
  // console.log(response.ContentType);
  return bufferData;
};
/**
 * file 배열 업로드(x)
 * ---
 */
export const uploadFiles = async (fileBuffer, fileName, mimetype) => {
  const uploadParams = {
    Bucket: Bucket,
    Key: fileName,
    Body: fileBuffer,
    ACL: 'public-read', //권한
    ContentType: mimetype,
  };
  // console.log('uploadParams', uploadParams);
};
