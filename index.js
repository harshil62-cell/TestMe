const express=require('express');
const dotenv=require('dotenv').config();
const authRoutes=require('./routes/auth');
const testRoutes = require('./routes/test');

const app=express();
const port=process.env.PORT || 3000;
app.use(express.json());

//routers
app.use('/auth',authRoutes);
app.use('/test', testRoutes);


app.listen(port,()=>{
    console.log(`Server Started on port ${port}`);
})