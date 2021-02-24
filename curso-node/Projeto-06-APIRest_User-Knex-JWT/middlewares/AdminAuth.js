var jwt = require('jsonwebtoken')

var secret = "nmjndbg mn sdjbnduhujgsehgyfgryuffvgsjhfnvjkmdf 454kkjv51 "

module.exports = function (req, res, next) {

    const authToken = req.headers['authorization']
    if (authToken) {
        const token = authToken.split(' ')[1]
        try{
            var decoded = jwt.verify(token,secret)
            if(decoded.role == 1){
                next()
            }else{
                res.status(403)
                res.send("Você não tem permissão para isso!")
                return
            }
        }catch(err){

        }
    }else{
        res.status(403)
        res.send("Você não esta autenticado!")
        return
    }


}