
// project.interface.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
}


export interface ProjectImage {
  id: string;
  projectId: string;
  name: string;
  thumbnailUrl: string; // small preview
  fullUrl?: string; // optional download url
  editedAt: string; // ISO date
};