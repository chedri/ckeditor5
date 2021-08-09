import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class KeepFontsize extends Plugin {
	init() {
		const editor = this.editor;
		this.ccListenForEvent( editor );
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
}

export default KeepFontsize;
