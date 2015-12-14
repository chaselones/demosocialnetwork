//Require the models
var User = require('../app/models/user');
var Wall = require('../app/models/wall');

//Make the routes accessible
module.exports = function (app, passport) {

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }


    // normal routes 

    // show the home page (will also have our login link)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION 
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    // LOGOUT 
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    // AUTHENTICATE (FIRST LOGIN) 


    // locally 
    // LOGIN
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP 
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // AUTHORIZE (ALREADY LOGGED IN) 


    // locally
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    //edit profile, isLoggedIn prevents a non logged in user from viewing the route page
    app.get('/editprofile', isLoggedIn, function (req, res) {
        //    console.log(req.user);
        res.render('editprofile.ejs', {
            user: req.user
        });
    });

    //find users
		app.get('/viewusers', isLoggedIn, function(req,res){
			res.render('findusers.ejs',{});
		});
 
    app.get('/editfriendslist', isLoggedIn, function(req,res){
			res.render('editfriendslist.ejs',{});
		});
	
    app.get('/findusers', isLoggedIn, function (req, res) {
        //    console.log(req.user);
        User.find({}, function (err, users) {
            res.json(users);
        });
    });
//$in: 
		app.get('/findfriends', isLoggedIn, function(req,res){
			User.find({'_id' : { $in : req.user.local.friends }}, function(err, docs){
				console.log(docs);
				res.json(docs);
			});
		})

    //add friends
    app.post('/addfriend', isLoggedIn, function (req, res) {
        User.findOneAndUpdate({
                'local.email': req.user.local.email
            },
            //need 'local.#' in order to reference the values from the db to change.
            {
                $push: {
                    'local.friends': req.body.id
                }
            },
            function (err, numberAffected, rawResponse) {
                //handle it
               res.json(true);
                console.log(err, numberAffected, rawResponse);
            });
    });
	
	//Delete friends
	app.post('/removefriend', isLoggedIn, function(req, res){
        console.log(req.body);
        User.findOneAndUpdate({
                'local.email': req.user.local.email
            }, {
                $pull: {
                    'local.friends': req.body.friendID
                }
            },
            function (err, numberAffected, rawResponse) {
                //handle it
               res.json(true);
                console.log(err, numberAffected, rawResponse);
            });
	});
    
    //html route
    app.get('/userprofile/:id', isLoggedIn, function(req, res){
           User.findOne({
                '_id': req.params.id
            }, 
            function (err, users) {
                //handle it
            res.render('userprofile.ejs', {model: users}); 
//                console.log(err, users);
            });
       
    });
    //click user profile in findfriends API route
    app.get('/getuserprofile/:id', isLoggedIn, function(req, res){   console.log(req.params.id);
        User.find({
                '_id': req.params.id
            }, 
            function (err, users) {
                //handle it
               res.json(users);
                console.log(err, users);
            });
    });
    
    //get wall posts
    app.get('/getwallposts', isLoggedIn, function(req, res){
            Wall.find({}, function (err, users) {
            res.json(users);
        });
    });
    
    //post to wall
    app.post('/posttowall', isLoggedIn, function (req, res) {
        var newWall = new Wall();
        newWall.user = req.user.local.userName;
        newWall.msg = req.body.msg;
        newWall.save(function (err) {
            if (err) {
                console.log(err);
            }
            //for .then to work. you must reply with a res.json(true)
            res.json(true);
        });
    });
    
    //delete wall posts
    app.post('/deletepost', isLoggedIn, function(req, res){
        console.log(req.body);
        Wall.remove({_id: req.body.id}, function(err, docs){
            console.log(docs);
            res.json(true);
        });
    });

    //savedata
    app.post('/savedata', isLoggedIn, function (req, res) {
        console.log(req.user.local.email);
        User.update({
            'local.email': req.user.local.email
        }, {
            //need 'local.#' in order to reference the values from the db to change.
            'local.age': req.body.age,
            'local.gender': req.body.gender,
            'local.usertype': req.body.usertype
        }, function (err, numberAffected, rawResponse) {
            //handle it
            console.log(err, numberAffected, rawResponse);
        });
    });

};