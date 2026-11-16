import type { Application } from './types'
import { daysAgo, daysFromNow } from './dates'

/**
 * Demo applications shown the first time someone opens the board.
 * Dates are relative to today so the demo never looks stale.
 */
export function createSampleApplications(): Application[] {
  return [
    {
      id: 'sample-grab',
      company: 'Grab',
      role: 'Software Engineer, Backend',
      status: 'interview',
      appliedDate: daysAgo(12),
      interviewAt: daysFromNow(2, 14),
      salary: 'RM 7,000 – 9,000',
      location: 'Kuala Lumpur',
      notes: 'Referred by a former colleague. Second round is system design.',
    },
    {
      id: 'sample-shopee',
      company: 'Shopee',
      role: 'Software Engineer',
      status: 'interview',
      appliedDate: daysAgo(9),
      interviewAt: daysFromNow(5, 10, 30),
      salary: 'RM 6,500 – 8,500',
      location: 'Kuala Lumpur',
    },
    {
      id: 'sample-airasia',
      company: 'AirAsia MOVE',
      role: 'Frontend Developer (React)',
      status: 'applied',
      appliedDate: daysAgo(1),
      location: 'Sepang · Hybrid',
    },
    {
      id: 'sample-petronas',
      company: 'Petronas Digital',
      role: 'Junior Full-Stack Developer',
      status: 'applied',
      appliedDate: daysAgo(3),
      salary: 'RM 5,000 – 6,500',
      location: 'Kuala Lumpur',
    },
    {
      id: 'sample-tng',
      company: "Touch 'n Go",
      role: 'Backend Engineer (PHP)',
      status: 'applied',
      appliedDate: daysAgo(6),
      location: 'Remote',
    },
    {
      id: 'sample-carsome',
      company: 'Carsome',
      role: 'Software Engineer',
      status: 'interview',
      appliedDate: daysAgo(20),
      interviewAt: daysFromNow(9, 11),
      location: 'Petaling Jaya',
    },
    {
      id: 'sample-maybank',
      company: 'Maybank',
      role: 'Application Developer',
      status: 'offer',
      appliedDate: daysAgo(37),
      salary: 'RM 6,000',
      location: 'Kuala Lumpur',
      notes: 'Offer letter received. Reply by the end of the month.',
    },
    {
      id: 'sample-axiata',
      company: 'Axiata',
      role: 'Software Engineer, Payments',
      status: 'offer',
      appliedDate: daysAgo(31),
      salary: 'RM 6,800',
      location: 'Kuala Lumpur',
    },
    {
      id: 'sample-sunway',
      company: 'Sunway',
      role: 'Web Developer',
      status: 'rejected',
      appliedDate: daysAgo(39),
      location: 'Subang Jaya',
    },
    {
      id: 'sample-gamuda',
      company: 'Gamuda',
      role: 'Laravel Developer',
      status: 'rejected',
      appliedDate: daysAgo(46),
      location: 'Petaling Jaya',
    },
    {
      id: 'sample-cimb',
      company: 'CIMB',
      role: 'Junior Software Engineer',
      status: 'rejected',
      appliedDate: daysAgo(44),
      location: 'Kuala Lumpur',
    },
    {
      id: 'sample-boost',
      company: 'Boost',
      role: 'Frontend Engineer',
      status: 'rejected',
      appliedDate: daysAgo(27),
      salary: 'RM 5,500 – 7,000',
      location: 'Kuala Lumpur',
    },
  ]
}
