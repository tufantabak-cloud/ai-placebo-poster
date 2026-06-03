import re

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all blocks matching selectors
selectors = [r'\.exp-stage', r'\.exp-overlay', r'\.song-card', r'\.exp-song-breakdown', r'\.exp-content']
matches = []

for s in selectors:
    pattern = re.compile(s + r'\b')
    for m in pattern.finditer(content):
        # find the curly braces block
        start_idx = m.start()
        # find the opening {
        brace_open = content.find('{', start_idx)
        if brace_open != -1:
            # find matching closing }
            brace_count = 1
            idx = brace_open + 1
            while idx < len(content) and brace_count > 0:
                if content[idx] == '{':
                    brace_count += 1
                elif content[idx] == '}':
                    brace_count -= 1
                idx += 1
            matches.append(content[start_idx:idx])

with open('css_matches.txt', 'w', encoding='utf-8') as out:
    for match in matches:
        out.write(match + "\n\n=======================\n\n")

print(f"Found {len(matches)} matches and saved to css_matches.txt")
