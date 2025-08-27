const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // для JWT логина
});
export default mongoose.model("Admin", adminSchema);