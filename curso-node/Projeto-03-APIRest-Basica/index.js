const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const jwtSecret = "nmcjkflgrãmchbxdfe11h541ty4xfg4gjmvbx545f4534cvz"

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function auth(req,res,next){
    const authToken = req.headers['authorization']
    if(authToken){
        const token = authToken.split(' ')[1]
        jwt.verify(token,jwtSecret,(err,data)=>{
            if(err){
                res.status(401)
                res.json({err: "Token inválido!"})
            }else{
                req.token = token
                req.loggedUser = {id: data.id,email: data.email}
                next()  
            }
        })
    }else{
        res.sendStatus(401)
    }
}

var db = {
    games: [
        {
            id: 23,
            title: "Call Of Duty",
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: "Sea of Thieves",
            year: 2018,
            price: 40
        },
        {
            id: 2,
            title: "Control",
            year: 2019,
            price: 50
        },],
    users: [
        {
            id: 1,
            name: "Breno Washington",
            email: "breno@email.com",
            password: "nodebreno"
        },
        {
            id: 1,
            name: "Amanda",
            email: "amanda@email.com",
            password: "nodeamanda"
        },
    ]
}

app.get("/games",auth, (req, res) => {
    res.status(200)
    res.json(db.games)
})

app.get("/game/:id",auth, (req, res) => {
    
    var id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        id = parseInt(id)
        var game = db.games.find(g => g.id == id)

        if (game) {
            var HATEOAS = [
                {
                    href:"http://localhost:45678/game/"+id,
                    method: "DELETE",
                    rel: "Deleta um game"
                },
                {
                    href:"http://localhost:45678/game/"+id,
                    method: "GET",
                    rel: "Retorna um game"
                },
                {
                    href:"http://localhost:45678/game/"+id,
                    method: "Put",
                    rel: "Altera um game"
                },
            ]
            res.status(200)
            res.json({game,_links: HATEOAS})
        } else {
            res.sendStatus(404)
        }
    }
})

app.post("/game",auth, (req, res) => {
    var { title, price, year } = req.body
    if (title && price && year) {
        db.games.push({ id: Math.floor(Math.random() * (2000)) + 500, title, price, year })
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.delete('/game/:id',auth, (req, res) => {
    var id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        id = parseInt(id)
        var index = db.games.findIndex(g => g.id == id)
        if (index >= 0) {
            db.games.splice(index, 1)
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    }
})

app.put('/game/:id',auth, (req, res) => {
    var id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        id = parseInt(id)
        var game = db.games.find(g => g.id == id)
        if (game) {
            var { title, price, year } = req.body
            if (title || price || year) {
                if (title) {
                    game.title = title
                }
                if (price) {
                    game.price = price
                }
                if (year) {
                    game.year = year
                }
                res.sendStatus(200)
            } else {
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(404)
        }
    }
})

app.post("/auth",(req,res)=>{
    var {email,password} = req.body
    if(email){
        if(password){
            var user = db.users.find(user => user.email == email)
            if(user){
                if(user.password == password){
                    jwt.sign({id: user.id , email},jwtSecret,{expiresIn: "1h"},(err,token)=>{
                        if(err){
                            res.status(400)
                            res.json({err: "Falha interna!"})
                        }else {
                            res.status(200)
                            res.json({token})
                        }
                    })   
                }else {
                    res.status(401)
                    res.json({err: "Credenciais inválidas!"})
                }
            }else{
                res.status(404)
                res.json({err: "Email não cadastrado!"})
            }
        }else{
            res.status(401)
            res.json({err: "Senha inválida"})
        }
    }else{
        res.status(400)
        res.json({err: "E-mail inválido"})
    }
})

app.listen(45678, () => {
    console.log("Executando...")
})