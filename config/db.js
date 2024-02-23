const mongoose = require("mongoose");
const { dbConfig } = require('../config')
mongoose.set('strictQuery', true);

const connectionDB = async() => {
    try{
        const stringConnection = await mongoose.connect(
            `${dbConfig.uri}${dbConfig.name}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log('MongoDB Multicomerciales_V2 conectado...')

    }catch(error){
        console.log(`error : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectionDB;