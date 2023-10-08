import { Layout } from 'components/Layout';
import { RequireAuthentication } from 'components/RequireAuthentication';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, CircuitsPage } from './pages';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/dashboard" element={<RequireAuthentication>Dashboard</RequireAuthentication>} />
					<Route
						path="/circuits"
						element={
							<RequireAuthentication>
								<CircuitsPage />
							</RequireAuthentication>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
