var today = new Date();
var hours = today.getHours();
var greeting;

if (hours > 18) {
	greeting = 'Good evening!'
} else if (hours > 12) {
	greeting = 'Good afternoon!'
} else if (hours > 0) {
	greeting = 'Good morning!'
} else {
	greeting = 'Welcome!'
}

document.write(greeting);