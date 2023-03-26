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
        doc.addImage(img, "JPEG", 10, 10, width - 20, height - 20);
      }

      doc.save("test.pdf");
    }
  }
  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onFileChange} />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={() => window.location.reload()}>초기화</button>
    </div>
  );
}

export default MyApp;
