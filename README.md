# Tom Yum Robot Control Center

A smart delivery robot solution for Tom Yum Thai Restaurant.

## Features

- Real-time robot monitoring
- Task queue management with priority system
- Analytics dashboard
- Charging station management
- Menu management
- Customer database
- Payment processing
- Inventory tracking

## Prerequisites

- Python 3.7+
- Node.js 14+
- npm 6+

## Installation

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Install frontend dependencies (handled automatically):
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
python run_server.py
```

This will:
1. Build the React frontend
2. Start the Flask backend server
3. Open the application in your default browser

### Manual Build and Run

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Run the backend server:
   ```bash
   python app.py
   ```

3. Open your browser to http://localhost:5000

## API Endpoints

- `GET /api/robots` - Get all robots
- `GET /api/robots/<id>` - Get specific robot
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/<id>` - Update task
- `DELETE /api/tasks/<id>` - Delete task
- `GET /api/system/status` - Get system status

## Project Structure

```
.
├── app.py              # Flask backend server
├── build_frontend.py   # Frontend build script
├── run_server.py       # Main application runner
├── requirements.txt    # Python dependencies
├── README.md           # This file
├── src/                # React frontend source
├── dist/               # Built frontend files (generated)
└── package.json        # Frontend dependencies
```

## Development

### Frontend Development

For frontend development with hot reloading:

1. Start the Flask backend:
   ```bash
   python app.py
   ```

2. In another terminal, start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:8080

### Backend Development

The Flask backend runs on port 5000 and serves:
- Static files from the `dist` directory
- API endpoints under `/api`

## Deployment

For production deployment:
1. Build the frontend: `npm run build`
2. Run the Flask server: `python app.py`
3. The application will be available at http://your-server:5000

## License

This project is licensed for internal use by Tom Yum Thai Restaurant.