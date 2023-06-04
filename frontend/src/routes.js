import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import SupplierPage from './pages/SupplierPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddCustomerPage from './pages/AddCustomerPage';
import AddSupplierPage from './pages/AddSupplierPage';
import AddProductPage from './pages/AddProductPage';
import SalesPage from './pages/salesPage';
import GetChallans from './pages/GetChallans';
import TransactionPage from './pages/transactionsPage';
import TransactionCustomerPage from './pages/transactionCustomerPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'supplier', element: <SupplierPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'sales', element: <SalesPage /> },
        { path: 'customerTransactions', element: <TransactionCustomerPage /> },
        { path: 'customerTransactions/details', element: <TransactionPage /> },
        { path: 'AddCustomer', element: <AddCustomerPage /> },
        { path: 'AddSupplier', element: <AddSupplierPage /> },
        { path: 'AddProduct', element: <AddProductPage /> },
        { path: 'GetChallan', element: <GetChallans />}
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
