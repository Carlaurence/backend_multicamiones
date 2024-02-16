/************************************MONGOOSE - ORM*********************************************/
const mongoose = require("mongoose");/******IMPORTANDO EL ORM: OBJECT RELATIONAL MAPPING********/
/*MONGOOSE: SE ENCARGA DE LLEVAR Y RELACIONAR LOS OBJETOS DE ESTA CLASE MODELO=> A LA BBDD MONGODB*/
/***********************************************************************************************/

/*NOTA IMPORTANTE: LAS CATEGORIAS QUEDARON DEFINIDAS DESDE EL ARRANQUE DEL PROYECTO Y NO TENDRAN
    INTERFAZ GRAFICA DESDE EL FRONT PARA SER MODIFICAS, ELEMINADAS NI PARA AGREGAR NUEVAS.
    THEREFORE CUALQUIER MODIFICACION O ADICION DE CATEGORIAS SE HARA DIRECTAMENTE DESDE EL POSTMAN Y
    CON PREVIA AUTENTICACION
*/

/**********************************CLASE MODELO => CATEGORIA************************************/
/*********CREARNDO LA CLASE-MODELO QUE REPRESENTARA LA TABLA: CATEGORIA EN LA BBDD**************/
/********************SETTEANDO LAS PROPIEDADES DE CADA CAMPO DE LA TABLA************************/
const CategorySchema = mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        registerDate: {type: Date, default: Date.now()}
    },

    {
        timestamps: true
    }
    
);/********************************************************************************************/
//imageURL: {type: String, required: true, trim: true}//QUEDARA PENDIENTE
/********************DEFINIENDO NOMBRE DEL MODELO "Categoria" Y EXPORTALO***********************/
module.exports = mongoose.model("Category", CategorySchema)
/***********************************************************************************************/


/************************PROPIEDADES DE LA TABLA CATEGORIA:*************************************/
/**********type: String => Almacena datos de tipo String****************************************/
/**********require: true => No acepta nullos****************************************************/
/**********type: Date => Tipo fecha*************************************************************/
/**********default: true => Formato por default MM/DD/YY/***************************************/
/**********trim: true => Elimina los espacios y almacena en BD todo junto***********************/
/***********************************************************************************************/
