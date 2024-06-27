const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT provided by Heroku

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/' // Destination folder for uploaded files
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle file uploads
app.post('/upload', upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const fileId = uuidv4();
  const oldPath = path.join(__dirname, req.file.path);
  const newPath = path.join(__dirname, 'uploads', `${fileId}.glb`);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).send('Error uploading file.');
    }

    const fileUrl = `/view?fileId=${fileId}`;
    res.send(`File uploaded successfully. View your model <a href="${fileUrl}">here</a>.`);
  });
});

// Serve HTML file with the viewer and handle dynamic URLs
app.get('/view', (req, res) => {
  const fileId = req.query.fileId;
  if (!fileId) {
    return res.status(400).send('FileId parameter is required.');
  }

  const modelPath = path.join(__dirname, 'uploads', `${fileId}.glb`);
  fs.readFile(modelPath, (err, data) => {
    if (err) {
      console.error('Error loading model file:', err);
      return res.status(404).send('Model file not found.');
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D Model Viewer</title>
        <style>
          body { margin: 0; overflow: hidden; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
        <script>
          const canvas = document.createElement('canvas');
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          document.body.appendChild(canvas);

          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setClearColor(0xffffff, 1);

          const scene = new THREE.Scene();

          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.z = 2;

          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambientLight);

          const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight1.position.set(1, 1, 1).normalize();
          scene.add(directionalLight1);

          const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight2.position.set(-1, -1, -1).normalize();
          scene.add(directionalLight2);

          const loader = new THREE.GLTFLoader();
          loader.load('/uploads/${fileId}.glb', (gltf) => {
            scene.add(gltf.scene);
          });

          const controls = new THREE.OrbitControls(camera, renderer.domElement);

          function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }

          animate();
        </script>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
