import urllib.request
import urllib.parse
import json

prompt = "A realistic NASA-style planet in deep space, stunning astronomy photography, dark space background with glowing nebula, high resolution, no people"
url = f"https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt={urllib.parse.quote(prompt)}&image_size=square"
req = urllib.request.Request(url, method='POST')
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if 'data' in data and data['data']:
            image_url = data['data'][0]['url']
            urllib.request.urlretrieve(image_url, "src/assets/images/cards/diplopia.webp")
            print("Downloaded to src/assets/images/cards/diplopia.webp")
except Exception as e:
    print(f"Error: {e}")
