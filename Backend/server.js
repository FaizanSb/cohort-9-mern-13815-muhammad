import dotenv from "dotenv";
import app from "./src/app.js";
import mongoose from "mongoose";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
if (mongoose.connection.readyState === 1) {
  console.log("Connected to MongoDB");
}else {
  console.error("Failed to connect to MongoDB");
  process.exit(1);
}



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});