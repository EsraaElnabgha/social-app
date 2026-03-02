import { createContext, useEffect, useState } from "react";
import { BaseUrl } from '../env/env.environment';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const tokenContext = createContext();

export default function TokenContextProvider({ children }) {
  let [ userToken, setToken ] = useState(() => {
    return localStorage.getItem("token");
  });
  let [ userData, setData ] = useState(null)

  useEffect(() => {
    const decoded = jwtDecode(userToken);
    console.log('decoded', decoded)
    if (localStorage.getItem('token') !== null) {
      axios.get(`${BaseUrl}/users/profile-data`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }).then((response) => {
        setData(response.data.data.user)
      })
    }
  }, [])

  // useEffect(() => {
  //   let token = localStorage.getItem("token");
  //   if (localStorage.getItem("token") ) {
  //     setToken(token);
  //   }
  // }, []);

  return <tokenContext.Provider value={{ userToken, setToken, userData, setData }}>{children}</tokenContext.Provider>;
}
