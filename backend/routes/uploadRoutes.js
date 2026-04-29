const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).single('video'); 

// --- THE LOUD UPLOAD ROUTE ---
router.post('/video', (req, res) => {
  // We manually trigger Multer so we can trap its silent errors!
  upload(req, res, function (err) {
    
    // TRAP 1: Did Multer choke on the file?
    if (err instanceof multer.MulterError) {
      console.error("\n🚨 MULTER ERROR:", err);
      return res.status(500).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      console.error("\n🚨 UNKNOWN UPLOAD ERROR:", err);
      return res.status(500).json({ msg: `Unknown Error: ${err.message}` });
    }

    // TRAP 2: Did the file even make it to the backend?
    if (!req.file) {
      console.error("\n🚨 NO FILE RECEIVED: Frontend sent an empty package.");
      return res.status(400).json({ msg: 'No file provided' });
    }

    console.log(`\n✅ File Received! Size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);

    try {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'desbycodetech_courses' },
        (error, result) => {
          
          // TRAP 3: Did Cloudinary reject it?
          if (error) {
            console.error("\n🚨 CLOUDINARY ERROR:", error);
            return res.status(500).json({ msg: 'Failed to upload media to cloud.' });
          }
          
          console.log("✅ Cloudinary Success! URL:", result.secure_url);
          res.status(200).json({ url: result.secure_url });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
      
    } catch (catastrophicError) {
      // TRAP 4: Did our actual server code crash?
      console.error("\n🚨 CATASTROPHIC SERVER ERROR:", catastrophicError);
      res.status(500).json({ msg: 'Server crashed during upload.' });
    }
  });
});

module.exports = router;