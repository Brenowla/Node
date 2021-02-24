class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Guia do programador");
    }

    async validate(req,res){
        res.send("Tudo ok!")
    }

}

module.exports = new HomeController();