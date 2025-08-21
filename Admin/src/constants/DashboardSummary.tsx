import { DashboardType } from "../@types/Dashboard";

export const Dashboard:DashboardType={
  "CardAnalytics": {
    "totalOrders": 4,
    "delivered": 2,
    "pending": 0,
    "processing": 1,
    "cancelled": 1,
    "revenue": 139
  },
  "Last7Sales": [
    {
      "label": "Fri",
      "value": 25
    },
    {
      "label": "Sat",
      "value": 0
    },
    {
      "label": "Sun",
      "value": 0
    },
    {
      "label": "Mon",
      "value": 0
    },
    {
      "label": "Tue",
      "value": 0
    },
    {
      "label": "Wed",
      "value": 0
    },
    {
      "label": "Thu",
      "value": 0
    }
  ],
  "Recent5Orders": [
    {
      "id": 1,
      "branchName": "Admin",
      "status": "Processing",
      "amount": 1526,
      "orderdetails": {
        "_id": "68a2ef60b24c539f950affe5",
        "OrderId": "ORD1755508576593Admin276",
        "ProductData": [
          {
            "product": {
              "_id": "6899b16d3175f7b607883a30",
              "name": "Full Cream Milk",
              "price": 28.5,
              "unit": "1 Litre",
              "description": "Rich and creamy milk with high fat content. Ideal for desserts and full-bodied taste.",
              "nutrition": "Energy: 70 kcal, Fat: 4.5g, Protein: 3.5g, Carbs: 4.9g",
              "image": "uploads\\1754902892963-Milk.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 2,
            "_id": "68a2ef60b24c539f950affe6"
          },
          {
            "product": {
              "_id": "6899b24a608cc32ab467868c",
              "name": "Toned Milk",
              "price": 25,
              "unit": "1 Litre",
              "description": "Milk with reduced fat content while retaining nutrients. Suitable for daily consumption.",
              "nutrition": "Energy: 58 kcal, Fat: 3.0g, Protein: 3.1g, Carbs: 4.8g",
              "image": "uploads\\1754903114689-Milk.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 2,
            "_id": "68a2ef60b24c539f950affe7"
          },
          {
            "product": {
              "_id": "689efb9bc5b197d7e8a5c1d0",
              "name": "Skimmed Milk",
              "price": 23,
              "unit": "1 Litre",
              "description": "Fat-free milk, ideal for weight-conscious consumers and protein-rich diets.",
              "nutrition": "Energy: 35 kcal, Fat: 0.1g, Protein: 3.4g, Carbs: 5.0g",
              "image": "uploads\\1755249563294-Milk.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 3,
            "_id": "68a2ef60b24c539f950affe8"
          },
          {
            "product": {
              "_id": "689efc4dc5b197d7e8a5c1d2",
              "name": "Ghee",
              "price": 450,
              "unit": "500 ml",
              "description": "Pure desi ghee made from cow milk. Enhances flavor and digestion.",
              "nutrition": "Energy: 900 kcal, Fat: 100g, Protein: 0g, Carbs: 0g",
              "image": "uploads\\1755249741020-Ghee.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 3,
            "_id": "68a2ef60b24c539f950affe9"
          }
        ],
        "Branch": {
          "_id": "6899a717fbb5deded152c66b",
          "branchName": "Admin",
          "email": "23pca121@anjaconline.org",
          "phone": "9894209220",
          "role": "admin"
        },
        "TotalAmount": 1526,
        "OrderStatus": "Processing",
        "PaymentStatus": "Pending",
        "ReceivedStatus": "Pending",
        "OrderDate": "2025-08-18T09:16:16.602Z",
        "ReceivedItems": [],
        "createdAt": "2025-08-18T09:16:16.611Z",
        "updatedAt": "2025-08-18T09:17:54.977Z",
        "__v": 0,
        "ConfirmOrderDate": "2025-08-18T09:17:54.632Z"
      }
    },
    {
      "id": 2,
      "branchName": "Admin",
      "status": "Cancelled",
      "amount": 25,
      "orderdetails": {
        "_id": "689f950eb44354f6660b41db",
        "OrderId": "ORD1755288846320Admin98",
        "ProductData": [
          {
            "product": {
              "_id": "6899b24a608cc32ab467868c",
              "name": "Toned Milk",
              "price": 25,
              "unit": "1 Litre",
              "description": "Milk with reduced fat content while retaining nutrients. Suitable for daily consumption.",
              "nutrition": "Energy: 58 kcal, Fat: 3.0g, Protein: 3.1g, Carbs: 4.8g",
              "image": "uploads\\1754903114689-Milk.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 1,
            "_id": "689f950eb44354f6660b41dc"
          }
        ],
        "Branch": {
          "_id": "6899a717fbb5deded152c66b",
          "branchName": "Admin",
          "email": "23pca121@anjaconline.org",
          "phone": "9894209220",
          "role": "admin"
        },
        "TotalAmount": 25,
        "OrderStatus": "Cancelled",
        "PaymentStatus": "Pending",
        "ReceivedStatus": "Pending",
        "OrderDate": "2025-08-15T20:14:06.327Z",
        "ReceivedItems": [],
        "createdAt": "2025-08-15T20:14:06.344Z",
        "updatedAt": "2025-08-15T20:14:59.633Z",
        "__v": 0,
        "CancelOrderDate": "2025-08-15T20:14:58.933Z"
      }
    },
    {
      "id": 3,
      "branchName": "Admin",
      "status": "Delivered",
      "amount": 25,
      "orderdetails": {
        "_id": "689ef46ac5b197d7e8a5c10a",
        "OrderId": "ORD1755247722064Admin183",
        "ProductData": [
          {
            "product": {
              "_id": "6899b24a608cc32ab467868c",
              "name": "Toned Milk",
              "price": 25,
              "unit": "1 Litre",
              "description": "Milk with reduced fat content while retaining nutrients. Suitable for daily consumption.",
              "nutrition": "Energy: 58 kcal, Fat: 3.0g, Protein: 3.1g, Carbs: 4.8g",
              "image": "uploads\\1754903114689-Milk.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 1,
            "_id": "689ef46ac5b197d7e8a5c10b"
          }
        ],
        "Branch": {
          "_id": "6899a717fbb5deded152c66b",
          "branchName": "Admin",
          "email": "23pca121@anjaconline.org",
          "phone": "9894209220",
          "role": "admin"
        },
        "TotalAmount": 25,
        "OrderStatus": "Delivered",
        "PaymentStatus": "Pending",
        "ReceivedStatus": "Confirmed",
        "OrderDate": "2025-08-15T08:48:42.075Z",
        "ReceivedItems": [
          {
            "receivedQty": 1,
            "_id": "689f5884f4ba556896881fcf",
            "productId": "689ef46ac5b197d7e8a5c10b"
          }
        ],
        "createdAt": "2025-08-15T08:48:42.079Z",
        "updatedAt": "2025-08-15T15:55:48.277Z",
        "__v": 1,
        "ReceivedDate": "2025-08-15T15:55:48.267Z"
      }
    },
    {
      "id": 4,
      "branchName": "Admin",
      "status": "Delivered",
      "amount": 114,
      "orderdetails": {
        "_id": "689cd1760bfa3b1379c9d332",
        "OrderId": "ORD1755107702761Admin917",
        "ProductData": [
          {
            "product": {
              "_id": "6899b16d3175f7b607883a30",
              "name": "Full Cream Milk",
              "price": 28.5,
              "unit": "1 Litre",
              "description": "Rich and creamy milk with high fat content. Ideal for desserts and full-bodied taste.",
              "nutrition": "Energy: 70 kcal, Fat: 4.5g, Protein: 3.5g, Carbs: 4.9g",
              "image": "uploads\\1754902892963-Milk.png",
              "category": "milk",
              "isActive": true,
              "createdBy": "6899a717fbb5deded152c66b"
            },
            "quantity": 4,
            "_id": "689cd1760bfa3b1379c9d333"
          }
        ],
        "Branch": {
          "_id": "6899a717fbb5deded152c66b",
          "branchName": "Admin",
          "email": "23pca121@anjaconline.org",
          "phone": "9894209220",
          "role": "admin"
        },
        "TotalAmount": 114,
        "OrderStatus": "Delivered",
        "PaymentStatus": "Pending",
        "ReceivedStatus": "Confirmed",
        "OrderDate": "2025-08-13T17:55:02.803Z",
        "ReceivedItems": [
          {
            "receivedQty": 4,
            "_id": "689dc8e0b1ac62d36ff83558",
            "productId": "6899b16d3175f7b607883a30"
          }
        ],
        "createdAt": "2025-08-13T17:55:02.822Z",
        "updatedAt": "2025-08-14T11:30:40.553Z",
        "__v": 3,
        "ReceivedDate": "2025-08-14T11:30:40.551Z"
      }
    }
  ]
}