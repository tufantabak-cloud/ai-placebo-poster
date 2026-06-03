with open('styles.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '.exp-content' in line or '.exp-stage' in line or '.song-card' in line or '.exp-song-breakdown' in line:
        print(f"Line {i+1}: {line.strip()}")
        # print surrounding lines
        start = max(0, i - 3)
        end = min(len(lines), i + 8)
        print("--- context ---")
        for j in range(start, end):
            print(f"  {j+1}: {lines[j].strip()}")
        print("================")
