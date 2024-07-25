from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, emit
import sqlite3

app = Flask(__name__, static_url_path='', static_folder='.')
socketio = SocketIO(app)

def init_db():
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY,
        timestamp TEXT,
        level TEXT,
        message TEXT
    )''')
    conn.commit()
    conn.close()

@app.route('/api/logs', methods=['GET'])
def get_logs():
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    c.execute("SELECT * FROM logs")
    logs = c.fetchall()
    conn.close()
    logs_dict = [{'timestamp': log[1], 'level': log[2], 'message': log[3]} for log in logs]
    return jsonify(logs_dict)

@socketio.on('connect')
def handle_connect():
    emit('response', {'message': 'Connected'})

def add_log_to_db(timestamp, level, message):
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    c.execute("INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)", (timestamp, level, message))
    conn.commit()
    conn.close()
    socketio.emit('new_log', {'timestamp': timestamp, 'level': level, 'message': message})

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

if __name__ == "__main__":
    init_db()
    socketio.run(app, host='0.0.0.0', port=5000)
