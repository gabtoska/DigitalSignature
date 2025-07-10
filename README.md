# PDF Signature App

This project allows users to upload a PDF, add a handwritten signature on it using a canvas, preview the result, download the signed PDF, or send it via email. It uses [PDF-Lib](https://pdf-lib.js.org/) and [pdf.js](https://mozilla.github.io/pdf.js/) for PDF manipulation, and [SignaturePad](https://github.com/szimek/signature_pad) for capturing signatures.

## Features

- Upload and preview PDF documents in the browser
- Draw a signature using your mouse or touchscreen
- Place and move the signature anywhere on the first page of the PDF
- Download the signed PDF
- Send the signed PDF as an email attachment
- Form validation for name, last name, and email
- Simple, user-friendly interface

## Technologies Used

- JavaScript (Vanilla)
- [PDF-Lib](https://pdf-lib.js.org/) for editing PDFs in the browser
- [pdf.js](https://mozilla.github.io/pdf.js/) for rendering PDFs in canvas
- [SignaturePad](https://github.com/szimek/signature_pad) for signature input
- HTML5, CSS3

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local or web server to serve the files (recommended for PDF.js and module use)
- (Optional) A backend endpoint (`send-email.php`) for sending emails with attachments

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/pdf-signature-app.git
    cd pdf-signature-app
    ```

2. **Serve the project:**
    - You can use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode, or run a simple server:
    ```sh
    # Python 3.x
    python -m http.server 8000
    ```
    - Open `http://localhost:8000` in your browser.

3. **Dependencies:**
    - The libraries (`pdf-lib`, `pdf.js`, `signature_pad`) should be included in your `index.html` via CDN or local files.

4. **Backend for Email (Optional):**
    - Implement `send-email.php` on your server to handle email sending with PDF attachments.

## Usage

1. Upload a PDF file using the file input.
2. Draw your signature in the signature area.
3. Click "Add Signature to PDF" to place your signature.
4. Drag the signature to your desired position on the PDF preview.
5. Enter your name, last name, and email (for email sending).
6. Download the signed PDF or send it via email.

## File Structure

```
project/
│
├── index.html
├── app.js
├── style.css
├── assets/
│   └── pdfjs/      # pdf.js files including pdf.worker.min.js
├── send-email.php  # Backend script for email sending (optional)
└── README.md
```

## License

This project is open source.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

**Enjoy signing your PDFs!**
