import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class FontColorCustom extends Plugin {
	init() {
		const editor = this.editor;
		this.allowAttributeCcFontColorInList(editor);
		this.customFontColorDropDown(editor);
	}
	setClass(editor, addClass, item, itemModel) {
		editor.editing.view.change((writer) => {
			writer.setAttribute('style', `color:${addClass}`, item);
			writer.setAttribute('ccfontcolor', `color:${addClass}`, item);
		});
		editor.model.change(modelWriter => {
			modelWriter.setAttribute('listFontColor', `color:${addClass}`, itemModel);
		});
	}

	getSelectedColorFromPath(path) {
		for (let i = 0; i < path.length; i++) {
			const element = path[i].element;
			if (element && element.classList.contains('ck-color-table')) {
				return path[i].selectedColor;
			}
		}
		return '#000000'; // return default color if no matching element is found
	}

	customFontColorDropDown(editor) {
		editor.ui.componentFactory.add('fontColorDropdown', () => {
			const editor = this.editor;

			// Use original fontSize button - we only changes its behavior.
			const dropdownView = editor.ui.componentFactory.create('fontColor');
			dropdownView.on('execute', (evt) => {
				const commandParam = this.getSelectedColorFromPath( evt.path );
				const listItem = editor.editing.view.document.selection.focus.parent;
				const elementStart = editor.editing.view.document.selection.getFirstPosition().parent;
				const elementEnd = editor.editing.view.document.selection.getLastPosition().parent;
				const elementModel = editor.model.document.selection.getFirstPosition().parent;

				if ( elementStart.index === elementEnd.index ) {
					if ( listItem.name === 'li' ) {
						this.setClass( editor, commandParam, listItem, elementModel );
					} else {
						const listItem = editor.editing.view.document.selection.focus.parent.parent;
						if ( listItem.name === 'li' ) {
							this.setClass( editor, commandParam, listItem, elementModel );
						}
					}
				} else if ( elementStart.name === 'li' ) {
					let loopEnd = false;
					let loopElement = elementStart;
					let loopElementModel = elementModel;

					while ( loopEnd === false ) {
						this.setClass( editor, commandParam, loopElement, loopElementModel );

						if ( loopElement.nextSibling !== null && loopElement.index < elementEnd.index ) {
							loopElement = loopElement.nextSibling;
							loopElementModel = loopElementModel.nextSibling;
						} else {
							loopEnd = true;
						}
					}
				}
			});

			return dropdownView;
		});
	}

	allowAttributeCcFontColorInList( editor ) {
		editor.model.schema.extend( 'listItem', { allowAttributes: 'listFontColor' } );

		editor.conversion.for( 'downcast' ).add( dispatcher => {
			dispatcher.on( 'insert:listItem', ( evt, data, conversionApi ) => {
				if ( data.item.getAttribute( 'listFontColor' ) === undefined ) {
					const viewWriter = conversionApi.writer;
					const viewElement = conversionApi.mapper.toViewElement( data.item );

					viewWriter.setAttribute( 'ccfontcolor', 'color:#000000', viewElement ); /* Initialcolor */
				}
			} );
		} );

		editor.conversion.for('downcast').add(dispatcher => {
			dispatcher.on('attribute', (evt, data, conversionApi) => {

				if (data.item.name != 'listItem') {
					return;
				}

				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement(
					data.item
				);

				if( data.attributeKey == 'listFontColor' ) {
					viewWriter.setAttribute(
						'ccfontcolor',
						data.attributeNewValue,
						viewElement
					);
					viewWriter.setAttribute(
						'style',
						data.attributeNewValue,
						viewElement
					);
				}
			});
		});

		editor.conversion.for('upcast').attributeToAttribute({
			model: {
				name: 'listItem',
				key: 'listFontColor',
				value: viewElement => {
					return viewElement.getAttribute( 'ccfontcolor' );
				}
			},
			view: {
				name: 'li',
				key: 'ccfontcolor',
			},
			converterPriority: 'lowest'
		});
	}
}

export default FontColorCustom;
