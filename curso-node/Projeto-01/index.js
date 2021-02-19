const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')
//Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão efetuada com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

// Usar o EJS como view engine do Express
app.set("view engine", 'ejs')
// Configurar o express para usar arquivos estáticos
app.use(express.static('public'))
// Traduzir dados enviados em requisições
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Rotas
app.get("/", (req, res) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC'] // ASC - crescente, DESC - decrescente
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    Pergunta.create({
        titulo,
        descricao,
    }).then(() => {
        res.redirect("/")
    })
})

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id

    Pergunta.findOne({
        where: {
            id
        }
    }).then(pergunta => {
        if (pergunta != undefined) {//Encontrada
            Resposta.findAll({
                where:{
                    perguntaID: pergunta.id
                },
                order: [['id','DESC']]
            }).then( respostas=> {
                res.render('pergunta',{
                    pergunta,
                    respostas
                })
            })
        } else { //Não encontrada
            res.redirect("/")
        }
    })
})

app.post("/responder",(req,res)=>{
    var corpo = req.body.corpo
    var perguntaID = req.body.pergunta
    Resposta.create({
        corpo,
        perguntaID
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaID)
    }).catch((erro)=>{
        console.log(erro)
    })
})

app.listen(8080, () => {
    console.log("App rodando!")
})