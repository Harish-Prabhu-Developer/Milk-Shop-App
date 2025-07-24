import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../@types/Product';

interface ProductSliceState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductSliceState = {
  products: [
      {
        id: '1',
        name: 'Full Cream Milk',
        price: 28.5,
        unit: '1 Litre',
        category: 'Milk', 
        isActive: true,
        description: 'Rich and creamy milk with high fat content. Ideal for desserts and full-bodied taste.',
        nutrition: 'Energy: 70 kcal, Fat: 4.5g, Protein: 3.5g, Carbs: 4.9g',
        image: require('../../assets/ProductImages/Milk.png'),
      },
      {
        id: '2',
        name: 'Toned Milk',
        price: 25.0,
        unit: '1 Litre',
        category: 'Milk',
        isActive: true,
        description: 'Milk with reduced fat content while retaining nutrients. Suitable for daily consumption.',
        nutrition: 'Energy: 58 kcal, Fat: 3.0g, Protein: 3.1g, Carbs: 4.8g',
        image: require('../../assets/ProductImages/Milk.png'),
      },
      {
        id: '3',
        name: 'Skimmed Milk',
        price: 23.0,
        unit: '1 Litre',
        category: 'Milk',
        isActive: true,
        description: 'Fat-free milk, ideal for weight-conscious consumers and protein-rich diets.',
        nutrition: 'Energy: 35 kcal, Fat: 0.1g, Protein: 3.4g, Carbs: 5.0g',
        image: require('../../assets/ProductImages/Milk.png'),
      },
      {
        id: '4',
        name: 'Curd',
        price: 35.0,
        unit: '500 gm',
        category: 'Milk',
        isActive: true,
        description: 'Thick and fresh curd made from pure milk. Good source of probiotics.',
        nutrition: 'Energy: 98 kcal, Fat: 4.3g, Protein: 3.1g, Carbs: 11g',
        image: require('../../assets/ProductImages/Gurd.png'),
      },
      {
        id: '5',
        name: 'Paneer',
        price: 85.0,
        unit: '200 gm',
        category: 'Milk',
        isActive: true,
        description: 'Soft and fresh paneer ideal for cooking and grilling. Rich in protein and calcium.',
        nutrition: 'Energy: 265 kcal, Fat: 21g, Protein: 18g, Carbs: 1.2g',
        image: require('../../assets/ProductImages/Panner.png'),
      },
      {
        id: '6',
        name: 'Ghee',
        price: 450.0,
        unit: '500 ml',
        category: 'Milk',
        isActive: true,
        description: 'Pure desi ghee made from cow milk. Enhances flavor and digestion.',
        nutrition: 'Energy: 900 kcal, Fat: 100g, Protein: 0g, Carbs: 0g',
        image: require('../../assets/ProductImages/Ghee.png'),
      },
      {
        id: '7',
        name: 'Butter',
        price: 75.0,
        unit: '100 gm',
        category: 'Milk',
        isActive: true,
        description: 'Creamy and smooth butter made from churned cream. Perfect for toast or baking.',
        nutrition: 'Energy: 717 kcal, Fat: 81g, Protein: 0.85g, Carbs: 0.06g',
        image: require('../../assets/ProductImages/Butter.png'),
      },
  ],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const idToUpdate = String(action.payload.id);
      const index = state.products.findIndex(p => String(p.id) === idToUpdate);
      if (index !== -1) {
        state.products[index] = {
          ...action.payload,
          id: idToUpdate, // Ensure ID remains consistent
        };
      } else {
        console.warn(`Product with id ${idToUpdate} not found`);
      }
    },


  },
});

export const { addProduct, removeProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
