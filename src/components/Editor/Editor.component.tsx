import { FormHelperText, Stack, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import AceEditor from 'react-ace';
import { config } from 'ace-builds';

config.setModuleUrl('basePath', '/node_modules/ace-builds/src-noconflict');
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/theme-cloud9_night';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/ext-language_tools';
import { Controller } from 'react-hook-form';

export const StandaloneEditor = ({
	id,
	value,
	mode,
	isReadOnly,
	height = 500,
	errorMessage,
	ignoreInvalidJSON,
	onChange
}: {
	id: string;
	value: string;
	mode: string;
	isReadOnly?: boolean;
	height?: number | string;
	errorMessage?: string;
	ignoreInvalidJSON?: boolean;
	onChange?: (value: string) => void;
}) => {
	const [parserError, setParserError] = useState<string | null>(null);
	const theme = useTheme();

	const aceEditorTheme = useMemo(() => {
		return theme.palette.mode === 'dark' ? 'cloud9_night' : 'cloud9_day';
	}, [theme.palette.mode]);

	return (
		<Stack direction="column" spacing={0.25} height={typeof height === 'number' ? `${height}px` : height}>
			<AceEditor
				mode={mode}
				theme={aceEditorTheme}
				name={id}
				editorProps={{ $blockScrolling: true }}
				height="100%"
				width="100%"
				value={value}
				readOnly={isReadOnly}
				onChange={onChange}
				onBlur={() => {
					if (ignoreInvalidJSON) {
						setParserError(null);
						return;
					}

					try {
						JSON.parse(value);
						setParserError(null);
					} catch (error) {
						setParserError((error as Error).message);
					}
				}}
				wrapEnabled
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true
				}}
				style={{
					border: `1px solid ${!!errorMessage || !!parserError ? theme.palette.error.main : theme.palette.divider}`,
					borderRadius: theme.shape.borderRadius
				}}
			/>
			{!!errorMessage || !!parserError ? <FormHelperText error>{errorMessage ?? parserError}</FormHelperText> : null}
		</Stack>
	);
};

export const Editor = (props: {
	name: string;
	required?: boolean;
	mode: string;
	isReadOnly?: boolean;
	height?: number | string;
	ignoreInvalidJSON?: boolean;
	onChange?: (value: string) => void;
}) => {
	return (
		<Controller
			name={props.name}
			rules={{
				required: props.required
			}}
			render={({ field, fieldState }) => (
				<StandaloneEditor
					{...props}
					{...field}
					id={props.name}
					errorMessage={fieldState.error?.message}
					onChange={value => {
						field.onChange(value);
						props.onChange?.(value);
					}}
				/>
			)}
		/>
	);
};
