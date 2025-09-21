// Extension popup functionality
class CareerPlaylistExtension {
    constructor() {
        this.API_URL = 'http://localhost:8080'; // Backend API endpoint
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

        // Settings (placeholder)
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showMessage('Settings feature coming soon!', 'info');
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

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    career: career,
                    known_skills: skills.split(',').map(s => s.trim()).filter(Boolean)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayResults(data);
            this.saveData(career, skills);

        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Failed to build playlist. Please check if the backend is running.', 'error');
        } finally {
            this.showLoading(false);
        }
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
        chrome.storage.local.get(['lastCareer', 'lastSkills'], (result) => {
            if (result.lastCareer) {
                document.getElementById('career-input').value = result.lastCareer;
            }
            if (result.lastSkills) {
                document.getElementById('skills-input').value = result.lastSkills;
            }
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