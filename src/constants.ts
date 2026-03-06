import { Job, AccommodationType, DisabilityType } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    employerId: 'emp1',
    employerName: 'TechFlow Solutions',
    title: 'Frontend Developer',
    description: 'We are looking for a creative frontend developer to join our inclusive team. We value diversity and provide a supportive environment for all abilities.',
    location: 'Remote / New York',
    salaryRange: '$80k - $120k',
    type: 'remote',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
    providedAccommodations: [
      AccommodationType.REMOTE_WORK,
      AccommodationType.FLEXIBLE_HOURS,
      AccommodationType.SCREEN_READER,
      AccommodationType.ASSISTIVE_TECH
    ],
    postedAt: new Date().toISOString()
  },
  {
    id: '2',
    employerId: 'emp2',
    employerName: 'Green Horizon Non-Profit',
    title: 'Administrative Assistant',
    description: 'Join our mission-driven organization. We offer a quiet, low-stress environment and are committed to workplace accessibility.',
    location: 'Chicago, IL',
    salaryRange: '$45k - $55k',
    type: 'full-time',
    requiredSkills: ['Organization', 'Communication', 'MS Office'],
    providedAccommodations: [
      AccommodationType.QUIET_SPACE,
      AccommodationType.WHEELCHAIR_ACCESS,
      AccommodationType.TEXT_COMMUNICATION
    ],
    postedAt: new Date().toISOString()
  },
  {
    id: '3',
    employerId: 'emp3',
    employerName: 'Creative Pulse Agency',
    title: 'Graphic Designer',
    description: 'A vibrant agency looking for talented designers. We provide all necessary assistive software and hardware.',
    location: 'Austin, TX',
    salaryRange: '$60k - $90k',
    type: 'part-time',
    requiredSkills: ['Adobe Suite', 'UI/UX', 'Creativity'],
    providedAccommodations: [
      AccommodationType.ASSISTIVE_TECH,
      AccommodationType.FLEXIBLE_HOURS,
      AccommodationType.REMOTE_WORK
    ],
    postedAt: new Date().toISOString()
  }
];

export const MOCK_RESOURCES = [
  {
    id: 'r1',
    title: 'Workplace Rights for People with Disabilities',
    category: 'Legal',
    description: 'A comprehensive guide to your rights under the ADA and other local regulations.',
    link: '#'
  },
  {
    id: 'r2',
    title: 'Top 5 Screen Readers for 2026',
    category: 'Tools',
    description: 'An updated comparison of the most effective screen reading software for professional use.',
    link: '#'
  },
  {
    id: 'r3',
    title: 'Interview Tips: Discussing Accommodations',
    category: 'Tips',
    description: 'How and when to bring up your accessibility needs during the hiring process.',
    link: '#'
  },
  {
    id: 'r4',
    title: 'Success Story: Accessibility in Tech',
    category: 'Success Stories',
    description: 'How Sarah, a deaf software engineer, found her dream role at a major tech firm.',
    link: '#'
  }
];
