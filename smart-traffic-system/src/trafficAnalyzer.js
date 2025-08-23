class TrafficAnalyzer {
    constructor() {
        this.trafficData = new Map();
        this.patterns = [];
        this.learningRate = 0.1;
    }

    // Analyze real-time traffic data using AI algorithms
    analyzeTrafficFlow(intersection, vehicleCount, timestamp = Date.now()) {
        if (!intersection || typeof intersection !== 'string') {
            throw new Error('Intersection ID must be a valid string');
        }
        if (typeof vehicleCount !== 'number' || vehicleCount < 0) {
            throw new Error('Vehicle count must be a non-negative number');
        }

        const dataPoint = {
            intersection,
            vehicleCount,
            timestamp,
            flowRate: this.calculateFlowRate(vehicleCount, timestamp),
            congestionLevel: this.calculateCongestionLevel(vehicleCount)
        };

        this.storeTrafficData(intersection, dataPoint);
        return this.generateTrafficInsight(intersection);
    }

    // AI-powered traffic pattern recognition
    detectTrafficPatterns(intersection, timeWindow = 3600000) { // 1 hour default
        const data = this.getTrafficHistory(intersection, timeWindow);
        if (data.length < 3) {
            return { pattern: 'insufficient_data', confidence: 0 };
        }

        const patterns = this.analyzePatterns(data);
        return {
            pattern: patterns.dominant,
            confidence: patterns.confidence,
            prediction: this.predictNextFlow(patterns),
            recommendations: this.generateRecommendations(patterns)
        };
    }

    // Smart traffic optimization suggestions
    optimizeIntersection(intersection) {
        const currentData = this.trafficData.get(intersection);
        if (!currentData || currentData.length === 0) {
            throw new Error('No traffic data available for optimization');
        }

        const latest = currentData[currentData.length - 1];
        const optimization = {
            currentEfficiency: this.calculateEfficiency(latest),
            suggestedTimings: this.calculateOptimalTimings(latest),
            expectedImprovement: 0,
            priority: this.calculatePriority(latest)
        };

        optimization.expectedImprovement = this.calculateImprovement(optimization);
        return optimization;
    }

    // Private helper methods
    calculateFlowRate(vehicleCount, timestamp) {
        const timeInHours = timestamp / (1000 * 60 * 60);
        return vehicleCount / (timeInHours || 1);
    }

    calculateCongestionLevel(vehicleCount) {
        if (vehicleCount < 10) return 'low';
        if (vehicleCount < 25) return 'moderate';
        if (vehicleCount < 50) return 'high';
        return 'critical';
    }

    storeTrafficData(intersection, dataPoint) {
        if (!this.trafficData.has(intersection)) {
            this.trafficData.set(intersection, []);
        }
        this.trafficData.get(intersection).push(dataPoint);
        
        // Keep only last 100 data points per intersection
        if (this.trafficData.get(intersection).length > 100) {
            this.trafficData.get(intersection).shift();
        }
    }

    generateTrafficInsight(intersection) {
        const data = this.trafficData.get(intersection);
        const latest = data[data.length - 1];
        
        return {
            intersection,
            currentFlow: latest.vehicleCount,
            congestionLevel: latest.congestionLevel,
            trend: this.calculateTrend(data),
            efficiency: this.calculateEfficiency(latest),
            alerts: this.generateAlerts(latest)
        };
    }

    getTrafficHistory(intersection, timeWindow) {
        const data = this.trafficData.get(intersection) || [];
        const cutoffTime = Date.now() - timeWindow;
        return data.filter(point => point.timestamp >= cutoffTime);
    }

    analyzePatterns(data) {
        const patterns = {
            increasing: this.detectIncreasingPattern(data),
            decreasing: this.detectDecreasingPattern(data),
            cyclical: this.detectCyclicalPattern(data),
            stable: this.detectStablePattern(data)
        };

        const dominantPattern = Object.entries(patterns)
            .reduce((max, [pattern, confidence]) => 
                confidence > max.confidence ? { pattern, confidence } : max, 
                { pattern: 'unknown', confidence: 0 });

        return dominantPattern;
    }

    detectIncreasingPattern(data) {
        let increases = 0;
        for (let i = 1; i < data.length; i++) {
            if (data[i].vehicleCount > data[i-1].vehicleCount) increases++;
        }
        return increases / (data.length - 1);
    }

    detectDecreasingPattern(data) {
        let decreases = 0;
        for (let i = 1; i < data.length; i++) {
            if (data[i].vehicleCount < data[i-1].vehicleCount) decreases++;
        }
        return decreases / (data.length - 1);
    }

    detectCyclicalPattern(data) {
        // Simplified cyclical detection
        const avgFlow = data.reduce((sum, d) => sum + d.vehicleCount, 0) / data.length;
        const variance = data.reduce((sum, d) => sum + Math.pow(d.vehicleCount - avgFlow, 2), 0) / data.length;
        return variance > 50 && variance < 200 ? 0.8 : 0.2;
    }

    detectStablePattern(data) {
        const avgFlow = data.reduce((sum, d) => sum + d.vehicleCount, 0) / data.length;
        const variance = data.reduce((sum, d) => sum + Math.pow(d.vehicleCount - avgFlow, 2), 0) / data.length;
        return variance < 25 ? 0.9 : 0.1;
    }

    predictNextFlow(patterns) {
        const baseFlow = 20; // Average baseline
        const adjustment = patterns.confidence * (patterns.pattern === 'increasing' ? 10 : 
                          patterns.pattern === 'decreasing' ? -10 : 0);
        return Math.max(0, baseFlow + adjustment);
    }

    generateRecommendations(patterns) {
        const recommendations = [];
        if (patterns.confidence > 0.7) {
            if (patterns.pattern === 'increasing') {
                recommendations.push('Increase green light duration');
                recommendations.push('Activate alternate routes');
            } else if (patterns.pattern === 'decreasing') {
                recommendations.push('Reduce green light duration');
                recommendations.push('Divert resources to busier intersections');
            }
        }
        return recommendations;
    }

    calculateEfficiency(dataPoint) {
        const optimal = 30; // Optimal vehicles per cycle
        return Math.max(0, 100 - Math.abs(dataPoint.vehicleCount - optimal) * 2);
    }

    calculateOptimalTimings(dataPoint) {
        const baseGreen = 30; // seconds
        const adjustment = Math.floor(dataPoint.vehicleCount / 10) * 5;
        return {
            greenTime: Math.min(60, Math.max(15, baseGreen + adjustment)),
            redTime: Math.max(15, 45 - adjustment)
        };
    }

    calculatePriority(dataPoint) {
        if (dataPoint.congestionLevel === 'critical') return 'high';
        if (dataPoint.congestionLevel === 'high') return 'medium';
        return 'low';
    }

    calculateImprovement(optimization) {
        return Math.min(30, optimization.suggestedTimings.greenTime - 30);
    }

    calculateTrend(data) {
        if (data.length < 3) return 'stable';
        const recent = data.slice(-3);
        const trend = recent[2].vehicleCount - recent[0].vehicleCount;
        return trend > 5 ? 'increasing' : trend < -5 ? 'decreasing' : 'stable';
    }

    generateAlerts(dataPoint) {
        const alerts = [];
        if (dataPoint.congestionLevel === 'critical') {
            alerts.push('CRITICAL: Severe congestion detected');
        }
        if (dataPoint.vehicleCount > 40) {
            alerts.push('WARNING: High vehicle density');
        }
        return alerts;
    }
}

module.exports = TrafficAnalyzer;