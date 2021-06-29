import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class FontSize extends Plugin {
	init() {
		const editor = this.editor;
		this.addClassToListElement(editor);
		this.customFontSizeDropDown(editor);
	}
	addClassToListElement(editor) {
		// Both the data and the editing pipelines are affected by this conversion.
		editor.conversion.for('downcast').add((dispatcher) => {
			// Headings are represented in the model as a "heading1" element.
			// Use the "low" listener priority to apply the changes after the headings feature.
			dispatcher.on(
				'insert:listItem',
				(evt, data, conversionApi) => {
					const viewWriter = conversionApi.writer;
					viewWriter.addClass(
						'text-default',
						conversionApi.mapper.toViewElement(data.item)
					);
				},
				{ priority: 'low' }
			);
		});
		editor.conversion.for('editingDowncast').add((dispatcher) => {
			// Headings are represented in the model as a "heading1" element.
			// Use the "low" listener priority to apply the changes after the headings feature.
			dispatcher.on(
				'insert:listItem',
				(evt, data, conversionApi) => {
					const viewWriter = conversionApi.writer;
					viewWriter.addClass(
						'text-default',
						conversionApi.mapper.toViewElement(data.item)
					);
				},
				{ priority: 'low' }
			);
		});
	}

	customFontSizeDropDown(editor) {
		// const view = editor.ui.view;
		const { t } = editor.locale;
		editor.ui.componentFactory.add('fontSizeDropdown', () => {
			const editor = this.editor;

			const command = editor.commands.get('fontSize');

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontSize');

			dropdownView.buttonView
				.bind('label')
				.to(command, 'value', (value) => {
					if (editor.editing.view.document.selection.focus) {
						const listItem =
							editor.editing.view.document.selection.focus.parent;
						if (listItem.name == 'li') {
							editor.editing.view.change((writer) => {
								const classToAdd =
									value !== undefined
										? `text-${value}`
										: `text-default`;
								writer.setAttribute(
									'class',
									classToAdd,
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
