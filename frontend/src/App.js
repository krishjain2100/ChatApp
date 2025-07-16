import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import routes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

const router = createBrowserRouter(routes)

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router}/> 
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
