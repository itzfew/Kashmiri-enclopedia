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

function getArticleIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function loadArticle() {
  const articleId = getArticleIdFromURL();

  if (!articleId) {
    alert('Article not found.');
    return;
  }

  db.collection('articles').doc(articleId).get().then((doc) => {
    if (!doc.exists) {
      alert('Article not found.');
      return;
    }

    const article = doc.data();
    document.getElementById('article-title').textContent = article.articleName;
    document.getElementById('article-district').textContent = article.district;
    document.getElementById('article-block').textContent = article.block;
    document.getElementById('article-content').textContent = article.content;
  }).catch((error) => {
    console.error('Error loading article: ', error);
  });
}

loadArticle();
