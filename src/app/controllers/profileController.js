const Users = require('../models/Users');
const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const { createClient } = require("@supabase/supabase-js");

// Cấu hình Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class ProfileController {
    // [GET] /profile
    async profile(req, res) {
        try {
            const user = await Users.findOne({ _id: req.user._id });
            res.render("profile", { user: mongooseToObject(user) });
        }   
        catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = new ProfileController();