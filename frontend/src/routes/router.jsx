import { createBrowserRouter, Navigate } from 'react-router-dom'
import DefaultLayout from '../layout/DefaultLayout'
import Signup from '../pages/default/Signup';
import Notfound from '../Notfound';
import Login from '../pages/default/Login';
import MainLayout from '../layout/MainLayout';
import DashBoard from '../pages/main/dashboard';
import Business from '../pages/main/business';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to='/signin'/>
      },
      {
        path: '/signin',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      }
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to='/dashboard'/>
      },
      {
        path: '/dashboard',
        element: <DashBoard />
      }, 
      {
        path: '/business',
        element: <Business />
      }
    ],
  },
  {
    path: '*',
    element: <Notfound />
  }
]);

export default router