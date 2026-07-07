import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const ORDER_STATUSES = ['nouvelle', 'confirmée', 'livrée', 'annulée'];

const OrderItemSchema = new Schema(
  {
    productId: { type: String },
    slug: { type: String },
    name: { type: String, required: true },
    brand: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, default: '' },
    },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'nouvelle', index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || model('Order', OrderSchema);
