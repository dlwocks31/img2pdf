import jsPDF from "jspdf";
import { useRef, useState } from "react";

function MyApp() {
  const [text, setText] = useState("");
  const [fileOrder, setFileOrder] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files ?? []);
    const fileNames = fileList.map((f) => f.name);
    setFileOrder(fileNames);
  }

  function handleUp(i: number) {
    const newOrder = [...fileOrder];
    const temp = newOrder[i];
    newOrder[i] = newOrder[i - 1];
    newOrder[i - 1] = temp;
    setFileOrder(newOrder);
  }

  function handleDown(i: number) {
    const newOrder = [...fileOrder];
    const temp = newOrder[i];
    newOrder[i] = newOrder[i + 1];
    newOrder[i + 1] = temp;
    setFileOrder(newOrder);
  }

  function generatePdf() {
    const doc = new jsPDF("p", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    if (text.length > 0) {
      doc.text(text, 10, 10);
      doc.addPage();
    }
    const fileList = Array.from(fileRef.current?.files ?? []);
    for (let i = 0; i < fileOrder.length; i++) {
      const fileName = fileOrder[i];
      const file = fileList.find((f) => f.name === fileName);
      if (!file) {
        continue;
      }

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
          ref={fileRef}
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
      <div>
        <div className="text-xl font-bold">파일 순서</div>
        {fileOrder.map((f, i) => (
          <div className="flex">
            <span className="label-text">{f}</span>
            {i > 0 && (
              <button className="btn" onClick={() => handleUp(i)}>
                Up
              </button>
            )}
            {i < fileOrder.length - 1 && (
              <button className="btn" onClick={() => handleDown(i)}>
                Down
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="btn" onClick={generatePdf}>
        PDF 생성
      </button>
      <button className="btn" onClick={() => window.location.reload()}>
        초기화
      </button>
    </div>
  );
}

export default MyApp;
