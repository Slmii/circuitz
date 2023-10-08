import MuiAvatar from '@mui/material/Avatar';
import { AvatarProps } from './Avatar.type';

export const Avatar = ({ src, size, alt }: AvatarProps) => {
	return <MuiAvatar alt={alt} src={src} sx={{ width: size, height: size }} />;
};
