import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class TableExtended extends Plugin {
	init() {
		const editor = this.editor;
		editor.conversion.attributeToAttribute({
			model: 'class',
			view: 'class',
		});
		this.addClassesToTables(editor);
	}

	addClassesToTables(editor) {
		editor.conversion.for('downcast').add((dispatcher) => {
			dispatcher.on('insert:table', (evt, data, conversionApi) => {
				const viewWriter = conversionApi.writer;

				const tableRows = data.item._children;
				const tableViewElement = conversionApi.mapper.toViewElement(
					data.item
				);

				const generalRowCount = this.getGeneralRowCount(data.item);
				const generalColCount = this.getGeneralColCount(data.item);

				let tableClasses =
					'rows_total_' +
					generalRowCount +
					' cols_total_' +
					generalColCount;

				tableClasses = this.getMergedClasses(
					tableClasses,
					tableViewElement.getClassNames()
				);

				editor.model.change((modelWriter) => {
					modelWriter.setAttribute('class', tableClasses, data.item);
				});

				let rowCount = 0;

				for (let row of tableRows) {
					rowCount++;
					const tableRowViewElement =
						conversionApi.mapper.toViewElement(row);
					const columns = row._children;

					let oddevenRow = 'even';
					let rowClasses = '';

					rowClasses += 'row_' + rowCount + ' total_row_' + tableRows._nodes.length;

					if (rowCount % 2 !== 0) {
						oddevenRow = 'odd';
					}

					rowClasses += ' ' + oddevenRow;

					rowClasses = this.getMergedClasses(
						rowClasses,
						tableRowViewElement.getClassNames()
					);

					editor.model.change((modelWriter) => {
						modelWriter.setAttribute('class', rowClasses, row);
					});

					let columnCount = 0;

					for (let column of columns) {
						columnCount++;

						const tableRowColumnViewElement =
							conversionApi.mapper.toViewElement(column);

						let oddevenColumn = 'even';
						let columnClasses = '';

						columnClasses += 'col_' + columnCount + ' total_row_' + columns.length;

						if (columnCount % 2 !== 0) {
							oddevenColumn = 'odd';
						}

						columnClasses += ' ' + oddevenColumn;

						columnClasses = this.getMergedClasses(
							columnClasses,
							tableRowColumnViewElement.getClassNames()
						);

						editor.model.change((modelWriter) => {
							modelWriter.setAttribute(
								'class',
								columnClasses,
								column
							);
						});
					}
				}
			});
		});
	}

	getGeneralRowCount(tableItem) {
		let rowCount = 0;

		for (let row of tableItem._children) {
			rowCount++;
		}

		return rowCount;
	}

	getGeneralColCount(tableItem) {
		let colCount = 0;
		let maxCount = 0;

		for (let row of tableItem._children) {
			const cols = row._children;
			colCount = 0;
			for (let col of cols) {
				colCount++;
				if(colCount > maxCount){
					maxCount++;
				}
			}
		}

		return colCount;
	}

	getMergedClasses(tableClasses, elementClasses) {
		for (let className of elementClasses) {
			tableClasses += ' ' + className;
		}

		return tableClasses;
	}
}

export default TableExtended;
