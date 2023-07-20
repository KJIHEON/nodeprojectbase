'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hooks = require('../utils/sequelizeHooks');
  const hooks = new Hooks();
  const user = sequelize.define(
    'user',
    /* Properties */
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_account: {
        type: DataTypes.STRING(45),
        notNull: false,
        comment: '',
      },
      password: {
        type: DataTypes.STRING(70),
        notNull: false,
        comment: '',
      },
      name: {
        type: DataTypes.STRING(10),
        notNull: false,
        comment: '',
      },
      gender: {
        type: DataTypes.CHAR(1),
        notNull: false,
        comment: '',
      },
      nickname: {
        type: DataTypes.STRING(45),
        notNull: false,
        comment: '',
      },
      email: {
        type: DataTypes.STRING(30),
        notNull: false,
        comment: '',
      },
      phone: {
        type: DataTypes.STRING(20),
        notNull: false,
        comment: '',
      },
      birthday: {
        type: DataTypes.INTEGER,
        notNull: false,
        comment: '',
      },
      job: {
        type: DataTypes.STRING(45),
        notNull: false,
        comment: '',
      },
      local_id: {
        type: DataTypes.INTEGER,
        notNull: false,
        comment: '',
      },
      city_id: {
        type: DataTypes.INTEGER,
        notNull: false,
        comment: '',
      },
      district_id: {
        type: DataTypes.INTEGER,
        notNull: false,
        comment: '',
      },
      address_detail: {
        type: DataTypes.STRING(50),
        notNull: false,
        comment: '',
      },
      recommender_id: {
        type: DataTypes.STRING(45),
        notNull: false,
        comment: '',
      },
      teacher_check: {
        type: DataTypes.CHAR(1),
        defaultValue: 'N',
        notNull: false,
        comment: '',
      },
      email_check: {
        type: DataTypes.CHAR(1),
        defaultValue: 'N',
        notNull: false,
        comment: '',
      },
      sms_check: {
        type: DataTypes.CHAR(1),
        defaultValue: 'N',
        notNull: false,
        comment: '',
      },
      created_at: {
        type: DataTypes.INTEGER,
        notNull: false,
        comment: '',
      },
      updated_at: {
        type: DataTypes.INTEGER,
        notNull: false,
        comment: '',
      },
    },
    /* options */
    {
      tableName: 'user',
      freezeTableName: false,
      underscored: true,
      timestamps: false,
      hooks: {
        /* 생성 전에 실행 */
        beforeCreate: (rec, options) => {
          hooks.createdDate(rec, 'user');
        },
        /* 업데이트 전에 실행 */
        beforeUpdate: (rec, options) => {
          hooks.updatedDate(rec, 'user');
        },
      },
    }
  );

  /* Relations */
  user.associate = (models) => {
    // user -< lecture_of_user
    //     user.hasMany(models.lecture_of_user, {
    //       foreignKey: 'user_id',
    //       sourceKey: 'user_id',
    //     });
    //     // user -< answer_exam
    //     //user -< district
    //     user.belongsTo(models.district, {
    //       foreignKey: 'district_id',
    //       sourceKey: 'district_id',
    //     });
  };

  return user;
};
