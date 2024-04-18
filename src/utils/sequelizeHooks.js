/**
 * 시퀄라이즈 훅 Class
 * --
 *
 */
module.exports = class Hooks {
  constructor() {}
  /**
   * 유닉스 타임으로 함수
   * --
   *  */
  unixTime(dateObj) {
    const timezoneOffset = new Date().getTimezoneOffset();
    // 오프셋 값이 0인 경우, 영국 시간대로 간주
    if (timezoneOffset === 0) {
      //영국(한국 - 9)
      if (!dateObj) return Math.trunc(new Date() / 1000);
      else return Math.trunc(new Date(dateObj) / 1000);
    } else {
      //한국(영국 + 9)
      if (!dateObj) return Math.trunc(new Date() / 1000);
      else return Math.trunc(new Date(dateObj) / 1000);
    }
  }
  /**
   * 날짜 데이터 포맷 템플릿
   * --
   */
  formattedDate(dateObj) {
    const date = new Date(dateObj * 1000);
    return date;
  }

  /**
   * 날짜 필드따라 유닉스 변환 함수
   * --
   * @param {*} rec : 데이터 객체
   * @param {*} field - 컬럼명
   */
  processDataField(rec, field) {
    if (typeof rec[field] === 'string') {
      rec.setDataValue(field, this.unixTime(rec[field]));
    }
  }

  /**
   * 쿼리 생성 함수
   * --
   * @param {*} data {key:value ...}: 쿼리 생설 아이템
   */
  queryBuilder(data) {
    const queryObject = {};
    const keyQueryCheck = ['start_date', 'created_at'];
    for (const key in data) {
      if (data[key]) {
        if (
          data[key] === 'null' ||
          data[key] === undefined ||
          data[key] === 'undefined' ||
          data[key] === null
        )
          return;
        if (keyQueryCheck.includes(key)) {
          const today = new Date(data[key]);
          const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
            today.getHours()
          );
          const lastDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
            today.getHours() + 23,
            today.getMinutes() + 59,
            today.getSeconds() + 59
          );
          const firstDayOfMonthUnix = firstDayOfMonth / 1000;
          const lastDayOfMonthUnix = lastDayOfMonth / 1000;
          queryObject[key] = {
            [Sequelize.Op.between]: [firstDayOfMonthUnix, lastDayOfMonthUnix],
          };
        } else {
          queryObject[key] = data[key];
        }
      }
    }

    return queryObject;
  }
  /**
   * 데이터 생성시 실행 되는 훅(bulk)
   * --
   */
  createdBulkDate(rec, type) {
    switch (type) {
      case 'schedule':
      case 'calculate':
        rec?.forEach((scheduleItem) => {
          this.processDataField(scheduleItem, 'start_date');
          this.processDataField(scheduleItem, 'end_date');
          scheduleItem.created_at = this.unixTime();
          scheduleItem.updated_at = this.unixTime();
        });
        break;
    }
  }

  /**
   * 데이터 생성 유닉스 변환 훅
   * --
   */
  createdDate(rec) {
    rec.created_at = this.unixTime();
    rec.updated_at = this.unixTime();
    this.processDataField(rec, 'start_date');
    this.processDataField(rec, 'end_date');
    this.processDataField(rec, 'birthday');
  }
  /**
   * 수정시 실행 되는 훅
   * --
   */
  updatedDate(rec, type) {
    switch (type) {
      case undefined:
        rec.setDataValue('updated_at', Hooks.unixTime());
        break;

      case 'user':
        rec.setDataValue('updated_at', Hooks.unixTime());
        rec.setDataValue('birthday', Hooks.unixTime(rec.birthday));
        break;
    }
  }
  /**
   * 날짜 조회 데이터 포맷 함수
   * --
   */
  changeDate(rec, type) {
    if (Array.isArray(rec)) {
      /* 배열(전체조회) */
      if (type == undefined) {
        return rec.map((x) => {
          x.created_at = this.formattedDate(x?.created_at);
          x.updated_at = this.formattedDate(x?.updated_at);
          return x;
        });
      }
    } else {
      /* 객체(단일조회) */
      if (type == undefined) {
        rec.created_at = this.formattedDate(rec?.created_at);
        rec.updated_at = this.formattedDate(rec?.updated_at);
        return rec;
      }
    }
  }
};
