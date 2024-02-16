/************************************MONGOOSE - ORM*********************************************/
const mongoose = require("mongoose");/******IMPORTANDO EL ORM: OBJECT RELATIONAL MAPPING********/
/*MONGOOSE: SE ENCARGA DE LLEVAR Y RELACIONAR LOS OBJETOS DE ESTA CLASE MODELO=> A LA BBDD MONGODB*/
/***********************************************************************************************/

/**********************************CLASE MODELO => CATEGORIA************************************/
/*********CREARNDO LA CLASE-MODELO QUE REPRESENTARA LA TABLA: CATEGORIA EN LA BBDD**************/
/********************SETTEANDO LAS PROPIEDADES DE CADA CAMPO DE LA TABLA************************/
const CustomerSchema = mongoose.Schema(
    {
        identificationNumber: {type: String, required: true, trim: true},//cedula de ciudadanian extranjeria, passport
        name:{type: String, required: true, trim: true},
        firstAddress: {type: String, required: true, trim: true},
        secondAddress: {type: String, required: false, trim: true},
        city: {type: String, required: true, trim: true},
        country: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true, unique: true},
        phoneNumber: {type: String, required: true, trim: true},
        registerDate: {type: Date, default: Date.now()},
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
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
module.exports = mongoose.model("Customer", CustomerSchema)//EN BBDD LA TABLA VA A QUEDAR REGISTRADA AS multicomCustomer
