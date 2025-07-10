document.addEventListener('DOMContentLoaded', function () {
  let sigX = 0, sigY = 0;
  let sigWidth = 100, sigHeight = 60;
  let dragging = false, dragOffsetX = 0, dragOffsetY = 0;
  let signatureActive = false;
  const firmaCanvas = document.getElementById('firma');
  const signaturePad = new SignaturePad(firmaCanvas);
  const firmaimg = document.getElementById('firmaimg');
  const resetbtn = document.getElementById('Reset');
  const addSignatureBtn = document.getElementById('addSignatureToPDF');
  const downloadBtn = document.getElementById('downloadBtn');
  const SendEmailBtn = document.getElementById('sendmailBtn');
  const fileInput = document.getElementById('pdfile');
  const pdfCanvas = document.getElementById('pdfpreview');
  const pdfContext = pdfCanvas.getContext('2d');
  const form = document.getElementById('myform');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const firstNameError = document.getElementById('firstName-error');
  const lastNameError = document.getElementById('lastName-error');
  const emailError = document.getElementById('email-error');
  let loadedPdf = null;

  // Shfaqja e PDF-së në canvas
  fileInput.addEventListener('change', PdfLoader);

  async function PdfLoader(e) {        //funksioni për ngarkimin e PDF-së
    try {
      const file = e.target.files[0];
      if (!file) return;
      const pdfconvert = await file.arrayBuffer();
      loadedPdf = await pdfjsLib.getDocument({ data: pdfconvert }).promise;
      const page = await loadedPdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.2 });
      pdfCanvas.width = viewport.width;
      pdfCanvas.height = viewport.height;
      await page.render({ canvasContext: pdfContext, viewport }).promise;
      const pdfImage = new Image();  // Krijimi i një imazhi të PDF-së
      pdfImage.src = pdfCanvas.toDataURL();
      window.currentPDFImage = pdfImage;

    } catch (err) {
      alert("Error loading PDF: " + err.message);
    }
  }

  function renderPDFAndSignature() {      // Funksioni për bashkimn e PDF dhe firmës
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    if (window.currentPDFImage) {
      pdfContext.drawImage(window.currentPDFImage, 0, 0, pdfCanvas.width, pdfCanvas.height);
    }
    if (signatureActive && firmaimg.src) {
      pdfContext.drawImage(firmaimg, sigX, sigY, sigWidth, sigHeight);
    }
  }

  // Fshirja e firmës
  resetbtn.addEventListener('click', Fshi);
  function Fshi() {
    signaturePad.clear();
    signatureActive = false;
    renderPDFAndSignature();
  }

  // Butoni për të shtuar nënshkrimin në PDF
  addSignatureBtn.addEventListener('click', Shtofirme);

  function Shtofirme() {
    if (signaturePad.isEmpty()) {
      alert("Ju lutem firmosni para se të vendosni nënshkrimin në PDF.");
      return;
    }
    if (!loadedPdf) {
      alert("Ju lutem ngarkoni një PDF para se të shtoni nënshkrimin.");
      return;

    }
    const dataUrl = signaturePad.toDataURL();
    firmaimg.src = dataUrl;
    signatureActive = true;
    sigX = 50;
    sigY = 50;
    if (firmaimg.complete) {
      renderPDFAndSignature();
    } else {
      firmaimg.onload = renderPDFAndSignature;
    }
  }

  // drag kur shtyp mouse
  pdfCanvas.addEventListener('mousedown', function (e) {
    if (!signatureActive) return;

    const rect = pdfCanvas.getBoundingClientRect();
    // koeficenti
    const scaleX = pdfCanvas.width / rect.width;
    const scaleY = pdfCanvas.height / rect.height;
    // koordinatat e mouse brenda canvas
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    pdfCanvas.style.cursor = "grab";
    if (
      mx >= sigX && mx <= sigX + sigWidth &&
      my >= sigY && my <= sigY + sigHeight
    ) {
      dragOffsetX = mx - sigX;
      dragOffsetY = my - sigY;
      dragging = true;
    }
  });

  pdfCanvas.addEventListener('mousemove', function (e) {
    if (!dragging || !signatureActive) return;
    const rect = pdfCanvas.getBoundingClientRect();
    const scaleX = pdfCanvas.width / rect.width;
    const scaleY = pdfCanvas.height / rect.height;
    pdfCanvas.style.cursor = "grabbing";
    sigX = (e.clientX - rect.left) * scaleX - dragOffsetX;
    sigY = (e.clientY - rect.top) * scaleY - dragOffsetY;
    // brenda kornizes
    sigX = Math.max(0, Math.min(sigX, pdfCanvas.width - sigWidth));
    sigY = Math.max(0, Math.min(sigY, pdfCanvas.height - sigHeight));
    renderPDFAndSignature();
  });
  pdfCanvas.addEventListener('mouseup', function () {
    dragging = false; pdfCanvas.style.cursor = "grab"
  });

  pdfCanvas.addEventListener('mouseleave', function () {
    dragging = false; pdfCanvas.style.cursor = "grab"
  });

  // Validimi  //
  function isValidName(name) {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(name.trim()) && name.trim().length > 0;
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }



  function validateForm() {
    let valid = true;
    if (!isValidName(firstNameInput.value)) {
      firstNameError.style.display = "inline";
      valid = false;
    } else {
      firstNameError.style.display = "none";
    }
    if (!isValidName(lastNameInput.value)) {
      lastNameError.style.display = "inline";
      valid = false;
    } else {
      lastNameError.style.display = "none";
    }
    if (!isValidEmail(emailInput.value)) {
      emailError.style.display = "inline";
      valid = false;
    } else {
      emailError.style.display = "none";
    }
    return valid;
  }

  form.addEventListener('submit', function (e) {
    if (!validateForm()) {
      e.preventDefault();
    }
  });

  // Funksioni për krijimin e PDF me firmë dhe kthimin e bytes per tu perdorur per shkarkim dhe dergim
  async function PdfFirmosur() {

    if (!signatureActive || !firmaimg.src) {
      throw new Error("Ju lutem shtoni nënshkrimin në PDF para se të vazhdoni.");
    }
    if (!fileInput.files[0]) {
      throw new Error("Ju lutem ngarkoni një PDF para se të vazhdoni.");
    }

    // pdfja origjinale
    const fileBuffer = await fileInput.files[0].arrayBuffer();
    const { PDFDocument } = window['pdfjs-dist/build/pdf'];
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const page = pdfDoc.getPage(0);

    // Dimensionet e pdf the canvas
    const pdfDims = {
      width: page.getWidth(),
      height: page.getHeight()
    };
    const canvasDims = {
      width: pdfCanvas.width,
      height: pdfCanvas.height
    };

    // koeficenti i zhvendosjes
    const scale = {
      x: pdfDims.width / canvasDims.width,
      y: pdfDims.height / canvasDims.height
    };

    // ndryshimi i madhesise me koeficent
    const signature = {
      x: sigX * scale.x,
      y: pdfDims.height - (sigY * scale.y) - (sigHeight * scale.y),
      width: sigWidth * scale.x,
      height: sigHeight * scale.y
    };

    // konvertimi ne binar
    const pngBytes = await fetch(firmaimg.src).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngBytes);

    // vendosja e firmes
    page.drawImage(pngImage, {
      x: signature.x,
      y: signature.y,
      width: signature.width,
      height: signature.height,
    });

    return await pdfDoc.save();
  }

  // Butoni për të shkarkuar PDF me nënshkrimin
  downloadBtn.addEventListener('click', Shkarko);
  async function Shkarko() {
    try {
      const pdfmefirme = await PdfFirmosur();
      const blob = new Blob([pdfmefirme], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Krijmi i elementit per shkarkim
      const a = document.createElement('a');
      a.href = url;
      a.download = "Dokumenti_i_nënshkruar.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      alert('Gabim gjatë shkarkimit të PDF-së së firmosur: ' + err.message);
    }
  }

  //butoni per dergimin e emailit me pdf te firmosur
  SendEmailBtn.addEventListener('click', KonvertoEmail);

  //funksioni per konvertimin e emailit ne base64

  async function KonvertoEmail(e) {
    e.preventDefault();
    if (!validateForm()) return;
    SendEmailBtn.disabled = true;
    SendEmailBtn.textContent = "Duke dërguar...";
    try {
      const pdfmefirme = await PdfFirmosur();
      const base64pdf = btoa(String.fromCharCode(...new Uint8Array(pdfmefirme)));
      await DergoEmail(base64pdf);

      setTimeout(() => {
        SendEmailBtn.disabled = false;
        SendEmailBtn.textContent = "Dërgo E-mail";
      }, 2000);
    } catch (err) {
      alert('Gabim gjatë dërgimit të emailit: ' + err.message);
      SendEmailBtn.disabled = false;
      SendEmailBtn.textContent = "Dërgo E-mail";
    }
  }


  // Funksioni për dërgimin e email-it me PDF të konvertuar në base64
  async function DergoEmail(base64pdf) {
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const subject = "Dokumenti i nenshkruar";
    const message = "Bashkëngjitur do të gjeni dokumentin tuaj te nënshkruar.";

    try {
      const response = await fetch('send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: subject,
          message: message,
          pdfBase64: base64pdf,
          firstName: firstName,
          lastName: lastName
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Dështoi dërgimi i email-it');
      }

      alert('Email u dërgua me sukses!');
      console.log(result);
    } catch (err) {
      alert('Gabim gjatë dërgimit të emailit: ' + err.message);
    }
  }
});
