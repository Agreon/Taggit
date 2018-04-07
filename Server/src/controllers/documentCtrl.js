var Document = require('../models/document');
var Project = require('../models/project');
var ObjectId = require('mongodb').ObjectId;
var util = require('./util');


exports.getAll = function(req, res, next) {
    Document.find({}, function(err, projects){
        if(err) {
            return res.status(500).send(err);
        }
        res.send(projects);
    });
};

exports.getOne = function(req, res, next){

    var decoded = util.extractTokenUser(req.headers);
    if (!decoded) {
        return res.status(403).send('Authentication failed. User not found.');
    }

    Document.find({_id: req.params.id}, function(err, document){
        if(err) {
            return res.status(500).send(err);
        }
        console.log("Found",document);
        if(document.length == 0){
        	return res.status(403).send("Document not found!");
        }
        
        /*if(!document.shared && !document.ownerID == decoded._id){
            return res.status(403).send("You don't have access to that document");
        }*/

        res.send(document[0]);        
    });
};

exports.create = function (req, res, next) {
    console.log("Create Document", req.body);
    var document = new Document({
        name: req.body.name,
        projectID: req.body.projectID
    });

    Project.containsDocument(document, function(err, contains){
            if(err){
                return res.status(500).send(err);
            }

            // Already Document with name in db
            if(contains){
                return res.status(403).send("A document with this name is already existing!");
            }

            // Save it 
            document.save(function (err, document) {
                if(err) {
                    return res.status(500).send(err);
                }
                res.send(document);
            });

    });
};


exports.save = function (req, res, next) {
	let toUpdate = req.body;
	toUpdate.updated_at = new Date();
	delete toUpdate._id;	// Remove id

    console.log("Update Document", toUpdate);
	console.log("Params",req.params, req.params.id);

	Document.update({_id: ObjectId(req.params.id)}, toUpdate, function(err, numAffected, response){
		if(err){
            console.error(err);
            return res.status(500).send(err);
		}
		res.send({});
	});
};

exports.remove = function(req, res, next) {
	console.log("Delete",req.params.id);
	Document.remove({_id: req.params.id},function(err) {
		if(err){
            return res.status(500).send(err);
		}
		res.send({});
	});
}

