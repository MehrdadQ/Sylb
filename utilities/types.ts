export type EntryInfo = {
  courseCode: string | undefined;
  professor: string | undefined;
  semester: string | undefined;
  autofail: 'Yes' | 'No' | undefined;
  courseAverage: 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A-' | 'A' | 'A+' | 'In progress' | undefined;
  courseDelivery: 'In-person' | 'Online Synchronous' | 'Online Aynchronous' | 'In-person with Recorded Lectures' | undefined;
  tutorials: 'Mandatory' | 'Optional but recommended' | 'Optional' | 'No Tutorials' | undefined;
  hasEssay: 'Yes' | 'No' | undefined;
  syllabusLink: string | undefined;
  groupProjects: 'Yes' | 'No' | undefined;
  courseWebsite: string | undefined;
  postTime: Date | number | undefined;
  otherNotes: string | undefined;
  multipleChoice: 'All questions' | 'None' | 'Some but not all' | undefined;
};

export type EntryResultInfo = {
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
  postTime: Date | null;
  otherNotes: string;
  multipleChoice: string;
}

export const semesterOptions = [
  'Winter 2024',
  'Summer 2024',
  'Fall 2024',
  'Winter 2023',
  'Summer 2023',
  'Fall 2023',
  'Winter 2022',
  'Summer 2022',
  'Fall 2022',
  'Winter 2021',
  'Summer 2021',
  'Fall 2021',
  'Winter 2020',
  'Summer 2020',
  'Fall 2020',
  'Winter 2019',
  'Summer 2019',
  'Fall 2019',
  'Winter 2018',
  'Summer 2018',
  'Fall 2018',
  'Winter 2017',
  'Summer 2017',
  'Fall 2017',
  'Winter 2016',
  'Summer 2016',
  'Fall 2016',
  'Winter 2015',
  'Older'
];