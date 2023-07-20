// import collection from 'firebase/compat/firestore';
// import addDoc from 'firebase/compat/firestore';
import { collection, addDoc } from 'firebase/firestore';

import { auth, firestore } from './firebase';
import { EntryInfo } from './types';

export const addCourseEntry = async (data: EntryInfo) => {
  const collectionRef = collection(firestore, 'entries');
  await addDoc(collectionRef, data);
  const collectionRef2 = collection(firestore, 'courseCodes');
  await addDoc(collectionRef2, {courseCode: data.courseCode});
};
