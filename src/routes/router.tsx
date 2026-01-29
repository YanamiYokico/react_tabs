import { createBrowserRouter } from 'react-router-dom';
import { Tabs } from '../components/Tabs/Tabs';

// eslint-disable-next-line react-refresh/only-export-components
const Page = ({ title }: { title: string }) => (
  <div style={{ padding: 24 }}>{title}</div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Tabs />,
    children: [
      {
        index: true,
        element: <Page title="Dashboard" />,
      },
      {
        path: 'banking',
        element: <Page title="Banking" />,
      },
      {
        path: 'telefonie',
        element: <Page title="Telefonie" />,
      },
      {
        path: 'accounting',
        element: <Page title="Accounting" />,
      },
      {
        path: 'post-office',
        element: <Page title="Post Office" />,
      },
      {
        path: 'admin',
        element: <Page title="Administration" />,
      },
    ],
  },
]);
