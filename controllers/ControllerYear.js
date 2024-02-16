const { response } = require('express');
const Year = require('../models/Year');

/************************ CREAR UN AÑO ********************************/
/****** http://localhost+puerto+URLprimaria+URLsecundaria *************/
/************** http://localhost:4000/api/year+[POST] *********/
/*******************Year.save();**************************/
exports.createYear = async (req, res) => {

    const { year } = req.body;

    try {
        if (year === "" || year === null || year === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        }else {
            let findYear = await Year.findOne({ year: year })//BUSCAR SI EL AÑO QUE SE DESEA CREAR, YA EXISTE

            if (findYear) {//SI EL AÑO YA EXISTE =>
                return res.status(200).json({ msg: "el año ya existe" });
            } else {
                const newYear = new Year(req.body);//SE CREA EL OBJ Y SU CONSTRUCTOR CON LA DATA DEL BODY
                newYear.creatorUserId = req.user.id;//req.user.id ES UN REQUEST QUE SE LE HACE AL payload{user: {id: user.id}}
                await newYear.save();//GUARDA CAMBIOS
                return res.status(200).json({ msg: 'Año Creado' });
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/************ CONSULTAR TODOS LOS AÑOS EXISTENTES (ALL) **************/
/******http://localhost+puerto+URLprimaria+URLsecundaria**************/
/**************http://localhost:4000/api/year+[GET] *********/
/*******************await Year.find() ***********************/
exports.getAllYears = async (req, res) => {
    try {
        const years = await Year.find().sort({year: 1});//.sort({year: 1}) ORDENA LA INFO DEL OBJETO EN REF. AL CAMPO 'year' DE FORMA ASCENDENTE
        if (!years) {//SI NO HAY OBJETOS EN LA BBDD =>
            return res.status(200).json({ msg: "no hay años creados en la bbdd" })
        } else {
            return res.status(200).json({ msg: years })
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/**************************** CONSULTAR UN AÑO BY ID ***********************************/
/************** http://localhost+puerto+URLprimaria+URLsecundaria **********************/
/************** http://localhost:4000/api/year/:id+[GET] **********************/
/************************** await Year.find() *********************************/
exports.getYearById = async (req, res) => {

    const { id } = req.params;

    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {
            const findYear = await Year.findById(id);
            if (!findYear) {//SI NO HAY OBJETOS EN LA BBDD CON ESE ID =>
                return res.status(200).json({ msg: "ERROR: no hay años creados con ID ingresado" })
            } else {
                return res.status(200).json({ msg: findYear })
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}



/********************** ELIMINAR UN AÑO DE LA BBDD **************************/
/****** http://localhost+puerto+URLprimaria+URLsecundaria *******************/
/*************** http://localhost:4000/api/year/:id+[DELETE] ****************/
/*************************** Year.delete() **********************************/
exports.deleteYear = async (req, res) => {

    const { id } = req.params;

    try {
        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta" });
        } else {

            const year = await Year.findById(id);

            if (!year) {//SI NO HAY OBJETOS EN LA BBDD =>
                return res.status(200).json({ msg: "ERROR: no hay años creados con ID ingresado" })
            } else {
                await Year.deleteOne({ _id: id })
                return res.status(200).json({ msg: "El Año fue eliminada" });
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}

/******************* EDITAR/ACTUALIZAR UN AÑO *******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/year+[PUT] ****/
/****************** Year.save(); ***********************/
exports.updateYear = async (req, res) => {
    
    const { id } = req.body;

    try {

        if (id === "" || id === null || id === undefined) {
            return res.status(200).json({ msg: "ERROR: data incompleta. ID Missing" });
        } else {
            const findYear = await Year.findById(id);//TRAE EL REGISTRO DE LA BBDD
            if (!findYear) {//SI NO ENCUENTRA REGISTRO CON EL ID => ENTONCES...
                return res.status(200).json({ msg: "ERROR: no hay años creados con ID ingresado"});
            } else {//VERIFICA SI EL AÑO INGRESADO YA EXISTE
                const yearVerifier = await Year.findOne({ year: req.body.year })

                if(yearVerifier){//SI yearVerifier ENCUENTRA UN OBJETO => ENTONCES...
                    res.status(200).json({ msg: "el año ya existe" });//EL AÑO QUE ESTA INTENTANDO ACTUALIZAR YA EXISTE
                }else {//PERO SI yearVerifier NO ENCUENTRA UN OBJETO => ENTONCES PERMITE QUE SE ACTUALICE CON ESA INFORMACION
                    findYear.year = req.body.year || findYear.year;// AQUI SE ACTUALIZA EL CAMPO "year"
    
                    //GUARDAR LOS CAMBIOS EN LA BBDD
                    findYear.save();//GUARDAR CAMBIOS
                    return res.status(200).json({ msg: findYear })
                }
            }
        }
    } catch (error) {
        res.json({ msg: "error de try / catch" })
    }
}