import { Schema, model, models, type InferSchemaType } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof AdminSchema>;

export default models.Admin || model("Admin", AdminSchema);
