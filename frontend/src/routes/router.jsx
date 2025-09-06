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
import TellerLayout from '../layout/TellerLayout';
import Teller from '../pages/teller/Teller';
import ForgetPassword from '../pages/default/ForgetPassword';
import MyAccount from '../pages/main/MyAccount';
import Home from '../pages/default/Home';
import AttendanceList from '../pages/main/AttendanceList';
import EmployeeArchive from '../pages/main/EmployeeArchive';
import ProductArchive from '../pages/main/ProductArchive';
import Sales from '../pages/main/Sales';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/signin',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/forgetpassword',
        element: <ForgetPassword />
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
        path: '/products',
        element: <Product />
      },
            {
        path: '/product/archives',
        element: <ProductArchive />
      },
      {
        path: '/product/form/:id?',
        element: <ProductForm />
      },
      {
        path: '/employees',
        element: <Employee />
      },
      {
        path: '/employee/archives',
        element: <EmployeeArchive />
      },
      {
        path: '/employee/form/:id?',
        element: <EmployeeForm />
      },
      {
        path: '/sales',
        element: <Sales />
      },
      {
        path: '/my-account',
        element: <MyAccount />
      },
      {
        path: '/attendance',
        element: <AttendanceList />
      }
    ],
  },
  {
    path: '/',
    element: <TellerLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to='/teller' />
      },
      {
        path: '/teller',
        element: <Teller />
      }
    ],
  },
  {
    path: '*',
    element: <Notfound />
  }
]);

export default router