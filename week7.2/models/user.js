/**
 * User model definition
 */

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.avatar = data.avatar || '👤';
        this.joinedAt = data.joinedAt || new Date();
        this.isActive = true;
        this.lastSeen = new Date();
    }
    
    updateActivity() {
        this.lastSeen = new Date();
        this.isActive = true;
    }
    
    setInactive() {
        this.isActive = false;
    }
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            joinedAt: this.joinedAt,
            isActive: this.isActive,
            lastSeen: this.lastSeen
        };
    }
}

module.exports = User;