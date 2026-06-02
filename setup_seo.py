import os
import json
from PIL import Image, ImageDraw, ImageFont

# 1. Update vercel.json
vercel_config = {
  "cleanUrls": True,
  "trailingSlash": False,
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
    ]},
    { "source": "/assets/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]},
    { "source": "/(.*)\\.(css|js)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=86400" }
    ]}
  ]
}

with open("vercel.json", "w", encoding="utf-8") as f:
    json.dump(vercel_config, f, indent=2)

# 2. Generate manifest.json
manifest = {
  "name": "AI-Placebo",
  "short_name": "AI-Placebo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f1115",
  "theme_color": "#0f1115",
  "icons": [
    {
      "src": "/icon-32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}

with open("manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

# 3. Generate robots.txt
robots_txt = """User-agent: *
Allow: /

Sitemap: https://ai-placebo-poster.vercel.app/sitemap.xml
"""
with open("robots.txt", "w", encoding="utf-8") as f:
    f.write(robots_txt)

# 4. Generate sitemap.xml
sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ai-placebo-poster.vercel.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ai-placebo-poster.vercel.app/sources.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
"""
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_xml)

# 5. Generate Images
def create_image(size, filename, is_og=False):
    img = Image.new("RGB", size, "#0f1115")
    draw = ImageDraw.Draw(img)
    if is_og:
        # og-image: koyu tema, vurgu yesili, baslik + isim + kurum
        # We will just draw some rectangles and text, since custom fonts might not be available
        try:
            # Try to load a generic font
            font_title = ImageFont.truetype("arial.ttf", 60)
            font_sub = ImageFont.truetype("arial.ttf", 40)
        except IOError:
            font_title = ImageFont.load_default()
            font_sub = ImageFont.load_default()
        
        # accent rect
        draw.rectangle([50, 50, 60, 250], fill="#1DB954")
        
        draw.text((100, 100), "Neuro-Cognitive Dynamics of\nAI Attribution in Music", fill="white", font=font_title)
        draw.text((100, 450), "Berke Tan Tabak", fill="#1DB954", font=font_sub)
        draw.text((100, 510), "İzmir University of Economics - Psychology", fill="#a0a5b0", font=font_sub)
        draw.text((100, 300), "The \"AI-Placebo\" Effect", fill="white", font=font_sub)
        
    else:
        # simple AI-Placebo mono icon
        draw.rectangle([size[0]*0.2, size[1]*0.2, size[0]*0.8, size[1]*0.8], outline="#1DB954", width=max(1, int(size[0]*0.1)))
        try:
            fnt = ImageFont.truetype("arial.ttf", int(size[0]*0.3))
        except:
            fnt = ImageFont.load_default()
        draw.text((size[0]*0.35, size[1]*0.35), "AI", fill="#1DB954", font=fnt)

    img.save(filename)

create_image((1200, 630), "assets/og-image.png", is_og=True)
create_image((32, 32), "icon-32.png")
create_image((180, 180), "apple-touch-icon.png")
create_image((32, 32), "favicon.ico")

# 6. Inject head tags to index.html
head_tags = """
    <!-- SEO and Social Meta Tags -->
    <meta name="description" content="An interactive exploration of the AI-Placebo effect in music perception. Discover how source attribution biases evaluation using fNIRS and behavioral data.">
    <link rel="canonical" href="https://ai-placebo-poster.vercel.app/">
    
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="Neuro-Cognitive Dynamics of AI Attribution in Music">
    <meta property="og:description" content="An interactive exploration of the AI-Placebo effect in music perception. Discover how source attribution biases evaluation using fNIRS and behavioral data.">
    <meta property="og:url" content="https://ai-placebo-poster.vercel.app/">
    <meta property="og:image" content="https://ai-placebo-poster.vercel.app/assets/og-image.png">
    <meta property="og:site_name" content="AI-Placebo Effect">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="tr_TR">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Neuro-Cognitive Dynamics of AI Attribution in Music">
    <meta name="twitter:description" content="An interactive exploration of the AI-Placebo effect in music perception. Discover how source attribution biases evaluation using fNIRS and behavioral data.">
    <meta name="twitter:image" content="https://ai-placebo-poster.vercel.app/assets/og-image.png">
    
    <!-- Theme & Author -->
    <meta name="theme-color" content="#0f1115">
    <meta name="author" content="Berke Tan Tabak">
    
    <!-- Icons & Manifest -->
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/icon-32.png" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.json">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "headline": "Neuro-Cognitive Dynamics of AI Attribution in Music Perception",
      "author": {
        "@type": "Person",
        "name": "Berke Tan Tabak",
        "affiliation": {
          "@type": "Organization",
          "name": "İzmir University of Economics"
        }
      },
      "keywords": "fNIRS, algorithmic aversion, source attribution, prefrontal cortex, cultural essentialism, music perception, placebo effect",
      "abstract": "Generative-AI music systems now match human composers on surface acoustic features, yet listeners systematically devalue music attributed to AI. The present study combines functional near-infrared spectroscopy (fNIRS) with subjective rating measures to isolate the contribution of source labeling from actual acoustic content."
    }
    </script>
"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Only inject if not already present
if 'name="twitter:card"' not in html:
    html = html.replace('</head>', head_tags + '</head>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
