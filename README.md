# HomeBase
Taking the Stress Out of Planning Trips

## Setup

### Prerequisites
- Python 3.x (recommended: 3.8 or higher)
- Node.js (recommended: 16.x or higher)
- Google Maps API key (see [Getting an API Key](#getting-an-api-key))

### Getting an API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API and Places API
4. Create credentials (API key) from the Credentials page
5. Copy your API key for use in both frontend and backend setup

### Backend Setup
1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Google Maps API key

5. Run the server:
   ```bash
   fastapi dev main.py
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
  - Edit `.env.local` and add your Google Maps API key

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Troubleshooting
- If you see a blank map or API errors, verify your API key is correctly set in both `.env.local` files (the key should be the same for both)
- Ensure all required Google Maps APIs are enabled in your Google Cloud Console
- Check that both backend and frontend servers are running simultaneously

***Note: The Google Maps API key will be the same for both the backend and frontend.***
