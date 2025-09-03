/**
 * Input validation functions
 */

class Validators {
    static validateTask(taskData) {
        const errors = [];
        
        if (!taskData.title || taskData.title.trim().length === 0) {
            errors.push('Task title is required');
        }
        
        if (taskData.title && taskData.title.length > 100) {
            errors.push('Task title must be less than 100 characters');
        }
        
        if (taskData.description && taskData.description.length > 500) {
            errors.push('Task description must be less than 500 characters');
        }
        
        const validPriorities = ['low', 'medium', 'high'];
        if (taskData.priority && !validPriorities.includes(taskData.priority)) {
            errors.push('Invalid priority level');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static validateMessage(messageData) {
        const errors = [];
        
        if (!messageData.text || messageData.text.trim().length === 0) {
            errors.push('Message text is required');
        }
        
        if (messageData.text && messageData.text.length > 1000) {
            errors.push('Message must be less than 1000 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static validateUser(userData) {
        const errors = [];
        
        if (!userData.name || userData.name.trim().length === 0) {
            errors.push('User name is required');
        }
        
        if (userData.name && userData.name.length > 50) {
            errors.push('User name must be less than 50 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Validators;