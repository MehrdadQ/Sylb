export type CourseData = {
  courseCode: string;
  semester: string | undefined;
  professor: string;
  autofail: boolean | undefined;
  courseAverage: 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A-' | 'A' | 'A+' | 'In progress' | undefined;
  courseDelivery: 'In-person' | 'Online Synchronous' | 'Online Aynchronous' | 'In-person with Recorded Lectures' | undefined;
  tutorials: 'Mandatory' | 'Optional but recommended' | 'Optional' | 'No Tutorials' | undefined;
  hasEssay: boolean | undefined;
  syllabusLink: string;
  groupProjects: boolean | undefined;
  courseWebsite: string;
  postTime: Date | null;
  otherNotes: string;
};