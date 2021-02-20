const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require("express-session")

const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/articlesController")
const userController = require('./user/usersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

// View engine
app.set('view engine','ejs')

// Sessions
app.use(session({
    secret: "nhnjndskjnjbdsafbvhabsfdxdasdjkbacwangvwgvxaghwdadfjsa",
    cookie: {
        maxAge: 60000*60
    }
}))

// Static
app.use(express.static('public'))

// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Conectando ao BD
connection.authenticate()
    .then(()=>{
        console.log("Conexão feita com sucesso!")
    })
    .catch((erro)=>{
        console.log(erro)
    })

app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/",userController)

app.get('/',(req,res)=>{
    Article.findAll({
        order: [
            ['id',"DESC"]
        ],
        limit:3
    }).then(articles=> {
        Category.findAll().then(categories=>{
            res.render('index',{articles,categories})
        })
    })
})

app.get("/:slug",(req,res)=>{
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug
        }
    }).then(article => {
        if(article!=undefined){
            Category.findAll().then(categories=>{
                res.render('article',{article,categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category){
            Category.findAll().then(categories=>{
                res.render("index",{articles: category.articles, categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(erro=>{
        res.redirect("/")
    })
})

app.listen(8080,()=>{
    console.log("Servidor executando!")
})