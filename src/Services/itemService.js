// Switch this to true when you have set up your firebase keys
const USE_FIREBASE = false;

import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const getItems = async () => {
  if (USE_FIREBASE) {
    const querySnapshot = await getDocs(collection(db, "items"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
