import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.model import AskDoubt, extractID

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

class GetID(BaseModel):  
    url: str

@app.post("/query")
async def chat_with_ai(data: UserInput): 
    return AskDoubt(video_id=data.video_id, query=data.query)

@app.post("/getId")
async def get_video_id(data: GetID):  
    return extractID(url=data.url)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000)) 
    uvicorn.run(app, host="0.0.0.0", port=port)

