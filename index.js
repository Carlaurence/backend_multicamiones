const express = require("express");
const { appConfig } = require('./config')
const connectionDB = require("./config/db");
const cors = require("cors");//POLITICAS DE CORS
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan')//npm i morgan PARA VER EN CONSOLA CADA MICROSERVICIO

connectionDB();

//IMPORTAMOS LAS RUTAS DEL ROUTER Y MIDDLEWARES
const routerProduct = require('./router/routerProduct'); //CONEXION AL /ROUTER
const routerUser = require("./router/routerUser"); 
const routerToken = require("./router/routerToken");
const routerCategory = require('./router/routerCategory');
const routerAdvertising = require('./router/routerAdvertising');
const routerManufacturer = require('./router/routerManufacturer');
const routerEngineManufacturer = require('./router/routerEngineManufacturer');
const routerCargoBodyType = require('./router/routerCargoBodyType');
const routerYear = require('./router/routerYear');
const routerFinancialCorp = require('./router/routerFinancialCorp');


//Middleware/
app.use(cors({
    origin: ['https://frontend-multicamiones.vercel.app',
    'https://frontend-multicamiones.vercel.app/create_product/:id', 
    'http://localhost:3000',
    'http://localhost:3000/create_product/:id'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: 'true'
}));
app.use(morgan('dev'))//MUESTRA EN CONSOLA CADA QUE SE EJECUTE UN MICROSERVICIO
app.use(express.json({extended: true}));//Para habilitar las expresiones .json y generar archivo
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//CREACION DE LAS RUTAS PRIMARIAS DE ENLACE A LA BBDD
app.use("/api/product", routerProduct);//RUTA-URL PRIMARIA DE PRODUCTO EN LA BBDD
app.use("/api/user", routerUser);
app.use("/api/login", routerToken);
app.use("/api/category", routerCategory);
app.use("/api/advertisements", routerAdvertising);
app.use("/api/manufacturer", routerManufacturer);
app.use("/api/enginemanufacturer", routerEngineManufacturer);
app.use("/api/cargobodytype", routerCargoBodyType);
app.use("/api/year", routerYear);
app.use("/api/financialcorp", routerFinancialCorp);

//TEST CONNECTION TO DATABASE
app.get('/', (req, res) => res.send('You Are connected to API Multicamiones'))

const port = process.env.PORT || appConfig.port

console.log(`http//${appConfig.host}:${appConfig.port}`)
app.listen(port, () => {
    console.log("port running in: "+port);
});