// Your web app's Firebase configuration
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

// Reference to Firebase Storage
const storage = firebase.storage();

async function loadPDFs() {
    const pdfListDiv = document.getElementById('pdf-list');
    const pdfFiles = ['file1.pdf', 'file2.pdf', 'file3.pdf']; // Replace with your actual PDF file names

    pdfFiles.forEach(fileName => {
        const pdfRef = storage.ref(`pdfs/${fileName}`);
        pdfRef.getDownloadURL().then(url => {
            const pdfItem = document.createElement('div');
            pdfItem.classList.add('pdf-item');
            pdfItem.innerHTML = `<a href="${url}" target="_blank">${fileName}</a>`;
            pdfListDiv.appendChild(pdfItem);
        }).catch(error => {
            console.error("Error fetching PDF:", error);
        });
    });
}

window.onload = loadPDFs;
