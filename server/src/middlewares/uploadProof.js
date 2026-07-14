import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads/proofs";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

const fileFilter = (req, file, cb) => {

    if (
        file.mimetype.startsWith("image/")
    ) {

        cb(null, true);

    } else {

        cb(
            new Error("Only image files are allowed"),
            false
        );

    }

};

export default multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});