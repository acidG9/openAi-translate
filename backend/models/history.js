import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const historySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: { type: [Object], required: true },
  nickname: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default model('History', historySchema);
