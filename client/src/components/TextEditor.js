import React, { useState } from 'react'
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ onEditorChange, value }) => {
    // const [editorHtml, setEditorHtml] = useState("")
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }
    /* 
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
    const formats = [
        'header', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]

    const handleChange = (html) => {
        console.log("🚀 ~ file: TextEditor.js ~ line 32 ~ handleChange ~ html", html)
        onEditorChange(html)
    }

    return (
        <div>
            <ReactQuill
                theme={'snow'}
                onChange={handleChange}
                value={value}
                modules={modules}
                formats={formats}
                bounds={'.app'}
                placeholder="Write an announcement"
                rows={6}
            />
        </div>
    )
}

export default TextEditor
