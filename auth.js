function logout() {
    firebase.auth().signOut().then(() => {
        location.reload();
    }).catch(error => {
        alert('Error logging out: ' + error.message);
    });
}

// Authentication logic (Login/Signup)
// You can create a separate login.html page with forms to handle user login/signup.
