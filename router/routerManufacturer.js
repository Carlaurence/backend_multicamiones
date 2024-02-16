const express = require("express");
const router = express.Router();//ESTE ELELEMNTO LLAMA AL TIPO DE PETICION [get, post, put, delete]
const controllerManufacturer = require('../controllers/ControllerManufacturer');//CONEXION AL /CONTROLLER
const tokenVerifier = require('../middleware/tokenVerifier');

router.post('/', tokenVerifier, controllerManufacturer.createManufacturer);
router.delete('/:id', tokenVerifier, controllerManufacturer.deleteManufacturer);//EL {id} LO COGE DEL BODY DEL POSTMAN
router.put('/', tokenVerifier, controllerManufacturer.updateManufacturerANDcreateModel);//EL {id} LO COGE DEL BODY DEL POSTMAN
router.put('/update_model', tokenVerifier, controllerManufacturer.updateModel);
router.put('/delete_model', tokenVerifier, controllerManufacturer.deleteModel);
router.get('/', controllerManufacturer.getAllManufacturers);
router.get('/:id', controllerManufacturer.getManufacturerById);

module.exports = router;