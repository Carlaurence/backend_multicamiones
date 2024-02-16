const jwt = require("jsonwebtoken");

module.exports = function (req, res, next){
    //HEADER
    //{KEY:VALUE}
    //{"x-auth-token" : TOKEN}

    const token = req.header("x-auth-token");//TRAER EL TOKEN DESDE EL HEADER
    
    {/*LA FUNCION DE req.header("x-auth-token") =>ES ENTRAR AL HEADER DEL POSTMAN O NAVEDOR,
    BUSCAR LA LLAVE "x-auth-token" Y TRAER SU VALOR Y ALMACENARLO EN cont token*/}

    if(!token){//SI NO DEVUELVE NADA ¡: ENTONCES
        return res.status(404).json({msg: "no hay token"});
    }else{
        try{
            /*jwt.verify VALIDA QUE LA FIRMA DIGITAL RESULTANTE DE (token, process.env.SECRETA) SEA  
            VALIDA Y QUE NO HAYA CADUCADO, Y A SU VEZ RETORNA UN OBJETO JSON DEL CUAL TOMAMOS EL VALOR 
            DEL CAMPO {user:""} Y LO GUARDAMOS EN LA const req.user*/
            const jwtPayload = jwt.verify(token, process.env.SECRETA)
            //console.log(jwtPayload)
            /*SI EL TOKEN HA EXPIRADO, ENTONCES RETORNA ESTE OBJETO:
            {"name": "TokenExpiredError", "message": "jwt expired", "expiredAt": "2023-09-02T00:04:54.000Z"}
            
            PERO SI LA FIRMA DIGITAL ES VALIDA, ENTONCES RETORNA ESTE OBJETO:
            {
                user: { id: '6494e9790f3696aa4c42576d' },
                iat: 1694055514,
                exp: 1696647514
            }*/
            req.user = jwtPayload.user;//ENTONCES req.user = { id: '6494e9790f3696aa4c42576d' }
            //console.log(req.user)
            next();
            /*DESPUES DE QUE EL TOKEN ESTE VERIFICADO CORRECTAMENTE, "next()" ES LA PUERTA DE SALIDA*/
            
            /*NOTA: EL VERIFICADOR DE TOKEN NO RETORNA NADA, SOLO ES UN VERIFICADOR QUE PERMITE O IMPIDE 
                EL ACCESO A UNA URL QUE LO REQUIERA*/
                
        }catch(error){
            res.json(error);
        }
    }
}
/*********************************************************************************************/
/********************LAS FUNCIONES MIDDLEWARE SALEN CON EL COMANDO next();********************/
/************Este next() ME REGRESAR A auth.js, ESPECIFICAMENTE AL router.get()***************/
/*********************************************************************************************/