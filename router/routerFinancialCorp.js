const express = require("express")
const router = express.Router()
const controllerFinancialCorp = require("../controllers/ControllerFinancialCorp")
/**MIDDLEWARE */
const tokenVerifier = require("../middleware/tokenVerifier")

router.post("/", tokenVerifier, controllerFinancialCorp.createFinancialCorp)
router.get("/", controllerFinancialCorp.getFinancialCorp)
router.put("/:id", tokenVerifier, controllerFinancialCorp.updateFinancialCorp)
router.delete("/:id", tokenVerifier, controllerFinancialCorp.deleteFinancialCorp)

module.exports = router;
