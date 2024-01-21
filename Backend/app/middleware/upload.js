const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: function(req, file, cb) {
    try{
      // fetch file extension
      let fileExtension = path.extname(file.originalname);
      let uniqueId = Math.random().toString(36).slice(2, 7);
      
      let _fileName = `${uniqueId}-Kcode-${file.originalname}`;

      let filePath = `/resources/static/assets/uploads/${_fileName}`;
      // saving file name and extension in request upload object

      req.body.image = {
        imageType: file.mimetype,
        imageName: _fileName,
        imagePath: filePath
      };

      cb(null, _fileName);
    }
    catch(error){
      cb(error);
    }
    
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadFile;
