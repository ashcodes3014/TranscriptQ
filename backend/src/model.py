from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser,JsonOutputParser
from dotenv import load_dotenv

load_dotenv()

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'}
)
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2 ,max_tokens=512)
parser = StrOutputParser()
parser2 = JsonOutputParser()

prompt = PromptTemplate(
    template="""
You are a helpful and intelligent assistant. Your goal is to answer user questions related to a YouTube video.

- First, try to answer the question using the provided transcript.
- If the transcript clearly includes the answer, base your response fully on it.
- If the answer is not explicitly in the transcript, use your general knowledge to provide a relevant and helpful answer. In that case, mention that the transcript did not contain the specific answer, and the response is based on general information.

Transcript:
{context}

Question:
{question}

Answer:
""",
    input_variables=['context', 'question']
)

template = PromptTemplate(
    template='Give me video id from this url {url} \n {format_instruction}',
    input_variables=['url'],
    partial_variables={'format_instruction': parser2.get_format_instructions()}
)


def transcript(video_id):
  try:
      transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=["hi","en"])
      transcript = " ".join(chunk["text"] for chunk in transcript_list)
      return transcript

  except TranscriptsDisabled:
      return 0
  

def retrieverFunc(VideoTranscript):
  chunks = splitter.create_documents([VideoTranscript])
  vector_store = FAISS.from_documents(chunks, embeddings)
  retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 4})
  return retriever


def format_docs(retrieved_docs):
  context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)
  return context_text

def extractID(url):
  chain = template | llm | parser2
  ans = chain.invoke(url)
  return ans['video_id']

def AskDoubt(video_id,query):

  VideoTranscript=transcript(video_id)
  if not VideoTranscript : 
    return "No captions available for this video."
  retriever = retrieverFunc(VideoTranscript)

  parallel_chain = RunnableParallel({
    'context': retriever | RunnableLambda(format_docs),
    'question': RunnablePassthrough()
  })
  main_chain = parallel_chain | prompt | llm | parser
  return main_chain.invoke(query)





