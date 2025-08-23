class CongestionPredictor {
    constructor() {
        this.historicalData = [];
        this.weatherData = new Map();
        this.eventData = new Map();
        this.modelWeights = {
            historical: 0.4,
            weather: 0.3,
            events: 0.2,
            realtime: 0.1
        };
    }

    // Predict traffic congestion using multiple data sources
    predictCongestion(location, timeHorizon = 3600000) { // 1 hour default
        if (!location || typeof location !== 'string') {
            throw new Error('Location must be a valid string');
        }
        if (typeof timeHorizon !== 'number' || timeHorizon < 0) {
            throw new Error('Time horizon must be a positive number');
        }

        const prediction = {
            location,
            timeHorizon,
            timestamp: Date.now(),
            predictions: this.generatePredictions(location, timeHorizon),
            confidence: 0,
            factors: this.analyzePredictionFactors(location)
        };

        prediction.confidence = this.calculatePredictionConfidence(prediction);
        return prediction;
    }

    // Machine learning-based traffic pattern analysis
    analyzeTrafficPatterns(data, learningMode = 'supervised') {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Traffic data must be a non-empty array');
        }

        const patterns = {
            daily: this.extractDailyPatterns(data),
            weekly: this.extractWeeklyPatterns(data),
            seasonal: this.extractSeasonalPatterns(data),
            anomalies: this.detectAnomalies(data)
        };

        const model = this.trainPredictionModel(data, patterns, learningMode);
        
        return {
            patterns,
            model: {
                accuracy: model.accuracy,
                type: learningMode,
                trainingSize: data.length,
                features: model.features
            },
            insights: this.generatePatternInsights(patterns)
        };
    }

    // Real-time congestion risk assessment
    assessRealTimeRisk(location, currentConditions) {
        if (!currentConditions || typeof currentConditions !== 'object') {
            throw new Error('Current conditions must be a valid object');
        }

        const riskFactors = {
            traffic: this.assessTrafficRisk(currentConditions.trafficFlow || 0),
            weather: this.assessWeatherRisk(currentConditions.weather),
            events: this.assessEventRisk(location, currentConditions.time),
            infrastructure: this.assessInfrastructureRisk(location)
        };

        const overallRisk = this.calculateOverallRisk(riskFactors);
        
        return {
            location,
            timestamp: Date.now(),
            riskLevel: this.categorizeRisk(overallRisk),
            riskScore: overallRisk,
            factors: riskFactors,
            recommendations: this.generateRiskRecommendations(riskFactors, overallRisk)
        };
    }

    // Predictive route optimization
    optimizeRoutes(origin, destinations, constraints = {}) {
        if (!origin || !Array.isArray(destinations) || destinations.length === 0) {
            throw new Error('Valid origin and destinations array required');
        }

        const routes = destinations.map(dest => ({
            destination: dest,
            predictedCongestion: this.predictCongestion(dest, 1800000), // 30 min
            estimatedTime: this.estimateTravelTime(origin, dest, constraints),
            riskAssessment: this.assessRealTimeRisk(dest, { trafficFlow: 20, time: Date.now() })
        }));

        const optimization = {
            routes: routes.sort((a, b) => a.estimatedTime - b.estimatedTime),
            optimalRoute: null,
            alternativeRoutes: [],
            totalOptimization: 0
        };

        optimization.optimalRoute = optimization.routes[0];
        optimization.alternativeRoutes = optimization.routes.slice(1, 3);
        optimization.totalOptimization = this.calculateRouteOptimization(optimization.routes);

        return optimization;
    }

    // Add external data sources for better predictions
    integrateWeatherData(location, weatherInfo) {
        if (!weatherInfo || typeof weatherInfo !== 'object') {
            throw new Error('Weather info must be a valid object');
        }

        const weatherImpact = {
            location,
            conditions: weatherInfo.conditions || 'clear',
            temperature: weatherInfo.temperature || 20,
            precipitation: weatherInfo.precipitation || 0,
            visibility: weatherInfo.visibility || 10,
            trafficImpact: this.calculateWeatherImpact(weatherInfo),
            timestamp: Date.now()
        };

        this.weatherData.set(location, weatherImpact);
        return weatherImpact;
    }

    integrateEventData(location, eventInfo) {
        if (!eventInfo || typeof eventInfo !== 'object') {
            throw new Error('Event info must be a valid object');
        }

        const eventImpact = {
            location,
            type: eventInfo.type || 'unknown',
            startTime: eventInfo.startTime || Date.now(),
            endTime: eventInfo.endTime || Date.now() + 3600000,
            expectedAttendance: eventInfo.expectedAttendance || 0,
            trafficImpact: this.calculateEventImpact(eventInfo),
            timestamp: Date.now()
        };

        this.eventData.set(location, eventImpact);
        return eventImpact;
    }

    // Private helper methods
    generatePredictions(location, timeHorizon) {
        const intervals = Math.ceil(timeHorizon / 900000); // 15-minute intervals
        const predictions = [];

        for (let i = 0; i < intervals; i++) {
            const time = Date.now() + (i * 900000);
            const prediction = {
                timestamp: time,
                congestionLevel: this.predictCongestionLevel(location, time),
                vehicleDensity: this.predictVehicleDensity(location, time),
                averageSpeed: this.predictAverageSpeed(location, time)
            };
            predictions.push(prediction);
        }

        return predictions;
    }

    analyzePredictionFactors(location) {
        return {
            historical: this.getHistoricalFactor(location),
            weather: this.getWeatherFactor(location),
            events: this.getEventsFactor(location),
            timeOfDay: this.getTimeOfDayFactor(),
            dayOfWeek: this.getDayOfWeekFactor()
        };
    }

    calculatePredictionConfidence(prediction) {
        const factors = prediction.factors;
        let confidence = 0.5; // Base confidence

        if (factors.historical > 0.7) confidence += 0.2;
        if (factors.weather > 0.5) confidence += 0.1;
        if (factors.events > 0.3) confidence += 0.1;
        if (prediction.predictions.length > 2) confidence += 0.1;

        return Math.min(1.0, confidence);
    }

    extractDailyPatterns(data) {
        const hourlyAverage = new Array(24).fill(0);
        const hourlyCounts = new Array(24).fill(0);

        data.forEach(point => {
            if (point.timestamp) {
                const hour = new Date(point.timestamp).getHours();
                hourlyAverage[hour] += point.congestionLevel || 0;
                hourlyCounts[hour]++;
            }
        });

        return hourlyAverage.map((sum, i) => 
            hourlyCounts[i] > 0 ? sum / hourlyCounts[i] : 0);
    }

    extractWeeklyPatterns(data) {
        const dailyAverage = new Array(7).fill(0);
        const dailyCounts = new Array(7).fill(0);

        data.forEach(point => {
            if (point.timestamp) {
                const day = new Date(point.timestamp).getDay();
                dailyAverage[day] += point.congestionLevel || 0;
                dailyCounts[day]++;
            }
        });

        return dailyAverage.map((sum, i) => 
            dailyCounts[i] > 0 ? sum / dailyCounts[i] : 0);
    }

    extractSeasonalPatterns(data) {
        const monthlyAverage = new Array(12).fill(0);
        const monthlyCounts = new Array(12).fill(0);

        data.forEach(point => {
            if (point.timestamp) {
                const month = new Date(point.timestamp).getMonth();
                monthlyAverage[month] += point.congestionLevel || 0;
                monthlyCounts[month]++;
            }
        });

        return monthlyAverage.map((sum, i) => 
            monthlyCounts[i] > 0 ? sum / monthlyCounts[i] : 0);
    }

    detectAnomalies(data) {
        if (data.length < 10) return [];

        const values = data.map(d => d.congestionLevel || 0);
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const threshold = mean + (2 * stdDev);

        return data.filter((point, index) => values[index] > threshold);
    }

    trainPredictionModel(data, patterns, learningMode) {
        // Simplified ML model simulation
        const features = ['traffic_flow', 'time_of_day', 'day_of_week', 'weather'];
        const accuracy = Math.min(0.95, 0.6 + (data.length / 1000) * 0.3);

        return {
            accuracy: Math.round(accuracy * 100) / 100,
            features,
            type: learningMode
        };
    }

    generatePatternInsights(patterns) {
        const insights = [];
        
        // Daily pattern insights
        const peakHour = patterns.daily.indexOf(Math.max(...patterns.daily));
        insights.push(`Peak congestion typically occurs at ${peakHour}:00`);
        
        // Weekly pattern insights
        const peakDay = patterns.weekly.indexOf(Math.max(...patterns.weekly));
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        insights.push(`${days[peakDay]} is typically the busiest day`);

        return insights;
    }

    assessTrafficRisk(trafficFlow) {
        if (trafficFlow < 10) return { level: 'low', score: 0.2 };
        if (trafficFlow < 25) return { level: 'moderate', score: 0.5 };
        if (trafficFlow < 40) return { level: 'high', score: 0.7 };
        return { level: 'critical', score: 0.9 };
    }

    assessWeatherRisk(weather) {
        if (!weather) return { level: 'low', score: 0.1 };
        
        const conditions = weather.conditions || 'clear';
        const riskMap = {
            'clear': 0.1,
            'cloudy': 0.2,
            'rain': 0.6,
            'heavy_rain': 0.8,
            'snow': 0.9,
            'fog': 0.7
        };
        
        const score = riskMap[conditions] || 0.3;
        return { level: this.scoreToLevel(score), score };
    }

    assessEventRisk(location, time) {
        const eventData = this.eventData.get(location);
        if (!eventData) return { level: 'low', score: 0.1 };
        
        const isEventTime = time >= eventData.startTime && time <= eventData.endTime;
        const score = isEventTime ? eventData.trafficImpact : 0.1;
        
        return { level: this.scoreToLevel(score), score };
    }

    assessInfrastructureRisk(location) {
        // Simulated infrastructure assessment
        const infrastructureQuality = Math.random() * 0.4 + 0.1; // 0.1-0.5 range
        return { level: this.scoreToLevel(infrastructureQuality), score: infrastructureQuality };
    }

    calculateOverallRisk(riskFactors) {
        return Object.values(riskFactors).reduce((sum, risk) => 
            sum + (risk.score * this.modelWeights[Object.keys(riskFactors).find(key => riskFactors[key] === risk)] || 0.25), 0);
    }

    categorizeRisk(riskScore) {
        if (riskScore < 0.3) return 'low';
        if (riskScore < 0.6) return 'moderate';
        if (riskScore < 0.8) return 'high';
        return 'critical';
    }

    generateRiskRecommendations(riskFactors, overallRisk) {
        const recommendations = [];
        
        if (riskFactors.traffic.score > 0.7) {
            recommendations.push('Consider alternative routes');
            recommendations.push('Delay non-essential travel');
        }
        
        if (riskFactors.weather.score > 0.6) {
            recommendations.push('Reduce speed and increase following distance');
            recommendations.push('Allow extra travel time');
        }
        
        if (overallRisk > 0.8) {
            recommendations.push('HIGH PRIORITY: Activate traffic management protocols');
            recommendations.push('Deploy additional traffic control resources');
        }
        
        return recommendations;
    }

    estimateTravelTime(origin, destination, constraints) {
        const baseTime = Math.random() * 30 + 15; // 15-45 minutes base
        const congestionMultiplier = 1 + (Math.random() * 0.5); // 1.0-1.5x
        const weatherMultiplier = constraints.weather ? 1.2 : 1.0;
        
        return Math.round(baseTime * congestionMultiplier * weatherMultiplier);
    }

    calculateRouteOptimization(routes) {
        if (routes.length < 2) return 0;
        
        const bestTime = routes[0].estimatedTime;
        const worstTime = routes[routes.length - 1].estimatedTime;
        
        return Math.round(((worstTime - bestTime) / worstTime) * 100);
    }

    calculateWeatherImpact(weatherInfo) {
        const conditions = weatherInfo.conditions || 'clear';
        const impactMap = {
            'clear': 0.1,
            'cloudy': 0.2,
            'rain': 0.4,
            'heavy_rain': 0.7,
            'snow': 0.8,
            'fog': 0.6
        };
        
        return impactMap[conditions] || 0.3;
    }

    calculateEventImpact(eventInfo) {
        const attendance = eventInfo.expectedAttendance || 0;
        const duration = (eventInfo.endTime - eventInfo.startTime) / 3600000; // hours
        
        return Math.min(0.9, (attendance / 10000) * (duration / 4) * 0.5);
    }

    predictCongestionLevel(location, time) {
        const hour = new Date(time).getHours();
        const baseLevel = hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 0.8 : 0.3;
        const randomVariation = (Math.random() - 0.5) * 0.2;
        
        return Math.max(0, Math.min(1, baseLevel + randomVariation));
    }

    predictVehicleDensity(location, time) {
        const congestionLevel = this.predictCongestionLevel(location, time);
        return Math.round(congestionLevel * 50); // 0-50 vehicles per area
    }

    predictAverageSpeed(location, time) {
        const congestionLevel = this.predictCongestionLevel(location, time);
        const maxSpeed = 60; // km/h
        return Math.round(maxSpeed * (1 - congestionLevel));
    }

    getHistoricalFactor(location) {
        return this.historicalData.length > 10 ? 0.8 : 0.3;
    }

    getWeatherFactor(location) {
        return this.weatherData.has(location) ? 0.7 : 0.2;
    }

    getEventsFactor(location) {
        return this.eventData.has(location) ? 0.6 : 0.1;
    }

    getTimeOfDayFactor() {
        const hour = new Date().getHours();
        return hour >= 6 && hour <= 22 ? 0.8 : 0.4; // Higher confidence during active hours
    }

    getDayOfWeekFactor() {
        const day = new Date().getDay();
        return day >= 1 && day <= 5 ? 0.9 : 0.6; // Higher confidence on weekdays
    }

    scoreToLevel(score) {
        if (score < 0.3) return 'low';
        if (score < 0.6) return 'moderate';
        if (score < 0.8) return 'high';
        return 'critical';
    }
}

module.exports = CongestionPredictor;