const User = require("../models/User");//Para hacer uso de las funciones CRUD
const bcryptjs = require("bcryptjs");//Para encriptar el password y guardarlo encriptado en la BBDD

/******************CREAR UN USUARIO******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/**************http://localhost:4000/api/user/*+*[POST]********/
/*******************user.save();*******************/
/*CREAMOS LA FUCION ASYNC QUE CONTIENE LA LOGICA Y LA FUNCION DEL CRUD user.save();*/
exports.createUser = async (req, res) => {
    
    const {email} = req.body;//Request de consola de los datos ingresados por el usuario

    try{
        let user = await User.findOne({email});
        if(!email){//1º Filtro: Verificar que usuario ingrese, al menos, un email para buscarlo si ya existe en BBDD 
            console.log("el email es obligatorio")
            return res.status(200).json({msg: "Email: Es un campo obligatorio!"});
        }else if(user){//2º Filtro:  
            return res.status(200).json({msg: "Usuario ya existe"});
        }else if(!req.body.name || !req.body.lastname || !req.body.password){//3º Filtro:Verificar que todos los campos esten diligenciados
            return res.status(200).json({msg: "Todos los campos son obligatorios"});
        }else{
            user = new User(req.body);//crear un nuevo Obj Usuario 
            user.password = await bcryptjs.hash(req.body.password, 10);//hash: Para hashear/encriptar password con 10 vueltas
            const newUser = await user.save();//Guardar registro en la Base de Datos
            res.json(newUser)
        }    
    }catch(error){
        res.json(error);
    }
}