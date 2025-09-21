# backend/main.py
import os
import json
import requests
import functions_framework
from typing import List
from dotenv import load_dotenv

# Load environment variables from root .env file
load_dotenv('../.env')

# Vertex AI imports (used if available)
try:
    from google.cloud import aiplatform
    VERTEX_AVAILABLE = True
    print("Vertex AI available")
except ImportError as e:
    VERTEX_AVAILABLE = False
    print(f"Vertex AI not available: {e}")
except Exception as e:
    VERTEX_AVAILABLE = False
    print(f"Vertex AI error: {e}")

# Config from environment
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
GCP_PROJECT = os.getenv("GCP_PROJECT")
LOCATION = os.getenv("LOCATION", "us-central1")

# Simple fallback skill database when Vertex isn't reachable
FALLBACK_SKILLS = {
    "data scientist": ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
    "web developer": ["HTML/CSS", "JavaScript", "React", "APIs", "Git"],
    "machine learning engineer": ["Python", "Deep Learning", "Model Deployment", "Data Engineering", "MLOps"],
    "ui/ux designer": ["Design Fundamentals", "Figma", "User Research", "Prototyping", "Accessibility"],
    "software engineer": ["Programming", "Data Structures", "Algorithms", "System Design", "Testing"],
    "devops engineer": ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
    "product manager": ["Product Strategy", "User Research", "Data Analysis", "Roadmapping", "Stakeholder Management"],
    "cybersecurity analyst": ["Network Security", "Incident Response", "Risk Assessment", "Security Tools", "Compliance"],
    "mobile developer": ["Mobile Frameworks", "UI/UX Design", "APIs", "App Store Optimization", "Testing"],
    "cloud architect": ["Cloud Platforms", "Architecture Design", "Security", "Cost Optimization", "Migration Strategies"],
    # Tech roles
    "full stack developer": ["Frontend", "Backend", "Databases", "APIs", "Version Control"],
    "frontend developer": ["HTML/CSS", "JavaScript", "React/Vue/Angular", "Responsive Design", "Performance Optimization"],
    "backend developer": ["Server Languages", "Databases", "API Design", "Security", "Performance"],
    "qa engineer": ["Test Automation", "Manual Testing", "Bug Tracking", "Test Planning", "Quality Assurance"],
    "database administrator": ["SQL", "Database Design", "Performance Tuning", "Backup & Recovery", "Security"],
    "system administrator": ["Linux/Windows", "Networking", "Monitoring", "Troubleshooting", "Automation"],
    "network engineer": ["Networking Protocols", "Router/Switch Config", "Security", "Troubleshooting", "Network Design"],
    "security engineer": ["Security Architecture", "Penetration Testing", "Incident Response", "Compliance", "Risk Management"],
    "game developer": ["Game Engines", "Programming", "3D Graphics", "Game Design", "Performance Optimization"],
    "blockchain developer": ["Smart Contracts", "Cryptocurrency", "Distributed Systems", "Cryptography", "Web3"],
    "ai engineer": ["Machine Learning", "Deep Learning", "Neural Networks", "Data Processing", "Model Deployment"],
    "data engineer": ["ETL Pipelines", "Big Data", "Data Warehousing", "SQL", "Cloud Platforms"],
    "data analyst": ["SQL", "Excel", "Data Visualization", "Statistics", "Business Intelligence"],
    "business analyst": ["Requirements Analysis", "Process Mapping", "Data Analysis", "Documentation", "Stakeholder Management"],
    # Creative roles
    "graphic designer": ["Adobe Creative Suite", "Typography", "Color Theory", "Brand Design", "Print Design"],
    "web designer": ["UI Design", "Responsive Design", "CSS", "Design Tools", "User Experience"],
    "video editor": ["Video Editing Software", "Color Grading", "Audio Editing", "Motion Graphics", "Storytelling"],
    "3d artist": ["3D Modeling", "Texturing", "Lighting", "Animation", "Rendering"],
    "photographer": ["Camera Operation", "Lighting", "Photo Editing", "Composition", "Portfolio Development"],
    "content creator": ["Content Strategy", "Video Production", "Social Media", "SEO", "Analytics"],
    "copywriter": ["Writing Skills", "SEO Writing", "Brand Voice", "Content Strategy", "Research"],
    "social media manager": ["Social Media Strategy", "Content Creation", "Analytics", "Community Management", "Advertising"],
    # Business roles
    "digital marketer": ["SEO/SEM", "Social Media Marketing", "Analytics", "Content Marketing", "Email Marketing"],
    "sales manager": ["Sales Strategy", "CRM Systems", "Lead Generation", "Negotiation", "Team Management"],
    "project manager": ["Project Planning", "Risk Management", "Team Leadership", "Agile/Scrum", "Communication"],
    "scrum master": ["Agile Methodologies", "Team Facilitation", "Sprint Planning", "Stakeholder Management", "Continuous Improvement"],
    "hr manager": ["Recruitment", "Employee Relations", "Performance Management", "HR Policies", "Training & Development"],
    "financial analyst": ["Financial Modeling", "Excel", "Data Analysis", "Forecasting", "Investment Analysis"],
    "accountant": ["Accounting Principles", "Tax Preparation", "Financial Reporting", "Auditing", "Software Proficiency"],
    "operations manager": ["Process Optimization", "Supply Chain", "Quality Control", "Team Management", "Cost Analysis"],
    "consultant": ["Problem Solving", "Client Management", "Industry Knowledge", "Presentation Skills", "Research"],
    # Healthcare
    "nurse": ["Patient Care", "Medical Knowledge", "Communication", "Critical Thinking", "Empathy"],
    "doctor": ["Medical Diagnosis", "Patient Care", "Medical Knowledge", "Communication", "Decision Making"],
    "pharmacist": ["Pharmaceutical Knowledge", "Patient Counseling", "Drug Interactions", "Precision", "Communication"],
    "physical therapist": ["Anatomy Knowledge", "Treatment Planning", "Patient Assessment", "Manual Therapy", "Communication"],
    # Education
    "teacher": ["Curriculum Development", "Classroom Management", "Student Assessment", "Communication", "Subject Expertise"],
    "professor": ["Research", "Teaching", "Academic Writing", "Grant Writing", "Subject Expertise"],
    "instructional designer": ["Learning Theory", "Curriculum Design", "E-learning Tools", "Assessment Design", "Research"],
    # Other fields
    "chef": ["Culinary Skills", "Food Safety", "Menu Planning", "Kitchen Management", "Creativity"],
    "architect": ["Design Software", "Building Codes", "Project Management", "3D Visualization", "Structural Knowledge"],
    "civil engineer": ["Structural Analysis", "CAD Software", "Project Management", "Construction Knowledge", "Problem Solving"],
    "mechanical engineer": ["CAD Design", "Thermodynamics", "Materials Science", "Problem Solving", "Project Management"],
    "electrical engineer": ["Circuit Design", "Programming", "Signal Processing", "Problem Solving", "Testing"],
    "lawyer": ["Legal Research", "Writing", "Critical Thinking", "Negotiation", "Case Analysis"],
    "journalist": ["Writing", "Research", "Interviewing", "Fact Checking", "Storytelling"],
    "translator": ["Language Proficiency", "Cultural Knowledge", "Writing Skills", "Research", "Attention to Detail"]
}

# Career aliases for flexible matching
CAREER_ALIASES = {
    "dev": "developer",
    "devops": "devops engineer", 
    "frontend": "frontend developer",
    "backend": "backend developer",
    "fullstack": "full stack developer",
    "full-stack": "full stack developer",
    "ml": "machine learning engineer",
    "ai": "ai engineer",
    "qa": "qa engineer",
    "tester": "qa engineer",
    "dba": "database administrator",
    "sysadmin": "system administrator",
    "netadmin": "network engineer",
    "security": "security engineer",
    "infosec": "security engineer",
    "cybersec": "cybersecurity analyst",
    "gamedev": "game developer",
    "blockchain": "blockchain developer",
    "crypto": "blockchain developer",
    "designer": "graphic designer",
    "ux": "ui/ux designer",
    "ui": "ui/ux designer",
    "pm": "product manager",
    "scrum": "scrum master",
    "marketing": "digital marketer",
    "sales": "sales manager",
    "hr": "hr manager",
    "finance": "financial analyst",
    "accounting": "accountant",
    "ops": "operations manager",
    "nurse": "nurse",
    "doctor": "doctor",
    "md": "doctor",
    "teacher": "teacher",
    "prof": "professor",
    "chef": "chef",
    "cook": "chef",
    "architect": "architect",
    "lawyer": "lawyer",
    "attorney": "lawyer",
    "journalist": "journalist",
    "reporter": "journalist",
    "translator": "translator"
}


def call_vertex_extract_skills(career: str) -> List[str]:
    """
    Try to call Vertex AI Text generation to extract skills.
    Returns a list of skill strings. If Vertex fails, return fallback.
    """
    career_key = career.strip().lower()
    
    # Check for aliases first (e.g., "devops" -> "devops engineer")
    if career_key in CAREER_ALIASES:
        career_key = CAREER_ALIASES[career_key]
    
    # Check for partial matches (e.g., "devops" in "devops engineer")
    if career_key not in FALLBACK_SKILLS:
        for full_career in FALLBACK_SKILLS.keys():
            if career_key in full_career or full_career in career_key:
                career_key = full_career
                break
    
    # Quick deterministic fallback
    if career_key in FALLBACK_SKILLS:
        return FALLBACK_SKILLS[career_key]

    if not VERTEX_AVAILABLE:
        # No Vertex library installed or import failed
        return ["Research Skill 1", "Research Skill 2", "Research Skill 3"]

    try:
        aiplatform.init(project=GCP_PROJECT, location=LOCATION)
        # text-bison@001 is a common Vertex text model alias — adjust if needed.
        model = aiplatform.TextGenerationModel.from_pretrained("text-bison@001")

        prompt = (
            f"List 5 essential skills required to become a {career}. "
            "Return only a JSON array of skill names, for example: [\"Python\", \"SQL\"]"
        )

        response = model.predict(prompt, max_output_tokens=256)

        # response may be a simple object with .text or str; try to parse JSON inside
        text = None
        if hasattr(response, 'text'):
            text = response.text
        else:
            text = str(response)

        # Try to extract a JSON array from the text
        try:
            # Clean simple leading/trailing content
            start = text.find('[')
            end = text.rfind(']')
            json_text = text[start:end+1]
            skills = json.loads(json_text)
            if isinstance(skills, list):
                return [s.strip() for s in skills if isinstance(s, str)]
        except Exception:
            pass

        # fallback: split by lines and take top 5
        lines = [line.strip('-• \n') for line in text.splitlines() if line.strip()]
        if lines:
            return [l for l in lines][:5]

    except Exception as e:
        print("Vertex error:", e)

    # final fallback
    return ["Research Skill 1", "Research Skill 2", "Research Skill 3"]



def get_youtube_links(skill: str, max_results: int = 3):
    """Return a list of video objects: {title, url, thumbnail} from YouTube Data API."""
    if not YOUTUBE_API_KEY:
        return []

    params = {
        "part": "snippet",
        "q": f"{skill} tutorial for beginners",
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY
    }
    url = "https://www.googleapis.com/youtube/v3/search"
    try:
        r = requests.get(url, params=params, timeout=8)
        r.raise_for_status()
        data = r.json()
        results = []
        for item in data.get("items", []):
            vid = item["id"].get("videoId")
            snippet = item.get("snippet", {})
            title = snippet.get("title")
            thumb = snippet.get("thumbnails", {}).get("default", {}).get("url")
            results.append({
                "title": title,
                "url": f"https://www.youtube.com/watch?v={vid}",
                "thumbnail": thumb
            })
        return results
    except Exception as e:
        print("YouTube API error:", e)
        return []


def get_google_books(skill: str, max_results: int = 3):
    """Return a list of book objects: {title, authors, description, thumbnail, infoLink} from Google Books API."""
    if not GOOGLE_BOOKS_API_KEY:
        return []

    params = {
        "q": f"{skill} programming tutorial guide",
        "maxResults": max_results,
        "key": GOOGLE_BOOKS_API_KEY
    }
    url = "https://www.googleapis.com/books/v1/volumes"
    try:
        r = requests.get(url, params=params, timeout=8)
        r.raise_for_status()
        data = r.json()
        results = []
        for item in data.get("items", []):
            volume_info = item.get("volumeInfo", {})
            title = volume_info.get("title")
            authors = volume_info.get("authors", [])
            description = volume_info.get("description", "No description available")
            thumbnail = volume_info.get("imageLinks", {}).get("thumbnail")
            info_link = volume_info.get("infoLink")
            
            # Truncate description if too long
            if len(description) > 200:
                description = description[:200] + "..."
            
            results.append({
                "title": title,
                "authors": authors,
                "description": description,
                "thumbnail": thumbnail,
                "infoLink": info_link
            })
        return results
    except Exception as e:
        print("Google Books API error:", e)
        return []


@functions_framework.http
def career_playlist(request):
    """HTTP Cloud Function entry point.
    Expects JSON: {"career": "Data Scientist", "known_skills": ["Python"]}
    Returns JSON: {career, playlist: {skill: [video_objs]}}
    """
    # Add CORS headers for local development
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return ("", 200, headers)
    
    # Handle GET requests for browser testing
    if request.method == 'GET':
        return (json.dumps({
            "message": "AI Career Playlist Builder API is running!",
            "usage": "POST with JSON: {\"career\": \"Data Scientist\", \"known_skills\": [\"Python\"]}",
            "features": ["YouTube video recommendations", "Google Books recommendations"],
            "available_careers": sorted(list(FALLBACK_SKILLS.keys())),
            "career_aliases": CAREER_ALIASES,
            "total_careers": len(FALLBACK_SKILLS),
            "status": "online"
        }), 200, headers)
    
    try:
        payload = request.get_json(silent=True) or {}
        career = payload.get("career") or payload.get("q") or "Data Scientist"
        known_skills = payload.get("known_skills", [])

        skills = call_vertex_extract_skills(career)

        # optional: compute skill gap (very basic)
        skill_gap = [s for s in skills if s.lower() not in [k.lower() for k in known_skills]]

        playlist = {}
        books = {}
        for skill in skills:
            playlist[skill] = get_youtube_links(skill)
            books[skill] = get_google_books(skill)

        response = {
            "career": career,
            "skills": skills,
            "skill_gap": skill_gap,
            "playlist": playlist,
            "books": books
        }
        return (json.dumps(response), 200, headers)

    except Exception as e:
        print("Error in function:", e)
        return (json.dumps({"error": str(e)}), 500, headers)