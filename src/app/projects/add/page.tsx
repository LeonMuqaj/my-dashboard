"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, FolderPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

// Helper functions for date format conversion
const formatDateToDisplay = (isoDate: string): string => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const formatDisplayToISO = (displayDate: string): string => {
  if (!displayDate) return "";
  const parts = displayDate.split("/");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const isValidDisplayDate = (displayDate: string): boolean => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(displayDate)) return false;
  const isoDate = formatDisplayToISO(displayDate);
  const date = new Date(isoDate);
  return !isNaN(date.getTime());
};

export default function AddProjectPage() {
  const router = useRouter();
  const addProject = useStore((state) => state.addProject);

  const [formData, setFormData] = useState({
    projectName: "",
    company: "",
    startDate: "",
    endDate: "",
  });
  const [displayDates, setDisplayDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow typing with automatic slash insertion
    let formattedValue = value.replace(/[^\d/]/g, "");

    // Auto-insert slashes
    if (formattedValue.length === 2 && !formattedValue.includes("/")) {
      formattedValue += "/";
    } else if (
      formattedValue.length === 5 &&
      formattedValue.split("/").length === 2
    ) {
      formattedValue += "/";
    }

    // Limit length
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }

    setDisplayDates((prev) => ({ ...prev, [name]: formattedValue }));

    // Convert to ISO format for form data if valid
    if (isValidDisplayDate(formattedValue)) {
      const isoDate = formatDisplayToISO(formattedValue);
      setFormData((prev) => ({ ...prev, [name]: isoDate }));
    } else if (formattedValue === "") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDisplayDates((prev) => ({
      ...prev,
      [name]: formatDateToDisplay(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create new project with unique ID
    const newProject = {
      id: Date.now(),
      ...formData,
    };

    // Save to Zustand store
    addProject(newProject);

    setIsSubmitting(false);
    setIsSuccess(true);

    // Navigate to projects page after success
    setTimeout(() => {
      router.push("/projects");
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Page Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm mb-4 inline-flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mt-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <FolderPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Add New Project
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new project and start tracking your progress
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />

          {/* Form Container */}
          <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            {/* Success Message */}
            {isSuccess && (
              <div className="absolute inset-0 bg-card/95 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="text-center animate-slide-in">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Project Created!
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Your new project has been added successfully
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FolderPlus className="w-4 h-4 text-violet-500" />
                  Project Name
                </label>
                <Input
                  name="projectName"
                  type="text"
                  placeholder="Enter project name..."
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-background/50 border-border/50 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  For Which Company
                </label>
                <Input
                  name="company"
                  type="text"
                  placeholder="Enter company name..."
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-background/50 border-border/50 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  Project Duration
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      Start Date
                    </span>
                    <div className="relative">
                      <Input
                        name="startDate"
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={displayDates.startDate}
                        onChange={handleDateDisplayChange}
                        required={!formData.startDate}
                        className="h-12 bg-background/50 border-border/50 focus:border-pink-500 focus:ring-pink-500/20 transition-all duration-200 pr-10"
                      />
                      <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                        <label className="cursor-pointer text-muted-foreground hover:text-pink-500 transition-colors">
                          <Calendar className="w-5 h-5" />
                          <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleNativeDateChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      End Date
                    </span>
                    <div className="relative">
                      <Input
                        name="endDate"
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={displayDates.endDate}
                        onChange={handleDateDisplayChange}
                        required={!formData.endDate}
                        className="h-12 bg-background/50 border-border/50 focus:border-pink-500 focus:ring-pink-500/20 transition-all duration-200 pr-10"
                      />
                      <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                        <label className="cursor-pointer text-muted-foreground hover:text-pink-500 transition-colors">
                          <Calendar className="w-5 h-5" />
                          <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleNativeDateChange}
                            min={formData.startDate}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Project...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Project
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Fill in the details above to create your new project. You can always
          edit these later.
        </p>
      </div>
    </div>
  );
}
