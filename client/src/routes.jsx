import { lazy } from 'react';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Editor = lazy(() => import('./pages/Editor'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

export const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/editor/:id?',
    component: Editor
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/settings',
    component: Settings
  }
];