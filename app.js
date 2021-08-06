const express = require("express");
const path=require('path');
const cors=require('cors');
const morgan = require("morgan");
const dotenv = require('dotenv');
const uuid=require('uuid');
const stripe = require("stripe")("");


const app = express();
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const reviewRouter = require("./routers/reviewRouter");
const categoryRouter = require("./routers/categoryRouter");
const orderRouter=require('./routers/orderRouter');
const cartRouter=require('./routers/cartRouter');


app.use(cors({
  origin: '*'
}));
dotenv.config({
    path: './config.env'
});

app.use((req,res,next)=>{
// console.log(req.headers);
  // console.log({
  //   user:req.user?req.user.role:'no user',
  //   cookie:req.headers.cookie
  // }); 
next();
});

app.use(express.json());
app.use(cors({origin:true}));
if(process.env.NODE_ENV==='development')  app.use(morgan('dev'));

app.use(express.static(path.join(__dirname,"public")));
// app.use((req,res,next)=>{
//   console.log("hello");
//   next();
//   });
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/category",categoryRouter );
app.use("/api/v1/order",orderRouter);
app.use("/api/v1/cart",cartRouter);


// console.log('Data Imported!'.green.inverse)


// app.use("/", viewRouts);
// app.get('*',(re,res)=>{
//   res.status(200).json({data:[{data:"rout not found"}]});
// });
app.get('/',(req,res )=>{
res.status(200).json({
    message:"Welcome to backend"
});
});
module.exports = app;
