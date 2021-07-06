import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class FontSize extends Plugin {
	init() {
		const editor = this.editor;
		this.addClassToListElement(editor);
		this.customFontSizeDropDown(editor);
		this.handleEnterKeyPress();
	}
	addClassToListElement(editor, classToAdd) {
		// Both the data and the editing pipelines are affected by this conversion.
		editor.conversion.for('downcast').add((dispatcher) => {
			// Headings are represented in the model as a "heading1" element.
			// Use the "low" listener priority to apply the changes after the headings feature.
			dispatcher.on(
				'insert:listItem',
				(evt, data, conversionApi) => {
					const viewWriter = conversionApi.writer;
					const childCount = data.item.childCount;
					if (childCount > 0) {
						for (const child of data.item.getChildren()) {
							let liClass = child.hasAttribute('fontSize')
								? `text-${child.getAttribute('fontSize')}`
								: 'text-default';
							viewWriter.addClass(
								liClass,
								conversionApi.mapper.toViewElement(data.item)
							);
						}
					} else {
						viewWriter.setAttribute(
							'class',
							classToAdd,
							conversionApi.mapper.toViewElement(data.item)
						);
					}
				},
				{ priority: 'low' }
			);
		});
	}

	handleEnterKeyPress() {
		const editor = this.editor;
		editor.editing.view.document.on('enter', (evt, data) => {
			if (data.view.selection.focus.isAtEnd) {
				const classToAdd =
					data.view.selection.focus.parent.parent.getAttribute(
						'class'
					);
				this.addClassToListElement(editor, classToAdd);
			}
		});
	}

	customFontSizeDropDown(editor) {
		const { t } = editor.locale;
		editor.ui.componentFactory.add('fontSizeDropdown', () => {
			const editor = this.editor;

			const command = editor.commands.get('fontSize');

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontSize');

			dropdownView.buttonView
				.bind('label')
				.to(command, 'value', (value) => {
					if (
						editor.editing.view.document.selection.focus &&
						value !== undefined
					) {
						const listItem =
							editor.editing.view.document.selection.focus.parent;
						if (listItem.name == 'li') {
							editor.editing.view.change((writer) => {
								writer.setAttribute(
									'class',
									`text-${value}`,
									listItem
								);
							});
						}
					}
					// If no value is set on the command show 'Default' text.
					// Use t() method to make that string translatable.
					return value ? value : t('default');
				});

			return dropdownView;
		});
	}
}
export default FontSize;
