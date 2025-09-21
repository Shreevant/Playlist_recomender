import React, { useState } from 'react'

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080'

export default function App(){
  const [career, setCareer] = useState('Data Scientist')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [knownSkills, setKnownSkills] = useState('')
  const [error, setError] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const popularCareers = [
    'Data Scientist', 'Frontend Developer', 'DevOps Engineer', 'UI/UX Designer',
    'Machine Learning Engineer', 'Product Manager', 'Cybersecurity Analyst',
    'Full Stack Developer', 'Cloud Architect', 'Mobile Developer'
  ]

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    setData(null)
    setError(null)
    
    try{
      const res = await fetch(API, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ 
          career, 
          known_skills: knownSkills.split(',').map(s=>s.trim()).filter(Boolean) 
        })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const json = await res.json()
      setData(json)
    } catch(err) {
      console.error('Error:', err)
      setError('Failed to fetch career data. Please check if the backend is running.')
    } finally { 
      setLoading(false) 
    }
  }

  const getSkillIcon = (skill) => {
    const icons = {
      'Python': '🐍', 'JavaScript': '⚡', 'React': '⚛️', 'SQL': '🗄️',
      'Machine Learning': '🤖', 'HTML/CSS': '🎨', 'Docker': '🐳', 'Linux': '🐧',
      'AWS': '☁️', 'Git': '📝', 'Statistics': '📊', 'Data Visualization': '📈',
      'APIs': '🔌', 'Testing': '🧪', 'Security': '🔒', 'Design': '✨',
      'Communication': '💬', 'Leadership': '👑', 'Analysis': '🔍'
    }
    
    for (const [key, icon] of Object.entries(icons)) {
      if (skill.toLowerCase().includes(key.toLowerCase())) {
        return icon
      }
    }
    return '💡' // default icon
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>AI Career Playlist Builder</h1>
          <p className="subtitle">Discover the skills you need and learn with curated video content</p>
          <span className="badge">Powered by AI</span>
        </div>

        <div className="input-section">
          <form onSubmit={submit}>
            <div className="input-row">
              <div className="input-group" style={{position: 'relative'}}>
                <label htmlFor="career">What career are you targeting?</label>
                <input 
                  id="career"
                  type="text"
                  value={career} 
                  onChange={e=>setCareer(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g., Data Scientist, DevOps, Frontend Developer"
                  required
                />
                {showSuggestions && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    <div style={{padding: '8px 12px', fontSize: '0.85rem', color: '#718096', fontWeight: '600'}}>Popular careers:</div>
                    {popularCareers.map(suggestion => (
                      <div
                        key={suggestion}
                        onClick={() => {
                          setCareer(suggestion)
                          setShowSuggestions(false)
                        }}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          borderTop: '1px solid #f7fafc'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="input-group">
                <label htmlFor="skills">Your current skills (optional)</label>
                <input 
                  id="skills"
                  type="text"
                  value={knownSkills} 
                  onChange={e=>setKnownSkills(e.target.value)}
                  placeholder="Python, SQL, React..."
                />
              </div>
              
              <button 
                type="submit" 
                className="build-btn"
                disabled={loading || !career.trim()}
              >
                {loading ? 'Building...' : 'Build Playlist'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            Building your personalized career playlist...
          </div>
        )}

        {error && (
          <div className="error" style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {data && (
          <div className="results">
            <div className="career-info">
              <h2>{data.career}</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{data.total_skills || 0}</div>
                  <div className="stat-label">Required Skills</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{data.skills_gap || 0}</div>
                  <div className="stat-label">Skills to Learn</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {data.skills_to_learn?.reduce((total, skill) => total + (skill.videos?.length || 0), 0) || 0}
                  </div>
                  <div className="stat-label">Learning Videos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {data.skills_to_learn?.reduce((total, skill) => total + (skill.books?.length || 0), 0) || 0}
                  </div>
                  <div className="stat-label">Recommended Books</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {data.skills_to_learn?.reduce((total, skill) => total + (skill.certifications?.length || 0), 0) || 0}
                  </div>
                  <div className="stat-label">Certifications</div>
                </div>
              </div>
            </div>

            <div className="skills-section">
              <div className="skills-grid">
                {data.skills_to_learn?.map((skillData, index) => {
                  const skill = skillData.skill
                  const videos = skillData.videos || []
                  const books = skillData.books || []
                  const certifications = skillData.certifications || []
                  
                  return (
                    <div 
                      key={skill} 
                      className="skill-card"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        borderLeft: '4px solid #f56565' // All skills to learn are skill gaps
                      }}
                    >
                      <div className="skill-header">
                        <div className="skill-icon">
                          {getSkillIcon(skill)}
                        </div>
                        <div>
                          <h3 className="skill-title">{skill}</h3>
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#f56565',
                            fontWeight: '600'
                          }}>
                            📚 Need to learn
                          </div>
                        </div>
                      </div>
                      
                      {/* Videos Section */}
                      <div className="content-section">
                        <h4 className="content-section-title">📹 Video Tutorials</h4>
                        <div className="content-container">
                          {videos.length > 0 ? (
                            videos.map((video, videoIndex) => (
                              <a 
                                key={videoIndex}
                                href={video.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="content-item video-item"
                              >
                                {video.thumbnail && (
                                  <img 
                                    src={video.thumbnail} 
                                    alt="Video thumbnail"
                                    className="content-thumbnail"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                    }}
                                  />
                                )}
                                <div className="content-details">
                                  <div className="content-title">{video.title}</div>
                                  <div className="content-meta">YouTube Tutorial</div>
                                </div>
                              </a>
                            ))
                          ) : (
                            <div className="no-content">
                              <div className="empty-icon">📹</div>
                              <div>No videos found</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Books Section */}
                      <div className="content-section">
                        <h4 className="content-section-title">📚 Recommended Books</h4>
                        <div className="content-container">
                          {books.length > 0 ? (
                            books.map((book, bookIndex) => (
                              <a 
                                key={bookIndex}
                                href={book.infoLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="content-item book-item"
                              >
                                {book.thumbnail && (
                                  <img 
                                    src={book.thumbnail} 
                                    alt="Book cover"
                                    className="content-thumbnail book-thumbnail"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                    }}
                                  />
                                )}
                                <div className="content-details">
                                  <div className="content-title">{book.title}</div>
                                  <div className="content-authors">by {book.authors?.join(', ') || 'Unknown'}</div>
                                  <div className="content-description">{book.description}</div>
                                  <div className="content-meta">Google Books</div>
                                </div>
                              </a>
                            ))
                          ) : (
                            <div className="no-content">
                              <div className="empty-icon">📚</div>
                              <div>No books found</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Certifications Section */}
                      <div className="content-section">
                        <h4 className="content-section-title">🎓 Professional Certifications</h4>
                        <div className="content-container">
                          {certifications.length > 0 ? (
                            certifications.map((cert, certIndex) => (
                              <a 
                                key={certIndex}
                                href={cert.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="content-item cert-item"
                              >
                                <div className="cert-icon">🎓</div>
                                <div className="content-details">
                                  <div className="content-title">{cert.title}</div>
                                  <div className="content-provider">by {cert.provider || 'Professional Provider'}</div>
                                  <div className="content-description">{cert.description}</div>
                                  <div className="content-meta">Certification Program</div>
                                </div>
                              </a>
                            ))
                          ) : (
                            <div className="no-content">
                              <div className="empty-icon">🎓</div>
                              <div>No certifications found</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">🚀</div>
            <h3>Ready to build your career playlist?</h3>
            <p>Enter your target career above and we'll create a personalized learning path with video tutorials, books, and certifications for each skill you need to learn.</p>
          </div>
        )}

        <div className="footer">
          <p>🤖 Built with AI • 📹 Powered by YouTube • 📚 Enriched with Google Books • 🎓 Certified Learning • 💝 Made for learners</p>
        </div>
      </div>
    </div>
  )
}