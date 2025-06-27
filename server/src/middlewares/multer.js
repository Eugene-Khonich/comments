import multer from 'multer'
import path from 'path'

const TEMP_DIR = path.resolve('temp')

const upload = multer({
  dest: TEMP_DIR,
})

export default upload
