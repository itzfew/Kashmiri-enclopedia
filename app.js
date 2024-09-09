// Firebase configuration and initialization
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
const auth = firebase.auth();
const db = firebase.firestore();

// Handle user login/logout
document.getElementById('login-btn')?.addEventListener('click', () => {
  document.getElementById('login-modal').style.display = 'block';
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
  auth.signOut().catch((error) => {
    console.error('Error signing out: ', error);
  });
});

document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error logging in: ', error);
  }
});

document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error signing up: ', error);
  }
});

document.getElementById('update-profile-btn')?.addEventListener('click', () => {
  document.getElementById('update-profile-modal').style.display = 'block';
});

document.getElementById('update-profile-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (!auth.currentUser) {
    alert('You must be logged in to update profile.');
    return;
  }

  const name = document.getElementById('update-name').value;
  
  try {
    await db.collection('users').doc(auth.currentUser.uid).set({
      name
    }, { merge: true });
    document.getElementById('update-profile-modal').style.display = 'none';
    showProfile();
  } catch (error) {
    console.error('Error updating profile: ', error);
  }
});

document.getElementById('form')?.addEventListener('submit', async (event) => {
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
    window.location.href = 'articles-list.html'; // Redirect to list page
  } catch (error) {
    console.error('Error submitting article: ', error);
  }
});

document.getElementById('search-btn')?.addEventListener('click', () => {
  loadArticles();
});

document.getElementById('load-more-btn')?.addEventListener('click', () => {
  loadArticles(true);
});

function loadArticles(loadMore = false) {
  const articlesContainer = document.getElementById('articles-container');
  
  let query = db.collection('articles')
    .orderBy('timestamp', 'desc')
    .limit(loadMore ? 20 : 10);
  
  const searchQuery = document.getElementById('search-query')?.value.toLowerCase();

  if (searchQuery) {
    query = query.where('articleName', '>=', searchQuery)
                 .where('articleName', '<=', searchQuery + '\uf8ff');
  }

  query.get().then((querySnapshot) => {
    if (!loadMore) articlesContainer.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
      const article = doc.data();
      const articleElement = document.createElement('div');
      articleElement.classList.add('article-item');
      articleElement.innerHTML = `
        <h3>${article.articleName}</h3>
        <p><strong>District:</strong> ${article.district}</p>
        <p><strong>Block:</strong> ${article.block}</p>
        <a href="article.html?id=${doc.id}">Read More</a>
        ${auth.currentUser && auth.currentUser.uid === article.uid ? `
          <button onclick="editArticle('${doc.id}')">Edit</button>
          <button onclick="deleteArticle('${doc.id}')">Delete</button>
        ` : ''}
      `;
      articlesContainer.appendChild(articleElement);
    });
  });
}

function loadArticleDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (articleId) {
    db.collection('articles').doc(articleId).get().then((doc) => {
      const article = doc.data();
      document.getElementById('article-title').innerText = article.articleName;
      document.getElementById('article-district').innerText = article.district;
      document.getElementById('article-block').innerText = article.block;
      document.getElementById('article-content').innerText = article.content;
    }).catch((error) => {
      console.error('Error loading article details: ', error);
    });
  }
}

function showProfile() {
  if (auth.currentUser) {
    db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
      const userData = doc.data();
      document.getElementById('profile-info').innerText = `Name: ${userData ? userData.name : 'N/A'}`;
      document.getElementById('profile-btn').style.display = 'inline-block';
      document.getElementById('logout-btn').style.display = 'inline-block';
      document.getElementById('login-btn').style.display = 'none';
    });
  }
}

function editArticle(articleId) {
  // Redirect to a page or show a form to edit the article (to be implemented)
}

function deleteArticle(articleId) {
  if (!auth.currentUser) {
    alert('You must be logged in to delete an article.');
    return;
  }

  db.collection('articles').doc(articleId).delete().then(() => {
    loadArticles();
  }).catch((error) => {
    console.error('Error deleting article: ', error);
  });
}

// Load the articles list if on the list page
if (document.getElementById('articles-container')) {
  loadArticles();
}

// Load article details if on the article details page
if (document.getElementById('article-details')) {
  loadArticleDetails();
}

// Show profile information if on the profile page
if (document.getElementById('profile-info')) {
  showProfile();
}

// Handle close modal functionality
document.querySelectorAll('.close').forEach(close => {
  close.addEventListener('click', () => {
    close.parentElement.parentElement.style.display = 'none';
  });
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});
