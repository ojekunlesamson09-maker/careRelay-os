import os
from openai import OpenAI
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize both clients
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")


def call_groq(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    """Call Groq (Llama 3.3 70B) — used for Agents 1 & 2"""
    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
            max_tokens=4096
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Groq API error: {str(e)}")


def call_openai(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
    """Call OpenAI GPT-4o — used for Agents 3 & 4"""
    try:
        response = openai_client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
            max_tokens=4096
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")


def call_llm(provider: str, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    """Universal LLM caller — routes to correct provider"""
    if provider == "groq":
        return call_groq(system_prompt, user_prompt, temperature)
    elif provider == "openai":
        return call_openai(system_prompt, user_prompt, temperature)
    else:
        raise ValueError(f"Unknown provider: {provider}")