import { Container } from 'typedi';
import Service from './post.service'
import { UserAuth } from '../../middleware/Auth'
// Container.set('post',new Service())
export default [
    /* POST 포스트 생성 */
    {
        path: '/:user_idx/post',
        method: 'post',
        middleware:[UserAuth],
        controller: async (req,res,_) =>{
            try{
                const {comment, name} = req.body
                // const {user_idx} = req.params
                const {user_idx} = res.locals.user //res.locals.user라는 가상 공간에 담음
                console.log(user_idx,"토큰으로 뽑은 값")
                console.log(res.locals.user,"컨트롤러")
                const ServiceInstance = Container.get(Service)
                const data = await ServiceInstance.createPost({comment,name,user_idx})
               return res.status(200).json({
                status: 200,
                message: 'success',
                data,
               })
            }catch(e){
                console.log({"e": e.message})
                res.status(404).json({
                    status: 500,
                    message:"Server error",
                    data: e.message
                })
            }
            
        }
    },
    /* GET 모든 작성글 조회 */
    {
        path: '/post',
        method: 'get',
        middleware:[],
        controller: async(req,res,_)=>{
            try{
                const ServiceInstance = Container.get(Service)
                const data = await ServiceInstance.findAllPost()
                console.log(data)
                return res.status(200).json({
                    status: 200,
                    message: 'success',        
                    data
                })
            }catch(e){
                console.log({"e": e.message})
                res.status(404).json({
                    status: 500,
                    message:"Server error",
                    data: e.message
                })
            }
            
        }
        
    },
    /* 단일 작성글 조회 */
    {
        path: '/:post_idx/post',
        method: 'get',
        middleware:[],
        controller: async(req,res,_)=>{
            try{
                console.log(req.params)
                const { post_idx } = req.params
                const ServiceInstance = Container.get(Service)
                const data = await ServiceInstance.findOnePost(post_idx)
                console.log(data)
                if(data){
                    return res.status(200).json({
                        status: 200,
                        message: 'success',
                            data
                    })
                }else{
                    return res.status(200).json({
                        status: 404,
                        message: 'no data'
                    }) 
                }
            }catch(e){
                console.log({"e": e.message})
                res.status(404).json({
                    status: 500,
                    message:"Server error",
                    data: e.message
                })
            }  
        }
        
    }
]