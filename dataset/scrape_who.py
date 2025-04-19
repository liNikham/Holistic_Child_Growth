import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
import json
import urllib.parse

# WHO URL
url = 'https://www.who.int/tools/child-growth-standards/standards/triceps-skinfold-for-age'

# Create a folder to store downloads
os.makedirs('downloads', exist_ok=True)

# Step 1: Get HTML content
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Step 2: Find all links to Excel files
xls_links = []
for link in soup.find_all('a', href=True):
    href = link['href']
    if '.xls' in href or '.xlsx' in href:
        full_url = href if href.startswith('http') else f"https://www.who.int{href}"
        xls_links.append(full_url)

# Step 3: Download and convert each Excel file to JSON
for i, link in enumerate(xls_links):
    print(f"Downloading: {link}")
    file_name = urllib.parse.urlparse(link).path.split("/")[-1]
    file_path = os.path.join('downloads', file_name)

    # Download file
    r = requests.get(link)
    with open(file_path, 'wb') as f:
        f.write(r.content)

    # Load Excel file using pandas
    try:
        df = pd.read_excel(file_path, sheet_name=None)  # Get all sheets
        json_data = {}
        for sheet, data in df.items():
            json_data[sheet] = data.dropna().to_dict(orient='records')

        # Save JSON
        json_file = file_path.replace('.xls', '.json').replace('.xlsx', '.json')
        with open(json_file, 'w', encoding='utf-8') as jf:
            json.dump(json_data, jf, indent=2, ensure_ascii=False)

        print(f"Saved JSON: {json_file}")

    except Exception as e:
        print(f"Error processing {file_name}: {e}")
