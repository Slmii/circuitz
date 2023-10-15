import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import AceEditor from 'react-ace';
import { config } from 'ace-builds';

config.setModuleUrl('basePath', '/node_modules/ace-builds/src-noconflict');
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/theme-cloud9_night';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/ext-language_tools';

export const Editor = ({
	value,
	mode,
	isReadOnly,
	height = 500,
	onChange
}: {
	value: string;
	mode: string;
	isReadOnly?: boolean;
	height?: number | string;
	onChange?: (value: string) => void;
}) => {
	const theme = useTheme();

	const aceEditorTheme = useMemo(() => {
		return theme.palette.mode === 'dark' ? 'cloud9_night' : 'cloud9_day';
	}, [theme.palette.mode]);

	return (
		<AceEditor
			mode={mode}
			theme={aceEditorTheme}
			name="UNIQUE_ID_OF_DIV"
			editorProps={{ $blockScrolling: true }}
			height={typeof height === 'number' ? `${height}px` : height}
			width="100%"
			value={value}
			readOnly={isReadOnly}
			onChange={onChange}
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true
			}}
		/>
	);
};
