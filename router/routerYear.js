const express = require('express');//FRAMEWORK DE NODE JS
const controllerYear = require('../controllers/ControllerYear');//CONEXION AL CONTROLLER
const tokenVerifier = require('../middleware/tokenVerifier');
const router = express.Router();//ELEMENTO QUE INVOCA EL REQUEST (POST, GET, PUT, DELETE)

router.post('/', tokenVerifier, controllerYear.createYear);
router.get('/', controllerYear.getAllYears);
router.delete('/:id', tokenVerifier, controllerYear.deleteYear);
router.put('/', tokenVerifier, controllerYear.updateYear);
router.get('/:id', controllerYear.getYearById);

module.exports = router;