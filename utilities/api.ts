
import { addDoc, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { EntryInfo, EntryResultInfo } from './types';

export const addCourseEntry = async (data: EntryInfo) => {
  const collectionRef = collection(firestore, 'entries');
  await addDoc(collectionRef, data);
};

export const requestEntryUpdate = async (data: any) => {
  const collectionRef = collection(firestore, 'updateRequests');
  await addDoc(collectionRef, data);
}

export const searchFirestore = async (searchQuery: string) => {
  const entriesRef = collection(firestore, 'entries');
  const q = query(entriesRef, where('courseCode', '>=', searchQuery), where('courseCode', '<', searchQuery + '\uf8ff'));

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EntryResultInfo));
  return data;
};


export const getEntryById = async (entryId: string) => {
  const entryRef = doc(firestore, 'entries', entryId);

  try {
    const entrySnapshot = await getDoc(entryRef);
    if (entrySnapshot.exists()) {
      const entryData = entrySnapshot.data();
      return entryData;
    } else {
      return undefined;
    }
  } catch (error) {
    return null;
  }
};