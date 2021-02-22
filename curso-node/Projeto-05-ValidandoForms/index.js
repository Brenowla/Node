const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
app = express()

app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use(cookieParser("hjknbdhhbhddggbnd"))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(flash());

app.get("/",(req,res)=>{

    var emailError = req.flash("emailError")
    var nameError = req.flash("nameError")
    var pointsError = req.flash("pointsError")
    var email = req.flash("email")

    emailError = (emailError || emailError.length) == 0 ? undefined : emailError
    nameError = (nameError || nameError.length) == 0 ? undefined : nameError
    pointsError = (pointsError || pointsError.length) == 0 ? undefined : pointsError
    email = (email || email.length) == 0 ? "" : email

    res.render("index",{emailError,nameError,pointsError,email})
})

app.post("/form",(req,res)=>{
    var {email,name,points} = req.body
    var emailError
    var pointsError
    var nameError
    if(!email){
        emailError = "E-mail não pode ser vazio!"
    }
    if(!points){
        pointsError = "A pontuação deve ser maior q zero!"
    }
    if(!name){
        nameError = "O nome deve ser escrito!"
    }
    if(!emailError || !nameError || !pointsError){
        req.flash("emailError",emailError)
        req.flash("nameError",nameError)
        req.flash("pointsError",pointsError)
        req.flash("email",email)
        req.flash("name",name)
        req.flash("points",points)
        res.redirect("/")
    }else{
        res.send("Tudo certo")
    }
})

app.listen(8080,(req,res)=>{
    console.log("Executando...")
})