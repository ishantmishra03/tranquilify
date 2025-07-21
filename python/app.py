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
import time


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "https://tranquilify.vercel.app"
]}})


#Format : {ip_address: {route: last_timestamp}}
rate_limit = {}
RATE_LIMIT_SECONDS = 300  

def is_rate_limited(ip, route):
    now = time.time()
    user_limits = rate_limit.get(ip, {})

    last_time = user_limits.get(route)
    if last_time and now - last_time < RATE_LIMIT_SECONDS:
        return True

    # Update access time
    user_limits[route] = now
    rate_limit[ip] = user_limits
    return False

@app.route('/analyze', methods=['POST'])
def analyze_mood():
    ip = request.remote_addr
    if is_rate_limited(ip, 'analyze'):
        return jsonify({'success': False, 'message': 'You can only analyze mood once every 5 minutes.'}), 429

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
    ip = request.remote_addr
    if is_rate_limited(ip, 'suggest-coping'):
        return jsonify({'success': False, 'message': 'You can only request coping strategies once every 5 minutes.'}), 429

    try:
        data = request.json
        stress_level = data.get('stress_level')
        stress_factors = data.get('stress_factors')
        symptoms = data.get('symptoms')

        if stress_level is None or not isinstance(stress_level, int):
            return jsonify({'success': False, 'message': 'Stress level is required and must be an integer'}), 400
        if not stress_factors or not isinstance(stress_factors, list) or len(stress_factors) == 0:
            return jsonify({'success': False, 'message': 'At least one stress factor is required'}), 400
        if not symptoms or not isinstance(symptoms, list) or len(symptoms) == 0:
            return jsonify({'success': False, 'message': 'At least one symptom is required'}), 400

        prompt = f"""
You are a mental wellness AI assistant. A user reports:
- Stress level: {stress_level} / 4
- Stress factors: {', '.join(stress_factors)}
- Symptoms: {', '.join(symptoms)}

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

        if response.status_code != 200:
            return jsonify({'success': False, 'message': 'Failed to get response from Groq'}), 500

        content = response.json()['choices'][0]['message']['content'].strip()
        strategies = json.loads(content)

        if not isinstance(strategies, list):
            raise ValueError("Invalid format from Groq response")

        return jsonify({'success': True, 'coping_strategies': strategies})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/chat', methods=['POST'])
def ai_therapist_chat():
    try:
        data = request.json
        messages = data.get("messages")

        if not messages or not isinstance(messages, list):
            return jsonify({'success': False, 'message': 'Messages must be a list'}), 400

        # Prepare payload for Groq API
        payload = {
    "model": "llama3-8b-8192",
    "messages": [
        {
            "role": "system",
            "content": (
                "You are a compassionate AI therapist. Respond with empathy and encouragement. "
                "Always format your response in clean, readable **Markdown**. Use:\n"
                "- bullet points for lists\n"
                "- bold text for emphasis\n"
                "- headers where appropriate\n"
                "- line breaks between points\n\n"
                "Never include raw HTML. Markdown only."
            )
        },
        *messages  # previous messages
    ],
    "temperature": 0.7,
    "max_tokens": 500
}


        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        if response.status_code != 200:
            return jsonify({'success': False, 'message': 'Failed to get response from Groq'}), 500

        content = response.json()['choices'][0]['message']['content'].strip()

        return jsonify({'success': True, 'reply': content})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


    try:
        data = request.json
        user_message = data.get("message")

        if not user_message:
            return jsonify({'success': False, 'message': 'No user message provided'}), 400

        def generate():
            response = groq_client.chat.completions.create(
                model="llama3-70b-8192",  # You can switch to another Groq model
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a compassionate AI therapist. Respond with empathy and encouragement. "
                            "Speak clearly and kindly. Keep responses supportive and emotionally intelligent."
                        )
                    },
                    {"role": "user", "content": user_message}
                ],
                stream=True
            )

            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    token = chunk.choices[0].delta.content
                    yield f"data: {token}\n\n"

        return Response(generate(), content_type='text/event-stream')

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/self-care-plan', methods=['POST'])
def self_care_plan():
    try:
        data = request.json
        mood = data.get('mood')
        stress_level = data.get('stress_level')
        habits = data.get('habits', [])

        if not mood or stress_level is None:
            return jsonify({'success': False, 'message': 'Mood and stress level are required'}), 400

        prompt = f"""
You are an empathetic mental wellness assistant. Based on this user's state:
- Mood: {mood}
- Stress Level: {stress_level}/10
- Recent Habits: {', '.join(habits) if habits else 'None'}

Suggest a calming and practical **daily self-care plan** with 4-5 bullet points. Focus on:
- Mindfulness
- Hydration
- Physical movement
- Sleep hygiene
- Mental rest

Keep it concise and clear in **plain text**, not JSON. and dont add further 3rd party apps examples . If suggested breathing suggest tranquilify breathing exercise.
"""

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": "You are a helpful wellness coach."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 400
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)

        if response.status_code != 200:
            return jsonify({'success': False, 'message': 'Failed to get response from Groq'}), 500

        plan = response.json()['choices'][0]['message']['content'].strip()
        return jsonify({'success': True, 'plan': plan})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
