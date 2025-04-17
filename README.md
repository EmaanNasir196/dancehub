# 💃 DanceHub

DanceHub is a web platform built with Node.js, Express.js, Mustache templates, and Neo4j (NeoDB) to allow organizations to manage and offer dance courses online. Students can register, explore various dance styles, and enroll in courses after purchasing them.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Templating Engine:** Mustache
- **Database:** Nedb (with Promises-based implementation)

## 🔧 Setup Instructions

### 1. Clone the Repository

git clone https://github.com/EmaanNasir196/dancehub
cd dancehub

2. Install Dependencies

`npm install`

🧪 Running in Development Mode

npm run dev

This starts the development server using tools like nodemon.

🚀 Running in Production Mode

`npm start`

Make sure to run npm install first if it’s your first time setting up.

🌱 Seeding the Database

Before starting, you may want to seed the database to create an admin user.

`node seed/seed.js`

This will create a default admin:
`• Email: admin@dancehub.com`
`• Password: 12345678`

👥 User Roles & Features

1. Admin / Organization
   • Can log in and create various dance courses.
   • Manages course details (name, type, description, etc.).

2. Student
   • Can sign up on the platform.
   • Browse and enroll in available dance courses after purchase.

🗂 Project Structure (Simplified)

├── seed/
│ └── seed.js # Admin user seeder
├── views/ # Mustache templates
├── routes/ # Express routes
├── models/ # Neo4j models or queries
├── public/ # Static assets
├── index.js # Main Express app
└── README.md # You are here!
└── db # database
