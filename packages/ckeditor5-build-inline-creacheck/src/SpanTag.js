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
			const clonedElement = writer.cloneElement(element);
			writer.insert(clonedElement, root);
			// const newElement = writer.insertElement(
			// 	element.name,
			// 	element,
			// 	'after'
			// );
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
				const classToAdd =
					editor.commands.get('fontSize').value === undefined
						? 'text-default'
						: `text-${editor.commands.get('fontSize').value}`;
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
