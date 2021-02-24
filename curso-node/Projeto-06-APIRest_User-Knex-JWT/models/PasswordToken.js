var knex = require('../database/connection')
var User = require('./User')

class PasswordToken{
    async create(email){
        var user = await User.findByEmail(email)
        if(user){
            try{
                var token = Date.now() //UUID é mais recomendavel de usar
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token 
                }).table("passwordtokens")
                return {status:true,token}
            }catch(err){
                console.log(err)
                return {status:false, err}
            }
        }else{
            return {status: false,err: "O email passado não existe no banco de dados!"}
        }
    }

    async validate(token){
        try{
            var result = await knex.select().where({token}).table("passwordtokens")
            if (result.length>0){
                if(result[0].used){
                    return {status: false}
                }else {
                    return {status:true, token:result[0]}
                }
            }else{
                return {status: false}
            }
        }catch(err){
            console.log(err)
            return {status: false}
        }
    }

    async setUsed(token){
        try{
            await knex.update({used: 1}).where({token}).table("passwordtokens")
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = new PasswordToken()