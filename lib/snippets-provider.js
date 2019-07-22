'use babel';

const versionHelper = require('./version-helper');

class SnippetsProvider {
	constructor() {
		this.selector = '.text.html';
		this.disableForSelector = '.meta.tag, .string.quoted';
		this.suggestionPriority = 2;
	}

	getSuggestions({ prefix }) {
		if (prefix.startsWith('fa')) {
			return this.findMatchingSuggestions(prefix);
		}
	}

	findMatchingSuggestions(replacementPrefix) {
		let versionInfo = versionHelper.getCurrentVersionInfo();

		let matchingSnippets = versionInfo.snippets.filter((snippet) => {
			return snippet.shortcode.startsWith(replacementPrefix);
		});

		return matchingSnippets.map(this.createSuggestion.bind(this, replacementPrefix, versionInfo));
	}

	createSuggestion(replacementPrefix, versionInfo, snippet) {
		return {
			className: 'aafa ' + versionInfo.className,
			type: 'snippet',
			iconHTML: '<i class="fab fa-font-awesome-alt"></i>',
			displayText: snippet.shortcode,
			snippet: snippet.body,
			rightLabel: snippet.label,
			description: snippet.description + ' • ' + versionInfo.label,
			replacementPrefix: replacementPrefix // fixes double prefix bug
		};
	}

	onDidInsertSuggestion({ editor }) {
		// trigger autocomplete again so user can immediately find icon
		setTimeout(() => {
			atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate');
		}, 0);
	}
}
export default new SnippetsProvider();
