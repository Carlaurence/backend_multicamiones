const mongoose = require ("mongoose")

const FinancialCorpSchema = mongoose.Schema(
    {
        name: {type: String, required:true, trim:true, uppercase:true },
        apr: {type:Number, required:true, trim:true},
        //OBJETOS DE REFERENCIA BY ID
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}

    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model("FinancialCorp", FinancialCorpSchema)