const { response } = require('express');
const Advertising = require('../models/Advertising');
const cloudinary = require('../cloudinary/cloudinary');//PARA EL USO DE LOS METODOS DE LA API CLOUDINARY
const fs = require('fs-extra');//PARA BORRAR FILES TEMPORALES

/******************CREAR UNA PUBLICIDAD NUEVA********************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**************http://localhost:4000/api/advertisements**[POST]*****/
/*******************advertising.save();**************************/
exports.createAdvertising = async (req, res) => {
    const { description } = req.body;
    try {
        const advertising = new Advertising({ description }); 
        if (req.files?.image) {
            const response = await cloudinary.uploadImage(req.files.image.tempFilePath)//image => depende del nombre que le asignemos al objeto req.file en el key del formData 
            advertising.image = {
                public_id: response.public_id,
                secure_url: response.secure_url
            }
            await fs.unlink(req.files.image.tempFilePath)//borrar los archivos de la carpeta temporal .8uploads
            advertising.creatorUserId = req.user.id;//Traido del payload
            const newAdvertising = await advertising.save();//Guardar registro en la Base de Datos
            res.status(200).json(newAdvertising)//NO SE PONE msg: PORQUE EL response ES AXIOS
        }else{
            return res.status(200).json("ERROR: No llego ningun file al backend!");
        }
    } catch (error) {
        return res.status(200).json('Error de Try/Catch en el Backend')
    }
}

/************************GET ALL ADVERTISEMENTS******************/
/******http://localhost:puerto+URLprimaria+URLsecundaria*****/
/********http://localhost:4001/api/advertisements*+ [GET]*********/
exports.getAllAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertising.find();
        return res.status(200).json( { msg: advertisements} )
    } catch (error) {
        return res.status(200).json({ msg:'Error de Try/Catch en el Backend'})
    }
}

/******************ELIMINAR UNA PUBLICIDAD **********************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*********/
/**** http://localhost:4001/api/advertisements/:id**[DELETE]*****/
/*******************advertising.delete();**************************/
exports.deleteAdvertisement = async (req, res) => {
    const { id } = req.params;
    try {
        const advertising = await Advertising.findById(id)
        if(!advertising){
            return res.status(200).json({ msg: "Backend: Publicidad no existe" })
        }else { 
            /**BORRADO DE CLOUDINARY */
            await cloudinary.deleteImage(advertising.image.public_id)
            /**BORRADO DE MONGODB */
            await advertising.deleteOne({ _id: id })
            return res.status(200).json({ msg: "Backend: Publicidad borrada" })
        }
    } catch (error) {
        return res.status(200).json({msg: 'Error de Try/Catch en el Backend'})
    }
}