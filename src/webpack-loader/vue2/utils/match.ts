import SparkMD5 from 'spark-md5';

const chineseAttrRegex = /\b[\w-]+\s*=["']([^"']*[\u4e00-\u9fa5]+[^"']*)["']/g;
const chineseTextNodeRegex = />([^<]*[\u4e00-\u9fa5]+[^<]*)</g;
const chineseArgumentsTextNodeRegex = /\(('|")?[\u4e00-\u9fa5]+('|")?\)/g;
const chineseDataTextNodeRegex = /:\s?('|")?[\u4e00-\u9fa5]+('|")?/g;
const chineseVariableDef = /(let|const|var)\s+\w+\s*=\s*('|")?[\u4e00-\u9fa5]+('|")?/g;

export const match_attr_handler = (message: Record<string, string>, content: string) => {
	const matches = content.match(chineseAttrRegex);
	matches?.forEach((match) => {
		const attr = match.split('=')[0];
		let value = match.split('=')[1];
		value = value.replaceAll(/"|'/g, '');
		const translationKey = SparkMD5.hash(value);
		Reflect.set(message, translationKey, value);
		content = content.replaceAll(new RegExp(match, 'g'), `:${attr}="$t('${translationKey}')"`);
	});
	return content;
};

export const match_text_node_handler = (
	message: Record<string, string>,
	content: string,
	callback: (matches: Array<string>) => Array<string>
) => {
	const matches = content.match(chineseTextNodeRegex);
	callback(matches ?? [])?.forEach((match) => {
		const originMatch = match;
		match = match.replaceAll(/>|</g, '');
		const translationKey = SparkMD5.hash(match);
		Reflect.set(message, translationKey, match);
		content = content.replaceAll(new RegExp(originMatch, 'g'), `>{{$t('${translationKey}')}}<`);
	});
	return content;
};

export const match_arguments_handler = (
	message: Record<string, string>,
	content: string,
	callback: (translationKey: string) => string
) => {
	const matches = content.match(chineseArgumentsTextNodeRegex);
	matches?.forEach((match) => {
		const originMatch = match;
		match = match.replaceAll(/"|'|\(|\)/g, '');
		const translationKey = SparkMD5.hash(match);
		Reflect.set(message, translationKey, match);
		content = content.replaceAll(new RegExp(originMatch, 'g'), callback(translationKey));
	});
	return content;
};

export const match_data_handler = (message: Record<string, string>, content: string) => {
	const matches = content.match(chineseDataTextNodeRegex);
	matches?.forEach((match) => {
		const originMatch = match;
		match = match.replaceAll(/:|\s|'|"/g, '');
		const translationKey = SparkMD5.hash(match);
		Reflect.set(message, translationKey, match);
		content = content.replaceAll(
			new RegExp(originMatch, 'g'),
			`: this.$i18n.messages[this.$i18n.locale]['${translationKey}']`
		);
	});
	return content;
};

export const match_variable_def_handler = (message: Record<string, string>, content: string) => {
	const matches = content.match(chineseVariableDef);
	matches?.forEach((match) => {
		const originMatch = match;
		const def = match.split('=')[0];
		let assign = match.split('=')[1];
		assign = assign.replaceAll(/=|\s|'|"/g, '');
		const translationKey = SparkMD5.hash(assign);
		Reflect.set(message, translationKey, assign);
		content = content.replaceAll(
			new RegExp(originMatch, 'g'),
			`${def} = this.$i18n.messages[this.$i18n.locale]['${translationKey}']`
		);
	});
	return content;
};
