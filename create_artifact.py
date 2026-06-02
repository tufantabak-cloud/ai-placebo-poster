import os
artifact_dir = r'C:\Users\Tufan TABAK\.gemini\antigravity\brain\6a120935-dd4a-4205-80ee-4bfe363781af'
if not os.path.exists(artifact_dir):
    os.makedirs(artifact_dir)

with open('extracted_translations.txt', 'r', encoding='utf-8') as f:
    text = f.read()

artifact_path = os.path.join(artifact_dir, 'all_texts.md')
with open(artifact_path, 'w', encoding='utf-8') as out:
    out.write('# Application Texts\n\n')
    out.write('`javascript\n')
    out.write('const translations = ')
    out.write(text)
    out.write(';\n`\n')

print('Artifact created at:', artifact_path)
