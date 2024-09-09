// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_dNTrWIo8fSTub-J4uh_Yjf4Fr_qay3c",
  authDomain: "ind-edu.firebaseapp.com",
  projectId: "ind-edu",
  storageBucket: "ind-edu.appspot.com",
  messagingSenderId: "60520122150",
  appId: "1:60520122150:web:0205f57353dae6cfc723e7",
  measurementId: "G-XLZRGM88T9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Login Modal
document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('login-modal').style.display = 'block';
});

document.getElementById('login-close').addEventListener('click', () => {
  document.getElementById('login-modal').style.display = 'none';
});

document.getElementById('signup-close').addEventListener('click', () => {
  document.getElementById('signup-modal').style.display = 'none';
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert('Sign Up Successful!');
    document.getElementById('signup-modal').style.display = 'none';
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert('Login Successful!');
    document.getElementById('login-modal').style.display = 'none';
  } catch (error) {
    alert(error.message);
  }
});

// Handle Signup/ Login Toggle
document.getElementById('show-signup').addEventListener('click', () => {
  document.getElementById('login-modal').style.display = 'none';
  document.getElementById('signup-modal').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', () => {
  document.getElementById('signup-modal').style.display = 'none';
  document.getElementById('login-modal').style.display = 'block';
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    await auth.signOut();
    alert('Logged out successfully!');
  } catch (error) {
    alert(error.message);
  }
});

// Show profile and manage login/logout buttons
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('profile-btn').style.display = 'inline';
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline';
    document.getElementById('profile-info').textContent = `Logged in as ${user.email}`;
  } else {
    document.getElementById('profile-btn').style.display = 'none';
    document.getElementById('login-btn').style.display = 'inline';
    document.getElementById('logout-btn').style.display = 'none';
  }
});

// Handle Add Article Form Submission
if (document.getElementById('form')) {
  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('article-name').value;
    const district = document.getElementById('district').value;
    const block = document.getElementById('block').value;
    const content = document.getElementById('content').value;
    try {
      await db.collection('articles').add({
        name,
        district,
        block,
        content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Article added successfully!');
      document.getElementById('form').reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

// Display Articles List
if (document.getElementById('articles-container')) {
  const articlesContainer = document.getElementById('articles-container');
  const searchBtn = document.getElementById('search-btn');
  const searchQuery = document.getElementById('search-query');
  let lastVisible = null;

  const loadArticles = async (query = '') => {
    let articlesRef = db.collection('articles').orderBy('timestamp', 'desc').limit(10);
    if (lastVisible) {
      articlesRef = articlesRef.startAfter(lastVisible);
    }
    if (query) {
      articlesRef = articlesRef.where('name', '>=', query).where('name', '<=', query + '\uf8ff');
    }
    try {
      const snapshot = await articlesRef.get();
      snapshot.forEach(doc => {
        const data = doc.data();
        const articleElement = document.createElement('div');
        articleElement.className = 'article-item';
        articleElement.innerHTML = `
          <h3><a href="article.html?id=${doc.id}">${data.name}</a></h3>
          <p><strong>District:</strong> ${data.district}</p>
          <p><strong>Block:</strong> ${data.block}</p>
        `;
        articlesContainer.appendChild(articleElement);
      });
      if (snapshot.docs.length > 0) {
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
      }
    } catch (error) {
      alert(error.message);
    }
  };

  searchBtn.addEventListener('click', () => {
    articlesContainer.innerHTML = '';
    lastVisible = null;
    loadArticles(searchQuery.value);
  });

  document.getElementById('load-more-btn').addEventListener('click', () => {
    loadArticles(searchQuery.value);
  });

  loadArticles();
}

// Display Article Details
if (document.getElementById('article-title')) {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  if (articleId) {
    db.collection('articles').doc(articleId).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById('article-title').textContent = data.name;
        document.getElementById('article-district').textContent = data.district;
        document.getElementById('article-block').textContent = data.block;
        document.getElementById('article-content').textContent = data.content;
      } else {
        alert('Article not found');
      }
    }).catch(error => {
      alert(error.message);
    });
  }
}

// Handle Update Profile Form Submission
if (document.getElementById('update-profile-form')) {
  document.getElementById('update-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('update-name').value;
    const user = auth.currentUser;
    try {
      await db.collection('users').doc(user.uid).set({ name });
      alert('Profile updated successfully!');
      document.getElementById('update-profile-modal').style.display = 'none';
    } catch (error) {
      alert(error.message);
    }
  });
}

// Handle Update Profile Modal
if (document.getElementById('update-profile-btn')) {
  document.getElementById('update-profile-btn').addEventListener('click', () => {
    document.getElementById('update-profile-modal').style.display = 'block';
  });

  document.getElementById('update-profile-close').addEventListener('click', () => {
    document.getElementById('update-profile-modal').style.display = 'none';
  });
}
