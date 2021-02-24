var knex = require("../database/connection")
var bcrypt = require('bcrypt')
const PasswordToken = require("./PasswordToken")

class User {

    async findAll(){
        try{
            var result = await knex.select(["id","email","name","role"]).table("users")
            return result
        }catch(err){
            console.log(err)
            return []
        }
    }
    
    async findById(id){
        try{
            var result = await knex.select(["id","email","name","role"]).where({id}).table("users")
            if(result.length > 0){
                return result[0]
            }else{
                return undefined
            }
        }catch(err){
            console.log(err)
            return undefined
        }
    }

    async findByEmail(email){
        try{
            var result = await knex.select(["id","email","name","password","role"]).where({email}).table("users")
            if(result.length > 0){
                return result[0]
            }else{
                return undefined
            }
        }catch(err){
            console.log(err)
            return undefined
        }
    }

    async new(user){
        var {email,password,name} = user
        try{
            password = await bcrypt.hash(password,10)
            await knex.insert({email,password,name,role:0}).table('users')
        }
        catch(err){
            console.log(err)
        }
    }

    async findEmail(email){
        try{
            var result = await knex.select("*").from("users").where({email})
            if (result.length>0){
                return true
            }else{
                return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }

    async update(id,email,name,role){
        var user = await this.findById(id)
        if(user){
            var editUser = {}
            if(email){
                if(email != user.email){
                    var result = await this.findEmail(email)
                    if(!result){
                        editUser.email = email
                    }else{
                        return {status:false, err:"Email ja cadastrado no sistema!"}
                    }
                }
            }
            if(name){
                editUser.name = name
            }
            if(role){
                editUser.role = role
            }
            
            try{
                await knex.update(editUser).where({id}).table("users")
                return {status:true}
            }catch(err){
                return {status:false,err}
            }

        }else{
            return {status:false,err: "O usuário não existe!"}
        }
    }

    async delete(id){
        var user = await this.findById(id)
        if(user){
            try{
                await knex.delete().where({id}).table("users")
                return {status: true}
            }catch(err){
                return {status: false, err}
            }
        }else{
            return {status:false,err:"Usuario não existe!"}
        }
    }

    async changePassword(newPassword,id,token){
        try{
            var password = await bcrypt.hash(newPassword,10)
            await knex.update({password}).where({id}).table('users')
            await PasswordToken.setUsed(token)
        }
        catch(err){
            console.log(err)
        }
    }

}

module.exports = new User()