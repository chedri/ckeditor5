import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class TableExtended extends Plugin {
	init() {
		const editor = this.editor;
		this.AddTargetToExternalLinks(editor);
	}

	AddTargetToExternalLinks(editor) {
		// editor.model.schema.extend('table', {
		// 	allowAttributes: 'class',
		// });
		// editor.model.schema.extend('tableRow', {
		// 	allowAttributes: 'class',
		// });
		// editor.model.schema.extend('tableCell', {
		// 	allowAttributes: 'class',
		// });

		// Both the data and the editing pipelines are affected by this conversion.
		editor.conversion.for('downcast').add((dispatcher) => {
			// Links are represented in the model as a "linkHref" attribute.
			// Use the "low" listener priority to apply the changes after the link feature.
			dispatcher.on(
				'insert:table',
				(evt, data, conversionApi) => {
					console.log('evt', evt);
					console.log('data', data);
					console.log('item', data.item);
					console.log('conversionApi', conversionApi);
					console.log('child', data.item.getChild(0));
					const tableRows = data.item.getChildren();
					const viewWriter = conversionApi.writer;
					const viewElement = conversionApi.mapper.toViewElement(
						data.item
					);

					const viewElementData =
						conversionApi.mapper.toViewElement(data);
					console.log('viewElement', viewElement);
					console.log('viewElementData', viewElementData);

					viewWriter.setAttribute(
						'ccfontsize',
						'text-default',
						viewElement
					);
					// viewWriter.setAttribute(
					// 	'class',
					// 	'text-default',
					// 	viewElement
					// );

					editor.model.change((modelWriter) => {
						modelWriter.setAttribute(
							'listFontsize',
							'text-default',
							data.item
						);
					});

					editor.editing.view.change((writer) => {
						console.log('data.item', data.item);
						writer.setAttribute('class', 'test123', data.item);
					});

					// for (let row of tableRows) {
					// 	console.log('row', row); // 1, "string", false
					// 	const cells = row.getChildren();
					// 	for (let cell of cells) {
					// 		console.log('cell', cell); // 1, "string", false
					// 		// editor.model.change((writer) => {
					// 		// 	console.log('hini');
					// 		// 	writer.setAttribute('class', 'test', cell);
					// 		// });
					// 		viewWriter.setAttribute('myclass', 'test', cell);
					// 		const viewWriter = conversionApi.writer;
					// 		const viewElement =
					// 			conversionApi.mapper.toViewElement(cell);

					// 		viewWriter.setAttribute(
					// 			'ccfontsize',
					// 			'text-default',
					// 			viewElement
					// 		);
					// 		viewWriter.setAttribute(
					// 			'class',
					// 			'text-default',
					// 			viewElement
					// 		);

					// 		editor.model.change((modelWriter) => {
					// 			modelWriter.setAttribute(
					// 				'listFontsize',
					// 				'text-default',
					// 				data.item
					// 			);
					// 		});
					// 		// viewWriter.addClass('test', cell);
					// 	}
					// 	// editor.model.change((writer) => {
					// 	// 	console.log('hini');
					// 	// 	writer.setAttribute('class', 'test', row);
					// 	// });
					// 	// viewWriter.setAttribute('class', 'test', row);
					// }

					// const viewWriter = conversionApi.writer;
					// const viewSelection = viewWriter.document.selection;

					// // Adding a new CSS class is done by wrapping all link ranges and selection
					// // in a new attribute element with the "target" attribute.
					// const viewElement = viewWriter.createAttributeElement(
					// 	'a',
					// 	{
					// 		target: '_blank',
					// 	},
					// 	{
					// 		priority: 5,
					// 	}
					// );

					// if (data.attributeNewValue.match(/ckeditor\.com/)) {
					// 	viewWriter.unwrap(
					// 		conversionApi.mapper.toViewRange(data.range),
					// 		viewElement
					// 	);
					// } else {
					// 	if (data.item.is('selection')) {
					// 		viewWriter.wrap(
					// 			viewSelection.getFirstRange(),
					// 			viewElement
					// 		);
					// 	} else {
					// 		viewWriter.wrap(
					// 			conversionApi.mapper.toViewRange(data.range),
					// 			viewElement
					// 		);
					// 	}
					// }
				},
				{ priority: 'low' }
			);
		});
		// editor.conversion.for('downcast').add((dispatcher) => {
		// 	dispatcher.on('attribute', (evt, data, conversionApi) => {
		// 		console.log('data.item.name', data);
		// 		if (data.item.name != 'table') {
		// 			return;
		// 		}

		// 		const viewWriter = conversionApi.writer;
		// 		const viewElement = conversionApi.mapper.toViewElement(
		// 			data.item
		// 		);

		// 		console.log('123', viewElement);

		// 		if (data.attributeKey == 'listFontsize') {
		// 			viewWriter.setAttribute(
		// 				'ccfontsize',
		// 				data.attributeNewValue,
		// 				viewElement
		// 			);
		// 			viewWriter.setAttribute(
		// 				'class',
		// 				data.attributeNewValue,
		// 				viewElement
		// 			);
		// 		}
		// 	});
		// });
		// editor.conversion.for('upcast').attributeToAttribute({
		// 	model: {
		// 		name: 'table',
		// 		key: 'listFontsize',
		// 		value: (viewElement) => {
		// 			return viewElement.getAttribute('ccfontsize');
		// 		},
		// 	},
		// 	view: {
		// 		name: 'table',
		// 		key: 'ccfontsize',
		// 	},
		// 	converterPriority: 'lowest',
		// });
	}
}

export default TableExtended;
