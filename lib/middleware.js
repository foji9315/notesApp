var express = require("express"),
    app = express();

// Obcject to access middlewares
var middleware = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        else {
            req.flash("error", "You must be logged");
            res.redirect("/users/login");
        }
    },

    isAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.admin >= 1) return next();
            else {
                req.flash("error", "Admin access are requiered");
                res.redirect("back");
            }
        }
        else {
            req.flash("error", "You must be logged");
            res.redirect("/login");
        }
    },
    isSuAdmin: function (req,res,next){
        if (req.isAuthenticated()) {
            if (req.user.admin === 2) return next();
            else {
                req.flash("error", "You don't have permissions to do this.");
                res.redirect("back");
            }
        }
        else {
            req.flash("error", "You must be logged");
            res.redirect("/login");
        }
    }
}

module.exports = middleware;