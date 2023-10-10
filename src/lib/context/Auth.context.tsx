import { useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { DELEGATION, IDENTITY, II_AUTH } from 'lib/constants/local-storage.constants';
import { getDelegation, unwrapResult } from 'lib/utils/actor.utils';
import { validateIdentity } from 'lib/utils/identity.utils';
import { createContext } from 'react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useSnackbar } from 'lib/hooks';
import { User } from 'declarations/users.declarations';
import { useNavigate } from 'react-router-dom';
import { LocalStorage } from '@dfinity/auth-client';

interface IAuthClient {
	signInII: () => Promise<void>;
	signOut: () => Promise<void>;
	setUser: (user: User) => void;
	user?: User;
	loadingII: boolean;
	loadingSession: boolean;
	loadingSignOut: boolean;
}

export const AuthContext = createContext<IAuthClient>({
	signInII: () => Promise.resolve(),
	signOut: () => Promise.resolve(),
	setUser: () => {},
	user: undefined,
	loadingII: false,
	loadingSession: false,
	loadingSignOut: false
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const navigate = useNavigate();

	// Loading states
	const [loadingSession, setLoadingSession] = useState(true);
	const [loadingSignOut, setLoadingSignOut] = useState(false);

	// User state
	const [user, setUser] = useState<User | undefined>(undefined);

	// Loading states for II
	const [loadingII, setLoadingII] = useState(false);

	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	useEffect(() => {
		const init = async () => {
			try {
				// Validate current identity
				await validateIdentity({
					onSuccess: async () => {
						const identity = await getDelegation();

						// Delegation Identity is not valid or expired
						if (!identity) {
							await signOut();
						} else {
							// Set principal value to trigger a useQuery
							// useQuery will fetch the user and see if it exists
							await initUser();
						}

						setLoadingSession(false);
					},
					onInvalidSession: error => {
						console.log('Error onInvalidSession', error);
						setLoadingSession(false);
					}
				});
			} catch (error) {
				console.log('Error OnValidateSession', error);
				setLoadingSession(false);
			}
		};

		init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const signInII = async () => {
		setLoadingII(true);

		const authClient = await api.Actor.getAuthClient();
		await authClient.login({
			onSuccess: async () => {
				await initUser();
				navigate('/dashboard');
			},
			onError: error => {
				setLoadingII(false);
				error && errorSnackbar(error);
			},
			// 7 days
			maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
			identityProvider: 'https://identity.ic0.app/#authorize'
		});
	};

	const signOut = async () => {
		setUserInState(undefined);
		setLoadingSignOut(true);

		try {
			const storage = new LocalStorage(II_AUTH);

			await storage.remove(IDENTITY);
			await storage.remove(DELEGATION);

			const authClient = await api.Actor.getAuthClient();
			await authClient.logout();
		} catch (error) {
			console.log('SignOut Error', error);
		} finally {
			// Invalidate cache upon signout
			await queryClient.resetQueries();
			await queryClient.invalidateQueries();
		}

		setLoadingSignOut(false);
	};

	const initUser = async () => {
		try {
			// Fetch user
			const user = await api.Users.getMe();
			const unwrappedUser = await unwrapResult(user);

			setUserInState(unwrappedUser);
		} catch (error) {
			try {
				const user = await api.Users.addUser();
				setUserInState(user);
			} catch (error) {
				console.error('Init user Error', { error });
				errorSnackbar('Error creating user');
			}
		}

		setLoadingII(false);
		setLoadingSession(false);
	};

	const setUserInState = (user?: User) => {
		setUser(user);
		api.Auth.setUser(user);
	};

	return (
		<>
			<AuthContext.Provider
				value={{
					setUser: setUserInState,
					signInII,
					signOut,
					user,
					loadingII,
					loadingSession,
					loadingSignOut
				}}
			>
				{children}
			</AuthContext.Provider>
		</>
	);
};
