// s3 접근하기 위해 불러옴
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// presigned url 이용하기 위해 불러옴
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// //.env 네이버 정보 읽어오기
// const naverEndpoint = process.env.NAVER_BUCKET_ENDPOINT;
// const naverRegion = process.env.NAVER_BUCKET_REGION;
// const naverBucket = process.env.NAVER_BUCKET_NAME;
// const naverAccess_key = process.env.NAVER_ACCESS_KEY;
// const naverSecret_key = process.env.NAVER_SECRET_KEY;
/**
 * naver s3 클라이언트 연결
 * ----
 * */
// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: naverAccess_key,
//     secretAccessKey: naverSecret_key,
//   },
//   region: naverRegion,
//   endpoint: naverEndpoint,
// });

/**
 * Naver file 업로드
 * ---
 */
// export async function uploadFile(fileBuffer, fileName, mimetype) {
//   const uploadParams = {
//     Bucket: naverBucket,
//     Key: fileName,
//     Body: fileBuffer,
//     ACL: 'public-read', //권한
//     ContentType: mimetype,
//   };
//   console.log('uploadParams', uploadParams);

//   const res = await s3.send(new PutObjectCommand(uploadParams));
//   return res.$metadata.httpStatusCode;
// }

// //.env에서 aws 정보 읽어오기
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const awsS3Bucket = process.env.AWS_BUCKET_NAME;
const awsS3BucketRegion = process.env.AWS_BUCKET_REGION;

// aws s3 클라이언트 연결
const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
  region: awsS3BucketRegion,
});

// aws file 업로드
export async function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: awsS3Bucket,
    Key: fileName,
    Body: fileBuffer,
    // ACL: 'public-read', //권한
    ContentType: mimetype,
  };
  console.log('uploadParams', uploadParams);

  const res = await s3.send(new PutObjectCommand(uploadParams));
  return res.$metadata.httpStatusCode;
}

/**
 * file 배열 업로드(x)
 * ---
 */
export async function uploadFiles(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: Bucket,
    Key: fileName,
    Body: fileBuffer,
    ACL: 'public-read', //권한
    ContentType: mimetype,
  };
  console.log('uploadParams', uploadParams);

  // const res = await s3.send(new PutObjectCommand(uploadParams));
  // return res.$metadata.httpStatusCode;
}
/**
 * file signedUrl 가져오기(x)
 * ---
 */
export async function getSignedFileUrl(data) {
  const params = {
    Bucket: Bucket,
    Key: data.name,
  };
  const command = new PutObjectCommand(params);
  console.log(command);
  const url = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });
  console.log(url);
  return url;
}
