
import { FirebaseError } from '@firebase/util';
import { DocumentData, DocumentSnapshot, Query, addDoc, collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { firestore } from './firebase';
import { EntryInfo, EntryResultInfo, EntryResultInfoCompact, UserInfo } from './types';

export const addUserToCollection = async (uid: string) => {
  const userData: UserInfo = {
    uid: uid,
    credits: 10,
    votedFor: [],
  };
  const collectionRef = collection(firestore, 'users');
  await addDoc(collectionRef, userData);
};

export const addCourseEntry = async (data: EntryInfo) => {
  const collectionRef = collection(firestore, 'entries');
  await addDoc(collectionRef, data);
};

export const requestEntryUpdate = async (data: any) => {
  const collectionRef = collection(firestore, 'updateRequests');
  await addDoc(collectionRef, data);
};

export const getEntriesByCourseCode = async (searchQuery: string) => {
  const entriesRef = collection(firestore, 'entries');
  const q = query(entriesRef, where(`courseCodeSearch.${searchQuery}`, '==', true));

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
        professor: data.professor,
        campus: data.campus,
        postTime: new Date(data.postTime).getTime() || null,
      };
    });
    return latestSubmissions;
  } catch (error) {
    console.error('Error fetching latest submissions:', error);
    return [];
  }
};

export const getAdvancedSearchResults = async (q: Query): Promise<{
  results: EntryResultInfoCompact[];
  lastVisibleDoc: DocumentSnapshot<DocumentData> | null;
  errorMessage: string | null;
}> => {
  try {
    const snapshot = await getDocs(q);
    const latestSubmissions: EntryResultInfoCompact[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        courseCode: data.courseCode,
        semester: data.semester,
        professor: data.professor,
        campus: data.campus,
        postTime: new Date(data.postTime).getTime() || null,
      };
    });

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    if (latestSubmissions.length == 0) {
      return { results: latestSubmissions, lastVisibleDoc: lastDoc, errorMessage: "No results were found with your current filters 😞" };
    }
    return { results: latestSubmissions, lastVisibleDoc: lastDoc, errorMessage: null };
    
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.message.includes("Too many")) {
        return { results: [], lastVisibleDoc: null, errorMessage: "Sorry, but we currently can't handle that many filter options at the same time.\
        Please remove some and try again." };
      }
    }
    return { results: [], lastVisibleDoc: null, errorMessage: "Oops, something went wrong. Maybe try a different search?" };
  }
};

export const getNumEntries = async (): Promise<number>  => {
  const collectionRef = collection(firestore, 'entries');
  const num = await getCountFromServer(collectionRef);
  return num.data().count;
};