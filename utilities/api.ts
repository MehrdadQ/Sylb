
import { FirebaseError } from '@firebase/util';
import { DocumentData, DocumentSnapshot, Query, QueryFieldFilterConstraint, QueryLimitConstraint, QuerySnapshot, addDoc, arrayUnion, collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { EntryInfo, EntryResultInfo, EntryResultInfoCompact, UserInfo } from './types';

export const addUserToCollection = async (uid: string) => {
  const userData: UserInfo = {
    uid: uid,
    credits: 5,
    hasAccessTo: [],
  };
  const collectionRef = collection(firestore, 'users');
  await addDoc(collectionRef, userData);
};

export const getUserInfo = async (uid: string): Promise<UserInfo | null> => {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('uid', '==', uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const userInfo: UserInfo = { uid, ...doc.data() } as UserInfo;
  return userInfo;
};

export const updateUserCredits = async (uidValue: string, newCredits: number) => {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('uid', '==', uidValue));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDocRef = querySnapshot.docs[0].ref;

    try {
      await updateDoc(userDocRef, { credits: newCredits });
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  }
};

export const addToUserAccessList = async (uidValue: string, entryUid: string) => {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('uid', '==', uidValue));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDocRef = querySnapshot.docs[0].ref;

    try {
      await updateDoc(userDocRef, {
        hasAccessTo: arrayUnion(entryUid)
      });
    } catch (error) {
    }
  }
};

export const addCourseEntry = async (userUid: string, data: EntryInfo) => {
  const collectionRef = collection(firestore, 'entries');
  const newDocRef = await addDoc(collectionRef, data);
  const newEntryUid = newDocRef.id;
  await addToUserAccessList(userUid, newEntryUid);
  return newEntryUid;
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
        courseAverage: data.courseAverage,
        postTime: new Date(data.postTime).getTime() || null,
      };
    });
    return latestSubmissions;
  } catch (error) {
    console.error('Error fetching latest submissions:', error);
    return [];
  }
};

export const getAdvancedSearchResults =
  async (queryConstraints: QueryFieldFilterConstraint[], getTotalCount: boolean, pageSize: number, lastVisibleDoc: DocumentSnapshot<DocumentData> | null): Promise<{
  results: EntryResultInfoCompact[];
  lastVisibleDoc: DocumentSnapshot<DocumentData> | null;
  errorMessage: string | null;
  totalCount?: number;
}> => {
  let totalCount: number | undefined = undefined;
  const entriesRef = collection(firestore, 'entries');

  try {
    if (getTotalCount) {
      const countQuery = query(entriesRef, ...queryConstraints);
      const snapshot = await getCountFromServer(countQuery);
      totalCount = snapshot.data().count;
    }

    let q: Query<DocumentData>;
    if (lastVisibleDoc) {
      q = query(entriesRef, ...queryConstraints, limit(pageSize), startAfter(lastVisibleDoc));
    } else {
      q = query(entriesRef, ...queryConstraints, limit(pageSize));
    }

    const snapshot = await getDocs(q);
    const entries: EntryResultInfoCompact[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        courseCode: data.courseCode,
        semester: data.semester,
        professor: data.professor,
        campus: data.campus,
        courseAverage: data.courseAverage,
        postTime: new Date(data.postTime).getTime() || null,
      };
    });

    if (entries.length === 0) {
      return { results: entries, lastVisibleDoc: null, errorMessage: "No results were found with your current filters 😞", totalCount: 0 };
    }
    
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return { results: entries, lastVisibleDoc: lastDoc, errorMessage: null, ...(getTotalCount && { totalCount }) };
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.message.includes("Too many")) {
        return { results: [], lastVisibleDoc: null, errorMessage: "Sorry, but we currently can't handle that many filter options at the same time. Please remove some and try again.", totalCount: 0 };
      }
    }
    return { results: [], lastVisibleDoc: null, errorMessage: "Oops, something went wrong. Maybe try a different search?", totalCount: 0 };
  }
};

export const getSortedResults =
  async (sortBy: string, getTotalCount: boolean, pageSize: number, lastVisibleDoc: DocumentSnapshot<DocumentData> | null): Promise<{
  results: EntryResultInfoCompact[];
  lastVisibleDoc: DocumentSnapshot<DocumentData> | null;
  errorMessage: string | null;
  totalCount?: number;
}> => {
  let totalCount: number | undefined = undefined;
  const entriesRef = collection(firestore, 'entries');

  try {
    if (getTotalCount) {
      const countQuery = query(entriesRef);
      const snapshot = await getCountFromServer(countQuery);
      totalCount = snapshot.data().count;
    }

    let q: Query<DocumentData>;
    if (lastVisibleDoc) {
      q = query(entriesRef, limit(pageSize), orderBy(sortBy, 'desc'), startAfter(lastVisibleDoc));
    } else {
      q = query(entriesRef, limit(pageSize), orderBy(sortBy, 'desc'));
    }

    const snapshot = await getDocs(q);
    const entries: EntryResultInfoCompact[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        courseCode: data.courseCode,
        semester: data.semester,
        professor: data.professor,
        campus: data.campus,
        courseAverage: data.courseAverage,
        postTime: new Date(data.postTime).getTime() || null,
      };
    });

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    if (entries.length === 0) {
      return { results: entries, lastVisibleDoc: null, errorMessage: "No results were found with your current filters 😞", totalCount: 0 };
    }

    return { results: entries, lastVisibleDoc: lastDoc, errorMessage: null, ...(getTotalCount && { totalCount }) };
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.message.includes("Too many")) {
        return { results: [], lastVisibleDoc: null, errorMessage: "Sorry, but we currently can't handle that many filter options at the same time. Please remove some and try again.", totalCount: 0 };
      }
    }
    return { results: [], lastVisibleDoc: null, errorMessage: "Oops, something went wrong. Maybe try a different search?", totalCount: 0 };
  }
};

export const confirmSessionId = async (session_id: string) => {
  try {
    const response = await fetch(`/api/get-session?session_id=${session_id}`);
    const data = await response.json();

    if (data.status === 'paid' || data.status === 'completed') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
