const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    console.log('Files dropped:', files);
    handleFiles(files);
}

fileElem.addEventListener('change', (e) => {
    console.log('Files selected:', fileElem.files);
    handleFiles(fileElem.files);
});

function handleFiles(files) {
    [...files].forEach(uploadFile);
}

function uploadFile(file) {
    console.log('Uploading file:', file);
    let url = '/upload';
    let formData = new FormData();
    formData.append('file', file);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response received:', response);
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        let link = `${window.location.origin}/view?fileId=${data.fileId}`;
        alert(`File uploaded successfully! Link: ${link}`);
        console.log(`File uploaded successfully! Link: ${link}`);
    })
    .catch((error) => {
        console.error('Upload failed:', error);
        alert('Upload failed');
    });
}
