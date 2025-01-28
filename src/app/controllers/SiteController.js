const { render } = require("../../app");


class SiteController{

    // [GET] /
    login(req, res){
        res.render('login');
    }

    // [GET] /home
    home(req, res){
        res.render('home');
    }
}

module.exports = new SiteController;