// const axios = require('axios');


// async function ItemNameById(item_id){
//   try{
//     const response = await axios.get(
//       `http://127.0.0.1:8081/api/items/getItemById/${item_id}`
//     );
//     console.warn(response);
//     return response;
//   }
//   catch(error){
//     console.log(error);
//     return error;
//   }
// }

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Extract the day from the formatted date
  const day = Number(formattedDate.split(' ')[0]);

  // Add "th", "st", "nd", or "rd" suffix based on the day
  let daySuffix;
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = 'st';
  } else if (day === 2 || day === 22) {
    daySuffix = 'nd';
  } else if (day === 3 || day === 23) {
    daySuffix = 'rd';
  } else {
    daySuffix = 'th';
  }

  // Replace the day in the formatted date with the formatted day
  const formattedDay = `${day}${daySuffix}`;
  const formattedDateWithDay = formattedDate.replace(day, formattedDay);

  return formattedDateWithDay;
};

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

module.exports = ({inputFields, customerName}) =>{
  // const itemNames = Promise.all(inputFields.map(async (input, index) => {
  //   return await ItemNameById(input.item_id);
  // }));
  const today = new Date();
  let total = 0;
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Challan</title>
      <style>
      .challan-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      
      .challan-title {
        text-align: center;
      }
      
      .challan-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      .challan-label {
        font-weight: bold;
      }
      
      .challan-items {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .item-header {
        font-weight: bold;
        text-align: left;
        padding: 8px;
        border-bottom: 1px solid #000;
      }
      
      .item-name,
      .item-quantity,
      .item-rate,
      .item-amount {
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }
      
      .challan-total {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
      }
      
      .challan-notes {
        display: flex;
        justify-content: space-between;
      }
      
      .challan-label,
      .challan-value {
        margin: 0;
      }
      
      </style>
    </head>
    <body>
      <div class="challan-container">
        <h1 class="challan-title">Challan</h1>
        <div class="challan-details">
          <p class="challan-label">Customer Name:</p>
          <p class="challan-value">${customerName}</p>
        </div>
        <div class="challan-details">
          <p class="challan-label">Date:</p>
          <p class="challan-value">${formatDate(today)}</p>
        </div>

        
        <table class="challan-items">
          <tr>
            <th class="item-header">Item</th>
            <th class="item-header">Quantity</th>
            <th class="item-header">Rate</th>
            <th class="item-header">Amount</th>
          </tr>

          ${inputFields.map((input, index) => {
            total += input.item_price * input.quantity
            return `<tr>
              <td class="item-name">${input.item_name}</td>
              <td class="item-quantity">${input.quantity}</td>
              <td class="item-rate">&#x20B9;${ccyFormat(input.item_price)}</td>
              <td class="item-amount">&#x20B9;${ccyFormat(input.item_price * input.quantity)}</td>
            </tr>`;

            
          }).join('')}
        </table>
        <div class="challan-total">
          <p class="challan-label">Total:</p>
          <p class="challan-value">&#x20B9;${ccyFormat(total)}</p>
        </div>
        <div class="challan-notes">
          <p class="challan-label">Notes:</p>
          <p class="challan-value">Thank you for your Order.</p>
        </div>
      </div>
    </body>
    </html>
    `
}