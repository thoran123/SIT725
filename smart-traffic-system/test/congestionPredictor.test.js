// test/congestionPredictor.test.js
const CongestionPredictor = require('../src/congestionPredictor');

describe('CongestionPredictor', () => {
    let predictor;

    beforeEach(() => {
        predictor = new CongestionPredictor();
    });

    test('should initialize correctly', () => {
        expect(predictor).toBeDefined();
        expect(predictor.historicalData).toBeDefined();
        expect(predictor.weatherData).toBeDefined();
    });

    test('should predict congestion for location', () => {
        const prediction = predictor.predictCongestion('downtown', 3600000);
        
        expect(prediction.location).toBe('downtown');
        expect(prediction.timeHorizon).toBe(3600000);
        expect(prediction.predictions).toBeDefined();
        expect(prediction.confidence).toBeGreaterThan(0);
    });

    test('should throw error with invalid location', () => {
        expect(() => {
            predictor.predictCongestion(null, 3600000);
        }).toThrow('Location must be a valid string');
    });

    test('should analyze traffic patterns with data', () => {
        const mockData = [
            { congestionLevel: 0.3, timestamp: Date.now() - 7200000 },
            { congestionLevel: 0.6, timestamp: Date.now() - 3600000 },
            { congestionLevel: 0.8, timestamp: Date.now() }
        ];
        
        const analysis = predictor.analyzeTrafficPatterns(mockData);
        
        expect(analysis.patterns).toBeDefined();
        expect(analysis.model).toBeDefined();
        expect(analysis.insights).toBeDefined();
    });

    test('should assess real-time risk correctly', () => {
        const riskAssessment = predictor.assessRealTimeRisk('downtown', {
            trafficFlow: 35,
            weather: { conditions: 'rain' },
            time: Date.now()
        });
        
        expect(riskAssessment.location).toBe('downtown');
        expect(riskAssessment.riskLevel).toBeDefined();
        expect(riskAssessment.riskScore).toBeGreaterThan(0);
        expect(riskAssessment.recommendations).toBeDefined();
    });

    test('should optimize routes based on predictions', () => {
        const optimization = predictor.optimizeRoutes(
            'current_location',
            ['destination_1', 'destination_2', 'destination_3']
        );
        
        expect(optimization.routes).toBeDefined();
        expect(optimization.optimalRoute).toBeDefined();
        expect(optimization.alternativeRoutes).toBeDefined();
        expect(optimization.totalOptimization).toBeDefined();
    });

    test('should integrate weather data correctly', () => {
        const weatherImpact = predictor.integrateWeatherData('downtown', {
            conditions: 'rain',
            temperature: 15,
            precipitation: 10,
            visibility: 5
        });
        
        expect(weatherImpact.location).toBe('downtown');
        expect(weatherImpact.trafficImpact).toBeGreaterThan(0);
    });

    test('should integrate event data correctly', () => {
        const eventImpact = predictor.integrateEventData('stadium', {
            type: 'concert',
            startTime: Date.now(),
            endTime: Date.now() + 10800000, // 3 hours
            expectedAttendance: 5000
        });
        
        expect(eventImpact.location).toBe('stadium');
        expect(eventImpact.trafficImpact).toBeGreaterThan(0);
    });

    test('should calculate weather impact correctly', () => {
        const impact = predictor.calculateWeatherImpact({ conditions: 'heavy_rain' });
        expect(impact).toBeGreaterThan(0);
    });

    test('should calculate event impact correctly', () => {
        const impact = predictor.calculateEventImpact({
            expectedAttendance: 10000,
            startTime: Date.now(),
            endTime: Date.now() + 7200000 // 2 hours
        });
        
        expect(impact).toBeGreaterThan(0);
    });

    test('should predict congestion level based on time', () => {
        const level = predictor.predictCongestionLevel('downtown', Date.now());
        expect(level).toBeGreaterThanOrEqual(0);
        expect(level).toBeLessThanOrEqual(1);
    });
});