/**
 * 시퀄라이즈 훅 Class
 * --
 *
 */
module.exports = class Hooks {
  constructor() {}
  /**
   * 유닉스 타임으로 변환
   * --
   *  */
  static unixTime(dateObj) {
    const timezoneOffset = new Date().getTimezoneOffset();
    // 오프셋 값이 0인 경우, 영국 시간대로 간주
    if (timezoneOffset === 0) {
      if (!dateObj) return Math.trunc(new Date() / 1000);
      else return Math.trunc(new Date(dateObj) / 1000) - 9 * 60 * 60;
    } else {
      if (!dateObj) return Math.trunc(new Date() / 1000);
      else return Math.trunc(new Date(dateObj) / 1000);
    }
  }
  /**
   * 날짜 데이터 포맷 템플릿
   * --
   */
  static formattedDate(dateObj) {
    const date = new Date(dateObj);
    return date;
  }
  /**
   * 데이터 생성시 실행 되는 훅
   * --
   */
  createdDate(rec, type) {
    switch (type) {
      case undefined:
        rec.created_at = Hooks.unixTime();
        rec.updated_at = Hooks.unixTime();
        rec.setDataValue('created_at', Hooks.unixTime());
        rec.setDataValue('updated_at', Hooks.unixTime());
        break;
    }
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
          const created_at = x.created_at * 1000;
          const updated_at = x.updated_at * 1000;
          x.setDataValue('created_at', Hooks.formattedDate(created_at));
          x.setDataValue('updated_at', Hooks.formattedDate(updated_at));
          return x;
        });
      } else if (type == 'review') {
        const data = rec.map((x) => {
          return {
            count: x.count,
            rows: x.rows.map((x) => {
              const created_at = x.created_at * 1000;
              const updated_at = x.updated_at * 1000;
              x.setDataValue('created_at', Hooks.formattedDate(created_at));
              x.setDataValue('updated_at', Hooks.formattedDate(updated_at));
              return x;
            }),
          };
        });
        return { count: { ...data }[0].count, rows: { ...data }[0].rows };
      }
    } else {
      /* 객체(단일조회) */
      if (type == undefined) {
        const created_at = rec.created_at * 1000;
        const updated_at = rec.updated_at * 1000;
        rec.setDataValue('created_at', Hooks.formattedDate(created_at));
        rec.setDataValue('updated_at', Hooks.formattedDate(updated_at));
        return rec;
      } else if (type == 'schedule' || type == 'event') {
        const created_at = rec.created_at * 1000;
        const start_date = rec.start_date * 1000;
        const end_date = rec.end_date * 1000;
        rec.setDataValue('created_at', Hooks.formattedDate(created_at));
        rec.setDataValue('start_date', Hooks.formattedDate(start_date));
        rec.setDataValue('end_date', Hooks.formattedDate(end_date));
        return rec;
      }
    }
  }
};
