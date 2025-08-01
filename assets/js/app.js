
import { WS_PROTOCOL, WS_HOST, WS_PORT } from './../../config';


const ws = new WebSocket(`${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}`);

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
        
        e.preventDefault();
        
        dropArea.style.background = '#fafafa';

        const formData = new FormData;

        formData.append('image', e.dataTransfer.files[0]);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        });
    });

    urlForm.addEventListener('submit', e => {
        
        e.preventDefault();
        
        const url = urlInput.value.trim();

        if (!url) {
            return;
        }

        fetch('/send-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        
        urlInput.value = '';
    });

    clearBtn.addEventListener('click', () => {
        fetch('/clear-image', { method: 'POST' });
    });
}

ws.onmessage = msg => {
    
    const data = JSON.parse(msg.data);

    console.log(container);
    
    if (data.type === 'image') {
        const img = new Image();
        img.src = data.url;
        container.innerHTML = '';
        container.appendChild(img);
    }
    else if (data.type === 'clear') {
        container.innerHTML = '';
    }
};