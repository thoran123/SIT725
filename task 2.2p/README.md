# Express.js Task Management API

A comprehensive Node.js web application built with Express.js that demonstrates HTTP methods, REST API concepts, and static file serving. This project serves as a solid foundation for understanding server-side web development and API design.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete tasks
- **RESTful API Design**: Proper HTTP methods and status codes
- **Multiple Endpoints**: Various ways to interact with task data
- **Static File Serving**: Public folder setup for serving HTML, CSS, and JS
- **Interactive Web Interface**: Live demo of all API endpoints
- **Error Handling**: Comprehensive error responses and validation
- **JSON Responses**: Structured API responses with success/error indicators

## API Endpoints

### Core CRUD Operations
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task by ID

### Advanced Operations
- `GET /api/tasks/priority/:priority` - Filter tasks by priority (high, medium, low)
- `GET /api/tasks/status/:status` - Filter tasks by status (completed, incomplete)
- `PATCH /api/tasks/:id/toggle` - Toggle task completion status

### Static Routes
- `GET /` - Serves the main web interface
- `GET /public/*` - Serves static files (CSS, JS, images)

## 🛠️ Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Step 1: Clone the Repository
```bash
git clone [your-repo-url]
cd express-task-manager
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Application
```bash
# For development (auto-restart on changes)
npm run dev

# For production
npm start
```

### Step 4: Access the Application
Open your browser and navigate to:
- **Main Interface**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api/tasks

## 📁 Project Structure

```
express-task-manager/
├── server.js              # Main Express server file
├── package.json          # Project dependencies and scripts
├── README.md            # Project documentation
└── public/              # Static files directory
    ├── index.html       # Main web interface
    ├── styles.css       # Styling (if separated)
    └── script.js        # Client-side JavaScript (if separated)
```

## Testing the API

### Using the Web Interface
1. Start the server (`npm start`)
2. Open http://localhost:3000 in your browser
3. Use the interactive demo buttons to test different endpoints
4. Create new tasks using the form
5. View API responses in real-time

### Using cURL Commands

#### Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```

#### Create a new task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description", "priority": "high"}'
```

#### Update a task:
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "completed": true}'
```

#### Delete a task:
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Using Postman
1. Import the endpoints into Postman
2. Set the base URL to `http://localhost:3000`
3. Test each endpoint with appropriate HTTP methods
4. View structured JSON responses

## 📊 Sample API Responses

### Success Response (GET /api/tasks)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Learn Express.js",
      "description": "Complete the Express.js tutorial",
      "completed": false,
      "priority": "high",
      "createdAt": "2025-01-20T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Error Response (Task not found)
```json
{
  "success": false,
  "message": "Task not found"
}
```

## Key Technologies Used

- **Express.js**: Web framework for Node.js
- **Node.js**: JavaScript runtime environment
- **HTML5**: Markup for the web interface
- **CSS3**: Styling with modern features
- **JavaScript (ES6+)**: Client-side interactivity
- **JSON**: Data exchange format

## Learning Objectives Covered

1. **HTTP Methods**: Understanding GET, POST, PUT, DELETE, PATCH
2. **REST API Design**: Proper resource naming and status codes
3. **Express Middleware**: JSON parsing, static file serving, error handling
4. **Route Parameters**: Dynamic URL segments (`:id`, `:priority`)
5. **Request/Response Handling**: Parsing request bodies, sending JSON responses
6. **Static File Serving**: Using Express to serve HTML, CSS, and JS files
7. **Error Handling**: Comprehensive error responses and validation

## Future Enhancements

- Add user authentication and authorization
- Implement database storage (MongoDB, PostgreSQL)
- Add input validation and sanitization
- Implement pagination for large datasets
- Add search functionality
- Create unit and integration tests
- Add API documentation with Swagger
- Implement rate limiting and security headers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in server.js or kill the process using the port
2. **Module not found**: Run `npm install` to install dependencies
3. **CORS issues**: Add CORS middleware if testing from different origins
4. **JSON parsing errors**: Ensure Content-Type header is set to application/json

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure Node.js version is 14 or higher
- Review the API documentation above



## Acknowledgments

- Express.js documentation and community
- Node.js community for excellent resources
- HTTP specification for REST API best practices

---
