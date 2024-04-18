import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
/*
 const transporter = nodemailer.createTransport({
            service:'gmail', //전송하는 서비스
            host: 'smtp.gmail.com',
            port:587,
            secure: false, // 465의 경우 true, 다른 포트의 경우 false
            auth: {
                // Gmail 주소 입력, 'testmail@gmail.com'
                user: process.env.GMAIL_ID,
                // Gmail 패스워드 입력
                pass: process.env.GMAIL_APP_PW,
              } 
    const mailOptions = {
            from: process.env.GMAIL_ID, // 보내는 메일의 주소
            to: param.toEmail, // 수신할 이메일
            subject: param.subject, // 메일 제목
            html: param.html // 메일 내용
        };
          //메일 보내기
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

 const message = {
  from: "sender@server.com", 보낸 사람의 이메일 주소입니다
  to: "receiver@sender.com", 쉼표로 구분된 목록 또는 받는 사람
  subject: "Message title", 제목
  text: "Plaintext version of the message",  유니코드 문자열, 버퍼, 스트림 또는 첨부 파일과 같은 객체
  html: "<p>HTML version of the message</p>" 메시지의 HTML 버전으로 유니코드 문자열, 버퍼, 스트림 또는 첨부 파일과 같은 객체

 let transporter = nodemailer.createTransport(options[, defaults])
}; */
/* 메일 전송 객체 */
export const mailer = {
  /* 메일 전송 */
  sendGmail: async (param) => {
    console.log(process.env.GMAIL_ID);
    const transporter = nodemailer.createTransport({
      service: 'gmail', //전송하는 서비스
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // 465의 경우 true, 다른 포트의 경우 false
      auth: {
        // Gmail 주소 입력, 'testmail@gmail.com'
        user: process.env.GMAIL_ID,
        // Gmail 입 비밀번호 입력
        pass: process.env.GMAIL_APP_PW,
      },
    });
    /* 메일 옵션 */
    const mailOptions = {
      from: process.env.GMAIL_ID, // 보내는 메일의 주소
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      html: param.html, // 메일 내용
    };
    /* 메일 전송 */
    /*   transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        }); */
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + result.response);
      return true;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  },
};
