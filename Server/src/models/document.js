/**
 * Created by daniel on 3/22/17.
 */
var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    name: String, 
    tags: {
        type: [],
        default: []
    },
    content: { 
    	type: String,
    	default: "" 
    },
    shared: {
        type: Boolean,
        default: false
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

DocumentSchema.statics.findByName = function(_id, _name, cb) {
  return this.find({ name: _name, ownerID: _id }, cb);
};

// on every save, add the date
DocumentSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

module.exports = mongoose.model('Document', DocumentSchema, "Documents");
