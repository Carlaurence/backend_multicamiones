/************************************MONGOOSE - ORM*********************************************/
const mongoose = require("mongoose");/******IMPORTANDO EL ORM: OBJECT RELATIONAL MAPPING********/
/*MONGOOSE: SE ENCARGA DE LLEVAR Y RELACIONAR LOS OBJETOS DE ESTA CLASE MODELO=> A LA BBDD MONGODB*/
/***********************************************************************************************/

/**********************************CLASE MODELO => PRODUCTO*************************************/
/*********CREARNDO LA CLASE-MODELO QUE REPRESENTARA LA TABLA: PRODUCTO EN LA BBDD***************/
/********************SETTEANDO LAS PROPIEDADES DE CADA CAMPO DE LA TABLA************************/
const ProductSchema = mongoose.Schema(
    {
        make: {type: String, required: true, trim: true, uppercase:true},
        model: {type: String, required: true, trim: true, uppercase:true},
        year: {type: Number, required: true, trim: true},
        odometer: {type: Number, required: true, trim: true},
        engineManufacturer: {type: String, required: true, trim: true, uppercase:true},
        gvwr: {type: Number, required: true, trim: true},//Gross Vehicle Weight Rating = Capacidad de carga
        cargoBodyType: {type: String, required: true, trim: true, uppercase:true},//only these options => Boxtruck, Refrigerated, Lorry Wooden Body "carroceria Madera", flatbed "Planchon", other 
        length: {type: Number, required: true, trim: true},//largo
        width: {type: Number, required: true, trim: true},//ancho
        height: {type: Number, required: true, trim: true},//altura
        price: {type: Number, required: true, trim: true},
        
        images: [{
            public_id: String, 
            secure_url: String
        }],
        
        //OBJETOS DE REFERENCIA BY ID
        creatorUserId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
        categoryId: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
        manufacturerId: {type: mongoose.Schema.Types.ObjectId, ref:"Manufacturer"},
        registerDate: {type: Date, default: Date.now()}
    },

    {
        timestamps: true
    }

);/********************************************************************************************/
//customerId: {type: mongoose.Schema.Types.ObjectId, required:false, ref: "multicomCustomer"}//PENDIENTE
/********************DEFINIR NOMBRE DEL MODELO "multicomProduct" Y EXPORTARLO**************************/
module.exports = mongoose.model("Product", ProductSchema)/***********************************/
/***********************************************************************************************/


/************************PROPIEDADES DE LA TABLA PRODUCTO:**************************************/
/**********type: String => Almacena datos de tipo String****************************************/
/**********require: true => No acepta nullos****************************************************/
/**********type: Date => Tipo fecha*************************************************************/
/**********default: true => Formato por default MM/DD/YY/***************************************/
/**********trim: true => Elimina los espacios y almacena en BD todo junto***********************/
/***********************************************************************************************/