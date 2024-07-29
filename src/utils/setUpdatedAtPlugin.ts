import { CallbackWithoutResultAndOptionalError, Schema } from 'mongoose';

function setUpdatedAt(next: CallbackWithoutResultAndOptionalError) {
  this.set({ updatedAt: Date.now() });
  next();
}

export function setUpdatedAtPlugin(schema: Schema) {
  schema.pre('save', setUpdatedAt);
  schema.pre('findOneAndUpdate', setUpdatedAt);
  schema.pre('updateOne', setUpdatedAt);
  schema.pre('updateMany', setUpdatedAt);
  return schema;
}
