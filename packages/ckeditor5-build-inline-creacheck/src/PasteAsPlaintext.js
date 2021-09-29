import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClipboardPipeline from '@ckeditor/ckeditor5-clipboard/src/clipboardpipeline';
import ClipboardObserver from '@ckeditor/ckeditor5-clipboard/src/clipboardobserver';

class PasteAsPlaintext extends Plugin {
	static get pluginName() {
		return 'PasteAsPlainText';
	}

	static get requires() {
		return [ ClipboardPipeline ];
	}

	init() {
		const editor = this.editor;
		const model = editor.model;
		const view = editor.editing.view;
		const selection = model.document.selection;
		view.addObserver( ClipboardObserver );

		editor.plugins.get( ClipboardPipeline ).on( 'contentInsertion', ( evt, data ) => {
			model.change( writer => {
				// Formatting attributes should be preserved.
				const textAttributes = Array.from( selection.getAttributes() )
					.filter( ( [ key ] ) => model.schema.getAttributeProperties( key ).isFormatting );

				if ( !selection.isCollapsed ) {
					model.deleteContent( selection, { doNotAutoparagraph: true } );
				}

				// Also preserve other attributes if they survived the content deletion (because they were not fully selected).
				// For example linkHref is not a formatting attribute but it should be preserved if pasted text was in the middle
				// of a link.
				textAttributes.push( ...selection.getAttributes() );

				const range = writer.createRangeIn( data.content );

				for ( const item of range.getItems() ) {
					if ( item.is( '$textProxy' ) ) {
						writer.setAttributes( textAttributes, item );
					}
				}
			} );
		} );
	}
}

export default PasteAsPlaintext;
