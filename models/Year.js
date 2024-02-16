const mongoose = require('mongoose');

const YearSchema = mongoose.Schema(
    {
        year: {type: Number, required: true, trim: true},
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        registerDate: {type: Date, default: Date.now()}
    },

    {
        timestamps: true
    }
    
);

module.exports = mongoose.model('Year', YearSchema)