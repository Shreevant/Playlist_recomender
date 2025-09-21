#!/usr/bin/env python3
"""
YouTube API Test Script
Test the YouTube Data API v3 connection and quota
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def test_youtube_api():
    """Test YouTube API connection and search functionality"""
    
    print("🔍 Testing YouTube Data API v3...")
    print(f"API Key: {YOUTUBE_API_KEY[:20]}...{YOUTUBE_API_KEY[-5:] if YOUTUBE_API_KEY else 'None'}")
    
    if not YOUTUBE_API_KEY:
        print("❌ ERROR: YOUTUBE_API_KEY not found in .env file")
        return False
    
    # Test simple search
    test_query = "Python programming tutorial"
    params = {
        "part": "snippet",
        "q": test_query,
        "type": "video",
        "maxResults": 3,
        "key": YOUTUBE_API_KEY
    }
    
    url = "https://www.googleapis.com/youtube/v3/search"
    
    try:
        print(f"\n🌐 Making API request to: {url}")
        print(f"📝 Search query: '{test_query}'")
        
        response = requests.get(url, params=params, timeout=10)
        
        print(f"📊 Response status: {response.status_code}")
        print(f"📏 Response size: {len(response.content)} bytes")
        
        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            
            print(f"✅ SUCCESS: Found {len(items)} videos")
            
            if items:
                print("\n📹 First video result:")
                first_video = items[0]
                snippet = first_video.get("snippet", {})
                video_id = first_video.get("id", {}).get("videoId")
                
                print(f"   Title: {snippet.get('title')}")
                print(f"   Channel: {snippet.get('channelTitle')}")
                print(f"   URL: https://www.youtube.com/watch?v={video_id}")
                print(f"   Thumbnail: {snippet.get('thumbnails', {}).get('default', {}).get('url')}")
            
            # Check quota usage
            if 'quotaUser' in response.headers:
                print(f"\n📈 Quota info: {response.headers.get('quotaUser')}")
            
            return True
            
        elif response.status_code == 403:
            error_data = response.json()
            error_message = error_data.get("error", {}).get("message", "Unknown error")
            
            print(f"❌ ERROR 403 - Forbidden: {error_message}")
            
            if "quota" in error_message.lower():
                print("💡 This looks like a quota issue. Possible causes:")
                print("   - Daily quota exceeded")
                print("   - API not enabled for your project")
                print("   - Billing not enabled")
            elif "api key" in error_message.lower():
                print("💡 This looks like an API key issue. Possible causes:")
                print("   - Invalid API key")
                print("   - API key not configured for YouTube Data API")
                print("   - IP/domain restrictions on the API key")
            
            return False
            
        elif response.status_code == 400:
            error_data = response.json()
            error_message = error_data.get("error", {}).get("message", "Unknown error")
            
            print(f"❌ ERROR 400 - Bad Request: {error_message}")
            print("💡 Check your request parameters")
            
            return False
            
        else:
            print(f"❌ ERROR {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ ERROR: Request timed out")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Connection failed")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_api_key_validity():
    """Test if the API key is valid by making a simple quota check"""
    
    print("\n🔑 Testing API key validity...")
    
    # Test with a simple quota request
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": "test",
        "type": "video",
        "maxResults": 1,
        "key": YOUTUBE_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            print("✅ API key is valid and working")
            return True
        elif response.status_code == 403:
            error_data = response.json()
            print(f"❌ API key issue: {error_data.get('error', {}).get('message')}")
            return False
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 YouTube API Diagnostic Tool")
    print("=" * 50)
    
    # Test API key validity first
    if test_api_key_validity():
        # Run full test
        success = test_youtube_api()
        
        if success:
            print("\n🎉 All tests passed! YouTube API is working correctly.")
        else:
            print("\n❌ Tests failed. Please check the errors above.")
    
    print("\n📋 Next steps if you're seeing issues:")
    print("1. Verify your API key in Google Cloud Console")
    print("2. Check that YouTube Data API v3 is enabled")
    print("3. Ensure billing is enabled on your GCP project")
    print("4. Check quota limits in the APIs & Services dashboard")
    print("5. Restart your backend server after fixing any issues")