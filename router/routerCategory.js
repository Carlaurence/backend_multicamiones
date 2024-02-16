const express = require("express");
const router = express.Router();//ESTE ELELEMNTO LLAMA AL TIPO DE PETICION [get, post, put, delete]
const controllerCategory = require('../controllers/ControllerCategory');//CONEXION AL /CONTROLLER
const tokenVerifier = require('../middleware/tokenVerifier');

//CONSTRUCCION DE LAS RUTAS SECUNDARIAS URL ASOCIADAS A LAS FUNCIONES DEL CONTROLLER, PARA HACER LAS PETICIONES
//PARA HACER ESTE REQUEST, SE VERIFICARA QUE EL USURIO ESTE AUTENTICADO MEDIANTE EL TOKEN 
router.post("/", tokenVerifier, controllerCategory.createCategory);
//EL tokenVerifier HACE UNA VERIFICACION PREVIA DEL TOKEN REGISTRADO Y LUEGO PERMITE EL PASO A controllerCategory.createCategory
router.get("/", controllerCategory.getAllCategories);
router.get("/:id", controllerCategory.getCategoryById);

module.exports = router;