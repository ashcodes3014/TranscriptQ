from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.model import AskDoubt,extractID
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

class UserInput(BaseModel):
    video_id: str
    query: str

class getID(BaseModel):
    url: str

@app.post("/query")
def chatwithAI(data: UserInput):
    return AskDoubt(video_id=data.video_id,query=data.query)

@app.post("/getId")
def chatwithAI(data: getID):
    return extractID(url=data.url)

