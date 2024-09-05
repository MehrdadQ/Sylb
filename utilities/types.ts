export type EntryInfo = {
  courseCode: string | undefined;
  professor: string | undefined;
  semester: string | undefined;
  autofail: 'Yes' | 'No' | 'No Final Exam' | undefined;
  courseAverage: 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A-' | 'A' | 'A+' | 'In progress' | undefined;
  courseDelivery: 'In-person' | 'Online Synchronous' | 'Online Synchronous (Recorded)'| 'Online Asynchronous' | 'In-person with Recorded Lectures' | undefined;
  tutorials: 'Mandatory' | 'Optional but recommended' | 'Optional' | 'No Tutorials' | undefined;
  hasEssay: 'Yes' | 'No' | undefined;
  syllabusLink: string | undefined;
  groupProjects: 'Yes' | 'No' | undefined;
  courseWebsite: string | undefined;
  postTime: Date | number | undefined;
  otherNotes: string | undefined;
  multipleChoice: 'All questions' | 'None' | 'Some questions' | undefined;
  campus: 'UTSG' | 'UTSC' | 'UTM' | undefined;
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
  postTime: Date | number | null;
  otherNotes: string;
  multipleChoice: string;
  campus: string;
};

export type EntryResultInfoCompact = {
  id: string;
  courseCode: string;
  semester: string;
  professor: string;
  postTime: Date | number | null;
  campus: string;
  courseAverage: string;
};

export type UserInfo = {
  uid: string,
  credits: number,
  hasAccessTo: string[],
};

export const semesterOptions = [
  'Winter 2025',
  'Fall 2024',
  'Summer 2024',
  'Winter 2024',
  'Fall 2023',
  'Summer 2023',
  'Winter 2023',
  'Fall 2022',
  'Summer 2022',
  'Winter 2022',
  'Fall 2021',
  'Summer 2021',
  'Winter 2021',
  'Fall 2020',
  'Summer 2020',
  'Winter 2020',
  'Fall 2019',
  'Summer 2019',
  'Winter 2019',
  'Fall 2018',
  'Summer 2018',
  'Winter 2018',
  'Fall 2017',
  'Summer 2017',
  'Winter 2017',
  'Fall 2016',
  'Summer 2016',
  'Winter 2016',
  'Fall 2015',
  'Summer 2015',
  'Winter 2015',
  'Fall 2014',
  'Older'
];

export const courseAverageOptions = [
  { label: "A+", value: "A+" },
  { label: "A", value: "A" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B", value: "B" },
  { label: "B-", value: "B-" },
  { label: "C+", value: "C+" },
  { label: "C", value: "C" },
  { label: "C-", value: "C-" },
  { label: "D+", value: "D+" },
  { label: "D", value: "D" },
  { label: "D-", value: "D-" },
];

export const courseDeliveryOptions = [
  { label: "In-person", value: "In-person" },
  { label: "In-person with Recorded Lectures", value: "In-person with Recorded Lectures" },
  { label: "Online Synchronous", value: "Online Synchronous" },
  { label: "Online Synchronous (Recorded)", value: "Online Synchronous (Recorded)" },
  { label: "Online Asynchronous", value: "Online Asynchronous" },
];

export const tutorialOptions = [
  { label: "Mandatory", value: "Mandatory" },
  { label: "Optional but recommended", value: "Optional but recommended" },
  { label: "Optional", value: "Optional" },
  { label: "No Tutorials", value: "No Tutorials" },
];

export const multipleChoiceOptions = [
  { label: "All questions", value: "All questions" },
  { label: "Some questions", value: "Some questions" },
  { label: "None", value: "None" },
];

export const semesterDropdownOptions = [
  { label: "Winter 2025", value: "Winter 2025" },
  { label: "Fall 2024", value: "Fall 2024" },
  { label: "Summer 2024", value: "Summer 2024" },
  { label: "Winter 2024", value: "Winter 2024" },
  { label: "Fall 2023", value: "Fall 2023" },
  { label: "Summer 2023", value: "Summer 2023" },
  { label: "Winter 2023", value: "Winter 2023" },
  { label: "Fall 2022", value: "Fall 2022" },
  { label: "Summer 2022", value: "Summer 2022" },
  { label: "Winter 2022", value: "Winter 2022" },
  { label: "Fall 2021", value: "Fall 2021" },
  { label: "Summer 2021", value: "Summer 2021" },
  { label: "Winter 2021", value: "Winter 2021" },
  { label: "Fall 2020", value: "Fall 2020" },
  { label: "Summer 2020", value: "Summer 2020" },
  { label: "Winter 2020", value: "Winter 2020" },
  { label: "Fall 2019", value: "Fall 2019" },
  { label: "Summer 2019", value: "Summer 2019" },
  { label: "Winter 2019", value: "Winter 2019" },
  { label: "Fall 2018", value: "Fall 2018" },
  { label: "Summer 2018", value: "Summer 2018" },
  { label: "Winter 2018", value: "Winter 2018" },
  { label: "Fall 2017", value: "Fall 2017" },
  { label: "Summer 2017", value: "Summer 2017" },
  { label: "Winter 2017", value: "Winter 2017" },
  { label: "Fall 2016", value: "Fall 2016" },
  { label: "Summer 2016", value: "Summer 2016" },
  { label: "Winter 2016", value: "Winter 2016" },
  { label: "Fall 2015", value: "Fall 2015" },
  { label: "Summer 2015", value: "Summer 2015" },
  { label: "Winter 2015", value: "Winter 2015" },
  { label: "Fall 2014", value: "Fall 2014" },
  { label: "Older", value: "Older" },
];

export const autofailOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No"},
  { label: "No Final Exam", value: "No Final Exam"},
];

export const booleanOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No"},
];

export const campusOptions = [
  { label: "UTSG", value: "UTSG" },
  { label: "UTSC", value: "UTSC"},
  { label: "UTM", value: "UTM"},
];

export const courseAverageSorting = {
  'A+': 11,
  'A': 10,
  'A-': 9,
  'B+': 8,
  'B': 7,
  'B-': 6,
  'C+': 5,
  'C': 4,
  'C-': 3,
  'D+': 2,
  'D': 1,
  'In progress': 0,
};

export const semesterSorting = {
  'Winter 2025': 33,
  'Fall 2024': 32,
  'Summer 2024': 31,
  'Winter 2024': 30,
  'Fall 2023': 29,
  'Summer 2023': 28,
  'Winter 2023': 27,
  'Fall 2022': 26,
  'Summer 2022': 25,
  'Winter 2022': 24,
  'Fall 2021': 23,
  'Summer 2021': 22,
  'Winter 2021': 21,
  'Fall 2020': 20,
  'Summer 2020': 19,
  'Winter 2020': 18,
  'Fall 2019': 17,
  'Summer 2019': 16,
  'Winter 2019': 15,
  'Fall 2018': 14,
  'Summer 2018': 13,
  'Winter 2018': 12,
  'Fall 2017': 11,
  'Summer 2017': 10,
  'Winter 2017': 9,
  'Fall 2016': 8,
  'Summer 2016': 7,
  'Winter 2016': 6,
  'Fall 2015': 5,
  'Summer 2015': 4,
  'Winter 2015': 3,
  'Fall 2014': 2,
  'Older': 1,
};
