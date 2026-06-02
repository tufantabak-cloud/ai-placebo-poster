import json
import re
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()
match = re.search(r'const translations = (\{.*?\});', content, re.DOTALL)
if match:
    with open('extracted_translations.txt', 'w', encoding='utf-8') as out:
        out.write(match.group(1))
    print('Extracted translations')
else:
    print('Could not find translations dictionary')
