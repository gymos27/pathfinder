export interface Resource {
  title: string;
  type: 'Docs' | 'Course' | 'Interactive';
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyTopics: string[];
  resources: Resource[];
}

export interface SuggestedProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  deliverables: string[];
  skillsApplied: string[];
}

export interface Stage {
  stageNumber: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  description: string;
  orderedSkills: Skill[];
  suggestedProjects: SuggestedProject[];
}

export interface Domain {
  id: string;
  slug: string;
  name: string;
  icon: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  averageSalary: string;
  growthRate: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Challenging';
  typicalRoles: string[];
  totalEstimatedHours: number;
  stages: Stage[];
}
