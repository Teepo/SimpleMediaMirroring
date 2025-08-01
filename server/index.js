const express = require('express');
const multer = require('multer');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const upload = multer({
    dest: 'uploads/'
});

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Upload local image
app.post('/upload', upload.single('image'), (req, res) => {

    broadcast(JSON.stringify({
        type : 'image',
        url  : `/uploads/${req.file.filename}`
    }));
    
    res.sendStatus(200);
});

app.post('/send-url', (req, res) => {

    const { url } = req.body;

    if (!(url && typeof url === 'string')) {
        return res.status(400).send('Invalid URL');
    }
        
    broadcast(JSON.stringify({
        type: 'image',
        url
    }));
    
    res.sendStatus(200);
});

app.post('/clear-image', (req, res) => {
    broadcast(JSON.stringify({
        type: 'clear'
    }));
    
    res.sendStatus(200);
});

const server = app.listen(3000, () => {
    console.log('📡 Server running on http://localhost:3000');
});

const wss = new WebSocketServer({ server });
let sockets = [];

wss.on('connection', ws => {
    
    sockets.push(ws);

    ws.on('close', () => {
        sockets = sockets.filter(s => s !== ws);
    });
});

function broadcast(data) {
    sockets.forEach(ws => ws.send(data));
}