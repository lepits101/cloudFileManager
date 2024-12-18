// Import the necessary Firebase services
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } 
  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

// Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyBE1XiorXsqQmtKzMuyJlyuGgtBvSBdieg",
  authDomain: "ordertaker-44ee4.firebaseapp.com",
  projectId: "ordertaker-44ee4",
  storageBucket: "ordertaker-44ee4.appspot.com",
  messagingSenderId: "293313118124",
  appId: "1:293313118124:web:d49314bbdca2b28bfd8409"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM Elements
const authContainer = document.getElementById("auth-container");
const aboutSection = document.getElementById("about-section");
const docsSection = document.getElementById("docs-section");
const fileManager = document.getElementById("file-manager");
const navLinks = {
  about: document.getElementById("about-link"),
  docs: document.getElementById("docs-link"),
  files: document.getElementById("files-link"),
  logout: document.getElementById("logout-link"),
};

// Navigation Links
navLinks.about.addEventListener("click", () => showSection(aboutSection));
navLinks.docs.addEventListener("click", () => showSection(docsSection));
navLinks.files.addEventListener("click", () => showSection(fileManager));
navLinks.logout.addEventListener("click", () => {
  signOut(auth).catch(err => alert(err.message));
});

// Show Section Function
function showSection(sectionToShow) {
  [aboutSection, docsSection, fileManager].forEach(section => {
    section.style.display = "none";
  });
  sectionToShow.style.display = "block";
}

// Authentication Logic
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .catch(err => alert(err.message));
});

document.getElementById("signup-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .catch(err => alert(err.message));
});

// Auth State Change Listener
// Auth State Change Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in: show nav links and default section
      Object.values(navLinks).forEach(link => link.style.display = "inline");
      authContainer.style.display = "none";
      showSection(aboutSection); // Default section to About
  
      // Call loadFiles to fetch and display the files
      loadFiles();
    } else {
      // User is logged out: hide nav links and show auth container
      [aboutSection, docsSection, fileManager].forEach(section => section.style.display = "none");
      Object.values(navLinks).forEach(link => link.style.display = "none");
      authContainer.style.display = "block";
    }
  });
  

// File Upload and Load Logic
const fileList = document.getElementById("file-list");

document.getElementById("upload-btn").addEventListener("click", () => {
  const file = document.getElementById("file-input").files[0];
  if (file) {
    const storageRef = ref(storage, `files/${auth.currentUser.uid}/${file.name}`);
    uploadBytes(storageRef, file).then(() => {
      alert("File uploaded successfully!");
      loadFiles();
    }).catch(err => alert(err.message));
  }
});

// Function to load files
function loadFiles() {
    fileList.innerHTML = "";  // Clear the list before adding new items
  
    const storageRef = ref(storage, `files/${auth.currentUser.uid}`);
  
    listAll(storageRef).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          const li = document.createElement("li");
  
          // Render file link and delete button (removed download button)
          li.innerHTML = `
            <a href="${url}" target="_blank">${itemRef.name}</a>
            <button onclick="deleteFile('${itemRef.fullPath}')">Delete</button>
          `;
  
          fileList.appendChild(li);
        });
      });
    }).catch(err => alert("Error loading files: " + err.message));
  }
  

// Function to delete a file with confirmation
window.deleteFile = function (path) {
    // Show a confirmation dialog before deleting
    const isConfirmed = confirm("Are you sure you want to delete this file?");
  
    if (isConfirmed) {
      const fileRef = ref(storage, path);
  
      deleteObject(fileRef).then(() => {
        alert("File deleted successfully!");
        loadFiles(); // Reload the file list after deletion
      }).catch(err => {
        alert("Error deleting file: " + err.message);
      });
    } else {
      // If the user cancels the deletion, show a message (optional)
      console.log("File deletion cancelled.");
    }
  };
