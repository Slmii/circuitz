import { useEffect, useState } from 'react';

export const useDevice = () => {
	const [width, setWidth] = useState(992);

	const handleWindowSizeChange = () => {
		setWidth(window.innerWidth);
	};

	useEffect(() => {
		setWidth(window.innerWidth);

		window.addEventListener('resize', handleWindowSizeChange);

		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		};
	}, []);

	// Match breakpoints from MUI https://mui.com/material-ui/customization/breakpoints/
	return {
		isMobile: width <= 900,
		isDesktop: width >= 901,
		isSm: width <= 600,
		isSmDown: width <= 600,
		isMd: width >= 601 && width <= 900,
		isMdDown: width <= 900,
		isLg: width >= 901 && width <= 1200,
		isLgDown: width <= 1200,
		isXl: width >= 1201
	};
};
