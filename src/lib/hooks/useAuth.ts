import { AuthContext } from 'lib/context';
import { useContext } from 'react';

export const useAuth = () => {
	return useContext(AuthContext);
};
