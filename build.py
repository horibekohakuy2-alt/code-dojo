# src/ の分割ソースを自己完結型の index.html 1ファイルに束ねるビルドスクリプト
# 使い方: python build.py
import io
import os

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "src")

def read(name):
    with io.open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()

html = read("index.html")
css = read("style.css")
js = "\n".join([read("lessons1.js"), read("lessons2.js"), read("lessons3.js"), read("lessons4.js"), read("lessons5.js"), read("reviews.js"), read("app.js")])

link = '<link rel="stylesheet" href="style.css">'
assert link in html, "style link not found"
html = html.replace(link, "<style>\n" + css + "\n  </style>")

scripts = (
    '<script src="lessons1.js"></script>\n'
    '  <script src="lessons2.js"></script>\n'
    '  <script src="lessons3.js"></script>\n'
    '  <script src="lessons4.js"></script>\n'
    '  <script src="lessons5.js"></script>\n'
    '  <script src="reviews.js"></script>\n'
    '  <script src="app.js"></script>'
)
assert scripts in html, "script tags not found"
html = html.replace(scripts, "<script>\n" + js + "\n  </script>")

# JS文字列内の </script> はHTMLパーサーにスクリプト終了と誤認されるためエスケープし、
# 最後の1つ（本物の閉じタグ）だけ戻す
CLOSE = "</" + "script>"
ESCAPED = "<" + "\\/script>"
count = html.count(CLOSE)
html = html.replace(CLOSE, ESCAPED)
idx = html.rfind(ESCAPED)
html = html[:idx] + CLOSE + html[idx + len(ESCAPED):]

out = os.path.join(BASE, "index.html")
with io.open(out, "w", encoding="utf-8", newline="\n") as f:
    f.write(html)

print("built:", out)
print("size:", len(html), "chars / escaped", count - 1, "inner close-tags")
