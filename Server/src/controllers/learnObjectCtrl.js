"use strict";

var LearnObject = require('../models/learnobject');
var jwt = require('jwt-simple');
var config = require('../config/database');
var util = require('./util');

/**
 * Gets all learnobjects for a user
 * @param req
 * @param res
 * @param next
 */
exports.getAll = function(req, res, next) {
    var decoded = util.extractTokenUser(req.headers);
    if (!decoded) {
        return res.status(403).send('Authentication failed. User not found.');
    }
    LearnObject.find({
            ownerID: decoded._id
        }, function(err, learnobjects) {
            if (err) {
                return res.status(500).send(err);    
            }
            res.send(learnobjects);
        });
};

/**
 * Get one specific learnobject by id
 * @param req
 * @param res
 * @param next
 */
exports.getOne = function(req, res, next){
    var decoded = util.extractTokenUser(req.headers);
    if (!decoded) {
        return res.status(403).send('Authentication failed. User not found.');
    }

    console.log("Params",req.params);

    LearnObject.find({objectID: req.params.id}, function(err, learnobjects){
        if(err) {
            return res.status(500).send(err);
        }
        console.log("Found",learnobjects);
        res.send(learnobjects);
    });
};

/**
 * Creates a project
 * @param req
 * @param res
 * @param next
 */
exports.create = function (req, res, next) {
    var decoded = util.extractTokenUser(req.headers);
    if (!decoded) {
        return res.status(403).send('Authentication failed. User not found.');
    }

    let toUpdate = req.body;
    toUpdate.updated_at = new Date();
	delete toUpdate._id;	// Remove id

    var learnobject = new LearnObject(toUpdate);
    learnobject.ownerID = decoded._id;
    delete learnobject._id;

    console.log("Inserting", learnobject);

    LearnObject.find({ objectID: LearnObject.objectID, ownerID: learnobject.ownerID }, function(err, learnobjects) {
        if(err){
            return res.status(500).send(err);
        }

        console.log("Found", learnobjects);

        if(learnobjects.length > 0){
            console.log("Already existing");
            return res.status(403).send("LearnObject with this objectID already existing!");
        }

        learnobject.save(function (err, learnobject) {
            if(err) {
                return res.status(500).send(err);
            }
            res.send(learnobject);
        });        
    });
};


/**
 * Saves a learnobject
 * @param req
 * @param res
 * @param next
 */
exports.save = function (req, res, next) {

	var toUpdate = req.body;
	toUpdate.updated_at = new Date();
	delete toUpdate._id;	// Remove id

    console.log("Update LearnObject", toUpdate);

	LearnObject.update({_id: req.params.id}, toUpdate, function(err, numAffected, response){
		if(err){
			return res.status(500).send(err);
		}
		res.send({});
	});
};

exports.delete = function(req, res, next) {
	LearnObject.remove({_id: req.params.id},function(err) {
		if(err){
			res.status(500).send(err);
		}
		res.send({});
	});
}

