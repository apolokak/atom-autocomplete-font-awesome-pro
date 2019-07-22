'use babel';

const versionHelper = require('./version-helper');

class IconsProvider {
	constructor() {
		this.selector = '*';
		this.suggestionPriority = 2;
	}

	getSuggestions({ prefix }) {
		if (prefix.startsWith('fa-')) {
			return this.findMatchingSuggestions(prefix);
		}
	}

	findMatchingSuggestions(replacementPrefix) {
		let versionInfo = versionHelper.getCurrentVersionInfo();

		let prefixBase = replacementPrefix.replace(/^fa-/, '');
		let matchingIcons = versionInfo.icons.filter((icon) => {
			return icon.id.startsWith(prefixBase);
		});
		let prefixedMatchingIcons = this.explodeIconPrefixes(matchingIcons);

		let createSuggestion = this.createSuggestion.bind(this, replacementPrefix, prefixBase, versionInfo);
		return prefixedMatchingIcons.map(createSuggestion);
	}

	explodeIconPrefixes(icons) {
		let explodedIcons = [];
		icons.forEach((icon) => {
			icon.styles.forEach((style) => {
				explodedIcons.push({
					id: icon.id,
					style: style,
					label: icon.id,
					unicode: icon.unicode
				});
			});
		});
		return explodedIcons;
	}

	createSuggestion(replacementPrefix, prefixBase, versionInfo, icon) {
		let iconPrefix = versionInfo.stylePrefixMap[icon.style];
		return {
			className: 'aafa ' + versionInfo.className,
			type: 'value',
			iconHTML: '<i class="' + iconPrefix + ' fa-' + icon.id + '"></i>',
			leftLabel: iconPrefix,
			displayText: 'fa-' + icon.id,
			text: 'fa-' + icon.id,
			rightLabel: '\\' + icon.unicode,
			description: icon.label + (icon.style ? ' (' + icon.style + ')' : '') + ' • ' + versionInfo.label,
			replacementPrefix: replacementPrefix // fixes double prefix bug
		};
	}

	onDidInsertSuggestion({ editor, triggerPosition, suggestion }) {
	// check for potential style prefixes to switch out (only happens if there is more than 1)
	let stylePrefixes = Object.values(versionHelper.getCurrentVersionInfo().stylePrefixMap);
	if (stylePrefixes.length === 1) { return; }
	// look for style prefix preceeding the inserted suggestion
	let stylePrefixRegex = new RegExp('\\b(' + stylePrefixes.join('|') + ')\\b[ .\\w\\d-]+\\bfa-[\\w\\d]*$', 'i');
	let leftText = editor.getTextInBufferRange([[triggerPosition.row, 0], triggerPosition]);
	let match = stylePrefixRegex.exec(leftText);

	if (match && match.length === 2) {
	// found it, replace existing style prefix with the one this suggestion uses
	 let prefixColumnStart = match.index;
	 let prefixColumnEnd = prefixColumnStart + match[1].length;
	 editor.setTextInBufferRange(
	 [[triggerPosition.row, prefixColumnStart], [triggerPosition.row, prefixColumnEnd]],
	 suggestion.leftLabel // the new style prefix
	 );
      }
    }
}
export default new IconsProvider();
