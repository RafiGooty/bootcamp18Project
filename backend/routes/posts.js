const express=require('express');
const router=express.Router();
const checkAuthorization=require('../middleware/chek-auth');
const postController=require('../controllers/post')
const extractFileMiddleWare=require('../middleware/file');





router.post(  "",
              checkAuthorization,
              extractFileMiddleWare.extractFile,
              postController.createPost
            );

router.put("/:id",
            checkAuthorization,
            extractFileMiddleWare.extractFile,
            postController.updatePost
          );


router.get (  "",
              postController.getAllPosts
            );

router.get( "/:id",
              postController.getSinglePosts
          );

router.delete("/:id",
              checkAuthorization,
              postController.deleteSinglePost);

module.exports=router;
