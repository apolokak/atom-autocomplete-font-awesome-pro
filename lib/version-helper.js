'use babel';

const majorVersions = {
	'4': {
		icons: require('./data/v4/icons'),
		modifiers: require('./data/v4/modifiers'),
		snippets: require('./data/v4/snippets'),
		label: 'v4.7.0',
		className: 'aafa-v4',
		stylePrefixMap: {
			'': 'fa'
		}
	},
	'5': {
		icons: require('./data/v5/icons'),
  	modifiers: require('./data/v5/modifiers'),
		snippets: require('./data/v5/snippets'),
		label: 'v5.9.0',
		className: 'aafa-v5',
		stylePrefixMap: {
			'default': 'fa',
			'solid': 'fas',
			'regular': 'far',
			'brands': 'fab',
			'light': 'fal'
		}
	}
};

class VersionHelper {
    getCurrentVersionInfo() {
        let version = atom.config.get('autocomplete-font-awesome-pro.version');
		let majorVersion = version.split('.', 1)[0];
        return majorVersions[majorVersion];
    }
}
export default new VersionHelper();
