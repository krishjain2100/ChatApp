import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import routes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter(routes)

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router}/> 
        <ToastContainer>
          position="top-right"
          autoClose={3000}
          closeOnClick
          pauseOnHover
        </ToastContainer>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
