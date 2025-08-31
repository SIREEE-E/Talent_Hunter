document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const featureCards = document.querySelectorAll('.feature-card');
    const featureDemoModal = document.getElementById('feature-demo-modal');
    const closeFeatureDemoModal = document.getElementById('close-feature-demo-modal');
    const featureDemoTitle = document.getElementById('feature-demo-title');
    const featureDemoContent = document.getElementById('feature-demo-content');
    const supportChatModal = document.getElementById('support-chat-modal');
    const closeSupportChatModal = document.getElementById('close-support-chat-modal');
    const supportChatContainer = document.getElementById('support-chat-container');
    const supportChatInput = document.getElementById('support-chat-input');
    const supportChatSend = document.getElementById('support-chat-send');
    
    // Feature card click event
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            const details = this.querySelector('.feature-details');
            
            // Toggle details visibility
            if (details.classList.contains('hidden')) {
                // Hide all other feature details
                document.querySelectorAll('.feature-details').forEach(detail => {
                    detail.classList.add('hidden');
                });
                
                // Show this feature's details
                details.classList.remove('hidden');
                
                // Scroll to this feature card
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                details.classList.add('hidden');
            }
        });
    });
    
    // Feature action button click event
    document.querySelectorAll('.feature-action').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent card click
            
            const featureCard = this.closest('.feature-card');
            const feature = featureCard.getAttribute('data-feature');
            
            // Show feature demo modal
            showFeatureDemo(feature);
        });
    });
    
    // Show feature demo
    function showFeatureDemo(feature) {
        // Set modal title
        featureDemoTitle.textContent = getFeatureTitle(feature);
        
        // Clear previous content
        featureDemoContent.innerHTML = '';
        
        // Add feature-specific content
        switch(feature) {
            case 'job-posting':
                featureDemoContent.innerHTML = getJobDemoContent();
                setupJobDemo();
                break;
            case 'job-matching':
                featureDemoContent.innerHTML = getMatchingDemoContent();
                setupMatchingDemo();
                break;
            case 'skill-assessment':
                featureDemoContent.innerHTML = getSkillDemoContent();
                setupSkillDemo();
                break;
            case 'support-chat':
                // Show support chat modal directly
                featureDemoModal.style.display = 'none';
                supportChatModal.style.display = 'flex';
                return;
            case 'shortlist':
                featureDemoContent.innerHTML = getComparisonDemoContent();
                setupComparisonDemo();
                break;
            case 'job-seeker':
                featureDemoContent.innerHTML = getJobSeekerDemoContent();
                setupJobSeekerDemo();
                break;
        }
        
        // Show modal
        featureDemoModal.style.display = 'flex';
    }
    
    // Get feature title
    function getFeatureTitle(feature) {
        const titles = {
            'job-posting': 'Smart Job Posting',
            'job-matching': 'Fair Job Matching',
            'skill-assessment': 'AI Skill Assessment',
            'support-chat': 'Realtime Support Chat',
            'shortlist': 'Freelancer Comparison',
            'job-seeker': 'Smart Job Seeker Posting'
        };
        return titles[feature] || 'Feature Demo';
    }
    
    // Get job posting demo content
    function getJobDemoContent() {
        return `
            <div class="job-demo active">
                <p>Create a smart job posting with AI-powered optimization:</p>
                <div class="demo-form">
                    <div class="form-group">
                        <label for="demo-job-title">Job Title</label>
                        <input type="text" id="demo-job-title" class="form-control" placeholder="e.g. Senior Frontend Developer">
                    </div>
                    <div class="form-group">
                        <label for="demo-job-description">Job Description</label>
                        <textarea id="demo-job-description" class="form-control" rows="4" placeholder="Describe the job requirements..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="demo-job-budget">Budget ($)</label>
                        <input type="number" id="demo-job-budget" class="form-control" placeholder="e.g. 1500">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="demo-ai-optimize"> Optimize with AI
                        </label>
                    </div>
                    <button class="btn btn-primary" id="demo-job-btn">Create Job Posting</button>
                </div>
                <div class="demo-result" id="job-result">
                    <h4>Job Posting Result:</h4>
                    <div id="job-result-content"></div>
                </div>
            </div>
        `;
    }
    
    // Setup job posting demo
    function setupJobDemo() {
        const jobBtn = document.getElementById('demo-job-btn');
        const jobResult = document.getElementById('job-result');
        const jobResultContent = document.getElementById('job-result-content');
        
        jobBtn.addEventListener('click', function() {
            const title = document.getElementById('demo-job-title').value;
            const description = document.getElementById('demo-job-description').value;
            const budget = document.getElementById('demo-job-budget').value;
            const aiOptimize = document.getElementById('demo-ai-optimize').checked;
            
            if (title && description && budget) {
                // Simulate job posting process
                jobResultContent.innerHTML = `
                    <div class="job-step">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Creating job posting...</p>
                    </div>
                `;
                jobResult.classList.add('active');
                
                setTimeout(() => {
                    jobResultContent.innerHTML = `
                        <div class="job-step">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                            <p>Job posting created successfully!</p>
                        </div>
                    `;
                    
                    if (aiOptimize) {
                        setTimeout(() => {
                            jobResultContent.innerHTML += `
                                <div class="job-step">
                                    <i class="fas fa-brain"></i>
                                    <p>AI analyzing job description...</p>
                                </div>
                            `;
                            
                            setTimeout(() => {
                                jobResultContent.innerHTML += `
                                    <div class="job-step">
                                        <i class="fas fa-lightbulb" style="color: var(--warning-color);"></i>
                                        <p><strong>AI Optimization Suggestions:</strong></p>
                                        <ul>
                                            <li>Add specific skills required: JavaScript, React, CSS</li>
                                            <li>Include experience level: 5+ years</li>
                                            <li>Specify project duration: 3-6 months</li>
                                        </ul>
                                    </div>
                                    <div class="job-step">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <p><strong>Job optimized for better matching!</strong></p>
                                    </div>
                                `;
                            }, 2000);
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            jobResultContent.innerHTML += `
                                <div class="job-step">
                                    <i class="fas fa-briefcase" style="color: var(--primary-color);"></i>
                                    <p><strong>Job posted successfully!</strong></p>
                                    <p><em>Note: Enable AI optimization to improve candidate matching.</em></p>
                                </div>
                            `;
                        }, 1000);
                    }
                }, 1500);
            } else {
                jobResultContent.innerHTML = `
                    <div class="job-step">
                        <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
                        <p>Please fill in all fields.</p>
                    </div>
                `;
                jobResult.classList.add('active');
            }
        });
    }
    
    // Get matching demo content
    function getMatchingDemoContent() {
        const currentUser = getCurrentUser();
        const isClient = currentUser && currentUser.role === 'client';
        
        return `
            <div class="matching-demo active">
                <p>${isClient ? 'Find the best freelancers for your project' : 'Find the best clients for your skills'}:</p>
                <div class="demo-form">
                    <div class="matching-criteria">
                        <div class="criteria-item">
                            <label for="demo-${isClient ? 'job' : 'skill'}-role">${isClient ? 'Job Role' : 'Primary Skill'}</label>
                            <select id="demo-${isClient ? 'job' : 'skill'}-role" class="form-control">
                                <option value="">-- Select ${isClient ? 'role' : 'skill'} --</option>
                                ${isClient ? 
                                    `<option value="frontend">Frontend Developer</option>
                                     <option value="designer">Graphic Designer</option>
                                     <option value="writer">Content Writer</option>` :
                                    `<option value="javascript">JavaScript</option>
                                     <option value="react">React</option>
                                     <option value="design">Graphic Design</option>
                                     <option value="writing">Content Writing</option>`
                                }
                            </select>
                        </div>
                        <div class="criteria-item">
                            <label for="demo-experience">Experience Level</label>
                            <select id="demo-experience" class="form-control">
                                <option value="">-- Select level --</option>
                                <option value="junior">Junior (0-2 years)</option>
                                <option value="mid">Mid-level (3-5 years)</option>
                                <option value="senior">Senior (5+ years)</option>
                            </select>
                        </div>
                        <div class="criteria-item">
                            <label>
                                <input type="checkbox" id="demo-fairness"> Enable Fairness Algorithm
                            </label>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="demo-matching-btn">Find Matches</button>
                </div>
                <div class="demo-result" id="matching-result">
                    <h4>Matching Results:</h4>
                    <div id="matching-result-content"></div>
                </div>
            </div>
        `;
    }
    
    // Setup matching demo
    function setupMatchingDemo() {
        const currentUser = getCurrentUser();
        const isClient = currentUser && currentUser.role === 'client';
        const roleSelect = document.getElementById(`demo-${isClient ? 'job' : 'skill'}-role`);
        const experience = document.getElementById('demo-experience');
        const fairness = document.getElementById('demo-fairness');
        const matchingBtn = document.getElementById('demo-matching-btn');
        const matchingResult = document.getElementById('matching-result');
        const matchingResultContent = document.getElementById('matching-result-content');
        
        matchingBtn.addEventListener('click', function() {
            if (roleSelect.value && experience.value) {
                // Simulate matching process
                matchingResultContent.innerHTML = `
                    <div class="matching-step">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Finding ${isClient ? 'freelancers' : 'clients'}...</p>
                    </div>
                `;
                matchingResult.classList.add('active');
                
                setTimeout(() => {
                    // Generate matches
                    const matches = generateMatches(roleSelect.value, experience.value, fairness.checked, isClient);
                    
                    matchingResultContent.innerHTML = `
                        <div class="matching-step">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                            <p>Found ${matches.length} matching ${isClient ? 'freelancers' : 'clients'}!</p>
                        </div>
                        <div class="match-list">
                            ${matches.map(match => `
                                <div class="match-item">
                                    <div class="match-avatar">${match.name.charAt(0)}</div>
                                    <div class="match-info">
                                        <div class="match-name">${match.name}</div>
                                        <div class="match-skills">${match.skills}</div>
                                    </div>
                                    <div class="match-score">${match.score}%</div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    
                    if (fairness.checked) {
                        setTimeout(() => {
                            matchingResultContent.innerHTML += `
                                <div class="matching-step">
                                    <i class="fas fa-balance-scale" style="color: var(--primary-color);"></i>
                                    <p><strong>Fairness Analysis:</strong></p>
                                    <ul>
                                        <li>Diversity score: 85%</li>
                                        <li>Bias detection: No significant bias found</li>
                                        <li>Opportunity distribution: Equitable across all demographics</li>
                                    </ul>
                                </div>
                            `;
                        }, 1000);
                    }
                }, 2000);
            } else {
                matchingResultContent.innerHTML = `
                    <div class="matching-step">
                        <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
                        <p>Please select both role and experience level.</p>
                    </div>
                `;
                matchingResult.classList.add('active');
            }
        });
    }
    
    // Generate matches based on criteria
    function generateMatches(role, experience, fairness, isClient) {
        const names = isClient ? 
            ['Alex Johnson', 'Taylor Smith', 'Jordan Williams', 'Casey Brown', 'Riley Davis'] :
            ['TechCorp', 'DesignHub', 'ContentCo', 'DevStudio', 'WebSolutions'];
            
        const skillsMap = isClient ? {
            'frontend': ['JavaScript, React, CSS, HTML'],
            'designer': ['Graphic Design, Photoshop, Illustrator'],
            'writer': ['Content Writing, SEO, Copywriting']
        } : {
            'javascript': ['Frontend Development, Web Apps'],
            'react': ['Frontend Development, UI Components'],
            'design': ['Logo Design, Branding, UI/UX'],
            'writing': ['Blog Content, Technical Writing, SEO']
        };
        
        const matches = [];
        const count = Math.floor(Math.random() * 3) + 3; // 3-5 matches
        
        for (let i = 0; i < count; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const skills = skillsMap[role] || 'General Skills';
            
            // Base score
            let score = Math.floor(Math.random() * 30) + 70; // 70-100
            
            // Adjust score based on experience
            if (experience === 'junior') score -= Math.floor(Math.random() * 10);
            if (experience === 'senior') score += Math.floor(Math.random() * 10);
            
            // Adjust score based on fairness
            if (fairness) {
                // Ensure more equitable distribution
                score = Math.min(95, Math.max(75, score));
            }
            
            matches.push({
                name,
                skills,
                score
            });
        }
        
        // Sort by score
        matches.sort((a, b) => b.score - a.score);
        
        return matches;
    }
    
    // Get skill assessment demo content
    function getSkillDemoContent() {
        const currentUser = getCurrentUser();
        const isClient = currentUser && currentUser.role === 'client';
        
        return `
            <div class="skill-demo active">
                <p>${isClient ? 'Describe the work you need to be done and get AI recommendations' : 'Assess your skills and get AI recommendations'}:</p>
                <div class="demo-form">
                    ${isClient ? 
                        `<div class="form-group">
                            <label for="demo-work-description">Work Description</label>
                            <textarea id="demo-work-description" class="form-control" rows="4" placeholder="Describe the work you need to be done..."></textarea>
                        </div>` :
                        `<div class="form-group">
                            <label for="demo-skill-select">Select a skill to assess</label>
                            <select id="demo-skill-select" class="form-control">
                                <option value="">-- Select a skill --</option>
                                <option value="javascript">JavaScript</option>
                                <option value="react">React</option>
                                <option value="design">Graphic Design</option>
                                <option value="writing">Content Writing</option>
                            </select>
                        </div>`
                    }
                    <button class="btn btn-primary" id="demo-skill-btn">Get Recommendations</button>
                </div>
                <div class="demo-result" id="skill-result">
                    <h4>Assessment Result:</h4>
                    <div id="skill-result-content"></div>
                </div>
            </div>
        `;
    }
    
    // Setup skill assessment demo
    function setupSkillDemo() {
        const currentUser = getCurrentUser();
        const isClient = currentUser && currentUser.role === 'client';
        const skillBtn = document.getElementById('demo-skill-btn');
        const skillResult = document.getElementById('skill-result');
        const skillResultContent = document.getElementById('skill-result-content');
        
        skillBtn.addEventListener('click', function() {
            if (isClient) {
                const workDescription = document.getElementById('demo-work-description').value;
                
                if (workDescription) {
                    // Simulate assessment process
                    skillResultContent.innerHTML = `
                        <div class="skill-step">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Analyzing work description...</p>
                        </div>
                    `;
                    skillResult.classList.add('active');
                    
                    setTimeout(() => {
                        skillResultContent.innerHTML = `
                            <div class="skill-step">
                                <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                <p>Analysis complete!</p>
                            </div>
                            <div class="skill-step">
                                <i class="fas fa-lightbulb" style="color: var(--warning-color);"></i>
                                <p><strong>Recommended Roles:</strong></p>
                                <ul>
                                    <li>Frontend Developer</li>
                                    <li>UI/UX Designer</li>
                                    <li>Content Writer</li>
                                </ul>
                            </div>
                            <div class="skill-step">
                                <i class="fas fa-info-circle" style="color: var(--info-color);"></i>
                                <p><strong>Required Skills:</strong></p>
                                <ul>
                                    <li>JavaScript, HTML, CSS</li>
                                    <li>React or Angular</li>
                                    <li>Responsive Design</li>
                                </ul>
                            </div>
                        `;
                    }, 2000);
                } else {
                    skillResultContent.innerHTML = `
                        <div class="skill-step">
                            <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
                            <p>Please describe the work you need to be done.</p>
                        </div>
                    `;
                    skillResult.classList.add('active');
                }
            } else {
                const skillSelect = document.getElementById('demo-skill-select');
                
                if (skillSelect.value) {
                    // Simulate assessment process
                    skillResultContent.innerHTML = `
                        <div class="skill-step">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Assessing your skills...</p>
                        </div>
                    `;
                    skillResult.classList.add('active');
                    
                    setTimeout(() => {
                        // Generate random score based on selections
                        const score = Math.floor(Math.random() * 30) + 70; // Score between 70-100
                        
                        skillResultContent.innerHTML = `
                            <div class="skill-step">
                                <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                <p>Assessment complete!</p>
                            </div>
                            <div class="skill-step">
                                <i class="fas fa-chart-bar" style="color: var(--primary-color);"></i>
                                <p><strong>Your ${skillSelect.value} skill level:</strong></p>
                                <div class="skill-score">
                                    <div class="score-circle" style="--score: ${score}%">${score}%</div>
                                    <p>${getSkillLevel(score)}</p>
                                </div>
                            </div>
                            <div class="skill-step">
                                <i class="fas fa-lightbulb" style="color: var(--warning-color);"></i>
                                <p><strong>Recommended Jobs:</strong></p>
                                <ul>
                                    ${getSkillRecommendations(skillSelect.value, score)}
                                </ul>
                            </div>
                        `;
                    }, 2000);
                } else {
                    skillResultContent.innerHTML = `
                        <div class="skill-step">
                            <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
                            <p>Please select a skill to assess.</p>
                        </div>
                    `;
                    skillResult.classList.add('active');
                }
            }
        });
    }
    
    // Get skill level based on score
    function getSkillLevel(score) {
        if (score >= 90) return 'Expert';
        if (score >= 75) return 'Advanced';
        if (score >= 60) return 'Intermediate';
        return 'Beginner';
    }
    
    // Get skill recommendations based on skill and score
    function getSkillRecommendations(skill, score) {
        const recommendations = {
            'javascript': [
                score < 80 ? 'Frontend Developer' : 'Senior Frontend Developer',
                score < 80 ? 'JavaScript Developer' : 'Full Stack Developer',
                'React Developer'
            ],
            'react': [
                score < 80 ? 'Frontend Developer' : 'Senior Frontend Developer',
                'React Developer',
                'UI Developer'
            ],
            'design': [
                score < 80 ? 'Junior Graphic Designer' : 'Senior Graphic Designer',
                'UI/UX Designer',
                'Brand Designer'
            ],
            'writing': [
                score < 80 ? 'Content Writer' : 'Senior Content Writer',
                'Technical Writer',
                'SEO Specialist'
            ]
        };
        
        return recommendations[skill].map(rec => `<li>${rec}</li>`).join('');
    }
    
    // Get comparison demo content
    function getComparisonDemoContent() {
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'client') {
            return `
                <div class="comparison-demo active">
                    <p>This feature is only available for clients.</p>
                </div>
            `;
        }
        
        const freelancers = getUsers().filter(user => user.role === 'freelancer' && user.skills);
        
        return `
            <div class="comparison-demo active">
                <p>Compare and evaluate multiple freelancers side-by-side before hiring:</p>
                <div class="comparison-container">
                    <div class="comparison-header">
                        <h3>Select Freelancers to Compare</h3>
                        <button class="btn btn-primary" id="compare-selected-btn">Compare Selected</button>
                    </div>
                    <div class="comparison-list">
                        ${freelancers.map(freelancer => `
                            <div class="comparison-item">
                                <input type="checkbox" class="comparison-checkbox" data-id="${freelancer.id}">
                                <div class="comparison-info">
                                    <div class="comparison-name">${freelancer.name}</div>
                                    <div class="comparison-skills">${freelancer.skills}</div>
                                </div>
                                <div class="comparison-rating">
                                    ${generateStarRating(freelancer.rating)}
                                    <span>${freelancer.rating}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Setup comparison demo
    function setupComparisonDemo() {
        const compareBtn = document.getElementById('compare-selected-btn');
        const checkboxes = document.querySelectorAll('.comparison-checkbox');
        
        compareBtn.addEventListener('click', function() {
            const selectedIds = [];
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedIds.push(checkbox.getAttribute('data-id'));
                }
            });
            
            if (selectedIds.length < 2) {
                showNotification('Please select at least 2 freelancers to compare', 'warning');
                return;
            }
            
            // Show comparison modal
            const comparisonModal = document.getElementById('comparison-modal');
            const comparisonContainer = document.getElementById('comparison-container');
            
            comparisonContainer.innerHTML = '';
            
            const freelancers = getFreelancersByIds(selectedIds);
            
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
                { label: 'Skills', getValue: f => f.skills },
                { label: 'Rating', getValue: f => f.rating },
                { label: 'Hourly Rate', getValue: f => `$${f.rate}/hr` },
                { label: 'Experience', getValue: f => `${f.experience} years` },
                { label: 'Completed Projects', getValue: f => f.completedProjects }
            ];
            
            attributes.forEach(attr => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${attr.label}</td>
                    ${freelancers.map(f => `<td>${attr.getValue(f)}</td>`).join('')}
                `;
                comparisonTable.appendChild(row);
            });
            
            comparisonContainer.appendChild(comparisonTable);
            
            // Close feature demo modal and show comparison modal
            featureDemoModal.style.display = 'none';
            comparisonModal.style.display = 'flex';
        });
    }
    
    // Get job seeker demo content
    function getJobSeekerDemoContent() {
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'freelancer') {
            return `
                <div class="job-seeker-demo active">
                    <p>This feature is only available for freelancers.</p>
                </div>
            `;
        }
        
        return `
            <div class="job-seeker-demo active">
                <p>Create a job seeker profile with AI-powered recommendations:</p>
                <div class="demo-form job-seeker-form">
                    <div class="form-group">
                        <label for="demo-job-seeker-title">Professional Title</label>
                        <input type="text" id="demo-job-seeker-title" class="form-control" placeholder="e.g. Senior Frontend Developer">
                    </div>
                    <div class="form-group">
                        <label for="demo-job-seeker-description">Professional Summary</label>
                        <textarea id="demo-job-seeker-description" class="form-control" rows="4" placeholder="Describe your professional background..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="demo-job-seeker-skills">Skills (comma separated)</label>
                        <input type="text" id="demo-job-seeker-skills" class="form-control" placeholder="e.g. JavaScript, React, CSS">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="demo-ai-optimize"> Optimize with AI
                        </label>
                    </div>
                    <button class="btn btn-primary" id="demo-job-seeker-btn">Create Profile</button>
                </div>
                <div class="demo-result job-seeker-result" id="job-seeker-result">
                    <h4>Profile Creation Result:</h4>
                    <div id="job-seeker-result-content"></div>
                </div>
            </div>
        `;
    }
    
    // Setup job seeker demo
    function setupJobSeekerDemo() {
        const jobSeekerBtn = document.getElementById('demo-job-seeker-btn');
        const jobSeekerResult = document.getElementById('job-seeker-result');
        const jobSeekerResultContent = document.getElementById('job-seeker-result-content');
        
        jobSeekerBtn.addEventListener('click', function() {
            const title = document.getElementById('demo-job-seeker-title').value;
            const description = document.getElementById('demo-job-seeker-description').value;
            const skills = document.getElementById('demo-job-seeker-skills').value;
            const aiOptimize = document.getElementById('demo-ai-optimize').checked;
            
            if (title && description && skills) {
                // Simulate profile creation process
                jobSeekerResultContent.innerHTML = `
                    <div class="job-seeker-step">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Creating job seeker profile...</p>
                    </div>
                `;
                jobSeekerResult.classList.add('active');
                
                setTimeout(() => {
                    jobSeekerResultContent.innerHTML = `
                        <div class="job-seeker-step">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                            <p>Profile created successfully!</p>
                        </div>
                    `;
                    
                    if (aiOptimize) {
                        setTimeout(() => {
                            jobSeekerResultContent.innerHTML += `
                                <div class="job-seeker-step">
                                    <i class="fas fa-brain"></i>
                                    <p>AI optimizing your profile...</p>
                                </div>
                            `;
                            
                            setTimeout(() => {
                                jobSeekerResultContent.innerHTML += `
                                    <div class="job-seeker-step">
                                        <i class="fas fa-lightbulb" style="color: var(--warning-color);"></i>
                                        <p><strong>AI Optimization Suggestions:</strong></p>
                                        <ul>
                                            <li>Add specific projects to your portfolio</li>
                                            <li>Highlight achievements with metrics</li>
                                            <li>Include keywords for better visibility</li>
                                        </ul>
                                    </div>
                                    <div class="job-seeker-step">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <p><strong>Profile optimized for better visibility!</strong></p>
                                    </div>
                                `;
                            }, 2000);
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            jobSeekerResultContent.innerHTML += `
                                <div class="job-seeker-step">
                                    <i class="fas fa-user-tie" style="color: var(--primary-color);"></i>
                                    <p><strong>Profile created successfully!</strong></p>
                                    <p><em>Note: Enable AI optimization to improve visibility.</em></p>
                                </div>
                            `;
                        }, 1000);
                    }
                }, 1500);
            } else {
                jobSeekerResultContent.innerHTML = `
                    <div class="job-seeker-step">
                        <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
                        <p>Please fill in all fields.</p>
                    </div>
                `;
                jobSeekerResult.classList.add('active');
            }
        });
    }
    
    // Setup support chat
    function setupSupportChat() {
        const chatContainer = document.getElementById('support-chat-container');
        const chatInput = document.getElementById('support-chat-input');
        const chatSend = document.getElementById('support-chat-send');
        
        // Predefined responses
        const responses = {
            'hello': 'Hello there! How can I assist you with Talent Hunter today?',
            'help': 'I can help you with finding jobs, connecting with freelancers, or answering questions about our platform. What would you like to know?',
            'job': 'We have thousands of jobs available across various categories. You can browse jobs on our Jobs page or use our AI-powered matching to find the perfect opportunity.',
            'freelancer': 'Our platform features talented freelancers with verified skills. You can browse profiles, check ratings, and connect with freelancers who match your project needs.',
            'matching': 'Our AI-powered matching system analyzes job requirements and freelancer profiles to find the best matches. We use fairness algorithms to ensure equitable opportunities for all.',
            'proposal': 'Our AI can help you create personalized proposals tailored to specific job requirements, increasing your chances of success.',
            'dashboard': 'Your dashboard provides an overview of your projects, earnings, and progress. You can track your career growth and manage your activities from there.',
            'profile': 'You can update your profile information, skills, and preferences in your profile settings. A complete profile helps you get better matches.',
            'payment': 'We support secure payment processing through our platform. Payments are held in escrow and released when milestones are completed.',
            'dispute': 'If you encounter any issues with a project, you can raise a dispute through our resolution center. Our team will help mediate and find a fair solution.',
            'default': "I'm not sure how to respond to that. Can you try asking about jobs, freelancers, or how our platform works?"
        };
        
        // Function to add a message to the chat
        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
            messageDiv.innerHTML = `<p>${message}</p>`;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // Function to get bot response
        function getBotResponse(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Check for keywords
            for (const [key, response] of Object.entries(responses)) {
                if (message.includes(key)) {
                    return response;
                }
            }
            
            return responses.default;
        }
        
        // Send message function
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                addMessage(message, true);
                
                // Clear input
                chatInput.value = '';
                
                // Simulate bot typing
                setTimeout(() => {
                    addMessage(getBotResponse(message));
                }, 1000);
            }
        }
        
        // Event listeners
        chatSend.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Initialize support chat
    setupSupportChat();
    
    // Close modal event
    closeFeatureDemoModal.addEventListener('click', function() {
        featureDemoModal.style.display = 'none';
    });
    
    closeSupportChatModal.addEventListener('click', function() {
        supportChatModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === featureDemoModal) {
            featureDemoModal.style.display = 'none';
        }
        if (e.target === supportChatModal) {
            supportChatModal.style.display = 'none';
        }
    });
    
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