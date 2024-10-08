export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */

export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AppConfig = {
  __typename?: 'AppConfig';
  configName?: Maybe<Scalars['String']['output']>;
  configValue?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type AppConfigInput = {
  configName: Scalars['String']['input'];
  configValue: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type AppliedPromotion = {
  __typename?: 'AppliedPromotion';
  promotionCode?: Maybe<AppliedPromotionCode>;
  selectedPackage?: Maybe<Package>;
};

export type AppliedPromotionCode = {
  __typename?: 'AppliedPromotionCode';
  code: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  courseId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountType?: Maybe<DiscountType>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  period?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  sessionTime?: Maybe<Scalars['Int']['output']>;
  sessionsPerWeek?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value: Scalars['Int']['output'];
};

export type AttachStudentInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type AttachTrialStudentInput = {
  languageLevelId: Scalars['Int']['input'];
  lessonBooking: TrialLessonsBookingInput;
  lessonTopicId: Scalars['Int']['input'];
  packageId: Scalars['Int']['input'];
  user: AttachStudentInput;
};

export type AuthStudent = {
  __typename?: 'AuthStudent';
  about?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<File>;
  avatarId?: Maybe<Scalars['ID']['output']>;
  birthday?: Maybe<Scalars['Date']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<GenderType>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  langLevel?: Maybe<Scalars['String']['output']>;
  languageLevel?: Maybe<LanguageLevel>;
  lastName?: Maybe<Scalars['String']['output']>;
  lessons?: Maybe<Lesson>;
  level?: Maybe<Scalars['Int']['output']>;
  newToken?: Maybe<Scalars['String']['output']>;
  parentName?: Maybe<Scalars['String']['output']>;
  pronouns?: Maybe<Scalars['String']['output']>;
  trialStartAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
};

export type AuthenticatedUser = {
  __typename?: 'AuthenticatedUser';
  acceptingStudents?: Maybe<Scalars['Boolean']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<File>;
  avatarId?: Maybe<Scalars['ID']['output']>;
  cardLast4?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender?: Maybe<GenderType>;
  googleAuth?: Maybe<GoogleAuthObject>;
  googleCalendarSync?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  koreanEquivalent?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  mentor?: Maybe<Mentor>;
  newToken?: Maybe<Scalars['String']['output']>;
  paymentCurrency?: Maybe<Currency>;
  personalPromotionCodes?: Maybe<Array<Maybe<PromotionCode>>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRoleType>;
  students?: Maybe<Array<Maybe<AuthStudent>>>;
  timeZone: Scalars['String']['output'];
};

export type AvailabilitySlot = {
  __typename?: 'AvailabilitySlot';
  date: Scalars['String']['output'];
  from: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type AvailableMentorsFilterSlot = {
  __typename?: 'AvailableMentorsFilterSlot';
  day?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
};

export type AvailableMentorsResult = {
  __typename?: 'AvailableMentorsResult';
  filterSlot?: Maybe<AvailableMentorsFilterSlot>;
  mentors?: Maybe<Array<Maybe<Mentor>>>;
};

export type CombinedTimesheet = {
  __typename?: 'CombinedTimesheet';
  day?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mentor?: Maybe<Mentor>;
  mentors?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  reserved?: Maybe<Scalars['Boolean']['output']>;
  to?: Maybe<Scalars['String']['output']>;
};

export type Conversation = {
  __typename?: 'Conversation';
  conversationType?: Maybe<ConversationType>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  messages: Array<Maybe<Message>>;
  participants: Array<Maybe<User>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ConversationInput = {
  conversationType: ConversationType;
  participants: Array<Scalars['ID']['input']>;
};

export enum ConversationType {
  Private = 'private',
  Public = 'public'
}

export type Course = {
  __typename?: 'Course';
  active?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  languageLevels?: Maybe<Array<Maybe<LanguageLevel>>>;
  packages?: Maybe<Array<Maybe<Package>>>;
  sequence?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  translations?: Maybe<Array<Maybe<CourseTranslation>>>;
};

export type CourseInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description: Scalars['String']['input'];
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  languageLevelIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  sequence?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  translations: Array<CourseTranslationInput>;
};

export type CourseTranslation = {
  __typename?: 'CourseTranslation';
  course?: Maybe<Course>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<CourseTranslationsLanguage>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CourseTranslationInput = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  language?: CourseTranslationsLanguage;
  title: Scalars['String']['input'];
};

export enum CourseTranslationsLanguage {
  Cn = 'cn',
  En = 'en',
  Kr = 'kr'
}

export enum Currency {
  Krw = 'krw',
  Twd = 'twd',
  Usd = 'usd'
}

export type DeleteResult = {
  __typename?: 'DeleteResult';
  id?: Maybe<Scalars['Int']['output']>;
};

export enum DiscountType {
  Fixed = 'fixed',
  Percent = 'percent'
}

export type ExceptionDate = {
  __typename?: 'ExceptionDate';
  date?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mentor?: Maybe<Mentor>;
  to?: Maybe<Scalars['String']['output']>;
};

export type ExceptionDateSlot = {
  date: Scalars['String']['input'];
  from: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  to: Scalars['String']['input'];
};

export type File = {
  __typename?: 'File';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mimetype?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type FlatJoinedPaymentOjbect = {
  __typename?: 'FlatJoinedPaymentOjbect';
  adminNote?: Maybe<Scalars['String']['output']>;
  buyPrice?: Maybe<Scalars['Int']['output']>;
  cancelReason?: Maybe<Scalars['String']['output']>;
  completeLessonCount?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  originalPrice?: Maybe<Scalars['Int']['output']>;
  otherLessonCount?: Maybe<Scalars['Int']['output']>;
  packageCourseTitle?: Maybe<Scalars['String']['output']>;
  packageDiscountValue?: Maybe<Scalars['String']['output']>;
  packagePackageSubscriptionCredits?: Maybe<Scalars['Int']['output']>;
  packagePackageSubscriptionId?: Maybe<Scalars['Int']['output']>;
  packagePackageSubscriptionModifyCredits?: Maybe<Scalars['String']['output']>;
  packagePeriod?: Maybe<Scalars['Int']['output']>;
  packagePrice?: Maybe<Scalars['Int']['output']>;
  packageSessionTime?: Maybe<Scalars['Int']['output']>;
  packageSessionsPerWeek?: Maybe<Scalars['Int']['output']>;
  packageTotalSessions?: Maybe<Scalars['Int']['output']>;
  promotionCodeDiscountValue?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<PaymentProviderType>;
  scheduleLessonCount?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<PaymentStatusType>;
  studentFirstName?: Maybe<Scalars['String']['output']>;
  studentLastName?: Maybe<Scalars['String']['output']>;
  totalRemaining?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userPhoneNumber?: Maybe<Scalars['String']['output']>;
};

export enum GenderType {
  Female = 'female',
  Male = 'male',
  Nonbinary = 'nonbinary'
}

export enum GeneralTrialFilterType {
  All = 'all',
  OnlyRegular = 'only_regular',
  OnlyTrial = 'only_trial'
}

export type GoogleAuthObject = {
  __typename?: 'GoogleAuthObject';
  refreshTokenDaysRemaining?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type GoogleCalendarResponse = {
  __typename?: 'GoogleCalendarResponse';
  calendarId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  userGoogleCalendars?: Maybe<Scalars['JSON']['output']>;
};

export type GroupedAvailabilitySlots = {
  __typename?: 'GroupedAvailabilitySlots';
  date: Scalars['String']['output'];
  timeSlots: Array<AvailabilitySlot>;
};

export type Homework = {
  __typename?: 'Homework';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<Maybe<Topic>>>;
};

export type InvitedStudent = {
  __typename?: 'InvitedStudent';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  giftForFriend?: Maybe<PromotionCode>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  purchaseAmount?: Maybe<Scalars['Int']['output']>;
  trialDate?: Maybe<Scalars['Date']['output']>;
};

export type LanguageLevel = {
  __typename?: 'LanguageLevel';
  courses?: Maybe<Array<Maybe<Course>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<Maybe<Topic>>>;
  translations?: Maybe<Array<Maybe<LanguageLevelTranslation>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LanguageLevelInput = {
  coursesIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  topicsIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  translations: Array<LanguageLevelTranslationInput>;
};

export type LanguageLevelTranslation = {
  __typename?: 'LanguageLevelTranslation';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<CourseTranslationsLanguage>;
  languageLevel?: Maybe<LanguageLevel>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LanguageLevelTranslationInput = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  language?: CourseTranslationsLanguage;
  title: Scalars['String']['input'];
};

export type LanguageLevelWithPagination = {
  __typename?: 'LanguageLevelWithPagination';
  count: Scalars['Int']['output'];
  languageLevels: Array<Maybe<LanguageLevel>>;
};

export enum LanguageSkillType {
  Basic = 'basic',
  Excellent = 'excellent',
  Fair = 'fair',
  Good = 'good',
  Great = 'great',
  Insufficient = 'insufficient'
}

export type Lesson = {
  __typename?: 'Lesson';
  cancelAction?: Maybe<LessonCancelActionType>;
  cancelReason?: Maybe<Scalars['String']['output']>;
  canceledAt?: Maybe<Scalars['DateTime']['output']>;
  canceledBy?: Maybe<UserRoleType>;
  duration?: Maybe<Scalars['Int']['output']>;
  goal?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  langLevel?: Maybe<Scalars['String']['output']>;
  languageLevel?: Maybe<LanguageLevel>;
  mentor?: Maybe<Mentor>;
  mentorReview?: Maybe<MentorReview>;
  noShow?: Maybe<LessonNoShowRoleType>;
  packageSubscription?: Maybe<PackageSubscription>;
  playground?: Maybe<Playground>;
  preTrialNote?: Maybe<Scalars['String']['output']>;
  startAt?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<LessonStatusType>;
  student?: Maybe<Student>;
  studentReview?: Maybe<StudentReview>;
  topic?: Maybe<Topic>;
};

export enum LessonCancelActionType {
  AssignNewMentor = 'assign_new_mentor',
  Refund = 'refund'
}

export enum LessonNoShowRoleType {
  Mentor = 'mentor',
  Student = 'student'
}

export type LessonSection = {
  __typename?: 'LessonSection';
  completed?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<Maybe<Topic>>>;
};

export enum LessonStatusType {
  Approved = 'approved',
  Canceled = 'canceled',
  Completed = 'completed',
  InProgress = 'in_progress',
  Paid = 'paid',
  Rescheduled = 'rescheduled',
  Scheduled = 'scheduled'
}

export type LessonsWithPagination = {
  __typename?: 'LessonsWithPagination';
  count: Scalars['Int']['output'];
  lessons: Array<Maybe<Lesson>>;
};

export type Mentor = {
  __typename?: 'Mentor';
  about?: Maybe<Scalars['String']['output']>;
  acceptingStudents?: Maybe<Scalars['Boolean']['output']>;
  availabilities: Array<Maybe<Timesheet>>;
  avatar?: Maybe<File>;
  avatarId?: Maybe<Scalars['ID']['output']>;
  contract?: Maybe<Array<Maybe<MentorContract>>>;
  degree?: Maybe<Scalars['String']['output']>;
  exceptionDates: Array<Maybe<ExceptionDate>>;
  experience?: Maybe<Scalars['String']['output']>;
  facts?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<GenderType>;
  graduatingYear?: Maybe<Scalars['Int']['output']>;
  hourlyRate?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  introduction?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  lessons?: Maybe<Lesson>;
  major?: Maybe<Scalars['String']['output']>;
  mentorAvailability?: Maybe<MentorAvailabilityType>;
  penalties?: Maybe<Array<Maybe<MentorPenalty>>>;
  playgroundId?: Maybe<Scalars['String']['output']>;
  relevantExperience?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  uniqueFacts?: Maybe<Scalars['String']['output']>;
  university?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
  visibilityStatus?: Maybe<VisibilityStatus>;
};

export type MentorAvailability = {
  __typename?: 'MentorAvailability';
  regular: Array<Maybe<Timesheet>>;
  trial: Array<Maybe<Timesheet>>;
};

export enum MentorAvailabilityType {
  OnlyRegular = 'only_regular',
  OnlyTrial = 'only_trial',
  RegularAndTrial = 'regular_and_trial'
}

export type MentorContract = {
  __typename?: 'MentorContract';
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  mentor?: Maybe<Mentor>;
  penalties?: Maybe<Array<Maybe<MentorPenalty>>>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  strikeDates?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  strikes?: Maybe<Scalars['Int']['output']>;
};

export type MentorContractWithPagination = {
  __typename?: 'MentorContractWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  mentorContracts: Array<Maybe<MentorContract>>;
};

export type MentorPenalty = {
  __typename?: 'MentorPenalty';
  amount?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  noShow?: Maybe<Scalars['Boolean']['output']>;
  penaltyType?: Maybe<PenaltyType>;
  reason?: Maybe<Scalars['String']['output']>;
  studentUser?: Maybe<User>;
  type?: Maybe<Scalars['String']['output']>;
};

export type MentorReview = {
  __typename?: 'MentorReview';
  confidence?: Maybe<LanguageSkillType>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expressions?: Maybe<LanguageSkillType>;
  fluency?: Maybe<LanguageSkillType>;
  homeworks?: Maybe<Array<Maybe<Homework>>>;
  id: Scalars['ID']['output'];
  improvement?: Maybe<Scalars['String']['output']>;
  lesson?: Maybe<Lesson>;
  listening?: Maybe<LanguageSkillType>;
  mastered?: Maybe<Scalars['String']['output']>;
  mentor?: Maybe<Mentor>;
  pronunciation?: Maybe<LanguageSkillType>;
  rating?: Maybe<Scalars['Int']['output']>;
  reading?: Maybe<LanguageSkillType>;
  student?: Maybe<Student>;
  vocabularies?: Maybe<Array<Maybe<Vocabulary>>>;
  vocabulary?: Maybe<LanguageSkillType>;
};

export type MentorReviewInput = {
  confidence: LanguageSkillType;
  expressions: LanguageSkillType;
  fluency: LanguageSkillType;
  homeworkIds: Array<Scalars['ID']['input']>;
  improvement: Scalars['String']['input'];
  lessonId: Scalars['ID']['input'];
  lessonSectionId?: InputMaybe<Scalars['ID']['input']>;
  listening: LanguageSkillType;
  mastered: Scalars['String']['input'];
  mentorId: Scalars['ID']['input'];
  pronunciation: LanguageSkillType;
  rating: Scalars['Int']['input'];
  reading: LanguageSkillType;
  topicId: Scalars['ID']['input'];
  vocabulary: LanguageSkillType;
  vocabularyIds: Array<Scalars['ID']['input']>;
};

export type MentorReviewsWithPagination = {
  __typename?: 'MentorReviewsWithPagination';
  count: Scalars['Int']['output'];
  mentorReviews: Array<Maybe<MentorReview>>;
};

export enum MentorTrialFilterType {
  All = 'all',
  OnlyRegular = 'only_regular',
  OnlyTrial = 'only_trial',
  RegularAndTrial = 'regular_and_trial'
}

export type MentorUpdateInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  degree?: InputMaybe<Scalars['String']['input']>;
  experience?: InputMaybe<Scalars['String']['input']>;
  facts?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<GenderType>;
  graduatingYear?: InputMaybe<Scalars['Int']['input']>;
  hourlyRate?: InputMaybe<Scalars['Int']['input']>;
  introduction?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  major?: InputMaybe<Scalars['String']['input']>;
  mentorAvailability?: InputMaybe<MentorAvailabilityType>;
  pronouns?: InputMaybe<Scalars['String']['input']>;
  relevantExperience?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  uniqueFacts?: InputMaybe<Scalars['String']['input']>;
  university?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
  visibilityStatus?: InputMaybe<VisibilityStatus>;
};

export type Message = {
  __typename?: 'Message';
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  meta?: Maybe<Scalars['JSON']['output']>;
  recipients?: Maybe<Array<Maybe<MessageRecipient>>>;
  sender?: Maybe<User>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MessageInput = {
  body: Scalars['String']['input'];
  conversationId?: InputMaybe<Scalars['ID']['input']>;
  meta?: InputMaybe<Scalars['JSON']['input']>;
};

export type MessageRecipient = {
  __typename?: 'MessageRecipient';
  id: Scalars['ID']['output'];
  message: Message;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  recipient: User;
};

export type MessageSubscribeInput = {
  conversationId?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptNewStudents: Scalars['Boolean']['output'];
  applyPromotionCodeForPackage: AppliedPromotion;
  approveLesson: Lesson;
  attachPlaygroundToMentorResolver: Mentor;
  attachStudentToUser: Student;
  attachTrialStudentToUserResolver: Student;
  cancelLessons: Array<Maybe<Lesson>>;
  changeStudentLanguageLevel: Student;
  createConversation?: Maybe<Conversation>;
  createCourse: Course;
  createHomework: Homework;
  createLessonSection: LessonSection;
  createLessons: Array<Maybe<Lesson>>;
  createMentor: Mentor;
  createMentorReview: MentorReview;
  createPackage: Package;
  createPayment: Payment;
  createPaymentIntent: StripeResult;
  createPayout: Payout;
  createPlaygroundLink: Lesson;
  createPromotionCode: PromotionCode;
  createStudent: Student;
  createStudentReview: StudentReview;
  createStudentReviewTag: StudentReviewTag;
  createUser: User;
  createVocabularyWord: Vocabulary;
  deactivateCourse: Course;
  deactivateStudent: Student;
  deleteConversation?: Maybe<Conversation>;
  deleteHomework: Homework;
  deleteLessonSection: LessonSection;
  deletePackage: DeleteResult;
  deletePayment: DeleteResult;
  deleteRecording: Playground;
  deleteStudentReviewTag: StudentReviewTag;
  deleteVocabularyWord: Vocabulary;
  generateAdminLoginToken?: Maybe<Scalars['String']['output']>;
  generateReferralLink: ReferralCode;
  loginByAdminToken?: Maybe<SignInResult>;
  markLessonAttendance: Lesson;
  markMessageAsRead?: Maybe<Array<Maybe<Message>>>;
  mentorCancelLessons: Array<Maybe<Lesson>>;
  persistLanguageLevel: LanguageLevel;
  persistTopic: Topic;
  redeemUserPasswordResetToken: Scalars['Boolean']['output'];
  removeParticipantFromConversationResolver?: Maybe<Conversation>;
  rescheduleLessons: Array<Maybe<Lesson>>;
  savedefaultgooglecalendar?: Maybe<GoogleCalendarResponse>;
  sendMessage?: Maybe<Message>;
  sendSystemMessage?: Maybe<Message>;
  sendUserPasswordResetLink: Scalars['Boolean']['output'];
  setLessonDetails: Lesson;
  signIn: SignInResult;
  signUp: User;
  sortMentors?: Maybe<Array<Maybe<Mentor>>>;
  trialSignUp: User;
  updateCourse: Course;
  updateHomework: Homework;
  updateLessonSection: LessonSection;
  updateMentor: Mentor;
  updatePackage: Package;
  updatePackageSubscription: PackageSubscription;
  updatePayment: Payment;
  updatePromotionCode: PromotionCode;
  updateStudent: Student;
  updateStudentReviewTag: StudentReviewTag;
  updateUser: User;
  updateVocabularyWord: Vocabulary;
  upsertExceptionDates: Array<Maybe<ExceptionDate>>;
  upsertTimesheets: Array<Maybe<Timesheet>>;
  upsertTrialLessonSlotLimit: Array<Maybe<TrialLessonSlotLimit>>;
};


export type MutationAcceptNewStudentsArgs = {
  accept: Scalars['Boolean']['input'];
  mentorId: Scalars['ID']['input'];
};


export type MutationApplyPromotionCodeForPackageArgs = {
  code: Scalars['String']['input'];
  currency?: InputMaybe<Currency>;
  packageId: Scalars['ID']['input'];
};


export type MutationApproveLessonArgs = {
  id: Scalars['ID']['input'];
  mentorId: Scalars['ID']['input'];
};


export type MutationAttachPlaygroundToMentorResolverArgs = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  mentorId: Scalars['ID']['input'];
};


export type MutationAttachStudentToUserArgs = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAttachTrialStudentToUserResolverArgs = {
  data: AttachTrialStudentInput;
};


export type MutationCancelLessonsArgs = {
  cancelReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  repeat?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationChangeStudentLanguageLevelArgs = {
  languageLevelId: Scalars['Int']['input'];
  studentId: Scalars['ID']['input'];
};


export type MutationCreateConversationArgs = {
  data: ConversationInput;
};


export type MutationCreateCourseArgs = {
  data: CourseInput;
};


export type MutationCreateHomeworkArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  topicIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateLessonSectionArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  topicIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateLessonsArgs = {
  duration: Scalars['Int']['input'];
  mentorId: Scalars['ID']['input'];
  packageSubscriptionId: Scalars['ID']['input'];
  repeat?: InputMaybe<Scalars['Int']['input']>;
  startAt: Scalars['DateTime']['input'];
  studentId: Scalars['ID']['input'];
};


export type MutationCreateMentorArgs = {
  data: MentorUpdateInput;
  user: SignUpInput;
};


export type MutationCreateMentorReviewArgs = {
  data: MentorReviewInput;
};


export type MutationCreatePackageArgs = {
  data: PackageCreationInput;
};


export type MutationCreatePaymentArgs = {
  metadata?: InputMaybe<Scalars['String']['input']>;
  packageId: Scalars['ID']['input'];
  provider?: InputMaybe<PaymentProviderType>;
  studentId: Scalars['ID']['input'];
};


export type MutationCreatePaymentIntentArgs = {
  applyPersonalDiscountCode?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Currency>;
  packageId: Scalars['Int']['input'];
};


export type MutationCreatePayoutArgs = {
  data: PayoutsInput;
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationCreatePlaygroundLinkArgs = {
  lessonId: Scalars['ID']['input'];
  mentorId: Scalars['ID']['input'];
};


export type MutationCreatePromotionCodeArgs = {
  data: PromotionCodeInput;
};


export type MutationCreateStudentArgs = {
  about?: InputMaybe<Scalars['String']['input']>;
  langLevel?: InputMaybe<Scalars['String']['input']>;
  languageLevelId?: InputMaybe<Scalars['ID']['input']>;
  parentName?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['Int']['input'];
};


export type MutationCreateStudentReviewArgs = {
  lessonId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
  studentId: Scalars['ID']['input'];
  tags?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationCreateStudentReviewTagArgs = {
  title: Scalars['String']['input'];
  translations?: InputMaybe<Array<StudentReviewTagTranslationInput>>;
  type: StudentReviewTagType;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateVocabularyWordArgs = {
  topicIds: Array<Scalars['ID']['input']>;
  word: Scalars['String']['input'];
};


export type MutationDeactivateCourseArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeactivateStudentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHomeworkArgs = {
  homeworkId: Scalars['ID']['input'];
};


export type MutationDeleteLessonSectionArgs = {
  lessonSectionId: Scalars['ID']['input'];
};


export type MutationDeletePackageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePaymentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRecordingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStudentReviewTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVocabularyWordArgs = {
  vocabularyId: Scalars['ID']['input'];
};


export type MutationGenerateAdminLoginTokenArgs = {
  email: Scalars['String']['input'];
};


export type MutationGenerateReferralLinkArgs = {
  studentId: Scalars['ID']['input'];
};


export type MutationLoginByAdminTokenArgs = {
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationMarkLessonAttendanceArgs = {
  lessonId: Scalars['ID']['input'];
};


export type MutationMarkMessageAsReadArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationMentorCancelLessonsArgs = {
  cancelReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  repeat?: InputMaybe<Scalars['Boolean']['input']>;
  studentMessage?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPersistLanguageLevelArgs = {
  data: LanguageLevelInput;
};


export type MutationPersistTopicArgs = {
  data: TopicInput;
};


export type MutationRedeemUserPasswordResetTokenArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationRemoveParticipantFromConversationResolverArgs = {
  conversationId: Scalars['Int']['input'];
  participantIds: Array<Scalars['Int']['input']>;
};


export type MutationRescheduleLessonsArgs = {
  id: Scalars['ID']['input'];
  mentorId: Scalars['ID']['input'];
  repeat?: InputMaybe<Scalars['Boolean']['input']>;
  startAt: Scalars['DateTime']['input'];
};


export type MutationSavedefaultgooglecalendarArgs = {
  calendarId: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationSendMessageArgs = {
  data: MessageInput;
};


export type MutationSendSystemMessageArgs = {
  data: MessageInput;
};


export type MutationSendUserPasswordResetLinkArgs = {
  email: Scalars['String']['input'];
  locale: Scalars['String']['input'];
};


export type MutationSetLessonDetailsArgs = {
  goal?: InputMaybe<Scalars['String']['input']>;
  lessonId: Scalars['ID']['input'];
  preTrialNote?: InputMaybe<Scalars['String']['input']>;
  recordingUrl?: InputMaybe<Scalars['String']['input']>;
  studentId: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  data: SignUpInput;
};


export type MutationSortMentorsArgs = {
  mentorIds: Array<Scalars['Int']['input']>;
  startOrderIndex?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationTrialSignUpArgs = {
  data: TrialSignUpInput;
};


export type MutationUpdateCourseArgs = {
  data?: InputMaybe<CourseInput>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateHomeworkArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  homeworkId: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  topicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationUpdateLessonSectionArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  lessonSectionId: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  topicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationUpdateMentorArgs = {
  data: MentorUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePackageArgs = {
  data: PackageUpdateInput;
};


export type MutationUpdatePackageSubscriptionArgs = {
  data: PackageSubscriptionInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePaymentArgs = {
  adminNote?: InputMaybe<Scalars['String']['input']>;
  cancelReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  status?: InputMaybe<PaymentStatusType>;
};


export type MutationUpdatePromotionCodeArgs = {
  data: PromotionCodeInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateStudentArgs = {
  data: StudentUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateStudentReviewTagArgs = {
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  translations?: InputMaybe<Array<StudentReviewTagTranslationInput>>;
  type: StudentReviewTagType;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateVocabularyWordArgs = {
  topicIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  vocabularyId: Scalars['ID']['input'];
  word?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpsertExceptionDatesArgs = {
  exceptionDates: Array<ExceptionDateSlot>;
  mentorId: Scalars['ID']['input'];
};


export type MutationUpsertTimesheetsArgs = {
  mentorId: Scalars['ID']['input'];
  timesheets: Array<TimesheetSlot>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpsertTrialLessonSlotLimitArgs = {
  data?: InputMaybe<Array<TrialLessonSlotLimitInput>>;
};

export type Package = {
  __typename?: 'Package';
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['ID']['output']>;
  discount?: Maybe<Scalars['Int']['output']>;
  discountPrice?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isReferral?: Maybe<Scalars['Boolean']['output']>;
  packageSubscription?: Maybe<Array<Maybe<PackageSubscription>>>;
  period?: Maybe<Scalars['Int']['output']>;
  prices?: Maybe<Array<Maybe<PackageCurrencyPrice>>>;
  promotionCode?: Maybe<PromotionCode>;
  referralDiscount?: Maybe<Scalars['Int']['output']>;
  sessionTime?: Maybe<Scalars['Int']['output']>;
  sessionsPerWeek?: Maybe<Scalars['Int']['output']>;
  student?: Maybe<Student>;
  totalSessions?: Maybe<Scalars['Int']['output']>;
};

export type PackageCreationInput = {
  courseId: Scalars['Int']['input'];
  discount?: InputMaybe<Scalars['Int']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  prices: Array<PackageCurrencyPriceCreationInput>;
  sessionTime: Scalars['Int']['input'];
  sessionsPerWeek: Scalars['Int']['input'];
  totalSessions: Scalars['Int']['input'];
};

export type PackageCurrencyPrice = {
  __typename?: 'PackageCurrencyPrice';
  currency: Currency;
  id?: Maybe<Scalars['Int']['output']>;
  packageId: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
};

export type PackageCurrencyPriceCreationInput = {
  currency: Currency;
  price: Scalars['Int']['input'];
};

export type PackageCurrencyPriceUpdateInput = {
  currency: Currency;
  id: Scalars['Int']['input'];
  price: Scalars['Int']['input'];
};

export type PackageSubscription = {
  __typename?: 'PackageSubscription';
  active?: Maybe<Scalars['Boolean']['output']>;
  credits?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  modifyCredits?: Maybe<Scalars['Int']['output']>;
  package?: Maybe<Package>;
  packageId: Scalars['ID']['output'];
  payment?: Maybe<Payment>;
  paymentId?: Maybe<Scalars['ID']['output']>;
  periodEnd?: Maybe<Scalars['DateTime']['output']>;
  periodStart?: Maybe<Scalars['DateTime']['output']>;
  promotionCodeStudentUsage?: Maybe<Array<Maybe<PromotionCodeUsageInverseSide>>>;
  student?: Maybe<Student>;
};

export type PackageSubscriptionInput = {
  credits?: InputMaybe<Scalars['Int']['input']>;
  modifyCredits?: InputMaybe<Scalars['Int']['input']>;
  packageId?: InputMaybe<Scalars['ID']['input']>;
  periodEnd?: InputMaybe<Scalars['String']['input']>;
  periodStart?: InputMaybe<Scalars['String']['input']>;
};

export type PackageSubscriptionPromotionCode = {
  __typename?: 'PackageSubscriptionPromotionCode';
  active?: Maybe<Scalars['Boolean']['output']>;
  credits?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lessons?: Maybe<Array<Maybe<Lesson>>>;
  modifyCredits?: Maybe<Scalars['Int']['output']>;
  package?: Maybe<Package>;
  packageId: Scalars['ID']['output'];
  payment?: Maybe<Payment>;
  paymentId: Scalars['ID']['output'];
  periodEnd?: Maybe<Scalars['DateTime']['output']>;
  periodStart?: Maybe<Scalars['DateTime']['output']>;
  promotionCodeStudentUsage?: Maybe<Array<Maybe<PromotionCodeUsageInverseSide>>>;
  student?: Maybe<Student>;
};

export type PackageUpdateInput = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
  discount?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  period?: InputMaybe<Scalars['Int']['input']>;
  prices?: InputMaybe<Array<PackageCurrencyPriceUpdateInput>>;
  sessionTime?: InputMaybe<Scalars['Int']['input']>;
  sessionsPerWeek?: InputMaybe<Scalars['Int']['input']>;
  totalSessions?: InputMaybe<Scalars['Int']['input']>;
};

export type Payment = {
  __typename?: 'Payment';
  adminNote?: Maybe<Scalars['String']['output']>;
  buyPrice?: Maybe<Scalars['Int']['output']>;
  cancelReason?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  originalPrice?: Maybe<Scalars['Int']['output']>;
  package?: Maybe<Package>;
  packageDiscount?: Maybe<Scalars['Int']['output']>;
  packageDiscountValue?: Maybe<Scalars['Int']['output']>;
  packageSubscription?: Maybe<PackageSubscription>;
  promotionCodeDiscountValue?: Maybe<Scalars['Int']['output']>;
  provider?: Maybe<PaymentProviderType>;
  status?: Maybe<PaymentStatusType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
};

export enum PaymentProviderType {
  Migrated = 'migrated',
  Stripe = 'stripe'
}

export type PaymentResult = {
  __typename?: 'PaymentResult';
  payment?: Maybe<Payment>;
};

export enum PaymentStatusType {
  Canceled = 'canceled',
  Failed = 'failed',
  Paid = 'paid',
  Pending = 'pending',
  Refunded = 'refunded',
  Scheduled = 'scheduled'
}

export type PaymentsWithPagination = {
  __typename?: 'PaymentsWithPagination';
  count: Scalars['Int']['output'];
  payments: Array<Maybe<FlatJoinedPaymentOjbect>>;
};

export type Payout = {
  __typename?: 'Payout';
  amount?: Maybe<Scalars['Float']['output']>;
  billingFrom?: Maybe<Scalars['DateTime']['output']>;
  billingTo?: Maybe<Scalars['DateTime']['output']>;
  canceledLessonsCount?: Maybe<Scalars['Int']['output']>;
  completedLessonsCount?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  lessonIds?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  lessonsCancellationFines?: Maybe<Scalars['Float']['output']>;
  lessonsCount?: Maybe<Scalars['Int']['output']>;
  lessonsReviewFines?: Maybe<Scalars['Float']['output']>;
  mentor?: Maybe<Mentor>;
  mentorNoShowFines?: Maybe<Scalars['Float']['output']>;
  minutesTaught?: Maybe<Scalars['Float']['output']>;
  totalFines?: Maybe<Scalars['Float']['output']>;
};

export type PayoutsInput = {
  amount: Scalars['Float']['input'];
  billingFrom: Scalars['DateTime']['input'];
  billingTo: Scalars['DateTime']['input'];
  canceledLessonsCount: Scalars['Int']['input'];
  completedLessonsCount: Scalars['Int']['input'];
  lessonIds: Array<Scalars['Int']['input']>;
  lessonsCount: Scalars['Int']['input'];
  mentorId: Scalars['ID']['input'];
  minutesTaught: Scalars['Float']['input'];
};

export enum PenaltyType {
  CancelledLessonsExceedsLimit = 'cancelled_lessons_exceeds_limit',
  LessonCancellationOutside_24 = 'lesson_cancellation_outside_24',
  LessonCancellationWithin_24 = 'lesson_cancellation_within_24',
  LessonReview_24 = 'lesson_review_24',
  LessonReviewMissing = 'lesson_review_missing',
  MentorNoShow = 'mentor_no_show'
}

export type Playground = {
  __typename?: 'Playground';
  id: Scalars['ID']['output'];
  joinUrl?: Maybe<Scalars['String']['output']>;
  meetingId?: Maybe<Scalars['String']['output']>;
  recordingReady?: Maybe<Scalars['Boolean']['output']>;
  recordingUrl?: Maybe<Scalars['String']['output']>;
  startUrl?: Maybe<Scalars['String']['output']>;
};

export type PromotionCode = {
  __typename?: 'PromotionCode';
  code: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  courseId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountType?: Maybe<DiscountType>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  period?: Maybe<Scalars['Int']['output']>;
  promotionCodeStudentUsage?: Maybe<Array<Maybe<PromotionCodeUsage>>>;
  sessionTime?: Maybe<Scalars['Int']['output']>;
  sessionsPerWeek?: Maybe<Scalars['Int']['output']>;
  totalPromotionCodeDiscount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value: Scalars['Int']['output'];
};

export type PromotionCodeInput = {
  code: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  discountType?: InputMaybe<DiscountType>;
  isActive: Scalars['Boolean']['input'];
  period?: InputMaybe<Scalars['Int']['input']>;
  sessionTime?: InputMaybe<Scalars['Int']['input']>;
  sessionsPerWeek?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['Int']['input'];
};

export type PromotionCodePackage = {
  __typename?: 'PromotionCodePackage';
  packageId: Scalars['Int']['output'];
  promotionCodeId: Scalars['Int']['output'];
};

export type PromotionCodeUsage = {
  __typename?: 'PromotionCodeUsage';
  packageSubscription?: Maybe<PackageSubscriptionPromotionCode>;
};

export type PromotionCodeUsageInverseSide = {
  __typename?: 'PromotionCodeUsageInverseSide';
  promotionCode?: Maybe<PromotionCode>;
  usedAt?: Maybe<Scalars['Date']['output']>;
};

export type Query = {
  __typename?: 'Query';
  activePackageSubscriptions: Array<Maybe<PackageSubscription>>;
  appConfig?: Maybe<AppConfig>;
  appConfigs?: Maybe<Array<AppConfig>>;
  authenticatedUser?: Maybe<AuthenticatedUser>;
  availabilitySlots: Array<Maybe<GroupedAvailabilitySlots>>;
  availableMentors: AvailableMentorsResult;
  availableMentorsFroTrial: AvailableMentorsResult;
  checkStripePaymentStatus: Scalars['Boolean']['output'];
  combinedTimesheets: Array<Maybe<CombinedTimesheet>>;
  combinedTimesheetsForTrials: Array<Maybe<CombinedTimesheet>>;
  conversation: Conversation;
  conversations: Array<Maybe<Conversation>>;
  course: Course;
  courses: Array<Maybe<Course>>;
  createAppConfig?: Maybe<AppConfig>;
  creditsCount: Scalars['Int']['output'];
  currencies?: Maybe<Array<Maybe<Currency>>>;
  getReferralCode: ReferralCode;
  getUserNotifications: Array<Maybe<Message>>;
  googlecalendarresponse?: Maybe<GoogleCalendarResponse>;
  homework: Array<Maybe<Homework>>;
  languageLevel: LanguageLevel;
  languageLevelsWithPagination: LanguageLevelWithPagination;
  lesson?: Maybe<Lesson>;
  lessonSections: Array<Maybe<LessonSection>>;
  lessons: Array<Maybe<Lesson>>;
  lessonsWithPagination: LessonsWithPagination;
  mentor?: Maybe<Mentor>;
  mentorContract?: Maybe<MentorContract>;
  mentorContractById?: Maybe<MentorContract>;
  mentorContractsWithPagination?: Maybe<MentorContractWithPagination>;
  mentorReviewsWithPagination: MentorReviewsWithPagination;
  mentors: Array<Maybe<Mentor>>;
  mentorsWithPagination?: Maybe<MentorsWithPagination>;
  package?: Maybe<Package>;
  packageSubscription?: Maybe<PackageSubscription>;
  packageSubscriptions?: Maybe<Array<Maybe<PackageSubscription>>>;
  packagesWithPagination: PackagesWithPagination;
  payment: Payment;
  paymentsWithPagination: PaymentsWithPagination;
  payoutsHistoryWithPagination?: Maybe<PayoutsHistoryWithPagination>;
  payoutsWithPagination?: Maybe<PayoutsWithPagination>;
  playgroundLesson?: Maybe<Lesson>;
  promotionCode?: Maybe<PromotionCode>;
  promotionCodesWithPagination: PromotionCodesWithPagination;
  publicMentorList?: Maybe<Array<Maybe<Mentor>>>;
  student: Student;
  studentReferral: StudentReferral;
  studentReferralWithPagination: StudentReferralWithPagination;
  studentReviewTagById: StudentReviewTag;
  studentReviewTagsByType: Array<Maybe<StudentReviewTag>>;
  studentReviewsWithPagination: StudentReviewsWithPagination;
  students: Array<Maybe<Student>>;
  studentsWithPagination: StudentsWithPagination;
  topic: Topic;
  topics: Array<Maybe<Topic>>;
  topicsWithPagination: TopicWithPagination;
  trialLessonSlotLimitWithPagination?: Maybe<TrialLessonSlotLimitWithPagination>;
  trialPackages?: Maybe<Array<Maybe<TrialPackage>>>;
  updateAppConfig?: Maybe<AppConfig>;
  users: Array<Maybe<User>>;
  validateReferralCode: ValidationReferralCodeResult;
  vocabulary: Array<Maybe<Vocabulary>>;
};


export type QueryActivePackageSubscriptionsArgs = {
  studentId: Scalars['ID']['input'];
};


export type QueryAppConfigArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAuthenticatedUserArgs = {
  studentId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAvailabilitySlotsArgs = {
  duration: Scalars['Int']['input'];
  mentorId: Scalars['ID']['input'];
  rangeEnd: Scalars['String']['input'];
  rangeStart: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};


export type QueryAvailableMentorsArgs = {
  duration: Scalars['Int']['input'];
  studentId: Scalars['String']['input'];
  time: Scalars['String']['input'];
};


export type QueryAvailableMentorsFroTrialArgs = {
  duration: Scalars['Int']['input'];
  time: Scalars['String']['input'];
};


export type QueryCheckStripePaymentStatusArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type QueryCombinedTimesheetsArgs = {
  date: Scalars['String']['input'];
  duration: Scalars['String']['input'];
  mentorId?: InputMaybe<Scalars['ID']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
  trial?: InputMaybe<Scalars['Boolean']['input']>;
  tz: Scalars['String']['input'];
};


export type QueryCombinedTimesheetsForTrialsArgs = {
  date: Scalars['String']['input'];
  mentorId?: InputMaybe<Scalars['ID']['input']>;
  tz: Scalars['String']['input'];
};


export type QueryConversationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCourseArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCoursesArgs = {
  applyPersonalDiscountCode?: InputMaybe<Scalars['Boolean']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
  trialFilter?: InputMaybe<GeneralTrialFilterType>;
};


export type QueryCreateAppConfigArgs = {
  data: AppConfigInput;
};


export type QueryCreditsCountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReferralCodeArgs = {
  studentId: Scalars['ID']['input'];
};


export type QueryHomeworkArgs = {
  topicId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLanguageLevelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLanguageLevelsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLessonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLessonSectionsArgs = {
  topicId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLessonsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  mentorId?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  startAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  startAtTo?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLessonsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  startAtTo?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  trialFilter?: InputMaybe<GeneralTrialFilterType>;
};


export type QueryMentorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMentorContractByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMentorContractsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMentorReviewsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMentorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
  visibilityStatus?: InputMaybe<VisibilityStatus>;
};


export type QueryMentorsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  trialFilter?: InputMaybe<MentorTrialFilterType>;
};


export type QueryPackageArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPackageSubscriptionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPackageSubscriptionsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryPackagesWithPaginationArgs = {
  course?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sessionTime?: InputMaybe<Scalars['Int']['input']>;
  sessionsPerWeek?: InputMaybe<Scalars['Int']['input']>;
  trialFilter?: InputMaybe<GeneralTrialFilterType>;
};


export type QueryPaymentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPaymentsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  renewal?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPayoutsHistoryWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPayoutsWithPaginationArgs = {
  endDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
  trialFilter?: InputMaybe<GeneralTrialFilterType>;
};


export type QueryPlaygroundLessonArgs = {
  playgroundId: Scalars['String']['input'];
};


export type QueryPromotionCodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPromotionCodesWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStudentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStudentReferralArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStudentReferralWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStudentReviewTagByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStudentReviewTagsByTypeArgs = {
  type?: InputMaybe<StudentReviewTagType>;
};


export type QueryStudentReviewsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStudentsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RowsOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  trialFilter?: InputMaybe<StudentTrialFilterType>;
};


export type QueryTopicArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTopicsWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTrialLessonSlotLimitWithPaginationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUpdateAppConfigArgs = {
  data: UpdateAppConfigInput;
};


export type QueryValidateReferralCodeArgs = {
  referralCode: Scalars['String']['input'];
};


export type QueryVocabularyArgs = {
  topicId?: InputMaybe<Scalars['ID']['input']>;
};

export type ReferralCode = {
  __typename?: 'ReferralCode';
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  promoterStudentId: Scalars['ID']['output'];
  referralUrl?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usages?: Maybe<Array<Maybe<ReferralCodeUsage>>>;
};

export enum ReferralCodeStatus {
  FirstPackagePurchased = 'first_package_purchased',
  RegularSignUp = 'regular_sign_up',
  TrialLessonCompleted = 'trial_lesson_completed',
  TrialSignUp = 'trial_sign_up'
}

export type ReferralCodeUsage = {
  __typename?: 'ReferralCodeUsage';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  referralCodeId: Scalars['ID']['output'];
  referralStatus?: Maybe<ReferralCodeStatus>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usages?: Maybe<Array<Maybe<ReferralCodeUsage>>>;
};

export enum RowsOrdering {
  Asc = 'asc',
  Desc = 'desc'
}

export type SelectReferralBonusLessonResult = {
  __typename?: 'SelectReferralBonusLessonResult';
  isSuccess?: Maybe<Scalars['Boolean']['output']>;
};

export type SignInResult = {
  __typename?: 'SignInResult';
  sessionToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  languageLevelId?: InputMaybe<Scalars['Int']['input']>;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  referralCode?: InputMaybe<Scalars['String']['input']>;
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

export type StripeResult = {
  __typename?: 'StripeResult';
  clientSecret?: Maybe<Scalars['String']['output']>;
};

export type Student = {
  __typename?: 'Student';
  about?: Maybe<Scalars['String']['output']>;
  activeSubscriptions?: Maybe<Array<Maybe<PackageSubscription>>>;
  avatar?: Maybe<File>;
  avatarId?: Maybe<Scalars['ID']['output']>;
  birthday?: Maybe<Scalars['Date']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<GenderType>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  langLevel?: Maybe<Scalars['String']['output']>;
  languageLevel?: Maybe<LanguageLevel>;
  lastName?: Maybe<Scalars['String']['output']>;
  lessons?: Maybe<Lesson>;
  level?: Maybe<Scalars['Int']['output']>;
  parentName?: Maybe<Scalars['String']['output']>;
  pronouns?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type StudentReferral = {
  __typename?: 'StudentReferral';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  friends?: Maybe<Array<Maybe<InvitedStudent>>>;
  giftForStudent?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  referralDiscountCodesUsed?: Maybe<Scalars['Int']['output']>;
  referralsCount?: Maybe<Scalars['Int']['output']>;
  referralsPackagePurchased?: Maybe<Scalars['Int']['output']>;
};

export type StudentReferralWithPagination = {
  __typename?: 'StudentReferralWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  studentReferrals: Array<Maybe<StudentReferral>>;
};

export type StudentReview = {
  __typename?: 'StudentReview';
  id: Scalars['ID']['output'];
  lesson?: Maybe<Lesson>;
  mentor?: Maybe<Mentor>;
  rating?: Maybe<Scalars['Int']['output']>;
  student?: Maybe<Student>;
  tags?: Maybe<Array<Maybe<StudentReviewTag>>>;
};

export type StudentReviewTag = {
  __typename?: 'StudentReviewTag';
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  translations?: Maybe<Array<Maybe<StudentReviewTagTranslation>>>;
  type?: Maybe<StudentReviewTagType>;
};

export type StudentReviewTagTranslation = {
  __typename?: 'StudentReviewTagTranslation';
  id: Scalars['ID']['output'];
  language: CourseTranslationsLanguage;
  title: Scalars['String']['output'];
};

export type StudentReviewTagTranslationInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  language?: CourseTranslationsLanguage;
  title: Scalars['String']['input'];
};

export enum StudentReviewTagType {
  Bad = 'bad',
  Good = 'good',
  Neutral = 'neutral'
}

export type StudentReviewsWithPagination = {
  __typename?: 'StudentReviewsWithPagination';
  count: Scalars['Int']['output'];
  studentReviews: Array<Maybe<StudentReview>>;
};

export enum StudentTrialFilterType {
  All = 'all',
  OnlyRegular = 'only_regular',
  OnlyTrial = 'only_trial',
  TrialActive = 'trial_active',
  TrialInactive = 'trial_inactive'
}

export type StudentUpdateInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  birthday?: InputMaybe<Scalars['Date']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<GenderType>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  koreanEquivalent?: InputMaybe<Scalars['String']['input']>;
  langLevel?: InputMaybe<Scalars['String']['input']>;
  languageLevelId?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessages?: Maybe<Message>;
};


export type SubscriptionNewMessagesArgs = {
  conversationId?: InputMaybe<Scalars['ID']['input']>;
};

export type Timesheet = {
  __typename?: 'Timesheet';
  day?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  mentor?: Maybe<Mentor>;
  to?: Maybe<Scalars['String']['output']>;
};

export type TimesheetAvailability = {
  day: Scalars['String']['input'];
  slots: Array<TimesheetSlot>;
  trialTimesheet: Scalars['Boolean']['input'];
};

export type TimesheetInput = {
  availabilities: Array<TimesheetAvailability>;
  mentorId: Scalars['ID']['input'];
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

export type TimesheetSlot = {
  day: Scalars['String']['input'];
  from: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

export type Topic = {
  __typename?: 'Topic';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  languageLevels?: Maybe<Array<Maybe<LanguageLevel>>>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  translations?: Maybe<Array<Maybe<TopicTranslation>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TopicInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  languageLevelIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  translations: Array<TopicTranslationInput>;
};

export type TopicTranslation = {
  __typename?: 'TopicTranslation';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<CourseTranslationsLanguage>;
  title?: Maybe<Scalars['String']['output']>;
  topic?: Maybe<Topic>;
};

export type TopicTranslationInput = {
  description: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  language?: CourseTranslationsLanguage;
  title: Scalars['String']['input'];
};

export type TopicWithPagination = {
  __typename?: 'TopicWithPagination';
  count: Scalars['Int']['output'];
  topics: Array<Maybe<Topic>>;
};

export type TrialLessonSlotLimit = {
  __typename?: 'TrialLessonSlotLimit';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lessonLimit?: Maybe<Scalars['String']['output']>;
  startAt?: Maybe<Scalars['String']['output']>;
  timeZones?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TrialLessonSlotLimitInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  lessonLimit: Scalars['Int']['input'];
  startAt: Scalars['String']['input'];
  timeZones: Array<Scalars['String']['input']>;
};

export type TrialLessonSlotLimitWithPagination = {
  __typename?: 'TrialLessonSlotLimitWithPagination';
  count: Scalars['Int']['output'];
  trialLessonSlotLimits?: Maybe<Array<Maybe<TrialLessonSlotLimit>>>;
};

export type TrialLessonsBookingInput = {
  mentorId: Scalars['ID']['input'];
  repeat?: InputMaybe<Scalars['Boolean']['input']>;
  startAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TrialPackage = {
  __typename?: 'TrialPackage';
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  period?: Maybe<Scalars['Int']['output']>;
  sessionTime?: Maybe<Scalars['Int']['output']>;
  sessionsPerWeek?: Maybe<Scalars['Int']['output']>;
  totalSessions?: Maybe<Scalars['Int']['output']>;
};

export type TrialSignUpInput = {
  languageLevelId: Scalars['Int']['input'];
  lessonBooking: TrialLessonsBookingInput;
  lessonTopicId: Scalars['Int']['input'];
  packageId: Scalars['Int']['input'];
  user: SignUpInput;
  utm?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAppConfigInput = {
  configName: Scalars['String']['input'];
  configValue: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  activeSubscriptions?: Maybe<Array<Maybe<PackageSubscription>>>;
  address?: Maybe<Scalars['String']['output']>;
  cardLast4?: Maybe<Scalars['String']['output']>;
  conversations?: Maybe<Array<Maybe<Conversation>>>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  mentor?: Maybe<Mentor>;
  notifications?: Maybe<Array<Maybe<Message>>>;
  packageSubscriptions?: Maybe<Array<Maybe<PackageSubscription>>>;
  paymentCurrency?: Maybe<Currency>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRoleType>;
  students?: Maybe<Array<Maybe<Student>>>;
  timeZone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserCreateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  paymentCurrency?: InputMaybe<Currency>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRoleType>;
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

export enum UserRoleType {
  Admin = 'admin',
  Mentor = 'mentor',
  Student = 'student',
  User = 'user'
}

export type UserUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  convertAvailabilityTime?: InputMaybe<Scalars['Boolean']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  googleCalendarSync?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  marketingChannel?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Currency>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRoleType>;
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

export type ValidationReferralCodeResult = {
  __typename?: 'ValidationReferralCodeResult';
  isValid?: Maybe<Scalars['Boolean']['output']>;
  student?: Maybe<Student>;
};

export enum VisibilityStatus {
  Private = 'private',
  Public = 'public'
}

export type Vocabulary = {
  __typename?: 'Vocabulary';
  id: Scalars['ID']['output'];
  topics?: Maybe<Array<Maybe<Topic>>>;
  word?: Maybe<Scalars['String']['output']>;
};

export type MentorsWithPagination = {
  __typename?: 'mentorsWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  mentors: Array<Maybe<Mentor>>;
};

export type PackagesWithPagination = {
  __typename?: 'packagesWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  packages: Array<Maybe<Package>>;
};

export type PayoutsHistoryWithPagination = {
  __typename?: 'payoutsHistoryWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  payouts: Array<Maybe<Payout>>;
};

export type PayoutsWithPagination = {
  __typename?: 'payoutsWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  payouts: Array<Maybe<Payout>>;
};

export type PromotionCodesWithPagination = {
  __typename?: 'promotionCodesWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  promotionCodes: Array<Maybe<PromotionCode>>;
};

export type StudentsWithPagination = {
  __typename?: 'studentsWithPagination';
  count?: Maybe<Scalars['Int']['output']>;
  students: Array<Maybe<Student>>;
};
