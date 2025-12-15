const express=require('express');
const bcrypt=require("bcrypt");
const router=express.Router();
const jwt=require("jsonwebtoken");
const pool=require('../config/database')
//register
router.post('/register',async(req,res)=>{
    try{
        const{email,password,name}=req.body;
        //we are on the register routes so we check if the user is exist if the user by that email exist we say the user is exist
        const [existinguser]=await pool.execute(
          `  SELECT id FROM users WHERE email=?`,
          email
        );
        if(existinguser.length>0){
            return res.status(500).json({message:'user already exist'})
        }
        //then after we see if the user is exist or not .if it does not exist we pass to the next step hashing the password

    const hashedpassword=await bcrypt.hash(password,10)
      //after hashed the password we insert the the new regsiter user in to the database
      const [result]=await pool.execute(
        `INSERT INTO user (email,password,name) VALUE(?,?,?)`,
        [email,hashedpassword,name]
      );
      res.status(201).json({
        message:'User created successfully',
        userId:result.insert.Id
      });

    }catch(error){
        res.status(500).json({message:'server error',error:error.message})
    }
});
//now the user register on our system then next step is the user should login 
//login
router.post('/login',async(req,res)=>{
    try{
  const { email, password } = req.body;
  const [users] = await pool.execute(
    `SELECT * FROM users WHERE email=?`,
    email
  );
  if (users.length === 0) {
    res.status(400).json({ message: "Invalid credentials" });
  }
  const user = users[0];
  //in the above we check the email now we check the password
  const validPassword = await bcrypt.compare(password, user.password);
  //after login we create token b/c When a user logs in, the server needs a way to remember who they are without asking them to log in again and again
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );
  res.json({
    message:'Login successfull',
    token,
    user:{id:user.id,email:user.email,name:user.name}
  });
    } catch(error){
        res.satus(500).json({message:'server error',error:error.message})
    }
})
module.exports=router;