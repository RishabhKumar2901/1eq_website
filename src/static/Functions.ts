import { db } from '../Firebase';
import { doc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import axios from "axios";

/**
 * Generic function to store data in Firestore
 * @param collectionName - Firestore collection name
 * @param docId - Document ID (optional, if null a new document will be created)
 * @param data - Data to be stored
 */
export const storeData = async (collectionName: string, docId: string | null, data: any) => {
  try {
    if (docId) {
      await setDoc(doc(db, collectionName, docId), data);
    } else {
      await addDoc(collection(db, collectionName), data);
    }
    console.log(`Data stored successfully in ${collectionName}`);
  } catch (error) {
    console.error(`Error storing data in ${collectionName}:`, error);
  }
};

/**
 * Generic function to fetch all documents from a Firestore collection
 * @param collectionName - Firestore collection name
 * @returns Array of documents
 */
export const fetchAllData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: any[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Data fetched successfully from ${collectionName}`);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}:`, error);
    return [];
  }
};

export const fetchSuggestions = async (value: string) => {
  try {
    const { data } = await axios.get(`https://api.datamuse.com/words`, {
      params: { sp: `${value}*`, max: 10 },
    });
    return data.map((item: { word: string }) => item.word);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};