
import { addDoc, collection, getDocs, query, where, doc, getDoc, limit, orderBy } from 'firebase/firestore';
import { firestore } from './firebase';
import { EntryInfo, EntryResultInfo, EntryResultInfoCompact } from './types';

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

export const getLatestSubmissions = async (): Promise<EntryResultInfoCompact[]> => {
  const entriesRef = collection(firestore, 'entries');
  const q = query(entriesRef, orderBy('postTime', 'desc'), limit(12));

  try {
    const snapshot = await getDocs(q);
    const latestSubmissions: EntryResultInfoCompact[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        courseCode: data.courseCode,
        semester: data.semester,
        postTime: new Date(data.postTime).getTime() || null,
      };
    });
    return latestSubmissions;
  } catch (error) {
    console.error('Error fetching latest submissions:', error);
    return [];
  }
};