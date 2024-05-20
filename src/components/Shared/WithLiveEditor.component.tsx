import { Stack, StackProps } from '@mui/material';
import { Editor, StandaloneEditor } from 'components/Editor';
import { getHandlebars, parseJson } from 'lib/utils';
import { ComponentProps } from 'react';

type EditorProps = ComponentProps<typeof Editor>;

export const WithLiveEditor = ({
	isLivePreview,
	input,
	context,
	editorProps,
	liveEditorProps,
	stackProps
}: {
	isLivePreview: boolean;
	input: string;
	context: string;
} & { editorProps: EditorProps; liveEditorProps: EditorProps; stackProps?: StackProps }) => {
	return (
		<Stack
			direction="row"
			spacing={1}
			alignItems="center"
			sx={{
				'& *': {
					width: '100%'
				}
			}}
			{...stackProps}
		>
			<Editor {...editorProps} />
			{isLivePreview && (
				<StandaloneEditor
					{...liveEditorProps}
					id={liveEditorProps.name}
					value={getHandlebars(input, parseJson(context))}
					isReadOnly
				/>
			)}
		</Stack>
	);
};
