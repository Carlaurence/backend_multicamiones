const { response } = require("express");
const Category = require("../models/Category");//CONEXION AL MODELO/TABLA

/*NOTA IMPORTANTE: LAS CATEGORIAS QUEDARON DEFINIDAS DESDE EL ARRANQUE DEL PROYECTO Y NO TENDRAN
    INTERFAZ GRAFICA DESDE EL FRONT PARA SER MODIFICAS, ELEMINADAS NI PARA AGREGAR NUEVAS.
    THEREFORE CUALQUIER MODIFICACION O ADICION DE CATEGORIAS SE HARA DIRECTAMENTE DESDE EL POSTMAN Y
    CON PREVIA AUTENTICACION.

    PARA EVITAR MODIFICACION ERRONEAS DE ALGUNO DE LOS USUARIOS ADMIN, LAS FUNCIONES CRUD CREADAS EN ESTE 
    CONTROLER LAS DEJAREMOS INACTIVAS PARA EVITAR ERRORES
*/

/******************CREAR UNA CATEGORIA******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/**************http://localhost:4000/api/category/**********/
/*******************category.save();*******************/
/*CREAMOS LA FUCION ASYNC QUE CONTIENE LA LOGICA Y LA FUNCION DEL CRUD category.save();*/
/**Para crear una categoria solo necesitamos el nombre: ""*/
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        if(!req.body.name){//1º Filtro 
            return res.status(200).json({msg: "ERROR: Email es un campo obligatorio!"});
        }else{
            const category = new Category(req.body);//crear un nuevo Obj Category
            category.creatorUserId = req.user.id;//req.user.id ES UN REQUEST QUE SE LE HACE AL payload{user: {id: user.id}} 
            //DESDE /controllerToken en la funcion crearToken() LA CUAL NOS RETORNA EL ID DEL USUARIO AUTENTICADO  
            const newCategory = await category.save();//Guardar registro en la Base de Datos
            res.json(newCategory)
        }
    }catch(error){
        res.json(error)
    }
}

/************************GET ALL CATEGORIAS******************/
/******http://localhost:puerto+URLprimaria+URLsecundaria*****/
/********http://localhost:4000/api/category/*+ [GET]*********/
exports.getAllCategories = async (req, res) => {
    try{
        const category = await Category.find();
        res.status(202).json({category})
    }catch(error){
        res.json(error)
    }
}

/************************GET CATEGORIAS BY ID****************************/
/******http://localhost:puerto+URLprimaria+URLsecundaria/:idCategory****/
/********http://localhost:4000/api/category/:id*+ [GET]*********/
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try{
        const category = await Category.findById(id)
        if(!category){
            return res.status(200).json({ msg: 'Categoria No Existe' })    
        }else{
            res.status(200).json({ msg: category })
        }
    }catch(error){
        res.status(200).json({ msg: 'Error de Try/Catch en el Backend' })
    }
}