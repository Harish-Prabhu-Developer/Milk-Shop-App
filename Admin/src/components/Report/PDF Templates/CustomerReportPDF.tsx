import { Branch } from "../../../@types/User";

// html template for invoice
export const CustomerPDFTemplate = (rows: Branch[]) =>   
`
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
        <h1>Customer Report</h1>
        <table>
          <tr>
            <th>Branch</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Location</th>
            <th>Contact Person</th>
          </tr>
          ${rows
            .map(
              c => `
                <tr>
                  <td>${c.branchName}</td>
                  <td>${c.email}</td>
                  <td>${c.phone}</td>
                  <td>${c.type}</td>
                  <td>${c.location}</td>
                  <td>${c.contactPerson?c.contactPerson:"-"}</td>
                </tr>`
            )
            .join("")}
        </table>
      </body>
    </html>
  `;