import pandas as pd
import numpy as np
import re
from typing import List, Dict, Any, Optional

class DataProcessor:
    def __init__(self, csv_file_path: str):
        """
        Enhanced data processor for internship recommendation system
        Supports your exact CSV structure: internship_title,company_name,location,start_date,duration,stipend
        """
        self.csv_file_path = csv_file_path
        self.df = None
        self.processed_data = None
        self.load_data()
        
    def load_data(self) -> None:
        """Load and initially process the CSV data"""
        try:
            print(f"📊 Loading data from: {self.csv_file_path}")
            self.df = pd.read_csv(self.csv_file_path)
            print(f"✅ Loaded {len(self.df)} internships successfully!")
            
            # Display column information
            print(f"📋 Columns found: {list(self.df.columns)}")
            
            # Process the data
            self.processed_data = self._process_raw_data()
            print(f"✅ Data processing completed successfully!")
            
        except FileNotFoundError:
            print(f"❌ Error: Could not find file {self.csv_file_path}")
            raise
        except Exception as e:
            print(f"❌ Error loading data: {str(e)}")
            raise
    
    def _process_raw_data(self) -> List[Dict[str, Any]]:
        """Process raw CSV data into structured format"""
        processed_internships = []
        
        for _, row in self.df.iterrows():
            try:
                internship = {
                    'id': len(processed_internships) + 1,
                    'title': str(row['internship_title']).strip(),
                    'company': str(row['company_name']).strip(),
                    'location': str(row['location']).strip(),
                    'start_date': str(row['start_date']).strip(),
                    'duration': str(row['duration']).strip(),
                    'raw_stipend': str(row['stipend']).strip(),
                    'stipend_amount': self._extract_stipend_amount(str(row['stipend'])),
                    'is_paid': self._is_paid_internship(str(row['stipend'])),
                    'skills': self._extract_skills_from_title(str(row['internship_title'])),
                    'domain': self._categorize_domain(str(row['internship_title'])),
                    'work_mode': self._determine_work_mode(str(row['location'])),
                    'duration_months': self._extract_duration_months(str(row['duration']))
                }
                processed_internships.append(internship)
                
            except Exception as e:
                print(f"⚠️ Warning: Error processing row {len(processed_internships) + 1}: {str(e)}")
                continue
        
        return processed_internships
    
    def _extract_stipend_amount(self, stipend_str: str) -> int:
        """Extract numeric stipend amount from various formats"""
        try:
            # Handle "Unpaid" cases
            if stipend_str.lower() in ['unpaid', 'nan', 'not specified', '']:
                return 0
            
            # Handle Performance Based
            if 'performance' in stipend_str.lower():
                return 5000  # Default for performance based
            
            # Extract numbers from string
            numbers = re.findall(r'[\d,]+', stipend_str.replace(',', ''))
            if numbers:
                # Take the first number (or average if range)
                if '-' in stipend_str and len(numbers) >= 2:
                    # Range format like "₹ 5,000-10,000"
                    return int((int(numbers[0]) + int(numbers[1])) / 2)
                else:
                    # Single amount
                    return int(numbers[0])
            
            return 0
            
        except Exception:
            return 0
    
    def _is_paid_internship(self, stipend_str: str) -> bool:
        """Determine if internship is paid"""
        return not (stipend_str.lower() in ['unpaid', 'nan', 'not specified', ''] or 
                   self._extract_stipend_amount(stipend_str) == 0)
    
    def _extract_skills_from_title(self, title: str) -> List[str]:
        """Extract relevant skills from internship title"""
        title_lower = title.lower()
        skills = []
        
        # Programming languages
        programming_skills = {
            'python': 'Python', 'java': 'Java', 'javascript': 'JavaScript', 
            'react': 'React.js', 'angular': 'Angular', 'node': 'Node.js',
            'flutter': 'Flutter', 'android': 'Android', 'ios': 'iOS',
            'php': 'PHP', 'ruby': 'Ruby', 'go': 'Go', 'swift': 'Swift'
        }
        
        # Technical skills
        technical_skills = {
            'machine learning': 'Machine Learning', 'ai': 'Artificial Intelligence',
            'data science': 'Data Science', 'analytics': 'Data Analytics',
            'blockchain': 'Blockchain', 'cybersecurity': 'Cybersecurity',
            'devops': 'DevOps', 'cloud': 'Cloud Computing', 'aws': 'AWS',
            'database': 'Database Management', 'sql': 'SQL'
        }
        
        # Design skills
        design_skills = {
            'ui/ux': 'UI/UX Design', 'graphic design': 'Graphic Design',
            'web design': 'Web Design', 'photoshop': 'Photoshop',
            'figma': 'Figma', 'sketch': 'Sketch'
        }
        
        # Business skills
        business_skills = {
            'marketing': 'Digital Marketing', 'seo': 'SEO', 'content': 'Content Writing',
            'sales': 'Sales', 'business': 'Business Development',
            'finance': 'Finance', 'accounting': 'Accounting', 'hr': 'Human Resources'
        }
        
        # Check all skill categories
        all_skills = {**programming_skills, **technical_skills, **design_skills, **business_skills}
        
        for keyword, skill in all_skills.items():
            if keyword in title_lower:
                skills.append(skill)
        
        # Add generic skill based on title if no specific skills found
        if not skills:
            if any(word in title_lower for word in ['development', 'developer', 'programming']):
                skills.append('Programming')
            elif any(word in title_lower for word in ['design', 'creative']):
                skills.append('Design')
            elif any(word in title_lower for word in ['marketing', 'sales']):
                skills.append('Marketing')
            elif any(word in title_lower for word in ['content', 'writing']):
                skills.append('Content Writing')
            else:
                skills.append('General')
        
        return skills
    
    def _categorize_domain(self, title: str) -> str:
        """Categorize internship into domain"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['software', 'development', 'programming', 'coding', 'tech']):
            return 'Technology'
        elif any(word in title_lower for word in ['design', 'ui', 'ux', 'graphic', 'creative']):
            return 'Design'
        elif any(word in title_lower for word in ['marketing', 'digital', 'social media', 'seo']):
            return 'Marketing'
        elif any(word in title_lower for word in ['finance', 'accounting', 'investment', 'banking']):
            return 'Finance'
        elif any(word in title_lower for word in ['hr', 'human resources', 'recruitment']):
            return 'Human Resources'
        elif any(word in title_lower for word in ['content', 'writing', 'journalism']):
            return 'Content & Media'
        elif any(word in title_lower for word in ['sales', 'business development']):
            return 'Sales'
        elif any(word in title_lower for word in ['data', 'analytics', 'research']):
            return 'Data & Analytics'
        else:
            return 'General'
    
    def _determine_work_mode(self, location: str) -> str:
        """Determine work mode from location"""
        location_lower = location.lower()
        if 'work from home' in location_lower or 'remote' in location_lower:
            return 'Remote'
        else:
            return 'On-site'
    
    def _extract_duration_months(self, duration: str) -> int:
        """Extract duration in months"""
        try:
            duration_lower = duration.lower()
            if 'month' in duration_lower:
                numbers = re.findall(r'\d+', duration)
                if numbers:
                    return int(numbers[0])
            elif 'week' in duration_lower:
                numbers = re.findall(r'\d+', duration)
                if numbers:
                    return max(1, int(numbers[0]) // 4)  # Convert weeks to months
            return 6  # Default 6 months
        except:
            return 6
    
    def get_all_internships(self) -> List[Dict[str, Any]]:
        """Get all processed internships"""
        return self.processed_data if self.processed_data else []
    
    def get_internships_by_location(self, location: str) -> List[Dict[str, Any]]:
        """Filter internships by location"""
        if not self.processed_data:
            return []
        
        if location.lower() == 'work from home':
            return [internship for internship in self.processed_data 
                   if internship['work_mode'] == 'Remote']
        else:
            return [internship for internship in self.processed_data 
                   if location.lower() in internship['location'].lower()]
    
    def get_internships_by_stipend(self, min_stipend: int) -> List[Dict[str, Any]]:
        """Filter internships by minimum stipend"""
        if not self.processed_data:
            return []
        
        return [internship for internship in self.processed_data 
               if internship['stipend_amount'] >= min_stipend]
    
    def get_internships_by_domain(self, domain: str) -> List[Dict[str, Any]]:
        """Filter internships by domain"""
        if not self.processed_data:
            return []
        
        return [internship for internship in self.processed_data 
               if internship['domain'].lower() == domain.lower()]
    
    def get_internship_by_id(self, internship_id: int) -> Optional[Dict[str, Any]]:
        """Get specific internship by ID"""
        if not self.processed_data:
            return None
        
        for internship in self.processed_data:
            if internship['id'] == internship_id:
                return internship
        return None
    
    def get_stats(self) -> Dict[str, Any]:
        """Get dataset statistics"""
        if not self.processed_data:
            return {}
        
        total_internships = len(self.processed_data)
        paid_internships = len([i for i in self.processed_data if i['is_paid']])
        remote_internships = len([i for i in self.processed_data if i['work_mode'] == 'Remote'])
        
        domains = {}
        locations = {}
        companies = {}
        
        for internship in self.processed_data:
            # Domain statistics
            domain = internship['domain']
            domains[domain] = domains.get(domain, 0) + 1
            
            # Location statistics
            location = internship['location']
            locations[location] = locations.get(location, 0) + 1
            
            # Company statistics
            company = internship['company']
            companies[company] = companies.get(company, 0) + 1
        
        return {
            'total_internships': total_internships,
            'paid_internships': paid_internships,
            'unpaid_internships': total_internships - paid_internships,
            'remote_internships': remote_internships,
            'onsite_internships': total_internships - remote_internships,
            'domains': domains,
            'top_locations': dict(sorted(locations.items(), key=lambda x: x[1], reverse=True)[:10]),
            'top_companies': dict(sorted(companies.items(), key=lambda x: x[1], reverse=True)[:10]),
            'average_stipend': np.mean([i['stipend_amount'] for i in self.processed_data if i['is_paid']]) if paid_internships > 0 else 0
        }

# Test the data processor
if __name__ == "__main__":
    processor = DataProcessor("../data/internship.csv")
    stats = processor.get_stats()
    print("\n📊 Dataset Statistics:")
    for key, value in stats.items():
        print(f"{key}: {value}")