const mongoose = require('mongoose');
const AdvertisingSchema = mongoose.Schema(
    {
        description: {type: String, required: true, trim: true},
        image: {
            public_id: String, 
            secure_url: String
        },
        
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        registerDate: {type: Date, default: Date.now()}
    },

    {
        timestamps: true
    }
    
);
module.exports = mongoose.model("Advertising", AdvertisingSchema)