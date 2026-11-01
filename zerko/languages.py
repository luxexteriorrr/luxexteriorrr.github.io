# Writes a languages.js for a typeface page: the languages a font supports, by script, from Hyperglot's check
# (base characters and marks; its default "primary" orthographies). Run again when the web fonts change:
#   hyperglot ../assets/fonts/zerko-regular.woff2 -y zerko-langs.yaml
#   python languages.py zerko-langs.yaml languages.js ../assets/fonts/zerko-regular.woff2
# Hyperglot lists every orthography of a supported language, so each one is checked again here against the font:
# only those whose base characters are all in the font count, and the language is filed under their script.
import sys, json, yaml
from fontTools.ttLib import TTFont
src, out, font = sys.argv[1], sys.argv[2], sys.argv[3]
cmap = set(TTFont(font).getBestCmap())
data = yaml.unsafe_load(open(src))  # Hyperglot's own output file
by_script = {}
for code, lang in data.items():
    name = lang.get('preferred_name') or lang.get('name')
    scripts = set()
    for o in lang.get('orthographies', []):
        base = (o.get('base') or '').split()
        if base and all(all(ord(ch) in cmap for ch in g) for g in base):
            scripts.add(o.get('script'))
    for s in scripts:
        if s: by_script.setdefault(s, set()).add(name)
res = {s: sorted(v, key=str.casefold) for s, v in sorted(by_script.items())}
with open(out, 'w') as f:
    f.write(f'// Generated from Hyperglot ({src.split("/")[-1]}) by zerko/languages.py. Do not edit by hand.\n')
    f.write('window.LANGUAGES = ' + json.dumps(res, ensure_ascii=False) + ';\n')
print({s: len(v) for s, v in res.items()})
