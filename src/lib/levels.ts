// Shared level shape used across every topic module (each topic has 4
// difficulty tiers: Trivial / Challenging / Extreme / Helldive).

export type LevelId = 1 | 2 | 3 | 4;

export interface LevelMeta {
  id: LevelId;
  name: string;
  subtitle: string;
  difficulty: string;
}

export interface WorkedStep {
  text: string;
  math?: string;
}

export interface Lesson {
  intro: string;
  steps: WorkedStep[];
}
