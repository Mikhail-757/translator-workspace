import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  demoUser,
  initialDocuments,
  initialMemory,
  initialReviews,
  initialTerms,
} from '../shared/mocks/data';
import type { Doc, Review, Term, User } from '../shared/types';

function useWorkspaceState() {
  const [documents, setDocuments] = useState<Doc[]>(initialDocuments);
  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [user, setUser] = useState<User>(demoUser);
  return {
    documents,
    setDocuments,
    terms,
    setTerms,
    reviews,
    setReviews,
    user,
    setUser,
    memory: initialMemory,
  };
}
const WorkspaceContext = createContext<ReturnType<typeof useWorkspaceState> | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  return (
    <WorkspaceContext.Provider value={useWorkspaceState()}>{children}</WorkspaceContext.Provider>
  );
}
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('WorkspaceProvider is required');
  return context;
}
