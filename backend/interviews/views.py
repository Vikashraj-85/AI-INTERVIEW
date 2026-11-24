import json
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import InterviewSession
from .serializers import InterviewSessionSerializer

QUESTION_BANK = {
 "Frontend Developer": ["Explain the virtual DOM in React.","What is the difference between props and state?","How does useEffect work?","How would you improve a slow web page?","Explain event bubbling and event delegation.","What is the difference between == and ===?","How do you make a responsive accessible UI?","How would you manage API loading and error states?","What is memoization and when would you use it?","How do you prevent unnecessary re-renders?"],
 "Backend Developer": ["Explain REST API design principles.","What is the difference between authentication and authorization?","How do database indexes improve performance?","Explain database transactions and ACID.","How would you secure an API?","What is caching and when would you use it?","How do you handle background jobs?","How would you debug a slow endpoint?","Explain SQL joins.","How do you design pagination?"],
 "Full Stack Developer": ["Describe a full-stack application you built.","How does the browser communicate with a backend?","How do you validate input on both client and server?","Explain JWT authentication.","How would you model users and their projects in a database?","How do you handle API errors in the UI?","Explain CORS.","How would you deploy a full-stack application?","How do you test your application?","How would you improve application performance?"],
 "Python Developer": ["What are Python decorators?","Explain generators and yield.","What is the difference between a list and a tuple?","How does exception handling work?","What are mutable and immutable objects?","Explain Python's virtual environments.","What are comprehensions?","How would you read a large file efficiently?","What is the GIL?","How do you write unit tests?"],
 "HR Interview": ["Tell me about yourself.","Why are you interested in this role?","Describe a challenge you overcame.","What are your strengths and an area you are improving?","Tell me about a time you worked in a team.","How do you handle feedback?","Why should we hire you?","What are your career goals?","Describe a mistake and what you learned.","Do you have any questions for us?"]
}
def build_questions(role, kind, count):
    bank = QUESTION_BANK.get(role, QUESTION_BANK["Full Stack Developer"])
    if kind == "HR": bank = QUESTION_BANK["HR Interview"]
    return [{"id": i+1, "question": bank[i % len(bank)], "category": kind} for i in range(max(1,min(int(count),10)))]
class InterviewListCreateView(generics.ListCreateAPIView):
    serializer_class = InterviewSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user).order_by("-created_at")
    def create(self, request, *args, **kwargs):
        role = str(request.data.get("role", "Software Engineer"))[:120]
        kind = str(request.data.get("type", "Technical"))
        if kind not in ("Technical","Behavioral","Mixed","HR"): kind = "Technical"
        level = str(request.data.get("level", "Intermediate"))
        if level not in ("Beginner","Intermediate","Advanced"): level = "Intermediate"
        try: duration = max(5,min(int(request.data.get("duration",15)),60))
        except (ValueError,TypeError): duration = 15
        try: count = int(request.data.get("question_count",5))
        except (ValueError,TypeError): count = 5
        questions = build_questions(role,kind,count)
        try:
            from .ai_service import chat_json
            ai = chat_json(
                "You are an interview coach. Return only valid JSON with a questions array. Each item must have question and category fields.",
                f"Create {max(1,min(count,10))} original {kind} interview questions for a {level} candidate applying for {role}. Keep them concise, role-specific, and numbered through the array.",
                1000,
            )
            if isinstance(ai, dict) and isinstance(ai.get("questions"), list) and ai["questions"]:
                questions = [{"id": i+1, "question": str(q.get("question", q)) if isinstance(q,dict) else str(q), "category": str(q.get("category",kind)) if isinstance(q,dict) else kind} for i,q in enumerate(ai["questions"][:10])]
        except Exception:
            pass
        obj = InterviewSession.objects.create(user=request.user, role=role, type=kind, level=level, duration=duration, questions=questions)
        return Response(self.get_serializer(obj).data, status=status.HTTP_201_CREATED)
class InterviewDetailView(generics.RetrieveAPIView):
    serializer_class = InterviewSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return InterviewSession.objects.filter(user=self.request.user)
class InterviewSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try: session = InterviewSession.objects.get(pk=pk,user=request.user)
        except InterviewSession.DoesNotExist: return Response({"detail":"Interview not found."},status=404)
        if session.status == "completed": return Response(InterviewSessionSerializer(session).data)
        answers = request.data.get("answers", {})
        if not isinstance(answers, dict): return Response({"detail":"Answers must be an object."},status=400)
        session.answers = {str(k): str(v)[:10000] for k,v in answers.items()}
        answered = [v.strip() for v in session.answers.values() if v.strip()]
        total = max(1,len(session.questions))
        # Transparent rubric: completion and specificity proxy, not a claim of AI grading.
        completion = min(1, len(answered)/total)
        substance = sum(min(len(a.split())/35,1) for a in answered)/total if answered else 0
        session.score = round(100*(completion*.55 + substance*.45))
        session.feedback = f"You answered {len(answered)} of {len(session.questions)} questions. This score is an automated completeness/answer-depth estimate. Add clear examples, explain your reasoning, and use the STAR method for behavioral answers."
        session.strengths = ["You attempted at least one answer"] if answered else []
        session.improvements = (["Answer every question."] if len(answered)<total else []) + (["Add more explanation, examples, and measurable outcomes."] if substance < .75 else [])
        try:
            from .ai_service import chat_json
            ai = chat_json(
                "You are a fair interview evaluator. Return only JSON with score (integer 0-100), feedback (string), strengths (array of strings), improvements (array of strings). Evaluate substance and correctness; do not reward length alone.",
                json.dumps({"role":session.role,"type":session.type,"level":session.level,"questions":session.questions,"answers":session.answers}, ensure_ascii=False),
                900,
            )
            if isinstance(ai,dict) and isinstance(ai.get("score"),(int,float)):
                session.score=max(0,min(100,round(ai["score"])))
                session.feedback=str(ai.get("feedback",session.feedback))[:5000]
                session.strengths=ai.get("strengths",session.strengths) if isinstance(ai.get("strengths"),list) else session.strengths
                session.improvements=ai.get("improvements",session.improvements) if isinstance(ai.get("improvements"),list) else session.improvements
        except Exception:
            pass
        session.status = "completed"; session.completed_at = timezone.now()
        session.save()
        return Response(InterviewSessionSerializer(session).data)
