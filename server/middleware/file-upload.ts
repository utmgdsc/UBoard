import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

const maxSize = 2 * 1024 * 1024;

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
}).single('file');
