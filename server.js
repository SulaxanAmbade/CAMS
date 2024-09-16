const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv')

//dotenv config
dotenv.config();
//rest object
const app = express();
//middleware
app.use(express.json());
app.use(morgan('dev'));

//
app.get('/',(req,res)=>{
    res.status(200).send({
        message: "Server is Running!",
    });

})

// listen port
const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log(`Server is Running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`.blue);
})