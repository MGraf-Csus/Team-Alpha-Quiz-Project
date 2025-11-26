import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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

// --- Logging Method (Don't Touch) ---
function logResult(action, collection, docId, data = "") {
    console.log(`[${action}] (${collection}/${docId})`, data);
}

// --- Account Methods ---

async function signInUsernamePassword(username, password) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) throw new Error("User doesn't exist.");
        if (docSnap.data().password !== password) throw new Error("Incorrect Password");
        console.log("✅ Signed in successfully");
        return getDocumentData('users', username);
    } catch (error) {
        console.error("❌ Error signing in:", error);
        return false;
    }
}

async function createAccountWithUsernamePassword(username, password, role) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (docSnap.exists()) throw new Error("User already exists.");
        await addDocument("users", username, { username, password, role });
        console.log("✅ Created account");
        return true;
    } catch (error) {
        console.error("❌ Error creating account:", error);
        return false;
    }
}

async function deleteAccount(username) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) throw new Error("User doesn't exist");
        await deleteDocument('users', username);
        console.log("✅ Account deleted succefully", error);
        return true;
    } catch (error) {
        console.error("❌ Error deleting account:", error);
        return false;
    }
}

async function getAccount(username) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) throw new Error("User doesn't exist");
        console.log("✅ Account retrieved successfully");
        return docSnap.data();
    } catch (error) {
        console.error("❌ Error retrieving account:", error);
        return false;
    }
}

async function editAccount(username, updates = null) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) throw new Error("User doesn't exist");
        if (updates != null) await updateDoc(doc(db, 'users', username), updates);
        console.log("✅ Account edited successfully");
        return true;
    } catch (error) {
        console.error("❌ Error editing account:", error);
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

// Retrieves all ID's in a collection
// Returns all ID's of a collection and null if collectionName is invalid
async function getDocumentIDS(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docIds = querySnapshot.docs.map(doc => doc.id);
        return docIds;
    } catch (error) {
        console.error(error);
        return [];
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
    createAccountWithUsernamePassword,
    deleteAccount,
    getAccount,
    editAccount,
    addEmptyDocument,
    addDocument,
    deleteDocument,
    rewriteDocument,
    saveDocument,
    getDocumentData,
    getDocumentDataField,
    getDocumentIDS,
};
