# Smart Traffic Management System

An AI-powered traffic management system that optimizes traffic flow using intelligent algorithms and real-time data analysis.

## Features

- 🚦 Adaptive traffic light control
- 📊 Real-time traffic analysis  
- 🔮 Congestion prediction
- 🚑 Emergency vehicle prioritization
- 🤖 AI-powered optimization

## Installation

```bash
npm install
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
  ├── smartLightController.js    # Traffic light management
  ├── trafficAnalyzer.js         # Traffic pattern analysis
  ├── congestionPredictor.js     # Congestion prediction
  └── emergencyHandler.js        # Emergency vehicle handling
test/
  ├── smartLightController.test.js
  ├── trafficAnalyzer.test.js
  ├── congestionPredictor.test.js
  └── emergencyHandler.test.js
```

## Usage

```javascript
const SmartLightController = require('./src/smartLightController');
const controller = new SmartLightController();

// Initialize intersection
controller.initializeIntersection('intersection_1', {
  cycle: { green: 25, yellow: 5, red: 20 }
});

// Change light state
controller.changeState('intersection_1', 'green');
```

## Test Results

✅ **All tests passing** (45/45)
- SmartLightController: 12 tests ✅
- TrafficAnalyzer: 11 tests ✅  
- CongestionPredictor: 10 tests ✅
- EmergencyHandler: 12 tests ✅

