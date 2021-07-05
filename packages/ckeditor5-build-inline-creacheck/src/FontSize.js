import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class FontSize extends Plugin {
	init() {
		const editor = this.editor;
		this.addClassToListElement(editor);
		this.customFontSizeDropDown(editor);
		this.handleEnterKeyPress();
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
					for (const child of data.item.getChildren()) {
						let liClass = child.hasAttribute('fontSize')
							? `text-${child.getAttribute('fontSize')}`
							: 'text-default';
						// console.log('liClass', liClass);
						// console.log('data', data);
						viewWriter.addClass(
							liClass,
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
				// const listItem = data.view.selection.focus.parent.parent.parent;
				// console.log('classToAdd', classToAdd);
				// console.log('listItem', listItem);
				// console.log('editor', editor);
				// console.log('data', data);
				// console.log('evt', evt);
				// writer.setAttribute('class', `text-${value}`, listItem);
				// console.log(
				// 	'nextSibling',
				// 	evt.source.selection.focus.parent.parent.nextSibling
				// );
				// console.log(
				// 	'previousSibling',
				// 	evt.source.selection.focus.parent.parent.addClass()
				// );
				if (listItem.name == 'li') {
					// const listItem =
					// 	evt._currentTarget.selection.focus.parent.parent.parent;
					// editor.editing.view.document.selection.focus.parent;
					editor.editing.view.change((writer) => {
						console.log('classToAdd', classToAdd);
						// console.log('data', data.view.getSelection());
						// console.log(
						// 	'data 123',
						// 	data.view.selection.getSelection()
						// );
						// console.log(
						// 	'data 1234',
						// 	data.view.selection.nextSibling()
						// );

						// console.log(
						// 	'data 12345',
						// 	data.view.selection.previousSibling()
						// );
						const listItem =
							data.view.selection.focus.parent.parent;
						// console.log('list 123', listItem);

						writer.setAttribute('class', classToAdd, listItem);
					});
					// this.addClassToListElement(editor);
					// editor.editing.view.change((writer) => {
					// 	console.log('classToAdd view', classToAdd);
					// 	console.log('listItem view', listItem);
					// 	console.log('writer view', writer);
					// 	writer.createElement('paragraph');
					// 	// writer.setAttribute('class', classToAdd, listItem);
					// 	// writer.insertElement(
					// 	// 	'listItem',
					// 	// 	{ class: classToAdd },
					// 	// 	0
					// 	// );
					// 	// writer.cloneElement(listItem, true);
					// 	// writer.cloneElement(listItem, false);
					// });

					// editor.editing.model.change((writer) => {
					// 	console.log('classToAdd model', classToAdd);
					// 	console.log('listItem model', listItem);
					// 	console.log('writer model', writer);
					// 	writer.createElement('paragraph');
					// 	// writer.setAttribute('class', classToAdd, listItem);
					// 	// writer.insertElement(
					// 	// 	'listItem',
					// 	// 	{ class: classToAdd },
					// 	// 	0
					// 	// );
					// 	// writer.cloneElement(listItem, true);
					// 	// writer.cloneElement(listItem, false);
					// });
					// editor.conversion.for('downcast').add((dispatcher) => {
					// 	dispatcher.on(
					// 		'attribute:class:listItem',
					// 		(evt, data, conversionApi) => {
					// 			const viewWriter = conversionApi.writer;
					// 			viewWriter.createElement('listItem', {
					// 				class: classToAdd,
					// 			});
					// 		}
					// 	);
					// });
				}
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
