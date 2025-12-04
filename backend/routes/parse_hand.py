from fastapi import APIRouter
from pydantic import BaseModel
import os
from openai import OpenAI
import json

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class HandRequest(BaseModel):
    hand_text: str

@router.post("/parse-hand")
def parse_hand(req: HandRequest):
    prompt = f"""
You are a poker hand parsing engine.

The user will give a hand description written in messy natural language.
Your job is to extract the following structured data:

- Hero hand
- Villain(s) positions
- Board cards (flop/turn/river)
- Action sequence for each street
- Bet sizes (numerical)
- Missing or unclear information (list)

Return ONLY valid JSON in this exact format:

{{
  "hero_hand": "...",
  "positions": {{
    "hero": "...",
    "villain": "..."
  }},
  "streets": {{
    "preflop": [],
    "flop": {{
      "board": [],
      "actions": []
    }},
    "turn": {{
      "board": [],
      "actions": []
    }},
    "river": {{
      "board": [],
      "actions": []
    }}
  }},
  "missing_info": []
}}

Rules:
- If information is missing → put null AND add a note to missing_info.
- Do NOT hallucinate values.
- Do NOT wrap output in code fences.
- RETURN ONLY pure JSON.

User's hand text:
{req.hand_text}
"""

    response = client.responses.create(
        model="gpt-4o-mini",
        input=prompt,
    )

    # Extract actual text output from the model
    try:
        raw_text = response.output_text
    except:
        raw_text = response.output[0].content[0].text

    raw_text = raw_text.strip()

    return {"parsed_hand": raw_text}
