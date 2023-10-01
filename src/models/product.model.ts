import mongoose from 'mongoose';
import {customAlphabet} from 'nanoid';
import {User} from '../types';

const nanoid = customAlphabet('acbdefghijklmnopqrstuvwxyz0123456789', 10);
export interface ProductDocument {
  user: User['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoid()}`,
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
  },

  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
