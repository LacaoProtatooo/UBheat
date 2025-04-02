// seedUsers.js
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import User from "../models/user.js"; 

connectDB()
  .then(() => {
    console.log("MongoDB connected.");
    seedUsers();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedUsers = async () => {
  try {
    // Optional: Uncomment the following lines to clear out existing users before seeding
    // await User.deleteMany({});
    // console.log("Old users removed.");

    const users = [];
    for (let i = 0; i < 100; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const gender = faker.helpers.arrayElement(["Male", "Female", "Other"]);
      const email = faker.internet.email(firstName, lastName);
      const rawPassword = "password123"; // default password for seeded users
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      users.push({
        firstName,
        lastName,
        gender,
        email,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        // Optionally add image values if needed
      });
    }

    const insertedUsers = await User.insertMany(users);
    console.log(`${insertedUsers.length} users have been seeded successfully.`);
    process.exit();
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};
