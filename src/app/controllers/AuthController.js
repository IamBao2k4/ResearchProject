class AuthController {
    //[GET] /auth/google/callback
    googleCallback(req, res, next) {
        res.redirect("/");
    }

    //[GET] /auth/status
    authStatus(req, res) {
        const token = req.cookies.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                res.status(200).json({ loggedIn: true, userId: decoded.userId });
            } catch (error) {
                res.status(401).json({ loggedIn: false });
            }
        } else {
            res.status(401).json({ loggedIn: false });
        }
    }
}

module.exports = new AuthController();
