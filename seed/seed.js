const bcrypt = require("bcryptjs");
const { insertUser } = require("../db/user"); // Update with the correct path

const users = [
  {
    name: "Admin",
    email: "admin@dancehub.com",
    password: "12345678",
    role: "organisation",
  },
];

const seedDatabase = async () => {
  for (const user of users) {
    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    // Insert user into database
    try {
      await insertUser(user);
      console.log(`Inserted user: ${user.email}`);
    } catch (error) {
      console.error(`Error inserting user: ${user.email}`, error);
    }
  }
};

seedDatabase();
