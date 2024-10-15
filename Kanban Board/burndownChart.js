document.addEventListener('DOMContentLoaded', function () {
    // Dynamically get the sprint name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sprintName = urlParams.get('sprintName'); // Get sprint name dynamically from URL
    if (!sprintName) {
        alert('Sprint name is missing from the URL');
        return;
    }

    // Handle the Burndown Chart button click
    document.getElementById('burndownChartButton').addEventListener('click', function () {
        // Display the modal
        const modal = document.getElementById('burndownChartModal');
        modal.style.display = 'block';

        // Render the chart when the modal opens
        renderBurndownChart(sprintName);
    });

    // Handle closing the modal
    const burndownModalCloseButton = document.querySelector('#burndownChartModal .close');
    burndownModalCloseButton.addEventListener('click', function () {
        const modal = document.getElementById('burndownChartModal');
        modal.style.display = 'none';
    });

    // Fetch sprint data from localStorage (dynamically)
    function getSprintData(sprintName) {
        const sprints = JSON.parse(localStorage.getItem('sprints')) || [];
        const sprint = sprints.find(s => s.sprintName === sprintName);

        if (!sprint) {
            alert('Sprint not found');
            return null;
        }

        return {
            sprintName: sprint.sprintName,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            tasks: sprint.selectedPBIS || [],
        };
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD
    function convertDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }

    // Function to calculate burndown data
    function calculateBurndownData(tasks, totalEffort, sprintDays, sprintStartDate) {
        const timeLogByDay = {};

        // Aggregate time worked by day from task timeTracking data
        tasks.forEach(task => {
            if (task.timeTracking) {
                task.timeTracking.forEach(entry => {
                    const formattedDate = convertDate(entry.dateWorkedOn); // Convert date to YYYY-MM-DD
                    if (!timeLogByDay[formattedDate]) {
                        timeLogByDay[formattedDate] = 0;
                    }
                    timeLogByDay[formattedDate] += entry.hoursWorked;
                });
            }
        });

        // Initialize remaining effort
        let remainingEffort = totalEffort;
        const actualProgress = [totalEffort]; // Start with full effort
        const sprintDates = [];

        // Calculate the actual progress and generate dates from sprint start date
        for (let i = 0; i < sprintDays; i++) {
            const currentDate = new Date(sprintStartDate);
            currentDate.setDate(currentDate.getDate() + i);
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            sprintDates.push(formattedDate);

            if (timeLogByDay[formattedDate]) {
                remainingEffort -= timeLogByDay[formattedDate];
            }
            actualProgress.push(remainingEffort);
        }

        return { labels: sprintDates, actualProgress };
    }

    // Chart.js function to render the burndown chart with ideal and actual progress
    function renderBurndownChart(sprintName) {
        const ctx = document.getElementById('burndownChartCanvas').getContext('2d');

        // Fetch sprint data dynamically from localStorage
        const sprintData = getSprintData(sprintName);
        if (!sprintData) {
            return; // Stop if sprint data is not found
        }

        const { startDate: sprintStartDate, endDate: sprintEndDate, tasks } = sprintData;

        // Calculate sprint days
        const sprintDays = Math.ceil((new Date(sprintEndDate) - new Date(sprintStartDate)) / (1000 * 60 * 60 * 24)) + 1;

        // Calculate total estimated effort (sum of task story points or hours)
        const totalEstimatedEffort = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);

        // Ideal progress: Linear decrease from total effort to 0 over the sprint duration
        const idealProgress = Array.from({ length: sprintDays + 1 }, (_, i) => totalEstimatedEffort * (1 - i / sprintDays));

        // Fetch actual progress based on the task time log data
        const { labels, actualProgress } = calculateBurndownData(tasks, totalEstimatedEffort, sprintDays, sprintStartDate);

        const data = {
            labels: labels.length ? labels : Array.from({ length: sprintDays }, (_, i) => `Day ${i + 1}`),
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
                    text: `Burndown Chart for ${sprintData.sprintName}`
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
    window.onclick = function (event) {
        const modal = document.getElementById('burndownChartModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
