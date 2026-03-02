import { createContext, useEffect, useState } from "react";
import { BaseUrl } from '../env/env.environment';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const tokenContext = createContext();

export default function TokenContextProvider({ children }) {
  let [ userToken, setToken ] = useState(() => {
    return localStorage.getItem("token");
  });
  let [ userData, setData ] = useState(null);

  useEffect(() => {
    if (!userToken) return;
    try {
      const decoded = jwtDecode(userToken);
      console.log('decoded', decoded);
      axios.get(`${BaseUrl}/users/profile-data`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }).then((response) => {
        setData(response.data.data.user);
      });
    } catch (err) {
      console.error('Token decode error:', err);
    }
  }, [ userToken ]);

  return <tokenContext.Provider value={{ userToken, setToken, userData, setData }}>{children}</tokenContext.Provider>;
}
