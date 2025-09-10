import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json

def get_image(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            return og_image['content']
        else:
            return "No featured image available"
    except Exception:
        return "No featured image available"

def scrape_google_news(query=None, limit=10):
    if query:
        query = query.replace(' ', '+')
        rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    else:
        rss_url = "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en"
    
    feed = feedparser.parse(rss_url)
    news_list = []
    
    for entry in feed.entries[:limit]:
        # Clean title by removing the source if appended
        title_parts = entry.title.rsplit(' - ', 1)
        title = title_parts[0]
        source = title_parts[1] if len(title_parts) > 1 else entry.source.title
        
        # Parse and format date
        try:
            date_obj = datetime.strptime(entry.published, '%a, %d %b %Y %H:%M:%S %Z')
            formatted_date = date_obj.strftime('%B %d, %Y')
        except ValueError:
            formatted_date = entry.published  # Fallback
        
        # Extract excerpt and strip HTML
        excerpt = BeautifulSoup(entry.description, 'html.parser').text.strip()
        
        link = entry.link
        image = get_image(link)
        
        news_item = {
            "date": formatted_date,
            "source": source,
            "title": title,
            "excerpt": excerpt,
            "link": link,
            "image": image
        }
        news_list.append(news_item)
    
    return news_list

# Example usage: scrape top news or for a specific query
# news_data = scrape_google_news()  # For top news
news_data = scrape_google_news(query="archery")  # Example with query to match sample

print(json.dumps(news_data, indent=4))