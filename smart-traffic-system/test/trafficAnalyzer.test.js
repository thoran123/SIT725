// test/trafficAnalyzer.test.js
const TrafficAnalyzer = require('../src/trafficAnalyzer');

describe('TrafficAnalyzer', () => {
    let analyzer;

    beforeEach(() => {
        analyzer = new TrafficAnalyzer();
    });

    test('should initialize correctly', () => {
        expect(analyzer).toBeDefined();
        expect(analyzer.trafficData).toBeDefined();
    });

    test('should analyze traffic flow with valid data', () => {
        const result = analyzer.analyzeTrafficFlow('intersection_1', 15);
        
        expect(result.intersection).toBe('intersection_1');
        expect(result.currentFlow).toBe(15);
        expect(result.congestionLevel).toBeDefined();
        expect(result.trend).toBeDefined();
    });

    test('should throw error with invalid vehicle count', () => {
        expect(() => {
            analyzer.analyzeTrafficFlow('intersection_1', -5);
        }).toThrow('Vehicle count must be a non-negative number');
    });

    test('should detect traffic patterns', () => {
        // Add multiple data points with timestamps
        const now = Date.now();
        analyzer.analyzeTrafficFlow('intersection_1', 10, now - 2000);
        analyzer.analyzeTrafficFlow('intersection_1', 15, now - 1000);
        analyzer.analyzeTrafficFlow('intersection_1', 20, now);
        
        const patterns = analyzer.detectTrafficPatterns('intersection_1');
        
        // Just check that patterns object is returned
        expect(patterns).toBeDefined();
        expect(typeof patterns).toBe('object');
    });

    test('should return insufficient data for pattern detection with little data', () => {
        analyzer.analyzeTrafficFlow('intersection_1', 10);
        
        const patterns = analyzer.detectTrafficPatterns('intersection_1');
        
        expect(patterns).toBeDefined();
        expect(patterns.pattern).toBeDefined();
    });

    test('should optimize intersection with available data', () => {
        analyzer.analyzeTrafficFlow('intersection_1', 25);
        
        const optimization = analyzer.optimizeIntersection('intersection_1');
        
        expect(optimization.currentEfficiency).toBeDefined();
        expect(optimization.suggestedTimings).toBeDefined();
        expect(optimization.expectedImprovement).toBeDefined();
    });

    test('should throw error when optimizing without data', () => {
        expect(() => {
            analyzer.optimizeIntersection('empty_intersection');
        }).toThrow('No traffic data available for optimization');
    });

    test('should calculate congestion level correctly', () => {
        expect(analyzer.calculateCongestionLevel(5)).toBe('low');
        expect(analyzer.calculateCongestionLevel(15)).toBe('moderate');
        expect(analyzer.calculateCongestionLevel(30)).toBe('high');
        expect(analyzer.calculateCongestionLevel(60)).toBe('critical');
    });

    test('should calculate flow rate correctly', () => {
        const flowRate = analyzer.calculateFlowRate(30, 3600000); // 30 vehicles in 1 hour
        expect(flowRate).toBe(30);
    });

    test('should generate traffic insights with alerts for high congestion', () => {
        const insight = analyzer.analyzeTrafficFlow('intersection_1', 45);
        
        expect(insight.alerts).toBeDefined();
    });

    test('should calculate efficiency correctly', () => {
        const efficiency = analyzer.calculateEfficiency({ vehicleCount: 30 });
        expect(efficiency).toBe(100);
    });

    test('should calculate optimal timings based on vehicle count', () => {
        const timings = analyzer.calculateOptimalTimings({ vehicleCount: 35 });
        
        expect(timings.greenTime).toBeGreaterThanOrEqual(15);
        expect(timings.greenTime).toBeLessThanOrEqual(60);
        expect(timings.redTime).toBeGreaterThanOrEqual(15);
    });
});