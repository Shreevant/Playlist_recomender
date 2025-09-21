// Extension popup functionality
class CareerPlaylistExtension {
    constructor() {
        // Extension works in multiple modes:
        // 1. With backend API (full features)
        // 2. Static fallback mode (search links only)
        this.API_ENDPOINTS = [
            'http://localhost:8080',  // Local backend (if user runs it)
            // Add your deployed backend URLs here if available
        ];
        
        // Extension works WITHOUT APIs using static fallback
        this.FALLBACK_MODE = true; // Always enable fallback for users
        
        this.popularCareers = [
            'Data Scientist', 'Frontend Developer', 'DevOps Engineer', 'UI/UX Designer',
            'Machine Learning Engineer', 'Product Manager', 'Cybersecurity Analyst',
            'Full Stack Developer', 'Cloud Architect', 'Mobile Developer'
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedData();
    }

    bindEvents() {
        // Form submission
        document.getElementById('career-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.buildPlaylist();
        });

        // Career input with suggestions
        const careerInput = document.getElementById('career-input');
        careerInput.addEventListener('input', () => this.showSuggestions());
        careerInput.addEventListener('focus', () => this.showSuggestions());
        careerInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 200);
        });

        // Open full web app
        document.getElementById('open-web-app').addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:3000' });
        });

        // Settings (API configuration)
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });
    }

    showSuggestions() {
        const input = document.getElementById('career-input');
        const suggestionsDiv = document.getElementById('suggestions');
        const query = input.value.toLowerCase();

        if (query.length < 1) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        const filtered = this.popularCareers.filter(career => 
            career.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        suggestionsDiv.innerHTML = filtered.map((career, index) => 
            `<div class="ext-suggestion-item" data-career="${career}" data-index="${index}">${career}</div>`
        ).join('');
        
        // Add click event listeners to suggestions
        suggestionsDiv.querySelectorAll('.ext-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectCareer(item.dataset.career);
            });
        });
        
        suggestionsDiv.style.display = 'block';
    }

    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
    }

    selectCareer(career) {
        document.getElementById('career-input').value = career;
        this.hideSuggestions();
    }

    async buildPlaylist() {
        const career = document.getElementById('career-input').value.trim();
        const skills = document.getElementById('skills-input').value.trim();

        if (!career) {
            this.showMessage('Please enter a career field', 'error');
            return;
        }

        this.showLoading(true);
        this.hideError();
        this.hideResults();

        // Try API first, then fallback to static mode
        let success = false;
        
        for (const apiUrl of this.API_ENDPOINTS) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        career: career,
                        known_skills: skills.split(',').map(s => s.trim()).filter(Boolean)
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.displayResults(data);
                    this.saveData(career, skills);
                    success = true;
                    break;
                }
            } catch (error) {
                console.log(`Failed to connect to ${apiUrl}:`, error);
                // Continue to next endpoint
            }
        }
        
        // If all APIs fail, use static fallback
        if (!success) {
            console.log('All API endpoints failed, using static fallback');
            this.displayStaticResults(career, skills);
            this.saveData(career, skills);
        }

        this.showLoading(false);
    }

    displayStaticResults(career, skills) {
        // Static fallback data when API is unavailable
        const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        
        const staticSkills = this.getStaticSkills(career);
        const skillGap = staticSkills.filter(skill => 
            !skillsArray.some(known => known.toLowerCase().includes(skill.toLowerCase()))
        );
        
        const staticData = {
            career: career,
            skills: staticSkills,
            skill_gap: skillGap,
            playlist: {},
            books: {},
            certifications: {}
        };
        
        // Generate static resources for each skill
        staticSkills.forEach(skill => {
            staticData.playlist[skill] = this.getStaticVideos(skill);
            staticData.books[skill] = this.getStaticBooks(skill);
            staticData.certifications[skill] = this.getStaticCertifications(skill);
        });
        
        this.displayResults(staticData);
        this.showMessage('Running in offline mode - showing search links', 'info');
    }
    
    getStaticSkills(career) {
        const careerSkills = {
            // Tech roles
            'data scientist': ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
            'web developer': ['HTML/CSS', 'JavaScript', 'React', 'APIs', 'Git'],
            'machine learning engineer': ['Python', 'Deep Learning', 'Model Deployment', 'Data Engineering', 'MLOps'],
            'ui/ux designer': ['Design Fundamentals', 'Figma', 'User Research', 'Prototyping', 'Accessibility'],
            'software engineer': ['Programming', 'Data Structures', 'Algorithms', 'System Design', 'Testing'],
            'devops engineer': ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms'],
            'product manager': ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management'],
            'cybersecurity analyst': ['Network Security', 'Incident Response', 'Risk Assessment', 'Security Tools', 'Compliance'],
            'mobile developer': ['Mobile Frameworks', 'UI/UX Design', 'APIs', 'App Store Optimization', 'Testing'],
            'cloud architect': ['Cloud Platforms', 'Architecture Design', 'Security', 'Cost Optimization', 'Migration Strategies'],
            'full stack developer': ['Frontend', 'Backend', 'Databases', 'APIs', 'Version Control'],
            'frontend developer': ['HTML/CSS', 'JavaScript', 'React/Vue/Angular', 'Responsive Design', 'Performance Optimization'],
            'backend developer': ['Server Languages', 'Databases', 'API Design', 'Security', 'Performance'],
            'qa engineer': ['Test Automation', 'Manual Testing', 'Bug Tracking', 'Test Planning', 'Quality Assurance'],
            'database administrator': ['SQL', 'Database Design', 'Performance Tuning', 'Backup & Recovery', 'Security'],
            'system administrator': ['Linux/Windows', 'Networking', 'Monitoring', 'Troubleshooting', 'Automation'],
            'network engineer': ['Networking Protocols', 'Router/Switch Config', 'Security', 'Troubleshooting', 'Network Design'],
            'security engineer': ['Security Architecture', 'Penetration Testing', 'Incident Response', 'Compliance', 'Risk Management'],
            'game developer': ['Game Engines', 'Programming', '3D Graphics', 'Game Design', 'Performance Optimization'],
            'blockchain developer': ['Smart Contracts', 'Cryptocurrency', 'Distributed Systems', 'Cryptography', 'Web3'],
            'ai engineer': ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Data Processing', 'Model Deployment'],
            'data engineer': ['ETL Pipelines', 'Big Data', 'Data Warehousing', 'SQL', 'Cloud Platforms'],
            'data analyst': ['SQL', 'Excel', 'Data Visualization', 'Statistics', 'Business Intelligence'],
            'business analyst': ['Requirements Analysis', 'Process Mapping', 'Data Analysis', 'Documentation', 'Stakeholder Management'],
            'python developer': ['Python', 'APIs', 'Databases', 'Testing', 'Git'],
            
            // Creative roles
            'graphic designer': ['Adobe Creative Suite', 'Typography', 'Color Theory', 'Brand Design', 'Print Design'],
            'web designer': ['UI Design', 'Responsive Design', 'CSS', 'Design Tools', 'User Experience'],
            'video editor': ['Video Editing Software', 'Color Grading', 'Audio Editing', 'Motion Graphics', 'Storytelling'],
            '3d artist': ['3D Modeling', 'Texturing', 'Lighting', 'Animation', 'Rendering'],
            'photographer': ['Camera Operation', 'Lighting', 'Photo Editing', 'Composition', 'Portfolio Development'],
            'content creator': ['Content Strategy', 'Video Production', 'Social Media', 'SEO', 'Analytics'],
            'copywriter': ['Writing Skills', 'SEO Writing', 'Brand Voice', 'Content Strategy', 'Research'],
            'social media manager': ['Social Media Strategy', 'Content Creation', 'Analytics', 'Community Management', 'Advertising'],
            
            // Business roles
            'digital marketer': ['SEO/SEM', 'Social Media Marketing', 'Analytics', 'Content Marketing', 'Email Marketing'],
            'sales manager': ['Sales Strategy', 'CRM Systems', 'Lead Generation', 'Negotiation', 'Team Management'],
            'project manager': ['Project Planning', 'Risk Management', 'Team Leadership', 'Agile/Scrum', 'Communication'],
            'scrum master': ['Agile Methodologies', 'Team Facilitation', 'Sprint Planning', 'Stakeholder Management', 'Continuous Improvement'],
            'hr manager': ['Recruitment', 'Employee Relations', 'Performance Management', 'HR Policies', 'Training & Development'],
            'financial analyst': ['Financial Modeling', 'Excel', 'Data Analysis', 'Forecasting', 'Investment Analysis'],
            'accountant': ['Accounting Principles', 'Tax Preparation', 'Financial Reporting', 'Auditing', 'Software Proficiency'],
            'operations manager': ['Process Optimization', 'Supply Chain', 'Quality Control', 'Team Management', 'Cost Analysis'],
            'consultant': ['Problem Solving', 'Client Management', 'Industry Knowledge', 'Presentation Skills', 'Research'],
            
            // Other fields
            'teacher': ['Curriculum Development', 'Classroom Management', 'Student Assessment', 'Communication', 'Subject Expertise'],
            'chef': ['Culinary Skills', 'Food Safety', 'Menu Planning', 'Kitchen Management', 'Creativity'],
            'architect': ['Design Software', 'Building Codes', 'Project Management', '3D Visualization', 'Structural Knowledge'],
            'civil engineer': ['Structural Analysis', 'CAD Software', 'Project Management', 'Construction Knowledge', 'Problem Solving'],
            'mechanical engineer': ['CAD Design', 'Thermodynamics', 'Materials Science', 'Problem Solving', 'Project Management'],
            'electrical engineer': ['Circuit Design', 'Programming', 'Signal Processing', 'Problem Solving', 'Testing'],
            'lawyer': ['Legal Research', 'Writing', 'Critical Thinking', 'Negotiation', 'Case Analysis'],
            'journalist': ['Writing', 'Research', 'Interviewing', 'Fact Checking', 'Storytelling'],
            'translator': ['Language Proficiency', 'Cultural Knowledge', 'Writing Skills', 'Research', 'Attention to Detail']
        };
        
        // Add career aliases for flexible matching
        const careerAliases = {
            'dev': 'developer',
            'devops': 'devops engineer', 
            'frontend': 'frontend developer',
            'backend': 'backend developer',
            'fullstack': 'full stack developer',
            'full-stack': 'full stack developer',
            'ml': 'machine learning engineer',
            'ai': 'ai engineer',
            'qa': 'qa engineer',
            'tester': 'qa engineer',
            'dba': 'database administrator',
            'sysadmin': 'system administrator',
            'netadmin': 'network engineer',
            'security': 'security engineer',
            'infosec': 'security engineer',
            'cybersec': 'cybersecurity analyst',
            'gamedev': 'game developer',
            'blockchain': 'blockchain developer',
            'crypto': 'blockchain developer',
            'designer': 'graphic designer',
            'ux': 'ui/ux designer',
            'ui': 'ui/ux designer',
            'pm': 'product manager',
            'scrum': 'scrum master',
            'marketing': 'digital marketer',
            'sales': 'sales manager',
            'hr': 'hr manager',
            'finance': 'financial analyst',
            'accounting': 'accountant',
            'ops': 'operations manager',
            'teacher': 'teacher',
            'prof': 'professor',
            'chef': 'chef',
            'cook': 'chef',
            'architect': 'architect',
            'lawyer': 'lawyer',
            'attorney': 'lawyer',
            'journalist': 'journalist',
            'reporter': 'journalist',
            'translator': 'translator'
        };
        
        let careerKey = career.toLowerCase().trim();
        
        // Check for aliases first (e.g., "devops" -> "devops engineer")
        if (careerKey in careerAliases) {
            careerKey = careerAliases[careerKey];
        }
        
        // Direct match
        if (careerKey in careerSkills) {
            return careerSkills[careerKey];
        }
        
        // Partial matches (e.g., "data" matches "data scientist")
        for (const [fullCareer, skills] of Object.entries(careerSkills)) {
            if (careerKey.includes(fullCareer) || fullCareer.includes(careerKey)) {
                return skills;
            }
        }
        
        // Default fallback skills
        return ['Research & Learning', 'Problem Solving', 'Communication', 'Teamwork', 'Industry Knowledge'];
    }
    
    getStaticVideos(skill) {
        const searchQuery = skill.replace(' ', '+');
        return [
            {
                title: `${skill} Tutorial - YouTube Search`,
                url: `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
                thumbnail: 'https://www.youtube.com/img/desktop/yt_1200.png'
            },
            {
                title: `Learn ${skill} - Free Courses`,
                url: `https://www.youtube.com/results?search_query=${searchQuery}+course+free`,
                thumbnail: 'https://www.youtube.com/img/desktop/yt_1200.png'
            }
        ];
    }
    
    getStaticBooks(skill) {
        const searchQuery = skill.replace(' ', '+');
        return [
            {
                title: `${skill} Books - Google Books`,
                authors: ['Various Authors'],
                description: `Find comprehensive ${skill} books and learning materials.`,
                thumbnail: 'https://books.google.com/googlebooks/images/no_cover_thumb.gif',
                infoLink: `https://books.google.com/books?q=${searchQuery}+programming`
            }
        ];
    }
    
    getStaticCertifications(skill) {
        const searchQuery = skill.replace(' ', '+');
        return [
            {
                title: `${skill} Professional Certification - Coursera`,
                provider: 'Coursera',
                description: `Find professional ${skill} certifications from top universities and companies.`,
                url: `https://www.coursera.org/search?query=${searchQuery}+certification`,
                type: 'certification',
                skill: skill
            },
            {
                title: `${skill} Certificate Programs - edX`,
                provider: 'edX',
                description: `Explore verified ${skill} certificate programs from leading institutions.`,
                url: `https://www.edx.org/search?q=${searchQuery}+certificate`,
                type: 'certification',
                skill: skill
            }
        ];
    }

    displayResults(data) {
        const careerInfo = document.getElementById('career-info');
        const skillsList = document.getElementById('skills-list');

        // Handle both old format and new format
        let skillsData = [];
        let totalVideos = 0;
        let totalBooks = 0;
        let totalCertifications = 0;
        
        if (data.skills_to_learn) {
            // New format from backend API
            skillsData = data.skills_to_learn.map(skillData => ({
                skill: skillData.skill,
                videos: skillData.videos || [],
                books: skillData.books || [],
                certifications: skillData.certifications || [],
                isSkillGap: true // All skills in skills_to_learn are gaps
            }));
            
            // Count totals
            skillsData.forEach(skillData => {
                totalVideos += skillData.videos.length;
                totalBooks += skillData.books.length;
                totalCertifications += skillData.certifications.length;
            });
        } else {
            // Old format from static fallback
            const skills = data.skills || [];
            const skillGap = data.skill_gap || [];
            
            skillsData = skills.map(skill => ({
                skill: skill,
                videos: data.playlist?.[skill] || [],
                books: data.books?.[skill] || [],
                certifications: data.certifications?.[skill] || [],
                isSkillGap: skillGap.includes(skill)
            }));
            
            // Count totals from old format
            totalVideos = Object.values(data.playlist || {}).reduce((total, videos) => total + videos.length, 0);
            totalBooks = Object.values(data.books || {}).reduce((total, books) => total + books.length, 0);
            totalCertifications = Object.values(data.certifications || {}).reduce((total, certs) => total + certs.length, 0);
        }

        // Career info section
        const totalSkills = skillsData.length;
        const skillsToLearn = skillsData.filter(s => s.isSkillGap).length;
        
        careerInfo.innerHTML = `
            <div class="ext-career-title">${data.career}</div>
            <div class="ext-stats">
                <div class="ext-stat">
                    <div class="ext-stat-number">${totalSkills}</div>
                    <div class="ext-stat-label">Skills</div>
                </div>
                <div class="ext-stat">
                    <div class="ext-stat-number">${skillsToLearn}</div>
                    <div class="ext-stat-label">To Learn</div>
                </div>
                <div class="ext-stat">
                    <div class="ext-stat-number">${totalVideos}</div>
                    <div class="ext-stat-label">Videos</div>
                </div>
                <div class="ext-stat">
                    <div class="ext-stat-number">${totalBooks}</div>
                    <div class="ext-stat-label">Books</div>
                </div>
                <div class="ext-stat">
                    <div class="ext-stat-number">${totalCertifications}</div>
                    <div class="ext-stat-label">Certs</div>
                </div>
            </div>
        `;

        // Skills list
        skillsList.innerHTML = skillsData.map(skillData => {
            const skillIcon = this.getSkillIcon(skillData.skill);

            return `
                <div class="ext-skill-item">
                    <div class="ext-skill-header">
                        <span class="ext-skill-icon">${skillIcon}</span>
                        <span class="ext-skill-name">${skillData.skill}</span>
                        <span class="ext-skill-status ${skillData.isSkillGap ? 'ext-skill-gap' : 'ext-skill-known'}">
                            ${skillData.isSkillGap ? 'Learn' : 'Known'}
                        </span>
                    </div>
                    <div class="ext-resources">
                        ${skillData.videos.slice(0, 1).map(video => 
                            `<a href="${video.url}" target="_blank" class="ext-resource-btn">📹 Video</a>`
                        ).join('')}
                        ${skillData.books.slice(0, 1).map(book => 
                            `<a href="${book.infoLink}" target="_blank" class="ext-resource-btn">📚 Book</a>`
                        ).join('')}
                        ${skillData.certifications.slice(0, 1).map(cert => 
                            `<a href="${cert.url}" target="_blank" class="ext-resource-btn">🎓 Cert</a>`
                        ).join('')}
                    </div>
                </div>
            `;
        }).join('');

        this.showResults(true);
    }

    getSkillIcon(skill) {
        const icons = {
            'Python': '🐍', 'JavaScript': '⚡', 'React': '⚛️', 'SQL': '🗄️',
            'Machine Learning': '🤖', 'HTML/CSS': '🎨', 'Docker': '🐳', 'Linux': '🐧',
            'AWS': '☁️', 'Git': '📝', 'Statistics': '📊', 'Data Visualization': '📈',
            'APIs': '🔌', 'Testing': '🧪', 'Security': '🔒', 'Design': '✨',
            'Communication': '💬', 'Leadership': '👑', 'Analysis': '🔍'
        };
        
        for (const [key, icon] of Object.entries(icons)) {
            if (skill.toLowerCase().includes(key.toLowerCase())) {
                return icon;
            }
        }
        return '💡'; // default icon
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
        document.getElementById('build-btn').disabled = show;
    }

    showMessage(message, type) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.className = `ext-${type}`;
        errorDiv.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }

    showResults(show) {
        document.getElementById('results').style.display = show ? 'block' : 'none';
    }

    hideResults() {
        this.showResults(false);
    }

    saveData(career, skills) {
        chrome.storage.local.set({
            lastCareer: career,
            lastSkills: skills,
            lastUpdate: Date.now()
        });
    }

    loadSavedData() {
        chrome.storage.local.get(['lastCareer', 'lastSkills', 'userApiKeys'], (result) => {
            if (result.lastCareer) {
                document.getElementById('career-input').value = result.lastCareer;
            }
            if (result.lastSkills) {
                document.getElementById('skills-input').value = result.lastSkills;
            }
            if (result.userApiKeys) {
                this.userApiKeys = result.userApiKeys;
            }
        });
    }
    
    showSettings() {
        const settingsHtml = `
            <div class="ext-settings-modal" id="settings-modal">
                <div class="ext-settings-content">
                    <div class="ext-settings-header">
                        <h3>⚙️ Extension Settings</h3>
                        <button id="close-settings-btn" class="ext-close-btn">×</button>
                    </div>
                    <div class="ext-settings-body">
                        <h4>🔑 API Configuration (Optional)</h4>
                        <p class="ext-settings-note">Extension works without APIs using search links. Add keys for enhanced features:</p>
                        
                        <div class="ext-input-group">
                            <label>YouTube API Key</label>
                            <input type="password" id="youtube-api-key" placeholder="Optional - for live video recommendations">
                            <small>Get from <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a></small>
                        </div>
                        
                        <div class="ext-input-group">
                            <label>Google Books API Key</label>
                            <input type="password" id="books-api-key" placeholder="Optional - for live book recommendations">
                        </div>
                        
                        <div class="ext-input-group">
                            <label>Knowledge Graph API Key</label>
                            <input type="password" id="knowledge-graph-api-key" placeholder="Optional - for certification recommendations">
                            <small>Same key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a></small>
                        </div>
                        
                        <div class="ext-input-group">
                            <label>Backend URL</label>
                            <input type="text" id="backend-url" placeholder="http://localhost:8080" value="http://localhost:8080">
                        </div>
                    </div>
                    <div class="ext-settings-footer">
                        <button id="cancel-settings-btn" class="ext-cancel-btn">Cancel</button>
                        <button id="clear-settings-btn" class="ext-clear-btn">Clear All</button>
                        <button id="save-settings-btn" class="ext-build-btn">Save Settings</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settingsHtml);
        
        // Add event listeners after modal is created
        document.getElementById('close-settings-btn').addEventListener('click', () => {
            this.hideSettings();
        });
        
        document.getElementById('cancel-settings-btn').addEventListener('click', () => {
            this.cancelSettings();
        });
        
        document.getElementById('clear-settings-btn').addEventListener('click', () => {
            this.clearSettings();
        });
        
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Load existing settings
        chrome.storage.local.get(['userApiKeys'], (result) => {
            if (result.userApiKeys) {
                const keys = result.userApiKeys;
                if (keys.youtube) document.getElementById('youtube-api-key').value = keys.youtube;
                if (keys.books) document.getElementById('books-api-key').value = keys.books;
                if (keys.knowledgeGraph) document.getElementById('knowledge-graph-api-key').value = keys.knowledgeGraph;
                if (keys.backend) document.getElementById('backend-url').value = keys.backend;
            }
        });
    }
    
    hideSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.remove();
    }
    
    cancelSettings() {
        // Simply close modal without saving changes
        this.hideSettings();
    }
    
    saveSettings() {
        const apiKeys = {
            youtube: document.getElementById('youtube-api-key').value.trim(),
            books: document.getElementById('books-api-key').value.trim(),
            knowledgeGraph: document.getElementById('knowledge-graph-api-key').value.trim(),
            backend: document.getElementById('backend-url').value.trim() || 'http://localhost:8080'
        };
        
        chrome.storage.local.set({ userApiKeys: apiKeys }, () => {
            this.userApiKeys = apiKeys;
            this.showMessage('Settings saved! Restart extension to apply changes.', 'info');
            this.hideSettings();
        });
    }
    
    clearSettings() {
        // Clear input fields in modal first
        const inputs = [
            'youtube-api-key',
            'books-api-key', 
            'knowledge-graph-api-key',
            'backend-url'
        ];
        
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                if (id === 'backend-url') {
                    input.value = 'http://localhost:8080'; // Reset to default
                } else {
                    input.value = ''; // Clear API keys
                }
            }
        });
        
        // Then clear from storage
        chrome.storage.local.remove(['userApiKeys'], () => {
            this.userApiKeys = null;
            this.showMessage('Settings cleared! Click Save to apply or Cancel to revert.', 'info');
        });
    }
}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.careerExtension = new CareerPlaylistExtension();
});

// Global function for suggestion clicks
window.selectCareer = (career) => {
    if (window.careerExtension) {
        window.careerExtension.selectCareer(career);
    }
};