import Plugin from '@ckeditor/ckeditor5-core/src/plugin';class KeepFontsize extends Plugin {
	init() {
		const editor = this.editor;
		this.ccListenForEvent( editor );
		this.ccListenForEventParagraph( editor );
		this.ccListenForEventInsertP( editor );
	}

	ccListenForEvent( editor ) {
		editor.conversion.for( 'downcast' ).add( dispatcher => {
			dispatcher.on( 'remove:$text', ( evt, data, conversionApi ) => {
				if ( data.position.nodeBefore === null ) {
					editor.execute( 'fontSize', { value: 'default' } );
				}
			} );
		} );
	}

	/* This function is necessary if several lines e.g. can be marked
	and deleted by ctrl + a. ccListenForEvent only reacts when text
	within the p tag is deleted. ccListenForEventParagraph also reacts
	across multiple lines or p tags */
	ccListenForEventParagraph( editor ) {
		editor.conversion.for( 'downcast' ).add( dispatcher => {
			dispatcher.on( 'remove:paragraph', ( evt, data, conversionApi ) => {
				if ( data.position.nodeBefore === null ) {
					editor.execute( 'fontSize', { value: 'default' } );
				}
			} );
		} );
	}

	ccListenForEventInsertP( editor ) {
		editor.conversion.for( 'downcast' ).add( dispatcher => {
			dispatcher.on( 'insert:paragraph', ( evt, data, conversionApi ) => {
				if (data.item &&
					data.item.name === 'paragraph' &&
					data.item._children &&
					data.item._children._nodes &&
					data.item._children._nodes.length === 0            ) {
					if (editor.model.document.selection.anchor.parent === data.item) {
						editor.execute('fontSize', { value: 'default' });
					}
				}
			} );
		} );
	}
}

export default KeepFontsize;
