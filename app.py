from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.1:8b"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/ask-ai", methods=["POST"])
def ask_ai():
    data = request.get_json()
    situation = data.get("situation", "").strip()

    if not situation:
        return jsonify({"error": "Please describe the emergency."}), 400

    prompt = f"""
You are SafePulse, an emergency response assistant.

The user has described this situation:
{situation}

Provide calm, concise, general first-response guidance.

Rules:
- Do not diagnose the person.
- Do not claim to replace doctors or emergency professionals.
- Tell the user to contact appropriate local emergency services when the situation may be serious.
- Give practical immediate safety steps.
- Clearly mention if the person should avoid doing something.
- Keep the response easy to read during an emergency.
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        result = response.json()

        return jsonify({
            "answer": result.get("response", "No response received.")
        })

    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Cannot connect to Ollama. Make sure Ollama is running."
        }), 500

    except Exception as e:
        return jsonify({
            "error": f"Something went wrong: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(debug=True)