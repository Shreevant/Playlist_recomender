#!/usr/bin/env python3
"""
Simple Flask server to run the backend for testing
"""
from main import career_playlist
from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def handle_request():
    """Handle all requests and pass them to the career_playlist function"""
    return career_playlist(request)

if __name__ == '__main__':
    print("🚀 Starting AI Career Playlist Builder Backend...")
    print("🌐 Server will run on: http://localhost:8080")
    print("✅ CORS enabled for frontend communication")
    print("📡 Endpoints: GET / and POST /")
    print("=" * 50)
    app.run(host='0.0.0.0', port=8080, debug=True)