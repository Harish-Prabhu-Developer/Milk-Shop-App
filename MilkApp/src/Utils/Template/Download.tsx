import { Order } from "../@types/Order";
import { formatDate, GetTime } from "../CustomFunctions/DateFunctions";

// html template for invoice
export const InvoiceTemplate = (Order: Order) =>   

        `
<html>
  <head>
    <style>
      body {
        font-family: 'Helvetica Neue', sans-serif;
        padding: 24px;
        font-size: 14px;
        color: #333;
      }
      h1 {
        color: #0D6EFD;
        font-size: 24px;
        margin-bottom: 4px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        border-bottom: 2px solid #ddd;
        padding-bottom: 12px;
      }
      .info {
        margin-bottom: 16px;
      }
      .info p {
        margin: 4px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
      }
      th {
        background-color: #f5f5f5;
        color: #333;
      }
      tfoot td {
        font-weight: bold;
      }
      .total {
        margin-top: 20px;
        text-align: right;
        font-size: 16px;
        color: #000;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>Invoice</h1>
        <p><strong>Order #:</strong> ${Order.OrderId}</p>
      </div>
      <div style="text-align: right;">
        <p><strong>Date:</strong> ${formatDate(Order.OrderDate)}</p>
        <p><strong>Time:</strong> ${GetTime(Order.OrderDate)}</p>
      </div>
    </div>

    <div class="info">
      <p><strong>Customer Name:</strong> ${Order.Branch?.branchName}</p>
      <p><strong>Customer ID:</strong> ${Order.Branch?.id}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${Order.ProductData.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total">
      Grand Total: ₹${Order.TotalAmount.toFixed(2)}
    </div>

    <div class="footer">
      Thank you for your order!<br/>

    </div>
  </body>
</html>
`;