
import {
    Directive,
    OnInit,
    ElementRef,
    OnDestroy,
    Input,
    Output,
    EventEmitter
  } from '@angular/core';
  import 'tinymce';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/charmap';
  
  
  declare var tinymce: any;
  
  @Directive({
    selector: '[htmlEditor]',
  })
  export class EditorDirective implements OnInit, OnDestroy {
    private editor;
    @Input() value: string;
    @Input() editorContent: string;
    @Output() private htmlEditorKeyUp: EventEmitter<any> = new EventEmitter();
    constructor(private el: ElementRef) {}
    ngOnInit() {
      tinymce.EditorManager.editors = [];
      this.el.nativeElement.value = this.editorContent || '';
      tinymce.init({
        menubar: false,
        statusbar: false,
        branding: false,
        target: this.el.nativeElement,
        plugins: ['link', 'table', 'lists', 'image', 'charmap'],
        browser_spellcheck: true,
        toolbar:
          'styleselect | bold italic underline | link | numlist bullist | image | charmap | superscript | subscript',
        setup: editor => {
          this.editor = editor;
          editor.on('blur', () => {
            const content = editor.getContent();
            if (content.indexOf('&nbsp;') > -1) {
              this.htmlEditorKeyUp.emit(false);
            } else {
              this.htmlEditorKeyUp.emit(content);
            }
          });
        },
      });
    }
    ngOnDestroy() {
      tinymce.remove(this.editor);
    }
  }
  