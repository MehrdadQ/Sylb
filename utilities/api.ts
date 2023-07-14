// import collection from 'firebase/compat/firestore';
// import addDoc from 'firebase/compat/firestore';
import { collection, addDoc } from 'firebase/firestore';


import { auth, firestore } from './firebase'; // Assuming you have a file named 'firestore.ts' where you initialize Firebase and export the 'auth' and 'firestore' objects
import { CourseData } from './types'; // Assuming you have a file named 'types.ts' where you define the 'CourseData' type

export const addCourseEntry = async (data: CourseData) => {
  try {
    const collectionRef = collection(firestore, 'entries');
    await addDoc(collectionRef, data);
    console.log('Course entry added successfully!');
  } catch (error) {
    console.error('Error adding course entry:', error);
  }
};
