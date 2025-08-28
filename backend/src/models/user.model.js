import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    enum: ["user", "admin", "speaking-checker", "writing-checker"],
    default: "user",
  },
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }], // назначенные тесты
  solved_tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }], // выполненные тесты
  feedback: { type: String, default: "" }, // комментарий от админа
  status: { 
    type: String, 
    enum: ["ready", "notest"], 
    default: "notest" 
  },
  access_token: { type: String, default: "" },
  refresh_token: { type: String, default: "" },
  last_login_date: { type: Date, default: null }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;