from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
from urllib.parse import parse_qs, urlparse

app = Flask(__name__)

@app.get('/summary')
def summary_api():
    url = request.args.get('url', '')
    video_id = parse_qs(urlparse(url).query).get('v', [''])[0]
    if not video_id:
        return "Invalid YouTube URL", 400

    summary = get_summary(get_transcript(video_id))
    return summary, 200

def get_transcript(video_id):
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    transcript = ' '.join([d['text'] for d in transcript_list])
    return transcript

def get_summary(transcript):
    model_name = 'sshleifer/distilbart-cnn-12-6'  # Specify the desired model name
    revision = 'a4f8f3e'  # Specify the desired revision

    summariser = pipeline('summarization', model=model_name, revision=revision)
    summary = ''
    for i in range(0, (len(transcript)//1000)+1):
        summary_text = summariser(transcript[i*1000:(i+1)*1000])[0]['summary_text']
        summary = summary + summary_text + ' '
    return summary
    

if __name__ == '__main__':
    app.run()