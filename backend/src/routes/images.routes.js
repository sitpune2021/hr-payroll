import express from "express";
import { serveImageFile } from "../utils/imageUtils.js";

const router = express.Router();

router.get("/img/:fileName", (req, res) => {
  const { fileName } = req.params;
  serveImageFile(fileName, res);
});

export default router;
