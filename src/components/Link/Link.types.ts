export interface LinkProps {
	href: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	target?: string;
	noWrap?: boolean;
}
