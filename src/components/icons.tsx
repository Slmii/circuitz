import { createSvgIcon } from '@mui/material/utils';

const icons = {
	add: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2ZM18 12.75h-5.25V18c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-5.25H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.25V6c0-.41.34-.75.75-.75s.75.34.75.75v5.25H18c.41 0 .75.34.75.75s-.34.75-.75.75Z"
				fill="currentColor"
			/>
		</svg>,
		'Add'
	),
	calendar: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M16.75 3.56V2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.5h-6.5V2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.56c-2.7.25-4.01 1.86-4.21 4.25-.02.29.22.53.5.53h16.92c.29 0 .53-.25.5-.53-.2-2.39-1.51-4-4.21-4.25ZM20 9.84H4c-.55 0-1 .45-1 1V17c0 3 1.5 5 5 5h8c3.5 0 5-2 5-5v-6.16c0-.55-.45-1-1-1ZM9.21 18.21c-.05.04-.1.09-.15.12-.06.04-.12.07-.18.09-.06.03-.12.05-.18.06-.07.01-.13.02-.2.02-.13 0-.26-.03-.38-.08-.13-.05-.23-.12-.33-.21-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71.1-.09.2-.16.33-.21.18-.08.38-.1.58-.06.06.01.12.03.18.06.06.02.12.05.18.09l.15.12c.18.19.29.45.29.71 0 .26-.11.52-.29.71Zm0-3.5c-.19.18-.45.29-.71.29-.26 0-.52-.11-.71-.29-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71.28-.28.72-.37 1.09-.21.13.05.24.12.33.21.18.19.29.45.29.71 0 .26-.11.52-.29.71Zm3.5 3.5c-.19.18-.45.29-.71.29-.26 0-.52-.11-.71-.29-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71.37-.37 1.05-.37 1.42 0 .18.19.29.45.29.71 0 .26-.11.52-.29.71Zm0-3.5-.15.12c-.06.04-.12.07-.18.09-.06.03-.12.05-.18.06-.07.01-.13.02-.2.02-.26 0-.52-.11-.71-.29-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71.09-.09.2-.16.33-.21.37-.16.81-.07 1.09.21.18.19.29.45.29.71 0 .26-.11.52-.29.71Zm3.5 3.5c-.19.18-.45.29-.71.29-.26 0-.52-.11-.71-.29-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71.37-.37 1.05-.37 1.42 0 .18.19.29.45.29.71 0 .26-.11.52-.29.71Zm0-3.5-.15.12c-.06.04-.12.07-.18.09-.06.03-.12.05-.18.06-.07.01-.14.02-.2.02-.26 0-.52-.11-.71-.29-.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71.1-.09.2-.16.33-.21.18-.08.38-.1.58-.06.06.01.12.03.18.06.06.02.12.05.18.09l.15.12c.18.19.29.45.29.71 0 .26-.11.52-.29.71Z"
				fill="currentColor"
			/>
		</svg>,
		'Calendar'
	),
	close: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm3.36 12.3c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2.3-2.3-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z"
				fill="currentColor"
			/>
		</svg>,
		'Close'
	),
	search: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21s9.5-4.26 9.5-9.5S16.74 2 11.5 2Zm0 11.75h-3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75Zm3-3h-6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75ZM21.3 21.999c-.18 0-.36-.07-.49-.2l-1.86-1.86a.706.706 0 0 1 0-.99c.27-.27.71-.27.99 0l1.86 1.86c.27.27.27.71 0 .99-.14.13-.32.2-.5.2Z"
				fill="currentColor"
			/>
		</svg>,
		'Search'
	),
	sun: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM12 22.96c-.55 0-1-.41-1-.96v-.08c0-.55.45-1 1-1s1 .45 1 1-.45 1.04-1 1.04Zm7.14-2.82c-.26 0-.51-.1-.71-.29l-.13-.13a.996.996 0 1 1 1.41-1.41l.13.13a.996.996 0 0 1-.7 1.7Zm-14.28 0c-.26 0-.51-.1-.71-.29a.996.996 0 0 1 0-1.41l.13-.13a.996.996 0 1 1 1.41 1.41l-.13.13c-.19.19-.45.29-.7.29ZM22 13h-.08c-.55 0-1-.45-1-1s.45-1 1-1 1.04.45 1.04 1-.41 1-.96 1ZM2.08 13H2c-.55 0-1-.45-1-1s.45-1 1-1 1.04.45 1.04 1-.41 1-.96 1Zm16.93-7.01c-.26 0-.51-.1-.71-.29a.996.996 0 0 1 0-1.41l.13-.13a.996.996 0 1 1 1.41 1.41l-.13.13c-.19.19-.44.29-.7.29Zm-14.02 0c-.26 0-.51-.1-.71-.29l-.13-.14a.996.996 0 1 1 1.41-1.41l.13.13c.39.39.39 1.02 0 1.41-.19.2-.45.3-.7.3ZM12 3.04c-.55 0-1-.41-1-.96V2c0-.55.45-1 1-1s1 .45 1 1-.45 1.04-1 1.04Z"
				fill="currentColor"
			/>
		</svg>,
		'Sun'
	),
	moon: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M21.529 15.93c-.16-.27-.61-.69-1.73-.49-.62.11-1.25.16-1.88.13a8.41 8.41 0 0 1-5.91-2.82c-1.3-1.45-2.1-3.34-2.11-5.38 0-1.14.22-2.24.67-3.28.44-1.01.13-1.54-.09-1.76-.23-.23-.77-.55-1.83-.11-4.09 1.72-6.62 5.82-6.32 10.21.3 4.13 3.2 7.66 7.04 8.99a10 10 0 0 0 2.89.55c.16.01.32.02.48.02 3.35 0 6.49-1.58 8.47-4.27.67-.93.49-1.52.32-1.79Z"
				fill="currentColor"
			/>
		</svg>,
		'Moon'
	),
	message: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M15.59 12.4v4.07c0 .36-.04.7-.13 1.01-.37 1.47-1.59 2.39-3.27 2.39H9.47l-3.02 2.01a.671.671 0 0 1-1.05-.56v-1.45c-1.02 0-1.87-.34-2.46-.93-.6-.6-.94-1.45-.94-2.47V12.4c0-1.9 1.18-3.21 3-3.38.13-.01.26-.02.4-.02h6.79c2.04 0 3.4 1.36 3.4 3.4Z"
				fill="currentColor"
			/>
			<path
				d="M17.75 15.6c1.27 0 2.34-.42 3.08-1.17.75-.74 1.17-1.81 1.17-3.08v-5.1C22 3.9 20.1 2 17.75 2h-8.5C6.9 2 5 3.9 5 6.25V7c0 .28.22.5.5.5h6.69c2.71 0 4.9 2.19 4.9 4.9v2.7c0 .28.22.5.5.5h.16Z"
				fill="currentColor"
			/>
		</svg>,
		'Message'
	),
	circuit: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M20.17 17.57c-.53.49-1.14.86-1.8 1.11-.66.25-1.37-.23-1.37-.94v-1.32a3.53 3.53 0 0 0-3.53-3.53h-2.94A3.53 3.53 0 0 0 7 16.42V18c0 .55-.45 1-1 1h-.45C3.1 18.63 2 16.64 2 14.86c0-1.68.98-3.54 3.11-4.06-.59-2.33-.09-4.52 1.43-6.11 1.73-1.81 4.49-2.53 6.87-1.79 2.19.67 3.73 2.47 4.28 4.97 1.91.43 3.44 1.87 4.05 3.87.66 2.17.06 4.4-1.57 5.83Z"
				fill="currentColor"
			/>
			<path
				d="M13.47 14.39h-2.94c-1.27 0-2.03.76-2.03 2.03v2.94c0 1.27.76 2.03 2.03 2.03h2.94c1.27 0 2.03-.76 2.03-2.03v-2.94c0-1.27-.76-2.03-2.03-2.03Zm.2 3.66L12 19.95l-.2.23c-.27.31-.5.23-.5-.19v-1.78h-.76c-.35 0-.44-.21-.21-.47l1.67-1.9.2-.23c.27-.31.5-.23.5.19v1.78h.76c.35-.01.44.21.21.47Z"
				fill="currentColor"
			/>
		</svg>,
		'Circuit'
	),
	wallet: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M21.45 13.64v1a.5.5 0 0 1-.49.5H19.5c-.53 0-1.01-.39-1.05-.91-.03-.31.09-.6.29-.8a.95.95 0 0 1 .7-.29h1.51c.29.01.5.23.5.5Z"
				fill="currentColor"
			/>
			<path
				d="M17.99 12.69c-.5.49-.74 1.22-.54 1.98.26.93 1.17 1.52 2.13 1.52h.87c.55 0 1 .45 1 1v.19c0 2.07-1.69 3.76-3.76 3.76H6.21c-2.07 0-3.76-1.69-3.76-3.76v-6.73c0-1.23.59-2.32 1.5-3 .63-.48 1.41-.76 2.26-.76h11.48c2.07 0 3.76 1.69 3.76 3.76v.44c0 .55-.45 1-1 1h-1.02c-.56 0-1.07.22-1.44.6ZM16.2 4.82c.27.27.04.69-.34.69L8.18 5.5c-.44 0-.67-.54-.35-.85l1.62-1.63a3.525 3.525 0 0 1 4.96 0l1.75 1.77c.01.01.03.02.04.03Z"
				fill="currentColor"
			/>
		</svg>,
		'Wallet'
	),
	menu: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2ZM17 17.25H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75Zm0-4.5H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75Zm0-4.5H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h10c.41 0 .75.34.75.75s-.34.75-.75.75Z"
				fill="currentColor"
			/>
		</svg>,
		'Menu'
	),
	signout: createSvgIcon(
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
			<path
				fill="currentColor"
				d="M16.8 2h-2.6C11 2 9 4 9 7.2v4.05h6.25c.41 0 .75.34.75.75s-.34.75-.75.75H9v4.05C9 20 11 22 14.2 22h2.59c3.2 0 5.2-2 5.2-5.2V7.2C22 4 20 2 16.8 2z"
			/>
			<path
				fill="currentColor"
				d="M4.561 11.25l2.07-2.07c.15-.15.22-.34.22-.53s-.07-.39-.22-.53a.754.754 0 00-1.06 0l-3.35 3.35c-.29.29-.29.77 0 1.06l3.35 3.35c.29.29.77.29 1.06 0 .29-.29.29-.77 0-1.06l-2.07-2.07h4.44v-1.5h-4.44z"
			/>
		</svg>,
		'Sign Out'
	)
};

export type Icons = keyof typeof icons;
export { icons };
