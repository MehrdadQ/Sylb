export type EntryInfo = {
  courseCode: string;
  professor: string;
  semester: string | undefined;
  autofail: 'Yes' | 'No' | undefined;
  courseAverage: 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A-' | 'A' | 'A+' | 'In progress' | undefined;
  courseDelivery: 'In-person' | 'Online Synchronous' | 'Online Aynchronous' | 'In-person with Recorded Lectures' | undefined;
  tutorials: 'Mandatory' | 'Optional but recommended' | 'Optional' | 'No Tutorials' | undefined;
  hasEssay: 'Yes' | 'No' | undefined;
  syllabusLink: string;
  groupProjects: 'Yes' | 'No' | undefined;
  courseWebsite: string;
  postTime: Date | number | undefined;
  otherNotes: string;
  multipleChoice: 'All questions' | 'None' | 'Some but not all' | undefined;
};

export type SearchResult = {
  id: string;
  courseCode: string;
  semester: string;
  professor: string;
  autofail: string;
  courseAverage: string;
  courseDelivery: string;
  tutorials: string;
  hasEssay: string;
  syllabusLink: string;
  groupProjects: string;
  courseWebsite: string;
  postTime: Date | undefined;
  otherNotes: string;
}