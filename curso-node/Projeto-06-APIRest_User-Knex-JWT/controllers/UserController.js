var User = require('../models/User')
var PasswordToken = require('../models/PasswordToken')
var jwt = require('jsonwebtoken')
var bcrypt = require("bcrypt")

var secret = "nmjndbg mn sdjbnduhujgsehgyfgryuffvgsjhfnvjkmdf 454kkjv51 "

class UserController{
    async index(req,res){
        var users = await User.findAll()
        res.json(users)
    }

    async findUser(req,res){
        var id = req.params.id
        var user = await User.findById(id)
        if(!user){
            res.status(404)
            res.json({})
        }else {
            res.json(user)
        }
    }

    async create(req,res){
        var {email, name, password} = req.body 
        
        if(!email){
            res.status(400)
            res.json({err: "O e-mail é inválido"})
            return
        }

        var emailExists = await User.findEmail(email)

        if(emailExists){
            res.status(406)
            res.json({err: "O e-mail ja esta cadastrado"})
            return
        }

        try{
            await User.new({email, name, password})
            res.status(200)
            res.send("Pegando o corpo da requisição!")
        }catch(err){
            console.log(err)
            res.status(200)
        }
        
    }

    async edit(req,res){
        var {id,name,role,email} = req.body
        var result = await User.update(id,email,name,role)
        if(result){
            if(result.status){
                res.send("Tudo Ok!")
            }else {
                res.status(406)
                res.json(result.err)
            }
        }else{
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }
    }

    async delete(req,res){
        var id = req.params.id

        var result = await User.delete(id)

        if(result.status){
            res.status(200)
            res.send("Tudo ok!")
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req,res){
        var email = req.body.email

        var result = await PasswordToken.create(email)
        if(result.status){
            console.log(result.token)
            res.status(200)
            res.json({token:result.token})
        }else {
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req,res){
        var {token, password} = req.body
        
        var isTokenValid =  await PasswordToken.validate(token)
        if(isTokenValid.status){
            try{
                User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token)
                res.send("Senha alterada!")
            }catch(err){
                res.status(403)
                res.send("Erro ao alterar senha, tente novamente!")
            }
        }else{
            res.status(406)
            res.send("Token não encontrado!")
        }
    }

    async login(req,res){
        var {email,password} = req.body

        var user = await User.findByEmail(email)

        if(user){
            var result = await bcrypt.compare(password,user.password)
            if(result){
                var token = jwt.sign({email: user.email, role: user.role, name: user.name}, secret);
                res.status(200)
                res.json({token})
            }else{
                res.status(406)
                res.send("Senha incorreta!")
            }
        }else{
            res.json({status:false})
        }
    }
}

module.exports = new UserController()