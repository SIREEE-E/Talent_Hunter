document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addJobBtn = document.getElementById('add-job-btn');
    const addFreelancerBtn = document.getElementById('add-freelancer-btn');
    const jobModal = document.getElementById('job-modal');
    const freelancerModal = document.getElementById('freelancer-modal');
    const proposalModal = document.getElementById('proposal-modal');
    const closeJobModal = document.getElementById('close-job-modal');
    const closeFreelancerModal = document.getElementById('close-freelancer-modal');
    const closeProposalModal = document.getElementById('close-proposal-modal');
    const jobForm = document.getElementById('job-form');
    const freelancerForm = document.getElementById('freelancer-form');
    const proposalForm = document.getElementById('proposal-form');
    const cancelJob = document.getElementById('cancel-job');
    const cancelFreelancer = document.getElementById('cancel-freelancer');
    const cancelProposal = document.getElementById('cancel-proposal');
    const jobTableBody = document.getElementById('job-table-body');
    const freelancerTableBody = document.getElementById('freelancer-table-body');
    const projectTableBody = document.getElementById('project-table-body');
    const jobSearch = document.getElementById('job-search');
    const freelancerSearch = document.getElementById('freelancer-search');
    const projectSearch = document.getElementById('project-search');
    const jobsTableTitle = document.getElementById('jobs-table-title');
    const clientTabs = document.getElementById('client-tabs');
    const freelancerTabs = document.getElementById('freelancer-tabs');
    const comparisonModal = document.getElementById('comparison-modal');
    const closeComparisonModal = document.getElementById('close-comparison-modal');
    const comparisonContainer = document.getElementById('comparison-container');
    
    // Button actions
    addJobBtn.addEventListener('click', () => {
        document.getElementById('job-modal-title').textContent = 'Add New Job';
        document.getElementById('job-id').value = '';
        jobForm.reset();
        jobModal.style.display = 'flex';
    });
    
    addFreelancerBtn.addEventListener('click', () => {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.role === 'freelancer') {
            document.getElementById('freelancer-modal-title').textContent = 'Edit Your Profile';
            document.getElementById('freelancer-id').value = currentUser.id;
            document.getElementById('freelancer-name').value = currentUser.name;
            document.getElementById('freelancer-email').value = currentUser.email;
            document.getElementById('freelancer-skills').value = currentUser.skills || '';
            document.getElementById('freelancer-rate').value = currentUser.rate || 0;
            document.getElementById('freelancer-experience').value = currentUser.experience || 0;
        } else {
            document.getElementById('freelancer-modal-title').textContent = 'Add Freelancer Profile';
            document.getElementById('freelancer-id').value = '';
            freelancerForm.reset();
        }
        freelancerModal.style.display = 'flex';
    });
    
    // Modal controls
    closeJobModal.addEventListener('click', () => {
        jobModal.style.display = 'none';
    });
    
    closeFreelancerModal.addEventListener('click', () => {
        freelancerModal.style.display = 'none';
    });
    
    closeProposalModal.addEventListener('click', () => {
        proposalModal.style.display = 'none';
    });
    
    cancelJob.addEventListener('click', () => {
        jobModal.style.display = 'none';
    });
    
    cancelFreelancer.addEventListener('click', () => {
        freelancerModal.style.display = 'none';
    });
    
    cancelProposal.addEventListener('click', () => {
        proposalModal.style.display = 'none';
    });
    
    closeComparisonModal.addEventListener('click', () => {
        comparisonModal.style.display = 'none';
    });
    
    // Job form submission
    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const jobId = document.getElementById('job-id').value;
        const jobData = {
            title: document.getElementById('job-title').value,
            description: document.getElementById('job-description').value,
            budget: document.getElementById('job-budget').value,
            deadline: document.getElementById('job-deadline').value,
            skills: document.getElementById('job-skills').value,
            clientId: getCurrentUser().id,
            status: 'Open'
        };
        
        if (jobId) {
            // Update existing job
            updateJob(jobId, jobData);
        } else {
            // Add new job
            addJob(jobData);
        }
        
        renderJobTable();
        jobModal.style.display = 'none';
        jobForm.reset();
        
        // Show success notification
        showNotification(`Job ${jobId ? 'updated' : 'added'} successfully!`, 'success');
    });
    
    // Freelancer form submission
    freelancerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const freelancerId = document.getElementById('freelancer-id').value;
        const freelancerData = {
            name: document.getElementById('freelancer-name').value,
            email: document.getElementById('freelancer-email').value,
            skills: document.getElementById('freelancer-skills').value,
            rate: parseInt(document.getElementById('freelancer-rate').value) || 0,
            experience: parseInt(document.getElementById('freelancer-experience').value) || 0
        };
        
        if (freelancerId) {
            // Update existing freelancer
            const user = getUserById(freelancerId);
            if (user) {
                Object.assign(user, freelancerData);
            }
        } else {
            // Add new freelancer profile to current user
            const user = getCurrentUser();
            Object.assign(user, freelancerData);
        }
        
        renderFreelancerTable();
        freelancerModal.style.display = 'none';
        freelancerForm.reset();
        
        // Show success notification
        showNotification(`Freelancer profile ${freelancerId ? 'updated' : 'created'} successfully!`, 'success');
    });
    
    // Proposal form submission
    proposalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const jobId = document.getElementById('proposal-job-id').value;
        const proposalData = {
            jobId: jobId,
            freelancerId: getCurrentUser().id,
            coverLetter: document.getElementById('proposal-cover-letter').value,
            rate: document.getElementById('proposal-rate').value,
            estimate: document.getElementById('proposal-estimate').value,
            status: 'Pending'
        };
        
        // Add new proposal
        addProposal(proposalData);
        
        // Update job status
        updateJob(jobId, { status: 'In Progress' });
        
        // Create project
        const job = getJobs().find(j => j.id === jobId);
        const project = {
            title: job.title,
            clientId: job.clientId,
            freelancerId: getCurrentUser().id,
            status: 'In Progress',
            progress: 0,
            deadline: job.deadline
        };
        addProject(project);
        
        proposalModal.style.display = 'none';
        proposalForm.reset();
        
        // Show success notification
        showNotification('Proposal submitted successfully!', 'success');
        
        // Refresh job table
        renderJobTable();
    });
    
    // Client tabs
    if (clientTabs) {
        const tabs = clientTabs.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update table title and content
                const tabName = tab.getAttribute('data-tab');
                if (tabName === 'all-jobs') {
                    jobsTableTitle.textContent = 'Available Jobs';
                    renderJobTable();
                } else if (tabName === 'my-jobs') {
                    jobsTableTitle.textContent = 'My Job Postings';
                    renderMyJobsTable();
                }
            });
        });
    }
    
    // Freelancer tabs
    if (freelancerTabs) {
        const tabs = freelancerTabs.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update table content
                const tabName = tab.getAttribute('data-tab');
                if (tabName === 'all-freelancers') {
                    renderFreelancerTable();
                } else if (tabName === 'shortlisted') {
                    renderShortlistedFreelancersTable();
                }
            });
        });
    }
    
    // Render tables
    function renderJobTable() {
        jobTableBody.innerHTML = '';
        const jobs = getJobs();
        const currentUser = getCurrentUser();
        
        jobs.forEach(job => {
            const client = getUserById(job.clientId);
            const row = document.createElement('tr');
            
            // Actions based on user role
            let actions = '';
            if (currentUser && currentUser.role === 'freelancer') {
                actions = `
                    <button class="btn btn-sm btn-primary view-job" data-id="${job.id}">View</button>
                    <button class="btn btn-sm btn-primary request-job" data-id="${job.id}">Request</button>
                `;
            } else if (currentUser && currentUser.role === 'client' && job.clientId === currentUser.id) {
                actions = `
                    <button class="btn btn-sm btn-edit edit-job" data-id="${job.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-job" data-id="${job.id}">Delete</button>
                `;
            } else if (currentUser && currentUser.role === 'admin') {
                actions = `
                    <button class="btn btn-sm btn-edit edit-job" data-id="${job.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-job" data-id="${job.id}">Delete</button>
                `;
            }
            
            row.innerHTML = `
                <td>${job.id}</td>
                <td>${job.title}</td>
                <td>${job.description}</td>
                <td>$${job.budget}</td>
                <td>${job.deadline}</td>
                <td>${client ? client.name : 'Unknown'}</td>
                <td class="action-buttons">${actions}</td>
            `;
            jobTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                const job = getJobs().find(j => j.id === jobId);
                if (job) {
                    document.getElementById('job-modal-title').textContent = 'Edit Job';
                    document.getElementById('job-id').value = job.id;
                    document.getElementById('job-title').value = job.title;
                    document.getElementById('job-description').value = job.description;
                    document.getElementById('job-budget').value = job.budget;
                    document.getElementById('job-deadline').value = job.deadline;
                    document.getElementById('job-skills').value = job.skills;
                    jobModal.style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this job?')) {
                    deleteJob(jobId);
                    renderJobTable();
                    showNotification('Job deleted successfully!', 'success');
                }
            });
        });
        
        document.querySelectorAll('.request-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                document.getElementById('proposal-job-id').value = jobId;
                proposalModal.style.display = 'flex';
            });
        });
    }
    
    function renderMyJobsTable() {
        jobTableBody.innerHTML = '';
        const currentUser = getCurrentUser();
        const myJobs = getJobsByClientId(currentUser.id);
        
        myJobs.forEach(job => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${job.id}</td>
                <td>${job.title}</td>
                <td>${job.description}</td>
                <td>$${job.budget}</td>
                <td>${job.deadline}</td>
                <td>${currentUser.name}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-edit edit-job" data-id="${job.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-job" data-id="${job.id}">Delete</button>
                </td>
            `;
            jobTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                const job = getJobs().find(j => j.id === jobId);
                if (job) {
                    document.getElementById('job-modal-title').textContent = 'Edit Job';
                    document.getElementById('job-id').value = job.id;
                    document.getElementById('job-title').value = job.title;
                    document.getElementById('job-description').value = job.description;
                    document.getElementById('job-budget').value = job.budget;
                    document.getElementById('job-deadline').value = job.deadline;
                    document.getElementById('job-skills').value = job.skills;
                    jobModal.style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this job?')) {
                    deleteJob(jobId);
                    renderMyJobsTable();
                    showNotification('Job deleted successfully!', 'success');
                }
            });
        });
    }
    
    function renderFreelancerTable() {
        freelancerTableBody.innerHTML = '';
        const freelancers = getUsers().filter(user => user.role === 'freelancer' && user.skills);
        const currentUser = getCurrentUser();
        const shortlisted = getShortlistedFreelancers();
        
        // If no freelancers with skills exist, show a message
        if (freelancers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6" style="text-align: center;">No freelancers available yet. Be the first to add your profile!</td>
            `;
            freelancerTableBody.appendChild(row);
        }
        
        freelancers.forEach(freelancer => {
            const row = document.createElement('tr');
            
            // Actions based on user role
            let actions = '';
            if (currentUser && currentUser.role === 'client') {
                const isShortlisted = shortlisted.includes(freelancer.id);
                actions = `
                    <button class="btn btn-sm btn-primary view-freelancer" data-id="${freelancer.id}">View</button>
                    <button class="btn btn-sm ${isShortlisted ? 'btn-secondary' : 'btn-primary'} shortlist-freelancer" data-id="${freelancer.id}">
                        ${isShortlisted ? 'Remove' : 'Shortlist'}
                    </button>
                    <button class="btn btn-sm btn-hire hire-freelancer" data-id="${freelancer.id}">Hire</button>
                `;
            } else if (currentUser && currentUser.role === 'freelancer' && freelancer.id === currentUser.id) {
                actions = `
                    <button class="btn btn-sm btn-edit edit-freelancer" data-id="${freelancer.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-freelancer" data-id="${freelancer.id}">Delete</button>
                `;
            } else if (currentUser && currentUser.role === 'admin') {
                actions = `
                    <button class="btn btn-sm btn-primary view-freelancer" data-id="${freelancer.id}">View</button>
                    <button class="btn btn-sm btn-edit edit-freelancer" data-id="${freelancer.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-freelancer" data-id="${freelancer.id}">Delete</button>
                `;
            }
            
            row.innerHTML = `
                <td>${freelancer.id}</td>
                <td>${freelancer.name}</td>
                <td>${freelancer.skills || 'No skills listed'}</td>
                <td>${freelancer.rating || 'N/A'}</td>
                <td>$${freelancer.rate || 0}/hr</td>
                <td class="action-buttons">${actions}</td>
            `;
            freelancerTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    showFreelancerProfile(freelancer);
                }
            });
        });
        
        document.querySelectorAll('.shortlist-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const isShortlisted = shortlisted.includes(freelancerId);
                
                if (isShortlisted) {
                    removeFromShortlist(freelancerId);
                    showNotification('Removed from shortlist', 'success');
                } else {
                    addToShortlist(freelancerId);
                    showNotification('Added to shortlist', 'success');
                }
                
                renderFreelancerTable();
            });
        });
        
        document.querySelectorAll('.hire-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    showNotification(`Hiring process initiated for ${freelancer.name}. They will be contacted shortly.`, 'success');
                }
            });
        });
        
        document.querySelectorAll('.edit-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    document.getElementById('freelancer-modal-title').textContent = 'Edit Freelancer Profile';
                    document.getElementById('freelancer-id').value = freelancer.id;
                    document.getElementById('freelancer-name').value = freelancer.name;
                    document.getElementById('freelancer-email').value = freelancer.email;
                    document.getElementById('freelancer-skills').value = freelancer.skills || '';
                    document.getElementById('freelancer-rate').value = freelancer.rate || 0;
                    document.getElementById('freelancer-experience').value = freelancer.experience || 0;
                    freelancerModal.style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
                    const freelancer = getUserById(freelancerId);
                    if (freelancer) {
                        // Clear freelancer data
                        freelancer.skills = '';
                        freelancer.rate = 0;
                        freelancer.experience = 0;
                        freelancer.rating = 0;
                        freelancer.earnings = 0;
                        freelancer.completedProjects = 0;
                        
                        renderFreelancerTable();
                        showNotification('Profile has been deleted successfully.', 'success');
                    }
                }
            });
        });
    }
    
    function renderShortlistedFreelancersTable() {
        freelancerTableBody.innerHTML = '';
        const shortlisted = getShortlistedFreelancers();
        const freelancers = getFreelancersByIds(shortlisted);
        const currentUser = getCurrentUser();
        
        if (freelancers.length === 0) {
            freelancerTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No freelancers shortlisted yet</td>
                </tr>
            `;
            return;
        }
        
        freelancers.forEach(freelancer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${freelancer.id}</td>
                <td>${freelancer.name}</td>
                <td>${freelancer.skills || 'No skills listed'}</td>
                <td>${freelancer.rating || 'N/A'}</td>
                <td>$${freelancer.rate || 0}/hr</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary view-freelancer" data-id="${freelancer.id}">View</button>
                    <button class="btn btn-sm btn-secondary remove-shortlist" data-id="${freelancer.id}">Remove</button>
                    <button class="btn btn-sm btn-primary compare-freelancer" data-id="${freelancer.id}">Compare</button>
                </td>
            `;
            freelancerTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    showFreelancerProfile(freelancer);
                }
            });
        });
        
        document.querySelectorAll('.remove-shortlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                removeFromShortlist(freelancerId);
                renderShortlistedFreelancersTable();
                showNotification('Removed from shortlist', 'success');
            });
        });
        
        document.querySelectorAll('.compare-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                showComparisonModal([freelancerId]);
            });
        });
    }
    
    function renderProjectTable() {
        projectTableBody.innerHTML = '';
        const currentUser = getCurrentUser();
        const projects = getProjectsByUserId(currentUser.id);
        
        projects.forEach(project => {
            const otherUser = project.clientId === currentUser.id 
                ? getUserById(project.freelancerId) 
                : getUserById(project.clientId);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.id}</td>
                <td>${project.title}</td>
                <td>${otherUser ? otherUser.name : 'Unknown'}</td>
                <td>${project.status}</td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${project.progress}%"></div>
                        </div>
                        <span>${project.progress}%</span>
                    </div>
                </td>
                <td>${project.deadline}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary view-project" data-id="${project.id}">View</button>
                </td>
            `;
            projectTableBody.appendChild(row);
        });
    }
    
    // Show freelancer profile
    function showFreelancerProfile(freelancer) {
        const profileModal = document.createElement('div');
        profileModal.className = 'modal';
        profileModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Freelancer Profile</h3>
                    <button class="close-btn profile-close">&times;</button>
                </div>
                <div class="profile-content">
                    <div class="profile-header">
                        <div class="profile-avatar">${freelancer.name.charAt(0)}</div>
                        <div class="profile-info">
                            <h4>${freelancer.name}</h4>
                            <div class="profile-rating">
                                ${generateStarRating(freelancer.rating || 0)}
                                <span>${freelancer.rating || 'No rating yet'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="profile-details">
                        <div class="detail-item">
                            <h5>Email</h5>
                            <p>${freelancer.email}</p>
                        </div>
                        <div class="detail-item">
                            <h5>Skills</h5>
                            <p>${freelancer.skills || 'No skills listed'}</p>
                        </div>
                        <div class="detail-item">
                            <h5>Hourly Rate</h5>
                            <p>$${freelancer.rate || 0}/hr</p>
                        </div>
                        <div class="detail-item">
                            <h5>Experience</h5>
                            <p>${freelancer.experience || 0} years</p>
                        </div>
                        <div class="detail-item">
                            <h5>Completed Projects</h5>
                            <p>${freelancer.completedProjects || 0}</p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary contact-freelancer">Contact Freelancer</button>
                        <button class="btn btn-secondary view-portfolio">View Portfolio</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(profileModal);
        profileModal.style.display = 'flex';
        
        // Close modal
        profileModal.querySelector('.profile-close').addEventListener('click', () => {
            profileModal.style.display = 'none';
            setTimeout(() => {
                document.body.removeChild(profileModal);
            }, 300);
        });
        
        // Close modal when clicking outside
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.style.display = 'none';
                setTimeout(() => {
                    document.body.removeChild(profileModal);
                }, 300);
            }
        });
    }
    
    // Show comparison modal
    function showComparisonModal(freelancerIds) {
        comparisonContainer.innerHTML = '';
        
        const freelancers = getFreelancersByIds(freelancerIds);
        
        if (freelancers.length === 0) {
            comparisonContainer.innerHTML = '<p>No freelancers selected for comparison</p>';
            comparisonModal.style.display = 'flex';
            return;
        }
        
        // Create comparison table
        const comparisonTable = document.createElement('table');
        comparisonTable.className = 'comparison-table';
        
        // Table header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Attribute</th>
            ${freelancers.map(f => `<th>${f.name}</th>`).join('')}
        `;
        comparisonTable.appendChild(headerRow);
        
        // Table rows
        const attributes = [
            { label: 'Skills', getValue: f => f.skills || 'No skills listed' },
            { label: 'Rating', getValue: f => f.rating || 'No rating yet' },
            { label: 'Hourly Rate', getValue: f => `$${f.rate || 0}/hr` },
            { label: 'Experience', getValue: f => `${f.experience || 0} years` },
            { label: 'Completed Projects', getValue: f => f.completedProjects || 0 }
        ];
        
        attributes.forEach(attr => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${attr.label}</td>
                ${freelancers.map(f => `<td>${attr.getValue(f)}</td>`).join('')}
            `;
            comparisonTable.appendChild(row);
        });
        
        // Actions row
        const actionsRow = document.createElement('tr');
        actionsRow.innerHTML = `
            <td>Actions</td>
            ${freelancers.map(f => `
                <td>
                    <button class="btn btn-sm btn-primary contact-freelancer" data-id="${f.id}">Contact</button>
                    <button class="btn btn-sm btn-secondary remove-shortlist" data-id="${f.id}">Remove</button>
                </td>
            `).join('')}
        `;
        comparisonTable.appendChild(actionsRow);
        
        comparisonContainer.appendChild(comparisonTable);
        comparisonModal.style.display = 'flex';
        
        // Add event listeners to action buttons
        document.querySelectorAll('.remove-shortlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                removeFromShortlist(freelancerId);
                renderShortlistedFreelancersTable();
                showComparisonModal(getShortlistedFreelancers());
                showNotification('Removed from shortlist', 'success');
            });
        });
    }
    
    // Helper function to generate star rating
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    // Search functionality
    jobSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const jobs = getJobs();
        const filteredJobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm) || 
            job.description.toLowerCase().includes(searchTerm)
        );
        
        jobTableBody.innerHTML = '';
        const currentUser = getCurrentUser();
        
        filteredJobs.forEach(job => {
            const client = getUserById(job.clientId);
            const row = document.createElement('tr');
            
            // Actions based on user role
            let actions = '';
            if (currentUser && currentUser.role === 'freelancer') {
                actions = `
                    <button class="btn btn-sm btn-primary view-job" data-id="${job.id}">View</button>
                    <button class="btn btn-sm btn-primary request-job" data-id="${job.id}">Request</button>
                `;
            } else if (currentUser && currentUser.role === 'client' && job.clientId === currentUser.id) {
                actions = `
                    <button class="btn btn-sm btn-edit edit-job" data-id="${job.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-job" data-id="${job.id}">Delete</button>
                `;
            } else if (currentUser && currentUser.role === 'admin') {
                actions = `
                    <button class="btn btn-sm btn-edit edit-job" data-id="${job.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-job" data-id="${job.id}">Delete</button>
                `;
            }
            
            row.innerHTML = `
                <td>${job.id}</td>
                <td>${job.title}</td>
                <td>${job.description}</td>
                <td>$${job.budget}</td>
                <td>${job.deadline}</td>
                <td>${client ? client.name : 'Unknown'}</td>
                <td class="action-buttons">${actions}</td>
            `;
            jobTableBody.appendChild(row);
        });
        
        // Re-attach event listeners
        document.querySelectorAll('.edit-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                const job = getJobs().find(j => j.id === jobId);
                if (job) {
                    document.getElementById('job-modal-title').textContent = 'Edit Job';
                    document.getElementById('job-id').value = job.id;
                    document.getElementById('job-title').value = job.title;
                    document.getElementById('job-description').value = job.description;
                    document.getElementById('job-budget').value = job.budget;
                    document.getElementById('job-deadline').value = job.deadline;
                    document.getElementById('job-skills').value = job.skills;
                    jobModal.style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this job?')) {
                    deleteJob(jobId);
                    renderJobTable();
                    showNotification('Job deleted successfully!', 'success');
                }
            });
        });
        
        document.querySelectorAll('.request-job').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                document.getElementById('proposal-job-id').value = jobId;
                proposalModal.style.display = 'flex';
            });
        });
    });
    
    freelancerSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const freelancers = getUsers().filter(user => 
            user.role === 'freelancer' && (
            user.name.toLowerCase().includes(searchTerm) || 
            (user.skills && user.skills.toLowerCase().includes(searchTerm))
        ));
        
        freelancerTableBody.innerHTML = '';
        const currentUser = getCurrentUser();
        const shortlisted = getShortlistedFreelancers();
        
        if (freelancers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6" style="text-align: center;">No freelancers found matching your search</td>
            `;
            freelancerTableBody.appendChild(row);
        }
        
        freelancers.forEach(freelancer => {
            const row = document.createElement('tr');
            
            // Actions based on user role
            let actions = '';
            if (currentUser && currentUser.role === 'client') {
                const isShortlisted = shortlisted.includes(freelancer.id);
                actions = `
                    <button class="btn btn-sm btn-primary view-freelancer" data-id="${freelancer.id}">View</button>
                    <button class="btn btn-sm ${isShortlisted ? 'btn-secondary' : 'btn-primary'} shortlist-freelancer" data-id="${freelancer.id}">
                        ${isShortlisted ? 'Remove' : 'Shortlist'}
                    </button>
                    <button class="btn btn-sm btn-hire hire-freelancer" data-id="${freelancer.id}">Hire</button>
                `;
            } else if (currentUser && currentUser.role === 'freelancer' && freelancer.id === currentUser.id) {
                actions = `
                    <button class="btn btn-sm btn-edit edit-freelancer" data-id="${freelancer.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-freelancer" data-id="${freelancer.id}">Delete</button>
                `;
            } else if (currentUser && currentUser.role === 'admin') {
                actions = `
                    <button class="btn btn-sm btn-primary view-freelancer" data-id="${freelancer.id}">View</button>
                    <button class="btn btn-sm btn-edit edit-freelancer" data-id="${freelancer.id}">Edit</button>
                    <button class="btn btn-sm btn-delete delete-freelancer" data-id="${freelancer.id}">Delete</button>
                `;
            }
            
            row.innerHTML = `
                <td>${freelancer.id}</td>
                <td>${freelancer.name}</td>
                <td>${freelancer.skills || 'No skills listed'}</td>
                <td>${freelancer.rating || 'N/A'}</td>
                <td>$${freelancer.rate || 0}/hr</td>
                <td class="action-buttons">${actions}</td>
            `;
            freelancerTableBody.appendChild(row);
        });
        
        // Re-attach event listeners
        document.querySelectorAll('.view-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    showFreelancerProfile(freelancer);
                }
            });
        });
        
        document.querySelectorAll('.shortlist-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const isShortlisted = shortlisted.includes(freelancerId);
                
                if (isShortlisted) {
                    removeFromShortlist(freelancerId);
                    showNotification('Removed from shortlist', 'success');
                } else {
                    addToShortlist(freelancerId);
                    showNotification('Added to shortlist', 'success');
                }
                
                renderFreelancerTable();
            });
        });
        
        document.querySelectorAll('.hire-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    showNotification(`Hiring process initiated for ${freelancer.name}. They will be contacted shortly.`, 'success');
                }
            });
        });
        
        document.querySelectorAll('.edit-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                const freelancer = getUserById(freelancerId);
                if (freelancer) {
                    document.getElementById('freelancer-modal-title').textContent = 'Edit Freelancer Profile';
                    document.getElementById('freelancer-id').value = freelancer.id;
                    document.getElementById('freelancer-name').value = freelancer.name;
                    document.getElementById('freelancer-email').value = freelancer.email;
                    document.getElementById('freelancer-skills').value = freelancer.skills || '';
                    document.getElementById('freelancer-rate').value = freelancer.rate || 0;
                    document.getElementById('freelancer-experience').value = freelancer.experience || 0;
                    freelancerModal.style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-freelancer').forEach(button => {
            button.addEventListener('click', (e) => {
                const freelancerId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
                    const freelancer = getUserById(freelancerId);
                    if (freelancer) {
                        // Clear freelancer data
                        freelancer.skills = '';
                        freelancer.rate = 0;
                        freelancer.experience = 0;
                        freelancer.rating = 0;
                        freelancer.earnings = 0;
                        freelancer.completedProjects = 0;
                        
                        renderFreelancerTable();
                        showNotification('Profile has been deleted successfully.', 'success');
                    }
                }
            });
        });
    });
    
    projectSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const currentUser = getCurrentUser();
        const projects = getProjectsByUserId(currentUser.id);
        const filteredProjects = projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) || 
            project.status.toLowerCase().includes(searchTerm)
        );
        
        projectTableBody.innerHTML = '';
        
        filteredProjects.forEach(project => {
            const otherUser = project.clientId === currentUser.id 
                ? getUserById(project.freelancerId) 
                : getUserById(project.clientId);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.id}</td>
                <td>${project.title}</td>
                <td>${otherUser ? otherUser.name : 'Unknown'}</td>
                <td>${project.status}</td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${project.progress}%"></div>
                        </div>
                        <span>${project.progress}%</span>
                    </div>
                </td>
                <td>${project.deadline}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary view-project" data-id="${project.id}">View</button>
                </td>
            `;
            projectTableBody.appendChild(row);
        });
    });
    
    // Initialize tables
    renderJobTable();
    renderFreelancerTable();
    renderProjectTable();
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === jobModal) {
            jobModal.style.display = 'none';
        }
        if (e.target === freelancerModal) {
            freelancerModal.style.display = 'none';
        }
        if (e.target === proposalModal) {
            proposalModal.style.display = 'none';
        }
        if (e.target === comparisonModal) {
            comparisonModal.style.display = 'none';
        }
    });
    
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
});