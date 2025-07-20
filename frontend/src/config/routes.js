import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import Main from '../components/Main';

const routes = [
  {path: '/', element: <Home/>},
  {path: '/login', element: <Login/>},
  {path: '/register', element: <Register/>},
  {path: '/forgotPassword', element: <ForgotPassword/>},
  {path: '/main', element: <Main/>}
]

export default routes;