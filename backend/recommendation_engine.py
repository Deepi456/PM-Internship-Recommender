from typing import List, Dict, Any

class RecommendationEngine:
    def __init__(self, data_processor):
        self.data_processor = data_processor
        self.internships = data_processor.get_all_internships()
        print(f"🤖 Recommendation engine initialized with {len(self.internships)} internships")

    def get_recommendations(
        self,
        user_profile: Dict[str, Any],
        num_recommendations: int = 5
    ) -> List[Dict[str, Any]]:

        scored = []

        for internship in self.internships:
            score = self._calculate_match_score(user_profile, internship)
            scored.append({
                **internship,
                "match_score": score,
                "match_percentage": int(score * 100)
            })

        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored[:num_recommendations]

    # ------------------ SCORING LOGIC ------------------

    def _calculate_match_score(self, user, internship) -> float:
        score = 0.0
        weight = 0.0

        # 1️⃣ Skills (40%)
        skills_score = self._skills_match(user.get("skills", []), internship.get("skills", []))
        score += skills_score * 0.4
        weight += 0.4

        # 2️⃣ Education (25%)
        edu_score = self._education_match(user.get("education", ""), internship)
        score += edu_score * 0.25
        weight += 0.25

        # 3️⃣ Location (15%)
        loc_score = self._location_match(user.get("location_preference", ""), internship)
        score += loc_score * 0.15
        weight += 0.15

        # 4️⃣ Stipend (10%)
        stipend_score = self._stipend_match(user.get("min_stipend", 0), internship.get("stipend_amount", 0))
        score += stipend_score * 0.1
        weight += 0.1

        # 5️⃣ Role demand (10%)
        role_score = self._role_prestige(internship)
        score += role_score * 0.1
        weight += 0.1

        return round(score / weight, 3) if weight else 0.0

    # ------------------ HELPERS ------------------

    def _skills_match(self, user_skills, internship_skills):
        if not user_skills or not internship_skills:
            return 0.0

        user = [s.lower() for s in user_skills]
        intern = [s.lower() for s in internship_skills]

        matches = sum(1 for s in user if s in intern)
        return matches / max(len(user), len(intern))

    def _education_match(self, education, internship):
        if not education:
            return 0.6

        edu = education.lower()
        text = f"{internship['title']} {internship['domain']}".lower()

        mapping = {
            "computer": ["software", "developer", "data", "ai"],
            "business": ["marketing", "sales", "management"],
            "design": ["ui", "ux", "graphic"]
        }

        for key, words in mapping.items():
            if key in edu and any(w in text for w in words):
                return 1.0

        return 0.6

    def _location_match(self, pref, internship):
        if not pref or pref.lower() == "any":
            return 1.0

        pref = pref.lower()

        if pref == "work from home" and internship["work_mode"] == "Remote":
            return 1.0

        if pref in internship["location"].lower():
            return 1.0

        if internship["work_mode"] == "Remote":
            return 0.7

        return 0.3

    def _stipend_match(self, min_stipend, stipend):
        if min_stipend == 0:
            return 1.0

        if stipend < min_stipend:
            return 0.0

        if stipend >= min_stipend * 1.5:
            return 1.0

        return 0.7

    def _role_prestige(self, internship):
        high_roles = ["data", "ai", "software", "ml", "product"]
        title = internship["title"].lower()

        for r in high_roles:
            if r in title:
                return 1.0

        return 0.5
