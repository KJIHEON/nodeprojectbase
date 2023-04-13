//디비 만들기 폴더
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
//데이터베이스 옵션
const createDBOptions = {
    username : process.env.DATABASE_USERNAME || 'root',
    password : process.env.DATABASE_PASSWORD || 'root',
    host : process.env.DATABASE_HOST || 3306,
    dialect : process.env.DATABASE_DIALECT,
}
console.log(createDBOptions)
//DB_NAME 없을시 new DateBase 생성
let db_name = process.env.DATABASE_NAME || 'devdatabase';
//시퀄라이즈 생성 메서드
const dbCreateSequelize = new Sequelize(createDBOptions);

console.log(`======Create DataBase : ${db_name}======`);
//데이터베이스 생성 메서드
dbCreateSequelize
  .getQueryInterface() //인스턴스 반환
  .createDatabase(db_name)
  .then(() => {
    console.log('✅db create success!');
  })
  .catch((e) => {
    console.log('❗️error in create db : ', e);
  });
