var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");

var AdminAuth = require('../middlewares/AdminAuth')

router.get('/', HomeController.index);
router.post('/user',UserController.create)
router.get('/user',AdminAuth,UserController.index)
router.get('/user/:id',AdminAuth,UserController.findUser)
router.put('/user',UserController.edit)
router.delete('/user/:id',AdminAuth,UserController.delete)
router.post('/recoverpassword',UserController.recoverPassword)
router.post('/changepassword',UserController.changePassword)
router.post('/login',UserController.login)
router.post("/validate",AdminAuth,HomeController.validate)

module.exports = router;