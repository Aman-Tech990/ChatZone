# 💬 ChatZone

> **ChatZone started with a simple idea: if two people are talking, the message should not feel like it is travelling through a database before reaching the other person. It should just arrive.**

That idea became ChatZone.

A full-stack real-time chat application where users can create an account, securely log in, find other users, see who is online, open a conversation, send messages instantly, share images, update their profile, switch between **32 different themes**, and keep their conversations persistent across sessions.

The project is built with **React, Tailwind CSS, Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, Zustand and Cloudinary**.

The frontend lives on **Vercel**.

The backend runs on **Render**.

MongoDB keeps the application data persistent.

Cloudinary handles profile and chat image storage.

And Socket.io keeps the conversation alive in real time. ⚡

---

# 🌱 Why ChatZone Exists

A basic chat application can look simple from the outside.

There is a list of users.

There is a message box.

There is a send button.

But the moment the first message has to travel from one browser to another in real time, the story becomes different.

Now the application needs to know:

> Who is logged in?

> Who is currently online?

> Which socket belongs to that user?

> Which conversation is open?

> Where should the message be delivered?

> How should the message survive after the socket disconnects?

> How should authentication work when the frontend and backend live on different domains?

ChatZone was built around those questions.

The result is a project where the normal REST API handles persistent application operations while Socket.io handles the part that needs to happen immediately.

That separation is the heart of the application.

---

# ✨ What ChatZone Can Do

ChatZone brings the complete conversation flow into one place.

### 👤 User Accounts

A user can register with their name, email and password.

The password is hashed before it reaches the database.

After registration or login, the backend creates a JWT and stores it inside an HTTP cookie.

The frontend can then continue the session without manually passing the token through every request.

### 🔐 Secure Authentication

Protected resources pass through authentication middleware.

The middleware reads the JWT from the cookie, verifies it, loads the corresponding user and attaches that user to the request.

The rest of the application can then work with the authenticated user instead of trusting an ID sent from the client.

### 🟢 Online Presence

Once the authenticated user connects to Socket.io, ChatZone maps their user ID to their socket ID.

The server broadcasts the current online users.

The frontend receives that list and immediately updates the interface.

That is why a contact can show:

```text
🟢 Online
```

without refreshing the page.

### 💬 Real-Time Messaging

When a message is sent, it is first persisted in MongoDB.

Then the backend looks up the receiver's socket ID.

If the receiver is online, Socket.io emits the message directly to that socket.

The other browser receives the event and updates the conversation immediately.

### 🖼️ Image Sharing

Messages can contain images.

The image is uploaded to Cloudinary.

The returned secure URL is stored with the message.

The actual chat message therefore remains lightweight while the media itself is handled by a dedicated media service.

### 🎨 Theme System

ChatZone comes with **32 selectable themes** through DaisyUI and Tailwind CSS.

The selected theme is persisted in local storage so the interface remembers the user's preference.

### 📱 Responsive Interface

The chat layout changes with screen size.

On smaller screens, the contact list becomes compact.

On larger screens, contact information and online status are visible alongside the conversation.

The same application therefore works as a desktop-style chat interface without requiring a separate mobile application.

---

# 🏗️ The Architecture

The architecture is intentionally straightforward.

The frontend is responsible for the experience.

The Express backend is responsible for application logic and persistence.

Socket.io is responsible for real-time events.

MongoDB is responsible for persistent data.

Cloudinary is responsible for image storage.

```text
                         ┌─────────────────────────┐
                         │       React Client      │
                         │ Vite + Tailwind + DaisyUI│
                         │      Zustand + Axios    │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         │ REST API                │ Socket.io
                         ▼                         ▼
              ┌────────────────────┐     ┌────────────────────┐
              │ Node.js + Express  │     │ Socket.io Server   │
              │ Auth + Messages    │     │ Online Presence    │
              │ REST Controllers   │     │ Real-Time Events  │
              └─────────┬──────────┘     └─────────┬──────────┘
                        │                          │
                        ▼                          │
              ┌────────────────────┐               │
              │ MongoDB + Mongoose │               │
              │ Users + Messages   │               │
              └────────────────────┘               │
                        │                          │
                        │                          │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │     Cloudinary     │
                         │ Profile + Images   │
                         └────────────────────┘
```

The important architectural decision is that **REST and WebSockets are not competing with each other**.

REST handles persistent operations.

Socket.io handles events that need to reach another connected user immediately.

That keeps each part of the system focused on the job it is actually good at.

---

# 🧭 The Complete Chat Journey

The entire application can be understood as one continuous story.

```text
Register
   ↓
Password Hashing
   ↓
JWT Cookie
   ↓
Authenticated Session
   ↓
Socket Connection
   ↓
Online Presence
   ↓
Choose Contact
   ↓
Load Conversation
   ↓
Send Message
   ↓
Persist in MongoDB
   ↓
Find Receiver Socket
   ↓
Emit "newMessage"
   ↓
Receiver Updates Instantly
```

And when the receiver is offline, the story changes slightly.

The message is still stored in MongoDB.

There is simply no socket to deliver it to at that moment.

When the user later opens the conversation, the application retrieves the stored messages through the REST API.

This is what gives ChatZone both **real-time behavior and persistence**.

---

# 🔐 Workflow 1: Registration

Everything begins with registration.

The user enters:

```text
Full Name
Email
Password
```

The frontend sends the request to:

```text
POST /api/auth/register
```

The backend first validates the required fields.

The password must contain at least six characters.

Before the user reaches MongoDB, the password is hashed using bcrypt.

```text
Plain Password
      ↓
bcrypt.hash()
      ↓
Hashed Password
      ↓
MongoDB
```

The backend then creates the user.

A JWT is generated.

The token is placed inside an HTTP cookie.

The frontend receives the authenticated user information and immediately connects the user to Socket.io.

So registration does not end at creating an account.

It directly transitions the user into an authenticated real-time session.

---

# 🔑 Workflow 2: Login

Login follows the same security-first philosophy.

The user submits:

```text
Email
Password
```

The backend finds the corresponding MongoDB document.

The supplied password is compared with the stored bcrypt hash.

If the credentials match, a JWT is generated and stored in the cookie.

The frontend then stores the authenticated user in Zustand and establishes the Socket.io connection.

```text
Login
  ↓
Find User
  ↓
bcrypt.compare()
  ↓
JWT
  ↓
HTTP Cookie
  ↓
Authenticated React State
  ↓
Socket.io Connection
```

This creates a smooth transition from authentication to real-time communication.

---

# 🛡️ Workflow 3: Authentication Middleware

ChatZone does not allow the browser to simply say:

> "I am user X."

Protected routes use `isAuthenticated` middleware.

The middleware reads the JWT from:

```text
req.cookies.token
```

The token is verified using the server-side JWT secret.

The user ID is extracted from the token.

MongoDB is then queried for the actual user.

The password field is excluded from the returned user document.

Finally:

```text
req.user = user
```

is attached to the request.

The controller can now safely work with the authenticated identity.

This same middleware protects profile updates, user discovery and message operations.

---

# 🟢 Workflow 4: Going Online

This is where the application leaves normal REST territory.

After authentication succeeds, the frontend calls:

```text
connectSocket()
```

Socket.io establishes a connection with the backend.

The frontend sends the authenticated user's ID as part of the socket handshake query.

The backend receives:

```text
userId
```

and creates an in-memory mapping:

```text
userId → socketId
```

For example:

```text
{
    "user123": "socketABC",
    "user456": "socketXYZ"
}
```

The server then broadcasts:

```text
getOnlineUsers
```

with the list of currently connected user IDs.

The frontend stores that list in Zustand.

The sidebar can now show live presence.

---

# 💬 Workflow 5: Sending a Message

This is the most important flow in ChatZone.

Suppose Aman sends a message to another user.

The frontend sends:

```text
POST /api/message/send/:receiverId
```

The backend receives:

```text
senderId
receiverId
text
image
```

The sender identity comes from:

```text
req.user._id
```

not from a trusted client-provided sender ID.

The message is created and stored in MongoDB.

Then the backend asks:

> "Does this receiver currently have a Socket.io connection?"

The server calls:

```text
getReceiverSocketId(receiverId)
```

If a socket exists, the server sends:

```text
newMessage
```

directly to that socket.

The receiver's frontend is listening for that event.

The moment the event arrives, the message is appended to the current conversation.

```text
Sender
  ↓
Express API
  ↓
MongoDB
  ↓
Find Receiver Socket
  ↓
Socket.io
  ↓
"newMessage"
  ↓
Receiver Browser
  ↓
UI Updates
```

No refresh.

No polling loop.

The conversation simply continues.

---

# 📴 Workflow 6: What Happens When Someone Is Offline?

This is an important part of the design.

Socket.io only knows about users who are currently connected.

So if the receiver is offline:

```text
Receiver Socket
      ↓
Not Found
```

The backend does not throw the message away.

The message has already been persisted in MongoDB.

Later, when the receiver opens that conversation, the frontend calls:

```text
GET /api/message/:userId
```

The backend retrieves both sides of the conversation:

```text
sender → receiver
receiver → sender
```

and sorts them by creation time.

The conversation is reconstructed from persistent data.

This gives ChatZone two different paths for the same message:

```text
Online User
    → MongoDB
    → Socket.io
    → Instant Delivery

Offline User
    → MongoDB
    → Retrieved Later
```

---

# 🖼️ Workflow 7: Sending Images

ChatZone does not store large image files directly inside MongoDB.

When a user selects an image, the frontend creates a preview using `FileReader`.

The image is then sent with the message request.

The backend uploads it to Cloudinary.

Cloudinary returns a secure URL.

That URL is stored inside the MongoDB message document.

```text
Image File
   ↓
Frontend Preview
   ↓
Express API
   ↓
Cloudinary
   ↓
Secure Image URL
   ↓
MongoDB Message
   ↓
Socket.io Delivery
```

The receiver therefore gets the same message object containing the image URL.

---

# 👥 Workflow 8: Loading Contacts

When the Home page loads, the sidebar asks the backend for users.

```text
GET /api/message/users
```

The authenticated user's own record is excluded.

The password field is never returned.

The frontend stores the users in Zustand.

Then the sidebar combines that list with the live `onlineUsers` state.

That allows ChatZone to support:

```text
All Contacts
       +
Live Online Status
       +
Online-only Filter
```

without requiring the database to constantly update user presence.

---

# 💬 Workflow 9: Loading a Conversation

Selecting a contact changes the active conversation.

The frontend requests:

```text
GET /api/message/:userId
```

The backend searches for messages where either:

```text
sender = currentUser AND receiver = selectedUser
```

or:

```text
sender = selectedUser AND receiver = currentUser
```

The results are sorted by:

```text
createdAt ASC
```

The frontend then renders the conversation chronologically.

At the same time, the frontend subscribes to the Socket.io `newMessage` event.

So the screen combines:

```text
Historical Messages
       +
Real-Time Messages
```

inside the same conversation.

---

# 🔄 Workflow 10: Zustand State Management

The frontend uses Zustand to keep application state simple.

The application separates state into focused stores.

### 🔐 useAuthStore

Responsible for:

```text
Authenticated User
Login
Signup
Logout
Profile Updates
Socket Connection
Online Users
```

### 💬 useChatStore

Responsible for:

```text
Users
Selected User
Messages
Message Loading
User Loading
Sending Messages
Socket Message Subscription
```

### 🎨 useThemeStore

Responsible for:

```text
Current Theme
Theme Persistence
```

This keeps React components focused on rendering instead of turning every component into a large collection of API and state-management logic.

---

# 🌐 REST API Design

ChatZone keeps the API intentionally small.

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/logout` | End the session |
| PUT | `/api/auth/updateProfile` | Update profile picture |
| GET | `/api/auth/checkAuth` | Restore authenticated session |

## Messaging

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/message/users` | Fetch contacts |
| GET | `/api/message/:id` | Fetch conversation |
| POST | `/api/message/send/:id` | Send a message |

That gives the application **8 REST endpoints** while Socket.io handles the real-time event layer.

---

# 🔌 Socket.io Event Flow

The real-time layer currently revolves around two important events.

### `getOnlineUsers`

The backend broadcasts the current online user IDs whenever a socket connects or disconnects.

```text
Socket Connect
      ↓
Register userId → socketId
      ↓
Broadcast getOnlineUsers
```

### `newMessage`

When a message is stored, the backend finds the receiver's socket and emits the message.

```text
Message Saved
      ↓
Find receiver socket
      ↓
io.to(socketId)
      ↓
emit("newMessage")
```

The receiver's Zustand store listens for the event and updates the conversation.

---

# 🎨 Workflow 11: Themes

ChatZone does not force one visual style on every user.

The theme store keeps the selected theme in local storage.

The root document receives:

```text
data-theme
```

and DaisyUI handles the corresponding visual system.

The project currently exposes **32 themes**, ranging from:

```text
light
dark
cupcake
cyberpunk
dracula
night
business
coffee
winter
sunset
...
```

The theme therefore survives page refreshes without needing a database record.

---

# 🧱 Backend Structure

The backend is intentionally divided into layers.

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   └── message.controllers.js
│   │
│   ├── lib/
│   │   ├── cloudinary.js
│   │   ├── socket.js
│   │   └── utils.js
│   │
│   ├── middlewares/
│   │   └── isAuthenticated.js
│   │
│   ├── models/
│   │   ├── users.model.js
│   │   └── message.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── message.routes.js
│   │
│   └── index.js
│
└── package.json
```

The routes decide where the request goes.

The middleware protects private operations.

The controllers implement application behavior.

The models define MongoDB documents.

The Socket.io module handles real-time communication.

The Cloudinary module handles media storage.

The database module manages MongoDB connectivity.

Each part has one clear responsibility.

---

# 🎨 Frontend Structure

The frontend follows the same idea.

```text
frontend/
│
└── src/
    ├── assets/
    ├── components/
    │   ├── ChatContainer.jsx
    │   ├── ChatHeader.jsx
    │   ├── MessageInput.jsx
    │   ├── Sidebar.jsx
    │   ├── Navbar.jsx
    │   └── ...
    │
    ├── constants/
    ├── lib/
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── ProfilePage.jsx
    │   └── SettingsPage.jsx
    │
    ├── store/
    │   ├── useAuthStore.js
    │   ├── useChatStore.js
    │   └── useThemeStore.js
    │
    ├── App.jsx
    ├── App.css
    └── main.jsx
```

The UI is broken into reusable components rather than keeping the complete chat experience inside one page.

That becomes especially useful for the sidebar, message input, chat header, skeleton loaders and profile experience.

---

# 🧰 Technology Stack

| Layer | Technology | Role |
|---|---|---|
| 🎨 UI | React 19 | Component-based frontend |
| ⚡ Build Tool | Vite | Development and production build |
| 🎨 Styling | Tailwind CSS 4 | Utility-first styling |
| 🌈 UI Themes | DaisyUI | 32 selectable themes |
| 🧭 Routing | React Router | Client-side navigation |
| 📡 HTTP | Axios | REST API communication |
| 🧠 State | Zustand | Global application state |
| 💬 Real-Time | Socket.io | Live messaging and presence |
| 🟢 Runtime | Node.js | Backend runtime |
| 🚂 API | Express.js | REST API server |
| 🗄️ Database | MongoDB | Persistent users and messages |
| 📦 ODM | Mongoose | MongoDB data modeling |
| 🔐 Authentication | JWT + bcrypt | Session security |
| 🍪 Cookies | cookie-parser | JWT cookie handling |
| 🖼️ Media | Cloudinary | Profile and message images |
| 🌐 Deployment | Vercel + Render | Frontend and backend hosting |

---

# 🔐 Security Story

Chat applications deal with personal conversations, so authentication cannot simply be an afterthought.

ChatZone uses bcrypt for password hashing.

Passwords are never stored in plaintext.

JWTs are used for authenticated sessions.

The JWT is stored inside a cookie and verified by backend middleware.

Protected endpoints use the authenticated user from the server-side token rather than trusting a sender ID from the browser.

The application also enables CORS with credentials so the deployed frontend can communicate securely with the deployed backend.

```text
Browser
   ↓
HTTP Cookie
   ↓
Express Middleware
   ↓
JWT Verification
   ↓
MongoDB User Lookup
   ↓
req.user
   ↓
Protected Controller
```

This creates a clean trust boundary between the browser and the backend.

---

# ☁️ Deployment Story

ChatZone is deployed as two applications.

The React frontend runs on **Vercel**.

The Node.js backend runs on **Render**.

The production flow looks like this:

```text
                         GitHub
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
             Vercel                 Render
          React Frontend        Express + Socket.io
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                        ▼                           ▼
                    MongoDB                    Cloudinary
                 Users + Messages             Image Storage
```

The frontend knows the production backend URL.

Axios sends REST requests to the Render API.

Socket.io connects directly to the Render server.

MongoDB keeps the data persistent even when a socket disappears.

Cloudinary keeps media outside the application server.

---

# 🌍 Cross-Origin Communication

Development and production are treated separately.

The backend allows the local Vite origin:

```text
http://localhost:5173
```

and the deployed Vercel frontend:

```text
https://chatzone-henna.vercel.app
```

with credentials enabled.

This matters because the authentication cookie has to travel between the frontend and backend domains during the deployed application flow.

The same consideration applies to Socket.io.

The production Socket.io server explicitly allows the deployed frontend origin with credentials.

---

# ⚙️ Getting Started

Before running ChatZone locally, make sure you have:

```text
Node.js
npm
MongoDB
Cloudinary account
```

---

## 1️⃣ Clone the repository

```bash
git clone <your-repository-url>
cd ChatZone
```

The repository contains two independent applications:

```text
frontend/
backend/
```

---

# 🟢 2️⃣ Configure the Backend

Move into the backend:

```bash
cd backend
npm install
```

Create:

```text
.env
```

with:

```env
PORT=5005

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

The backend reads these values through `dotenv`.

---

# ▶️ 3️⃣ Start the Backend

Run:

```bash
npm run dev
```

The Express server starts on:

```text
http://localhost:5005
```

The same HTTP server also powers Socket.io.

That is important.

The real-time layer is not running as a completely separate application.

It shares the same server instance as the Express API.

---

# 🎨 4️⃣ Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite starts the React development server.

The frontend communicates with:

```text
http://localhost:5005/api
```

and Socket.io connects to the backend server.

---

# 🏭 Production Build

The frontend can be built with:

```bash
npm run build
```

The resulting production assets can then be deployed through Vercel.

The backend uses:

```bash
npm start
```

to start the production Node.js server.

The deployment environment supplies the production environment variables.

---

# 📊 Engineering Decisions

## Why MongoDB?

Chat messages are naturally document-shaped.

A message contains:

```text
senderId
receiverId
text
image
createdAt
```

MongoDB provides a straightforward model for this structure while Mongoose gives the application schema definitions and convenient queries.

---

## Why Socket.io?

Polling would mean repeatedly asking:

> "Did someone send me a message?"

That is unnecessary when the server can push an event.

Socket.io provides the event-driven communication layer:

```text
Client ←→ Server
```

and lets ChatZone react to messages and presence changes as they happen.

---

## Why REST + Socket.io together?

REST and WebSockets solve different problems.

REST is useful for:

```text
Register
Login
Check Authentication
Fetch Users
Fetch Messages
Send Message
Update Profile
```

Socket.io is useful for:

```text
Online Presence
Real-Time Message Delivery
```

Using both gives ChatZone persistence without sacrificing real-time behavior.

---

## Why Cloudinary?

Images do not need to live directly inside MongoDB.

Cloudinary provides dedicated media storage and delivery.

The application stores the resulting secure URL instead of the full media object.

This keeps the message document simple.

---

# 📈 Project Scale

ChatZone is intentionally small enough to understand end-to-end while still containing the major pieces of a real full-stack real-time system.

The current implementation includes:

```text
8 REST API endpoints
2 core Socket.io events
3 Zustand stores
2 MongoDB models
32 UI themes
2 deployment services
1 real-time communication layer
1 media storage layer
1 authentication system
```

Each number represents a real part of the implementation rather than an artificial benchmark.

The project is less about having hundreds of files and more about making the important engineering pieces work together.

---

# 🧪 What I Learned Building ChatZone

The interesting part of this project was not creating a message bubble.

The interesting part was understanding what happens behind it.

I learned how authentication moves from a browser to a backend.

I learned how JWTs can maintain a stateless session through cookies.

I learned how MongoDB can persist conversations independently from a live socket.

I learned how Socket.io can map a user identity to an active connection.

I learned why online presence belongs to the real-time layer rather than the database.

I learned how Cloudinary can take media storage away from the application server.

I learned how frontend and backend communication changes when they are deployed on different domains.

And most importantly, I learned that a real-time application is not just about sending data quickly.

It is about deciding **where the data lives, who is allowed to access it, how it reaches the other user, and what happens when that user is not connected.**

---

# 🚀 Future Improvements

ChatZone has a straightforward foundation for growing further.

Some natural next steps are:

- 📨 Message delivery and read receipts
- ✍️ Typing indicators
- 🗑️ Message deletion and editing
- 🔍 Conversation search
- 👥 Group conversations
- 🔔 Push notifications
- 🟢 More robust presence management
- 📎 Multiple file types
- 🔒 Stronger cookie security configuration
- 📈 Message and connection analytics
- ⚖️ Horizontal Socket.io scaling with a shared adapter
- 🧠 Redis-backed presence and pub/sub for multi-instance deployment

The last point becomes especially important when the application grows from one backend instance to multiple instances.

With multiple servers, a user connected to Server A should still be able to receive a message originating from Server B.

That is where a shared real-time state layer such as Redis and a Socket.io adapter can take the architecture to the next level.

---

# 🏁 Final Word

ChatZone started as a simple question:

> **Can I build a chat application where the message actually feels alive?**

The answer became an application where a user can register, log in, find people, see who is online, open a conversation, send text, share images, switch themes and watch messages arrive without refreshing the page.

But underneath that simple interface is a complete engineering flow.

**React builds the experience.** 🎨

**Tailwind CSS and DaisyUI shape the interface.** 🌈

**Zustand keeps the frontend state predictable.** 🧠

**Node.js and Express power the backend.** 🟢

**MongoDB keeps users and conversations persistent.** 🗄️

**Mongoose gives those documents structure.** 📦

**JWT and bcrypt protect the authentication flow.** 🔐

**Socket.io makes the conversation real time.** 💬

**Cloudinary handles the images.** 🖼️

**Vercel and Render take the application from localhost to the internet.** ☁️

And somewhere between the first login and the first instant message, ChatZone became more than a chat UI.

It became a practical exploration of **authentication, REST APIs, WebSockets, state management, persistence, media storage, deployment and real-time system design**.

---

## 👨‍💻 Built With

**React • Vite • Tailwind CSS • DaisyUI • Zustand • Axios • Node.js • Express.js • MongoDB • Mongoose • Socket.io • JWT • bcrypt • Cloudinary • Vercel • Render**

### ⭐ If you found the project useful or interesting, consider giving the repository a star.
