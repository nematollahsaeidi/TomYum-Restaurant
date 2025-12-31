import os
import subprocess
import sys

def build_frontend():
    """Build the React frontend application"""
    print("Building React frontend...")
    
    # Check if Node.js is installed
    try:
        subprocess.run(['node', '--version'], check=True, capture_output=True)
        print("Node.js found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: Node.js is not installed. Please install Node.js to build the frontend.")
        return False
    
    # Check if npm is installed
    try:
        subprocess.run(['npm', '--version'], check=True, capture_output=True)
        print("npm found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: npm is not installed. Please install npm to build the frontend.")
        return False
    
    # Install dependencies
    print("Installing frontend dependencies...")
    try:
        subprocess.run(['npm', 'install'], check=True)
        print("Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("Error: Failed to install frontend dependencies")
        return False
    
    # Build the frontend
    print("Building frontend application...")
    try:
        subprocess.run(['npm', 'run', 'build'], check=True)
        print("Frontend built successfully")
        return True
    except subprocess.CalledProcessError:
        print("Error: Failed to build frontend application")
        return False

if __name__ == '__main__':
    success = build_frontend()
    if not success:
        sys.exit(1)