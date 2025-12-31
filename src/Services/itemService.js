// Switch this to true when you have set up your firebase keys
const USE_FIREBASE = true;

import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const getItems = async () => {
  if (USE_FIREBASE) {
    const querySnapshot = await getDocs(collection(db, "items"));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } else {
    // Local Dev Mode
    const response = await fetch('/api/items');
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  }
};

export const addItem = async (item) => {
  if (USE_FIREBASE) {
    const docRef = await addDoc(collection(db, "items"), item);
    return { id: docRef.id, ...item };
  } else {
    // Local Dev Mode
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to save item');
    return response.json();
  }
};

export const updateItem = async (id, updatedData) => {
  if (USE_FIREBASE) {
    // Ensure ID is a string for Firestore
    const itemId = String(id);
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, updatedData);
    return { id: itemId, ...updatedData };
  } else {
    // Local Dev Mode (Simulation or implementing middleware logic if needed)
    // For now, we might not have backend logic for PUT/DELETE in the simple middleware
    // We can just return the data to update UI
    throw new Error("Update not supported in Local Mode yet");
  }
};

export const deleteItem = async (id) => {
  if (USE_FIREBASE) {
    // Ensure ID is a string for Firestore
    const itemId = String(id);
    await deleteDoc(doc(db, "items", itemId));
    return itemId;
  } else {
    // Local Dev Mode
    throw new Error("Delete not supported in Local Mode yet");
  }
};
