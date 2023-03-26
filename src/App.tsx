import jsPDF from "jspdf";

function MyApp() {
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);

      const doc = new jsPDF("p", "mm", "a4");
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(img, "JPEG", 10, 10, width - 20, height - 20);
      doc.save("a4.pdf");
    }
  }
  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onFileChange} />
      <button onClick={() => window.location.reload()}>Clear</button>
    </div>
  );
}

export default MyApp;
