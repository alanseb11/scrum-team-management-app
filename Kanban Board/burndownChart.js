document.addEventListener('DOMContentLoaded', function() {
    // Handle the Burndown Chart button click
    document.getElementById('burndownChartButton').addEventListener('click', function() {
        // Display the modal
        const modal = document.getElementById('burndownChartModal');
        modal.style.display = 'block';

        // Render the chart when the modal opens
        renderBurndownChart();
    });

    // Handle closing the modal
    const burndownModalCloseButton = document.querySelector('#burndownChartModal .close');
    burndownModalCloseButton.addEventListener('click', function() {
        const modal = document.getElementById('burndownChartModal');
        modal.style.display = 'none';
    });

    // Function to calculate burndown data
    function calculateBurndownData(tasks, totalEffort, sprintDays) {
        const timeLogByDay = {};

        // Aggregate time worked by day from task timeTracking data
        tasks.forEach(task => {
            if (task.timeTracking) {
                task.timeTracking.forEach(entry => {
                    const date = entry.dateWorkedOn;
                    if (!timeLogByDay[date]) {
                        timeLogByDay[date] = 0;
                    }
                    timeLogByDay[date] += entry.hoursWorked;
                });
            }
        });

        // Sort the dates and initialize remaining effort
        const sortedDates = Object.keys(timeLogByDay).sort();
        let remainingEffort = totalEffort;
        const actualProgress = [totalEffort]; // Start with full effort

        sortedDates.forEach(date => {
            remainingEffort -= timeLogByDay[date];
            actualProgress.push(remainingEffort);
        });

        // Fill in any missing days in the sprint (days with no work logged)
        for (let i = actualProgress.length; i < sprintDays; i++) {
            actualProgress.push(remainingEffort);
        }

        return { labels: sortedDates, actualProgress };
    }

    // Chart.js function to render the burndown chart with ideal and actual progress
    function renderBurndownChart() {
        const ctx = document.getElementById('burndownChartCanvas').getContext('2d');

        // Example: Total estimated effort and sprint duration (replace with dynamic data)
        const totalEstimatedEffort = 50; // Sum of all task story points or hours
        const sprintDays = 7; // Total sprint days
        const idealProgress = Array.from({ length: sprintDays + 1 }, (_, i) => totalEstimatedEffort * (1 - i / sprintDays));

        // Fetch actual progress based on the task time log data
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const { labels, actualProgress } = calculateBurndownData(tasks, totalEstimatedEffort, sprintDays);

        const data = {
            labels: labels.length ? labels : Array.from({ length: sprintDays }, (_, i) => `Day ${i + 1}`), // Use actual dates or fallback to 'Day 1', 'Day 2' etc.
            datasets: [
                {
                    label: 'Ideal Progress',
                    data: idealProgress,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Actual Progress',
                    data: actualProgress,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }
            ]
        };

        // If a chart already exists, destroy it before creating a new one
        if (window.burndownChart) {
            window.burndownChart.destroy();
        }

        // Create a new chart instance
        window.burndownChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Burndown Chart'
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Days'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Remaining Effort (hours or story points)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Handle closing the modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('burndownChartModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
