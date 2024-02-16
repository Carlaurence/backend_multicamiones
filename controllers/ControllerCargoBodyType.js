const { response } = require('express');
const CargoBodyType = require('../models/CargoBodyType');

/************************ CREAR UN TIPO DE FURGON *********************/
/****** http://localhost+puerto+URLprimaria+URLsecundaria *************/
/**************http://localhost:4000/api/cargobodytype+[POST] *********/
/*******************CargoBodyType.save();**************************/
exports.createCargoBodyType = async (req, res) => {
    const { name } = req.body;
    try {
        if (name === "" || name === null || name === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {
            let cargoBody = await CargoBodyType.findOne({ name: name })

            if (cargoBody) {//1º Filtro: SI ENCUENTRA UN OBJETO cargoBodyType QUE TENGA EL MISMO NOMBRE =>
                return res.status(200).json({ msg: "la marca ya existe" });
            } else {
                cargoBody = new CargoBodyType(req.body);//SE CREA EL OBJ Y SU CONSTRUCTOR CON LA DATA DEL BODY
                cargoBody.creatorUserId = req.user.id;//req.user.id ES UN REQUEST QUE SE LE HACE AL payload{user: {id: user.id}}
                const newCargoBody = await cargoBody.save();
                return res.status(200).json({ msg: newCargoBody });
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/***** CONSULTAR LOS TIPOS DE FURGONES EXISTENTES (ALL) **************/
/******http://localhost+puerto+URLprimaria+URLsecundaria**************/
/**************http://localhost:4000/api/cargobodytype+[GET] *********/
/*******************await CargoBodyType.find() ***********************/
exports.getAllCargoBodyTypes = async (req, res) => {
    try {
        const cargoBody = await CargoBodyType.find();
        if (!cargoBody) {//SI NO HAY OBJETOS EN LA BBDD =>
            return res.status(200).json({ msg: "no hay ningun tipo de furgon creado en la bbdd" })
        } else {
            return res.status(200).json({ msg: cargoBody })
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/******************CONSULTAR UN TIPO DE FURGON BY ID ***********************************/
/************** http://localhost+puerto+URLprimaria+URLsecundaria **********************/
/************** http://localhost:4000/api/cargobodytype/:id+[GET] **********************/
/************************** await CargoBodyType.find() *********************************/
exports.getCargoBodyTypeById = async (req, res) => {

    const { id } = req.params;

    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {
            const cargoBody = await CargoBodyType.findById(id);
            if (!cargoBody) {//if null
                return res.status(200).json({ msg: "no hay ningun tipo de furgon con ese id" })
            } else {
                return res.status(200).json({ msg: cargoBody })
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/*********** ELIMINAR UN TIPO DE FURGON *************************************/
/****** http://localhost+puerto+URLprimaria+URLsecundaria *******************/
/************** http://localhost:4000/api/cargobodytype/:id+[DELETE] ********/
/************************ CargoBodyType.delete() ****************************/
exports.deleteCargoBodyType = async (req, res) => {
    const { id } = req.params;
    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {
            const cargoBody = await CargoBodyType.findById(id);
            if (!cargoBody) {//1º Filtro: if null
                return res.status(200).json({ msg: "ID No existe en la BBDD" });
            } else {
                await CargoBodyType.deleteOne({ _id: id })
                return res.status(200).json({ msg: "La marca fue eliminada" });
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/*********** EDITAR/ACTUALIZAR EL NOMBRE DE UN FURGON ***********/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/cargobodytype+[PUT] ****/
/****************** CargoBodyType.save(); ***********************/
exports.updateCargoBodyType = async (req, res) => {
    const { id } = req.body;
    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta. ID Missing" });
        } else {
            const cargoBody = await CargoBodyType.findById(id);//TRAE EL REGISTRO DE LA BBDD
            if (!cargoBody) {//SI NO ENCUENTRA REGISTRO CON EL ID => ENTONCES...
                return res.status(200).json({ msg: "No se encontro Ningun Furgon con el ID ingresado"});
            } else {//VERIFICA SI EL NOMBRE INGRESADO YA EXISTE
                const nameVerifier = await CargoBodyType.findOne({ name: req.body.name })
                if(req.body.name === "" || req.body.name === null || req.body.name === undefined){//SI EL CAMPO name ESTA VACIO => ENTONCES...
                    return res.status(200).json({ msg: "ERROR: data incompleta. NAME Missing"});
                }else if(nameVerifier){//SI nameVerifier ENCUENTRA UN OBJETO => ENTONCES...
                    res.status(200).json({ msg: "el nombre del furgon ya existe" });//EL NOMBRE QUE ESTA INTENTANDO ACTUALIZAR YA EXISTE
                }else {//SI nameVerifier NO ENCUENTRA UN OBJETO => ENTONCES PERMITE QUE SE ACTUALICE CON ESA INFORMACION
                    cargoBody.name = req.body.name || cargoBody.name;// AQUI SE ACTUALIZA EL CAMPO "name"
    
                    //GUARDAR LOS CAMBIOS EN LA BBDD
                    cargoBody.save();//GUARDAR CAMBIOS
                    return res.status(200).json({ msg: cargoBody })
                }
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}