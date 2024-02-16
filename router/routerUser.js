const express = require("express");
const router = express.Router();//ESTE ELELEMNTO LLAMA AL TIPO DE PETICION [get, post, put, delete]
const controllerUser = require("../controllers/controllerUser");//CONEXION AL /CONTROLLER
const tokenVerifier = require("../middleware/tokenVerifier");

//CONSTRUCCION DE LAS RUTAS SECUNDARIAS URL ASOCIADAS A LAS FUNCIONES DEL CONTROLLER, PARA HACER LAS PETICIONES
router.post("/", controllerUser.createUser);

module.exports = router;