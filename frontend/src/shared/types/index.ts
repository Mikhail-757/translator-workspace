export type Role = 'translator' | 'editor';
export type DocumentStatus = 'draft' | 'in_review' | 'approved';
export type SegmentStatus = 'pending' | 'translated' | 'approved' | 'rejected';
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
export interface TmEntry {
  id: number;
  sourceText: string;
  targetText: string;
  domain: string;
  sourceDocTitle: string;
  sourceLang: string;
  targetLang: string;
  updatedAt: string;
  score?: number;
}
export interface Segment {
  id: number;
  position: number;
  sourceText: string;
  targetText: string;
  status: SegmentStatus;
  suggestion: TmEntry | null;
}
export interface Doc {
  id: number;
  title: string;
  sourceLang: string;
  targetLang: string;
  status: DocumentStatus;
  progress: number;
  updatedAt: string;
  domain: string;
  segments: Segment[];
}
export interface Term {
  id: number;
  sourceTerm: string;
  targetTerm: string;
  domain: string;
  addedBy: string;
}
export interface Review {
  id: number;
  documentId: number;
  docTitle: string;
  sourceText: string;
  translatorVersion: string;
  editorVersion: string;
  comment: string;
  status: 'open' | 'approved' | 'rejected';
}
