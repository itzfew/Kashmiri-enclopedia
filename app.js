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

// Show loading spinner
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Display message to the user
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? 'red' : 'green';
    messageDiv.style.display = 'block'; // Show message
}

// Function to fetch files and folders from Firebase Storage
function fetchFiles(path = '', searchTerm = '') {
    showLoading();
    const listRef = storage.ref(path);
    
    showMessage('Loading files...');

    listRef.listAll().then((res) => {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = ''; // Clear previous list

        // Display current path
        const currentPath = path ? path.split('/').filter(Boolean) : ['Root'];
        const pathDisplay = currentPath.map((p, i) => {
            return `<a href="#" onclick="fetchFiles('${currentPath.slice(0, i + 1).join('/')}')">${p}</a>`;
        }).join(' / ');
        document.getElementById('path').innerHTML = `Current Path: ${pathDisplay}`;

        // File count
        showMessage(`Total Files: ${res.items.length + res.prefixes.length}`);

        // Fetch files
        res.items.forEach((itemRef) => {
            if (searchTerm && !itemRef.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return; // Skip files that don't match the search term
            }
            itemRef.getMetadata().then(metadata => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                const uploadDate = new Date(metadata.updated).toLocaleDateString();
                fileItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <a href="${metadata.downloadURLs ? metadata.downloadURLs[0] : '#'}" target="_blank">${itemRef.name}</a>
                    <span class="upload-date">(${uploadDate})</span>
                    <button class="delete-btn" onclick="deleteFile('${itemRef.fullPath}')">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                fileList.appendChild(fileItem);
            }).catch(error => showMessage(`Error getting metadata for file ${itemRef.name}: ${error.message}`, true));
        });

        // Fetch folders
        res.prefixes.forEach((folderRef) => {
            const folderItem = document.createElement('div');
            folderItem.className = 'folder-item';
            folderItem.innerHTML = `
                <i class="fas fa-folder"></i>${folderRef.name}
                <button class="delete-btn" onclick="deleteFile('${folderRef.fullPath}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            folderItem.onclick = () => fetchFiles(folderRef.fullPath); // Navigate to folder
            fileList.appendChild(folderItem);
        });

        hideLoading();
        showMessage('Files loaded successfully.');
    }).catch((error) => {
        hideLoading();
        showMessage(`Error fetching files: ${error.message}`, true);
    });
}

// Function to delete a file or folder
function deleteFile(path) {
    const confirmation = confirm('Are you sure you want to delete this file/folder?');
    if (!confirmation) return;

    const fileRef = storage.ref(path);
    showLoading();
    
    fileRef.delete().then(() => {
        hideLoading();
        showMessage('File/Folder deleted successfully.');
        fetchFiles(); // Refresh file list
    }).catch(error => {
        hideLoading();
        showMessage(`Error deleting file: ${error.message}`, true);
    });
}

// Event listeners
document.getElementById('search').addEventListener('input', (e) => {
    fetchFiles('', e.target.value); // Search as user types
});

document.getElementById('menuToggle').addEventListener('click', () => {
    const menu = document.getElementById('sideMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Start fetching files from the root folder
fetchFiles();
