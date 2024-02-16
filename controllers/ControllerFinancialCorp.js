const { response } = require("express")
const FinancialCorp = require("../models/FinancialCorporation")

/******************CREAR UNA CORP. FINANCIERA ***************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/*http://localhost:4001/api/financialcorp*+*POST + TOKEN ****/
/*******************financialcorp.save();********************/
exports.createFinancialCorp = async(req, res) => {
    const { name, apr } = req.body;
    try{
        const financialcorp = new FinancialCorp({ name, apr}) 
        financialcorp.creatorUserId = req.user.id
        const newFinancialCorp = await financialcorp.save()
        res.status(200).json({ msg: newFinancialCorp })
    }catch(e){
        return res.status(200).json('Error de Try/Catch en el Backend')
    }
}

/******************** GET ALL FINANCIERAS *******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/*http://localhost:4001/api/financialcorp*+*GET *************/
/*******************financialcorp.find();********************/
exports.getFinancialCorp = async(req, res) => {
    try{
        const financialcorps = await FinancialCorp.find() 
        res.status(200).json({ msg: financialcorps })
    }catch(e){
        return res.status(200).json('Error de Try/Catch en el Backend')
    }
}

/******************MODIFICAR UNA CORP. FINANCIERA (BY ID)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*******************/
/*********http://localhost:4001/api/financialcorp/:id*+*[PUT]**************/
/*****************await financialcorp.save()*******************************/
/***********************REQUIERE TOKEN*************************************/ 
exports.updateFinancialCorp = async(req, res) => {
    const { id } = req.params;
    const { name, apr } = req.body;
    try{
        const financialcorp = await FinancialCorp.findById(id) 
        financialcorp.name = name || financialcorp.name
        financialcorp.apr = apr || financialcorp.apr
        //GUARDAR LOS CAMBIOS EN LA BBDD
        financialcorp.save();
        res.status(200).json({msg:financialcorp})
    }catch(e){
        return res.status(200).json('Error de Try/Catch en el Backend')
    }
}

/************ ELIMINAR UNA CORP. FINANCIERA (BY ID) *************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/******http://localhost:4001/api/financialcorp/:id+[DELETE]******/
/*******************financialcorp.delete();**********************/
exports.deleteFinancialCorp = async (req, res) => {
    const { id } = req.params;
    try {
        const financialCorp = await FinancialCorp.findById(id);

        if (!financialCorp) {
            return res.status(200).json({ msg: "Financiera no existe" });
        } else {
            await financialCorp.deleteOne({ _id: id })
            return res.status(200).json({ msg: "La Financiera fue eliminada" });
        }
    } catch (error) {
        return res.status(200).json('Error de Try/Catch en el Backend')
    }
}