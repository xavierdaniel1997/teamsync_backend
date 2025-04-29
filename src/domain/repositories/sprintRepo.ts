import { ISprint } from "../entities/sprint";

export interface ISprintRepository {
  countByProject(projectId: string): Promise<number>;
  create(sprint: ISprint): Promise<ISprint>;
  findById(id: string): Promise<ISprint | null>;
  update(id: string, updates: Partial<ISprint>): Promise<ISprint | null>;
  findByProject(projectId: string): Promise<ISprint[]>;
}