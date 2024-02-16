const express = require("express"); 
const router = express.Router();
const controllerToken = require("../controllers/controllerToken");
const tokenVerifier = require("../middleware/tokenVerifier");

//CONSTRUCCION DE LAS RUTAS SECUNDARIAS URL ASOCIADAS A LAS FUNCIONES DEL CONTROLLER, PARA HACER LAS PETICIONES 
router.post("/", controllerToken.createToken);
router.get("/", tokenVerifier, controllerToken.getAuthenticatedUserInfo);
{/*NOTA: router.get() ES SOLO PARA PROBAR QUE EL "tokenVerifier" FUNCIONA CORRECTAMENTE
    ENTONCES, EL "tokenVerifier" LO QUE HACE ES COMPROBAR QUE EL TOKEN QUE SE INGRESA EN 
    EL HEADER O EN EL LOCALSTORE DEL NAVEGADOR SEA CORRECTO PARA PODER PERMITIR EL ACCESO
    A LA URL ASOCIADA A "http://localhost:4000/api/token/" + [GET] LA CUAL NOS RETORNA
    DE VUELTA TODOS LOS DATOS DEL USUARIO QUE SE AUTENTICO
*/}

module.exports = router;