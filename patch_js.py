with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace(
    "document.getElementById('expOverlay').classList.add('active');",
    "document.getElementById('expOverlay').classList.add('active');\n    document.body.classList.add('no-scroll');"
)
js = js.replace(
    "document.getElementById('expOverlay').classList.remove('active');",
    "document.getElementById('expOverlay').classList.remove('active');\n    document.body.classList.remove('no-scroll');"
)

js = js.replace(
    "if(overlay) overlay.classList.toggle('active');",
    "if(overlay) {\n        overlay.classList.toggle('active');\n        if(overlay.classList.contains('active')) document.body.classList.add('no-scroll');\n        else document.body.classList.remove('no-scroll');\n    }"
)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Patched script.js for modal scroll locking')
