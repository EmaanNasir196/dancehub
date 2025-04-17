# 💃 DanceHub


A web platform for users to manage and offer dance classes online using Node.js, Express.js, Mustache templates, Latin, Neo4J (NeoDB). The student can register, explore many dance styles and enrol (among other things) courses bought on this site.


##  Tech Stack 🚀

- **Backend:** Node.js, Express.js
- **Templating Engine:** Mustache
- **Database:** Nedb (with Promises-based implementation)

## Setting Up Instructions 🔧 

### 1. Clone the Repository

git clone https://github.com/EmaanNasir196/dancehub
cd dancehub

2. Install Dependencies

`npm install`

Development Mode Running 🧪 

npm run dev

It starts the development server, using tool such as nodemon.

 Running 🚀

`npm start`

Then first of all, if it is a first setup, make sure you run npm install.

Seeding the Database 🌱

You may also want to seed the database before proceeding to create an admin user.

`node seed/seed.js`

This will create a default admin:
`• Email: admin@dancehub.com`
`• Password: 12345678`

👥 Addiotional Features
1. Payment Method using stripe 
2. Secure Cookies 
3. Protected Routes

4. Admin / Organization
   • Can log in and create various dance courses.
   • Manages course details (name, type, description, etc.).
   • Generates the Student Lists
    
5. Student
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
