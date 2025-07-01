

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

    // Hide all remove buttons
    const removeButtons = billContent.querySelectorAll(".remove-item");
    removeButtons.forEach(btn => btn.style.display = "none");

    const options = {
        filename: 'bill.pdf',
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
        }
    };

    html2pdf().set(options).from(billContent).save().then(() => {
        // Show all remove buttons back after saving
        removeButtons.forEach(btn => btn.style.display = "inline-block");
    }).catch(err => {
        console.error('Error generating PDF:', err);
        alert('Failed to download the bill. Please try again.');

        // Even in error case, make sure buttons are restored
        removeButtons.forEach(btn => btn.style.display = "inline-block");
    });
}
