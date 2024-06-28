import type {LoaderContext} from 'webpack';
import {options_api_i18n_handler} from './strategy/options_api';

export interface AutoI18nLoaderOptions {
	output: string;
}
const AutoI18nLoader = async function (
	this: LoaderContext<AutoI18nLoaderOptions>,
	source: string
) {
	const {output} = this.getOptions();
	return await options_api_i18n_handler(source, output);
};
export default AutoI18nLoader;