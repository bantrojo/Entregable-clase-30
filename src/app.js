const express = require('express');
const session=require('express-sessions')
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const sv_cluster=require('../src/app-server');
const jwt=require('jsonwebtoken');
const app = express();
const dotenv =require("dotenv").config()
const {fork}=require('child_process');
const cluster=require('cluster');
const minimist=require('minimist')

//const ProductManager=require('./Manager/productManager.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', productRouter);
app.use('/api', cartRouter);
app.use('/api',sv_cluster);
app.use(cookieParser());

const faker = require('faker');
const res = require('express/lib/response');

const { name, internet, } = faker;

const options = {default:{modo:'fork'}, alias:{p:'port'}}
const args = minimist(process.argv.slice(2),options)


const PORT = process.argv[2]||8080

switch (args.modo) {
    case 'fork':
        const server = app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))
        break;
    case 'cluster':
        if(cluster.isPrimary){
            console.log(`master ${process.pid} is running`)
            for(let i = 0;i<numCPUs;i++){
                cluster.fork()
            }
            cluster.on('exit',(worker,code,signal)=>{
                console.log(`worker ${worker.process.pid} died`)
            })
        } else {
            const server = app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))
            console.log(`worker ${process.pid} started`)
        }
        break;
    default:
        break;
}


app.use('/api/products-faker', function (req, res) {
    let objects = [];
    for (let i = 0; i < 5; i++) {
        objects.push({
            product: commerce.product(),
            name: commerce.productName(),
            price: commerce.price(),
            thumbnail: image.image()

        })
    }
    res.send(objects)
})

//crear sesion
app.use(session({
    store:mongoStore.create({
        mongoUrl:process.env.DB_MONGO,
        ttl:30
    }),
    secret:process.env.DB_SECRET,
    resave:false,
    saveUnitialized:false,
    cookie:{
        secure:false,
        maxAge:30000
    }
}))

app.get('/login',(req,res)=>{
    res.send(`
    <html>
        <head>
            <title>Login</title>
        </head>    
        <body>
            <form method="POST" action="/auth">
                Nombre de usuario: <input type="text" name="text">
                Contraseña: <input type="password" name="password">
                <input type="submit" value="Iniciar sesion">
            </form>
        </body>
    
    `)
})

app.post('/auth',(req,res)=>{
    const {username,password}=req.body;
    const user={username:username};

    const accessToken=generateAccessToken(user);
});
function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET,{expiresIn:'5m'})
}res.header('autorization',accessToken).json({
    message:'autenticacion realizada',
    token:token
})
function validateToken(req,res, next){
    const headerToken=req.headers.authorization;
    if(typeof(headerToken)!=="undefined"){
        const tokenArray=headerToken.split(" ");
        const token=tokenArray[1]; 
        console.log(token)
        jwt.verify(token,"claveDeCodificacion",(err,tokenDecoded)=>{
            if(err) return res.send("invalid token");
        })
        next()
    }else{
        res.send("token no valido")
    }
}


app.post('/profile',(req,res)=>{
    if(req.session.user){
       res.json(req.session)
    }else{
        res.status(403).send("unauthorized")
    }
    
})

app.post("/logout",(req,res)=>{
   
    res.send("sesion cerrada")
})




admin = false;


const PORT = process.env.PORT||8080
const server = app.listen(PORT, (req, res) => console.log(`Listening on PORT ${PORT}`))
