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
							classToAdd === undefined
								? 'text-default'
								: classToAdd,
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
					editor.editing.view.change((writer) => {
						writer.setAttribute(
							'class',
							`text-${commandParam}`,
							listItem
						);
					});
				} else {
					const listItem =
						editor.editing.view.document.selection.focus.parent
							.parent;
					editor.editing.view.change((writer) => {
						writer.setAttribute(
							'class',
							`text-${commandParam}`,
							listItem
						);
					});
				}
			});
			return dropdownView;
		});
	}
}
export default FontSize;
