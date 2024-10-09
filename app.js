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

// Function to fetch files from Firebase Storage
function fetchFiles(path = '') {
    const listRef = storage.ref(path);

    listRef.listAll().then((res) => {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = ''; // Clear previous list

        res.items.forEach((itemRef) => {
            itemRef.getDownloadURL().then((url) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `<a href="${url}" target="_blank">${itemRef.name}</a>`;
                fileList.appendChild(fileItem);
            });
        });
        
        res.prefixes.forEach((folderRef) => {
            const folderItem = document.createElement('div');
            folderItem.className = 'file-item';
            folderItem.innerHTML = `<strong>${folderRef.name}</strong>`;
            fileList.appendChild(folderItem);
            fetchFiles(folderRef.fullPath); // Fetch files in subfolder
        });
    }).catch((error) => {
        console.error('Error fetching files:', error);
    });
}

// Start fetching files from the root folder
fetchFiles();
