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

// Chart.js function to render the burndown chart
function renderBurndownChart() {
    const ctx = document.getElementById('burndownChartCanvas').getContext('2d');

    // Sample data for the burndown chart (replace with your actual data)
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Remaining Tasks',
            data: [10, 8, 6, 4, 3, 1], // Replace with dynamic data
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
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
