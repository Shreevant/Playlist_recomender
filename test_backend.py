#!/usr/bin/env python3
"""
Test Backend API with fallback functionality
"""

import requests
import json

def test_backend_api():
    """Test the backend API to see if fallback works"""
    
    url = "http://localhost:8080"
    
    # Test data
    test_data = {
        "career": "Python Developer",
        "known_skills": ["HTML", "CSS"]
    }
    
    print("🧪 Testing Backend API with fallback functionality")
    print("=" * 60)
    
    try:
        print(f"📡 Making POST request to: {url}")
        print(f"📝 Request data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            url, 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            print("✅ SUCCESS! Backend responded correctly")
            print(f"🎯 Career: {data.get('career')}")
            print(f"🎓 Skills count: {len(data.get('skills', []))}")
            print(f"📚 Skills to learn: {len(data.get('skill_gap', []))}")
            
            # Check videos
            playlist = data.get('playlist', {})
            total_videos = sum(len(videos) for videos in playlist.values())
            print(f"📹 Total videos: {total_videos}")
            
            # Check books
            books = data.get('books', {})
            total_books = sum(len(book_list) for book_list in books.values())
            print(f"📖 Total books: {total_books}")
            
            # Show first skill's resources
            if data.get('skills'):
                first_skill = data['skills'][0]
                print(f"\n🔍 Sample resources for '{first_skill}':")
                
                skill_videos = playlist.get(first_skill, [])
                if skill_videos:
                    print(f"  📹 Videos ({len(skill_videos)}):")
                    for i, video in enumerate(skill_videos[:2], 1):
                        print(f"    {i}. {video.get('title')}")
                        print(f"       {video.get('url')}")
                
                skill_books = books.get(first_skill, [])
                if skill_books:
                    print(f"  📚 Books ({len(skill_books)}):")
                    for i, book in enumerate(skill_books[:2], 1):
                        print(f"    {i}. {book.get('title')}")
                        print(f"       {book.get('infoLink')}")
            
            return True
            
        else:
            print(f"❌ ERROR: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to backend server")
        print("💡 Make sure the backend server is running on http://localhost:8080")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_backend_api()
    
    if success:
        print("\n🎉 Backend test completed successfully!")
        print("💡 The fallback mechanism is working - you should now see learning resources!")
    else:
        print("\n❌ Backend test failed. Please check the server logs.")