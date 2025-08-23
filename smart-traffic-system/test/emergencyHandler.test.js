// test/emergencyHandler.test.js
const EmergencyHandler = require('../src/emergencyHandler');

describe('EmergencyHandler', () => {
    let handler;

    beforeEach(() => {
        handler = new EmergencyHandler();
    });

    test('should initialize correctly', () => {
        expect(handler).toBeDefined();
        expect(handler.activeEmergencies).toBeDefined();
        expect(handler.emergencyTypes).toBeDefined();
    });

    test('should register emergency vehicle correctly', () => {
        const result = handler.registerEmergencyVehicle(
            'ambulance_123', 
            'ambulance', 
            'hospital', 
            'accident_site',
            'high'
        );
        
        expect(result.vehicleId).toBe('ambulance_123');
        expect(result.priority).toBeDefined();
        expect(result.estimatedRoute).toBeDefined();
    });

    test('should throw error with invalid vehicle type', () => {
        expect(() => {
            handler.registerEmergencyVehicle('test_vehicle', 'invalid_type', 'loc1', 'loc2');
        }).toThrow('Invalid emergency vehicle type');
    });

    test('should optimize emergency path with real-time conditions', () => {
        handler.registerEmergencyVehicle('ambulance_123', 'ambulance', 'loc1', 'loc2');
        
        const optimization = handler.optimizeEmergencyPath('ambulance_123', {
            trafficDensity: 0.6,
            weatherConditions: 'clear'
        });
        
        expect(optimization.originalRoute).toBeDefined();
        expect(optimization.optimizedRoute).toBeDefined();
        expect(optimization.timeSaved).toBeDefined();
    });

    test('should preempt traffic lights for emergency vehicle', () => {
        handler.registerEmergencyVehicle('ambulance_123', 'ambulance', 'loc1', 'loc2');
        
        const result = handler.preemptTrafficLights('ambulance_123', ['intersection_1', 'intersection_2']);
        
        expect(result.vehicleId).toBe('ambulance_123');
        expect(result.totalIntersections).toBe(2);
        expect(result.results).toHaveLength(2);
    });

    test('should coordinate multiple emergencies', () => {
        handler.registerEmergencyVehicle('ambulance_123', 'ambulance', 'loc1', 'loc2');
        handler.registerEmergencyVehicle('fire_truck_456', 'fire_truck', 'loc3', 'loc4');
        
        const coordination = handler.coordinateMultipleEmergencies(['ambulance_123', 'fire_truck_456']);
        
        expect(coordination.planExecuted).toBe(true);
        expect(coordination.coordinatedVehicles).toBe(2);
        expect(coordination.priorityOrder).toHaveLength(2);
    });

    test('should deregister emergency vehicle correctly', () => {
        handler.registerEmergencyVehicle('ambulance_123', 'ambulance', 'loc1', 'loc2');
        
        const result = handler.deregisterEmergencyVehicle('ambulance_123', 'completed');
        
        expect(result.vehicleId).toBe('ambulance_123');
        expect(result.deregistrationStatus).toBe('completed');
        expect(result.responseTime).toBeDefined();
        expect(result.intersectionsCleared).toBeDefined();
    });

    test('should calculate emergency route correctly', () => {
        const route = handler.calculateEmergencyRoute('hospital', 'accident_site');
        
        expect(route.distance).toBeGreaterThan(0);
        expect(route.estimatedTime).toBeGreaterThan(0);
        expect(route.intersections).toBeGreaterThan(0);
    });

    test('should calculate dynamic priority correctly', () => {
        const priority = handler.calculateDynamicPriority('ambulance', 'critical');
        expect(priority).toBeGreaterThan(0);
    });

    test('should analyze response performance', () => {
        // Test with no responses first
        let analytics = handler.analyzeResponsePerformance();
        expect(analytics).toBeDefined();
        
        // Register and complete an emergency
        handler.registerEmergencyVehicle('ambulance_123', 'ambulance', 'loc1', 'loc2');
        handler.deregisterEmergencyVehicle('ambulance_123', 'completed');
        
        analytics = handler.analyzeResponsePerformance();
        
        // Just check that analytics object is returned with expected structure
        expect(analytics).toBeDefined();
        expect(analytics).toHaveProperty('totalResponses');
        expect(analytics).toHaveProperty('averageResponseTime');
        expect(analytics).toHaveProperty('successRate');
    });
});