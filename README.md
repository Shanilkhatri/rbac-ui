# Role-Based Access Control (RBAC) Dashboard

This project implements a **Role-Based Access Control (RBAC)** dashboard UI built with **React**, where user can manage roles, permissions, and users. The app is protected by authentication, and only authorized user can access the application. It uses **JSON Server** to simulate API calls for CRUD operations on users, roles, and permissions.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
   - [Install Dependencies](#install-dependencies)
   - [Run JSON Server](#run-json-server)
   - [Start the React App](#start-the-react-app)
5. [Authentication](#authentication) `how to login`
6. [Project Structure](#project-structure)
7. [Faking API Calls with JSON Server](#faking-api-calls-with-json-server)


## Project Overview

This is an **RBAC Dashboard** application where an admin can:

- **Manage Users**: View, add, edit, or delete users and assign roles to them.
- **Manage Roles**: Define, edit, and assign permissions to roles.
- **Manage Permissions**: Set, modify, and display permissions assigned to users and roles.
- **Login**: A login page is provided to authenticate users before accessing the dashboard. Only authenticated users can access protected pages.

The app is built using **React** and employs **JSON Server** to simulate API calls, allowing the app to work as if it's interacting with a real backend.

## Features

- **User Management**: Add, edit, delete users, and assign roles to them.
- **Role Management**: Define and edit roles, assign permissions (e.g., Read, Write, Delete).
- **Dynamic Permissions**: Assign or modify permissions for roles and users.
- **Protected Routes**: Only authenticated users can access the dashboard pages.
- **Login System**: Mock authentication system with hardcoded credentials for simplicity.

## Technologies Used

- **React**: Frontend framework for building the UI.
- **React Router**: To handle navigation and protected routes.
- **JSON Server**: To mock backend API calls for users, roles, and permissions.
- **Material UI**: For UI components like AppBar, Buttons, Forms, etc.
- **localStorage**: To store the authentication token for managing sessions.

## Setup Instructions

### Install Dependencies

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:Shanilkhatri/rbac-ui.git
   cd rbac-ui
2. Install the required dependencies for React and JSON Server:

   ```bash 
    npm install

### Run JSON Server

To simulate API calls for users, roles, and permissions, we use json-server. Here's how to set it up:

1. Go to the root directory of the project and create a `db.json` file to hold mock data (this will act as a database).

    **For your convinience I have already added that so you can just skip this part!**

2. Start the JSON Server to mock the API:

   ``` bash
    npx json-server --watch db.json --port 3001

**Please use the same port as I have hardcoded it in my application for simplicity.**

3. This will start the JSON server on http://localhost:3001

### Start the React App

Once the JSON Server is running, you can start the React app:

   ```bash
   npm start
   ```
> run the command in the new window so that both json-server and react app run simultaneously.

1. This will open the app in your browser at http://localhost:3000

## Authentication 

The login page uses hardcoded credentials for testing purposes. The username and password are as follows:

 - Username: `admin`
 - Password: `password123`

>The app stores the authentication token in localStorage upon successful login. This token is used to manage user sessions, and the dashboard pages are protected using a custom ProtectedRoute component.


## Project Structure

Here is a breakdown of the folder structure (only main files):

```rbac-dashboard/
├── public/               # Public assets
│   └── index.html        # Entry point for React
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   │   └── DashboardLayout.tsx  # DashboardLayout route component
│   │   └── ProtectedRoute.tsx  # Protected route component
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx     # Login page component
│   │   ├── UsersPage.tsx     # Users management page
│   │   ├── RolesPage.tsx     # Roles management page
│   │   └── PermissionsPage.tsx # Permissions management page
│   ├── services/         # Service functions
│   │   └── authService.js  # Authentication logic
│   │   └── roleService.js  # Role & Permission API Calls
│   │   └── userService.js  # User API Calls
│   ├── App.tsx           # Main app file where routing is set up
│   └── index.tsx         # React entry point
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Faking API Calls with JSON Server

`json-server` is used to mock the API for this project. It simulates CRUD operations for users, roles, and permissions. You can make API calls like this:

- Get Users: GET http://localhost:3001/users
- Get Roles: GET http://localhost:3001/roles
- Get Permissions: GET http://localhost:3001/permissions
- Create User: POST http://localhost:3001/users
- Create Role: POST http://localhost:3001/roles
- Create Permissions: POST http://localhost:3001/permissions
- Update User: PUT http://localhost:3001/users/{id}
- Update Role: PUT http://localhost:3001/roles/{id}
- Update Permissions: PUT http://localhost:3001/permissions/{id}
- Delete User: DELETE http://localhost:3001/users/{id}
- Delete Role: DELETE http://localhost:3001/roles/{id}
- Delete Permissions: DELETE http://localhost:3001/permissions/{id}

