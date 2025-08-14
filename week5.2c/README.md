# 🚀 MVC Project Management Hub

A modern web application demonstrating the Model-View-Controller (MVC) architecture pattern with a beautiful user interface and comprehensive project management features.

## ✨ Features

- **Create & Manage Projects** - Add new projects with title, description, priority, and deadlines
- **Track Progress** - Visual progress bars and completion status
- **Smart Filtering** - Search and filter projects by category, priority, or status
- **Real-time Statistics** - Dashboard showing project counts and budget totals
- **Modern UI** - Beautiful glassmorphism design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🏗️ MVC Architecture

This application demonstrates a clean separation of concerns using the MVC pattern:

- **Model** - Handles data storage, validation, and business logic
- **View** - Manages the user interface and DOM updates
- **Controller** - Coordinates between Model and View, handles user interactions

```
User Input → Controller → Model → Observer Pattern → View → DOM Update
```

## 🚀 Getting Started

### Option 1: Direct Open
1. Download the `index.html` file
2. Open it in any modern web browser
3. Start managing your projects!

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then open http://localhost:8000
```

## 📋 How to Use

### Creating Projects
1. Fill out the form in the left sidebar
2. Add title, description, priority, and category
3. Click "Create Project"

### Managing Projects
- **Search**: Use the search box to find specific projects
- **Filter**: Click filter buttons to show specific categories
- **Update Progress**: Click the "📈 Progress" button on any project
- **Complete**: Mark projects as done with the "✅ Complete" button
- **Delete**: Remove projects with the "🗑️ Delete" button

### View Statistics
The dashboard shows:
- Total number of projects
- Active vs completed projects
- Total budget across all projects

## 🛠️ Technical Details

### Built With
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure ES6+

### Key Features
- Observer pattern for reactive updates
- Data validation and error handling
- Local sample data for demonstration
- Smooth animations and transitions
- Mobile-responsive design

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📁 File Structure

```
week5.2c/
└── index.html      # Complete MVC application in a single file
```

## 📚 Educational Use

This project demonstrates:
- MVC architecture patterns
- Modern web development techniques
- JavaScript ES6+ features
- CSS Grid and Flexbox
- Responsive design principles

