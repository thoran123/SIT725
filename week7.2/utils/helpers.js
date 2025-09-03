/**
 * Helper utility functions for the application
 */

class Helpers {
    static generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    static formatTimestamp(date) {
        return new Date(date).toISOString();
    }
    
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

module.exports = Helpers;