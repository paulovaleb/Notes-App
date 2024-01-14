import { collection, getDocs, doc, getDoc, setDoc, addDoc, runTransaction  } from 'firebase/firestore';
import { db } from './firebase';

// Function to get all documents in a collection
export const getAllDocuments = async (collectionName: string) => {
  const documents: any[] = [];
  const querySnapshot = await getDocs(collection(db, collectionName));

  querySnapshot.forEach((doc) => {
    const data = doc.data()
    documents.push({
      id: doc.id,
      name: data.name,
      value: data.value
    });
  });

  return documents;
};

// Function to get a document by its ID
export const getDocumentById = async (collectionName: string, documentId: string) => {
  const documentRef = doc(db, collectionName, documentId);
  const documentSnapshot = await getDoc(documentRef);

  if (documentSnapshot.exists()) {
    const data = documentSnapshot.data()
    return {
      id: documentSnapshot.id,
      name: data.name,
      value: data.value
    };
  } else {
    return null; // Document not found
  }
};
// Function to set a value in a Firestore document
export const setValueInFirestore = async (collectionName: string, documentId: number, name: string, value : string) => {

  const docData = {
    name: name,
    value: value,
};

try {
    await setDoc(doc(db, collectionName, String(documentId)), docData);
    console.log(`Value ${value} set in Firestore at ${collectionName}/${documentId}`);
  } catch (error) {
    console.error('Error setting value in Firestore:', error);
  }
};

// Function to set a value in a Firestore document
export const addValueInFirestore = async (collectionName: string, documentId: number, name: string, value : string) => {

  try {
    const docRef = await addDoc(collection(db, collectionName), {
      id : documentId,
      name: name||'',
      value: value||'',
    });
    console.log(`Value ${value} set in Firestore at ${collectionName}/${documentId}`);
    return docRef.id;
  } catch (error) {
    console.error('Error setting value in Firestore:', error);
  }
};

// Function to set or add a value in a Firestore document with a specific ID
export const setValueInFirestoreById = async (
  collectionName: string,
  documentId: string, // Use string for document IDs
  name: string,
  value: string
) => {
  try {
    console.log( collectionName,
      documentId,
      name,
      value)
    const docRef = doc(collection(db, collectionName), documentId);

    // Use setDoc to either update the existing document or add a new one with the specified ID
    await setDoc(docRef, {
      id: documentId,
      name: name || '',
      value: value || '',
    });

    console.log(`Value ${value} set in Firestore at ${collectionName}/${documentId}`);
  } catch (error) {
    console.error('Error setting value in Firestore:', error);
  }
};