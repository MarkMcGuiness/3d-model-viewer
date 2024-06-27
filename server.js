const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    // Handle file upload logic here
    // This is where you process the uploaded file and generate a unique link
    // Example: Generate a unique ID for the link
    const uniqueId = uuidv4();
    const link = `https://your-domain.com/view/${uniqueId}`;
    
    // Example: Save data to a JSON file
    const data = {
        link,
        uploadedFileName: req.body.fileName,
        uploadedFileUrl: req.body.fileUrl // Replace with actual file URL or path
    };
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('data.json', jsonData);

    res.send(`Uploaded successfully! View your 3D model <a href="${link}">here</a>.`);
});

// Dynamic port binding for Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
