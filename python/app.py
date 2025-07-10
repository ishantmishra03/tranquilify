from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from deepface import DeepFace
import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Set Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_mood():
    try:
        data = request.json
        image_data = data.get('image')

        if not image_data:
            return jsonify({'success': False, 'message': 'No image data provided'}), 400

        encoded_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(encoded_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        result = DeepFace.analyze(img_path=img, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        return jsonify({'success': True, 'emotion': emotion})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/suggest-coping', methods=['POST'])
def suggest_coping():
    try:
        data = request.json
        stress_level = data.get('stress_level')
        stress_factors = data.get('stress_factors', [])
        symptoms = data.get('symptoms', [])

        if stress_level is None:
            return jsonify({'success': False, 'message': 'Missing stress level'}), 400

        prompt = f"""
You are a mental wellness AI assistant. A user reports:
- Stress level: {stress_level} / 4
- Stress factors: {', '.join(stress_factors) if stress_factors else 'None'}
- Symptoms: {', '.join(symptoms) if symptoms else 'None'}

Suggest 5 short, practical coping strategies. Return ONLY a JSON array of strings. No explanations.
"""

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-8b-8192",  
            "messages": [
                {"role": "system", "content": "You are a helpful mental wellness assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        print("Groq API response:", response.status_code)
        print(response.text)

        if response.status_code != 200:
            return jsonify({'success': False, 'message': 'Failed to get response from Groq'}), 500

        content = response.json()['choices'][0]['message']['content'].strip()

        # Ensure it's proper JSON
        strategies = json.loads(content)

        return jsonify({'success': True, 'coping_strategies': strategies})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)
