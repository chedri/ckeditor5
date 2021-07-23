import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class SpanTag extends Plugin {
	init() {
		const editor = this.editor;
		this._defineSchema(editor);
		this._defineConverters(editor);
		this.updateElementsOnKeyUp(editor);
		this.handleEnterKeyPress();
	}

	createElement(editor, element) {
		editor.model.change((writer) => {
			const root = editor.model.document.getRoot();
			const newElement = writer.createElement(element.name, {
				invert: true,
			});
			writer.insert(newElement, element, 'after');
			writer.setSelection(newElement, 'on');
		});
	}

	handleEnterKeyPress() {
		const editor = this.editor;
		editor.editing.view.document.on('enter', (evt, data) => {
			data.preventDefault();
			evt.stop();
			if (editor.model.document.selection !== null) {
				const elementToCreate =
					editor.model.document.selection.getFirstPosition().parent;
				this.createElement(editor, elementToCreate);
			}
		});
	}

	updateElementsOnKeyUp(editor) {
		editor.editing.view.document.on('keyup', (evt, data) => {
			const range = editor.model.createRangeIn(
				editor.model.document.getRoot()
			);
			for (const value of range.getWalker({ ignoreElementEnd: true })) {
				if (value.item.is('element')) {
					for (const child of value.item.getChildren()) {
						if (
							child.is('text') &&
							child.parent.name !== 'listItem'
						) {
							editor.model.change((writer) => {
								writer.setAttribute('invert', true, child);
							});
						}
					}
				}
			}
		});
	}

	_defineSchema(editor) {
		editor.model.schema.extend('$text', {
			allowAttributes: 'invert',
		});
	}
	_defineConverters(editor) {
		editor.conversion.for('downcast').attributeToElement({
			model: 'invert',
			view: (attributeValue, { writer }) => {
				let classToAdd = null;
				if (editor.editing.view.document.selection.focus) {
					if (
						editor.editing.view.document.selection.focus.parent
							.previousSibling
					) {
						if (
							editor.editing.view.document.selection.focus.parent.previousSibling.getChild(
								0
							)
						) {
							console.log('hini');
							classToAdd =
								editor.editing.view.document.selection.focus.parent.previousSibling
									.getChild(0)
									.getClassNames();
						}
					}
				} else {
					classToAdd =
						editor.commands.get('fontSize').value === undefined
							? 'text-default'
							: `text-${editor.commands.get('fontSize').value}`;
				}
				const spanTag = writer.createAttributeElement(
					'span',
					{
						class: classToAdd,
					},
					{ priority: 7 }
				);
				return spanTag;
			},
		});
		editor.conversion.for('upcast').attributeToAttribute({
			view: {
				name: 'span',
				key: 'class',
			},
			model: 'invert',
		});
	}
}

export default SpanTag;
