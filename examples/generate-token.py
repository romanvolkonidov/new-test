# LiveKit Token Generator (Python Backend Example)
# Install: pip install livekit

from livekit import api
import os
from datetime import timedelta

# Your LiveKit server credentials (from livekit.yaml)
LIVEKIT_API_KEY = os.getenv('LIVEKIT_API_KEY', 'your-api-key')
LIVEKIT_API_SECRET = os.getenv('LIVEKIT_API_SECRET', 'your-api-secret')

def generate_token(
    room_name: str,
    participant_identity: str,
    participant_name: str = None,
    can_publish: bool = True,
    can_subscribe: bool = True,
) -> str:
    """
    Generate a LiveKit access token for a participant
    
    Args:
        room_name: Name of the room to join
        participant_identity: Unique identifier for the participant
        participant_name: Display name for the participant (optional)
        can_publish: Whether participant can publish audio/video
        can_subscribe: Whether participant can subscribe to others' streams
    
    Returns:
        JWT token string
    """
    # Create token
    token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    
    # Set token metadata
    token.with_identity(participant_identity)
    if participant_name:
        token.with_name(participant_name)
    
    # Set room permissions
    token.with_grants(api.VideoGrants(
        room_join=True,
        room=room_name,
        can_publish=can_publish,
        can_subscribe=can_subscribe,
        can_publish_data=True,  # For text chat
    ))
    
    # Token valid for 6 hours
    token.with_ttl(timedelta(hours=6))
    
    # Generate JWT
    jwt_token = token.to_jwt()
    
    return jwt_token


# Flask API example
def create_flask_api():
    """
    Example Flask API for generating tokens
    Install: pip install flask flask-cors livekit
    """
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    
    app = Flask(__name__)
    CORS(app)  # Enable CORS for web clients
    
    @app.route('/token', methods=['POST'])
    def get_token():
        """
        POST /token
        Body: {
            "room": "room-name",
            "identity": "user-id",
            "name": "User Name" (optional)
        }
        """
        data = request.json
        
        room_name = data.get('room')
        identity = data.get('identity')
        name = data.get('name', identity)
        
        if not room_name or not identity:
            return jsonify({'error': 'room and identity are required'}), 400
        
        try:
            token = generate_token(
                room_name=room_name,
                participant_identity=identity,
                participant_name=name,
            )
            
            return jsonify({
                'token': token,
                'serverUrl': 'wss://your-app-name.fly.dev',
            })
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'healthy'})
    
    return app


# FastAPI example
def create_fastapi_api():
    """
    Example FastAPI for generating tokens
    Install: pip install fastapi uvicorn livekit
    """
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    
    app = FastAPI()
    
    # Enable CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    class TokenRequest(BaseModel):
        room: str
        identity: str
        name: str = None
    
    class TokenResponse(BaseModel):
        token: str
        serverUrl: str
    
    @app.post("/token", response_model=TokenResponse)
    async def get_token(request: TokenRequest):
        try:
            token = generate_token(
                room_name=request.room,
                participant_identity=request.identity,
                participant_name=request.name or request.identity,
            )
            
            return TokenResponse(
                token=token,
                serverUrl='wss://your-app-name.fly.dev',
            )
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/health")
    async def health():
        return {"status": "healthy"}
    
    return app


# CLI usage example
if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python generate-token.py <room-name> <user-identity> [user-name]")
        sys.exit(1)
    
    room = sys.argv[1]
    identity = sys.argv[2]
    name = sys.argv[3] if len(sys.argv) > 3 else identity
    
    token = generate_token(room, identity, name)
    print(f"\nGenerated token for {name} in room '{room}':")
    print(token)
    print("\nUse this token in your client application")


# Run Flask server:
# export LIVEKIT_API_KEY=your-key
# export LIVEKIT_API_SECRET=your-secret
# flask --app generate-token:create_flask_api run

# Run FastAPI server:
# export LIVEKIT_API_KEY=your-key
# export LIVEKIT_API_SECRET=your-secret
# uvicorn generate-token:create_fastapi_api --reload
