import { UserProfile, ProgressState } from '@/types/user';

const PROFILE_KEY = 'pathfinder_profile';
const PROGRESS_KEY = 'pathfinder_progress';
const INTERVIEW_KEY = 'pathfinder_interview_history';

export const DEFAULT_PROFILE: UserProfile = {
  userType: 'student',
  goal: 'Land first tech job',
  domainInterest: 'web-dev',
  currentSkills: ['HTML', 'CSS', 'JavaScript'],
  level: 'Beginner',
  hoursPerWeek: 15,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_PROGRESS: ProgressState = {
  completedSkills: {},
  completedProjects: {},
  lastActiveDate: new Date().toISOString(),
  streakDays: 1,
};

export function getStoredProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile from localStorage', e);
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('pathfinder_profile_updated'));
  } catch (e) {
    console.error('Error saving profile to localStorage', e);
  }
}

export function getStoredProgress(): ProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading progress from localStorage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('pathfinder_progress_updated'));
  } catch (e) {
    console.error('Error saving progress to localStorage', e);
  }
}

export function toggleSkillCompleted(skillId: string): ProgressState {
  const current = getStoredProgress();
  const nextCompleted = { ...current.completedSkills };
  if (nextCompleted[skillId]) {
    delete nextCompleted[skillId];
  } else {
    nextCompleted[skillId] = true;
  }
  const updated: ProgressState = {
    ...current,
    completedSkills: nextCompleted,
    lastActiveDate: new Date().toISOString(),
  };
  saveStoredProgress(updated);
  return updated;
}

export function toggleProjectCompleted(projectId: string): ProgressState {
  const current = getStoredProgress();
  const nextProjects = { ...current.completedProjects };
  if (nextProjects[projectId]) {
    delete nextProjects[projectId];
  } else {
    nextProjects[projectId] = true;
  }
  const updated: ProgressState = {
    ...current,
    completedProjects: nextProjects,
    lastActiveDate: new Date().toISOString(),
  };
  saveStoredProgress(updated);
  return updated;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  saveStoredProgress(DEFAULT_PROGRESS);
}
