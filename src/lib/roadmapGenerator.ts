import { Domain, Skill, SuggestedProject } from '@/types/domain';
import { PersonalizedRoadmap, UserProfile, WeekPlan } from '@/types/user';

function normalizeSkill(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isSkillMasteredByUser(skill: Skill, userSkills: string[]): boolean {
  if (!userSkills || userSkills.length === 0) return false;
  
  const normSkillName = normalizeSkill(skill.name);
  
  return userSkills.some((userSkill) => {
    const normUserSkill = normalizeSkill(userSkill);
    if (!normUserSkill) return false;
    
    // Direct or substring match
    if (normSkillName.includes(normUserSkill) || normUserSkill.includes(normSkillName)) {
      return true;
    }
    
    // Match against key topics
    return skill.keyTopics.some((topic) => {
      const normTopic = normalizeSkill(topic);
      return normTopic.includes(normUserSkill) || normUserSkill.includes(normTopic);
    });
  });
}

export function getStartingStageNumber(level: 'Beginner' | 'Intermediate' | 'Advanced'): number {
  switch (level) {
    case 'Beginner':
      return 1;
    case 'Intermediate':
      return 2;
    case 'Advanced':
      return 3;
    default:
      return 1;
  }
}

export function generatePersonalizedRoadmap(domain: Domain, profile: UserProfile): PersonalizedRoadmap {
  const startingStageNumber = getStartingStageNumber(profile.level);
  const weeklyHours = Math.max(5, Math.min(40, profile.hoursPerWeek || 15));

  // Eligible stages starting from user's level
  const eligibleStages = domain.stages.filter((stage) => stage.stageNumber >= startingStageNumber);

  let totalSkillsCount = 0;
  let filteredExistingSkillsCount = 0;
  const weeks: WeekPlan[] = [];
  let currentWeekNumber = 1;

  for (const stage of eligibleStages) {
    const remainingSkills: Skill[] = [];

    for (const skill of stage.orderedSkills) {
      totalSkillsCount++;
      if (isSkillMasteredByUser(skill, profile.currentSkills)) {
        filteredExistingSkillsCount++;
      } else {
        remainingSkills.push(skill);
      }
    }

    // If all skills were mastered in this stage, keep at least the last skill or suggest the project
    const stageSkillsToSchedule = remainingSkills.length > 0 
      ? remainingSkills 
      : (stage.orderedSkills.slice(-1)); // Keep at least one refresher skill if everything was filtered

    // Distribute skills of this stage into weeks based on weeklyHours
    let currentWeekSkills: Skill[] = [];
    let currentWeekHours = 0;
    const projectForStage: SuggestedProject | undefined = stage.suggestedProjects[0];

    for (let i = 0; i < stageSkillsToSchedule.length; i++) {
      const skill = stageSkillsToSchedule[i];
      const wouldExceed = currentWeekHours + skill.estimatedHours > weeklyHours * 1.35; // allow 35% flexibility

      if (currentWeekSkills.length > 0 && wouldExceed) {
        // Finalize current week
        weeks.push({
          weekNumber: currentWeekNumber++,
          stageNumber: stage.stageNumber,
          stageTitle: stage.title,
          focusTitle: `${stage.title}: Part ${weeks.filter((w) => w.stageNumber === stage.stageNumber).length + 1}`,
          estimatedHours: currentWeekHours,
          skills: currentWeekSkills,
        });

        currentWeekSkills = [skill];
        currentWeekHours = skill.estimatedHours;
      } else {
        currentWeekSkills.push(skill);
        currentWeekHours += skill.estimatedHours;
      }
    }

    // Push final week of this stage and attach stage project
    if (currentWeekSkills.length > 0) {
      weeks.push({
        weekNumber: currentWeekNumber++,
        stageNumber: stage.stageNumber,
        stageTitle: stage.title,
        focusTitle: `${stage.title}: Milestone & Practical Capstone`,
        estimatedHours: currentWeekHours + 8, // include project hours
        skills: currentWeekSkills,
        suggestedProject: projectForStage,
      });
    }
  }

  return {
    domainId: domain.id,
    domainName: domain.name,
    userLevel: profile.level,
    userType: profile.userType || 'student',
    hoursPerWeek: weeklyHours,
    startingStage: startingStageNumber,
    totalWeeks: weeks.length,
    totalSkillsCount,
    filteredExistingSkillsCount,
    weeks,
    generatedAt: new Date().toISOString(),
  };
}
