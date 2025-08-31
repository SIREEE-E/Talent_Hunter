document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const dashboardTabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const activeProjectsCount = document.getElementById('active-projects-count');
    const earningsValue = document.getElementById('earnings-value');
    const earningsLabel = document.getElementById('earnings-label');
    const ratingValue = document.getElementById('rating-value');
    const completedProjectsCount = document.getElementById('completed-projects-count');
    const earningsChartTitle = document.getElementById('earnings-chart-title');
    const activityList = document.getElementById('activity-list');
    
    // Home page buttons
    const getStartedFreelancer = document.getElementById('get-started-freelancer');
    const postProjectBtn = document.getElementById('post-project-btn');
    const registerModal = document.getElementById('register-modal');
    
    // Attach event listeners to home page buttons
    if (getStartedFreelancer) {
        getStartedFreelancer.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) {
                registerModal.style.display = 'flex';
                const registerRole = document.getElementById('register-role');
                if (registerRole) {
                    registerRole.value = 'freelancer';
                }
            }
        });
    }
    
    if (postProjectBtn) {
        postProjectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) {
                registerModal.style.display = 'flex';
                const registerRole = document.getElementById('register-role');
                if (registerRole) {
                    registerRole.value = 'client';
                }
            }
        });
    }
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            const currentUser = getCurrentUser();
            
            // Prevent non-admin users from accessing admin dashboard
            if (targetPage === 'admin-dashboard' && currentUser && currentUser.role !== 'admin') {
                showNotification('Access denied. Admin privileges required.', 'error');
                return;
            }
            
            showPage(targetPage);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    function showPage(pageId) {
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }
    
    // Dashboard tabs
    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            dashboardTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // Update goals tab if selected
            if (targetTab === 'goals') {
                updateGoalsTab();
            }
        });
    });
    
    // Update dashboard stats
    function updateDashboardStats() {
        const currentUser = getCurrentUser();
        
        if (!currentUser) return;
        
        // Don't update dashboard stats for admin users
        if (currentUser.role === 'admin') {
            return;
        }
        
        // Get user's projects
        const projects = getProjectsByUserId(currentUser.id);
        
        // Calculate stats
        const activeProjects = projects.filter(p => p.status === 'In Progress').length;
        const completedProjects = projects.filter(p => p.status === 'Completed').length;
        
        // Update UI with dummy data if no real data
        activeProjectsCount.textContent = activeProjects > 0 ? activeProjects : 3;
        completedProjectsCount.textContent = completedProjects > 0 ? completedProjects : 12;
        
        if (currentUser.role === 'freelancer') {
            earningsValue.textContent = currentUser.earnings > 0 ? `$${currentUser.earnings}` : '$3,500';
            ratingValue.textContent = currentUser.rating > 0 ? currentUser.rating : '4.7';
        } else if (currentUser.role === 'client') {
            // For clients, show total spent instead of earnings
            const totalSpent = projects.reduce((sum, project) => {
                const job = getJobs().find(j => j.title === project.title);
                return sum + (job ? parseInt(job.budget) : 0);
            }, 0);
            earningsValue.textContent = totalSpent > 0 ? `$${totalSpent}` : '$5,200';
            earningsLabel.textContent = 'Total Spent';
            earningsChartTitle.textContent = 'Spending Overview';
            ratingValue.textContent = currentUser.rating > 0 ? currentUser.rating : '4.5';
        }
        
        // Update activity list
        updateActivityList(currentUser);
    }
    
    // Update activity list
    function updateActivityList(user) {
        // Don't update activity list for admin users
        if (user.role === 'admin') {
            return;
        }
        
        activityList.innerHTML = '';
        
        // Get recent activities based on user role
        let activities = [];
        
        if (user.role === 'freelancer') {
            // Freelancer activities
            const proposals = getProposalsByFreelancerId(user.id);
            const projects = getProjectsByUserId(user.id);
            
            // Add proposal activities
            proposals.forEach(proposal => {
                const job = getJobs().find(j => j.id === proposal.jobId);
                if (job) {
                    activities.push({
                        type: 'proposal',
                        title: `Submitted proposal for ${job.title}`,
                        time: '2 days ago',
                        icon: 'fa-file-alt'
                    });
                }
            });
            
            // Add project activities
            projects.forEach(project => {
                activities.push({
                    type: 'project',
                    title: `${project.status}: ${project.title}`,
                    time: '3 days ago',
                    icon: 'fa-briefcase'
                });
            });
        } else if (user.role === 'client') {
            // Client activities
            const jobs = getJobsByClientId(user.id);
            const projects = getProjectsByUserId(user.id);
            
            // Add job activities
            jobs.forEach(job => {
                activities.push({
                    type: 'job',
                    title: `Posted job: ${job.title}`,
                    time: '1 day ago',
                    icon: 'fa-plus-circle'
                });
            });
            
            // Add project activities
            projects.forEach(project => {
                activities.push({
                    type: 'project',
                    title: `${project.status}: ${project.title}`,
                    time: '4 days ago',
                    icon: 'fa-briefcase'
                });
            });
        }
        
        // Add some generic activities
        activities.push({
            type: 'profile',
            title: 'Updated profile information',
            time: '5 days ago',
            icon: 'fa-user-edit'
        });
        
        activities.push({
            type: 'system',
            title: 'Completed skill assessment',
            time: '1 week ago',
            icon: 'fa-clipboard-check'
        });
        
        // Sort activities by time (newest first)
        activities.sort((a, b) => {
            const timeOrder = {
                '1 day ago': 1,
                '2 days ago': 2,
                '3 days ago': 3,
                '4 days ago': 4,
                '5 days ago': 5,
                '1 week ago': 7
            };
            return timeOrder[a.time] - timeOrder[b.time];
        });
        
        // Display activities
        activities.slice(0, 5).forEach(activity => {
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
            activityList.appendChild(activityItem);
        });
    }
    
    // Update goals tab
    function updateGoalsTab() {
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'freelancer') return;
        
        // Update earnings milestones
        const earningsMilestones = [
            { target: 1000, current: currentUser.earnings > 0 ? currentUser.earnings : 3500 },
            { target: 5000, current: currentUser.earnings > 0 ? currentUser.earnings : 3500 },
            { target: 10000, current: currentUser.earnings > 0 ? currentUser.earnings : 3500 }
        ];
        
        const earningsGoals = document.querySelectorAll('.goal-progress');
        earningsGoals.forEach((goal, index) => {
            if (index < earningsMilestones.length) {
                const milestone = earningsMilestones[index];
                const percentage = Math.min(100, (milestone.current / milestone.target) * 100);
                
                goal.innerHTML = `
                    <div class="goal-info">
                        <span>$${milestone.target.toLocaleString()}</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${percentage}%"></div>
                        </div>
                        <span>$${milestone.current.toLocaleString()} / $${milestone.target.toLocaleString()}</span>
                    </div>
                `;
            }
        });
        
        // Update skill progress
        const skills = currentUser.skills ? currentUser.skills.split(', ') : ['JavaScript', 'React', 'UI/UX Design'];
        const skillItems = document.querySelectorAll('.skill-item');
        
        skills.forEach((skill, index) => {
            if (index < skillItems.length) {
                // Generate random progress for demo purposes
                const progress = [85, 75, 60][index] || Math.floor(Math.random() * 40) + 60; // 60-100%
                const level = progress >= 90 ? 'Expert' : progress >= 75 ? 'Advanced' : progress >= 60 ? 'Intermediate' : 'Beginner';
                
                skillItems[index].innerHTML = `
                    <div class="skill-info">
                        <span>${skill}</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                        <span>${level}</span>
                    </div>
                `;
            }
        });
        
        // Update repeat clients
        const clientList = document.querySelector('.client-list');
        if (clientList) {
            clientList.innerHTML = '';
            
            const repeatClients = [
                { name: 'Alex Brown', projects: 3 },
                { name: 'Sarah Johnson', projects: 2 },
                { name: 'Mike Davis', projects: 1 }
            ];
            
            repeatClients.forEach(client => {
                const clientItem = document.createElement('div');
                clientItem.className = 'client-item';
                clientItem.innerHTML = `
                    <div class="client-avatar">${client.name.charAt(0)}${client.name.split(' ')[1] ? client.name.split(' ')[1].charAt(0) : ''}</div>
                    <div class="client-info">
                        <span>${client.name}</span>
                        <span>${client.projects} Projects</span>
                    </div>
                `;
                clientList.appendChild(clientItem);
            });
        }
    }
    
    // Initialize dashboard stats only if user is not admin
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role !== 'admin') {
        updateDashboardStats();
    }
    
    // Add notification styles to the head
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 15px;
        }
        
        .notification.success {
            background-color: var(--success-color);
            color: white;
        }
        
        .notification.info {
            background-color: var(--info-color);
            color: white;
        }
        
        .notification.warning {
            background-color: var(--warning-color);
            color: white;
        }
        
        .notification.error {
            background-color: var(--danger-color);
            color: white;
        }
        
        .profile-content {
            padding: 20px 0;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .profile-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin-right: 15px;
            color: white;
        }
        
        .profile-info h4 {
            margin-bottom: 5px;
            color: var(--dark-color);
        }
        
        .profile-rating {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .profile-rating i {
            color: var(--warning-color);
        }
        
        .profile-details {
            margin-bottom: 20px;
        }
        
        .detail-item {
            margin-bottom: 15px;
        }
        
        .detail-item h5 {
            margin-bottom: 5px;
            color: var(--primary-color);
        }
        
        .profile-actions {
            display: flex;
            gap: 10px;
        }
        
        .score-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: conic-gradient(var(--primary-color) 0% var(--score), rgba(106, 27, 154, 0.2) var(--score) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 1.5rem;
            font-weight: bold;
            position: relative;
        }
        
        .score-circle::before {
            content: '';
            position: absolute;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-color: var(--background-color);
        }
        
        .score-circle span {
            position: relative;
            z-index: 1;
        }
        
        .skill-score {
            text-align: center;
            margin: 20px 0;
        }
        
        .skill-recommendations {
            margin-top: 20px;
        }
        
        .skill-recommendations ul {
            padding-left: 20px;
        }
        
        .skill-recommendations li {
            margin-bottom: 8px;
        }
        
        .match-list {
            margin-top: 20px;
        }
        
        .match-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .match-item:last-child {
            border-bottom: none;
        }
        
        .match-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
            color: white;
        }
        
        .match-info {
            flex: 1;
        }
        
        .match-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .match-skills {
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        .match-score {
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .progress-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .progress-bar {
            flex: 1;
            height: 10px;
            background-color: var(--border-color);
            border-radius: 5px;
            overflow: hidden;
        }
        
        .progress {
            height: 100%;
            background-color: var(--primary-color);
        }
    `;
    document.head.appendChild(notificationStyles);
});