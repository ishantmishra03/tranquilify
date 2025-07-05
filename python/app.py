from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_mood():
    try:
        data = request.json
        image_data = data.get('image')

        if not image_data:
            return jsonify({'success': False, 'message': 'No image data provided'}), 400

        # Remove the header part: "data:image/jpeg;base64,"
        encoded_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(encoded_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        result = DeepFace.analyze(img_path=img, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        return jsonify({'success': True, 'emotion': emotion})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
