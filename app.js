//using your own apikey
import apikey from './private/api.js'
const x_client_key = apikey.xclientkey;
const api_key = apikey.apikey;
// Define the URL and headers for the API request
const url = "https://api.vietqr.io/v2/generate";
const select = document.querySelector(".select-bank");
const qrcode = document.querySelector("#qrcode");
const headers = {
  "x-client-key": x_client_key,
  "x-api-key": api_key,
  "Content-Type": "application/json", // Added content type
};

fetch("https://api.vietqr.io/v2/banks", {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    console.log(select);

    data.data.forEach((bank) => {
      const option = document.createElement("option");
      option.value = bank.bin;
      option.text = bank.name;
      select.add(option);
    });
  });

const generateQR = function () {
  let amount = document.querySelector('input[name="amount"]').value;

  // Ensure the input is a valid number
  amount = Number(amount);
  if (isNaN(amount) || amount <= 0 || amount > 100000000) {
    alert("Please enter a valid amount. (0M -> 100M)");
    return;
  }
  // Replace the default account details with your own
  // account details. Make sure to replace the placeholders with your own account details.
  // Also, ensure the amount is a valid number. Adjust the amount as needed.
  const bankBin = document.querySelector("select").value;

  if (bankBin === "default") {
    alert("Please select a valid bank BIN");
    return;
  } else {
    // bankBin = Number(bankBin);
    console.log(bankBin);
  }
  const accountNo = document.querySelector('input[name="accountNo"]').value;
  if (!accountNo) {
    alert("Please enter a valid account number");
    return;
  }
  const accountName = document.querySelector('input[name="accountName"]').value;
  if (!accountName) {
    alert("Please enter a valid account name");
    return;
  }
  const addInfo = document.querySelector('input[name="addInfo"]').value;
  if (!addInfo) {
    alert("Please enter additional information");
    return;
  }
  const body = {
    accountNo: accountNo,
    accountName: accountName,
    acqId: bankBin,
    amount: amount,
    addInfo: addInfo,
    // Corrected amount to ensure it's a valid number
    format: "text",
    template: "compact2",
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      // Assuming the response contains the qrDataURL key
      if (data && data?.data?.qrDataURL) {
        qrcode.innerHTML = `
          <div class="title">
         <h1>Scan to pay</h1>
          </div>
          <div class="image">
          <img src="${data.data.qrDataURL}" width="250px" alt="QR Code">
          </div>
          `;
      } else {
        qrcode.innerHTML = `<p>Failed to generate QR Code</p>`;
      }
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};

// Example: Add event listener if you want to trigger the QR code generation on button click
document.querySelector("#generateButton").addEventListener("click", generateQR);
