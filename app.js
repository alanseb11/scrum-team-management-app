function app() {
    return {
        currentPage: 'dashboard',
        tasks: [],
        sprints: [],
        newSprint: {
            name: '',
            startDate: '',
            endDate: '',
            taskIds: []
        },
        timeLog: {
            taskId: '',
            hours: 0
        },
        initApp() {
            // Load data from localStorage or initialize if not exists
            this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            this.sprints = JSON.parse(localStorage.getItem('sprints') || '[]');
            this.renderBurndownChart();
            this.renderSprintCharts();
        },
        createNewSprint() {
            const newSprint = {
                id: Date.now(),
                ...this.newSprint,
                status: 'not started',
                tasks: this.newSprint.taskIds.map(id => this.tasks.find(t => t.id === id))
            };
            this.sprints.push(newSprint);
            this.saveSprints();
            this.resetNewSprintForm();
        },
        resetNewSprintForm() {
            this.newSprint = {
                name: '',
                startDate: '',
                endDate: '',
                taskIds: []
            };
        },
        getSprintTasks(sprint, status = null) {
            return sprint.tasks.filter(task => !status || task.status === status);
        },
        updateTaskStatus(task, newStatus) {
            task.status = newStatus;
            this.saveSprints();
            this.renderSprintCharts();
        },
        logTime(sprintId) {
            const sprint = this.sprints.find(s => s.id === sprintId);
            const task = sprint.tasks.find(t => t.id === this.timeLog.taskId);
            if (task) {
                task.timeEntries = task.timeEntries || [];
                task.timeEntries.push({
                    date: new Date().toISOString(),
                    hours: parseFloat(this.timeLog.hours)
                });
                this.saveSprints();
                this.renderSprintCharts();
            }
            this.timeLog = { taskId: '', hours: 0 };
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
        saveSprints() {
            localStorage.setItem('sprints', JSON.stringify(this.sprints));
        },
        renderBurndownChart() {
            const ctx = document.getElementById('burndownChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Start', 'Day 2', 'Day 3', 'Day 4', 'End'],
                    datasets: [{
                        label: 'Ideal Burndown',
                        data: [100, 75, 50, 25, 0],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    }, {
                        label: 'Actual Burndown',
                        data: [100, 80, 60, 40, 10],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        },
        renderSprintCharts() {
            // Implementation for rendering sprint charts
        }
    };
}