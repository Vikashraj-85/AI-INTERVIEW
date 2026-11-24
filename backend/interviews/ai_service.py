"""Optional OpenAI-compatible AI calls (xAI/Grok supported). Falls back safely when no key is configured."""
import json
import os
import urllib.request
import urllib.error

def chat_json(system_prompt, user_prompt, max_tokens=1200):
    api_key = os.getenv("XAI_API_KEY") or os.getenv("AI_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    base = os.getenv("AI_BASE_URL", "https://api.x.ai/v1").rstrip("/")
    model = os.getenv("AI_MODEL", "grok-3-mini")
    payload = {"model": model, "messages":[{"role":"system","content":system_prompt},{"role":"user","content":user_prompt}], "temperature":0.3, "max_tokens":max_tokens}
    req = urllib.request.Request(base + "/chat/completions", data=json.dumps(payload).encode(), headers={"Authorization":"Bearer "+api_key,"Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=35) as response:
            result = json.loads(response.read().decode())
        content = result["choices"][0]["message"]["content"]
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n",1)[-1].rsplit("```",1)[0].strip()
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError, IndexError):
        return None
