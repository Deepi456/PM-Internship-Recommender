print("Starting Flask application...")

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")

# Check for data file with better path handling
data_file_path = os.path.join('..', 'data', 'internship.csv')
print(f"Looking for data file at: {os.path.abspath(data_file_path)}")

# Debug: Check what's in the parent directory
parent_dir = '..'
if os.path.exists(parent_dir):
    print(f"Contents of parent directory: {os.listdir(parent_dir)}")
else:
    print("❌ Parent directory not accessible")

# Debug: Check data directory specifically
data_dir = os.path.join('..', 'data')
if os.path.exists(data_dir):
    print(f"✅ Data directory exists")
    print(f"Contents of data directory: {os.listdir(data_dir)}")
else:
    print("❌ Data directory not found")

if os.path.exists(data_file_path):
    print("✅ Data file found successfully")
else:
    print("❌ Data file not found")
    print("Creating sample data file...")
    
    # Create data directory if it doesn't exist
    data_dir = os.path.join('..', 'data')
    try:
        os.makedirs(data_dir, exist_ok=True)
        print(f"✅ Data directory created at: {os.path.abspath(data_dir)}")
    except Exception as e:
        print(f"❌ Error creating data directory: {e}")
    
    # Create sample CSV
    sample_data = """internship_title,company_name,location,start_date,duration,stipend
Java Development,SunbaseData,Work From Home,Immediately,6 Months,"₹ 30,000 /month"
Accounting and Finance,DAKSM & Co. LLP,Noida,Immediately,6 Months,"₹ 5,000-10,000 /month"
Sales & Digital Marketing,Bharat Natural Elements Private Limited,Bangalore,Immediately,6 Months,"₹ 5,000 /month"
Social Entrepreneurship,Hamari Pahchan NGO,Work From Home,Immediately,6 Months,Unpaid
Videography & Photography,Esquare Lifestyle,Bangalore,Immediately,6 Months,"₹ 12,000 /month"
English Curriculum Writing,Team Everest,Work From Home,Immediately,6 Months,Unpaid
Search Engine Optimization,Global Trend,Work From Home,Immediately,6 Months,"₹ 5,000 /month"
Digital Dreamweaver,Global Trend,Work From Home,Immediately,6 Months,"₹ 7,000 /month"
Graphic Design,Expedify,Work From Home,Immediately,6 Months,"₹ 10,000-15,000 /month"
Campus Ambassador,Internshala,Work From Home,Not specified,6 Months,"₹ 2000"
Customer Support,ClearTax,Bangalore,Immediately,6 Months,"₹ 30,000 /month"
Web Development,TechCorp,Mumbai,Immediately,6 Months,"₹ 25,000 /month"
Python Development,DevCorp,Work From Home,Immediately,6 Months,"₹ 35,000 /month"
UI/UX Design,DesignStudio,Pune,Immediately,6 Months,"₹ 20,000 /month"
Content Writing,MediaHouse,Work From Home,Immediately,6 Months,"₹ 15,000 /month"
"""
    
    try:
        with open(data_file_path, 'w', encoding='utf-8') as f:
            f.write(sample_data)
        print("✅ Sample data file created successfully")
    except Exception as e:
        print(f"❌ Error creating sample data file: {e}")
        # Try alternative path if the relative path fails
        alternative_path = 'internship.csv'
        try:
            with open(alternative_path, 'w', encoding='utf-8') as f:
                f.write(sample_data)
            data_file_path = alternative_path
            print(f"✅ Created data file in current directory: {alternative_path}")
        except Exception as e2:
            print(f"❌ Failed to create data file anywhere: {e2}")
            sys.exit(1)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

print("Initializing data processor...")

try:
    from data_processor import DataProcessor
    data_processor = DataProcessor(data_file_path)
    print("✅ Data processor initialized successfully")
except Exception as e:
    print(f"❌ Error initializing data processor: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Initializing recommendation engine...")

try:
    from recommendation_engine import RecommendationEngine
    recommendation_engine = RecommendationEngine(data_processor)
    print("✅ Recommendation system initialized successfully")
except Exception as e:
    print(f"❌ Error initializing recommendation engine: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Helper function to get current timestamp
def get_current_timestamp():
    return datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

# Routes
@app.route('/')
def home():
    return jsonify({
        'message': 'Internship Recommendation Engine API',
        'status': 'running',
        'version': '1.0.0',
        'timestamp': get_current_timestamp(),
        'user': 'shreyasraut0707',
        'endpoints': {
            'health': '/health',
            'recommend': '/recommend',
            'test': '/test',
            'api_recommendations': '/api/recommendations'  # Added new endpoint
        }
    })

@app.route('/health')
def health():
    try:
        # More robust health check
        if data_processor and hasattr(data_processor, 'df') and data_processor.df is not None:
            data_count = len(data_processor.df)
            status = 'healthy'
        else:
            data_count = 0
            status = 'unhealthy - no data'
            
        response = {
            'status': status,
            'data_loaded': data_count,
            'timestamp': get_current_timestamp(),
            'server': 'Flask Development Server',
            'user': 'shreyasraut0707',
            'endpoints_available': ['/', '/health', '/test', '/recommend', '/api/recommendations']
        }
        
        print(f"Health check requested - Status: {status}, Data count: {data_count}")
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Error in health endpoint: {e}")
        error_response = {
            'status': 'error',
            'error_message': str(e),
            'timestamp': get_current_timestamp(),
            'user': 'shreyasraut0707'
        }
        return jsonify(error_response), 500

@app.route('/recommend', methods=['POST'])
def get_recommendations_old():
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        print(f"Received recommendation request: {data}")
        
        # Validate required fields
        required_fields = ['name', 'education', 'skills', 'location_preference', 'min_stipend']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}',
                    'timestamp': get_current_timestamp()
                }), 400
        
        # Prepare candidate profile
        candidate_profile = {
            'name': data['name'],
            'education': data['education'],
            'skills': data['skills'] if isinstance(data['skills'], list) else [data['skills']],
            'location_preference': data['location_preference'],
            'min_stipend': float(data.get('min_stipend', 0))
        }
        
        print(f"Candidate profile: {candidate_profile}")
        
        # Get recommendations
        recommendations = recommendation_engine.get_recommendations(candidate_profile)
        
        print(f"Generated {len(recommendations)} recommendations")
        
        return jsonify({
            'success': True,
            'candidate': candidate_profile,
            'recommendations': recommendations,
            'total_recommendations': len(recommendations),
            'timestamp': get_current_timestamp(),
            'processed_by': 'shreyasraut0707'
        })
        
    except Exception as e:
        print(f"Error in /recommend endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e),
            'timestamp': get_current_timestamp()
        }), 500

# NEW ENDPOINT: /api/recommendations - This is what your frontend is calling!
@app.route('/api/recommendations', methods=['POST', 'OPTIONS'])
def get_recommendations():
    """New API endpoint that matches your frontend call"""
    
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        print("📥 CORS preflight request received")
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        print(f"\n📥 API recommendation request received at {get_current_timestamp()}")
        
        # Check if system is initialized
        if not data_processor or not recommendation_engine:
            print("❌ System not initialized")
            return jsonify({
                'success': False,
                'message': 'System not initialized properly',
                'timestamp': get_current_timestamp()
            }), 500
        
        # Get request data
        data = request.get_json()
        print(f"📊 Request data: {data}")
        
        if not data:
            print("❌ No data provided")
            return jsonify({
                'success': False,
                'message': 'No data provided',
                'timestamp': get_current_timestamp()
            }), 400
        
        # Validate required fields - Updated for your frontend
        required_fields = ['education', 'skills', 'location_preference']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            print(f"❌ Missing fields: {missing_fields}")
            return jsonify({
                'success': False,
                'message': f'Missing required fields: {", ".join(missing_fields)}',
                'timestamp': get_current_timestamp()
            }), 400
        
        # Validate skills
        if not isinstance(data['skills'], list) or len(data['skills']) == 0:
            print("❌ No skills provided")
            return jsonify({
                'success': False,
                'message': 'At least one skill must be selected',
                'timestamp': get_current_timestamp()
            }), 400
        
        # Prepare user profile for your recommendation engine
        user_profile = {
            'education': data['education'],
            'skills': data['skills'],
            'location_preference': data['location_preference'],
            'min_stipend': data.get('min_stipend', 0)
        }
        
        print(f"🎯 User profile: {user_profile}")
        
        # Get recommendations using your existing engine
        print("🔍 Getting recommendations...")
        recommendations = recommendation_engine.get_recommendations(user_profile)
        
        print(f"✅ Generated {len(recommendations)} recommendations")
        
        # Log some recommendation details
        for i, rec in enumerate(recommendations[:3]):
            title = rec.get('title', rec.get('internship_title', 'Unknown'))
            company = rec.get('company', rec.get('company_name', 'Unknown'))
            print(f"  {i+1}. {title} at {company}")
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'count': len(recommendations),
            'user_profile': user_profile,
            'timestamp': get_current_timestamp(),
            'message': f'Found {len(recommendations)} matching internships',
            'processed_by': 'shreyasraut0707'
        })
        
    except Exception as e:
        error_msg = f"Error getting recommendations: {str(e)}"
        print(f"❌ {error_msg}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'message': error_msg,
            'timestamp': get_current_timestamp()
        }), 500

# Test route to check if everything is working
@app.route('/test')
def test():
    try:
        test_data = {
            'message': 'Test endpoint working successfully!',
            'data_processor_status': 'OK' if data_processor else 'ERROR',
            'recommendation_engine_status': 'OK' if recommendation_engine else 'ERROR',
            'timestamp': get_current_timestamp(),
            'user': 'shreyasraut0707',
            'data_loaded': len(data_processor.get_all_internships()),
            'python_version': sys.version,
            'working_directory': os.getcwd(),
            'available_endpoints': ['/', '/health', '/test', '/recommend', '/api/recommendations']
        }
        
        print(f"Test endpoint accessed - All systems: {'OK' if data_processor and recommendation_engine else 'ERROR'}")
        return jsonify(test_data)
        
    except Exception as e:
        print(f"❌ Error in test endpoint: {e}")
        return jsonify({
            'message': 'Test endpoint error',
            'error': str(e),
            'timestamp': get_current_timestamp()
        }), 500

if __name__ == '__main__':
    print("\n🚀 Starting Flask development server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("📍 Health check: http://localhost:5000/health")
    print("📍 API documentation: http://localhost:5000")
    print("📍 Test endpoint: http://localhost:5000/test")
    print("📍 Recommendations API: http://localhost:5000/api/recommendations")
    print(f"📍 User: shreyasraut0707")
    print(f"📍 Date: {get_current_timestamp()}")
    print("\n" + "="*50)
    
    try:
        if __name__ == "__main__":
           app.run(host="0.0.0.0", port=5000)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()