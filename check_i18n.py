import re
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_target = False
        self.current_key = None
        self.data_dict = {}

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if 'data-i18n' in attrs_dict:
            self.in_target = True
            self.current_key = attrs_dict['data-i18n']
            self.data_dict[self.current_key] = ""

    def handle_endtag(self, tag):
        self.in_target = False

    def handle_data(self, data):
        if self.in_target and self.current_key:
            self.data_dict[self.current_key] += data
            
def main():
    with open('c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/index.html', 'r', encoding='utf8') as f:
        index_html = f.read()
        
    with open('c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/script.js', 'r', encoding='utf8') as f:
        script_js = f.read()

    matches = re.findall(r'data-i18n=[\'\"]([^\'\"]+)[\'\"]', index_html)
    unique_matches = set(matches)

    missing = []
    for key in unique_matches:
        if f"'{key}'" not in script_js and f'"{key}"' not in script_js:
            missing.append(key)
            
    # Try another way: simply find data-i18n="key">([^<]+)
    import json
    results = {}
    for key in missing:
        # Regex to find contents between > and <
        pattern = f'data-i18n="{key}"[^>]*>([^<]+)'
        m = re.search(pattern, index_html)
        if m:
            results[key] = m.group(1).strip()
        else:
            pattern2 = f"data-i18n='{key}'[^>]*>([^<]+)"
            m2 = re.search(pattern2, index_html)
            if m2:
                results[key] = m2.group(1).strip()
            else:
                results[key] = "NOT_FOUND"
                
    with open('c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/missing_extracted.json', 'w', encoding='utf8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
