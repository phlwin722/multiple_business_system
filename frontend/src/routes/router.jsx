import { createBrowserRouter, Navigate } from 'react-router-dom'
import DefaultLayout from '../layout/DefaultLayout'
import Signup from '../pages/default/Signup';
import Notfound from '../Notfound';
import Login from '../pages/default/Login';
import MainLayout from '../layout/MainLayout';
import DashBoard from '../pages/main/dashboard';
import Product from '../pages/main/Product';
import ProductForm from '../pages/main/ProductForm';
import Business from '../pages/main/business'; 
import Employee from '../pages/main/Employee';
import EmployeeForm from '../pages/main/EmployeeForm';
import BusinessForm from '../pages/main/BusinessForm';

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
      },
      {
        path: '/business/form/:id?',
        element: <BusinessForm />
      }, 
      {
        path: '/product',
        element: <Product />
      },
      {
        path: '/product/form/:id?',
        element: <ProductForm />
      },
      {
        path: '/employee',
        element: <Employee />
      },
      {
        path: '/employee/form/:id?',
        element: <EmployeeForm />
      }
    ],
  },
  {
    path: '*',
    element: <Notfound />
  }
]);

export default router