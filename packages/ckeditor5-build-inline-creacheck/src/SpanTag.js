import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class SpanTag extends Plugin {
	init() {
		const editor = this.editor;
		this._defineSchema(editor);
		this._defineConverters(editor);
		this.updateElementsOnKeyUp(editor);
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
								writer.setAttribute('placeholder', true, child);
							});
						}
					}
				}
			}
		});
	}

	_defineSchema(editor) {
		editor.model.schema.extend('$text', {
			allowAttributes: 'placeholder',
		});
	}
	_defineConverters(editor) {
		editor.conversion.for('downcast').attributeToElement({
			model: 'placeholder',
			view: (attributeValue, { writer }) => {
				console.log('attributeValue1', attributeValue);
				const classToAdd =
					typeof attributeValue === 'string'
						? attributeValue
						: 'text-default';
				const spanTag = writer.createAttributeElement(
					'span',
					{
						class: classToAdd,
					},
					{ priority: 5 }
				);

				return spanTag;
			},
			converterPriority: 'low',
		});
		editor.conversion.for('editingDowncast').attributeToElement({
			model: 'placeholder',
			view: (attributeValue, { writer }) => {
				console.log('attributeValue', attributeValue);
				const classToAdd =
					typeof attributeValue === 'string'
						? attributeValue
						: 'text-default';
				const spanTag = writer.createAttributeElement(
					'span',
					{
						class: classToAdd,
					},
					{ priority: 5 }
				);
				return spanTag;
			},
			converterPriority: 'low',
		});
		editor.conversion.for('upcast').attributeToAttribute({
			view: {
				name: 'span',
				key: 'class',
			},
			model: 'placeholder',
			converterPriority: 'low',
		});
	}
}

export default SpanTag;
