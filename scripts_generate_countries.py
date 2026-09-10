import phonenumbers
import pycountry

rows = []
for region in phonenumbers.SUPPORTED_REGIONS:
    if region == '001':
        continue
    country = pycountry.countries.get(alpha_2=region)
    name = country.name if country else region
    code = phonenumbers.country_code_for_region(region)
    if not code:
        continue
    flag = ''.join(chr(127397 + ord(char)) for char in region)
    rows.append((name, f'+{code}', flag))
rows.sort(key=lambda row: row[0])
html = '\n'.join(
    f'                      <button type="button" data-code="{code}" data-flag="{flag}" data-country="{name}">{flag} {name} <b>{code}</b></button>'
    for name, code, flag in rows
)
path = 'index.html'
text = open(path, encoding='utf-8').read()
start = text.index('                      <button type="button" data-code="+20"')
end = text.index('                    </div>', start)
text = text[:start] + html + '\n' + text[end:]
open(path, 'w', encoding='utf-8').write(text)
print(f'Generated {len(rows)} countries')
