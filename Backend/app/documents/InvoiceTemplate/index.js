
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

module.exports = ({customer_id, invoiceItem, _id}) => {
    const today = new Date();
    const dueDate = new Date();

    dueDate.setDate(today.getDate()+30);
    let total = 0;

    return ` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Example 1</title>
        <style>
        .clearfix:after {
          content: "";
          display: table;
          clear: both;
        }
        html {
          -webkit-print-color-adjust: exact;
        }
        
        a {
          color: #5D6975;
          text-decoration: underline;
        }
        
        body {
          position: relative;
          width: 100%;  
          height: 29.7cm; 
          margin: 0 auto; 
          color: #001028;
          background: #FFFFFF; 
          font-family: Arial, sans-serif; 
          font-size: 12px; 
          font-family: Arial;
        }
        
        header {
          padding: 10px 0;
          margin-bottom: 30px;
        }
        
        #logo {
          text-align: center;
          margin-bottom: 10px;
        }
        
        #logo img {
          width: 90px;
        }
        
        h1 {
          border-top: 1px solid  #5D6975;
          border-bottom: 1px solid  #5D6975;
          color: #5D6975;
          font-size: 2.4em;
          line-height: 1.4em;
          font-weight: normal;
          text-align: center;
          margin: 0 0 20px 0;
          background: url(dimension.png);
        }
        
        #project {
          float: left;

          margin-left: 3px;
        }
        
        #project span {
          color: #5D6975;
          text-align: right;
          width: 52px;
          margin-right: 10px;
          display: inline-block;
          font-size: 0.8em;
        }
        
        #company {
          float: right;
          text-align: right;
          margin-right: 15px;
        }
        
        #project div,
        #company div {
          white-space: nowrap;        
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          margin-bottom: 20px;
        }
        
        table tr:nth-child(2n-1) td {
          background-color: #F5F5F5;
        }
        
        
        table th,
        table td {
          text-align: center;
        }
        
        table th {
          padding: 5px 20px;
          color: #5D6975;
          border-bottom: 1px solid #C1CED9;
          white-space: nowrap;        
          font-weight: normal;
        }
        
        table .service,
        table .desc {
          text-align: left;
        }
        
        table td {
          padding: 20px;
          text-align: right;
        }
        
        table td.service,
        table td.desc {
          vertical-align: top;
        }
        
        table td.unit,
        table td.qty,
        table td.total {
          font-size: 1.2em;
        }
        
        table td.grand {
          border-top: 1px solid #5D6975;;
        }
        
        #notices .notice {
          color: #5D6975;
          font-size: 1.2em;
        }
        
        footer {
          color: #5D6975;
          width: 100%;
          height: 30px;
          position: absolute;
          bottom: 0;
          border-top: 1px solid #C1CED9;
          padding: 8px 0;
          text-align: center;
          max-width: 100%;
        }

        .container{
          max-width: 100%;

          margin: auto 0;
        }
        </style>
      </head>
      <body>
      <div class="container">
        <header class="clearfix">
          <div id="logo">
          <img src={require("./logo.png")}/>
          </div>
          <h1>INVOICE</h1>
          <div id="company" class="clearfix">
            <div>Company Name</div>
            <div>455 Foggy Heights,<br /> AZ 85004, US</div>
            <div>(602) 519-0450</div>
            <div><a href="mailto:company@example.com">company@example.com</a></div>
          </div>
          <div id="project">

            <div><span>CLIENT</span> ${customer_id.Name}</div>
            <div><span>ADDRESS</span> ${customer_id.Address}, ${customer_id.City}</div>
            <div><span>EMAIL</span> <a href="mailto:${customer_id.Email}">${customer_id.Email}</a></div>
            <div><span>DATE</span> ${formatDate(today)}</div>
            <div><span>DUE DATE</span> ${formatDate(dueDate)}</div>
            <div><span>BILL NO</span> ${10}</div>
          </div>
        </header>
        <main>
          <table class="my-table">
            <thead>
              <tr>
                <th class="service">PRODUCT</th>
                <th class="desc">DESCRIPTION</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>

            ${invoiceItem.map((row,index)=>{
                total+= row.item_id.selling_price * row.quantity
                return `
                <tr>
                  <td class="service">${row.item_id.Name}</td>
                  <td class="desc">Invoice item</td>
                  <td class="unit">&#x20B9; ${row.item_id.selling_price}</td>
                  <td class="qty">${row.quantity}</td>
                  <td class="total">&#x20B9; ${ccyFormat(row.item_id.selling_price * row.quantity)}</td>
                </tr>
                `
            })}
              
              <tr>
                <td colspan="4">SUBTOTAL</td>
                <td class="total">&#x20B9; ${ccyFormat(total)}</td>
              </tr>
              <tr>
                <td colspan="4">TAX 18%</td>
                <td class="total">&#x20B9;${ccyFormat(total*0.18)}</td>
              </tr>
              <tr>
                <td colspan="4" class="grand total">GRAND TOTAL</td>
                <td class="grand total">&#x20B9;${ccyFormat(total*1.18)}</td>
              </tr>
            </tbody>
          </table>
        </main>
        <footer>
          Invoice was created on a computer and is valid without the signature and seal.
        </footer>
        </div>
      </body>
    </html>
    `
}