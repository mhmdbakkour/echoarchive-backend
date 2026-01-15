# Echo Archive Backend

**Echo Archive Backend** is the server component for the [Echo Archive](https://github.com/mhmdbakkour/echoarchive) application.  
It provides a RESTful API for storing, retrieving, updating, and deleting voice memo data.  
This backend supports memo metadata, transcripts, sentiment data, and audio storage integration used by the Echo Archive frontend.

---

## Table of Contents

1. [Overview](#overview)  
2. [Tech Stack](#tech-stack)  
3. [API Capabilities](#api-capabilities)  
4. [Project Structure](#project-structure)  
5. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Development](#development)  
6. [Environment Configuration](#environment-configuration)  
7. [Usage](#usage)  
8. [Contributing](#contributing)  
9. [License](#license)

---

## Overview

This backend serves as the API layer for the Echo Archive system, handling:

- Create, Read, Update, Delete operations for voice memo records  
- Persistence of memo metadata (timestamps, transcripts, sentiment scores)  
- Database connectivity  
- Optional audio file uploads and streaming

Clients such as the [Echo Archive](https://github.com/mhmdbakkour/echoarchive) frontend interact with this backend over HTTP endpoints.

---

## Tech Stack

- **Node.js** — JavaScript runtime  
- **Express.js**  — API routing and middleware  
- Database integration (configure via environment variables)

---

## API Capabilities

Application interfaces using the following endpoints: 

```
POST   /recordings      Create a new voice memo  
GET    /recordings      List all stored memos
GET    /recordings/:id  Retrieve a specific memo
PUT    /recordings/:id  Update memo data
DELETE /recordings/:id  Remove a memo
```
---

## Project Structure

```

├─ node_modules/          # Dependencies
├─ db.js                  # Database connection setup
├─ server.js              # Main server entry point
├─ package.json           # Project metadata & scripts
├─ .env                   # Environment variables (local config)
└─ README.md              # Documentation

````

---

## Getting Started

### Prerequisites

Ensure the following are installed:

- **Node.js** (v16+ recommended)  
- **npm**
- Database service via mySQL configured and running

---

### Installation

Clone the repository:

```bash
git clone https://github.com/mhmdbakkour/echoarchive-backend.git
cd echoarchive-backend
````

Install dependencies:

```bash
npm install
```

---

### Development

Start the backend server:

```bash
npm start
```

The server will listen on the configured port (default set via `.env`).

---

## Environment Configuration

Create a `.env` file (not committed to source control) and set:

```
PORT=3001
DATABASE_URL=<your database connection string>
JWT_SECRET=<secret key for authentication if used>
```

Adjust variables according to your database and authentication setup.

---

## Usage

Once the server is running:

1. Point your client (e.g., the Echo Archive frontend) at the backend API base URL
2. Use RESTful requests to manage voice memos
3. Integrate with storage services if audio file uploads are required

---


## License

This project is under the MIT license.

```
