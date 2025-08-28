import { formatDate } from "../../../utils/CustomFunctions/DateFunctions";

export const SalesPDFTemplate = (rows: any[]) => `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          th {
            background-color: #3D8BFD;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-size: 14px;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
            color: #555;
            text-align: left;
            font-weight: 800;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          tr:hover {
            background-color: #eef2f7;
          }
        </style>
      </head>
      <body>
        <h1>Sales Report</h1>
        <table>
          <tr>
            <th>Branch</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Price</th>
            <th>Total</th>
            <th>Liter</th>
            <th>Paid</th>
          </tr>
          ${rows
            .map(
              r => `
                <tr>
                    <td>${r.branchName}</td>
                    <td>${r.phone}</td>
                    <td>${formatDate(r.date)}</td>
                    <td>${r.price.toFixed(2)}</td>
                    <td>${r.total.toFixed(2)}</td>
                    <td>${r.liter.toFixed(2)}</td>
                    <td>${r.paid}</td>
                </tr>`,
            )
            .join('')}
        </table>
      </body>
    </html>`;
