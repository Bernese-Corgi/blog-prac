import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

/* ----------------------------------- 스키마 ---------------------------------- */
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

/* ---------------------------------- 모델 생성 --------------------------------- */
const User = mongoose.model('User', UserSchema);

export default User;
