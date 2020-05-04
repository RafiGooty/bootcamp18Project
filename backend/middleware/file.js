const multer=require("multer");

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
    // cb(error,"backend/fileStore")
    cb(error,"fileStore")
  },
  filename:(req,file,cb)=>{
    const name=file.originalname.toLowerCase().split(' ').join('_');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
})

exports.extractFile=multer({storage:storage}).single("image");
