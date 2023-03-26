import jsPDF from "jspdf";
import { useState } from "react";

function MyApp() {
  const [text, setText] = useState("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const doc = new jsPDF("p", "mm", "a4");
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      if (text.length > 0) {
        doc.text(text, 10, 10);
        doc.addPage();
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const format = file.type === "image/jpeg" ? "JPEG" : "PNG";
        const img = new Image();
        img.src = URL.createObjectURL(file);

        if (i != 0) {
          doc.addPage();
        }
        doc.addImage(img, format, 10, 10, width - 20, height - 20);
      }

      doc.save("test.pdf");
    }
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-3xl font-bold text-center">img2pdf</div>
      <div className="m-auto">
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-sm"
          accept="image/*"
          multiple
          onChange={onFileChange}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">첫 페이지 텍스트</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="첫 페이지에 텍스트를 쓰고 싶다면 여기에 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <button onClick={() => window.location.reload()}>초기화</button>
    </div>
  );
}

export default MyApp;
