'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../env/database.config');
const db = {};
const isLogging =
  !process.env.DB_LOG || process.env.DB_LOG !== 'true' ? false : true;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    dialect: config.dialect,
    logging: isLogging,
    //connection pool
    pool: {
      //풀의 최대 연결 수
      max: 50,
      //풀의 최소 연결 수
      min: 0,
      //오류를 발생시키기 전에 풀에서 연결을 시도하는 최대 시간(밀리초)
      acquire: 60000,
      //연결이 해제되기 전에 유휴 상태로 있을 수 있는 최대 시간(밀리초)
      idle: 30000,
    },
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-9, -3) === '.model' &&
      file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // const model = sequelize['import'](path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
