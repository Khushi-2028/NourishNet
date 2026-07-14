import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(
  process.cwd(),
  "uploads",
  "donations"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true
  });
}

const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(
      null,
      uploadPath
    );

  },

  filename(req, file, cb) {

    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );

  }

});

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype.startsWith(
      "image/"
    )
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        "Only images are allowed"
      ),
      false
    );

  }

};

export default multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
      5 * 1024 * 1024

  }

});