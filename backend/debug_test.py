print("=== DEBUGGING TEST ===")

import os
import sys

print(f"Current directory: {os.getcwd()}")
print(f"Python version: {sys.version}")

# Check both possible CSV names
csv_path1 = os.path.join('..', 'data', 'internship.csv')
csv_path2 = os.path.join('..', 'data', 'internships.csv')
print(f"Looking for CSV at: {os.path.abspath(csv_path1)}")
print(f"CSV file exists (internship.csv): {os.path.exists(csv_path1)}")
print(f"CSV file exists (internships.csv): {os.path.exists(csv_path2)}")

# List files in data directory
data_dir = os.path.join('..', 'data')
if os.path.exists(data_dir):
    print(f"Files in data directory: {os.listdir(data_dir)}")
else:
    print("Data directory doesn't exist")

# Test imports
print("\n=== Testing Imports ===")

try:
    from flask import Flask
    print("✅ Flask imported successfully")
except Exception as e:
    print(f"❌ Flask import error: {e}")

try:
    from flask_cors import CORS
    print("✅ Flask-CORS imported successfully")
except Exception as e:
    print(f"❌ Flask-CORS import error: {e}")

try:
    import pandas as pd
    print(f"✅ Pandas imported successfully (version: {pd.__version__})")
except Exception as e:
    print(f"❌ Pandas import error: {e}")

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    print("✅ Scikit-learn imported successfully")
except Exception as e:
    print(f"❌ Scikit-learn import error: {e}")

try:
    from data_processor import DataProcessor
    print("✅ DataProcessor imported successfully")
except Exception as e:
    print(f"❌ DataProcessor import error: {e}")

try:
    from recommendation_engine import RecommendationEngine
    print("✅ RecommendationEngine imported successfully")
except Exception as e:
    print(f"❌ RecommendationEngine import error: {e}")

print("\n=== Test Complete ===")