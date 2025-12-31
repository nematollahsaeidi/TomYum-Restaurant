import os
import subprocess
import sys
import threading
import time
import webbrowser

def run_flask_server():
    """Run the Flask backend server"""
    print("Starting Flask server...")
    try:
        subprocess.run(['python', 'app.py'], check=True)
    except subprocess.CalledProcessError:
        print("Error: Failed to start Flask server")
        return False

def build_and_serve():
    """Build frontend and serve the complete application"""
    print("Tom Yum Robot Control Center - Starting up...")
    
    # Check if frontend is built
    if not os.path.exists('dist'):
        print("Frontend build not found. Building now...")
        try:
            subprocess.run(['python', 'build_frontend.py'], check=True)
        except subprocess.CalledProcessError:
            print("Error: Failed to build frontend")
            return False
    
    # Start Flask server in a separate thread
    print("Starting backend server...")
    server_thread = threading.Thread(target=run_flask_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait a moment for server to start
    time.sleep(3)
    
    # Open browser
    print("Opening application in browser...")
    webbrowser.open('http://localhost:5000')
    
    print("\nTom Yum Robot Control Center is running!")
    print("Frontend: http://localhost:5000")
    print("Backend API: http://localhost:5000/api")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down server...")
        return True

if __name__ == '__main__':
    success = build_and_serve()
    if not success:
        sys.exit(1)