"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/store";
import Modal, { ModalContent, ModalFooter, ModalButton } from "./Modal";
import { Edit, Trash2, Building2, Calendar } from "lucide-react";
import { useStore } from "@/lib/store";

interface Props {
  project: Project;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

// Helper function to format date for display
const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

export default function ProjectCard({ project, showToast }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit form state
  const [editProjectName, setEditProjectName] = useState(project.projectName);
  const [editCompany, setEditCompany] = useState(project.company);
  const [editStartDate, setEditStartDate] = useState(project.startDate);
  const [editEndDate, setEditEndDate] = useState(project.endDate);

  const updateProject = useStore((state) => state.updateProject);
  const deleteProject = useStore((state) => state.deleteProject);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditProjectName(project.projectName);
    setEditCompany(project.company);
    setEditStartDate(project.startDate);
    setEditEndDate(project.endDate);
    setShowEditModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleSaveEdit = () => {
    if (!editProjectName.trim() || !editCompany.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    updateProject(project.id, {
      projectName: editProjectName,
      company: editCompany,
      startDate: editStartDate,
      endDate: editEndDate,
    });

    showToast("Project updated successfully!", "success");
    setShowEditModal(false);
  };

  const handleConfirmDelete = () => {
    deleteProject(project.id);
    showToast("Project deleted successfully!", "success");
    setShowDeleteModal(false);
  };

  return (
    <>
      <Link
        href={`/projects/${project.id}`}
        className="relative group border rounded-lg p-5 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800 h-full flex flex-col cursor-pointer"
      >
        {/* Edit and Delete Icons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors z-10 bg-white dark:bg-gray-700 shadow-sm"
            title="Edit"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors z-10 bg-white dark:bg-gray-700 shadow-sm"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Project Content */}
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white pr-16">
          {project.projectName}
        </h2>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-purple-500" />
            <span>{project.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-pink-500" />
            <span>
              {formatDateForDisplay(project.startDate)} -{" "}
              {formatDateForDisplay(project.endDate)}
            </span>
          </div>
        </div>
      </Link>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  min={editStartDate}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton
            onClick={() => setShowEditModal(false)}
            variant="secondary"
          >
            Cancel
          </ModalButton>
          <ModalButton onClick={handleSaveEdit} variant="primary">
            Save Changes
          </ModalButton>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
        size="sm"
      >
        <ModalContent>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton
            onClick={() => setShowDeleteModal(false)}
            variant="secondary"
          >
            Cancel
          </ModalButton>
          <ModalButton onClick={handleConfirmDelete} variant="danger">
            Delete
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
