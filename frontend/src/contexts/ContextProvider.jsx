import { useState, createContext, useContext } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  typePosition: null,
  setUser: () => {},
  setToken: () => {},
  setTypePostion: () => {},
});

export const ContextProvider = ({ children }) => {
  // load user information
  const [user, _setUser] = useState(() => {
    const userInfo = localStorage.getItem('user_info');

    return userInfo ? JSON.parse(userInfo): null
  });

  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  const [typePosition, _setTypePosition] = useState(localStorage.getItem('TYPE_POSITION'))

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
      localStorage.removeItem('ACCESS_TOKEN')
    }
  }

  const setTypePostion = (typePosition) => {
    _setTypePosition(typePosition);

    if (typePosition) {
      localStorage.setItem('TYPE_POSITION', typePosition);
    } else {
      localStorage.removeItem('TYPE_POSITION')
    }
  }

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        typePosition,
        setToken,
        setUser,
        setTypePostion,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)