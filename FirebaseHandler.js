import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// --- Firebase config (DON"T TOUCH IT) ---
const firebaseConfig = {
  apiKey: "AIzaSyDGsH-wE6-DBE0q0CUjFjkqYzFGaje0KFs",
  authDomain: "team-alpha-quiz-db-79c1f.firebaseapp.com",
  projectId: "team-alpha-quiz-db-79c1f",
  storageBucket: "team-alpha-quiz-db-79c1f.firebasestorage.app",
  messagingSenderId: "1081382156789",
  appId: "1:1081382156789:web:f73623780655702d4648bc",
  measurementId: "G-6LFQZZNV8L"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Logging Method (Don't Touch) ---
function logResult(action, collection, docId, data = "") {
    console.log(`[${action}] (${collection}/${docId})`, data);
}

// --- Account Methods ---

// Sign in using Firebase Auth
async function signInUsernamePassword(username, password) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) {
            throw new Error("User doesn't exists.");
        }
        const fakeEmail = `${username}@domain.com`;
        await signInWithEmailAndPassword(auth, fakeEmail, password);
        console.log("✅ Signed in succesfully");
        return getDocumentData('users', username);
    } catch (error) {
        console.error("❌ Error signing in:", error);
        return false;
    }
}

// Sign out using Firebase Auth
async function signOutUser() {
    try {
        await signOut(auth);
        console.log("✅ User signed out successfully");
        return true;
    } catch (error) {
        console.error("❌ Error signing out:", error);
        return false;
    }
}

// Create account using Firebase Auth
async function createAccountWithUsernamePassword(adminId, username, password, role) {
    let effectiveAdminId = adminId;
    try {
        const fakeEmail = `${username}@domain.com`;
        await createUserWithEmailAndPassword(auth, fakeEmail, password);
        await addDocument("users", username, {adminId: effectiveAdminId, username, role});
        return true;
    } catch (error) {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (error.code === 'auth/email-already-in-use' && !docSnap.exists()) {
            await addDocument("users", username, {adminId: effectiveAdminId, username, role});
            return true;
        }
        console.error("❌ Error creating account:", error);
        return false;
    }
}


// Delete account using Firebase Auth
async function deleteAccount(username) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) {
            throw new Error("User doesn't exist");
        }
        await deleteDocument('users', username);
    } catch (error) {
        console.error(error);
        return false;
    }
}

// --- CRUD Methods ---

// Creates a new empty document in the specified collection
async function addEmptyDocument(collection, docId = "defaultDoc") {
  try {
        await setDoc(doc(db, collection, docId), {});
        logResult("✅ Created Empty Document", collection, docId);
    } catch (error) {
        console.error(`[❌ Error Creating Document]:`, error);
    }
}

// Creates a document with specified fields and values in the given collection
// `docId` is the document identifier, `data` is an object with field-value pairs
async function addDocument(collection, docId, data) {
    try {
        await setDoc(doc(db, collection, docId), data);
        logResult("✅ Added Document", collection, docId, data);
        return true;
    } catch (error) {
        console.error(`[❌ Error Adding Document]:`, error);
        return false;
    }
}

// Updates specific fields of a document while keeping existing fields intact
// Uses Firestore's merge option to only update or add the fields in `data`
async function saveDocument(collection, docId, data) {
    try {
        await setDoc(doc(db, collection, docId), data, { merge: true });
        logResult("✅ Updated Document (Merge)", collection, docId, data);
        return true;
    } catch (error) {
        console.error(`[❌ Error Merging Document]:`, error);
        return false;
    }
}

// Deletes a document from a specified collection
// This permanently removes the document and its fields
async function deleteDocument(collection, docId) {
    try {
        await deleteDoc(doc(db, collection, docId));
        logResult("✅ Deleted Document", collection, docId);
        return true;
    } catch (error) {
        console.error(`[❌ Error Deleting Document]:`, error);
        return false;
    }
}

// Completely overwrites a document with new data
// All previous fields are replaced with the new `data` object
async function rewriteDocument(collection, docId, data) {
    try {
        await setDoc(doc(db, collection, docId), data);
        logResult("✅ Rewrote Document", collection, docId, data);
        return true;
    } catch (error) {
        console.error(`[❌ Error Rewriting Document]:`, error);
        return false;
    }
}

// Retrieves all the fields and values of a document
// Returns the entire document data as an object or null if the document does not exist
async function getDocumentData(collection, docId) {
    try {
        const docSnap = await getDoc(doc(db, collection, docId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            logResult("✅ Fetched Document", collection, docId, data);
            return data;
        } else {
            console.warn(`[❌ Missing Document] (${collection}/${docId})`);
            return null;
        }
    } catch (error) {
        console.error(`[❌ Error Getting Document]:`, error);
    }
}

// Retrieves a single field from a document
// Returns the value of the requested field or null if it does not exist
async function getDocumentDataField(collection, docId, field) {
    try {
    const docSnap = await getDoc(doc(db, collection, docId));
    if (docSnap.exists()) {
        const value = docSnap.data()[field] ?? null;
        logResult("✅ Fetched Field", collection, docId, { [field]: value });
        return value;
    } else {
        console.warn(`[❌ Missing Document] (${collection}/${docId})`);
        return null;
    }
    } catch (error) {
        console.error(`[❌ Error Getting Field]:`, error);
    }
}

export {
    signInUsernamePassword,
    signOutUser,
    createAccountWithUsernamePassword,
    addEmptyDocument,
    addDocument,
    deleteDocument,
    rewriteDocument,
    saveDocument,
    getDocumentData,
    getDocumentDataField,
};
