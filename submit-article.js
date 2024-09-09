// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_dNTrWIo8fSTub-J4uh_Yjf4Fr_qay3c",
  authDomain: "ind-edu.firebaseapp.com",
  databaseURL: "https://ind-edu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ind-edu",
  storageBucket: "ind-edu.appspot.com",
  messagingSenderId: "60520122150",
  appId: "1:60520122150:web:0205f57353dae6cfc723e7",
  measurementId: "G-XLZRGM88T9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = 'login.html';
});

document.getElementById('logout-btn').addEventListener('click', () => {
  auth.signOut().catch((error) => {
    console.error('Error signing out: ', error);
  });
});

document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!auth.currentUser) {
    alert('You must be logged in to submit an article.');
    return;
  }

  const articleName = document.getElementById('article-name').value;
  const district = document.getElementById('district').value;
  const block = document.getElementById('block').value;
  const content = document.getElementById('content').value;

  try {
    await db.collection('articles').add({
      articleName,
      district,
      block,
      content,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uid: auth.currentUser.uid
    });
    document.getElementById('form').reset();
    alert('Article submitted successfully.');
  } catch (error) {
    console.error('Error submitting article: ', error);
  }
});
