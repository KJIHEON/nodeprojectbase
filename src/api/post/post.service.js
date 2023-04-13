import models from '../../models'

export default class ApiService {

    constructor() {}
    /* 포스트생성 */
    async createPost(body) {
    try{
        return models.post.create(body)
    }catch(e){
        return e
    }
    }
    /* 모든 포스트 조회 */
    async findAllPost(){
        try{
            return await models.post.findAll({include:[{
                model:models.user,
                // attributes:['user_idx'], //한개만 조인해서 가져올 때
            //    attributes: {exclude:['password']} //해당 속성만 빼고 조인해서 가져올 때
            }]})
        }catch(e){
            return e
        }
    }
    /* 단일 포스트 조회 */
    async findOnePost(post_idx){
        try{
            console.log(post_idx)
            return models.post.findOne({where:{post_idx}})
        }catch(e){
            return e
        }
    }
}