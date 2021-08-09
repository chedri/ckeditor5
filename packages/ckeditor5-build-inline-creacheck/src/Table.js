import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class TableExtended extends Plugin {

	init() {
		const editor = this.editor;
		this.addClassesToTables( editor );
	}

	addClassesToTables( editor ) {
		editor.model.schema.extend( 'table', {
			allowAttributes: [ 'totalRows', 'totalCols' ]
		} );

		editor.model.schema.extend( 'tableRow', {
			allowAttributes: ['rowCount', 'oddeven' ]
		} );

		editor.model.schema.extend( 'tableCell', {
			allowAttributes: [ 'colCount', 'oddeven' ]
		} );

		editor.conversion.for( 'downcast' ).add( ( dispatcher ) => {
			dispatcher.on(
				'insert:table',
				( evt, data, conversionApi ) => {
					const tableRows = data.item.getChildren();
					const viewWriter = conversionApi.writer;
					const tableViewElement = conversionApi.mapper.toViewElement( data.item );

					const generalRowCount = this.getGeneralRowCount( data.item );
					const generalColCount = this.getGeneralColCount( data.item );

					let tableClasses = 'rows_total_' + generalRowCount + ' cols_total_' + generalColCount;

					tableClasses = this.getMergedClasses( tableClasses, tableViewElement.getClassNames() );

					viewWriter.setAttribute( 'class', tableClasses, tableViewElement );

					let rowCount = 0;

					for ( let row of tableRows ) {
						rowCount++;

						const tableRowViewElement = conversionApi.mapper.toViewElement( row );
						const columns = row.getChildren();

						let oddevenRow = 'even';
						let rowClasses = '';

						rowClasses += 'row_' + rowCount;

						if ( ( rowCount % 2 ) !== 0 ) {
							oddevenRow = 'odd';
						}

						rowClasses += ' ' + oddevenRow;

						rowClasses = this.getMergedClasses( rowClasses, tableRowViewElement.getClassNames() );

						viewWriter.setAttribute( 'class', rowClasses, tableRowViewElement );

						let columnCount = 0;

						for ( let column of columns ) {
							columnCount++;

							const tableRowColumnViewElement = conversionApi.mapper.toViewElement( column );

							let oddevenColumn = 'even';
							let columnClasses = '';

							columnClasses += 'col_' + columnCount;

							if ( ( columnCount % 2 ) !== 0 ) {
								oddevenColumn = 'odd';
							}

							columnClasses += ' ' + oddevenColumn;

							columnClasses = this.getMergedClasses( columnClasses, tableRowColumnViewElement.getClassNames() );

							viewWriter.setAttribute( 'class', columnClasses, tableRowColumnViewElement );
						}
					}
				} );
		} );
	}

	getGeneralRowCount( tableItem ) {
		let rowCount = 0;

		for ( let row of tableItem.getChildren() ) {
			rowCount++;
		}

		return rowCount;
	}

	getGeneralColCount( tableItem ) {
		let colCount = 0;

		for ( let row of tableItem.getChildren() ) {
			const cols = row.getChildren();

			for ( let col of cols ) {
				colCount++;
			}

			break;
		}

		return colCount;
	}

	getMergedClasses( tableClasses, elementClasses ) {
		for ( let className of elementClasses ) {
			tableClasses += ' ' + className;
		}

		return tableClasses;
	}
}

export default TableExtended;
