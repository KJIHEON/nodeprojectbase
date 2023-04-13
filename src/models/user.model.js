'use strict';
module.exports = (sequelize, DataTypes) => {
    const moment = require('moment');
    const user = sequelize.define(
        /* model name */
        'user',
        /* Properties */
        {
            user_idx :{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            admin_id: {
                type: DataTypes.STRING(40),
                notNull: true,
                /* commnent 쿼리문 조회 */
                comment: '',
            },
            password: {
                type: DataTypes.STRING(50),
                notNull: false,
                comment: '',
            },
            reg_date: {
              type: 'TIMESTAMP',
              defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
              notNull: false,
              comment: '',
            },
        },
        /* options */
        {
            tableName:'user', /* 데이터베이스의 테이블 이름. */
            charset: "utf8", // 한국어 설정
            collate: "utf8_general_ci", // 한국어 설정
            freezeTableName : false,/* true 전역으로 테이블 이름이 모델과 같게됨 */
            underscored: true,/* true시 camel case를 snake case로 바꿈 createdAt => created_at */
            timestamps: false, /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */
            hooks: {
                beforeCreate: (rec, opt) => {
                rec.dataValues.reg_date = moment().format('YYYY-MM-DD HH:mm:ss');
                },
                /* 생성전이나 생성후 함수 실행 할 때
                    afterCreate 생성후 실행, beforeCreate 생성전 실행 
                */
            },
        }
    );

    /* asoociate */
    user.associate = (models) => {
        user.hasMany(models.post, {
            foreignKey: 'user_idx',
            sourceKey: 'user_idx',
          });
        //   user.belongsTo(models.teams, {
        //     // foreignKey: 'department_idx',
        //     // sourceKey: 'department_idx',
        //   });

    }
        return user
}
