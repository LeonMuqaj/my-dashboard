"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { useStore, useHydration } from "@/lib/store";
import ProjectCard from "@/components/ProjectCard";
import Toast, { ToastType } from "@/components/Toast";
import Pagination from "@/components/Pagination";

export default function ProjectsPage() {
  const hydrated = useHydration();
  const projects = useStore((state) => state.projects);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  // Calculate paginated projects
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  return (
    <main className="p-6 relative min-h-[calc(100vh-80px)] flex flex-col">
      {/* Floating Add Project Button */}
      <Link
        href="/projects/add"
        className="fixed top-20 right-6 bg-violet-600 text-white p-3 rounded-full shadow-lg hover:bg-violet-700 transition-colors z-40"
        title="Add Project"
      >
        <Plus size={28} />
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        All Projects
      </h1>

      {!hydrated ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <FolderOpen size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Projects Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by creating your first project
          </p>
          <Link
            href="/projects/add"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus size={20} />
            Add Project
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                showToast={showToast}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-auto">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
