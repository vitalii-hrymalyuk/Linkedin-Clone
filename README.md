# LinkedIn Clone

This project is a LinkedIn-like social networking application that allows users to connect, post updates, comment, and interact with each other's profiles. It includes authentication, notification systems, and CRUD functionality for posts and profiles, providing a comprehensive set of features for user interaction.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

---

## Features

### Backend
- **Authentication**: Register and login with JWT-based authentication.
- **Posts**: Create, edit, delete posts with optional image upload (via Cloudinary). Users can also like and comment on posts.
- **Connections**: Send and respond to connection requests (accept/reject).
- **Notifications**: Users receive notifications for likes, comments, and connection requests.
- **Profile Management**: Users can update profile details, including profile picture, banner, skills, education, experience, and about information.
- **Email Notifications**: Sends email notifications using Mailtrap.

### Frontend
- **Login/Register**: User authentication with error handling and toasts for feedback.
- **Posts Feed**: Users can view, create, edit, and delete posts. Post interactions include commenting and liking.
- **Network Page**: A page to view, accept, or reject connection requests.
- **Notifications**: A notifications page to view, delete, and mark notifications as read.
- **Profile Page**: Users can edit their profile information, upload images, and manage personal details.
- **Single Post Page**: Each post has a dedicated page where users can see all comments and interactions.
- **User Profiles**: Visit other users' profiles and send connection requests.

---

## Tech Stack

### Backend
- **[Node.js](https://nodejs.org/docs/latest/api/)** with **[Express.js](https://expressjs.com/)**: API server and routing.
- **[MongoDB](https://www.mongodb.com/docs/)** with **[Mongoose](https://mongoosejs.com/docs/)**: Database and ORM for data management.
- **[Cloudinary](https://cloudinary.com/documentation)**: Image storage and management.
- **[Mailtrap](https://help.mailtrap.io/article/12-getting-started-guide)**: Sending email notifications.
- **[JWT](https://jwt.io/introduction)**: Authentication.
- **[TypeScript](https://www.typescriptlang.org/docs/)**: Type-safe code and enhanced development experience.

### Frontend
- **[React](https://react.dev/)** with **[TypeScript](https://www.typescriptlang.org/docs/)**: Frontend framework and type-safe code.
- **[React Router DOM](https://reactrouter.com/en/main/start/tutorial)**: Client-side routing for page navigation.
- **[React Hot Toast](https://react-hot-toast.com/docs)**: Toast notifications for feedback on user actions.
- **[TanStack React Query](https://tanstack.com/query/latest/docs)**: Data fetching, caching, and state management.
- **[TailwindCSS](https://v2.tailwindcss.com/docs)**: Styling and layout.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) instance
- [Cloudinary](https://cloudinary.com/) account
- [Mailtrap](https://mailtrap.io/) account for email notifications

### Clone the Repository

 - git clone https://github.com/vitalii-hrymalyuk/linkedin-clone

## Backend Setup

1. Navigate to the project directory
```bash
   cd backend
```
2. Install dependencies:
```bash
   # Using npm
   npm install

   # Or using yarn
   yarn install
```
3. Create an .env file in root folder
4. Set up environment variables by adding the following to your `.env` file:

```env
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   NODE_ENV=production
   CLIENT_URL=<Frontend URL, e.g., http://localhost:5173>
   MAILTRAP_TOKEN=<Your Mailtrap API token>
   EMAIL_FROM=<Your Mailtrap sender email>
   EMAIL_FROM_NAME=<Sender's name for Mailtrap emails>
   CLOUDINARY_NAME=<Your Cloudinary cloud name>
   CLOUDINARY_API_KEY=<Your Cloudinary API key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API secret>
```

5. Start the backend server:

```bash
  Development:
    npm run start:dev
  Production: 
   npm run start
```

## Frontend Setup

1. Navigate to the project directory
```bash
   cd frontend
```
2. Install dependencies:
```bash
   # Using npm
   npm install

   # Or using yarn
   yarn install
```
4. Start the frontend server:
```bash
   npm run dev
```
---
### Environment Variables

## In both backend/.env and frontend/.env files, add the following variables:

## Backend .env
```bash
PORT=5000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
NODE_ENV=production
CLIENT_URL=<Frontend URL, e.g., http://localhost:5173>
MAILTRAP_TOKEN=<Your Mailtrap API token>
EMAIL_FROM=<Your Mailtrap sender email>
EMAIL_FROM_NAME=<Sender's name for Mailtrap emails>
CLOUDINARY_NAME=<Your Cloudinary cloud name>
CLOUDINARY_API_KEY=<Your Cloudinary API key>
CLOUDINARY_API_SECRET=<Your Cloudinary API secret>
```
## Frontend .env
```bash
VITE_BACKEND_URL=<Backend URL, e.g., http://localhost:5000>
```
--- 

### Usage
- Register a New User: Visit the registration page and create a new account.
- Login: Log in with your credentials.
- Create, Delete Posts: Add new posts with optional images, and delete them.
- Like and Comment on Posts: Interact with posts through likes and comments.
- Connect with Other Users: Send, accept, or reject connection requests.
- View Notifications: Check notifications for likes, comments, and connection requests.
- Profile Management: Customize your profile, adding skills, experience, education, and more.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## License

This project is licensed under the MIT License.

---

## Contact Information

- **Author**: Vitalii Hrymalyuk
- **Email**: [vitalii.hrymalyuk@gmail.com](mailto:vitalii.hrymalyuk@gmail.com)

Feel free to reach out if you have any questions or need assistance setting up the project.
