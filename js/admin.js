document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const totalUsersCard = document.getElementById('total-users-card');
    const totalClientsCard = document.getElementById('total-clients-card');
    const totalFreelancersCard = document.getElementById('total-freelancers-card');
    const totalFreelancerEarningsCard = document.getElementById('total-freelancer-earnings-card');
    const platformIncomeCard = document.getElementById('platform-income-card');
    const totalJobsCard = document.getElementById('total-jobs-card');
    const activeJobsCard = document.getElementById('active-jobs-card');
    const completedProjectsCard = document.getElementById('completed-projects-card');
    const adminActivityList = document.getElementById('admin-activity-list');
    
    // Update admin dashboard stats
    function updateAdminDashboard() {
        const stats = getPlatformStats();
        
        // Update stats cards
        if (totalUsersCard) totalUsersCard.textContent = stats.totalUsers;
        if (totalClientsCard) totalClientsCard.textContent = stats.totalClients;
        if (totalFreelancersCard) totalFreelancersCard.textContent = stats.totalFreelancers;
        if (totalFreelancerEarningsCard) totalFreelancerEarningsCard.textContent = `$${stats.totalFreelancerEarnings}`;
        if (platformIncomeCard) platformIncomeCard.textContent = `$${stats.platformIncome}`;
        if (totalJobsCard) totalJobsCard.textContent = stats.totalJobs;
        if (activeJobsCard) activeJobsCard.textContent = stats.activeJobs;
        if (completedProjectsCard) completedProjectsCard.textContent = stats.completedProjects;
        
        // Update charts
        updateUserDistributionChart();
        updateEarningsChart();
        updateJobStatusChart();
        
        // Update activity list
        updateAdminActivityList();
    }
    
    // Update user distribution chart
    function updateUserDistributionChart() {
        const ctx = document.getElementById('user-distribution-chart');
        if (!ctx) return;
        
        const stats = getPlatformStats();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Clients', 'Freelancers', 'Admins'],
                datasets: [{
                    data: [stats.totalClients, stats.totalFreelancers, 1],
                    backgroundColor: ['#3498db', '#2ecc71', '#9c27b0']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Update earnings chart
    function updateEarningsChart() {
        const ctx = document.getElementById('earnings-distribution-chart');
        if (!ctx) return;
        
        const stats = getPlatformStats();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Freelancer Earnings', 'Platform Income'],
                datasets: [{
                    label: 'Amount ($)',
                    data: [stats.totalFreelancerEarnings, stats.platformIncome],
                    backgroundColor: ['#2ecc71', '#9c27b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Update job status chart
    function updateJobStatusChart() {
        const ctx = document.getElementById('job-status-chart');
        if (!ctx) return;
        
        const stats = getPlatformStats();
        const inProgressJobs = stats.totalJobs - stats.activeJobs;
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Active Jobs', 'In Progress Jobs', 'Completed Projects'],
                datasets: [{
                    data: [stats.activeJobs, inProgressJobs, stats.completedProjects],
                    backgroundColor: ['#3498db', '#f1c40f', '#2ecc71']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Update admin activity list
    function updateAdminActivityList() {
        if (!adminActivityList) return;
        
        adminActivityList.innerHTML = '';
        
        // Sample admin activities
        const activities = [
            {
                type: 'system',
                title: 'New user registration: John Doe',
                time: '1 hour ago',
                icon: 'fa-user-plus'
            },
            {
                type: 'system',
                title: 'New job posted: Mobile App Development',
                time: '3 hours ago',
                icon: 'fa-briefcase'
            },
            {
                type: 'system',
                title: 'Project completed: Company Branding',
                time: '5 hours ago',
                icon: 'fa-check-circle'
            },
            {
                type: 'system',
                title: 'Payment processed: $1500',
                time: '1 day ago',
                icon: 'fa-dollar-sign'
            },
            {
                type: 'system',
                title: 'System backup completed',
                time: '2 days ago',
                icon: 'fa-database'
            }
        ];
        
        // Display activities
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            adminActivityList.appendChild(activityItem);
        });
    }
    
    // Initialize admin dashboard
    updateAdminDashboard();
});