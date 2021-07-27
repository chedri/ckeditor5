import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class SpanTag extends Plugin {
	init() {
		const editor = this.editor;
		this._defineSchema(editor);
		this._defineConverters(editor);
		this.handleEnterKeyPress();
	}

	createElement(editor, element) {
		const fontSize = element.getChild(0).getAttribute('fontSize');
		editor.model.change((writer) => {
			const newElement = writer.createElement(element.name);
			writer.insertText(' ', { invert: true, fontSize }, newElement);
			writer.insert(newElement, element, 'after');
			writer.setSelection(newElement, 0);
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

	_defineSchema(editor) {
		editor.model.schema.extend('$text', {
			allowAttributes: 'invert',
		});
	}
	_defineConverters(editor, fontSize) {
		editor.conversion.for('downcast').attributeToElement({
			model: 'invert',
			view: (attributeValue, { writer }) => {
				const spanTag = writer.createAttributeElement(
					'span',
					{},
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
