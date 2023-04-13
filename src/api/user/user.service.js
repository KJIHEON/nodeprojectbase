import models from '../../models'
import { mailer } from '../../utill/mail'
/* 
create({admin_id, password})
findOne({ where:{ admin_id, password } })
findByPk(프라이머리키)
update({ 바꿀값 }, { where: { email과 일치 값 } })
findAll({
    include:[{
    model:models.user,
    as: 'user', //별명
    attributes: ['user_idx'], //한개만 조인해서 가져올 때
    attributes: { exclude:['password'] } //해당 속성만 빼고 조인해서 가져올 때
    }]})
order:[ [모델명,'기준','내림OR올림'] 
        [user, 'user_idx','DESC' ],
    ]
             */
export default class ApiService {

    constructor() {}
/* 회원가입 */
    async signup(params){
        try{
            const { admin_id, password } = params;
            return models.user.create({
                admin_id, password
            })
        }catch(e){
            return e
        }
    }
/* 로그인 */
    async login(body){
        try{
            const { admin_id,password } = body
            console.log(admin_id,password,"dd")
            return models.user.findOne({
                where:{ admin_id, password }
            })
        }catch(e){
            return e
        }
    }
/* 메일 전송 */
    async sendmail(toEmail){
        try{
            console.log(toEmail,"서빗")
            const emailparam = {
            toEmail,
            subject:`안녕하세요 테스트메일입니다`,
            html:`
            <h1>테스트 입니다 내가 보냈어요</h1>
            <b>1231313131321</b>
            `
            }
            return await mailer.sendGmail(emailparam)
        }catch(e){
            return e
        }
    }
}