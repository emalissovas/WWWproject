const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser'); // Αλλαγή βάσει διαλέξεων
const app = express();
const PORT = 3000;

// Αλλαγή: Χρήση του body-parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('www')); 

// --- ΒΟΗΘΗΤΙΚΗ ΣΥΝΑΡΤΗΣΗ EΓΓΡΑΦΗΣ 
const writeData = (filename, content, res) => {
    fs.writeFile(path.join(__dirname, 'data', filename), JSON.stringify(content, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Σφάλμα εγγραφής στο αρχείο' });
        } else {
            res.json({ message: 'Επιτυχία!', data: content });
        }
    });
};

//  LOGIN 
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile(path.join(__dirname, 'data', 'users.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error' });
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);
        if (user) res.json({ success: true });
        else res.status(401).json({ success: false });
    });
});

// ΔΙΑΚΡΙΣΕΙΣ 
app.get('/api/honors', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'honors.json'), 'utf8', (err, data) => {
        if (err) res.status(500).send('Error');
        else res.send(JSON.parse(data));
    });
});

app.post('/api/honors', (req, res) => {
    const newHonor = req.body;
    fs.readFile(path.join(__dirname, 'data', 'honors.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        let honors = JSON.parse(data);
        newHonor.id = Date.now();
        honors.push(newHonor);
        writeData('honors.json', honors, res);
    });
});

app.delete('/api/honors/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, 'data', 'honors.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        let honors = JSON.parse(data);
        honors = honors.filter(item => item.id !== idToDelete);
        writeData('honors.json', honors, res);
    });
});

//  ΣΥΝΔΕΣΜΟΙ
app.get('/api/links', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'links.json'), 'utf8', (err, data) => {
        if (err) res.status(500).send('Error');
        else res.send(JSON.parse(data));
    });
});

app.post('/api/links', (req, res) => {
    const newLink = req.body;
    fs.readFile(path.join(__dirname, 'data', 'links.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        let links = JSON.parse(data);
        newLink.id = Date.now();
        links.push(newLink);
        writeData('links.json', links, res);
    });
});

app.delete('/api/links/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, 'data', 'links.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error');
        let links = JSON.parse(data);
        links = links.filter(item => item.id !== idToDelete);
        writeData('links.json', links, res);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});