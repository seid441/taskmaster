const express=require("express")
const mysql=require("mysql")
const cors=require("cors")
require("dotenv").config()
const app=express()
const port = process.env.PORT;
//middleware
app.use(express.json())
app.use(cors())
//databaseconnection
const pool=require("./config/database")
 //Router
// Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/tasks', require('./routes/tasks'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'TaskMaster API is running!' });
});
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);

})
 