import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class FontSize extends Plugin {
	init() {
		const editor = this.editor;
		this.addClassToListElement(editor);
		this.customFontSizeDropDown(editor);
	}
	addClassToListElement(editor, fontSizeClass) {
		const fontClass = fontSizeClass
			? `text-${fontSizeClass}`
			: 'text-default';
		console.log('fontClass test 123', fontClass);
		// Both the data and the editing pipelines are affected by this conversion.
		editor.conversion.for('downcast').add((dispatcher) => {
			// Headings are represented in the model as a "heading1" element.
			// Use the "low" listener priority to apply the changes after the headings feature.
			dispatcher.on(
				'insert:listItem',
				(evt, data, conversionApi) => {
					console.log('data.item', data.item);
					const viewWriter = conversionApi.writer;
					viewWriter.addClass(
						fontClass,
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
					console.log('data.item editingDowncast', data.item);
					const viewWriter = conversionApi.writer;
					viewWriter.addClass(
						fontClass,
						conversionApi.mapper.toViewElement(data.item)
					);
				},
				{ priority: 'low' }
			);
		});
	}
	customFontSizeDropDown(editor) {
		// const view = editor.ui.view;
		editor.ui.componentFactory.add('fontSizeDropdown', () => {
			const editor = this.editor;

			const command = editor.commands.get('fontSize');

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontSize');

			// Show label on dropdown's button.
			// dropdownView.buttonView.set('withText', true);

			// Disable icon on the button.
			// dropdownView.buttonView.set('icon', true);

			// To hide the icon uncomment below.
			// dropdownView.buttonView.set( 'icon', false );

			// Bind dropdown's button label to fontSize value.
			dropdownView.buttonView
				.bind('label')
				.to(command, 'value', (value) => {
					console.log('value', value);
					// view.editable.extendTemplate({
					// 	attributes: {
					// 		class: 'foo',
					// 	},
					// });
					// view.change((writer) =>
					// 	writer.addClass(value, view.document.getRoot())
					// );
					this.addClassToListElement(editor, value);
					// If no value is set on the command show 'Default' text.
					// Use t() method to make that string translatable.
					return value ? value : '16'; // The Default size is '16'
				});

			return dropdownView;
		});
	}
}
export default FontSize;
