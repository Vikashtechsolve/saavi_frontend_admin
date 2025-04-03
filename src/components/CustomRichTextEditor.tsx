import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomRichTextEditor = ({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  return (
    <ReactQuill value={value} onChange={onChange} className={className} />
  );
};

export default CustomRichTextEditor;
