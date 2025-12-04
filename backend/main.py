from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.parse_hand import router as parse_router

app = FastAPI()

# CORS MUST be added BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow all for dev
    allow_credentials=True,
    allow_methods=["*"],          # MUST ALLOW OPTIONS HERE
    allow_headers=["*"],
)

app.include_router(parse_router)

@app.get("/")
def root():
    return {"message": "AI Poker Backend Running"}
