// services/projectsService.ts
import type { Project, ProjectImage } from "../Interface/Project";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==== MOCK DATA ==== //
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Brand Campaign",
    description: "Images from brand launch",
    thumbnail: "/mock/brand-thumb.jpg",
    date: "2025-09-20",
  },
  {
    id: "2",
    title: "Social Media",
    description: "Posts prepared for Q4",
    thumbnail: "/mock/social-thumb.jpg",
    date: "2025-09-21",
  },
];

const mockImages: Record<string, ProjectImage[]> = {
  "1": [
    {
      id: "img-101",
      projectId: "1",
      name: "Brand Cover",
      thumbnailUrl: "/mock/brand1-thumb.jpg",
      fullUrl: "/mock/brand1.jpg",
      editedAt: "2025-09-22",
    },
    {
      id: "img-102",
      projectId: "1",
      name: "Brand Banner",
      thumbnailUrl: "/mock/brand2-thumb.jpg",
      fullUrl: "/mock/brand2.jpg",
      editedAt: "2025-09-22",
    },
  ],
  "2": [
    {
      id: "img-201",
      projectId: "2",
      name: "Social Post 1",
      thumbnailUrl: "/mock/social1-thumb.jpg",
      fullUrl: "/mock/social1.jpg",
      editedAt: "2025-09-23",
    },
  ],
};

// ==== SERVICE FUNCTIONS ==== //

/**
 * Simula la carga de proyectos de un usuario.
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  console.log(`📡 [projectsService] Fetching projects for user: ${userId}`);
  await delay(500);
  return mockProjects;
}

/**
 * Simula la carga de imágenes de un proyecto.
 */
export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  console.log(`📡 [projectsService] Fetching images for project: ${projectId}`);
  await delay(500);
  return mockImages[projectId] || [];
}

/**
 * Simula la descarga de una imagen.
 */
export async function downloadImage(imageId: string): Promise<void> {
  console.log(`⬇️ [projectsService] Downloading image: ${imageId}`);
  await delay(300);
  alert(`Image ${imageId} would be downloaded.`);
}

/**
 * Simula la eliminación de una imagen.
 */
export async function deleteImage(imageId: string): Promise<void> {
  console.log(`🗑️ [projectsService] Deleting image: ${imageId}`);
  await delay(300);
  alert(`Image ${imageId} deleted.`);
}
