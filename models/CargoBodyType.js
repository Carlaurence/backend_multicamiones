const mongoose = require("mongoose");

const CargoBodyTypeSchema = mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        registerDate: {type: Date, default: Date.now()} 
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("CargoBodyType", CargoBodyTypeSchema)
