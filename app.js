// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCotpjWvQ5cG5cOpgiNvpAS4ftvwKRO_N0",
    authDomain: "eduhub-a3762.firebaseapp.com",
    projectId: "eduhub-a3762",
    storageBucket: "eduhub-a3762.appspot.com",
    messagingSenderId: "115221366217",
    appId: "1:115221366217:web:d6cee26ef04752d1519418",
    measurementId: "G-X1MQF5SR3Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Display message to the user
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? 'red' : 'green';
    messageDiv.style.display = 'block'; // Show message
}

// Function to fetch files and folders from Firebase Storage
function fetchFiles(path = '') {
    const listRef = storage.ref(path);
    
    showMessage('Loading files...');

    listRef.listAll().then((res) => {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = ''; // Clear previous list

        // Display current path
        const currentPath = path ? path.split('/').filter(Boolean).join('/') : 'Root';
        document.getElementById('path').textContent = `Current Path: ${currentPath}`;

        // Fetch files
        res.items.forEach((itemRef) => {
            itemRef.getDownloadURL().then((url) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `<i class="fas fa-file"></i><a href="${url}" target="_blank">${itemRef.name}</a>`;
                fileList.appendChild(fileItem);
            }).catch(error => showMessage(`Error getting URL for file ${itemRef.name}: ${error.message}`, true));
        });

        // Fetch folders
        res.prefixes.forEach((folderRef) => {
            const folderItem = document.createElement('div');
            folderItem.className = 'folder-item';
            folderItem.innerHTML = `<i class="fas fa-folder"></i>${folderRef.name}`;
            folderItem.onclick = () => fetchFiles(folderRef.fullPath); // Navigate to folder
            fileList.appendChild(folderItem);
        });

        showMessage('Files loaded successfully.');
    }).catch((error) => {
        showMessage(`Error fetching files: ${error.message}`, true);
    });
}

// Start fetching files from the root folder
fetchFiles();
