const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles',adminAuth,(req,res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index",{articles})
    })
})

router.get('/admin/articles/new',adminAuth,(req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories})
    })
})

router.post("/articles/save",adminAuth, (req,res)=>{
    var title = req.body.title
    var body = req.body.body
    var categoryId = req.body.category

    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})

router.post("/admin/articles/delete",adminAuth,(req,res)=>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id
                }
            }).then(()=>{
                res.redirect("/admin/articles") 
            })
        }else{
           res.redirect("/admin/articles") 
        }
    }else{
        res.redirect("/admin/articles") 
    }
})

router.get("/admin/articles/edit/:id",adminAuth,(req,res)=>{
    var id = req.params.id
    Article.findByPk(id).then(article=>{
        if(article){
            Category.findAll().then(categories=>{
                res.render("admin/articles/edit",{categories,article})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err=>{
        res.redirect("/")
    })
})

router.post("/articles/update",adminAuth,(req,res)=>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var categoryId = req.body.category

    Article.update({
        title,
        body,
        categoryId,
        slug: slugify(title)
    },{
        where:{
            id
        } 
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch(err=> {
        console.log(err)
        res.redirect("/")
    })
})

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num

    if(isNaN(page) || page<=0){
        page = 1
    }
    Article.findAndCountAll({
        order: [
            ['id',"DESC"]
        ],
        limit: 3,
        offset: (page-1)*3
    }).then(articles => {

        var next
        if((page-1)*3+3 >= articles.count){
            next = false
        }else{
            next = true
        }
        
        var results = {
            page: parseInt(page),
            articles,
            next
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page",{results, categories})
        })
    })
})

module.exports = router