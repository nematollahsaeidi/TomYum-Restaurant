from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__, static_folder='dist')
CORS(app)

# In-memory data storage (in production, use a database)
robots_data = [
    {"id": 1, "name": "Robot Alpha", "status": "delivering", "battery": 85, "location": "Table 5"},
    {"id": 2, "name": "Robot Beta", "status": "idle", "battery": 92, "location": "Charging Station"},
    {"id": 3, "name": "Robot Gamma", "status": "charging", "battery": 30, "location": "Charging Station"},
    {"id": 4, "name": "Robot Delta", "status": "collecting", "battery": 67, "location": "Table 3"}
]

tasks_data = [
    {"id": 1, "type": "delivery", "priority": "high", "status": "in-progress", "table": "Table 5", "time": "2 min", "effectivePriority": 95},
    {"id": 2, "type": "collection", "priority": "medium", "status": "queued", "table": "Table 3", "time": "5 min", "effectivePriority": 75},
    {"id": 3, "type": "ordering", "priority": "medium", "status": "queued", "table": "Table 7", "time": "8 min", "effectivePriority": 70},
    {"id": 4, "type": "payment", "priority": "low", "status": "queued", "table": "Table 2", "time": "12 min", "effectivePriority": 50},
    {"id": 5, "type": "charging", "priority": "dynamic", "status": "queued", "table": "Charging Station", "time": "15 min", "effectivePriority": 40}
]

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# API Routes
@app.route('/api/robots', methods=['GET'])
def get_robots():
    return jsonify(robots_data)

@app.route('/api/robots/<int:robot_id>', methods=['GET'])
def get_robot(robot_id):
    robot = next((r for r in robots_data if r['id'] == robot_id), None)
    if robot:
        return jsonify(robot)
    return jsonify({'error': 'Robot not found'}), 404

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks_data)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    new_task = {
        'id': max([t['id'] for t in tasks_data]) + 1 if tasks_data else 1,
        'type': data.get('type', 'delivery'),
        'priority': data.get('priority', 'medium'),
        'status': 'queued',
        'table': data.get('table', 'Unknown'),
        'time': data.get('time', '5 min'),
        'effectivePriority': data.get('effectivePriority', 50)
    }
    tasks_data.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = next((t for t in tasks_data if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    task.update(data)
    return jsonify(task)

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks_data
    tasks_data = [t for t in tasks_data if t['id'] != task_id]
    return jsonify({'message': 'Task deleted successfully'})

@app.route('/api/system/status', methods=['GET'])
def system_status():
    total_robots = len(robots_data)
    active_robots = len([r for r in robots_data if r['status'] != 'idle'])
    pending_tasks = len([t for t in tasks_data if t['status'] == 'queued'])
    
    return jsonify({
        'totalRobots': total_robots,
        'activeRobots': active_robots,
        'pendingTasks': pending_tasks,
        'systemHealth': 98
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)