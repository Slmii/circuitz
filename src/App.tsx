import { Layout } from 'components/Layout';
import { RequireAuthentication } from 'components/RequireAuthentication';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, CircuitsPage, CircuitPage } from './pages';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<HomePage />} />
					<Route element={<RequireAuthentication />}>
						<Route path="/circuits" element={<CircuitsPage />} />
						<Route path="/circuits/:circuitId" element={<CircuitPage />} />
						<Route path="/circuits/:circuitId/nodes/:nodeId/:pinType/:action" element={<CircuitPage />} />
						<Route path="/circuits/:circuitId/nodes/:nodeId/:nodeType" element={<CircuitPage />} />
						<Route path="/circuits/:circuitId/nodes/:nodeType" element={<CircuitPage />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
