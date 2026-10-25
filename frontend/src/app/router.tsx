import { createBrowserRouter } from 'react-router-dom';
import { AppLayout, AuthLayout } from './layouts';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import { DocumentNewPage } from '../pages/DocumentNewPage';
import { EditorPage } from '../pages/EditorPage';
import { TmPage } from '../pages/TmPage';
import { GlossaryPage } from '../pages/GlossaryPage';
import { ReviewsPage } from '../pages/ReviewsPage';
import { NotFoundPage, ProfilePage } from '../pages/ProfilePage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/documents/new', element: <DocumentNewPage /> },
      { path: '/documents/:id', element: <EditorPage /> },
      { path: '/tm', element: <TmPage /> },
      { path: '/glossary', element: <GlossaryPage /> },
      { path: '/reviews', element: <ReviewsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
