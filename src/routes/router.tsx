import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/main';

import { LazyPage } from './lazy-page';
import { paths } from './paths';

const router = createBrowserRouter([
  {
    path: '/',
    // element: <Navigate to={paths.root.home} replace />,
      element: <Navigate to={paths.root.swap} replace />,
  },
  {
    path: paths.root.home,
    element: (
      <RootLayout />
    ),
    children: [
      {
        path: paths.root.swap,
        element: LazyPage(() => import('@/pages/swap')),
      },
      // {
      //   path: paths.root.test,
      //   element: LazyPage(() => import('@/pages/test')),
      // }
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
