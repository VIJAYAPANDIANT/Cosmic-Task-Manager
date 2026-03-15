# 67 - Cosmic Task Manager: Implementation Deep Dive

Welcome to the technical documentation for **67**, a premium cosmic-themed To-Do application. This document provides an exhaustive explanation of the architectural decisions, design patterns, and implementation details that power this application.

---

## 🌌 1. Visual Design Architecture: The "Galaxy" Engine

The primary design goal was to create a "WOW" experience through a dynamic and immersive cosmic background. This is achieved through a multi-layered CSS and JavaScript animation engine.

### Star Field Generation (`app.js`)

Instead of static images, the starfield is procedurally generated at runtime.

- **Dynamic Creation**: The `generateStars` function in `app.js` creates `150` stars for the foreground and `100` for the background.
- **Randomization**: Each star is assigned a random `size` (0-2px), `top/left` position, `animation-delay`, and `twinkle-duration`.
- **CSS Variable Injection**: We inject a `--duration` CSS variable into each star element, allowing unique twinkling frequencies per star using a single `@keyframes twinkle`.

### Motion & Parallax (`style.css`)

To create depth, we implemented a three-layer parallax system:

1. **Foreground Stars**: Large, bright stars that rotate slowly over `200s`.
2. **Background Stars (`.slow`)**: Smaller, dimmer stars that rotate even slower (`400s`), creating a sense of vast distance.
3. **Drifting Nebulae**: Three large, blurred gradient elements (`.nebula-1`, `2`, `3`) that use a complex `float` animation, combining translation, scaling, and rotation to simulate cosmic gas movement.

---

## 🔐 2. Authentication & View Management

The application features a single-page architecture that manages views without page reloads.

### Secure View Switching

- **LocalStorage Presence**: On load, `app.js` checks for a `currentUser` in `localStorage`. If absent, it forces the `authView`.
- **Toggle Logic**: The Login and Register forms are handled by a simple `.hidden` class toggle, managed by event listeners on the "Register" and "Login" anchor tags.
- **Placeholder Security**: The current implementation includes `async` placeholders for MySQL integration, preparing the application for full server-side hashing and authentication tokens.

---

## 🛠️ 3. Task Logic & History Engine

### CRUD Operations

- **Create**: Uses `unshift()` to ensure new tasks appear at the top of the list, providing immediate feedback.
- **Read**: The `renderTasks()` function escapes HTML to prevent XSS and dynamically generates the Glassmorphic list items.
- **Update/Edit**: Managed via a global `editModal` that populates with the current task text, allowing for inline updates.
- **Delete**: Includes a CSS transition (`translateX(50px)`) to provide a "swipe-away" feel before the item is removed from the array.

### History Logging (`Task History`)

Every action is captured by the `addToHistory()` function:

- Every time a task is created, toggled, or deleted, a new entry is added to a `history` array.
- Each entry includes a `taskId`, `action type`, the `original text`, and a precise `ISO timestamp`.
- The **View History** modal provides a chronological audit log of all cosmic activity.

---

## 🗄️ 4. Data Architecture: MySQL Integration

The project includes a robust `schema.sql` designed for high-scale user management.

### Schema Design

- **`users` Table**: Features unique constraints on `username` and `email` to prevent duplication.
- **`tasks` Table**: Linked via `FOREIGN KEY (user_id)` with `ON DELETE CASCADE`, ensuring that when a user is removed, their tasks follow.
- **`task_history` Table**: Specifically designed to store the audit trail for every task, allowing for future analytics on productivity.

---

## 📑 5. Technical Implementation Details

| Feature     | Implementation                             | Key Files     |
| :---------- | :----------------------------------------- | :------------ |
| **Styling** | Vanilla CSS3 (Custom Properties / Flexbox) | `style.css`   |
| **State**   | `localStorage` + Memory Arrays             | `app.js`      |
| **Icons**   | SVG Font (Font Awesome 6)                  | `index.html`  |
| **Fonts**   | Google Fonts (Outfit)                      | `index.html`  |
| **Favicon** | Procedurally generated 32x32 icon          | `favicon.png` |

---

## 🚀 6. Future Roadmap

- [ ] Implement live MySQL integration via MCP Server.
- [ ] Add password hashing using `bcrypt` placeholders.
- [ ] Add drag-and-drop task reordering.
- [ ] Implement a "Shooting Star" random event system.

---

## 👤 Created by 67

### Vijayapandian T

**67 Team** | _Code the Stars._
