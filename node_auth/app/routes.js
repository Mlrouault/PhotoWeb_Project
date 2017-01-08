var User       = require('../app/models/user');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        //app.post('/signup', passport.authenticate('local-signup', {
        //    successRedirect : '/profile', // redirect to the secure profile section
        //    failureRedirect : '/signup', // redirect back to the signup page if there is an error
        //    failureFlash : true // allow flash messages
        //}));
        app.post('/signup', function(req, res) {
          email = req.body.email;
          username = req.body.username;
          password = req.body.password;

          if (email && username && password) {
          // if the user is not already logged in:
            if (!req.user) {
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

                User.findOne({ 'local.username' :  username }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) throw err;
                        console.log('Error looking up username ');
                    // check to see if theres already a user with that username
                    if (user) {
                        console.log('Username already taken: ' + username);
                        req.flash('signupMessage', 'That username is already taken.');
                        res.redirect('/signup');
                    } else {
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err) throw err;
                                console.log('Error Saving User ');
                        });
                        req.flash('loginMessage', 'Please sign in with your new account.');
                        res.redirect('/login');
                    }

                });
                // if the user is logged in but has no local account...
              } else if ( !req.user.local.username ) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the username used to connect a local account is being used by another user
                    User.findOne({ 'local.username' :  username }, function(err, user) {
                        if (err) throw err;
                            console.log('Error looking up username ');

                        if (user) {
                            console.log('Username already taken: ' + username);
                            req.flash('signupMessage', 'That username is already taken.');
                            res.redirect('/signup');
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.username = username;
                            user.local.password = user.generateHash(password);
                            user.save(function(err) {
                                if (err) throw err;
                                    console.log('Error Saving User ');
                            });
                            req.flash('loginMessage', 'Please sign in with your new account.');
                            res.redirect('/login');
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    req.flash('signupMessage', 'You already have a local account and are logged in.');
                    res.redirect('/signup');
                }
            }else {
              req.flash('signupMessage', 'Username, Email, and Password are all required fields.');
              res.redirect('/signup');
            }
        });



    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
