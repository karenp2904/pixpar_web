// components/EditedProjectsWindow/EditedProjectsWindow.tsx
import React, { useEffect, useState } from "react";
import "./editedProjectsWindow.css";
import type { Project } from "../../services/Interface/Project";
import { getUserProjects } from "../../services/Projects/Project_Service";

interface EditedProjectsWindowProps {
  userId: string;
  onOpenProject: (id: string) => void;
}

const EditedProjectsWindow: React.FC<EditedProjectsWindowProps> = ({
  userId,
  onOpenProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getUserProjects(userId);
        setProjects(data);
      } catch (err) {
        console.error("❌ Error al cargar proyectos:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchProjects();
  }, [userId]);

  return (
    <div className="edited-window">
      <h2 className="edited-title">Mis Proyectos</h2>
      <p className="edited-subtitle">
        Aquí puedes ver y administrar todas las imágenes que has editado.
      </p>

      <div className="edited-list">
        {loading ? (
          <p className="edited-loading">Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p className="edited-empty">No hay proyectos disponibles.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="edited-card"
              onClick={() => onOpenProject(project.id)}
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="edited-thumbnail"
              />
              <div className="edited-info">
                <h3 className="edited-card-title">{project.title}</h3>
                <p className="edited-card-description">{project.description}</p>
                <span className="edited-date">
                  Editado el {new Date(project.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditedProjectsWindow;
