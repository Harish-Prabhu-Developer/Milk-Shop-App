import { API_URL } from "@env";
import { Product } from "../../../@types/Product";

// HTML template for Product Report PDF
export const ProductPDFTemplate = (rows: Product[]) => `
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 30px;
        color: #333;
        background-color: #f9f9fb;
      }
      h1 {
        text-align: center;
        color: #2c3e50;
        font-size: 26px;
        margin-bottom: 25px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        table-layout: fixed; /* ensures equal width distribution */
      }
      th, td {
        padding: 12px 10px;
        border-bottom: 1px solid #e0e0e0;
        font-size: 13px;
        color: #444;
        text-align: left;
        vertical-align: top;
        word-wrap: break-word;
      }
      th {
        background: linear-gradient(135deg, #3D8BFD, #0056D2);
        color: white;
        font-size: 14px;
      }
      tr:nth-child(even) {
        background-color: #f7f9fc;
      }
      tr:hover {
        background-color: #eef2f9;
      }
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #ddd;
        display: block;
        margin: auto;
      }
      .price {
        font-weight: bold;
        color: #2c7a7b;
      }
      /* Column widths */
      th:nth-child(1), td:nth-child(1) { width: 70px; text-align: center; }
      th:nth-child(2), td:nth-child(2) { width: 120px; }
      th:nth-child(3), td:nth-child(3) { width: 220px; }
      th:nth-child(4), td:nth-child(4) { width: 160px; }
      th:nth-child(5), td:nth-child(5) { width: 100px; }
      th:nth-child(6), td:nth-child(6) { width: 80px; }
      th:nth-child(7), td:nth-child(7) { width: 90px; text-align: right; }
    </style>
  </head>
  <body>
    <h1>Product Report</h1>
    <table>
      <tr>
        <th>Image</th>
        <th>Product Name</th>
        <th>Description</th>
        <th>Nutrition</th>
        <th>Category</th>
        <th>Unit</th>
        <th>Price</th>
      </tr>
      ${rows
        .map(
          c => `
          <tr>
            <td><img src="${API_URL}/${c.image}" alt="Product" /></td>
            <td>${c.name}</td>
            <td>${c.description}</td>
            <td>${c.nutrition.split(",").join("<br/>")}</td>
            <td>${c.category}</td>
            <td>${c.unit}</td>
            <td class="price">₹ ${c.price.toFixed(2)}</td>
          </tr>`
        )
        .join("")}
    </table>
  </body>
</html>
`;
