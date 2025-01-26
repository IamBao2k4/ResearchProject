class SiteController{

    // [GET] /
    login(req, res){
        res.render('login');
    }

    // [GET] /search
    search(req, res){
        res.render('search');
    }
}

module.exports = new SiteController;