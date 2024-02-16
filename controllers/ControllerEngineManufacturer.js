const { response } = require('express');
const EngineManufacturer = require('../models/EngineManufacturer');


/************ CREAR UN FABRICANTE DE MOTORES **************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/enginemanufacturer+[POST]*****/
/*******************engineManufacturer.save();**************************/
exports.createEngineManufacturer = async (req, res) => {

    const { make } = req.body;

    try {

        if (make === "" || make === null || make === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {
            let engineManufacturer = await EngineManufacturer.findOne({ make: make })

            if (engineManufacturer) {//1º Filtro: SI ENCUENTRA UN OBJETO engineManufacturer =>
                return res.status(200).json({ msg: "la marca ya existe" });
            } else {
                engineManufacturer = new EngineManufacturer(req.body);
                engineManufacturer.creatorUserId = req.user.id;//req.user.id ES UN REQUEST QUE SE LE HACE AL payload{user: {id: user.id}}
                const newEngineManufacturer = await engineManufacturer.save();
                return res.status(200).json({ msg: newEngineManufacturer });
            }
        }

    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/***** CONSULTAR LOS FABRICANTES DE MOTORES EXISTENTES (ALL) *********/
/******http://localhost+puerto+URLprimaria+URLsecundaria**************/
/**************http://localhost:4000/api/enginemanufacturer/*+*[GET]********/
/*******************await Manufacturer.find()*******************/
exports.getAllEngineManufacturers = async (req, res) => {
    try {
        const engineManufacturer = await EngineManufacturer.find();
        if (!engineManufacturer) {
            return res.status(200).json({ msg: "no hay Marcas creadas en la bbdd" })
        } else {
            return res.status(200).json({ msg: engineManufacturer })
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/******************CONSULTAR FABRICANTE DE MOTORES (BY ID FABRICANTE)*******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria********************************/
/**************http://localhost:4000/api/manufacturer/idenginemanufacturer/:id*+*[GET]********/
/*******************await engineManufacturer.find()*******************/
exports.getEngineManufacturerById = async (req, res) => {

    const { id } = req.params;

    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {
            const engineManufacturer = await EngineManufacturer.findById(id);
            if (!engineManufacturer) {//if null
                return res.status(200).json({ msg: "no hay marca y/o fabricante con ese id" })
            } else {
                return res.status(200).json({ msg: engineManufacturer })
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/************ELIMINAR UN FABRICANTE DE MOTORES***********************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/enginemanufacturer/:id+[DELETE]*****/
/*******************manufacturer.delete();**************************/
exports.deleteEngineManufacturer = async (req, res) => {

    const { id } = req.params;

    try {
        const engineManufacturer = await EngineManufacturer.findById(id);

        if (!engineManufacturer) {//1º Filtro: if null
            return res.status(200).json({ msg: "ID de la Marca No existe en la BBDD" });
        } else {
            await EngineManufacturer.deleteOne({ _id: id })
            return res.status(200).json({ msg: "La marca fue eliminada" });
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/*********** EDITAR/ACTUALIZAR UN FABRICANTE DE MOTORES *********/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/******* http://localhost:4000/api/enginemanufacturer+[PUT] *****/
/************* engineManufacturer.save(); ***********************/
exports.updateEngineManufacturer = async (req, res) => {
    const { id } = req.body;

    try {

        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta. ID Missing" });
        } else {
            const engineManufacturer = await EngineManufacturer.findById(id);//TRAE EL REGISTRO DE LA BBDD
            if (!engineManufacturer) {//SI NO ENCUENTRA REGISTRO CON EL ID => ENTONCES...
                return res.status(200).json({ msg: "No se encontro Marca con el ID ingresado"});
            } else {//VERIFICA SI LA MARCA INGRESADA YA EXISTE
                const makeVerifier = await EngineManufacturer.findOne({ make: req.body.make })
                if(req.body.make === "" || req.body.make === null || req.body.make === undefined){//SI EL CAMPO MAKE ESTA VACIO => ENTONCES...
                    return res.status(200).json({ msg: "ERROR: data incompleta. MAKE Missing"});
                }else if(makeVerifier){//SI makeVerifier ENCUENTRA UN OBJETO => ENTONCES...
                    res.status(200).json({ msg: "la marca ya existe" });//LA MARCA QUE ESTA INTENTANDO ACTUALIZAR YA EXISTE
                }else {//SI makeVerifier NO ENCUENTRA UN OBJETO => ENTONCES PERMITE QUE SE ACTUALICE CON ESA INFORMACION
                    engineManufacturer.make = req.body.make || engineManufacturer.make;// AQUI SE ACTUALIZA EL CAMPO "make"
    
                    //GUARDAR LOS CAMBIOS EN LA BBDD
                    engineManufacturer.save();//GUARDAR CAMBIOS
                    return res.status(200).json({ msg: engineManufacturer })
                }
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}