var Tag = require('../models/tag');

exports.getAll = function(req, res, next) {
    Tag.find({}, function(err, projects){
        if(err) {
            return res.status(500).send(err);
        }
        res.send(projects);
    });
};

exports.getOne = function(req, res, next){
    Tag.find({_id: req.params.id}, function(err, tag){
        if(err) {
            return res.status(500).send(err);
        }
        if(tag.length == 0){
        	res.status(403).send("Tag not found!");
        } else {
        	res.send(tag[0]);
        }        
    });
};

exports.create = function (req, res, next) {
    console.log("Create Tag", req.body);
    var tag = new Tag({
        name: req.body.name
    });

    tag.save(function (err, project) {
        if(err) {
            return res.status(500).send(err);
        }
        
        res.send(tag);
    });
};


exports.save = function (req, res, next) {
	let toUpdate = req.body;
	toUpdate.updated_at = new Date();
	delete toUpdate._id;	// Remove id

    console.log("Update Tag", toUpdate);
	console.log("Params",req.params, req.params.id);

	Tag.update({_id: req.params.id}, toUpdate, function(err, numAffected, response){
		if(err){
            return res.status(500).send(err);
		}
		res.send({});
	});
};

exports.remove = function(req, res, next) {
	console.log("Delete",req.params.id);
	Tag.remove({_id: req.params.id},function(err) {
		if(err){
            return res.status(500).send(err);
		}
		res.send({});
	});
}

