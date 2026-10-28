import { Skill, SuggestedProject } from './domain';

export type UserLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type UserType = 'student' | 'professional';

export type CareerGoal = 
  | 'Land first tech job'
  | 'Switch career into tech'
  | 'Level up / Promotion'
  | 'Upskill for freelancing & projects'
  | 'Crack technical interviews'
  | 'Master new domain for leadership';

export interface UserProfile {
  id?: string;
  email?: string;
  userType: UserType;
  goal: string;
  domainInterest: string; // matches domain slug e.g. "web-dev"
  currentSkills: string[];
  level: UserLevel;
  hoursPerWeek: number;
  
  // Working Professional specific fields
  currentRole?: string;
  yearsOfExperience?: string;
  targetRole?: string;

  createdAt: string;
  updatedAt: string;
}

export interface WeekPlan {
  weekNumber: number;
  stageNumber: number;
  stageTitle: string;
  focusTitle: string;
  estimatedHours: number;
  skills: Skill[];
  suggestedProject?: SuggestedProject;
}

export interface PersonalizedRoadmap {
  domainId: string;
  domainName: string;
  userLevel: UserLevel;
  userType: UserType;
  hoursPerWeek: number;
  startingStage: number;
  totalWeeks: number;
  totalSkillsCount: number;
  filteredExistingSkillsCount: number;
  weeks: WeekPlan[];
  generatedAt: string;
}

export interface ProgressState {
  completedSkills: Record<string, boolean>; // skillId -> boolean
  completedProjects: Record<string, boolean>; // projectId -> boolean
  lastActiveDate: string;
  streakDays: number;
}
