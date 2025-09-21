#!/usr/bin/env python3
"""
Google Knowledge Graph API Test Script
Test the Knowledge Graph API connection for certification recommendations
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

KNOWLEDGE_GRAPH_API_KEY = os.getenv("GOOGLE_KNOWLEDGE_GRAPH_API_KEY")

def test_knowledge_graph_api():
    """Test Knowledge Graph API connection and search functionality"""
    
    print("🔍 Testing Google Knowledge Graph API...")
    print(f"API Key: {KNOWLEDGE_GRAPH_API_KEY[:20]}...{KNOWLEDGE_GRAPH_API_KEY[-5:] if KNOWLEDGE_GRAPH_API_KEY else 'None'}")
    
    if not KNOWLEDGE_GRAPH_API_KEY:
        print("❌ ERROR: GOOGLE_KNOWLEDGE_GRAPH_API_KEY not found in .env file")
        return False
    
    # Test search for Python certifications
    test_skill = "Python programming"
    params = {
        "query": f"{test_skill} certification course professional",
        "key": KNOWLEDGE_GRAPH_API_KEY,
        "limit": 5,
        "indent": True
    }
    
    url = "https://kgsearch.googleapis.com/v1/entities:search"
    
    try:
        print(f"\n🌐 Making API request to: {url}")
        print(f"📝 Search query: '{test_skill} certification course professional'")
        
        response = requests.get(url, params=params, timeout=10)
        
        print(f"📊 Response status: {response.status_code}")
        print(f"📏 Response size: {len(response.content)} bytes")
        
        if response.status_code == 200:
            data = response.json()
            items = data.get("itemListElement", [])
            
            print(f"✅ SUCCESS: Found {len(items)} knowledge graph entities")
            
            if items:
                print(f"\n📊 Knowledge Graph Results:")
                
                for i, item in enumerate(items[:3], 1):
                    result = item.get("result", {})
                    name = result.get("name", "N/A")
                    description = result.get("description", "N/A")
                    score = item.get("resultScore", 0)
                    
                    print(f"\n{i}. {name}")
                    print(f"   Description: {description}")
                    print(f"   Relevance Score: {score}")
                    
                    # Check for certification-related keywords
                    is_cert_related = any(keyword in name.lower() for keyword in 
                                        ['certification', 'certificate', 'course', 'training', 'program'])
                    print(f"   Certification Related: {'Yes' if is_cert_related else 'No'}")
                    
                    detailed = result.get("detailedDescription", {})
                    if detailed:
                        article_url = detailed.get("url", "N/A")
                        print(f"   More Info: {article_url}")
            
            # Filter for certification-specific results
            cert_results = []
            for item in items:
                result = item.get("result", {})
                name = result.get("name", "")
                if any(keyword in name.lower() for keyword in 
                      ['certification', 'certificate', 'course', 'training', 'program']):
                    cert_results.append(item)
            
            print(f"\n🎓 Certification-specific results: {len(cert_results)}")
            
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
                print("   - API key not configured for Knowledge Graph API")
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

def test_certification_search():
    """Test specific certification search scenarios"""
    
    print("\n🎓 Testing Certification Search Scenarios...")
    
    test_skills = [
        "Python programming",
        "AWS cloud computing", 
        "Data Science",
        "Machine Learning"
    ]
    
    for skill in test_skills:
        print(f"\n🔍 Testing certifications for: {skill}")
        
        params = {
            "query": f"{skill} professional certification",
            "key": KNOWLEDGE_GRAPH_API_KEY,
            "limit": 3,
            "indent": True
        }
        
        try:
            response = requests.get("https://kgsearch.googleapis.com/v1/entities:search", 
                                  params=params, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                items = data.get("itemListElement", [])
                cert_count = sum(1 for item in items 
                               if any(keyword in item.get("result", {}).get("name", "").lower() 
                                     for keyword in ['certification', 'certificate', 'course']))
                print(f"   ✅ Found {len(items)} total results, {cert_count} certification-related")
            else:
                print(f"   ❌ Error {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Google Knowledge Graph API Diagnostic Tool")
    print("=" * 60)
    
    # Test basic API functionality
    success = test_knowledge_graph_api()
    
    if success:
        # Test certification-specific searches
        test_certification_search()
        
        print("\n🎉 All tests completed successfully!")
        print("💡 Knowledge Graph API is working for certification recommendations.")
    else:
        print("\n❌ Tests failed. Please check the errors above.")
    
    print("\n📋 Next steps if you're seeing issues:")
    print("1. Verify your API key in Google Cloud Console")
    print("2. Check that Knowledge Graph Search API is enabled")
    print("3. Ensure billing is enabled on your GCP project")
    print("4. Check quota limits in the APIs & Services dashboard")
    print("5. Restart your backend server after fixing any issues")