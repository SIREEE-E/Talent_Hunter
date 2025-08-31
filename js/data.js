// Sample data
let users = [
    { id: 'U001', name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'freelancer', skills: 'JavaScript, React, CSS', rate: 50, experience: 5, rating: 4.7, earnings: 3500, completedProjects: 12 },
    { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'client', company: 'TechCorp', rating: 4.5 },
    { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', password: 'password123', role: 'freelancer', skills: 'Graphic Design, Photoshop, Illustrator', rate: 40, experience: 7, rating: 4.9, earnings: 4200, completedProjects: 18 },
    { id: 'U004', name: 'Sarah Williams', email: 'sarah@example.com', password: 'password123', role: 'freelancer', skills: 'Content Writing, SEO, Copywriting', rate: 35, experience: 4, rating: 4.5, earnings: 2800, completedProjects: 9 },
    { id: 'U005', name: 'Alex Brown', email: 'alex@example.com', password: 'password123', role: 'client', company: 'DesignHub', rating: 4.8 },
    { id: 'U006', name: 'Emily Davis', email: 'emily@example.com', password: 'password123', role: 'freelancer', skills: 'UI/UX Design, Figma, Adobe XD', rate: 45, experience: 6, rating: 4.6, earnings: 3900, completedProjects: 14 },
    { id: 'U007', name: 'David Wilson', email: 'david@example.com', password: 'password123', role: 'client', company: 'StartupXYZ', rating: 4.3 },
    { id: 'U008', name: 'Lisa Anderson', email: 'lisa@example.com', password: 'password123', role: 'freelancer', skills: 'Python, Django, Machine Learning', rate: 65, experience: 8, rating: 4.8, earnings: 5200, completedProjects: 22 },
    { id: 'U009', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' }
];
let jobs = [
    { id: 'J001', title: 'Frontend Developer Needed', description: 'Looking for a React developer to build a modern web application', budget: 1500, deadline: '2023-12-15', clientId: 'U002', skills: 'React, JavaScript, CSS', status: 'Open' },
    { id: 'J002', title: 'Logo Design for Startup', description: 'Need a creative logo for our new tech startup', budget: 500, deadline: '2023-11-30', clientId: 'U005', skills: 'Graphic Design, Photoshop', status: 'Open' },
    { id: 'J003', title: 'Content Writer for Tech Blog', description: 'Need engaging articles about latest tech trends', budget: 800, deadline: '2023-12-10', clientId: 'U002', skills: 'Content Writing, SEO', status: 'In Progress' },
    { id: 'J004', title: 'Mobile App Development', description: 'iOS app development for fitness tracking', budget: 3000, deadline: '2024-01-15', clientId: 'U005', skills: 'iOS, Swift, Objective-C', status: 'Open' },
    { id: 'J005', title: 'UI/UX Designer', description: 'Design user interface for e-commerce platform', budget: 1200, deadline: '2023-12-20', clientId: 'U007', skills: 'UI/UX Design, Figma', status: 'Open' },
    { id: 'J006', title: 'Machine Learning Expert', description: 'Develop recommendation system for our platform', budget: 2500, deadline: '2024-02-01', clientId: 'U007', skills: 'Python, Machine Learning', status: 'Open' }
];
let proposals = [
    { id: 'P001', jobId: 'J001', freelancerId: 'U001', coverLetter: 'I have extensive experience with React and JavaScript...', rate: 60, estimate: 10, status: 'Pending' },
    { id: 'P002', jobId: 'J002', freelancerId: 'U003', coverLetter: 'I specialize in logo design and branding...', rate: 45, estimate: 5, status: 'Accepted' },
    { id: 'P003', jobId: 'J004', freelancerId: 'U004', coverLetter: 'I can write compelling content for your app...', rate: 40, estimate: 7, status: 'Pending' },
    { id: 'P004', jobId: 'J005', freelancerId: 'U006', coverLetter: 'I have designed multiple e-commerce interfaces...', rate: 50, estimate: 8, status: 'Pending' },
    { id: 'P005', jobId: 'J006', freelancerId: 'U008', coverLetter: 'I have built several recommendation systems...', rate: 70, estimate: 15, status: 'Pending' }
];
let projects = [
    { id: 'PR001', title: 'Website Redesign', clientId: 'U002', freelancerId: 'U001', status: 'In Progress', progress: 65, deadline: '2023-12-20' },
    { id: 'PR002', title: 'Company Branding', clientId: 'U005', freelancerId: 'U003', status: 'Completed', progress: 100, deadline: '2023-11-15' },
    { id: 'PR003', title: 'Blog Content', clientId: 'U002', freelancerId: 'U004', status: 'In Progress', progress: 30, deadline: '2023-12-05' },
    { id: 'PR004', title: 'Mobile App UI', clientId: 'U007', freelancerId: 'U006', status: 'In Progress', progress: 45, deadline: '2024-01-10' },
    { id: 'PR005', title: 'ML Recommendation System', clientId: 'U007', freelancerId: 'U008', status: 'In Progress', progress: 20, deadline: '2024-02-15' }
];
let shortlistedFreelancers = [];
// Current user
let currentUser = null;
// Function to get data
function getUsers() {
    return users;
}
function getJobs() {
    return jobs;
}
function getProposals() {
    return proposals;
}
function getProjects() {
    return projects;
}
function getShortlistedFreelancers() {
    return shortlistedFreelancers;
}
// Function to get user by email and password
function getUserByEmailAndPassword(email, password) {
    return users.find(user => user.email === email && user.password === password);
}
// Function to get user by id
function getUserById(id) {
    return users.find(user => user.id === id);
}
// Function to get jobs by client id
function getJobsByClientId(clientId) {
    return jobs.filter(job => job.clientId === clientId);
}
// Function to get proposals by job id
function getProposalsByJobId(jobId) {
    return proposals.filter(proposal => proposal.jobId === jobId);
}
// Function to get proposals by freelancer id
function getProposalsByFreelancerId(freelancerId) {
    return proposals.filter(proposal => proposal.freelancerId === freelancerId);
}
// Function to get projects by user id
function getProjectsByUserId(userId) {
    return projects.filter(project => project.clientId === userId || project.freelancerId === userId);
}
// Function to add user
function addUser(user) {
    user.id = 'U' + String(users.length + 1).padStart(3, '0');
    users.push(user);
    return user;
}
// Function to add job
function addJob(job) {
    job.id = 'J' + String(jobs.length + 1).padStart(3, '0');
    jobs.push(job);
    return job;
}
// Function to add proposal
function addProposal(proposal) {
    proposal.id = 'P' + String(proposals.length + 1).padStart(3, '0');
    proposals.push(proposal);
    return proposal;
}
// Function to add project
function addProject(project) {
    project.id = 'PR' + String(projects.length + 1).padStart(3, '0');
    projects.push(project);
    return project;
}
// Function to update job
function updateJob(id, updatedJob) {
    const index = jobs.findIndex(job => job.id === id);
    if (index !== -1) {
        jobs[index] = { ...jobs[index], ...updatedJob };
        return jobs[index];
    }
    return null;
}
// Function to update proposal
function updateProposal(id, updatedProposal) {
    const index = proposals.findIndex(proposal => proposal.id === id);
    if (index !== -1) {
        proposals[index] = { ...proposals[index], ...updatedProposal };
        return proposals[index];
    }
    return null;
}
// Function to update project
function updateProject(id, updatedProject) {
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedProject };
        return projects[index];
    }
    return null;
}
// Function to delete job
function deleteJob(id) {
    const index = jobs.findIndex(job => job.id === id);
    if (index !== -1) {
        jobs.splice(index, 1);
        return true;
    }
    return false;
}
// Function to delete proposal
function deleteProposal(id) {
    const index = proposals.findIndex(proposal => proposal.id === id);
    if (index !== -1) {
        proposals.splice(index, 1);
        return true;
    }
    return false;
}
// Function to delete project
function deleteProject(id) {
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) {
        projects.splice(index, 1);
        return true;
    }
    return false;
}
// Function to add freelancer to shortlist
function addToShortlist(freelancerId) {
    if (!shortlistedFreelancers.includes(freelancerId)) {
        shortlistedFreelancers.push(freelancerId);
        return true;
    }
    return false;
}
// Function to remove freelancer from shortlist
function removeFromShortlist(freelancerId) {
    const index = shortlistedFreelancers.indexOf(freelancerId);
    if (index !== -1) {
        shortlistedFreelancers.splice(index, 1);
        return true;
    }
    return false;
}
// Function to get freelancers by ids
function getFreelancersByIds(ids) {
    return users.filter(user => ids.includes(user.id) && user.role === 'freelancer');
}
// Function to get current user
function getCurrentUser() {
    return currentUser;
}
// Function to set current user
function setCurrentUser(user) {
    currentUser = user;
}
// Function to logout
function logout() {
    currentUser = null;
}
// Function to get platform statistics
function getPlatformStats() {
    const freelancers = users.filter(user => user.role === 'freelancer');
    const clients = users.filter(user => user.role === 'client');
    const totalFreelancerEarnings = freelancers.reduce((sum, freelancer) => sum + (freelancer.earnings || 0), 0);
    const platformFee = totalFreelancerEarnings * 0.1; // Assuming 10% platform fee
    
    return {
        totalUsers: users.length,
        totalFreelancers: freelancers.length,
        totalClients: clients.length,
        totalFreelancerEarnings,
        platformIncome: platformFee,
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'Open').length,
        completedProjects: projects.filter(project => project.status === 'Completed').length
    };
}