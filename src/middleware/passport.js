var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function(email, password, done) {
            User.getUserByEmail(email, function(err, user){                
                if(err) throw err;
                if(!user) {
                    return done(null, false, {message: 'Unknown email ID'});
                }
                User.comparePassword(password, user.password, function(err, isMatch) {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Invalid password'});
                    }
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            done(err, user);
        });
    });
    
}

