/**
 * Created by daniel on 3/22/17.
 */
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

var ProjectSchema = new mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    tags: {
        type: [],
        default: []
    },
    documents: [],
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

ProjectSchema.statics.findByName = function(_id, _name, cb) {
  return this.find({ name: _name, ownerID: _id }, cb);
};

/**
 * Checks wether the project contains already a document with given name 
 */
ProjectSchema.statics.containsDocument = function(_document, cb) {
    this.find({_id: ObjectId(_document.projectID)}, function(err, projects) {
        if(err) {
            cb(err, null);
            return;
        }

        console.log("Projs", projects);

        if(projects.length < 1) {
            cb("Could not find Project with ID:"+_document.projectID, null);
            return;
        }

        console.log("Documents", projects[0].documents);
        for(var i = 0; i < projects[0].documents.length; i++) {
            if(projects[0].documents[i].name == _document.name){
                cb(null, true);
                return;
            }
        }
        cb(null, false);
    });
};

// on every save, add the date
ProjectSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    
    next();    
});

module.exports = mongoose.model('Project', ProjectSchema, "Projects");