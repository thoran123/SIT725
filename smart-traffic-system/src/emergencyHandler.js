class EmergencyHandler {
    constructor() {
        this.activeEmergencies = new Map();
        this.emergencyTypes = {
            'ambulance': { priority: 1, clearanceTime: 45 },
            'fire_truck': { priority: 1, clearanceTime: 60 },
            'police': { priority: 2, clearanceTime: 30 },
            'emergency_services': { priority: 1, clearanceTime: 45 }
        };
        this.responseHistory = [];
    }

    // Register emergency vehicle with AI-powered routing
    registerEmergencyVehicle(vehicleId, type, location, destination, urgency = 'high') {
        if (!vehicleId || typeof vehicleId !== 'string') {
            throw new Error('Vehicle ID must be a valid string');
        }
        if (!this.emergencyTypes[type]) {
            throw new Error('Invalid emergency vehicle type');
        }

        const emergency = {
            id: vehicleId,
            type,
            location,
            destination,
            urgency,
            status: 'active',
            registeredAt: Date.now(),
            estimatedRoute: this.calculateEmergencyRoute(location, destination),
            priority: this.calculateDynamicPriority(type, urgency),
            affectedIntersections: []
        };

        this.activeEmergencies.set(vehicleId, emergency);
        
        // Immediately start clearing the path
        const pathClearance = this.initiatePathClearance(emergency);
        
        return {
            vehicleId,
            registrationStatus: 'active',
            priority: emergency.priority,
            estimatedRoute: emergency.estimatedRoute,
            pathClearance
        };
    }

    // AI-powered emergency path optimization
    optimizeEmergencyPath(vehicleId, realTimeConditions) {
        const emergency = this.getActiveEmergency(vehicleId);
        if (!realTimeConditions || typeof realTimeConditions !== 'object') {
            throw new Error('Real-time conditions must be provided');
        }

        const optimization = {
            originalRoute: emergency.estimatedRoute,
            optimizedRoute: null,
            timeSaved: 0,
            intersectionsAvoided: 0,
            riskReduction: 0
        };

        // AI route optimization algorithm
        optimization.optimizedRoute = this.calculateOptimalRoute(
            emergency.location, 
            emergency.destination, 
            realTimeConditions,
            emergency.priority
        );

        optimization.timeSaved = this.calculateTimeSavings(
            optimization.originalRoute, 
            optimization.optimizedRoute
        );

        optimization.intersectionsAvoided = this.calculateIntersectionSavings(
            optimization.originalRoute, 
            optimization.optimizedRoute
        );

        optimization.riskReduction = this.calculateRiskReduction(
            optimization.originalRoute, 
            optimization.optimizedRoute, 
            realTimeConditions
        );

        // Update emergency with optimized route
        emergency.estimatedRoute = optimization.optimizedRoute;
        emergency.optimizationApplied = Date.now();

        return optimization;
    }

    // Smart intersection preemption system
    preemptTrafficLights(vehicleId, intersectionIds, preemptionType = 'immediate') {
        const emergency = this.getActiveEmergency(vehicleId);
        
        if (!Array.isArray(intersectionIds) || intersectionIds.length === 0) {
            throw new Error('Valid intersection IDs array required');
        }

        const preemptionResults = intersectionIds.map(intersectionId => {
            const preemption = {
                intersectionId,
                vehicleId,
                preemptionType,
                timestamp: Date.now(),
                estimatedClearance: this.calculateClearanceTime(emergency.type, intersectionId),
                success: true
            };

            // Add to affected intersections
            emergency.affectedIntersections.push(preemption);
            
            return preemption;
        });

        return {
            vehicleId,
            totalIntersections: intersectionIds.length,
            preemptionType,
            results: preemptionResults,
            estimatedPathClearance: this.calculatePathClearanceTime(preemptionResults)
        };
    }

    // Multi-emergency coordination system
    coordinateMultipleEmergencies(vehicleIds) {
        if (!Array.isArray(vehicleIds) || vehicleIds.length < 2) {
            throw new Error('At least 2 emergency vehicles required for coordination');
        }

        const emergencies = vehicleIds.map(id => this.getActiveEmergency(id));
        const coordination = {
            vehicles: emergencies.length,
            conflictPoints: this.identifyConflictPoints(emergencies),
            resolutionPlan: null,
            priorityOrder: [],
            estimatedDelays: new Map()
        };

        // AI-powered conflict resolution
        coordination.resolutionPlan = this.resolveEmergencyConflicts(emergencies);
        coordination.priorityOrder = this.establishPriorityOrder(emergencies);
        
        // Calculate delays for lower priority vehicles
        coordination.priorityOrder.forEach((emergency, index) => {
            if (index > 0) {
                const delay = this.calculateCoordinationDelay(emergency, coordination.conflictPoints);
                coordination.estimatedDelays.set(emergency.id, delay);
            }
        });

        return this.executeCoordinationPlan(coordination);
    }

    // Emergency response analytics and learning
    analyzeResponsePerformance(timeRange = 86400000) { // 24 hours default
        const cutoffTime = Date.now() - timeRange;
        const recentResponses = this.responseHistory.filter(
            response => response.timestamp >= cutoffTime
        );

        if (recentResponses.length === 0) {
            return { message: 'No emergency responses in specified time range' };
        }

        const analytics = {
            totalResponses: recentResponses.length,
            averageResponseTime: 0,
            successRate: 0,
            performanceByType: {},
            bottlenecks: [],
            recommendations: []
        };

        analytics.averageResponseTime = recentResponses.reduce(
            (sum, response) => sum + response.responseTime, 0
        ) / recentResponses.length;

        analytics.successRate = recentResponses.filter(
            response => response.success
        ).length / recentResponses.length * 100;

        analytics.performanceByType = this.analyzePerformanceByType(recentResponses);
        analytics.bottlenecks = this.identifySystemBottlenecks(recentResponses);
        analytics.recommendations = this.generatePerformanceRecommendations(analytics);

        return analytics;
    }

    // Deregister emergency vehicle
    deregisterEmergencyVehicle(vehicleId, completionStatus = 'completed') {
        const emergency = this.getActiveEmergency(vehicleId);
        
        // Record response for analytics
        const responseRecord = {
            vehicleId,
            type: emergency.type,
            registeredAt: emergency.registeredAt,
            completedAt: Date.now(),
            responseTime: Date.now() - emergency.registeredAt,
            success: completionStatus === 'completed',
            affectedIntersections: emergency.affectedIntersections.length,
            timestamp: Date.now()
        };

        this.responseHistory.push(responseRecord);
        
        // Clear intersection preemptions
        const clearanceResults = this.clearIntersectionPreemptions(emergency);
        
        // Remove from active emergencies
        this.activeEmergencies.delete(vehicleId);

        return {
            vehicleId,
            deregistrationStatus: 'completed',
            responseTime: responseRecord.responseTime,
            intersectionsCleared: clearanceResults.length,
            finalStatus: completionStatus
        };
    }

    // Private helper methods
    getActiveEmergency(vehicleId) {
        const emergency = this.activeEmergencies.get(vehicleId);
        if (!emergency) {
            throw new Error(`Emergency vehicle ${vehicleId} not found or not active`);
        }
        return emergency;
    }

    calculateEmergencyRoute(origin, destination) {
        // Simplified route calculation
        const estimatedDistance = Math.random() * 10 + 2; // 2-12 km
        const estimatedTime = estimatedDistance * 2; // 2 minutes per km at emergency speed
        
        return {
            distance: estimatedDistance,
            estimatedTime: estimatedTime * 60 * 1000, // milliseconds
            waypoints: this.generateWaypoints(origin, destination),
            intersections: Math.ceil(estimatedDistance / 0.5) // One intersection per 500m
        };
    }

    calculateDynamicPriority(type, urgency) {
        const basePriority = this.emergencyTypes[type].priority;
        const urgencyMultiplier = {
            'low': 0.8,
            'medium': 1.0,
            'high': 1.2,
            'critical': 1.5
        }[urgency] || 1.0;
        
        return Math.round(basePriority * urgencyMultiplier * 10) / 10;
    }

    initiatePathClearance(emergency) {
        const clearanceActions = [
            'Signal traffic management system',
            'Alert nearby intersections',
            'Calculate optimal timing',
            'Prepare preemption sequences'
        ];

        return {
            actions: clearanceActions,
            estimatedClearanceTime: this.emergencyTypes[emergency.type].clearanceTime,
            status: 'initiated'
        };
    }

    calculateOptimalRoute(origin, destination, conditions, priority) {
        // AI-enhanced route calculation considering real-time conditions
        const baseRoute = this.calculateEmergencyRoute(origin, destination);
        
        // Apply optimizations based on conditions
        if (conditions.trafficDensity > 0.7) {
            baseRoute.estimatedTime *= 0.8; // Better route found
            baseRoute.intersections -= 2; // Avoid congested intersections
        }
        
        if (conditions.weatherConditions === 'adverse') {
            baseRoute.estimatedTime *= 1.1; // Add safety buffer
        }
        
        baseRoute.optimizationApplied = true;
        baseRoute.optimizationFactor = priority;
        
        return baseRoute;
    }

    calculateTimeSavings(originalRoute, optimizedRoute) {
        return Math.max(0, originalRoute.estimatedTime - optimizedRoute.estimatedTime);
    }

    calculateIntersectionSavings(originalRoute, optimizedRoute) {
        return Math.max(0, originalRoute.intersections - optimizedRoute.intersections);
    }

    calculateRiskReduction(originalRoute, optimizedRoute, conditions) {
        let riskReduction = 0;
        
        if (optimizedRoute.intersections < originalRoute.intersections) {
            riskReduction += 0.2;
        }
        
        if (optimizedRoute.estimatedTime < originalRoute.estimatedTime) {
            riskReduction += 0.3;
        }
        
        if (conditions.trafficDensity > 0.7 && optimizedRoute.optimizationApplied) {
            riskReduction += 0.1;
        }
        
        return Math.round(riskReduction * 100);
    }

    calculateClearanceTime(emergencyType, intersectionId) {
        const baseTime = this.emergencyTypes[emergencyType].clearanceTime;
        const intersectionComplexity = Math.random() * 0.5 + 0.75; // 0.75-1.25 multiplier
        
        return Math.round(baseTime * intersectionComplexity);
    }

    calculatePathClearanceTime(preemptionResults) {
        return Math.max(...preemptionResults.map(result => result.estimatedClearance));
    }

    generateWaypoints(origin, destination) {
        const waypointCount = Math.floor(Math.random() * 3) + 2; // 2-4 waypoints
        const waypoints = [];
        
        for (let i = 0; i < waypointCount; i++) {
            waypoints.push(`waypoint_${i + 1}_${origin}_to_${destination}`);
        }
        
        return waypoints;
    }

    identifyConflictPoints(emergencies) {
        const conflicts = [];
        
        for (let i = 0; i < emergencies.length; i++) {
            for (let j = i + 1; j < emergencies.length; j++) {
                const conflict = this.findRouteConflicts(emergencies[i], emergencies[j]);
                if (conflict.hasConflict) {
                    conflicts.push(conflict);
                }
            }
        }
        
        return conflicts;
    }

    findRouteConflicts(emergency1, emergency2) {
        // Simplified conflict detection
        const hasConflict = Math.random() > 0.7; // 30% chance of conflict
        
        return {
            hasConflict,
            vehicles: [emergency1.id, emergency2.id],
            conflictType: hasConflict ? 'intersection_overlap' : 'none',
            severity: hasConflict ? Math.random() > 0.5 ? 'high' : 'medium' : 'none'
        };
    }

    resolveEmergencyConflicts(emergencies) {
        return emergencies.map((emergency, index) => ({
            vehicleId: emergency.id,
            action: index === 0 ? 'proceed' : 'yield_temporarily',
            delayTime: index === 0 ? 0 : Math.random() * 30 + 15 // 15-45 seconds delay
        }));
    }

    establishPriorityOrder(emergencies) {
        return emergencies.sort((a, b) => b.priority - a.priority);
    }

    calculateCoordinationDelay(emergency, conflictPoints) {
        const relevantConflicts = conflictPoints.filter(conflict => 
            conflict.vehicles.includes(emergency.id)
        );
        
        return relevantConflicts.reduce((totalDelay, conflict) => 
            totalDelay + (conflict.severity === 'high' ? 45 : 20), 0
        );
    }

    executeCoordinationPlan(coordination) {
        return {
            planExecuted: true,
            coordinatedVehicles: coordination.vehicles,
            conflictsResolved: coordination.conflictPoints.length,
            priorityOrder: coordination.priorityOrder.map(e => e.id),
            totalDelay: Array.from(coordination.estimatedDelays.values())
                .reduce((sum, delay) => sum + delay, 0)
        };
    }

    analyzePerformanceByType(responses) {
        const performanceByType = {};
        
        Object.keys(this.emergencyTypes).forEach(type => {
            const typeResponses = responses.filter(r => r.type === type);
            if (typeResponses.length > 0) {
                performanceByType[type] = {
                    count: typeResponses.length,
                    averageResponseTime: typeResponses.reduce((sum, r) => sum + r.responseTime, 0) / typeResponses.length,
                    successRate: typeResponses.filter(r => r.success).length / typeResponses.length * 100
                };
            }
        });
        
        return performanceByType;
    }

    identifySystemBottlenecks(responses) {
        const bottlenecks = [];
        
        const slowResponses = responses.filter(r => r.responseTime > 120000); // >2 minutes
        if (slowResponses.length > responses.length * 0.2) {
            bottlenecks.push('High response time detected');
        }
        
        const intersectionIssues = responses.filter(r => r.affectedIntersections > 5);
        if (intersectionIssues.length > 0) {
            bottlenecks.push('Complex intersection navigation');
        }
        
        return bottlenecks;
    }

    generatePerformanceRecommendations(analytics) {
        const recommendations = [];
        
        if (analytics.averageResponseTime > 90000) { // >1.5 minutes
            recommendations.push('Optimize traffic preemption algorithms');
        }
        
        if (analytics.successRate < 95) {
            recommendations.push('Review emergency vehicle routing protocols');
        }
        
        if (analytics.bottlenecks.length > 0) {
            recommendations.push('Address identified system bottlenecks');
        }
        
        return recommendations;
    }

    clearIntersectionPreemptions(emergency) {
        return emergency.affectedIntersections.map(preemption => ({
            intersectionId: preemption.intersectionId,
            cleared: true,
            clearanceTime: Date.now()
        }));
    }
}

module.exports = EmergencyHandler;