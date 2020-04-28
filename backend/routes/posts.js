const express=require('express');
const Post =require('../models/post');
const router=express.Router();
const multer=require("multer");
const checkAuthorization=require('../middleware/chek-auth')


const MIME_TYPE_MAP={
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
}

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const invalid=MIME_TYPE_MAP[file.mimetype];
    let error=new Error("Invalid mime Type");

    if(invalid){
      error=null;
    }
    cb(error,"backend/fileStore")
  },
  filename:(req,file,cb)=>{
    const name=file.originalname.toLowerCase().split(' ').join('_');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
})


router.post("",checkAuthorization,multer({storage:storage}).single("image"), (req,res,next)=>{
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
})

router.put("/:id",
            checkAuthorization,
            multer({storage:storage}).single("image"),(req,res,next)=>
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
       if(response.nModified ===0){
        res.status(401).json({ message:'Unauthorized user update prohibited'
                            })
      } else {
        res.status(201).json({ message:'post updated successfully',
        id:response._id
       })
      }
    });
})


router.get("", (req,res,next)=>
{        Post.find().then((document)=>
        {   res.status(200).json({ message:"this is successfull",
                                   posts:document
                              });
        });
});

router.get("/:id", (req,res,next)=>
{        Post.findById(req.params.id).then((document)=>
        {   res.status(200).json({ message:"Get by ID is successfull",
                                   post: {  id      :req.params.id,
                                            title   :document.title,
                                            content :document.content,
                                            imageUrl:document.imageUrl,
                                            creator: document.creator
                                          }
                              });
        });
});

router.delete("/:id",checkAuthorization,(req,res,next)=>{
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
})

module.exports=router;
