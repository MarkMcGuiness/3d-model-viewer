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
    const uploadedFile = req.files.file; // Assuming you're using multer for file uploads

    // Example: Generate a unique ID for the link
    const uniqueId = uuidv4();
    const link = `https://boiling-depths-97500.herokuapp.com/view/${uniqueId}`;

    // Example: Save data to a JSON file
    const data = {
        link,
        uploadedFileName: uploadedFile.name,
        uploadedFileUrl: link // Replace with actual file URL or path
    };
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('data.json', jsonData);

    // You can respond with JSON or HTML as per your application's needs
    res.json({ link }); // Send back the link as JSON response
});

// Dynamic port binding for Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
