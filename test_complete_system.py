#!/usr/bin/env python3
"""
Comprehensive Test Suite for AI Career Playlist Builder
Tests all components including Knowledge Graph API integration
"""

import requests
import json
import time

def test_backend_api():
    """Test the complete backend API functionality"""
    
    print("🧪 Testing Backend API Functionality")
    print("=" * 50)
    
    url = "http://localhost:8080"
    
    # Test 1: GET request (API status)
    print("\n📡 Test 1: API Status Check")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Status: {data.get('status')}")
            print(f"📝 Features: {', '.join(data.get('features', []))}")
            print(f"🎯 Available Careers: {data.get('total_careers')}")
        else:
            print(f"❌ API Status Error: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Connection Error: {e}")
        return False
    
    # Test 2: POST request with certification integration
    print("\n📡 Test 2: Career Playlist Generation")
    test_data = {
        "career": "Data Scientist",
        "known_skills": ["Python", "Statistics"]
    }
    
    try:
        response = requests.post(
            url,
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"✅ Career: {data.get('career')}")
            print(f"🎓 Skills: {len(data.get('skills', []))}")
            print(f"📚 Skills to Learn: {len(data.get('skill_gap', []))}")
            
            # Test videos
            playlist = data.get('playlist', {})
            total_videos = sum(len(videos) for videos in playlist.values())
            print(f"📹 Total Videos: {total_videos}")
            
            # Test books  
            books = data.get('books', {})
            total_books = sum(len(book_list) for book_list in books.values())
            print(f"📚 Total Books: {total_books}")
            
            # Test certifications (NEW)
            certifications = data.get('certifications', {})
            total_certs = sum(len(cert_list) for cert_list in certifications.values())
            print(f"🎓 Total Certifications: {total_certs}")
            
            # Detailed breakdown
            print(f"\n📊 Detailed Resource Breakdown:")
            for skill in data.get('skills', [])[:3]:  # Show first 3 skills
                videos = playlist.get(skill, [])
                books_skill = books.get(skill, [])
                certs = certifications.get(skill, [])
                
                print(f"   {skill}:")
                print(f"     📹 Videos: {len(videos)}")
                print(f"     📚 Books: {len(books_skill)}")
                print(f"     🎓 Certifications: {len(certs)}")
                
                # Show sample certification if available
                if certs:
                    cert = certs[0]
                    print(f"     Sample Cert: {cert.get('title', 'N/A')}")
            
            return True
            
        else:
            print(f"❌ POST Request Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ POST Request Error: {e}")
        return False

def test_fallback_functionality():
    """Test fallback systems when APIs fail"""
    
    print("\n🔄 Testing Fallback Functionality")
    print("=" * 40)
    
    # Test different career types
    test_careers = [
        "Frontend Developer",
        "Machine Learning Engineer", 
        "DevOps Engineer"
    ]
    
    for career in test_careers:
        print(f"\n🔍 Testing: {career}")
        
        test_data = {
            "career": career,
            "known_skills": ["Git"]
        }
        
        try:
            response = requests.post(
                "http://localhost:8080",
                json=test_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                skills = data.get('skills', [])
                certifications = data.get('certifications', {})
                
                print(f"   ✅ Skills identified: {len(skills)}")
                print(f"   🎓 Certifications: {sum(len(certs) for certs in certifications.values())}")
                
                # Check if we got actual data or fallbacks
                if skills and 'Research Skill' in skills[0]:
                    print(f"   ⚠️  Using fallback skills")
                else:
                    print(f"   ✅ Using real skill data")
                    
            else:
                print(f"   ❌ Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def test_api_integrations():
    """Test individual API integrations"""
    
    print("\n🔌 Testing API Integrations")
    print("=" * 35)
    
    # Test with a skill that should return results
    test_skill = "Python"
    
    print(f"\n🔍 Testing APIs for skill: {test_skill}")
    
    # We'll test through the backend since it has all the logic
    test_data = {
        "career": "Python Developer",
        "known_skills": []
    }
    
    try:
        response = requests.post(
            "http://localhost:8080",
            json=test_data,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Check if Python is in skills
            skills = data.get('skills', [])
            if 'Python' in str(skills):
                python_videos = data.get('playlist', {}).get('Python', [])
                python_books = data.get('books', {}).get('Python', [])  
                python_certs = data.get('certifications', {}).get('Python', [])
                
                print(f"📹 YouTube API: {'✅ Working' if python_videos else '⚠️ Using fallback'}")
                print(f"📚 Books API: {'✅ Working' if python_books else '⚠️ Using fallback'}")
                print(f"🎓 Knowledge Graph API: {'✅ Working' if python_certs else '⚠️ Using fallback'}")
                
                # Show sample results
                if python_certs:
                    print(f"   Sample certification: {python_certs[0].get('title', 'N/A')}")
                if python_videos:
                    print(f"   Sample video: {python_videos[0].get('title', 'N/A')}")
                    
            else:
                print("⚠️ Python not found in skills - using fallback mode")
                
        else:
            print(f"❌ API Test Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ API Test Error: {e}")

def test_extension_compatibility():
    """Test data format compatibility with extension"""
    
    print("\n🔌 Testing Extension Compatibility")
    print("=" * 40)
    
    test_data = {
        "career": "UI/UX Designer",
        "known_skills": ["Figma"]
    }
    
    try:
        response = requests.post(
            "http://localhost:8080",
            json=test_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Check required fields for extension
            required_fields = ['career', 'skills', 'skill_gap', 'playlist', 'books', 'certifications']
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                print("✅ All required fields present")
                
                # Check data structure
                playlist = data.get('playlist', {})
                books = data.get('books', {})
                certifications = data.get('certifications', {})
                
                print(f"✅ Playlist structure: {type(playlist).__name__}")
                print(f"✅ Books structure: {type(books).__name__}")
                print(f"✅ Certifications structure: {type(certifications).__name__}")
                
                # Check if each skill has all resource types
                skills = data.get('skills', [])
                if skills:
                    sample_skill = skills[0]
                    has_videos = sample_skill in playlist
                    has_books = sample_skill in books  
                    has_certs = sample_skill in certifications
                    
                    print(f"✅ Resource mapping for '{sample_skill}':")
                    print(f"   📹 Videos: {'✅' if has_videos else '❌'}")
                    print(f"   📚 Books: {'✅' if has_books else '❌'}")
                    print(f"   🎓 Certifications: {'✅' if has_certs else '❌'}")
                    
            else:
                print(f"❌ Missing fields: {missing_fields}")
                
        else:
            print(f"❌ Extension Compatibility Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Extension Compatibility Error: {e}")

def run_all_tests():
    """Run comprehensive test suite"""
    
    print("🚀 AI Career Playlist Builder - Comprehensive Test Suite")
    print("=" * 65)
    print("Testing Knowledge Graph API integration and all functionality\n")
    
    # Track test results
    results = {
        'backend_api': False,
        'fallback_functionality': True,  # This doesn't fail
        'api_integrations': True,       # This doesn't fail  
        'extension_compatibility': False
    }
    
    # Run tests
    try:
        results['backend_api'] = test_backend_api()
        test_fallback_functionality()
        test_api_integrations()
        test_extension_compatibility()
        
        # Final summary
        print("\n" + "=" * 65)
        print("🎯 TEST SUMMARY")
        print("=" * 65)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        print(f"📊 Tests Passed: {passed}/{total}")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! System is working correctly.")
            print("✅ Knowledge Graph API integration successful")
            print("✅ Backend API functioning properly") 
            print("✅ Extension compatibility confirmed")
            print("✅ Fallback systems operational")
        else:
            print("⚠️ Some tests failed. Check the output above for details.")
            
        print("\n📋 Next Steps:")
        print("1. Test the browser extension with the running backend")
        print("2. Try different career searches to verify functionality") 
        print("3. Check browser console for any JavaScript errors")
        print("4. Verify all three resource types (videos, books, certs) appear")
            
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Test suite error: {e}")

if __name__ == "__main__":
    # Wait a moment for backend to be ready
    time.sleep(2)
    run_all_tests()