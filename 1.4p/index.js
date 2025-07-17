// SIT725 - Applied Software Engineering
// Task 1.4P
// Student ID: s224967779
// Student Mail: s224967779@deakin.edu.au
// Submitted By: Thoran Kumar Cherukuru Ramesh

console.log("=== SIT725 - Applied Software Engineering ===");
console.log("Task 1.4P - Basic Programming");
console.log("Student: Thoran Kumar Cherukuru Ramesh");
console.log("Student ID: s224967779");
console.log("Email: s224967779@deakin.edu.au");
console.log("===============================================");

// Simple calculator function
function calculator(a, b, operation) {
    switch(operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            return b !== 0 ? a / b : "Cannot divide by zero";
        default:
            return "Invalid operation";
    }
}

// Student information object
const studentInfo = {
    name: "Thoran Kumar Cherukuru Ramesh",
    id: "s224967779",
    email: "s224967779@deakin.edu.au",
    subject: "SIT725 - Applied Software Engineering",
    task: "1.4P"
};

// Display student info
console.log("\nStudent Information:");
console.log(`Name: ${studentInfo.name}`);
console.log(`ID: ${studentInfo.id}`);
console.log(`Email: ${studentInfo.email}`);
console.log(`Subject: ${studentInfo.subject}`);
console.log(`Task: ${studentInfo.task}`);

// Test calculator
console.log("\nCalculator Tests:");
console.log(`5 + 3 = ${calculator(5, 3, 'add')}`);
console.log(`10 - 4 = ${calculator(10, 4, 'subtract')}`);
console.log(`6 * 7 = ${calculator(6, 7, 'multiply')}`);
console.log(`15 / 3 = ${calculator(15, 3, 'divide')}`);

// Simple array operations
const numbers = [1, 2, 3, 4, 5];
console.log("\nArray Operations:");
console.log(`Numbers: ${numbers}`);
console.log(`Sum: ${numbers.reduce((sum, num) => sum + num, 0)}`);
console.log(`Average: ${numbers.reduce((sum, num) => sum + num, 0) / numbers.length}`);

console.log("\nTask 1.4P Complete!");
