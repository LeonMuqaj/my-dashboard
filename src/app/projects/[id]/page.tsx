"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, FolderOpen } from "lucide-react";
import { useStore, useHydration } from "@/lib/store";
import ProjectDetailCalendar from "@/components/ProjectDetailCalendar";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hydrated = useHydration();
  const projects = useStore((state) => state.projects);

  const projectId = Number(params.id);
  const project = projects.find((p) => p.id === projectId);

  // Loading state
  if (!hydrated) {
    return (
      <main className="p-6 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  // Project not found
  if (!project) {
    return (
      <main className="p-6 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 inline-block">
            <FolderOpen size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Project Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The project you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  // Format date for display
  const formatDate = (isoDate: string): string => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  // Calculate duration
  const calculateDuration = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <main className="p-6 min-h-[calc(100vh-80px)]">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Projects</span>
      </button>

      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <FolderOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.projectName}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
              <Building2 size={18} className="text-purple-500" />
              <span className="text-lg">{project.company}</span>
            </div>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Calendar
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(project.startDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                <Calendar
                  size={20}
                  className="text-rose-600 dark:text-rose-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  End Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Calendar
                  size={20}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Duration
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {calculateDuration()} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={24} className="text-violet-500" />
          Project Timeline
        </h2>
        <ProjectDetailCalendar
          startDate={project.startDate}
          endDate={project.endDate}
        />
      </div>
    </main>
  );
}
