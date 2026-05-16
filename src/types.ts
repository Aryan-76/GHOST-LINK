export type Message = {
  id?: string;
  user: string;
  text: string;
  time: string;
  isAI?: boolean;
};

export type ProjectStatus = 'active' | 'planned' | 'archived' | 'completed';

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  members: string[];
  description?: string;
};

export type ActivityType = 'edit' | 'comment' | 'complete' | 'alert';

export type Activity = {
  id: string;
  title: string;
  time: string;
  type: ActivityType;
  user?: string;
};

export type WorkspaceStats = {
  activeProjects: number;
  openIssues: number;
};
