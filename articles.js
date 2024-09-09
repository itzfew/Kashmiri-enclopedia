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

document.getElementById('search-btn').addEventListener('click', () => {
  loadArticles();
});

document.getElementById('filter-district').addEventListener('change', () => {
  loadArticles();
});

document.getElementById('filter-block').addEventListener('change', () => {
  loadArticles();
});

function loadArticles() {
  const district = document.getElementById('filter-district').value;
  const block = document.getElementById('filter-block').value;
  const searchQuery = document.getElementById('search-query').value.toLowerCase();

  let query = db.collection('articles')
    .orderBy('timestamp', 'desc')
    .limit(10);

  if (district) {
    query = query.where('district', '==', district);
  }
  
  if (block) {
    query = query.where('block', '==', block);
  }

  if (searchQuery) {
    query = query.where('articleName', '>=', searchQuery)
                 .where('articleName', '<=', searchQuery + '\uf8ff');
  }

  query.get().then((querySnapshot) => {
    const articlesContainer = document.getElementById('articles-container');
    articlesContainer.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
      const article = doc.data();
      const articleElement = document.createElement('div');
      articleElement.classList.add('article-item');
      articleElement.innerHTML = `
        <h3><a href="article-details.html?id=${doc.id}">${article.articleName}</a></h3>
        <p><strong>District:</strong> ${article.district}</p>
        <p><strong>Block:</strong> ${article.block}</p>
      `;
      articlesContainer.appendChild(articleElement);
    });
  }).catch((error) => {
    console.error('Error loading articles: ', error);
  });
}

function loadFilters() {
  db.collection('districts').get().then((querySnapshot) => {
    const districtSelect = document.getElementById('filter-district');
    querySnapshot.forEach((doc) => {
      const district = doc.data().name;
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });
  }).catch((error) => {
    console.error('Error loading districts: ', error);
  });

  db.collection('blocks').get().then((querySnapshot) => {
    const blockSelect = document.getElementById('filter-block');
    querySnapshot.forEach((doc) => {
      const block = doc.data().name;
      const option = document.createElement('option');
      option.value = block;
      option.textContent = block;
      blockSelect.appendChild(option);
    });
  }).catch((error) => {
    console.error('Error loading blocks: ', error);
  });
}

loadArticles();
loadFilters();
