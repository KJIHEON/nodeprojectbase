require('dotenv').config()
const dbconfig = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: process.env.DATABASE_DIALECT
}
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
module.exports = dbconfig;
