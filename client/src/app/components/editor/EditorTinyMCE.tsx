import { Editor } from "@tinymce/tinymce-react";

export const EditorTinyMCE = (props: {
  editorRef: any
  value?: string
  id?: string
}) => {
  const { editorRef, value="", id="" } = props;

  return (
    <>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(event, editor) => editorRef.current = editor}
        initialValue={value}
        init={{
          height: 500,
          plugins: 'charmap codesample emoticons help image link lists advlist media preview searchreplace table wordcount',
          toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | charmap | codesample | emoticons | image | link | numlist bullist | media | preview | searchreplace | help',
          images_upload_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upload/image`
        }}
        id={id}
      />
    </>
  );
}