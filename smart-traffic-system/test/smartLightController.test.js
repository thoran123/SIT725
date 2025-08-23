// test/smartLightController.test.js
// test/smartLightController.test.js
const SmartLightController = require('../src/smartLightController');

describe('SmartLightController', () => {
    let controller;

    beforeEach(() => {
        controller = new SmartLightController();
    });

    test('should initialize correctly', () => {
        expect(controller).toBeDefined();
        expect(controller.intersections).toBeDefined();
        expect(controller.activeEmergencies).toBeDefined();
    });

    test('should initialize intersection with valid parameters', () => {
        const intersection = controller.initializeIntersection('intersection_1', {
            cycle: { green: 25, yellow: 5, red: 20 },
            sensors: { north: 5, south: 3, east: 2, west: 4 }
        });

        expect(intersection).toBeDefined();
        expect(intersection.id).toBe('intersection_1');
        expect(intersection.state).toBe('red');
        expect(intersection.cycle.green).toBe(25);
        expect(intersection.sensors.north).toBe(5);
    });

    test('should throw error when initializing intersection with invalid ID', () => {
        expect(() => {
            controller.initializeIntersection(null);
        }).toThrow('Intersection ID must be a valid string');
    });

    test('should change traffic light state correctly', () => {
        controller.initializeIntersection('intersection_1');
        const result = controller.changeState('intersection_1', 'green');

        expect(result.previousState).toBe('red');
        expect(result.currentState).toBe('green');
        expect(result.intersectionId).toBe('intersection_1');
    });

    test('should throw error when changing to invalid state', () => {
        controller.initializeIntersection('intersection_1');
        
        expect(() => {
            controller.changeState('intersection_1', 'blue');
        }).toThrow('Invalid traffic light state');
    });

    test('should handle emergency vehicle priority correctly', () => {
        controller.initializeIntersection('intersection_1');
        const result = controller.handleEmergencyVehicle('intersection_1', 'ambulance_123', 'north', 5000);

        expect(result.emergencyId).toBe('ambulance_123');
        expect(result.actionTaken).toBe('immediate_green');
        expect(result.intersectionId).toBe('intersection_1');
    });

    test('should adapt light timing based on traffic data', () => {
        controller.initializeIntersection('intersection_1');
        const trafficData = {
            vehicleCount: 35,
            congestionLevel: 'high',
            timestamp: Date.now()
        };

        const result = controller.adaptLightTiming('intersection_1', trafficData);
        
        expect(result.intersectionId).toBe('intersection_1');
        expect(result.newTiming).toBeDefined();
        expect(result.improvementFactor).toBeDefined();
        expect(result.confidence).toBeGreaterThan(0);
    });

    test('should coordinate multiple intersections for green wave', () => {
        controller.initializeIntersection('intersection_1');
        controller.initializeIntersection('intersection_2');
        
        const result = controller.coordinateIntersections(['intersection_1', 'intersection_2'], 'green_wave');
        
        expect(result.planExecuted).toBe(true);
        expect(result.coordinatedIntersections).toBe(2);
        expect(result.results).toHaveLength(2);
    });

    test('should get intersection status correctly', () => {
        controller.initializeIntersection('intersection_1');
        const status = controller.getIntersectionStatus('intersection_1');
        
        expect(status.intersectionId).toBe('intersection_1');
        expect(status.currentState).toBe('red');
        expect(status.cycle).toBeDefined();
        expect(status.efficiency).toBeDefined();
        expect(status.health).toBeDefined();
    });

    test('should throw error when getting non-existent intersection', () => {
        expect(() => {
            controller.getIntersectionStatus('non_existent');
        }).toThrow('Intersection non_existent not found');
    });

    test('should calculate adaptive timing correctly', () => {
        const intersection = controller.initializeIntersection('test_intersection');
        const timing = controller.calculateAdaptiveTiming(intersection, 25, 'high');
        
        expect(timing.green).toBeGreaterThan(0);
        expect(timing.yellow).toBe(5);
        expect(timing.red).toBeGreaterThanOrEqual(15);
    });

    test('should calculate intersection efficiency correctly', () => {
        const intersection = controller.initializeIntersection('test_intersection');
        const efficiency = controller.calculateIntersectionEfficiency(intersection);
        
        expect(efficiency).toBeGreaterThan(0);
        expect(efficiency).toBeLessThanOrEqual(100);
    });
});