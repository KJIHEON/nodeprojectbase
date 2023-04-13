import JWTManager from '../utill/jwt'

/* 함수 실행 */
export const UserAuth = async (req,res,next)=>{
 AuthMiddleWare(req,res,next)
}

const AuthMiddleWare = async(req,res,next)=>{
try{
    const {authorization} = req.headers
    const token = authorization.split("Bearer ")[1]
    if(authorization){
        console.log(token,"dd")
        const JWT = new JWTManager()
        const decode = await JWT.verify(token)
        // console.log(decode)
        res.locals.user = decode
      if(decode) {
        next()
        } else {
            return res.status(401).json({
            resultMessage: 'Access denied'
            })   
        }  
    } else {
    return res.status(401).json({
        resultMessage: 'Access denied / status : false',
        });
    }
}catch(e){
    return res.status(500).json({
        resultMessage: 'Server error',
    });
}
}