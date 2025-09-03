/**
 * Message model definition
 */

class Message {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.text = data.text;
        this.sender = data.sender;
        this.senderAvatar = data.senderAvatar || '👤';
        this.timestamp = data.timestamp || new Date();
        this.type = data.type || 'text';
        this.edited = false;
        this.editedAt = null;
    }
    
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    edit(newText) {
        this.text = newText;
        this.edited = true;
        this.editedAt = new Date();
    }
    
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            sender: this.sender,
            senderAvatar: this.senderAvatar,
            timestamp: this.timestamp,
            type: this.type,
            edited: this.edited,
            editedAt: this.editedAt
        };
    }
}

module.exports = Message;