/**
 * Created by daniel on 3/29/17.
 */
var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    description: { 
    	type: String,
    	default: "" 
    },
    hotkey: String,
    inputs: {
        type: [],
        default: []
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

module.exports = mongoose.model('Tag', TagSchema, "Tags");
