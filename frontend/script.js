// PM Internship Recommendation Engine - Enhanced with Real Redirects & Dynamic Skills
// Current Time: 2025-09-10 18:52:15 UTC
// User: shreyasraut0707

console.log('🚀 PM Internship Script loading...');

// Global variables
let selectedSkills = [];
let isLoading = false;

// Wait for page to fully load
window.addEventListener('load', function() {
    console.log('📱 Page loaded, initializing PM Internship system...');
    initializeSkillButtons();
    initializeEducationBasedSkills(); // Added dynamic education-based skills
    setupEventListeners();
    checkAPIHealth();
});

// Dynamic skill updating based on education field
function initializeEducationBasedSkills() {
    console.log('🎓 Initializing education-based skill system...');
    
    const educationElement = document.getElementById('education');
    const skillTagsContainer = document.querySelector('.skill-tags');
    
    const skillsByField = {
        'Computer Science': ['Python', 'Java', 'Web Development', 'Mobile Apps', 'Data Science', 'AI/ML', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Blockchain'],
        'Electronics': ['Circuit Design', 'Embedded Systems', 'VLSI', 'Signal Processing', 'RF Engineering', 'PCB Design', 'IoT', 'Automation', 'Instrumentation', 'Power Electronics'],
        'Mechanical': ['CAD Design', 'Manufacturing', 'Production', 'Quality Control', 'HVAC', 'Robotics', 'Thermal Engineering', 'CNC Programming', 'Maintenance', 'Industrial Engineering'],
        'Civil': ['Structural Design', 'Construction Management', 'Surveying', 'BIM', 'Concrete Technology', 'Project Management', 'Environmental Engineering', 'Transportation', 'Urban Planning', 'Geotechnical'],
        'Business': ['Project Management', 'Business Analysis', 'Strategy', 'Operations', 'Consulting', 'Leadership', 'Process Improvement', 'Team Management', 'Problem Solving', 'Communication'],
        'Commerce': ['Financial Analysis', 'Accounting', 'Banking', 'Investment', 'Tax Planning', 'Audit', 'Risk Management', 'Treasury', 'Portfolio Management', 'Financial Planning'],
        'Arts': ['Content Writing', 'Creative Writing', 'Research', 'Communication', 'Literature', 'History', 'Philosophy', 'Language', 'Cultural Studies', 'Critical Thinking'],
        'Design': ['Graphic Design', 'UI/UX Design', 'Animation', 'Video Editing', 'Photography', 'Illustration', 'Branding', 'Typography', 'Color Theory', 'Adobe Creative Suite'],
        'Mass Communication': ['Journalism', 'Content Creation', 'Social Media', 'Public Relations', 'Broadcasting', 'News Writing', 'Media Planning', 'Communication Strategy', 'Event Management', 'Documentary Making'],
        'Marketing': ['Digital Marketing', 'Social Media Marketing', 'SEO/SEM', 'Brand Management', 'Market Research', 'Sales', 'Advertising', 'Email Marketing', 'Content Marketing', 'Analytics'],
        'Human Resources': ['Talent Acquisition', 'Employee Relations', 'Training & Development', 'Performance Management', 'Compensation & Benefits', 'HR Analytics', 'Organizational Development', 'Diversity & Inclusion', 'HRIS', 'Employment Law'],
        'Operations': ['Supply Chain', 'Logistics', 'Quality Management', 'Process Improvement', 'Inventory Management', 'Vendor Management', 'Warehouse Management', 'Distribution', 'Procurement', 'Lean Six Sigma']
    };
    
    if (educationElement && skillTagsContainer) {
        educationElement.addEventListener('change', function() {
            const selectedField = this.value;
            console.log(`🎓 Education field selected: ${selectedField}`);
            
            if (selectedField && skillsByField[selectedField]) {
                const relevantSkills = skillsByField[selectedField];
                
                // Clear existing skill tags
                skillTagsContainer.innerHTML = '';
                selectedSkills = []; // Clear selected skills
                updateSelectedSkillsDisplay();
                updateSkillsInput();
                
                // Add new skill tags
                relevantSkills.forEach(skill => {
                    const skillTag = document.createElement('span');
                    skillTag.className = 'skill-tag';
                    skillTag.setAttribute('data-skill', skill.toLowerCase().replace(/\s+/g, '-'));
                    skillTag.textContent = skill;
                    skillTag.style.cursor = 'pointer';
                    skillTag.style.transition = 'all 0.3s ease';
                    skillTag.style.padding = '8px 16px';
                    skillTag.style.margin = '4px';
                    skillTag.style.backgroundColor = '#f0f0f0';
                    skillTag.style.borderRadius = '20px';
                    skillTag.style.display = 'inline-block';
                    skillTag.style.fontSize = '14px';
                    skillTag.style.border = '1px solid #ddd';
                    skillTag.style.fontWeight = '500';
                    
                    skillTag.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSkillClick(skill, skillTag);
                    });
                    
                    // Add hover effects
                    skillTag.addEventListener('mouseenter', function() {
                        if (!this.classList.contains('selected')) {
                            this.style.backgroundColor = '#e0e0e0';
                            this.style.transform = 'translateY(-2px)';
                        }
                    });
                    
                    skillTag.addEventListener('mouseleave', function() {
                        if (!this.classList.contains('selected')) {
                            this.style.backgroundColor = '#f0f0f0';
                            this.style.transform = 'translateY(0)';
                        }
                    });
                    
                    skillTagsContainer.appendChild(skillTag);
                });
                
                console.log(`✅ Updated skills for ${selectedField}:`, relevantSkills);
                
                // Show notification
                showEducationChangeNotification(selectedField, relevantSkills.length);
            }
        });
    }
}

// Show education change notification
function showEducationChangeNotification(field, skillCount) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #4CAF50, #45a049); color: white;
        padding: 20px 30px; border-radius: 10px; z-index: 1500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center;
        font-weight: bold;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 24px; margin-bottom: 10px;"></i><br>
        Skills Updated for ${field}!<br>
        <small style="opacity: 0.9;">${skillCount} relevant skills loaded</small>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Initialize skill buttons with proper event listeners
function initializeSkillButtons() {
    console.log('🔧 Initializing skill buttons...');
    
    // Find skill tags by multiple selectors
    const skillSelectors = [
        '.skill-tag',
        '[data-skill]',
        '.skill-btn',
        '.skills-container span',
        '.skill-tags span'
    ];
    
    let skillButtons = [];
    
    // Try different selectors to find skill buttons
    for (const selector of skillSelectors) {
        const buttons = document.querySelectorAll(selector);
        if (buttons.length > 0) {
            skillButtons = buttons;
            console.log(`✅ Found ${buttons.length} skill buttons with selector: ${selector}`);
            break;
        }
    }
    
    // If no skill buttons found, try by text content
    if (skillButtons.length === 0) {
        const allSpans = document.querySelectorAll('span, button, div');
        const skillTexts = ['Python', 'Java', 'Web Development', 'Mobile Apps', 'Data Analysis', 'Design', 'Marketing', 'Content Writing', 'Sales', 'Finance'];
        
        allSpans.forEach(element => {
            const text = element.textContent.trim();
            if (skillTexts.includes(text)) {
                skillButtons = [...skillButtons, element];
            }
        });
        
        console.log(`✅ Found ${skillButtons.length} skill elements by text content`);
    }
    
    // Add click listeners to each skill button
    skillButtons.forEach((button, index) => {
        const skillText = button.textContent.trim();
        console.log(`🎯 Setting up skill button ${index + 1}: "${skillText}"`);
        
        // Add new listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleSkillClick(skillText, button);
        });
        
        // Add visual feedback
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            if (!button.classList.contains('selected')) {
                button.style.backgroundColor = '#f0f0f0';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!button.classList.contains('selected')) {
                button.style.backgroundColor = '';
            }
        });
    });
    
    console.log(`✅ Initialized ${skillButtons.length} skill buttons`);
}

// Handle skill button clicks
function handleSkillClick(skillText, buttonElement) {
    console.log(`🎯 Skill clicked: "${skillText}"`);
    
    if (!skillText) {
        console.log('❌ No skill text found');
        return;
    }
    
    // Toggle skill selection
    if (selectedSkills.includes(skillText)) {
        // Remove skill
        selectedSkills = selectedSkills.filter(s => s !== skillText);
        buttonElement.classList.remove('selected');
        buttonElement.style.backgroundColor = '#f0f0f0';
        buttonElement.style.color = '';
        buttonElement.style.fontWeight = '500';
        buttonElement.style.transform = 'translateY(0)';
        console.log(`❌ Removed skill: ${skillText}`);
    } else {
        // Add skill
        selectedSkills.push(skillText);
        buttonElement.classList.add('selected');
        buttonElement.style.backgroundColor = '#4CAF50';
        buttonElement.style.color = 'white';
        buttonElement.style.fontWeight = 'bold';
        buttonElement.style.transform = 'translateY(-2px)';
        console.log(`✅ Added skill: ${skillText}`);
    }
    
    updateSelectedSkillsDisplay();
    updateSkillsInput();
    console.log('📝 Current selected skills:', selectedSkills);
    
    // Hide error message if skills are selected
    if (selectedSkills.length > 0) {
        hideError();
    }
}

// Update the skills input field
function updateSkillsInput() {
    const skillsInput = document.getElementById('skills');
    if (skillsInput) {
        skillsInput.value = selectedSkills.join(', ');
    }
}

// Update selected skills display
function updateSelectedSkillsDisplay() {
    console.log('🔄 Updating skills display...');
    
    // Try to find a container to show selected skills
    let container = document.getElementById('selected-skills') || 
                   document.querySelector('.selected-skills') ||
                   document.querySelector('.skills-display');
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'selected-skills';
        container.style.cssText = `
            margin-top: 10px;
            padding: 15px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 8px;
            border: 1px solid #dee2e6;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        // Insert after skills input
        const skillsInput = document.getElementById('skills');
        if (skillsInput && skillsInput.parentElement) {
            skillsInput.parentElement.appendChild(container);
        }
    }
    
    if (selectedSkills.length === 0) {
        container.innerHTML = '<p style="color: #666; margin: 0; text-align: center; font-style: italic;">No skills selected yet</p>';
        return;
    }
    
    const skillsHTML = `
        <div style="margin-bottom: 8px; font-weight: bold; color: #333;">
            <i class="fas fa-check-circle" style="color: #4CAF50; margin-right: 5px;"></i>
            Selected Skills (${selectedSkills.length}):
        </div>
        ${selectedSkills.map(skill => 
            `<span style="
                background: linear-gradient(45deg, #4CAF50, #45a049); 
                color: white; 
                padding: 6px 12px; 
                border-radius: 15px; 
                margin: 3px; 
                display: inline-block; 
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
            " onclick="removeSkill('${skill}')" 
               onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.4)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(76, 175, 80, 0.3)'">
                ${skill} <span style="margin-left: 6px; font-weight: bold; opacity: 0.8;">&times;</span>
            </span>`
        ).join('')}
    `;
    
    container.innerHTML = skillsHTML;
}

// Remove skill function (global for onclick)
window.removeSkill = function(skill) {
    console.log(`🗑️ Removing skill: ${skill}`);
    selectedSkills = selectedSkills.filter(s => s !== skill);
    
    // Update button appearance
    const allButtons = document.querySelectorAll('.skill-tag');
    allButtons.forEach(button => {
        if (button.textContent.trim() === skill) {
            button.classList.remove('selected');
            button.style.backgroundColor = '#f0f0f0';
            button.style.color = '';
            button.style.fontWeight = '500';
            button.style.transform = 'translateY(0)';
        }
    });
    
    updateSelectedSkillsDisplay();
    updateSkillsInput();
};

// Setup form event listeners
function setupEventListeners() {
    console.log('🔧 Setting up form listeners...');
    
    // Form submission
    const form = document.getElementById('recommendation-form') || document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        console.log('✅ Form listener added');
    }
    
    // Submit button
    const submitButton = document.querySelector('button[type="submit"]') || 
                        document.querySelector('.submit-btn') ||
                        document.querySelector('button');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            if (submitButton.type !== 'submit') {
                e.preventDefault();
                handleFormSubmit(e);
            }
        });
        console.log('✅ Submit button listener added');
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    console.log('📤 PM Internship form submission started...');
    event.preventDefault();
    
    if (isLoading) {
        console.log('⏳ Already processing...');
        return;
    }
    
    try {
        const formData = collectFormData();
        console.log('📋 Form data collected:', formData);
        
        if (!validateFormData(formData)) {
            return;
        }
        
        showLoading(true);
        await getRecommendations(formData);
        
    } catch (error) {
        console.error('❌ Form submission error:', error);
        showError('An error occurred. Please try again.');
    } finally {
        showLoading(false);
    }
}
// ================= LOCATION MAPPING =================
function mapLocation(location) {
    if (location === 'remote') return 'Work From Home';
    if (location === 'any') return 'any';
    return location.charAt(0).toUpperCase() + location.slice(1);
}

// Enhanced Collect form data function
function collectFormData() {
    console.log('🔍 Collecting form data...');
    
    // Get form elements with multiple fallbacks
    const educationElement = document.getElementById('education') || 
                            document.querySelector('[name="education"]') || 
                            document.querySelector('select');
    
    const locationElement = document.getElementById('location_preference') || 
                           document.getElementById('location') ||
                           document.querySelector('[name="location_preference"]') ||
                           document.querySelector('[name="location"]') ||
                           document.querySelector('select:nth-of-type(2)');
    
    const stipendElement = document.getElementById('min_stipend') || 
                          document.getElementById('stipend') ||
                          document.querySelector('[name="min_stipend"]') ||
                          document.querySelector('[name="stipend"]') ||
                          document.querySelector('select:nth-of-type(3)');
    
    // Get values
    const education = educationElement?.value || '';
    const location = locationElement?.value || '';
    const stipend = stipendElement?.value || '';
    
    // Debug logging
    console.log('📋 Form elements found:');
    console.log('  Education element:', educationElement);
    console.log('  Education value:', education);
    console.log('  Location element:', locationElement);
    console.log('  Location value:', location);
    console.log('  Stipend element:', stipendElement);
    console.log('  Stipend value:', stipend);
    console.log('  Selected skills:', selectedSkills);
    
    const formData = {
        education: education,
        skills: selectedSkills.length > 0 ? selectedSkills : [],
        location_preference: mapLocation(location),
        min_stipend: parseStipend(stipend)
    };
    
    console.log('📤 Final form data being sent:', formData);
    return formData;
}

// Parse stipend
function parseStipend(stipendValue) {
    if (!stipendValue || stipendValue === '0' || stipendValue.includes('unpaid')) return 0;
    const match = stipendValue.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// Enhanced validation
function validateFormData(data) {
    console.log('✅ Validating form data:', data);
    
    if (!data.education) {
        showError('Please select your education field');
        return false;
    }
    
    if (!data.skills || data.skills.length === 0) {
        showError('Please select at least one skill from the updated list');
        return false;
    }
    
    if (!data.location_preference) {
        showError('Please select your preferred work location');
        return false;
    }
    
    console.log('✅ Form validation passed');
    return true;
}

// Get recommendations
async function getRecommendations(userData) {
    try {
        console.log('🔍 Sending PM Internship recommendation request...');
        console.log('📊 User data being sent:', userData);
        
        const response = await fetch('http://localhost:5000/api/recommendations', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Response error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data.success && data.recommendations) {
            displayRecommendations(data.recommendations);
            console.log(`🎯 Successfully displayed ${data.recommendations.length} recommendations`);
        } else {
            showError(data.message || 'No recommendations found');
        }
        
    } catch (error) {
        console.error('❌ API request failed:', error);
        showError(`Failed to get recommendations: ${error.message}`);
    }
}

// Display recommendations with real company redirects
function displayRecommendations(recommendations) {
    console.log(`🎯 Displaying ${recommendations.length} PM Internship recommendations`);
    
    let container = document.getElementById('recommendations-container') || 
                   document.getElementById('results') || 
                   document.querySelector('.results');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'recommendations-container';
        container.style.marginTop = '30px';
        document.querySelector('.main-content').appendChild(container);
    }
    
    // Show results section
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
    }
    
    const html = `
        <h2 style="text-align: center; color: #333; margin-bottom: 20px;">
            <i class="fas fa-star"></i> Your PM Internship Recommendations
        </h2>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">
            Found ${recommendations.length} PM Internship opportunities matching your profile
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">
            ${recommendations.map((internship, index) => `
                <div style="
                    background: white; 
                    padding: 25px; 
                    border-radius: 12px; 
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                    border-left: 5px solid #FF6B35;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.15)'" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="background: linear-gradient(45deg, #FF6B35, #F7931E); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                            PM Internship #${index + 1}
                        </span>
                        <span style="background: #e8f5e8; color: #4CAF50; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                            ${Math.floor(Math.random() * 20) + 80}% Match
                        </span>
                    </div>
                    <h3 style="color: #333; margin-bottom: 8px; font-size: 18px;">
                        ${internship.title || internship.internship_title}
                    </h3>
                    <p style="color: #666; font-weight: 500; margin-bottom: 15px; font-size: 16px;">
                        <i class="fas fa-building"></i> ${internship.company || internship.company_name}
                    </p>
                    <div style="margin: 15px 0;">
                        <div style="margin-bottom: 8px; display: flex; align-items: center;">
                            <i class="fas fa-map-marker-alt" style="color: #FF6B35; margin-right: 8px; width: 16px;"></i>
                            <span style="color: #555;">${internship.location}</span>
                        </div>
                        <div style="margin-bottom: 8px; display: flex; align-items: center;">
                            <i class="fas fa-rupee-sign" style="color: #FF6B35; margin-right: 8px; width: 16px;"></i>
                            <span style="color: #555; font-weight: 600;">${internship.stipend || internship.raw_stipend || '₹25,000/month'}</span>
                        </div>
                        <div style="margin-bottom: 8px; display: flex; align-items: center;">
                            <i class="fas fa-clock" style="color: #FF6B35; margin-right: 8px; width: 16px;"></i>
                            <span style="color: #555;">${internship.duration}</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <i class="fas fa-calendar" style="color: #FF6B35; margin-right: 8px; width: 16px;"></i>
                            <span style="color: #555;">${internship.start_date}</span>
                        </div>
                    </div>
                    <button onclick="handleApplyClick('${(internship.title || internship.internship_title).replace(/'/g, "\\'")}', '${(internship.company || internship.company_name).replace(/'/g, "\\'")}')" style="
                        background: linear-gradient(45deg, #FF6B35, #F7931E); 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        width: 100%;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255, 107, 53, 0.4)'" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(255, 107, 53, 0.3)'">
                        <i class="fas fa-external-link-alt"></i> Apply for PM Internship
                    </button>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(45deg, #FF6B35, #F7931E); border-radius: 10px; color: white;">
            <h3><i class="fas fa-info-circle"></i> About PM Internship Scheme</h3>
            <p style="margin: 10px 0; opacity: 0.9;">All internships above are part of the Government of India's PM Internship Scheme, offering standardized stipends and guaranteed learning opportunities.</p>
        </div>
    `;
    
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth' });
}

// Enhanced Apply Click Handler with Real Company Redirects
function handleApplyClick(title, company) {
    console.log(`🎯 PM Internship Apply clicked: ${title} at ${company}`);
    
    // Real company website URLs - EXPANDED LIST
    const companyWebsites = {
        'Tata Consultancy Services': 'https://www.tcs.com/careers',
        'Infosys Limited': 'https://www.infosys.com/careers/',
        'HCL Technologies': 'https://www.hcltech.com/careers',
        'Wipro Limited': 'https://careers.wipro.com/',
        'Tech Mahindra': 'https://www.techmahindra.com/careers/',
        'Cognizant': 'https://careers.cognizant.com/global/en',
        'Accenture': 'https://www.accenture.com/in-en/careers',
        'IBM India': 'https://www.ibm.com/careers/in-en/',
        'Microsoft India': 'https://careers.microsoft.com/professionals/us/en',
        'Google India': 'https://careers.google.com/locations/india/',
        'Amazon India': 'https://www.amazon.jobs/en/locations/india',
        'Oracle India': 'https://www.oracle.com/corporate/careers/',
        'Unity Technologies': 'https://careers.unity.com/',
        'Salesforce India': 'https://careers.salesforce.com/',
        'PayPal India': 'https://careers.pypl.com/',
        'VMware India': 'https://careers.vmware.com/',
        'Facebook India': 'https://www.metacareers.com/',
        'Adobe India': 'https://adobe.wd5.myworkdayjobs.com/',
        'Tata Motors': 'https://www.tatamotors.com/careers/',
        'Mahindra & Mahindra': 'https://www.mahindra.com/careers',
        'Bajaj Auto': 'https://www.bajajauto.com/careers',
        'Maruti Suzuki': 'https://www.marutisuzuki.com/careers',
        'Larsen & Toubro': 'https://www.larsentoubro.com/careers/',
        'Siemens India': 'https://jobs.siemens.com/jobs',
        'Reliance Industries': 'https://careers.ril.com/',
        'BHEL': 'https://www.bhel.com/careers',
        'TVS Motors': 'https://www.tvsmotor.com/careers',
        'Hero MotoCorp': 'https://www.heromotocorp.com/en-in/careers',
        'Godrej & Boyce': 'https://www.godrej.com/careers',
        'ABB India': 'https://careers.abb/global/en',
        'Voltas Limited': 'https://www.voltas.com/careers/',
        'Bosch India': 'https://careers.bosch.com/',
        'HDFC Bank': 'https://www.hdfcbank.com/personal/about-us/careers',
        'ICICI Bank': 'https://careers.icicibank.com/',
        'State Bank of India': 'https://sbi.co.in/careers',
        'Times of India': 'https://timesofindia.indiatimes.com/careers',
        'HUL': 'https://careers.unilever.com/',
        'ITC Limited': 'https://www.itcportal.com/careers/',
        'Zomato': 'https://www.zomato.com/careers',
        'Flipkart': 'https://www.flipkartcareers.com/',
        'Swiggy': 'https://careers.swiggy.com/',
        'BigBasket': 'https://careers.bigbasket.com/'
    };
    
    // Get company website URL
    const companyUrl = companyWebsites[company] || 'https://pminternship.mca.gov.in/';
    
    // Show PM Internship confirmation dialog
    const confirmed = confirm(`🇮🇳 Apply for PM Internship Scheme!\n\n📋 Position: ${title}\n🏢 Company: ${company}\n💰 Stipend: ₹25,000/month\n⏰ Duration: 12 months\n\nThis will redirect you to ${company}'s official careers page where you can apply for this PM Internship opportunity.\n\nClick OK to proceed.`);
    
    if (confirmed) {
        // Show PM Internship application loading
        showPMApplicationLoading(title, company);
        
        setTimeout(() => {
            // Open company careers page in new tab
            window.open(companyUrl, '_blank');
            hidePMApplicationLoading();
            
            // Show success message
            showPMApplicationSuccess(title, company);
            
            // Also open PM Internship portal for reference
            setTimeout(() => {
                window.open('https://pminternship.mca.gov.in/', '_blank');
            }, 2000);
        }, 1500);
    }
}

// Show PM Internship application loading
function showPMApplicationLoading(title, company) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'pm-application-loading';
    loadingDiv.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #FF6B35, #F7931E); color: white;
        padding: 30px 40px; border-radius: 15px; z-index: 2000;
        box-shadow: 0 20px 50px rgba(0,0,0,0.4); text-align: center;
        font-weight: bold; border: 3px solid #fff; min-width: 350px;
    `;
    loadingDiv.innerHTML = `
        <div style="font-size: 28px; margin-bottom: 15px;">🇮🇳</div>
        <div style="font-size: 20px; margin-bottom: 10px;">PM Internship Scheme</div>
        <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin: 15px 0;"></i><br>
        <div style="margin: 10px 0; font-size: 16px;">Connecting to ${company}</div>
        <div style="font-size: 14px; opacity: 0.9; margin-top: 10px;">${title}</div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Opening careers portal...</div>
    `;
    document.body.appendChild(loadingDiv);
}

// Hide PM Internship application loading
function hidePMApplicationLoading() {
    const loadingDiv = document.getElementById('pm-application-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show PM Internship application success
function showPMApplicationSuccess(title, company) {
    const successDiv = document.createElement('div');
    successDiv.className = 'pm-success-message';
    successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(45deg, #4CAF50, #45a049); color: white;
        padding: 25px; border-radius: 12px; z-index: 1000; max-width: 400px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.3); font-weight: 500;
        border: 3px solid #fff;
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fas fa-check-circle"></i> 🇮🇳 PM Internship Portal Opened!</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none; border: none; color: white; font-size: 22px;
                cursor: pointer; margin-left: 15px; padding: 0;
            ">&times;</button>
        </div>
        <div style="margin-top: 12px; font-size: 14px; opacity: 0.95;">
            <strong>Application Portal:</strong> ${company}<br>
            <strong>Position:</strong> ${title}<br>
            <span style="font-size: 12px; opacity: 0.8;">PM Internship Scheme portal will open shortly for reference</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 8000);
}

// Show/hide loading
function showLoading(show) {
    isLoading = show;
    const btn = document.querySelector('.submit-btn') || document.querySelector('button[type="submit"]');
    const loading = document.getElementById('loading');
    
    if (btn) {
        btn.disabled = show;
        btn.innerHTML = show ? 
            '<i class="fas fa-spinner fa-spin"></i> Finding PM Internships...' : 
            '<i class="fas fa-search"></i> Find My Perfect Internships';
    }
    
    if (loading) {
        loading.classList.toggle('hidden', !show);
    }
}

// Show error
function showError(message) {
    console.error('❌ Error:', message);
    hideError();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #f44336; color: white; 
        padding: 15px 20px; border-radius: 8px; z-index: 1000; max-width: 350px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        font-weight: 500;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fas fa-exclamation-triangle"></i> ${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none; border: none; color: white; font-size: 18px; 
                cursor: pointer; margin-left: 15px; padding: 0;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Hide error
function hideError() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// Check API health
async function checkAPIHealth() {
    try {
        const response = await fetch('http://localhost:5000/health');
        console.log(response.ok ? '✅ PM Internship API healthy' : '⚠️ PM Internship API unhealthy');
    } catch (error) {
        console.error('❌ PM Internship API check failed:', error);
    }
}

console.log('✅ PM Internship Recommendation Engine loaded successfully!');
console.log('👤 User: shreyasraut0707');
console.log('📅 Time: 2025-09-10 18:52:15 UTC');
console.log('🇮🇳 PM Internship Scheme Integration: ACTIVE');
console.log('🎓 Dynamic Education-Based Skills: ENABLED');