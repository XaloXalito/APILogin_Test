const express = require('express')
const mongoose = require('mongoose')
const {MONGO_LOCAL,PORT} = require('./keys')
const bodyParser = require('body-parser')
const app = express();

// DATABASE CONNECTION
mongoose.connect(MONGO_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongodb')
})
mongoose.connection.on('error', (err)=>{
    console.log('error connecting to mongodb',err)
})


// MIDDLEWARES
app.use(express.json())
//app.use(bodyParser.json())

// MODELS
require('./models/user.js')

// ROUTES
app.use(require('./routes/auth'))
app.use(require('./routes/user'))

// RUN SERVER
app.listen(PORT, ()=>{
    console.log('Servidor esta en el puerto',PORT);
});