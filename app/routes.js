const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
module.exports = function (app, passport, db) {
	// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function (req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function (req, res) {
		let uId = ObjectId(req.session.passport.user);
		db.collection('waterTracker')
			.find({ id: uId })
			.toArray((err, result) => {
				if (err) return console.log(err);
				res.render('profile.ejs', {
					user: req.user,
					waterCount: result,
				});
			});
	});

	// LOGOUT ==============================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// message board routes ===============================================================

	app.post('/waterCount', (req, res) => {
		console.log(req.user._id);
		db.collection('waterTracker').save(
			{
				time: req.body.time,
				waterAmount: req.body.waterAmount,
				date: req.body.date,
				id: req.user._id,
			},
			(err, result) => {
				if (err) return console.log(err);
				console.log('saved to database');
				res.redirect('/profile');
			}
		);
	});

	app.delete('/delete', (req, res) => {
		console.log(req.body.id);
		console.log(req.body.id);
		db.collection('waterTracker').findOneAndDelete(
			{ _id: new mongoose.mongo.ObjectID(req.body.deleteId) },
			(err, result) => {
				if (err) return res.send(500, err);
				res.send({ result: 'Message deleted!' });
			}
		);
	});

	// =============================================================================
	// AUTHENTICATE (FIRST LOGIN) ==================================================
	// =============================================================================

	// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	app.get('/login', function (req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post(
		'/login',
		passport.authenticate('local-login', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/login', // redirect back to the signup page if there is an error
			failureFlash: true, // allow flash messages
		})
	);

	// SIGNUP =================================
	// show the signup form
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post(
		'/signup',
		passport.authenticate('local-signup', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/signup', // redirect back to the signup page if there is an error
			failureFlash: true, // allow flash messages
		})
	);

	// =============================================================================
	// UNLINK ACCOUNTS =============================================================
	// =============================================================================
	// used to unlink accounts. for social accounts, just remove the token
	// for local account, remove email and password
	// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function (req, res) {
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function (err) {
			res.redirect('/profile');
		});
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();

	res.redirect('/');
}

// `{$group: {_id: null,

//   total: { $sum: '$amountDrank'}}
//   }
//   ]).toArray().then((result) => {
//   console.log(result)
//   let total = (result.length === 0 ) ? 0 : result[0].total
//   res.redirect(`total=${total}`)
//   })`
