// models/Admin.js
import mongoose from "mongoose";
import User from "./user.js";

const adminSchema = new mongoose.Schema({});

const Admin = User.discriminator("admin", adminSchema);
export default Admin;
