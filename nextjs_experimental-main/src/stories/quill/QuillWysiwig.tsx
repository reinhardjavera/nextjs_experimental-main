import React, { useEffect } from 'react';
import { useRef } from 'react';
import "./../../../node_modules/quill/dist/quill.snow.css";
import "./../../../node_modules/quill/dist/quill.bubble.css";
import "./../../../node_modules/katex/dist/katex.min.css"
import "./../../../node_modules/quill-better-table/dist/quill-better-table.css"
import Quill from 'quill';
import katex from 'katex';
import BlotFormatter2 from '@enzedonline/quill-blot-formatter2';

type User = {
  name: string;
};

export interface QuillWysiwigProps {
  /** INFO : maxGraph only works with bundler like Webpack.*/
  Description?: void,
  /** Content - Connect from certain id to another id tasks. **Must provide id for link itself */
  links?: { a: string }[]
}

export const QuillWysiwig: React.FC<QuillWysiwigProps> = ({
  links = [],
  ...props
}: QuillWysiwigProps) => {
  const myRef = useRef<HTMLElement>();
  let quillRef: Quill;
  useEffect(() => {
    // console.log("Access katex", katex);
    // expose to window
    (window as any).katex = katex;
    Quill.register('modules/blotFormatter2', BlotFormatter2);

    import("quill-better-table").then(QuillBetterTable => {
      Quill.register({
        'modules/better-table': QuillBetterTable.default
      }, true);
      console.log("Better table?", QuillBetterTable);
      fnQuillFormatsRegistered();
    })


  });

  const fnQuillFormatsRegistered = () => {
    const toolbarModules = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']                                         // remove formatting button
    ];

    const options = {
      debug: 'info' as any,
      modules: {
        'better-table': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Another unmerge cells name'
              }
            },
            color: {
              colors: ['#fff', 'red', 'rgb(0, 0, 0)'],  // colors you need in operationMenu, ['white', 'red', 'yellow', 'blue'] as default
              text: 'Warna Latar'  // subtitle, 'Background Colors' as default
            }             
          }
        },
        // keyboard: {
        //   bindings: QuillBetterTable.keyboardBindings
        // },
        toolbar: toolbarModules,
        blotFormatter2: {
          // see config options below
          align: {
            allowAligning: true,
          },
          resize: {
            allowResizing: true,
          },
          delete: {
            allowKeyboardDelete: true,
          },
          image: {
            allowAltTitleEdit: true,
            allowCompressor: true,
            registerImageTitleBlot: true
          },
          video: {
            registerCustomVideoBlot: true,
            defaultAspectRatio: '2/1 auto'
          }
        }
      },
      readOnly: false,
      placeholder: 'Tulis disini...',
      theme: 'snow'
    };
    const Link = Quill.import('formats/link');
    quillRef = new Quill(myRef.current!, options);
  }

  const fnTambahTabel = () => {
    let tableModule = quillRef.getModule('better-table');
    (tableModule as unknown as any).insertTable(3, 3);
  };


  return (
    <>
      <div>
        <button onClick={fnTambahTabel}>Tambah Tabel</button>
      </div>
      <div ref={myRef as any} className="h-[100vh] w-[100vh]">
        Tes
      </div>
    </>
  );
};
