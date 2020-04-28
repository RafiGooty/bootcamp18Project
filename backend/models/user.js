const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');



const userSchmea=mongoose.Schema({
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true}
})

userSchmea.plugin(uniqueValidator);
module.exports=mongoose.model('User',userSchmea);
