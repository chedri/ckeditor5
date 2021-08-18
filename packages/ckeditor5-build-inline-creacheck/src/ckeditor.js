/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';

import KeepFontsize from './KeepFontsize';
import TableExtended from './Table';
import FontSize from './FontSize';
import SpanTag from './SpanTag';
import Icons from './Icons';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import {
	FontBackgroundColor,
	FontColor,
	FontFamily,
	Font,
} from '@ckeditor/ckeditor5-font';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import {
	SpecialCharactersText,
	SpecialCharactersMathematical,
	SpecialCharactersEssentials,
	SpecialCharactersCurrency,
	SpecialCharactersLatin,
	SpecialCharactersArrows,
	SpecialCharacters,
} from '@ckeditor/ckeditor5-special-characters';
import {
	Subscript,
	Superscript,
	Strikethrough,
	Underline,
} from '@ckeditor/ckeditor5-basic-styles';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Link from '@ckeditor/ckeditor5-link/src/link';
import { List, ListStyle } from '@ckeditor/ckeditor5-list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import {
	Table,
	TableToolbar,
	TableCellProperties,
	TableProperties,
} from '@ckeditor/ckeditor5-table';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';

export default class InlineEditor extends InlineEditorBase {}

// Plugins to include in the build.
InlineEditor.builtinPlugins = [
	KeepFontsize,
	SpanTag,
	List,
	ListStyle,
	Font,
	FontSize,
	FontColor,
	FontFamily,
	FontBackgroundColor,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersText,
	SpecialCharactersMathematical,
	SpecialCharactersLatin,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Underline,
	HorizontalLine,
	Alignment,
	Essentials,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	Heading,
	Indent,
	IndentBlock,
	Link,
	Paragraph,
	Table,
	TableToolbar,
	TableCellProperties,
	TableProperties,
	TextTransformation,
	WordCount,
	Icons,
	TableExtended
];

// Editor configuration.
InlineEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'uploadImage',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo',
		],
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative',
		],
	},
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'de',
};
