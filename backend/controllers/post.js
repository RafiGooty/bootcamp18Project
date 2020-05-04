const Post =require('../models/post');

exports.createPost=
                    (req,res,next)=>{
                      let url       =req.protocol+"://"+req.get("host");
                      let imagePath =url+"/fileStore/"+req.file.filename;

                        const post= new Post({
                                                title   :req.body.title,
                                                content :req.body.content,
                                                imageUrl:imagePath,
                                                creator:req.UserObjectID
                                            });
                        post.save().then((response)=>
                                    {
                                      res.status(201).json
                                        ({
                                          message :'post added successfully',
                                          post    : {
                                                      ...response,
                                                      id:response._id
                                                    }
                                        })
                                    })
                                    .catch((error)=>{
                                      res.status(404).json({
                                        error:error
                                      })
                                    })
                    };

exports.updatePost=
                (req,res,next)=>
                {
                  let imagePath=req.body.imagePath;

                  if(req.file){
                    let url       =req.protocol+"://"+req.get("host");
                    imagePath =url+"/fileStore/"+req.file.filename;
                  }
                  const post= new Post({  _id     :req.params.id,
                                          title   :req.body.title,
                                          content :req.body.content,
                                          imageUrl:imagePath,
                                          creator:req.UserObjectID
                                      });

                    Post.updateOne({_id:req.params.id,creator:req.UserObjectID},post)
                    .then((response)=>{

                      if(response.n>0){
                            res.status(200).json({ message:'post updated successfully',
                            id:response._id
                          })
                      } else {
                        res.status(401).json({ message:'Unauthorized user update prohibited'
                          })
                      }
                    });
                };

exports.getAllPosts=
                  (req,res,next)=>
                  { let currentPage= +req.query.currentPage;

                    let pages= +req.query.pages;
                    let postData;
                    let postQuery=Post.find();

                    if(currentPage && pages){
                      postQuery.skip(pages * (currentPage-1))
                      .limit(pages)
                      .then(response=>{
                        postData=response;
                        return Post.countDocuments()
                      })
                      .then(count=>{
                        res.status(200).json({
                          message:"Getting messages successfull",
                          posts:postData,
                          totalPages:count
                        })
                      })
                    }
                  };

exports.getSinglePosts=
                    (req,res,next)=>
                    {        Post.findById(req.params.id).then((document)=>
                            {   res.status(200).json(
                                  { message:"Get by ID is successfull",
                                    post: {  id      :req.params.id,
                                              title   :document.title,
                                              content :document.content,
                                              imageUrl:document.imageUrl,
                                              creator: document.creator
                                            }
                                });
                            });
                    };

exports.deleteSinglePost=
              (req,res,next)=>{
                Post.deleteOne({"_id":req.params.id,"creator":req.UserObjectID}).then(
                (response)=>{
                  if(response.deletedCount===0){
                    console.log("deleted Count must be 0")
                    res.status(401).json({
                      message:"'Unauthorized user update prohibited'"
                      })
                  } else{
                    res.status(200).json({
                      message:"Delete is successfull",
                      posts:req.params.id
                      })
                  }
                })
                }
