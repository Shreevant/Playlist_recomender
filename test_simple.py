import requests
import json

# Test basic functionality
print("🧪 Quick Backend Test")
print("=" * 40)

# Test 1: Server Status
try:
    response = requests.get("http://localhost:8080", timeout=5)
    if response.status_code == 200:
        print("✅ Backend server is running")
        data = response.json()
        print(f"📝 Available careers: {len(data.get('available_careers', []))}")
    else:
        print(f"❌ Server status: {response.status_code}")
except Exception as e:
    print(f"❌ Server connection failed: {e}")

# Test 2: Simple POST request
print("\n🧪 Testing Simple Request")
print("=" * 40)

test_data = {
    "career": "Data Scientist",
    "known_skills": ["Python"]
}

try:
    print("📡 Sending request for Data Scientist career...")
    response = requests.post("http://localhost:8080", json=test_data, timeout=20)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Request successful!")
        print(f"🎯 Career: {data.get('career')}")
        print(f"📚 Skills to learn: {len(data.get('skills_to_learn', []))}")
        
        # Count resources
        total_videos = 0
        total_books = 0
        total_certs = 0
        
        for skill in data.get('skills_to_learn', []):
            total_videos += len(skill.get('videos', []))
            total_books += len(skill.get('books', []))
            total_certs += len(skill.get('certifications', []))
        
        print(f"📹 Total videos: {total_videos}")
        print(f"📖 Total books: {total_books}")
        print(f"🎓 Total certifications: {total_certs}")
        
        # Check first skill details
        if data.get('skills_to_learn'):
            first_skill = data['skills_to_learn'][0]
            print(f"\n🔍 Sample skill: {first_skill.get('skill')}")
            
            if first_skill.get('videos'):
                print(f"  📹 First video: {first_skill['videos'][0].get('title')}")
            if first_skill.get('books'):
                print(f"  📚 First book: {first_skill['books'][0].get('title')}")
            if first_skill.get('certifications'):
                print(f"  🎓 First cert: {first_skill['certifications'][0].get('title')}")
    else:
        print(f"❌ Request failed: {response.status_code}")
        print(response.text)

except requests.exceptions.Timeout:
    print("⏰ Request timed out (this can happen on first request)")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n🎉 Test completed!")