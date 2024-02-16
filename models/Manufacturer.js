const mongoose = require("mongoose");

const ManufacturerSchema = mongoose.Schema(
    {
        make: {type: String, required: true, trim: true},
        model: [{type:String, trim:true}],
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        registerDate: {type: Date, default: Date.now()}
    },

    {
        timestamps: true
    }

);

module.exports = mongoose.model("Manufacturer", ManufacturerSchema)
