const express = require("express");
const router = express.Router();//ESTE ELELEMNTO HACE LAS PETICION [get, post, put, delete]
const controllerCargoBodyType = require('../controllers/ControllerCargoBodyType');//CONEXION AL /CONTROLLER
const tokenVerifier = require('../middleware/tokenVerifier');

router.post('/', tokenVerifier, controllerCargoBodyType.createCargoBodyType);
router.get('/', controllerCargoBodyType.getAllCargoBodyTypes);
router.get('/:id', controllerCargoBodyType.getCargoBodyTypeById);
router.delete('/:id', tokenVerifier, controllerCargoBodyType.deleteCargoBodyType);
router.put('/', tokenVerifier, controllerCargoBodyType.updateCargoBodyType);


module.exports = router;