import {writeFile} from 'fs/promises';
import compiler = require('vue-template-compiler');
import {
	match_arguments_handler,
	match_attr_handler,
	match_data_handler,
	match_text_node_handler,
	match_variable_def_handler,
} from '../utils/match';

export const options_api_i18n_handler = async (source: string, output: string) => {
	const vueFileContent = source;
	// 使用 parseComponent 提取 Vue 文件的各个部分
	const parsedComponent = compiler.parseComponent(vueFileContent);
	// 获取 <template> 部分
	const templateContent = parsedComponent.template ? parsedComponent.template.content : '';
	// 获取 <script> 部分
	const scriptContent = parsedComponent.script ? parsedComponent.script.content : '';
	const styleContent = vueFileContent.match(/<style[^>]*>([\s\S]*?)<\/style>/g)?.join('\n');
	// 检查是否成功提取到模板内容
	if (!templateContent) {
		// eslint-disable-next-line
		console.error('<template> generate error');
		process.exit(1);
	}
	if (!scriptContent) {
		// eslint-disable-next-line
		console.error('<script> generate error');
		process.exit(1);
	}
	let updatedTemplateContent = templateContent;
	let updatedScriptContent = scriptContent;
	updatedScriptContent = updatedScriptContent.replaceAll(/\/\*[\s\S]*?\*\//g, '');
	updatedScriptContent = updatedScriptContent.replaceAll(/\/\/.*$/gm, '');
	// 查找 AST 中的中文文本
	const zhJson = {};
	updatedTemplateContent = match_attr_handler(zhJson, updatedTemplateContent);
	updatedTemplateContent = match_text_node_handler(
		zhJson,
		updatedTemplateContent,
		(matches) => matches
	);
	updatedTemplateContent = match_arguments_handler(
		zhJson,
		updatedTemplateContent,
		(translationKey) => `$i18n.messages[$i18n.locale]['${translationKey}']`
	);

	updatedScriptContent = match_text_node_handler(zhJson, updatedScriptContent, (matches) =>
		matches.filter((match) => !/\w/.test(match))
	);
	updatedScriptContent = match_attr_handler(zhJson, updatedScriptContent);
	updatedScriptContent = match_arguments_handler(
		zhJson,
		updatedScriptContent,
		(translationKey) => `this.$i18n.messages[this.$i18n.locale]['${translationKey}']`
	);
	updatedScriptContent = match_data_handler(zhJson, updatedScriptContent);
	updatedScriptContent = match_variable_def_handler(zhJson, updatedScriptContent);

	await writeFile(output, JSON.stringify(zhJson, null, 2));
	const template = updatedTemplateContent ? `<template>${updatedTemplateContent}</template>\n` : '';
	const script = updatedScriptContent ? `<script>${updatedScriptContent}</script>\n` : '';
	const style = styleContent ? styleContent : '';
	return [template, script, style].join('\n');
};
