export type EntryInfo = {
  courseCode: string | undefined;
  professor: string | undefined;
  semester: string | undefined;
  autofail: 'Yes' | 'No' | undefined;
  courseAverage: 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A-' | 'A' | 'A+' | 'In progress' | undefined;
  courseDelivery: 'In-person' | 'Online Synchronous' | 'Online Asynchronous' | 'In-person with Recorded Lectures' | undefined;
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
  postTime: Date | number | null;
  otherNotes: string;
  multipleChoice: string;
}

export type EntryResultInfoCompact = {
  id: string;
  courseCode: string;
  semester: string;
  professor: string;
  postTime: Date | number | null;
}

export type SearchResultItemProps = {
  courseCode: string,
  professor: string,
  semester: string,
  backgroundColor?: string
  entryID: string
};

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
  { label: "None", value: "None" },
  { label: "Some but not all", value: "Some but not all" },
];

export const semesterDropdownOptions = [
  { label: "Winter 2024", value: "Winter 2024" },
  { label: "Summer 2024", value: "Summer 2024" },
  { label: "Fall 2024", value: "Fall 2024" },
  { label: "Winter 2023", value: "Winter 2023" },
  { label: "Summer 2023", value: "Summer 2023" },
  { label: "Fall 2023", value: "Fall 2023" },
  { label: "Winter 2022", value: "Winter 2022" },
  { label: "Summer 2022", value: "Summer 2022" },
  { label: "Fall 2022", value: "Fall 2022" },
  { label: "Winter 2021", value: "Winter 2021" },
  { label: "Summer 2021", value: "Summer 2021" },
  { label: "Fall 2021", value: "Fall 2021" },
  { label: "Winter 2020", value: "Winter 2020" },
  { label: "Summer 2020", value: "Summer 2020" },
  { label: "Fall 2020", value: "Fall 2020" },
  { label: "Winter 2019", value: "Winter 2019" },
  { label: "Summer 2019", value: "Summer 2019" },
  { label: "Fall 2019", value: "Fall 2019" },
  { label: "Winter 2018", value: "Winter 2018" },
  { label: "Summer 2018", value: "Summer 2018" },
  { label: "Fall 2018", value: "Fall 2018" },
  { label: "Winter 2017", value: "Winter 2017" },
  { label: "Summer 2017", value: "Summer 2017" },
  { label: "Fall 2017", value: "Fall 2017" },
  { label: "Winter 2016", value: "Winter 2016" },
  { label: "Summer 2016", value: "Summer 2016" },
  { label: "Fall 2016", value: "Fall 2016" },
  { label: "Winter 2015", value: "Winter 2015" },
  { label: "Older", value: "Older" },
];

export const booleanOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No"},
];