// components/EditedProjectsWindow/EditedProjectsWindow.tsx
import React, { useEffect, useState } from "react";
import "./style/historial.css";
import type { Project } from "../../services/Interface/Project";
import { getUserProjects } from "../../services/Projects/Project_Service";

export type ImageItem = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

export type HistoryItem = {
  id: string;
  image: ImageItem;
  viewedAt: string;
};

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export const HistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const raw = localStorage.getItem("pixpar_history");
    return raw ? JSON.parse(raw) : [];
  });

  const [plan, setPlan] = useState<string>(
    localStorage.getItem("pixpar_plan") || "free"
  );

  // Borrado automático cada 2 días para plan gratuito
  useEffect(() => {
    if (plan === "free") {
      const now = Date.now();
      const updated = history.filter(
        (h) => now - new Date(h.viewedAt).getTime() <= TWO_DAYS_MS
      );
      if (updated.length !== history.length) {
        setHistory(updated);
        localStorage.setItem("pixpar_history", JSON.stringify(updated));
      }
    }
  }, [plan, history]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("pixpar_history");
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Historial</h2>
        <span className="text-sm italic">
          {plan === "free"
            ? "Plan gratuito — se borra cada 2 días"
            : "Plan suscripción"}
        </span>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500">Sin registros recientes.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto">
          {history.map((h) => (
            <li key={h.id} className="flex gap-3 items-center">
              <img
                src={h.image.url}
                alt={h.image.title}
                className="w-16 h-10 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{h.image.title}</p>
                <p className="text-xs text-gray-500">
                  Visto: {new Date(h.viewedAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end mt-3">
      
        <button onClick={clearHistory} className="clear-history-btn">
          Limpiar historial
        </button>

      </div>
    </div>
  );
};

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
