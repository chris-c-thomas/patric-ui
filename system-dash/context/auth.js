
import { createContext, useContext } from 'react';

import { isSignedIn } from '../../src/api/auth';

const AuthContext = createContext([{}]);

const AuthProvider = (props) => {
  return (
    <AuthContext.Provider value={[isSignedIn()]}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };