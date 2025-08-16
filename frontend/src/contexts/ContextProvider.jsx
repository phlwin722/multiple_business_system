import { useState, createContext, useContext } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  // load user information
  const [user, _setUser] = useState(() => {
    const userInfo = localStorage.getItem('user_info');

    return userInfo ? JSON.parse(userInfo): null
  });

  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  const setUser = (user) => {
    _setUser(user);
    if (user) {
      localStorage.setItem('user_info', JSON.stringify(user))
    } else {
      localStorage.removeItem('user_info');
    }
  }

  const setToken = (token) => {
    _setToken(token)

    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('token')
    }
  }

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        setToken,
        setUser,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)