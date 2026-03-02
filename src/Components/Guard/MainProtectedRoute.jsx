import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { tokenContext } from '../../Context/TokenContext'

export default function MainProtectedRoute({ children }) {
    let { userToken } = useContext(tokenContext);
  
  if (userToken) {
    return children;
  } else {
    return <Navigate to="/auth/login" />;
  }
}