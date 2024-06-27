const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('File uploaded:', req.file);
    res.json({ fileId: req.file.filename });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
