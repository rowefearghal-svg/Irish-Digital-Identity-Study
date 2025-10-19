# server.py
from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
import os

app = Flask(__name__)
FINGERPRINT_LOG = 'data/vae_pilot_fingerprints.jsonl'
# Ensure the data directory exists
if not os.path.exists('data'):
    os.makedirs('data')

@app.route('/')
def index():
    # Renders the HTML template where the JavaScript code lives
    return render_template('index.html')

@app.route('/api/submit-fingerprints', methods=['POST'])
def submit_fingerprints():
    # 1. Receive the JSON data package from the webpage
    try:
        data = request.get_json()
        if not data:
            raise ValueError("No data received.")

        # 2. Securely log each of the 5 sequential samples
        with open(FINGERPRINT_LOG, 'a') as f:
            for sample in data:
                # Add server-side timestamp for logging integrity
                sample['server_timestamp'] = datetime.now().isoformat()
                f.write(json.dumps(sample) + '\n')
        
        # 3. Return success message
        print(f"SUCCESS: Received {len(data)} sequential fingerprints.")
        return jsonify({"status": "success", "message": "5 samples recorded."}), 200

    except Exception as e:
        print(f"Error receiving data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    # Run the server on a local port
    app.run(debug=True, port=5000)