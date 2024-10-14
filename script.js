// Set the launch date
const launchDate = new Date("December 31, 2025 23:59:59").getTime();

// Update countdown every second
const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeDifference = launchDate - now;

    if (timeDifference <= 0) {
        clearInterval(timerInterval);
        document.querySelector('.timer').innerHTML = "We're Live!";
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days.toString().padStart(2, '0');
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
}, 1000);