// Wait for the DOM to be fully loaded
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

    // Chart.js function to render the burndown chart with ideal and actual progress
    function renderBurndownChart() {
        const ctx = document.getElementById('burndownChartCanvas').getContext('2d');

        // Sample data for the burndown chart (replace with your actual data)
        const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6']; // Sprint days
        const idealProgress = [10, 8, 6, 4, 2, 0];  // Ideal line for work completion
        const actualProgress = [10, 9, 7, 6, 5, 3]; // Actual work completion (replace with dynamic data)

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Ideal Progress',
                    data: idealProgress,
                    borderColor: 'rgba(75, 192, 192, 1)',  // Color for ideal progress line
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1 // Straight lines
                },
                {
                    label: 'Actual Progress',
                    data: actualProgress,
                    borderColor: 'rgba(255, 99, 132, 1)',  // Color for actual progress line
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1 // Straight lines
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
                            text: 'Remaining Tasks'
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
