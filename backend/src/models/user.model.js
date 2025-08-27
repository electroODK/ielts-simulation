import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }], // назначенные тесты
  solved_tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }], // выполненные тесты
  feedback: { type: String, default: "" }, // комментарий от админа
  status: { 
    type: String, 
    enum: ["ready", "notest"], 
    default: "notest" 
  }
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;