export const DRAWER_WIDTH = 270;
export const DRAWER_CLOSED_WIDTH = 90;
export const DISABLE_MARGIN_MEDIA_QUERY = '(max-width: 1080px)';
export const SPINNER_ANIMATION = {
	animation: 'spin .5s linear infinite',
	'@keyframes spin': {
		'0%': {
			transform: 'rotate(0deg)'
		},
		'100%': {
			transform: 'rotate(360deg)'
		}
	}
};

export const OVERFLOW = {
	maxHeight: 'calc(100vh - 205px)',
	overflowY: 'auto'
};

export const OVERFLOW_FIELDS = {
	overflowY: 'auto',
	minHeight: 'calc(100vh - 205px)'
};
