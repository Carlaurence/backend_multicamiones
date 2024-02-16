/************************************MONGOOSE - ORM*********************************************/
const mongoose = require("mongoose");/******IMPORTANDO EL ORM: OBJECT RELATIONAL MAPPING********/
/*MONGOOSE: SE ENCARGA DE LLEVAR Y RELACIONAR LOS OBJETOS DE ESTA CLASE MODELO=> A LA BBDD MONGODB*/
/***********************************************************************************************/

/**********************************CLASE MODELO => CATEGORIA************************************/
/*********CREARNDO LA CLASE-MODELO QUE REPRESENTARA LA TABLA: CATEGORIA EN LA BBDD**************/
/********************SETTEANDO LAS PROPIEDADES DE CADA CAMPO DE LA TABLA************************/
const UserSchema = mongoose.Schema(
    {
        name:{type: String, required: true, trim: true},
        lastname:{type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true, unique: true},
        password: {type: String, required: true, trim: true},
        registerDate: {type: Date, default: Date.now()}
    },

    {
        timestamps: true
    }
    
);
/*****************PROPIEDADES******************/
//trim: true es una propiedad para eliminar espacios en la informacion recibida y almacenar en la BD sin espacios
//required: true es una propiedad para que no manden nullos o vacios. igual que el NOT NULL
//unique: true. propiedad para evitar que se repita esa informacion. ejemplo: un correo electronico no se puede repetir
//MongoDB nos crea ID automaticamente
//Todas estas propiedades se encuentran en https://mongoosejs.com/docs/guide.html

/*********DEFINIR NOMBRE DEL MODELO "multicomUser" Y LO EXPORTA**********/
module.exports = mongoose.model("User", UserSchema)//EN BBDD LA TABLA VA A QUEDAR REGISTRADA AS multicomUser

//userIP:{type:String, required: false, trim:true, unique:true}//ESTA GENERANDO