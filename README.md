# Scrum Team Management App

A web-based Scrum management tool designed to help teams manage product backlogs, sprint planning, and task tracking through an interactive Kanban board.

## Features

- **User Authentication System**
  - Login system with admin and user roles
  - Session handling using localStorage

- **Admin Dashboard**
  - Create, edit, and delete team members
  - Automatically generate usernames and assign default passwords
  - Manage team data dynamically

- **Product Backlog Management**
  - Create and manage Product Backlog Items (PBIs)
  - Store and update tasks using localStorage

- **Sprint Backlog System**
  - Create and manage sprints
  - Assign PBIs to specific sprints
  - Track sprint status (Not Started, In Progress, Completed)

- **Kanban Board**
  - Visual task tracking system per sprint
  - Move tasks across columns (To Do, In Progress, Done)
  - Sprint-specific task loading using URL parameters and localStorage

- **Dynamic Navigation**
  - Role-based navigation (admin vs user)
  - Protected routes (redirect if not logged in)

---

## 🛠️ Tech Stack

- HTML
- CSS
- JavaScript (Vanilla)
- LocalStorage (for data persistence)

---

##  My Contributions

- Designed and implemented the **Admin Page**
  - CRUD functionality for team members
  - Dynamic UI updates using DOM manipulation

- Built the **Login System**
  - Authentication logic (admin + user roles)
  - LocalStorage session handling
  - Redirect logic for protected pages

- Developed the **Sprint Backlog System**
  - Sprint creation, editing, and deletion
  - Task assignment logic
  - State management for sprint lifecycle

- Implemented **Kanban Board Integration**
  - Dynamic task loading per sprint
  - URL parameter handling and fallback using localStorage
  - Task state transitions

- Improved **Navigation & Access Control**
  - Role-based UI rendering
  - Page protection logic

---

##  Notes

- Data is stored in **localStorage** (no backend)
- Requires proper navigation flow (sprint must be selected before viewing Kanban)

---

## Future Improvements

- Backend integration (database + authentication)
- Persistent user accounts
- Real-time updates (WebSockets)
- Better state management (React or similar)
