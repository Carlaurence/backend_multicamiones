const { response } = require("express");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({path: "variables.env"});

/******CREAR UN TOKEN SI, SOLO SI EL USUARIO EXISTE**********/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/******http://localhost:4000/api/token/*+ Request:[POST]*****/
/*******************jwt.sign();*******************/
/**AQUI SE VA A GENERAR EL TOKEN MEDIANTE LA FUNCION  createToken() SOLO SI EL USUARIO INGRESADO EXISTE EN LA BBDD*/
/*INGRESAMOS AL POSTMAN 
    - REQUEST "POST",
    -INGRESAMOS URL: http://localhost:4000/api/login/ 
    -INGRESAMOS EL JSON EN CONSOLA CON DOS DATOS: 
    EJEMPLO:
    {
        "email": "XYZ123***"", 
        "password": "123456"
    } 
    NOTA: SI EL USUARIO EXISTE EN LA BBDD, NOS ENVIA COMO RESPUESTA AL POSTMAN, EL TOKEN GENERADO*/
exports.createToken = async (req, res) => {
    const { password, email } = req.body;
    try{
        const user = await User.findOne({email});

        if(!email || !password){//Verificar que usuario ingrese, al menos, un email para buscarlo si ya existe en BBDD 
            return res.status(200).json({msg: "Todos los campos son obligatorios"});
        }else if(!user){
            return res.status(200).json({msg: "Usuario No existe!"})
        }else{
            const passwordCompare = await bcryptjs.compare(password, user.password);
            if(!passwordCompare){
                return res.status(200).json({msg: "Password incorrecto!"});
            }else{//SI EL USUARIO EXISTE => ENTONCES NOS RETORNA UN TOKEN
                const payload = { user: {id: user._id} }

                jwt.sign(
                    payload,
                    process.env.SECRETA,
                    { expiresIn: '10m' },
                    (error, token) => {
                        //SI HAY UN ERROR, RETORNE 'ERROR'
                        if(error) throw error;
                        //SI NO HAY NINGUN ERROR, RETORNE EL TOKEN GENERADO
                        res.json({token});//AQUI MUESTRA EL TOKEN EN CONSOLA POSTMAN
                        //{ token: "mcdkmkd5454fdf44dff5" }
                    }
                )
            }
        }
    }catch(error){
        res.json({ msg: error.message })
    }
};

/*******CONSULTAR EL USUARIO A QUIEN PERTENECE UN TOKEN MEDIANTE EL PAYLOAD*********/
/******http://localhost+puerto+URLprimaria+URLsecundaria********/
/******http://localhost:4000/api/login/*+ Request:[GET]*********/
exports.getAuthenticatedUserInfo = async (req, res) => {//SOLO PARA VALIDAR EL FUNCIONAMIENTO DEL tokenVerifier() 
    try{
        const user = await User.findById(req.user.id);//NOT IMPORTANTE: (req.user.id) => TRAE EL USER.ID DEL PAYLOAD 
        res.json({user});//RETORNA LA INFO DEL USUARIO QUE SE AUTENTICO OSEA, EL MISMO DEL PAYLOAD
    }catch(error){
        res.json(error);
    }
}