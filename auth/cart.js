const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../database/user");
const SECRET_KEY = "tgbvhfruyshdhdvsfdfevdsvsds";

async function getCart(req,res){
    let total=0;
    const token=req.headers.authtoken;
    if(token){
    
    try{
        jwt.verify(token, SECRET_KEY);
    }
    catch(err){
        return res.status(400).send("invalid token"); 
    }   
    }
    const decode=jwt.decode(token);
    const user=await User.findOne({
        email:decode.email
    });
    let cart=user.cart;
    for(let i=0;i<cart.length;i++){
        total=total+(cart[i].price*cart[i].quantity)
    }
    return res.status(200).send({
        cart,
        Grandtotal:total
    });
}
async function addCart(req,res){
    const token=req.headers.authtoken;
    const {product_name,price,quantity,product_image}=req.body;
    if(token){
    
    try{
        jwt.verify(token, SECRET_KEY);
    }
    catch(err){
        return res.status(400).send("Invalid token"); 
    }   
    }
    const decode=jwt.decode(token);
    const user=await User.findOne({
        email:decode.email
    });
    let Cart=user.cart;
   if(price<1||quantity<1){
       return res.status(400).send("Invalid request"); 
   }else{
    let index = null
    Cart.forEach((el, i) => {
        if (el.product_name == product_name) {
            index = i;
        }
    })

    if (index == null) {
        Cart.push({
            product_name,
            price,
            quantity,
            product_image
        });
    } else {
        return res.status(400).send("Product already registered."); 
    }
    }
    await User.findOneAndUpdate({
        email:decode.email
    },{
       cart:Cart
    })

    return res.status(200).send({
        Cart,
    });
}
async function deleteCart(req,res){
    const token=req.headers.authtoken;
    const {product_name}=req.body;
    if(token){
    
    try{
        jwt.verify(token, SECRET_KEY);
    }
    catch(err){
        return res.status(400).send("Invalid token"); 
    }   
    }
    const decode=jwt.decode(token);
    const user=await User.findOne({
        email:decode.email
    });
    let Cart=user.cart;

    let index = null
    Cart.forEach((el, i) => {
        if (el.product_name == product_name) {
            index = i;
        }
    })

    if (index == null) {
        throw error
    } else {
        Cart.splice(index, 1);
    }
  
    await User.findOneAndUpdate({
        email:decode.email
    },{
       cart:Cart
    })

    return res.status(200).send({
        Cart,
    });
}
async function updateCart(req,res){
    const token=req.headers.authtoken;
    const {product_name,quantity}=req.body;
    if(token){
    try{
        jwt.verify(token, SECRET_KEY);
    }
    catch(err){
        return res.status(400).send("Invalid token"); 
    }   
    }
    const decode=jwt.decode(token);
    const user=await User.findOne({
        email:decode.email
    });
    let Cart=user.cart;

    let index = null;
    Cart.forEach((el, i) => {
        if (el.product_name == product_name) {
            index = i;
        }
    })

    if (index == null) {
        return res.status(400).send("Product not added.");
    } else {
    if(quantity<1){
        Cart.splice(index, 1);
    }else{
        Cart[index].quantity=quantity;
    }
    }
  
    await User.findOneAndUpdate({
        email:decode.email
    },{
       cart:Cart
    })

    return res.status(200).send({
        Cart,
    });
}

module.exports={
    getCart,
    addCart,
    deleteCart,
    updateCart
}