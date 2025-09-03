/**
 * Task model definition
 */

class Task {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.title = data.title;
        this.description = data.description || '';
        this.status = data.status || 'todo';
        this.priority = data.priority || 'medium';
        this.createdBy = data.createdBy;
        this.assignedTo = data.assignedTo || null;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || null;
        this.updatedBy = data.updatedBy || null;
    }
    
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    updateStatus(newStatus, updatedBy) {
        this.status = newStatus;
        this.updatedAt = new Date();
        this.updatedBy = updatedBy;
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            createdBy: this.createdBy,
            assignedTo: this.assignedTo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy
        };
    }
}

module.exports = Task;