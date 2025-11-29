import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Account Methods ---

async function signInUsernamePassword(username, password) {
    try {
        const docSnap = await getDoc(doc(db, 'users', username));
        if (!docSnap.exists()) throw new Error("Incorrect Credentials");
        if (docSnap.data().password !== password) throw new Error("Incorrect Credentials");
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
        return error;
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
        if (updates != null) await saveDocument('users', username, updates);
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
        console.log("✅ Created Empty Document");
    } catch (error) {
        console.error(`[❌ Error Creating Document]:`, error);
    }
}

// Creates a document with specified fields and values in the given collection
// `docId` is the document identifier, `data` is an object with field-value pairs
async function addDocument(collection, docId, data) {
    try {
        await setDoc(doc(db, collection, docId), data);
        console.log("✅ Added Document");
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
        console.log("✅ Updated Document (Merge)");
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
        console.log("✅ Deleted Document");
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
        console.log("✅ Rewrote Document");
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
            console.log("✅ Fetched Document");
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
        console.log("✅ Fetched Field");
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
