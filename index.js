

function getShopName() {
    const shopName = document.querySelector("#shop").value.trim();
    document.querySelector("#name").innerHTML = shopName;
    document.querySelector("#shop").value = "";
   
};

function addItem(){
    const itemName = document.querySelector("#item").value.trim();
    const itemPrice = document.querySelector("#price").value.trim();
    const itemQuantity = document.querySelector("#quantity").value.trim();
    const totalAmount = document.querySelector("#totalAmount");
    const item = document.createElement("tr");
    item.innerHTML = `
        <td>${itemName || "Item Name"}</td>
        <td>${itemPrice || "0"}</td>
        <td>${itemQuantity || "1"}</td>
        <td class="item-total">${(parseFloat(itemPrice) || 0) * (parseFloat(itemQuantity) || 1)}</td>
        <td><button class="remove-item" onclick="removeItem(this)">Remove</button></td>
    `;
    const currentTotal = parseFloat(totalAmount.innerHTML) || 0;
    const newTotal = currentTotal + (parseFloat(itemPrice) || 0) * (parseFloat(itemQuantity) || 1);
    totalAmount.innerHTML = newTotal.toFixed(2);
    document.querySelector("#itemList").appendChild(item);

    document.querySelector("#item").value = "";
    document.querySelector("#price").value = "";    
    document.querySelector('#quantity').value = "";
}

function removeItem(button) {
    const row = button.closest("tr");  // Changed from parentElement.parentElement to closest("tr")
    const itemTotal = parseFloat(row.querySelector(".item-total").textContent) || 0;
    
    const totalAmountElement = document.querySelector("#totalAmount");
    const currentTotal = parseFloat(totalAmountElement.textContent) || 0;

    const newTotal = currentTotal - itemTotal;
    totalAmountElement.textContent = newTotal.toFixed(2);

    row.remove();
}

function downloadBill() {
  const billContent = document.querySelector("#content");

  // Hide remove buttons before export
  const removeButtons = billContent.querySelectorAll(".remove-item");
  removeButtons.forEach(btn => btn.style.display = "none");

  const opt = {
    margin:       0.5,
    filename:     'bill.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['css', 'legacy'] }  // 👈 important for table breaking
  };

  html2pdf().set(opt).from(billContent).save().then(() => {
    // Restore buttons
    removeButtons.forEach(btn => btn.style.display = "inline-block");
  }).catch(err => {
    console.error('PDF Download Error:', err);
    removeButtons.forEach(btn => btn.style.display = "inline-block");
  });
}


async function sharePDF() {
  const billContent = document.querySelector("#content");

  // Hide remove buttons before export
  const removeButtons = billContent.querySelectorAll(".remove-item");
  removeButtons.forEach(btn => btn.style.display = "none");

  const options = {
    margin: 0.5, // half inch margin
    filename: 'bill.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['css', 'legacy'] }  // 🔥 crucial for table splitting
  };

  try {
    const pdfBlob = await html2pdf().set(options).from(billContent).outputPdf('blob');
    const file = new File([pdfBlob], 'bill.pdf', { type: 'application/pdf' });

    // Check if Web Share API with file support is available
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Bill PDF',
        text: 'Here is your bill.',
        files: [file]
      });
    } else {
      alert('Sharing is not supported on this browser. Please download the PDF manually.');
    }
  } catch (err) {
    console.error('Error while sharing PDF:', err);
    alert('Something went wrong while sharing the PDF.');
  } finally {
    // Restore remove buttons
    removeButtons.forEach(btn => btn.style.display = "inline-block");
  }
}
