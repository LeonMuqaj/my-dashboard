import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { Post, Comment } from './api';

// Project interface
export interface Project {
  id: number;
  projectName: string;
  company: string;
  startDate: string;
  endDate: string;
}

interface StoreState {
  // Posts
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, post: Partial<Post>) => void;
  deletePost: (id: number) => void;
  
  // Comments - stored per post
  comments: Record<number, Comment[]>;
  setComments: (postId: number, comments: Comment[]) => void;
  addComment: (postId: number, comment: Comment) => void;
  updateComment: (postId: number, commentId: number, comment: Partial<Comment>) => void;
  deleteComment: (postId: number, commentId: number) => void;
  getComments: (postId: number) => Comment[];

  // Projects
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Posts state
      posts: [],
      
      setPosts: (posts) => set({ posts }),
      
      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts]
      })),
      
      updatePost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map((p) =>
          p.id === id ? { ...p, ...updatedPost } : p
        )
      })),
      
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter((p) => p.id !== id)
      })),
      
      // Comments state
      comments: {},
      
      setComments: (postId, comments) => set((state) => ({
        comments: {
          ...state.comments,
          [postId]: comments
        }
      })),
      
      addComment: (postId, comment) => set((state) => ({
        comments: {
          ...state.comments,
          [postId]: [comment, ...(state.comments[postId] || [])]
        }
      })),
      
      updateComment: (postId, commentId, updatedComment) => set((state) => ({
        comments: {
          ...state.comments,
          [postId]: (state.comments[postId] || []).map((c) =>
            c.id === commentId ? { ...c, ...updatedComment } : c
          )
        }
      })),
      
      deleteComment: (postId, commentId) => set((state) => ({
        comments: {
          ...state.comments,
          [postId]: (state.comments[postId] || []).filter((c) => c.id !== commentId)
        }
      })),
      
      getComments: (postId) => {
        return get().comments[postId] || [];
      },

      // Projects state
      projects: [],
      
      setProjects: (projects) => set({ projects }),
      
      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects]
      })),
      
      updateProject: (id, updatedProject) => set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updatedProject } : p
        )
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      }))
    }),
    {
      name: 'dashboard-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // This runs after rehydration is complete
        console.log('Zustand store rehydrated:', state?.projects?.length, 'projects loaded');
      },
    }
  )
);

// Hook to check if the store has been hydrated from localStorage
export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if the store has finished rehydrating
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If already hydrated, set immediately
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
