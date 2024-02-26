const { response } = require("express");
//INSTANCIAMOS UN ELEMENTO/OBJ DE LA TABLA "multicomProduct.js" PARA PODER INSTANCIAR LAS FUNCIONES DEL CRUD 
const Product = require('../models/Product');//CONEXION AL MODELO/TABLA
const Category = require('../models/Category');//PARA LLAMAR A LA CATEGORIA MEDIANTE EL /:ID DEL PARAMS
const cloudinary = require('../cloudinary/cloudinary');//PARA EL USO DE LOS METODOS DE LA API CLOUDINARY
const fs = require('fs-extra');//PARA BORRAR FILES TEMPORALES

/******************CREAR UN PRODUCTO FORM-DATA***************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/********http://localhost:4000/api/product/:id*+*POST *******/
/*******************product.save();*******************/
exports.createProduct = async (req, res) => {
    const { id } = req.params;//CategoryID
    const { make, manufacturerId, model, year, odometer, engineManufacturer, gvwr, cargoBodyType, length, width, height, price } = req.body;
    res.setHeader('Access-Control-Allow-Origin', 'https://frontend-multicamiones.vercel.app, http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    try {
        const category = await Category.findById(id)

        if(!make || !model || !year || !odometer || !engineManufacturer || !gvwr || !cargoBodyType || !length || !width || !height || !price ){
            //NO SE ARMA EL JSON {msg: "mensaje"} PORQUE EN EL FRONT ESTOY CON AXIOS
            return res.status(200).json("ERROR: Todos los campos son obligatorios!");
        }else if(!category){
            //NO SE ARMA EL JSON {msg: "mensaje"} PORQUE EN EL FRONT ESTOY CON AXIOS
            return res.status(200).json("ERROR: El ID de Categoria no existe en la BBDD");
        }else{
            const product = new Product({ make, model, year, odometer, engineManufacturer, gvwr, cargoBodyType, length, width, height, price })
            if (req.files?.images) {//let cont = Object.keys(req.files).length

                //CUANDO SE SUBE UNA SOLA IMG-FILE, ENTONCE req.files.images.length = undefined => PORQUE NO ES ARRAY
                if(req.files.images.length === undefined){

                    let objectFile_Info = await cloudinary.uploadImage(req.files.images.tempFilePath)
                
                    product.images = { 
                        public_id: objectFile_Info.public_id,  
                        secure_url: objectFile_Info.secure_url 
                    }

                    await fs.unlink(req.files.images.tempFilePath)

                    product.categoryId = category.id
                    product.manufacturerId = manufacturerId
                    product.creatorUserId = req.user.id
                    
                    const newProduct = await product.save()//SE CREA EL PRODUCTO CON 1 IMG-FILE
                    res.status(200).json({ newProduct })
    
                }else {//CUANDO HAY 2 O MAS IMG-FILES, req.files.images SE CONVIERTE EN ARRAY CON array.length

                    for(let i=0; i<req.files.images.length; i++){
                        /**EN CADA ITERACION GUARDA LA IMG[i] EN CLOUDINARY Y RETORNA UN OBJETO JSON CON LA INFORMACION secure_url*/
                        let objectFile_Info = await cloudinary.uploadImage(req.files.images[i].tempFilePath)
    
                        let secureUrlImg = { 
                            public_id: objectFile_Info.public_id,  
                            secure_url: objectFile_Info.secure_url 
                        }
    
                        product.images.push(secureUrlImg)//INSERTAR OBJETOS {} AL ARRAY
    
                        /**EN CADA ITERACION ELIMINAR EL tempFile GENERADO EN LA UBICACION /uploads */
                        await fs.unlink(req.files.images[i].tempFilePath)//borrar los archivos de la carpeta temporal .8uploads
                    }
    
                    product.categoryId = category.id
                    product.manufacturerId = manufacturerId
                    product.creatorUserId = req.user.id
                    const newProduct = await product.save()
                    res.status(200).json({ newProduct })//SE CREA EL PRODUCTO CON MULTIPLES IMG-FILES
                }

            } else {//SI EL USUARIO NO CARGA NINGUNA IMG-FILE, NO SE CREA PRODUCTO
                //NO SE ARMA EL JSON {msg: "mensaje"} PORQUE EN EL FRONT ESTOY CON AXIOS
                return res.status(200).json("ERROR: El cargue de imagenes es obligatorio!");
            }
        }
    } catch (error) {
        //NO SE ARMA EL JSON {msg: "mensaje"} PORQUE EN EL FRONT ESTOY CON AXIOS
        res.status(200).json('Error de Try/Catch en el Backend')
    }
}

/******************CONSULTAR LOS PRODUCTOS EXISTENTES (ALL)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*****/
/**************http://localhost:4000/api/product/*+*[GET]********/
/*******************await Product.find()*******************/
exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        if(!products){
            return res.status(200).json({msg: "no hay productos en la BBDD"})
        }else{
            return res.status(200).json({msg: products})
        } 
    }catch(error){
        res.json(error)
    }
}

/******************CONSULTAR PRODUCTOS EXISTENTES (BY ID CATEGORIA)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria************/
/**************http://localhost:4000/api/product/:id*+*[GET]********/
/*******************await Product.find()*******************/
exports.getProductsByIdCategory = async (req, res) => {

    const { id } = req.params;//id DE LA CATEGORIA SE CAPTURA POR LA URL /:id Y SE UTILIZA PARA BUSCAR TODOS LOS PRODUCTOS QUE PERTENEZCAN A ESA CATEGORIA

    try{
        const products = await Product.find({categoryId:id});
        if(!products){
            return res.status(200).json({msg: "no hay productos en esta categoria"})
        }else{
            return res.status(200).json({msg: products})
        } 
    }catch(error){
        res.json("error")
    }
}

/******************CONSULTAR PRODUCTOS EXISTENTES (BY ID PRODUCTO)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria************/
/**************http://localhost:4000/api/product/idproduct/:id*+*[GET]********/
/*******************await Product.find()*******************/
exports.getProductsByIdProduct = async (req, res) => {

    const { id } = req.params;//id DE LA CATEGORIA SE CAPTURA POR LA URL /:id Y SE UTILIZA PARA BUSCAR TODOS LOS PRODUCTOS QUE PERTENEZCAN A ESA CATEGORIA

    try{
        const product = await Product.findById(id);
        if(!product){
            return res.status(200).json({msg: "no hay producto con ese id"})
        }else{
            return res.status(200).json({msg: product})
        } 
    }catch(error){
        res.json("error: id invalido")
    }
}


/******************MODIFICAR UN PRODUCTO (BY ID PRODUCTO)******************/
/******http://localhost+puerto+URLprimaria+URLsecundaria*******************/
/**************http://localhost:4000/api/product/:id*+*[PUT]***************/
/*******************await productById.save()*******************************/
/***********************REQUIERE TOKEN*************************************/ 
exports.updateProduct = async (req, res) => {

    const { id } = req.params;
    const { model, year, odometer, engineManufacturer, gvwr, cargoBodyType, length, width, height, price, urlImagesDeleted} = req.body;

    try{
        const productById = await Product.findById( id );
            
        productById.model = model || productById.model;
        productById.year = year || productById.year;
        productById.odometer = odometer || productById.odometer;
        productById.engineManufacturer = engineManufacturer || productById.engineManufacturer;
        productById.gvwr = gvwr || productById.gvwr;
        productById.cargoBodyType = cargoBodyType || productById.cargoBodyType;
        productById.length = length || productById.length;
        productById.width = width || productById.width;
        productById.height = height || productById.height;
        productById.price = price || productById.price;

        /**NOTA: EL CAMPO urlImagesDeleted TRAE EL ARRAY DE IMAGENES PARA ELIMINAR  *******/
        if(urlImagesDeleted.length>0){
                
            //DELETE FROM CLOUDINARY 
            for(let i=0;i<urlImagesDeleted.length;i++){
                //console.log(product.images[i].public_id)
                await cloudinary.deleteImage(urlImagesDeleted[i].public_id)
            }

            //DELETE URL_IMAGES IN PRODUCT{images:[ARRAY]} FROM MONGODB
            for(let i=0;i<urlImagesDeleted.length;i++){

                /**FILTRAMOS EL ARRAY productById.images[{},{},{},...] X SU CAMPO "public_id:" 
                 * Y NOS RETORNA EL OBJETO U OBJETOS QUE COINCIDAN CON EL CAMPO "public_id" DE
                 * CADA ELEMENTO DEL ARRAY urlImagesDeleted[i] ******************************/
                var results = productById.images.filter((item) => { 
                    return item.public_id == urlImagesDeleted[i].public_id;
                });

                /**AQUI CAPTURAMOS EL [INDEX/POSICION] DEL OBJETO RESULTANTE {results[0]}
                 * DENTRO DEL ARRAY productById.images[{},{},{},..] *********************/
                var firstObj = (results.length > 0) ? productById.images.indexOf(results[0]) : null;
                
                /**CON EL METODO .splice() Y EL INDEX SE ELIMINA EL OBJETO results[0] DEL ARRAY productById.images[]*/
                productById.images.splice(firstObj, 1);//
            }

        }
        //GUARDAR LOS CAMBIOS EN LA BBDD
        productById.save();
        //console.log(productById);
        return res.status(200).json({msg:productById})
         
    }catch(error){
        res.status(200).json({msg:"Error de Try / Catch en el Backend"})
    }
}

/************ADICIONAR IMAGENES A UN PRODUCTO CON FORM-DATA ***************/
/****http://localhost+puerto+URLprimaria+Endpoint/addimages/:id + POST ****/
/**** http://localhost:4001/api/product/addimages/:idproduct *+*POST ******/
/*******************await productById.save()*******************************/
/***********************REQUIERE TOKEN*************************************/ 
exports.addImages = async (req, res) => {
    const { id } = req.params;
    const { images } = req.body;
    try{
        const productById = await Product.findById( id );

        if(!productById){
            return res.status(200).json('no se encontro producto con el id suministrado')//NO SE PONE msg: PORQUE EN EL FRONT ES AXIOS
        }else{
            if (req.files?.images) {//let cont = Object.keys(req.files).length

                //CUANDO SE SUBE UNA SOLA IMG-FILE, ENTONCE req.files.images.length = undefined => PORQUE NO ES ARRAY
                if(req.files.images.length === undefined){
                    let response = await cloudinary.uploadImage(req.files.images.tempFilePath)
                    
                    productById.images = { 
                        public_id: response.public_id,  
                        secure_url: response.secure_url 
                    }

                    await fs.unlink(req.files.images.tempFilePath)
                    await productById.save();//GUARDA LA INFORMACION
                    res.status(200).json( productById )//NO SE PONE msg: PORQUE EN EL FRONT ES AXIOS
    
                }else {//CUANDO HAY 2 O MAS IMG-FILES, req.files.images SE CONVIERTE EN ARRAY CON array.length

                    for(let i=0; i<req.files.images.length; i++){
                        /**EN CADA ITERACION GUARDA LA IMG[i] EN CLOUDINARY Y RETORNA UN OBJETO JSON CON LA INFORMACION secure_url*/
                        let response = await cloudinary.uploadImage(req.files.images[i].tempFilePath)
    
                        let secureUrlImg = { 
                            public_id: response.public_id,  
                            secure_url: response.secure_url 
                        }
    
                        productById.images.push(secureUrlImg)//INSERTAR OBJETOS {} AL ARRAY
    
                        /**EN CADA ITERACION ELIMINAR EL tempFile GENERADO EN LA UBICACION /uploads */
                        await fs.unlink(req.files.images[i].tempFilePath)//borrar los archivos de la carpeta temporal .8uploads
                    }
    
                    await productById.save()
                    res.status(200).json({ productById })//NO SE PONE msg: PORQUE EN EL FRONT ES AXIOS
                }

            } else {//SI EL USUARIO NO CARGA NINGUNA IMG-FILE, NO SE CREA PRODUCTO
                //NO SE ARMA EL JSON {msg: "mensaje"} PORQUE EN EL FRONT ESTOY CON AXIOS
                return res.status(200).json("ERROR: no se estan llegando las imagenes al back!");
            }
        }
    }catch(e){
        return res.status(200).json('Error de Try/Catch en el Backend')
    }

}

/******************ELIMINAR UN PRODUCTO (BY ID PRODUCTO)******************/
/******http://localhost+puerto+URLprimaria+Endpoint/:id *******************/
/**DELETE PRODUCT http://localhost:4001/api/product/:id *MIDDLEWARE********/
/*******************await productById.save()*******************************/
/***********************REQUIERE TOKEN*************************************/ 
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try{
        const product = await Product.findById(id)
        if(!product){
            return res.status(200).json({ msg: "productos no existe" })
        }else {
            if (product.images.length>0) {//DELETE FROM CLOUDINARY 
                for(let i=0;i<product.images.length;i++){
                    //console.log(product.images[i].public_id)
                    await cloudinary.deleteImage(product.images[i].public_id)
                }       
                /*Array.from(product.images).map( async (image, index) => 
                      await cloudinary.deleteImage(product.images[i].public_id) 
                )*/
            }
            await Product.deleteOne({ _id: id })//DELETE FROM MONGODB
            return res.status(200).json({ msg: "Producto borrado" })
        }
    }catch(error){
        return res.status(200).json({msg: 'Error de Try/Catch en el Backend'})
    }
}