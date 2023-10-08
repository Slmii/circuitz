import { useAuth } from 'lib/hooks';
import { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireAuthentication = ({ children }: PropsWithChildren) => {
	const { user, loadingSession } = useAuth();

	if (loadingSession) {
		return null;
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return children ? children : <Outlet />;
};
