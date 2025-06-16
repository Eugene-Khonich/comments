import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { lookup as mimeLookup } from 'mime-types'

const UPLOAD_DIR = path.resolve('uploads')
const MAX_TEXT_SIZE = 100 * 1024

async function processUploadedFile(file) {
  const { mimetype, size, originalname, path: tempPath } = file
  const ext = path.extname(originalname).toLowerCase()
  const expectedMime = mimeLookup(ext)

  if (expectedMime !== mimetype) {
    throw new Error('File extension does not match MIME type.')
  }

  const finalPath = path.join(UPLOAD_DIR, originalname)

  if (mimetype === 'text/plain') {
    if (size > MAX_TEXT_SIZE) {
      throw new Error('Text file too large. Max 100KB allowed.')
    }
    await fs.rename(tempPath, finalPath)
    return { type: 'text', filename: originalname }
  }

  if (['image/jpeg', 'image/png', 'image/gif'].includes(mimetype)) {
    const image = sharp(tempPath)
    const metadata = await image.metadata()

    if (metadata.width > 320 || metadata.height > 240) {
      await image
        .resize({
          width: 320,
          height: 240,
          fit: 'inside',
        })
        .toFile(finalPath)
    } else {
      await fs.rename(tempPath, finalPath)
    }

    return { type: 'image', filename: originalname }
  }

  throw new Error('Unsupported file type.')
}

export default { processUploadedFile }
