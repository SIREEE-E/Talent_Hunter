document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const cancelRegister = document.getElementById('cancel-register');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const jobsNav = document.getElementById('jobs-nav');
    const freelancersNav = document.getElementById('freelancers-nav');
    const dashboardNav = document.getElementById('dashboard-nav');
    const featuresNav = document.getElementById('features-nav');
    const adminNav = document.getElementById('admin-nav');
    const profileLink = document.getElementById('profile-link');
    const clientTabs = document.getElementById('client-tabs');
    const freelancerTabs = document.getElementById('freelancer-tabs');
    const projectsTab = document.getElementById('projects-tab');
    const goalsTab = document.getElementById('goals-tab');
    const addJobBtn = document.getElementById('add-job-btn');
    const addFreelancerBtn = document.getElementById('add-freelancer-btn');
    
    // Modal controls
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    closeRegisterModal.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });
    
    cancelRegister.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });
    
    // Form submissions
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation (in real app, this would be server-side)
        if (email && password) {
            const user = getUserByEmailAndPassword(email, password);
            
            if (user) {
                // Set current user
                setCurrentUser(user);
                
                // Update UI
                updateUserUI(user);
                
                // Show success notification
                showNotification('Login successful! Welcome back, ' + user.name, 'success');
                
                // Close modal and reset form
                loginModal.style.display = 'none';
                loginForm.reset();
                
                // Navigate to appropriate dashboard based on role
                if (user.role === 'admin') {
                    showPage('admin-dashboard');
                    document.querySelector('[data-page="admin-dashboard"]').classList.add('active');
                    document.querySelector('[data-page="home"]').classList.remove('active');
                } else {
                    showPage('dashboard');
                    document.querySelector('[data-page="dashboard"]').classList.add('active');
                    document.querySelector('[data-page="home"]').classList.remove('active');
                }
            } else {
                showNotification('Invalid email or password', 'error');
            }
        } else {
            showNotification('Please enter both email and password', 'warning');
        }
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;
        
        // Simple validation (in real app, this would be server-side)
        if (name && email && password && role) {
            // Check if user already exists
            const existingUser = users.find(user => user.email === email);
            
            if (existingUser) {
                showNotification('User with this email already exists', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                name,
                email,
                password,
                role,
                skills: '',
                rate: 0,
                experience: 0,
                rating: 0,
                earnings: 0,
                completedProjects: 0
            };
            
            // Add user
            addUser(newUser);
            
            // Set current user
            setCurrentUser(newUser);
            
            // Update UI
            updateUserUI(newUser);
            
            // Show success notification
            showNotification('Registration successful! Welcome to Talent Hunter, ' + name, 'success');
            
            // Close modal and reset form
            registerModal.style.display = 'none';
            registerForm.reset();
            
            // Navigate to appropriate dashboard based on role
            if (newUser.role === 'admin') {
                showPage('admin-dashboard');
                document.querySelector('[data-page="admin-dashboard"]').classList.add('active');
                document.querySelector('[data-page="home"]').classList.remove('active');
            } else {
                showPage('dashboard');
                document.querySelector('[data-page="dashboard"]').classList.add('active');
                document.querySelector('[data-page="home"]').classList.remove('active');
            }
        } else {
            showNotification('Please fill in all fields', 'warning');
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Logout user
        logout();
        
        // Update UI
        loginBtn.style.display = 'inline-block';
        userProfile.style.display = 'none';
        jobsNav.style.display = 'none';
        freelancersNav.style.display = 'none';
        dashboardNav.style.display = 'none';
        featuresNav.style.display = 'none';
        adminNav.style.display = 'none';
        
        // Show success notification
        showNotification('Logged out successfully', 'success');
        
        // Navigate to home
        showPage('home');
        document.querySelector('[data-page="home"]').classList.add('active');
        document.querySelector('[data-page="dashboard"]').classList.remove('active');
        document.querySelector('[data-page="admin-dashboard"]').classList.remove('active');
    });
    
    // Profile link
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if (currentUser.role === 'admin') {
            showPage('admin-dashboard');
            document.querySelector('[data-page="admin-dashboard"]').classList.add('active');
            document.querySelector('[data-page="home"]').classList.remove('active');
        } else {
            showPage('dashboard');
            document.querySelector('[data-page="dashboard"]').classList.add('active');
            document.querySelector('[data-page="home"]').classList.remove('active');
        }
    });
    
    // Function to update user UI
    function updateUserUI(user) {
        // Hide login/register buttons
        loginBtn.style.display = 'none';
        
        // Show user profile with role
        userProfile.style.display = 'flex';
        
        // Beautify the user profile display
        if (user.role === 'admin') {
            userName.innerHTML = `<i class="fas fa-user-shield"></i> Admin: ${user.name}`;
        } else if (user.role === 'client') {
            userName.innerHTML = `<i class="fas fa-briefcase"></i> Client: ${user.name}`;
        } else {
            userName.innerHTML = `<i class="fas fa-user"></i> Freelancer: ${user.name}`;
        }
        
        // Show navigation based on user role
        jobsNav.style.display = 'inline-block';
        freelancersNav.style.display = 'inline-block';
        
        // Show admin nav for admin users
        if (user.role === 'admin') {
            adminNav.style.display = 'inline-block';
            dashboardNav.style.display = 'none'; // Hide regular dashboard for admin
        } else {
            adminNav.style.display = 'none';
            dashboardNav.style.display = 'inline-block';
        }
        
        // Show features tab only for non-admin users
        if (user.role !== 'admin') {
            featuresNav.style.display = 'inline-block';
        } else {
            featuresNav.style.display = 'none';
        }
        
        // Show tabs based on user role
        if (user.role === 'client') {
            clientTabs.style.display = 'block';
            addJobBtn.style.display = 'inline-block';
            addFreelancerBtn.style.display = 'none';
        } else if (user.role === 'freelancer') {
            freelancerTabs.style.display = 'block';
            addJobBtn.style.display = 'none';
            addFreelancerBtn.style.display = 'inline-block';
        } else if (user.role === 'admin') {
            // Admin has full access
            clientTabs.style.display = 'none';
            freelancerTabs.style.display = 'none';
            addJobBtn.style.display = 'inline-block';
            addFreelancerBtn.style.display = 'inline-block';
        }
        
        // Update dashboard tabs
        if (user.role === 'freelancer') {
            projectsTab.style.display = 'block';
            goalsTab.style.display = 'block';
        } else if (user.role === 'admin') {
            projectsTab.style.display = 'none';
            goalsTab.style.display = 'none';
        } else {
            projectsTab.style.display = 'block';
            goalsTab.style.display = 'none';
        }
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add notification to the page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Function to show page
    function showPage(pageId) {
        const pageSections = document.querySelectorAll('.page-section');
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
});