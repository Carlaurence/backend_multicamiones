const { response } = require('express');
const Manufacturer = require('../models/Manufacturer');


/******************CONSULTAR LOS FABRICANTES EXISTENTES (ALL)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/**************http://localhost:4000/api/manufacturer/*+*[GET]********/
/*******************await Manufacturer.find()*******************/
exports.getAllManufacturers = async (req, res) => {
    try {
        const manufacturers = await Manufacturer.find();
        if (!manufacturers) {
            return res.status(200).json({ msg: "no hay Marcas creadas en la bbdd" })
        } else {
            return res.status(200).json({ msg: manufacturers })
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/******************CONSULTAR FABRICANTE (BY ID)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria************/
/**************http://localhost:4000/api/manufacturer/:id*+*[GET]********/
/*******************await manufacturer.find()*******************/
exports.getManufacturerById = async (req, res) => {

    const { id } = req.params;

    try {
        if(id === "" || id === null || id === undefined){
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else{
            const manufacturer = await Manufacturer.findById(id);
            if (!manufacturer) {//if null
                return res.status(200).json({ msg: "no hay marca y/o fabricante con ese id" })
            } else {
                return res.status(200).json({ msg: manufacturer })
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/************CREAR UNA MARCA DE CAMIONES**************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/manufacturer+[POST]*****/
/*******************manufacturer.save();**************************/
/*CREAMOS LA FUCION ASYNC QUE CONTIENE LA LOGICA Y LA FUNCION DEL CRUD manufacturere.save();*/
exports.createManufacturer = async (req, res) => {

    const { make } = req.body;

    try {
        let manufacturer = await Manufacturer.findOne({ make: make })

        if (!make) {//1º Filtro
            return res.status(200).json({ msg: "ERROR: Todos los campos obligatorios!" });
        } else if (manufacturer) {//2º Filtro
            return res.status(200).json({ msg: "la marca ya existe" });
        } else {
            manufacturer = new Manufacturer(req.body);
            manufacturer.creatorUserId = req.user.id;//req.user.id ES UN REQUEST QUE SE LE HACE AL payload{user: {id: user.id}}
            const newManufacturer = await manufacturer.save();
            return res.status(200).json({ msg: newManufacturer });
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}


/************ELIMINAR UNA MARCA DE CAMIONES**************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/manufacturer/:id+[DELETE]*****/
/*******************manufacturer.delete();**************************/
exports.deleteManufacturer = async (req, res) => {

    const { id } = req.params;

    try {
        const manufacturer = await Manufacturer.findById(id);

        if (!manufacturer) {//1º Filtro: if null
            return res.status(200).json({ msg: "ID de la Marca No existe en la BBDD" });
        } else {
            await Manufacturer.deleteOne({ _id: id })
            return res.status(200).json({ msg: "La marca fue eliminada" });
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/*** EDITAR/ACTUALIZAR UNA MARCA DE CAMIONES Y CREAR UN MODELO***/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/manufacturer+[PUT]******/
/*******************manufacturer.save();*************************/
/***********************REQUIERE TOKEN***************************/
/* NOTA IMPORTANTE: ESTE REQUEST PRESTA 2 SERVICIOS *************
*  1- EL PRIMERO: MODIFICA UNA MARCA, Y LA DATA REQUERIDA ES {id, make}**
*  2- CREA UN MODELO NUEVO, Y LA DATA REQUERIDA ES {is, model} *********/
exports.updateManufacturerANDcreateModel = async (req, res) => {
    const { id } = req.body;

    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta. ID Missing" });
        } else {
            const manufacturer = await Manufacturer.findById(id);//TRAE EL REGISTRO DE LA BBDD
            if (!manufacturer) {//SI NO ENCUENTRA REGISTRO CON EL ID => ENTONCES...
                return res.status(200).json({ msg: "No se encontro Marca con el ID ingresado"});
            } else {
                /*OPCION #1: 
                EN EL CASO DE LLAMAR EL REQUEST PARA ACTUALIZAR UN FABRICANTE, VERIFICA SI EL NOMBRE
                DEL FABRICANTE QUE SE DESEA USAR, YA EXISTE EN LA BBDD, MEDIANTE makeVerifier *******/
                const makeVerifier = await Manufacturer.findOne({ make: req.body.make })
                
                /*OPCION #2:
                EN EL CASO DE LLAMAR EL REQUEST PARA CREAR UN MODELO, VERIFICA SI EL MODELO
                QUE SE DESEA USAR, YA EXISTE EN LA BBDD, MEDIANTE modelVerifier *************/
                const modelVerifier = await Manufacturer.findOne({ model: req.body.model })
                
                if (makeVerifier) {//makeVerifier === true, SI ENCUENTRA UN OBJETO CON EL {make: req.body.make} ENTONCES YA EXISTE
                    res.status(200).json({ msg: "la marca ya existe" });//NO PERMITE QUE UN MAKE SE REPITA
                }else if (modelVerifier) {//modelVerifier === true, SI ENCUENTRA UN OBJETO CON EL {model: req.body.model} ENTONCES YA EXISTE
                    res.status(200).json({ msg: "el modelo ya existe" });//NO PERMITE QUE UN MODEL SE REPITA
                } else {

                    /*EN CASO DE LLAMAR EL REQUEST PARA ACTUALIZAR UN FABRICANTE, AQUI SE SETEA EL NUEVO NOMBRE*/
                    manufacturer.make = req.body.make || manufacturer.make;// AQUI SE ACTUALIZA EL CAMPO "make"       
                    
                    /*EN EL CASO DE LLAMAR EL REQUEST PARA CREAR UN MODELO ENTONCES EL CONDICIONAL
                    (req.body.model), TIENE QUE SER TRUE, Y ENTONCES SE EJECUTA EL .push()*/
                    if (req.body.model) {
                        manufacturer.model.push(req.body.model);//AQUI SE CREA UN MODELO NUEVO
                    }

                    //GUARDAR LOS CAMBIOS EN LA BBDD
                    manufacturer.save();//GUARDAR CAMBIOS
                    return res.status(200).json({ msg: manufacturer })
                }                
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/************EDITAR UN MODELO BY ID MARCA************************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/manufacturer/update_model+[PUT]******/
/*******************manufacturer.save();*************************/
/***********************REQUIERE TOKEN***************************/
exports.updateModel = async (req, res) => {
    const { id, updatedModel, position } = req.body;
    try {
        //SOLO COMPROBACION DE VALORES TRAIDOS DEL BODY
        //console.log("id: " + id + " updatedModel: " + updatedModel + " position: " + position)

        if(id === "" || id === null || id === undefined){
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else if(updatedModel === "" || updatedModel === null || updatedModel === undefined){
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else if(position === "" || position === null || position === undefined){
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else {
            const manufacturer = await Manufacturer.findById(id);
            if (!manufacturer) {
                return res.status(200).json({ msg: "ERROR: No hay Marcas con 'id' ingresado" });
            } else {
                manufacturer.model[position] = updatedModel;
                //GUARDAR LOS CAMBIOS EN LA BBDD
                manufacturer.save();//GUARDAR CAMBIOS
                return res.status(200).json({ msg: manufacturer })
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/****************** ELIMINAR UN MODELO ****************************/
/******http://localhost+puerto+URLprimaria+URLsecundaria***********/
/**************http://localhost:4000/api/manufacturer/delete_model+[PUT]*****/
/*******************manufacturer.save();**************************/
exports.deleteModel = async (req, res) => {

    const { id, position } = req.body;

    try {
        //SOLO COMPROBACION DE VALORES TRAIDOS DEL BODY
        //console.log("id: " + id + " position: " + position)

        if(id === "" || id === null || id === undefined){
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else if(position === "" || position === null || position === undefined){
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else {
            const manufacturer = await Manufacturer.findById(id);
            if (!manufacturer) {
                return res.status(200).json({ msg: "ERROR: No hay Marcas con 'id' ingresado" });
            } else {
                manufacturer.model.splice(position, 1)
                manufacturer.save();//GUARDAR CAMBIOS
                return res.status(200).json({ msg: manufacturer })
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}