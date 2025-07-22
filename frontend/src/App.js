import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import routes from './config/routes';
const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover
          />
        </QueryClientProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
