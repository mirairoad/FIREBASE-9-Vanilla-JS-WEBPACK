// initialize firebase config
import { initializeApp } from "firebase/app";
import firebaseConfig from "./config";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
  updateDoc
} from "firebase/firestore";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

// getDocs() get collection on request ... dont' forget import it

// For Firebase JS SDK v7.20.0 and later, measurementId is optional and I have importend to the top


// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// colelction ref
const colRef = collection(db, "books");

// queries
const q = query(colRef, orderBy("createdAt"));

// get collection data / give back a promise => function
// ---------------------------- //
// colRef  --> db --> books
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = []
//     snapshot.docs.forEach((doc) => {
//         books.push({...doc.data(), id: doc.id})
//     })
//     console.log(books)
//   })
//   .catch(err => {
//     console.log(err)
//   })
// ---------------------------- //

// get realtime data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// Get a single document
const docRef = doc(db, 'books', 'JqlZGzXq8YnFm2j6dpDu')

// getDoc(docRef)
// .then((doc) => {
//     console.log(doc.data(), doc.id)
// })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed',user)
  })


//------- FRONTEND FUNCTIONs --------- //

//Add a document
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// Delete document by ID
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// update document by ID
const updateBookForm = document.querySelector(".update");
updateBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateBookForm.id.value);
  const titleValue = updateBookForm.title.value

  updateDoc(docRef, {
    title: titleValue
  }).then(() => {
    updateBookForm.reset();
  })
});

// Signin Up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log('user created:', cred.user)
        signupForm.reset()
    })
    .catch((err) => {
        console.log(err.message)
    })
})

// Logout
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
    e.preventDefault()

    signOut(auth)
    .then(() => {
        // console.log('the user signed out')
    })
    .catch((err) => {

        console.log(err.message)
    })
});

// Login
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        // console.log('the user logged in', cred.user)
        loginForm.reset()
    })
    .catch((err) => {
        console.log(err.message)
    })
});


// Logout
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', (e) => {
    e.preventDefault()

    console.log('unsubscribing')

    unsubCol()
    unsubDoc()
    unsubAuth()
});

  //------- END FRONTEND FUNCTIONs --------- //

