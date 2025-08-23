// smartLightController.js
class SmartLightController {
    constructor() {
        this.intersections = new Map();
        this.activeEmergencies = new Set();
        this.defaultCycle = { green: 30, yellow: 5, red: 25 };
    }

    // Initialize smart intersection with AI capabilities
    initializeIntersection(intersectionId, config = {}) {
        if (!intersectionId || typeof intersectionId !== 'string') {
            throw new Error('Intersection ID must be a valid string');
        }

        const intersection = {
            id: intersectionId,
            state: 'red',
            cycle: { ...this.defaultCycle, ...config.cycle },
            sensors: config.sensors || { north: 0, south: 0, east: 0, west: 0 },
            lastStateChange: Date.now(),
            adaptiveMode: config.adaptiveMode || true,
            priority: config.priority || 'normal',
            metadata: {
                totalCycles: 0,
                averageWaitTime: 0,
                throughput: 0
            }
        };

        this.intersections.set(intersectionId, intersection);
        return intersection;
    }

    // AI-powered adaptive light timing
    adaptLightTiming(intersectionId, trafficData) {
        const intersection = this.getIntersection(intersectionId);
        if (!trafficData || typeof trafficData !== 'object') {
            throw new Error('Traffic data must be a valid object');
        }

        const currentLoad = trafficData.vehicleCount || 0;
        const congestionLevel = trafficData.congestionLevel || 'low';
        
        // AI adaptation algorithm
        const adaptedTiming = this.calculateAdaptiveTiming(intersection, currentLoad, congestionLevel);
        
        // Apply machine learning adjustments
        const optimizedTiming = this.applyMLOptimization(intersection, adaptedTiming, trafficData);
        
        intersection.cycle = optimizedTiming;
        intersection.metadata.totalCycles++;
        
        return {
            intersectionId,
            newTiming: optimizedTiming,
            improvementFactor: this.calculateImprovement(intersection.cycle, optimizedTiming),
            confidence: this.calculateAdaptationConfidence(trafficData)
        };
    }

    // Smart traffic light state management
    changeState(intersectionId, newState, duration) {
        const intersection = this.getIntersection(intersectionId);
        const validStates = ['red', 'yellow', 'green'];
        
        if (!validStates.includes(newState)) {
            throw new Error('Invalid traffic light state');
        }

        const previousState = intersection.state;
        intersection.state = newState;
        intersection.lastStateChange = Date.now();

        // Log state transition for analytics
        this.logStateTransition(intersection, previousState, newState, duration);

        return {
            intersectionId,
            previousState,
            currentState: newState,
            timestamp: intersection.lastStateChange,
            scheduledDuration: duration || intersection.cycle[newState]
        };
    }

    // Emergency vehicle priority system
    handleEmergencyVehicle(intersectionId, emergencyId, direction, estimatedArrival) {
        const intersection = this.getIntersection(intersectionId);
        
        if (typeof estimatedArrival !== 'number' || estimatedArrival < 0) {
            throw new Error('Estimated arrival must be a positive number');
        }

        const emergency = {
            id: emergencyId,
            intersection: intersectionId,
            direction,
            estimatedArrival,
            priority: 'emergency',
            createdAt: Date.now()
        };

        this.activeEmergencies.add(emergency);

        // Immediate green light for emergency direction
        if (estimatedArrival <= 10000) { // 10 seconds
            this.changeState(intersectionId, 'green');
            intersection.priority = 'emergency';
        }

        return {
            emergencyId,
            intersectionId,
            actionTaken: estimatedArrival <= 10000 ? 'immediate_green' : 'scheduled_priority',
            estimatedClearance: this.calculateEmergencyClearance(emergency)
        };
    }

    // Smart intersection coordination
    coordinateIntersections(intersectionIds, coordinationType = 'green_wave') {
        if (!Array.isArray(intersectionIds) || intersectionIds.length < 2) {
            throw new Error('At least 2 intersections required for coordination');
        }

        const intersections = intersectionIds.map(id => this.getIntersection(id));
        let coordinationPlan;

        switch (coordinationType) {
            case 'green_wave':
                coordinationPlan = this.createGreenWave(intersections);
                break;
            case 'synchronized':
                coordinationPlan = this.createSynchronization(intersections);
                break;
            case 'adaptive_network':
                coordinationPlan = this.createAdaptiveNetwork(intersections);
                break;
            default:
                throw new Error('Invalid coordination type');
        }

        return this.executeCoordinationPlan(coordinationPlan);
    }

    // Get intersection status and analytics
    getIntersectionStatus(intersectionId) {
        const intersection = this.getIntersection(intersectionId);
        const runtime = Date.now() - intersection.lastStateChange;
        
        return {
            intersectionId,
            currentState: intersection.state,
            runtime,
            cycle: intersection.cycle,
            priority: intersection.priority,
            sensors: intersection.sensors,
            metadata: intersection.metadata,
            efficiency: this.calculateIntersectionEfficiency(intersection),
            health: this.assessIntersectionHealth(intersection)
        };
    }

    // Private helper methods
    getIntersection(intersectionId) {
        const intersection = this.intersections.get(intersectionId);
        if (!intersection) {
            throw new Error(`Intersection ${intersectionId} not found`);
        }
        return intersection;
    }

    calculateAdaptiveTiming(intersection, currentLoad, congestionLevel) {
        const base = { ...intersection.cycle };
        
        // Load-based adjustment
        const loadMultiplier = Math.max(0.5, Math.min(2.0, currentLoad / 20));
        
        // Congestion-based adjustment
        const congestionAdjustment = {
            'low': 0.8,
            'moderate': 1.0,
            'high': 1.3,
            'critical': 1.6
        }[congestionLevel] || 1.0;

        return {
            green: Math.round(base.green * loadMultiplier * congestionAdjustment),
            yellow: base.yellow, // Keep yellow constant
            red: Math.max(15, Math.round(base.red / congestionAdjustment))
        };
    }

    applyMLOptimization(intersection, timing, trafficData) {
        // Simulated ML optimization
        const historicalPerformance = intersection.metadata.averageWaitTime || 30;
        const optimizationFactor = historicalPerformance > 45 ? 1.1 : 0.95;
        
        return {
            green: Math.round(timing.green * optimizationFactor),
            yellow: timing.yellow,
            red: Math.round(timing.red / optimizationFactor)
        };
    }

    calculateImprovement(oldTiming, newTiming) {
        const oldEfficiency = 100 - (oldTiming.red / (oldTiming.green + oldTiming.red)) * 100;
        const newEfficiency = 100 - (newTiming.red / (newTiming.green + newTiming.red)) * 100;
        return ((newEfficiency - oldEfficiency) / oldEfficiency * 100).toFixed(2);
    }

    calculateAdaptationConfidence(trafficData) {
        const factors = [
            trafficData.vehicleCount > 0 ? 0.4 : 0,
            trafficData.congestionLevel ? 0.3 : 0,
            trafficData.timestamp ? 0.3 : 0
        ];
        return factors.reduce((sum, factor) => sum + factor, 0);
    }

    logStateTransition(intersection, previousState, newState, duration) {
        // In a real system, this would log to a database or analytics service
        intersection.metadata.totalCycles += (newState === 'green' ? 1 : 0);
    }

    calculateEmergencyClearance(emergency) {
        return emergency.estimatedArrival + 15000; // 15 seconds after arrival
    }

    createGreenWave(intersections) {
        const baseDelay = 5000; // 5 seconds between intersections
        return intersections.map((intersection, index) => ({
            intersectionId: intersection.id,
            delay: index * baseDelay,
            action: 'green_on_schedule'
        }));
    }

    createSynchronization(intersections) {
        return intersections.map(intersection => ({
            intersectionId: intersection.id,
            delay: 0,
            action: 'synchronized_green'
        }));
    }

    createAdaptiveNetwork(intersections) {
        return intersections.map(intersection => ({
            intersectionId: intersection.id,
            delay: intersection.metadata.averageWaitTime || 0,
            action: 'adaptive_timing'
        }));
    }

    executeCoordinationPlan(plan) {
        const results = plan.map(step => {
            setTimeout(() => {
                this.changeState(step.intersectionId, 'green');
            }, step.delay);
            
            return {
                intersectionId: step.intersectionId,
                scheduled: true,
                delay: step.delay,
                action: step.action
            };
        });

        return {
            planExecuted: true,
            coordinatedIntersections: results.length,
            results
        };
    }

    calculateIntersectionEfficiency(intersection) {
        const cycleTime = intersection.cycle.green + intersection.cycle.yellow + intersection.cycle.red;
        const greenRatio = intersection.cycle.green / cycleTime;
        return Math.round(greenRatio * 100);
    }

    assessIntersectionHealth(intersection) {
        const factors = {
            cycleBalance: intersection.cycle.green / intersection.cycle.red,
            runtime: Date.now() - intersection.lastStateChange,
            totalCycles: intersection.metadata.totalCycles
        };

        if (factors.cycleBalance > 0.5 && factors.totalCycles > 10) {
            return 'excellent';
        } else if (factors.cycleBalance > 0.3) {
            return 'good';
        } else {
            return 'needs_attention';
        }
    }
}

module.exports = SmartLightController;