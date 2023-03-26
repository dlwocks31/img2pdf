import dayjs from "dayjs";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

const urlToBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((onSuccess, onError) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        onSuccess(this.result);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      onError(e);
    }
  });
};

function MyApp() {
  const [text, setText] = useState("");
  const [fileOrder, setFileOrder] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    urlToBase64("/NanumGothic.ttf").then((base64) => {
      jsPDF.API.events.push([
        "addFonts",
        function (this: any) {
          this.addFileToVFS(
            "NanumGothic-normal.ttf",
            (base64 as string).split(",")[1],
          );
          this.addFont("NanumGothic-normal.ttf", "NanumGothic", "normal");
        },
      ]);
    });
  }, []);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files ?? []);
    const fileNames = fileList.map((f) => f.name);
    fileNames.sort();
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
    doc.setFont("NanumGothic");

    if (text.length > 0) {
      doc.text(text, 10, 10, { maxWidth: width - 20 });
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

    const formattedNow = dayjs().format("YYYYMMDD_HHmmss");

    doc.save(`img2pdf_${formattedNow}.pdf`);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-4 p-4 flex-grow">
        <div className="text-3xl font-bold text-center">img2pdf</div>
        <div className="text-xl font-bold">1. PDF로 만들 사진들 선택</div>
        <div className="mx-auto">
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-sm"
            accept="image/*"
            multiple
            onChange={onFileChange}
            ref={fileRef}
          />
        </div>
        <div className="text-xl font-bold">
          2. (선택) PDF 첫 페이지에 텍스트 입력
        </div>
        <textarea
          className="textarea textarea-bordered"
          placeholder="첫 페이지 텍스트를 입력하세요."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {fileOrder.length > 0 && (
          <div className="text-xl font-bold">3. 파일 순서 지정</div>
        )}
        {fileOrder.map((file, i) => (
          <div className="flex gap-2 justify-center items-center">
            <div className="flex-1 break-all text-sm">{file}</div>
            <div className="flex gap-2">
              <button
                className={"btn btn-sm " + (i > 0 ? "" : "btn-disabled")}
                onClick={() => handleUp(i)}
              >
                ↑
              </button>
              <button
                className={
                  "btn btn-sm " +
                  (i < fileOrder.length - 1 ? "" : "btn-disabled")
                }
                onClick={() => handleDown(i)}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
        <button
          className={
            "btn btn-primary" + (fileOrder.length > 0 ? "" : "btn-disabled")
          }
          onClick={generatePdf}
        >
          PDF 생성
        </button>
        <button className="btn" onClick={() => window.location.reload()}>
          초기화
        </button>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div className="py-2 px-4 border-t border-neutral bg-base-100">
      <p className="text-xs text-base-content">
        Source code available on{" "}
        <a
          href="https://github.com/dlwocks31/img2pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </p>
    </div>
  );
}

export default MyApp;
