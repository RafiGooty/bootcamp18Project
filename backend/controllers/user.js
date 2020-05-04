const User =require('../models/user');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.userLogin=
                    (req,res,next)=>{
                      let fetchData;
                      User.findOne({email:req.body.email})
                      .then(user=>{
                        this.fetchData =user;
                        if(!user){
                          return res.status(401).json({
                            message:"Auth Failed"
                          })
                        }
                        return bcryptjs.compare(req.body.password,user.password);
                      })
                      .then(result=>{

                        if(!result){
                          return res.status(401).json({
                            message:"Auth Failed"
                          })
                        }

                        const token=jwt.sign(
                          {email:this.fetchData.email,userId:this.fetchData._id},
                         "secret_this_code_from_gooty",
                          {expiresIn:"1h"}
                                            );
                        res.status(200).json({
                          token:token,
                          expiresIn:3600,
                          userId:this.fetchData._id
                        })
                      })
                      .catch(error=>{
                        return res.status(401).json({
                                message:"Auth Failed"
                            })
                      })
                    }

exports.createUser=
                      (req,res,next)=>{
                        bcryptjs.hash(req.body.password,10)
                        .then(hash=>{
                          const user= new User({  email    :req.body.email,
                                                  password :hash
                                                });

                          user.save()
                          .then((response)=>
                          {
                            res.status(201).json({message :'User added successfully',
                                                  user    : response
                                                })
                          })
                          .catch((error)=>{
                            res.status(500).json({
                              error:error
                            })
                          })
                        })
                      }
