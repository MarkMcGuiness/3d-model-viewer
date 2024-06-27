const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint for handling GET and POST requests to /api/data
app.route('/api/data')
    .get((req, res) => {
        try {
            const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
            res.json(JSON.parse(data));
        } catch (err) {
            console.error('Error reading data:', err);
            res.status(500).json({ error: 'Error reading data' });
        }
    })
    .post((req, res) => {
        try {
            const newData = req.body;
            const data = JSON.stringify(newData, null, 2);
            fs.writeFileSync(path.join(__dirname, 'data.json'), data);
            res.json({ message: 'Data updated successfully' });
        } catch (err) {
            console.error('Error writing data:', err);
            res.status(500).json({ error: 'Error writing data' });
        }
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
