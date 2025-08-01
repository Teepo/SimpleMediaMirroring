import { socket } from './modules/ws.js';

const params = new URLSearchParams(window.location.search);
const isAdmin = params.get('mode') === 'admin';

const adminControls = document.getElementById('admin-controls');
const dropArea = document.getElementById('drop-area');
const container = document.getElementById('image-container');
const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('image-url');
const clearBtn = document.getElementById('clear-btn');

if (isAdmin) {
    
    adminControls.style.display = 'block';

    dropArea.addEventListener('dragover', e => {
        e.preventDefault();
        dropArea.style.background = '#e0e0e0';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.background = '#fafafa';
    });

    dropArea.addEventListener('drop', e => {

        const file = e.dataTransfer.files[0];
        
        e.preventDefault();
        
        dropArea.style.background = '#fafafa';

        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = e => {
            socket.emit('mirroring/media', e.target.result);
        };
    });

    urlForm.addEventListener('submit', e => {
        
        e.preventDefault();
        
        const url = urlInput.value.trim();

        if (!url) {
            return;
        }

        socket.emit('mirroring/url', { url });
        
        urlInput.value = '';
    });

    clearBtn.addEventListener('click', () => {
        socket.emit('mirroring/clear');
    });
}

socket.on('message', data => {

    console.log('message', data);

    const json = JSON.parse(data);
    
    if (json.type === 'image') {
        const img = new Image();
        img.src = data.url;
        container.innerHTML = '';
        container.appendChild(img);
    }
});

socket.on('mirroring/media', data => {
    
    console.log(data);

    const blob = new Blob([data]);

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    container.innerHTML = '';
    container.appendChild(img);
});

socket.on('mirroring/url', data => {
    const img = new Image();
    img.src = data.url;
    container.innerHTML = '';
    container.appendChild(img);
});

socket.on('mirroring/clear', () => {
    container.innerHTML = '';
});