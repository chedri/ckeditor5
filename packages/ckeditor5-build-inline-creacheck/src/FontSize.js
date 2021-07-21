import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class FontSize extends Plugin {
	init() {
		const editor = this.editor;
		this.allowAttributeCcFontSizeInList(editor);
		this.customFontSizeDropDown(editor);
	}

	setClass(editor, addClass, item) {
		editor.editing.view.change((writer) => {
			writer.setAttribute('class', `text-${addClass}`, item);
			writer.setAttribute('ccfontsize', `text-${addClass}`, item);
		});
		editor.model.change(modelWriter => {
			modelWriter.setAttribute('listFontsize', `text-${addClass}`, editor.model.document.selection.getFirstPosition().parent);
		});
	}

	customFontSizeDropDown(editor) {
		editor.ui.componentFactory.add('fontSizeDropdown', () => {
			const editor = this.editor;

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontSize');
			dropdownView.on('execute', (evt) => {
				const commandParam =
					evt.source.commandParam === undefined
						? 'default'
						: evt.source.commandParam;
				const listItem =
					editor.editing.view.document.selection.focus.parent;
				if (listItem.name == 'li') {
					this.setClass(editor, commandParam, listItem);
				} else {
					const listItem =
						editor.editing.view.document.selection.focus.parent
							.parent;
					if (listItem.name === 'li')
						this.setClass(editor, commandParam, listItem);
				}
			});
			return dropdownView;
		});
	}

	allowAttributeCcFontSizeInList(editor) {
		editor.model.schema.extend('listItem', { allowAttributes: 'listFontsize' });

		editor.conversion.for('downcast').add(dispatcher => {
			dispatcher.on('attribute', (evt, data, conversionApi) => {

				if (data.item.name != 'listItem') {
					return;
				}

				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement(
					data.item
				);

				if( data.attributeKey == 'listFontsize' ) {
					viewWriter.setAttribute(
						'ccfontsize',
						data.attributeNewValue,
						viewElement
					);
					viewWriter.setAttribute(
						'class',
						data.attributeNewValue,
						viewElement
					);
				}
			});
		});

		editor.conversion.for('upcast').attributeToAttribute({
			model: {
				name: 'listItem',
				key: 'listFontsize',
				value: viewElement => {
						return viewElement.getAttribute( 'ccfontsize' );
					}
			},
			view: {
				name: 'li',
				key: 'ccfontsize',
			},
			converterPriority: 'lowest'
		});
	}
}
export default FontSize;
