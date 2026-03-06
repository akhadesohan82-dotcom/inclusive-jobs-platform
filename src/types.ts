export enum DisabilityType {
  VISUAL = 'Visual',
  HEARING = 'Hearing',
  MOBILITY = 'Mobility',
  COGNITIVE = 'Cognitive',
  NEURODIVERGENT = 'Neurodivergent',
  CHRONIC_ILLNESS = 'Chronic Illness',
  OTHER = 'Other'
}

export enum AccommodationType {
  SCREEN_READER = 'Screen Reader Compatibility',
  TEXT_COMMUNICATION = 'Text-based Communication',
  FLEXIBLE_HOURS = 'Flexible Working Hours',
  REMOTE_WORK = 'Remote Work Options',
  WHEELCHAIR_ACCESS = 'Wheelchair Accessible Office',
  QUIET_SPACE = 'Quiet Workspace',
  ASSISTIVE_TECH = 'Assistive Technology Support',
  SIGN_LANGUAGE = 'Sign Language Interpretation',
  BRAILLE = 'Braille Materials'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'employer';
  avatar?: string;
  title?: string;
  bio?: string;
  skills: string[];
  education: string[];
  disabilities: DisabilityType[];
  neededAccommodations: AccommodationType[];
  preferredWorkType: 'full-time' | 'part-time' | 'contract' | 'remote';
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  requiredSkills: string[];
  providedAccommodations: AccommodationType[];
  postedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employerName: string;
  status: 'pending' | 'reviewed' | 'interviewing' | 'offered' | 'rejected';
  appliedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'Legal' | 'Tools' | 'Tips' | 'Success Stories';
  description: string;
  link: string;
  icon?: string;
}
