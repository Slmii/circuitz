import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetCircuits } from 'lib/hooks';
import { getUrlBreadcrumbs } from 'lib/utils/url';
import { Caption } from 'components/Typography';

export const Breadcrumbs = () => {
	const { data: circuits } = useGetCircuits();
	const { pathname } = useLocation();

	// Split param on `/` and filter out empty values
	const params = pathname.split('/').filter(Boolean);

	const breadcrumbs = useMemo(() => {
		// Remove first element from params array
		params.shift();

		const breadcrumbs = params.map(param => {
			const circuit = circuits?.find(circuit => circuit.id === Number(param));

			return {
				name: circuit?.name ?? '',
				id: circuit?.id ?? 0
			};
		});

		return breadcrumbs;
	}, [circuits, params]);

	const generateBreadcrumbPath = (circuitId: number) => {
		if (!circuits) {
			return '';
		}

		return getUrlBreadcrumbs(circuitId, circuits);
	};

	return (
		<MuiBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}>
			<MuiLink fontSize={12} component={Link} color="text.secondary" to="/circuits">
				Circuits
			</MuiLink>
			{breadcrumbs.map((breadcrumb, idx) => {
				if (breadcrumbs.length === idx + 1) {
					return (
						<Caption key={breadcrumb.id} color="text.primary">
							{breadcrumb.name}
						</Caption>
					);
				}

				return (
					<MuiLink key={breadcrumb.id} component={Link} color="inherit" to={generateBreadcrumbPath(breadcrumb.id)}>
						{breadcrumb.name}
					</MuiLink>
				);
			})}
		</MuiBreadcrumbs>
	);
};
