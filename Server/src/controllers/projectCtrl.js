"use strict";

var Project = require('../models/project');
var jwt = require('jwt-simple');
var config = require('../config/database');
var util = require('./util');

/**
 * Gets all projects for a user
 * @param req
 * @param res
 * @param next
 */
exports.getAll = function(req, res, next) {
    var decoded = util.extractTokenUser(req.headers);
    if (!decoded) {
        return res.status(403).send('Authentication failed. User not found.');
    }
    Project.find({
            ownerID: decoded._id
        }, function(err, projects) {
            if (err) {
                return res.status(500).send(err);    
            }
            res.send(projects);
        });
};

/**
 * Get one specific project by id
 * @param req
 * @param res
 * @param next
 */
exports.getOne = function(req, res, next){
    var decoded = util.extractTokenUser(req.headers);
    if (!decoded) {
        return res.status(403).send('Authentication failed. User not found.');
    }

    Project.find({_id: req.params.id}, function(err, projects){
        if(err) {
            return res.status(500).send(err);
        }
        console.log("Found",projects);
        res.send(projects[0]);
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

    var project = new Project({
        name: req.body.name,
        documents: [],
        ownerID: decoded._id
    });

    Project.findByName(project.ownerID, project.name, function(err, projects){
        if(err){
            return res.status(500).send(err);
        }

        if(projects.length > 0){
            console.log("Already existing");
            return res.status(403).send("Project with this name already existing!");
        }

        project.save(function (err, project) {
            if(err) {
                return res.status(500).send(err);
            }
            res.send(project);
        });        
    });
};


/**
 * Saves a project
 * @param req
 * @param res
 * @param next
 */
exports.save = function (req, res, next) {

	var toUpdate = req.body;
	toUpdate.updated_at = new Date();
	delete toUpdate._id;	// Remove id

    console.log("Update Project", toUpdate);

	Project.update({_id: req.params.id}, toUpdate, function(err, numAffected, response){
		if(err){
			return res.status(500).send(err);
		}
		res.send({});
	});
};

exports.delete = function(req, res, next) {
	Project.remove({_id: req.params.id},function(err) {
		if(err){
			res.status(500).send(err);
		}
		res.send({});
	});
}

