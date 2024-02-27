const express = require('express');
const router = express.Router();
const controllerAdvertising = require('../controllers/ControllerAdvertising');
const tokenVerifier = require('../middleware/tokenVerifier');
/**MIDDLEWARE */
//HABILITAN LOS REQ.FILES
const fileUpload = require('express-fileupload')
//PONEMOS LOS MIDDLEWARE EN UNA CONST PARA USAR SUS METODOS Y REQ.FILES
const uploadExpress = fileUpload({ useTempFiles : true, tempFileDir : process.env.VERCEL_TMPDIR})

router.post("/", tokenVerifier, uploadExpress, controllerAdvertising.createAdvertising);
router.get("/", controllerAdvertising.getAllAdvertisements);
router.delete("/:id", tokenVerifier, controllerAdvertising.deleteAdvertisement);

module.exports = router;