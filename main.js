document.getElementById('input-folder').addEventListener('change', function () {
    if (this.files.length > 0) {
        alert('Folder successfully uploaded!');
    }
});

function filterAndConvertFiles() {
    const inputFolder = document.getElementById('input-folder');
    const sourceExtension = document.getElementById('file-extension').value.trim().toLowerCase();
    const targetExtension = document.getElementById('target-extension').value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    const loader = document.querySelector('.loader');

    // Reset result and show loader
    resultDiv.innerHTML = '';
    loader.style.display = 'flex'; // Show loader

    // Validate input folder
    if (!inputFolder.files.length) {
        displayMessage(resultDiv, loader, 'Please select an input folder.');
        return;
    }

    // Validate source extension
    if (!sourceExtension.startsWith('.')) {
        displayMessage(resultDiv, loader, 'Please enter a valid source file extension starting with a dot (e.g., .txt).');
        return;
    }

    // Filter files by source extension
    const files = Array.from(inputFolder.files);
    const filteredFiles = files.filter(file => file.name.toLowerCase().endsWith(sourceExtension));

    if (filteredFiles.length === 0) {
        displayMessage(resultDiv, loader, `No files with the extension "${sourceExtension}" were found.`);
        return;
    }

    // Create ZIP with filtered files
    const zip = new JSZip();
    const folder = zip.folder("filtered_files");

    filteredFiles.forEach(file => {
        let fileName = file.name;
        if (targetExtension && targetExtension.startsWith('.')) {
            fileName = fileName.replace(new RegExp(`${sourceExtension}$`, 'i'), targetExtension);
        }
        folder.file(fileName, file);
    });

    // Generate and download ZIP
    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'filtered_files.zip';
        link.click();

        displayMessage(resultDiv, loader, 'Filtered and converted files have been zipped and downloaded.');
    }).catch(() => {
        displayMessage(resultDiv, loader, 'An error occurred during file processing.');
    });
}

function displayMessage(resultDiv, loader, message) {
    loader.style.display = 'none'; // Hide loader
    resultDiv.innerHTML = `<p>${message}</p>`;
}