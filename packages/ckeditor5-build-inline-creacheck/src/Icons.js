import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {
	toWidget,
	viewToModelPositionOutsideModelElement,
} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';

import {
	addListToDropdown,
	createDropdown,
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import fontSizeIcon from '../../ckeditor5-font/theme/icons/font-size.svg';
import FreeSampleIcon from './icons/Freesample.svg';
import at_ihk from './icons/at_ihk.svg';
import pfeil_ihk from './icons/pfeil_ihk.svg';
import telefon_ihk from './icons/telefon_ihk.svg';

class Icon extends Plugin {
	static get requires() {
		return [IconEditing, IconUI];
	}
}

class IconCommand extends Command {
	execute({ value }) {
		const editor = this.editor;
		const selection = editor.model.document.selection;

		editor.model.change((writer) => {
			// Create a <i> elment with selection attributes
			const icon = writer.createElement('icon', {
				...Object.fromEntries(selection.getAttributes()),
				class: value,
			});

			// ... and insert it into the document.
			editor.model.insertContent(icon);

			// Put the selection after the inserted element.
			writer.setSelection(icon, 'after');
		});
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const isAllowed = model.schema.checkChild(
			selection.focus.parent,
			'icon'
		);

		this.isEnabled = isAllowed;
	}
}

class IconUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;
		const icons = editor.config.get('iconConfig');
		console.log('icons', icons);

		// The "icon" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add('icon', (locale) => {
			const dropdownView = createDropdown(locale);

			// Populate the list in the dropdown with items.
			addListToDropdown(dropdownView, getDropdownItemsDefinitions(icons));
			let icon = null;
			// const getIcons = (urls) => {
			// 	console.log('urls', urls);
			// 	_.forEach(urls, (url) => {
			// 		console.log('url', url);
			// 		fetch(url)
			// 			.then((res) => res.text())
			// 			.then((text) => {
			// 				console.log('text', text);
			// 				icon = text;
			// 			});
			// 	});
			// };
			// console.log('icon', icon);
			dropdownView.buttonView.set({
				// The t() function helps localize the editor. All strings enclosed in t() can be
				// translated and change when the language of the editor changes.
				label: '',
				tooltip: true,
				withText: false,
				icon: fontSizeIcon,
			});

			// Disable the icon button when the command is disabled.
			const command = editor.commands.get('icon');
			dropdownView.bind('isEnabled').to(command);

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo(dropdownView, 'execute', (evt) => {
				editor.execute('icon', {
					value: evt.source.commandParam,
				});
				editor.editing.view.focus();
			});

			return dropdownView;
		});
	}
}

function getDropdownItemsDefinitions({ icons }) {
	const itemDefinitions = new Collection();

	const testIcons = [
		{ name: 'pfeil_ihk', value: pfeil_ihk },
		{ name: 'at_ihk', value: at_ihk },
		{ name: 'telefon_ihk', value: telefon_ihk },
	];

	// testIcons.forEach((icon) => {
	// 	console.log('url', icon);
	// const removeExtension = icon.replace(/\.[^/.]+$/, '');
	// const iconName = removeExtension.split('/');
	// fetch(icon)
	// 	.then((res) => res.text())
	// 	.then((text) => {
	// 		console.log('text', text);
	// const definition = {
	// 	type: 'button',
	// 	model: new Model({
	// 		commandParam: testIcons.name,
	// 		label: '',
	// 		withText: false,
	// 		icon: testIcons.value,
	// 	}),
	// };
	// Add the item definition to the collection.
	// itemDefinitions.add(definition);
	// });
	// });

	// for (const icon of testIcons) {
	testIcons.forEach((icon, index) => {
		console.log('icon', Object.keys(icon)[1]);
		console.log('pfeil_ihk', pfeil_ihk);
		const definition = {
			type: 'button',
			model: new Model({
				commandParam: icon.name,
				label: '',
				withText: false,
				icon: pfeil_ihk,
			}),
		};
		itemDefinitions.add(definition);
	});

	// };

	// Add the item definition to the collection.
	// }

	return itemDefinitions;
}

class IconEditing extends Plugin {
	static get requires() {
		return [Widget];
	}
	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add('icon', new IconCommand(this.editor));

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(
				this.editor.model,
				(viewElement) => viewElement.hasClass('icon')
			)
		);
		const icons = this.editor.config.get('iconConfig.icons');
		console.log('icons', icons);
		// this.editor.config.define('iconConfig', {
		// 	icons: [
		// 		{ value: 'fab fa-500px', name: 'Icon 1' },
		// 		{ value: 'fab fa-accessible-icon', name: 'Icon 2' },
		// 		{ value: 'fab fa-accusoft', name: 'Icon 3' },
		// 		{ value: 'fab fa-acquisitions-incorporated', name: 'Icon 4' },
		// 	],
		// });
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register('icon', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The icon will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and it can be selected:
			isObject: true,

			// The inline widget can have the same attributes as text (for example linkHref, bold).
			allowAttributesOf: '$text',

			allowAttributes: ['class'],
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for('upcast').elementToElement({
			view: { name: 'i', key: 'class' },
			model: (viewElement, { writer: modelWriter }) => {
				// Extract the "name" from "{name}".
				const iconClass = viewElement.getAttribute('class');

				const iconTag = modelWriter.createElement('icon');
				modelWriter.setAttribute('class', iconClass, iconTag);
				return iconTag;
			},
		});

		conversion.for('editingDowncast').elementToElement({
			model: 'icon',
			view: (modelItem, { writer: viewWriter }) => {
				const widgetElement = createIconView(modelItem, viewWriter);

				// Enable widget handling on a icon element inside the editing view.
				return toWidget(widgetElement, viewWriter);
			},
		});

		conversion.for('dataDowncast').elementToElement({
			model: 'icon',
			view: (modelItem, { writer: viewWriter }) =>
				createIconView(modelItem, viewWriter),
		});

		// Helper method for both downcast converters.
		function createIconView(modelItem, viewWriter) {
			const iconClass = modelItem.getAttribute('class');
			const iconView = viewWriter.createContainerElement(
				'i',
				{
					class: iconClass,
				},
				{
					isAllowedInsideAttributeElement: true,
				}
			);

			// Insert the icon name (as a text).
			const innerText = viewWriter.createText(' ');
			viewWriter.insert(
				viewWriter.createPositionAt(iconView, 0),
				innerText
			);

			return iconView;
		}
	}
}
export default Icon;
