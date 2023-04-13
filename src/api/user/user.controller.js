import { Container }  from 'typedi'; 
import Service  from "./user.service";
import JWTManager from '../../utill/jwt'
// Container.set('user',new Service())
export default [
/* POST 회원가입 */
{   
    path: '/user/signup',
    method: 'post',
    middleware: [],
    controller: async (req,res, next) => {
    try{
        const {admin_id, password} = req.body
        const ServiceInstance = Container.get(Service)
        console.log(ServiceInstance)
        const data = await ServiceInstance.signup({admin_id, password})
        console.log(data)
        res.status(201).json({
            status : 200,
            message : "success",
            data : data
        })
    }catch(e){
        console.log(e.message)
        return res.status(200).json({
            status: 500,
            message: 'Server error',
            data: e.message,
            });
    }
    },
},
/* POST 로그인 */
{
    path: '/user/login',
    method: 'post',
    middleware:[],
    controller: async (req,res,next) => {
        try{
            const {admin_id,password} = req.body
            const ServiceInstance = Container.get(Service)
            const result = await ServiceInstance.login({admin_id,password})
            if(result){
                const data = result.dataValues
                const JWT = new JWTManager()
                const token = await JWT.createToken(data,`${24*30}h`)
                console.log(token,"받아온 토큰")
                return res.status(200).json({
                    status : 200,
                    message:'success',
                    data:{
                        ...data,
                        token,
                    }
                })
            }else{
                return res.status(200).json({
                    status : 204,
                    message:'Not found Data',
                }) 
            }
    }catch(e){
        console.log(e.message)
        return res.status(200).json({
            status: 500,
            message: 'Server error',
            data: e.message,
            });
    }     
}
},
/* 메일 전송  */
{
        path:'/user/email',
        method: 'post',
        middleware:[],
        controller:async(req,res,next)=>{
            try{
                const { toEmail } = req.body
                if(!toEmail) throw new Error("이메일이 없습니다")
                const ServiceInstance = Container.get(Service)
                const result = await ServiceInstance.sendmail(toEmail) 
                console.log(result,"컨트롤러")
                let status = 200
                if(result == false){
                    status = 404
                } 
                return res.status(200).json({
                    status,
                    message:'success',
                })
            }catch(e){
                console.log(e.message)
                return res.status(200).json({
                    status: 500,
                    message: 'Server error',
                    data: e.message
                })
            }
        }
}
]