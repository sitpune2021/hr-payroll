import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Save image file to uploads folder
 * @param {object} imageFile - multer file (from memoryStorage)
 * @returns {Promise<string>} saved file name
 */
export const saveImageFile = async (imageFile) => {
  if (!imageFile || !imageFile.originalname || !imageFile.buffer) {
    throw new Error("Invalid image file");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(imageFile.mimetype)) {
    throw new Error("Unsupported file type");
  }

  const ext = path.extname(imageFile.originalname);
  const fileName = `${Date.now()}-${uuidv4()}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.promises.writeFile(filePath, imageFile.buffer);
  return fileName;
};





export const deleteImageFile = async (fileName) => {
    if (!fileName) {
      return { success: false, message: "File name not provided" };
    }
  
    const filePath = path.join(uploadDir, fileName);
  
    try {
      await fs.promises.access(filePath); // Check if file exists
      await fs.promises.unlink(filePath); // Delete file
      return { success: true, message: "File deleted successfully" };
    } catch (err) {
      return { success: false, message: "File not found or could not be deleted" };
    }
  };


  export const serveImageFile = (fileName, res) => {
    if (!fileName) {
      return res.status(400).send("File name is required");
    }
  
    const filePath = path.join(uploadDir, fileName);
  
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send("Image not found");
      }
  
      res.sendFile(filePath);
    });
  };
