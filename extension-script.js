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

        suggestionsDiv.innerHTML = filtered.map(career => 
            `<div class="ext-suggestion-item" onclick="careerExtension.selectCareer('${career}')">${career}</div>`
        ).join('');
        
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
            books: {}
        };
        
        // Generate static resources for each skill
        staticSkills.forEach(skill => {
            staticData.playlist[skill] = this.getStaticVideos(skill);
            staticData.books[skill] = this.getStaticBooks(skill);
        });
        
        this.displayResults(staticData);
        this.showMessage('Running in offline mode - showing search links', 'info');
    }
    
    getStaticSkills(career) {
        const careerSkills = {
            'data scientist': ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
            'frontend developer': ['HTML/CSS', 'JavaScript', 'React', 'APIs', 'Git'],
            'python developer': ['Python', 'APIs', 'Databases', 'Testing', 'Git'],
            'web developer': ['HTML/CSS', 'JavaScript', 'React', 'APIs', 'Git'],
            'software engineer': ['Programming', 'Data Structures', 'Algorithms', 'System Design', 'Testing']
        };
        
        const careerKey = career.toLowerCase();
        for (const [key, skills] of Object.entries(careerSkills)) {
            if (careerKey.includes(key) || key.includes(careerKey)) {
                return skills;
            }
        }
        
        return ['Programming', 'Problem Solving', 'Communication', 'Teamwork', 'Learning'];
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

    displayResults(data) {
        const careerInfo = document.getElementById('career-info');
        const skillsList = document.getElementById('skills-list');

        // Career info section
        const totalVideos = Object.values(data.playlist || {}).reduce((total, videos) => total + videos.length, 0);
        const totalBooks = Object.values(data.books || {}).reduce((total, books) => total + books.length, 0);

        careerInfo.innerHTML = `
            <div class="ext-career-title">${data.career}</div>
            <div class="ext-stats">
                <div class="ext-stat">
                    <div class="ext-stat-number">${data.skills?.length || 0}</div>
                    <div class="ext-stat-label">Skills</div>
                </div>
                <div class="ext-stat">
                    <div class="ext-stat-number">${data.skill_gap?.length || 0}</div>
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
            </div>
        `;

        // Skills list
        skillsList.innerHTML = (data.skills || []).map(skill => {
            const isSkillGap = data.skill_gap?.includes(skill);
            const videos = data.playlist?.[skill] || [];
            const books = data.books?.[skill] || [];
            const skillIcon = this.getSkillIcon(skill);

            return `
                <div class="ext-skill-item">
                    <div class="ext-skill-header">
                        <span class="ext-skill-icon">${skillIcon}</span>
                        <span class="ext-skill-name">${skill}</span>
                        <span class="ext-skill-status ${isSkillGap ? 'ext-skill-gap' : 'ext-skill-known'}">
                            ${isSkillGap ? 'Learn' : 'Known'}
                        </span>
                    </div>
                    <div class="ext-resources">
                        ${videos.slice(0, 2).map(video => 
                            `<a href="${video.url}" target="_blank" class="ext-resource-btn">📹 Video</a>`
                        ).join('')}
                        ${books.slice(0, 1).map(book => 
                            `<a href="${book.infoLink}" target="_blank" class="ext-resource-btn">📚 Book</a>`
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
                        <button onclick="careerExtension.hideSettings()" class="ext-close-btn">×</button>
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
                            <label>Backend URL</label>
                            <input type="text" id="backend-url" placeholder="http://localhost:8080" value="http://localhost:8080">
                        </div>
                    </div>
                    <div class="ext-settings-footer">
                        <button onclick="careerExtension.saveSettings()" class="ext-build-btn">Save Settings</button>
                        <button onclick="careerExtension.clearSettings()" class="ext-secondary-btn">Clear All</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settingsHtml);
        
        // Load existing settings
        chrome.storage.local.get(['userApiKeys'], (result) => {
            if (result.userApiKeys) {
                const keys = result.userApiKeys;
                if (keys.youtube) document.getElementById('youtube-api-key').value = keys.youtube;
                if (keys.books) document.getElementById('books-api-key').value = keys.books;
                if (keys.backend) document.getElementById('backend-url').value = keys.backend;
            }
        });
    }
    
    hideSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.remove();
    }
    
    saveSettings() {
        const apiKeys = {
            youtube: document.getElementById('youtube-api-key').value.trim(),
            books: document.getElementById('books-api-key').value.trim(),
            backend: document.getElementById('backend-url').value.trim() || 'http://localhost:8080'
        };
        
        chrome.storage.local.set({ userApiKeys: apiKeys }, () => {
            this.userApiKeys = apiKeys;
            this.showMessage('Settings saved! Restart extension to apply changes.', 'info');
            this.hideSettings();
        });
    }
    
    clearSettings() {
        chrome.storage.local.remove(['userApiKeys'], () => {
            this.userApiKeys = null;
            this.showMessage('Settings cleared!', 'info');
            this.hideSettings();
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