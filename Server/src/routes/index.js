var express = require('express');
var passport = require('passport');
var router = express.Router();
var tagCtrl = require('../controllers/tagCtrl');
var documentCtrl = require('../controllers/documentCtrl');
var projectCtrl = require('../controllers/projectCtrl');
var userCtrl = require('../controllers/userCtrl');
var learnObjectCtrl = require('../controllers/learnObjectCtrl');
var jwt = require('jwt-simple');
var config = require('../config/database');
var util = require('../controllers/util');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*

 app.use(function (err, req, res, next) {
 if (err.name === 'UnauthorizedError') {
 res.status(401).json({message:'Missing or invalid token'});
 }
 });


    router.route('/signup')
    .post(passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
        // }));
*/


/**
 * Authorization
 */
router.route('/user').post(userCtrl.signUp);

router.route('/authenticate').post(userCtrl.authenticate);
router.route('/userByToken').post(userCtrl.userByToken);

//router.route('/signup').post(userCtrl.signUp);

// TODO: I think this is needed for security
//router.use(passport.authenticate('jwt', {session: false}));


/**
 * Project
 */

//router.all('/project', util.extractTokenUser);

router.all('/project', function(req, res, next){
  console.log("Params",req.params);

    next();
  /* if (req.headers && req.headers.authorization) {
        var parted = req.headers.authorization.split(' ');
        if (parted.length === 2) {
            var decoded = jwt.decode(parted[1], config.secret);
            if(!decoded){
                return res.status(403).send({success: false, msg: 'Authentication failed. Unknown User-Credentials'});
            }else {
                next("A");
               // next(decoded);
            }
        } else {
            return res.status(403).send({success: false, msg: 'Authentication failed. Token malformed.'});
        }
    } else {
        return res.status(403).send({success: false, msg: 'Authentication failed. No token send.'});
    }*/
});
/*
router.get('/project', [util.extractTokenUser],function(req, res){
  console.log("HJEY");
  console.log("HJEY",req);
});*/
//router.get('/project', [util.extractTokenUser], projectCtrl.getAll);

router.route('/project')
    .get(projectCtrl.getAll)
    .post(projectCtrl.create);



router.route('/project/:id')
    .get(projectCtrl.getOne)
    .put(projectCtrl.save)
    .delete(projectCtrl.delete);

/**
 * Document
 */
router.route('/document')
    .get(documentCtrl.getAll)
    .post(documentCtrl.create);

router.route('/document/:id')
    .get(documentCtrl.getOne)
    .put(documentCtrl.save)
    .delete(documentCtrl.remove);

router.route('/shared/:id')
    .get(documentCtrl.getOne);
/**
 * Tag
 */
router.route('/tag')
    .get(tagCtrl.getAll)
    .post(tagCtrl.create);

router.route('/tag/:id')
    .get(tagCtrl.getOne)
    .put(tagCtrl.save)
    .delete(tagCtrl.remove);


/**
 * LearnObject
 */
router.route('/learnObject')
    .get(learnObjectCtrl.getAll)
    .post(learnObjectCtrl.create);

router.route('/learnObject/:id')
    .get(learnObjectCtrl.getOne)
    .put(learnObjectCtrl.save);
  //  .delete(learnObjectCtrl.remove);


module.exports = router;
