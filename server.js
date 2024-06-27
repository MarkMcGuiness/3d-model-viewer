const express = require('express');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import uuid v4 from the uuid package

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Heroku or default to 3000

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Example endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Handle file upload logic here
  res.send('File uploaded successfully.');
});

// Example endpoint for root route
app.get('/', (req, res) => {
  res.send('Welcome to the 3D Model Viewer API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
