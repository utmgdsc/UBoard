import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';

const maxSize = 2 * 1024 * 1024;
const allowedFileTypes = /jpeg|jpg|png/;

export interface File {
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

let storage = multer.diskStorage({
  filename: (_, file, cb) => {
    // We create a unique filename per file so that we can view the files
    // by a unique url
    cb(null, uuidv4() + `.${file.originalname.split('.').slice(-1)[0]}`);
  },
});

export default multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (_, file, cb) => {
    if (
      allowedFileTypes.test(
        path.extname(file.originalname).toLocaleLowerCase()
      ) &&
      allowedFileTypes.test(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
}).single('file');
