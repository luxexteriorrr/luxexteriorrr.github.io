# Writes a charset.js: every character in a web font, grouped for the character-set grid on a typeface page.
# Run again whenever the web fonts change:
#   python charset.py ../assets/fonts/zerko-regular.woff2 charset.js
#   python charset.py ../assets/fonts/depo/depo-regular.woff2 ../depo/charset.js
import sys, json, unicodedata as u
from fontTools.ttLib import TTFont
font, out = sys.argv[1], sys.argv[2]
cm = TTFont(font).getBestCmap()
groups = {k: [] for k in ['Latin uppercase', 'Latin lowercase', 'Cyrillic uppercase', 'Cyrillic lowercase',
                          'Figures', 'Punctuation', 'Currency', 'Maths', 'Symbols']}
for c in sorted(cm):
    ch, cat = chr(c), u.category(chr(c))
    cyr = 0x400 <= c < 0x530
    if cat == 'Lu': groups['Cyrillic uppercase' if cyr else 'Latin uppercase'].append(ch)
    elif cat == 'Ll': groups['Cyrillic lowercase' if cyr else 'Latin lowercase'].append(ch)
    elif cat in ('Nd', 'No'): groups['Figures'].append(ch)
    elif cat.startswith('P'): groups['Punctuation'].append(ch)
    elif cat == 'Sc': groups['Currency'].append(ch)
    elif cat == 'Sm': groups['Maths'].append(ch)
    elif cat in ('So', 'Sk', 'Lm', 'Lo'): groups['Symbols'].append(ch)
data = [{'name': k, 'chars': ''.join(v)} for k, v in groups.items() if v]
with open(out, 'w') as f:
    f.write(f'// Generated from {font.split("/")[-1]} by zerko/charset.py (fontTools). Do not edit by hand.\n')
    f.write('window.CHARSET = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
print({d['name']: len(d['chars']) for d in data})
