import { Image as MuiImage } from 'mui-image';
import { ImageProps } from './Image.types';
import { useTheme } from '@mui/material/styles';

export const Image = ({ alt, src, height, fit = 'cover' }: ImageProps) => {
	const theme = useTheme();

	return (
		<MuiImage
			alt={alt}
			src={src}
			fit={fit}
			duration={0}
			easing="unset"
			height={height}
			bgColor="transparent"
			style={{
				borderRadius: `${theme.shape.borderRadius}px`
			}}
		/>
	);
};
