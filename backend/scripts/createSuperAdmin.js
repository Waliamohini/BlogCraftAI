/**
 * One-time script to create the first super admin.
 * Run ONCE from the backend directory:
 *
 *   node scripts/createSuperAdmin.js
 *
 * Then DELETE or DO NOT commit this file with real credentials.
 */

import mongoose from "mongoose";
import "dotenv/config";
import SuperAdmin from "../lib/models/superAdminModel.js";

const EMAIL = "superadmin@blogcraft.ai";   // ← change this
const PASSWORD = "ChangeMe@2024!";          // ← change this

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB connected");

  const existing = await SuperAdmin.findOne({ email: EMAIL });
  if (existing) {
    console.log("Super admin already exists:", EMAIL);
    process.exit(0);
  }

  await SuperAdmin.create({ email: EMAIL, password: PASSWORD });
  console.log("Super admin created:", EMAIL);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
