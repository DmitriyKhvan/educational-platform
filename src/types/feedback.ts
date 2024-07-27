export interface Topic {
  id: string;
  title: string;
  description: string;
  value: string;
  label: string;
}

export interface Section {
  id: string;
  title: string;
  value: string;
  label: string;
}

export interface Student {
  firstName: string;
  lastName: string;
  avatar?: {
    url: string;
  };
}

export interface FeedbackLessonData {
  student: Student;
  startAt: string;
  duration: number;
  packageSubscription: {
    package: {
      course: string;
    };
  };
  languageLevel?: {
    title: string;
  };
}
