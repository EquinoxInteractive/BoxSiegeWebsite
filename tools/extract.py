import re, json
S='/home/claude/game/scripts/'
g=open(S+'global.gd').read(); cd=open(S+'campaign_data.gd').read(); cs=open(S+'cosmetics_data.gd').read()
out={}
# characters
ch=re.search(r'const CHARACTERS := \[(.*?)\n\]',g,re.S).group(1)
out['characters']=[{'id':b,'slot':int(a[1])} for a,b in re.findall(r'\["(p\d)", "([a-z\-]+)"\]',ch)]
# weapons
W={}
for m in re.finditer(r'\t"(\w+)": \{"hold_len".*?\n\t\t"color"[^\n]*\},',g,re.S):
    blk=m.group(0); wid=m.group(1)
    def f(k,d=None):
        r=re.search(r'"%s": ([^,}\n]+)'%k,blk)
        return r.group(1).strip().strip('"') if r else d
    W[wid]={'name':f('name'),'kind':f('kind'),'selectable':f('selectable')=='true','damage':float(f('damage')),'ammo':int(f('ammo')),'cooldown':float(f('cooldown')),'bulletSpeed':float(f('bullet_speed')),'auto':f('auto')=='true','recoil':float(f('recoil',0) or 0),'spread':float(f('spread',0) or 0),'fallback':f('fallback',''),'reach':float(f('reach',0) or 0),
       'color':'#'+re.search(r'"color": Color\("(\w+)"\)',blk).group(1),'glow':'#'+re.search(r'"glow": Color\("(\w+)"\)',blk).group(1)}
out['weapons']=W
# maps palette
pal=re.search(r'const MAP_PALETTES := \{(.*?)\n\}',g,re.S).group(1)
out['palettes']={k:['#'+x for x in re.findall(r'Color\("(\w+)"\)',v)] for k,v in re.findall(r'"(\w+)": \[(.*?)\],?\n',pal)}
# power-up colors
pu=re.search(r'const POWERUPS := \{(.*?)\n\}',g,re.S).group(1)
out['pucolors']={k:'#'+c for k,c in re.findall(r'"(\w+)": \{"name": "[^"]+", "desc": "[^"]+", "color": Color\("(\w+)"\)',pu)}
# campaign
out['chapterNames']=re.findall(r'"([A-Z ]+)"',re.search(r'const CHAPTER_NAMES := \[(.*?)\]',cd).group(1))
out['worlds']=[{'id':a,'name':b,'from':int(c),'to':int(d)} for a,b,c,d in re.findall(r'\{"id": "(\w+)", "name": "([A-Z ]+)", "levels": \[(\d+), (\d+)\]\}',cd)]
en={}
ei=cd.find('const ENEMIES := {'); ej=cd.find('\n}\n',ei)
ebody=cd[ei:ej]
for m in re.finditer(r'\t"(\w+)": \{(.*?)\},?(?=\n\t"|\n\t#|\Z)',ebody,re.S):
    k=m.group(1); blk=m.group(2)
    def f(key,d=None):
        r=re.search(r'"%s": ([^,}\]\n]+)'%key,blk); return float(r.group(1)) if r else d
    t=re.search(r'"traits": \[([^\]]*)\]',blk)
    en[k]={'name':re.search(r'"name": "([^"]+)"',blk).group(1),'weapon':re.search(r'"weapon": "(\w+)"',blk).group(1),'hp':f('hp'),'speed':f('speed'),'jump':f('jump'),'dmg':f('dmg'),'range':f('range'),'score':int(f('score')),'shield':'"shield": true' in blk,'knife':'"knife_only": true' in blk,'size':f('size',1.0),'traits':re.findall(r'"(\w+)"',t.group(1)) if t else [],'chars':[int(x) for x in re.search(r'"chars": \[([^\]]*)\]',blk).group(1).split(',')]}
out['enemies']=en
# perks
pk=re.search(r'const PERKS := \{(.*?)\n\}',cd,re.S).group(1)
out['perks']=[{'id':a,'name':b,'desc':c,'max':int(d),'color':'#'+e} for a,b,c,d,e in re.findall(r'"(\w+)": \{"name": "([^"]+)", "desc": "([^"]+)", "max": (\d+), "weight": \d+, "color": Color\("(\w+)"\)',pk)]
# levels per chapter
lv=[]
for fn in ['ch1','ch2','ch3','ch4','ch5']:
    i=cd.find('static func _levels_%s()'%fn); j=cd.find('\nstatic func',i+10)
    body=cd[i:j]
    L=[]
    for m in re.finditer(r'_lv\("([^"]+)", "(\w+)", (.*?)\], \[([\d.]+), ([\d.]+)\], (\d)\)',body):
        nm,wd,waves=m.group(1),m.group(2),m.group(3)
        ws=[[ (a,int(b)) for a,b in re.findall(r'\["(\w+)", (\d+)\]',w)] for w in re.findall(r'\[\[(?:.*?)\]\]|\[\[.*?\]\]',waves)] 
        L.append({'name':nm,'world':wd,'waves':waves})
    lv.append(L)
out['levelCounts']=[len(x) for x in lv]
# boss by chapter & world, level names ch
bossmap=[]
for c,L in enumerate(lv):
    for k,l in enumerate(L):
        b=re.findall(r'"(boss_\w+)"',l['waves'])
        # waves count
        wc=len(re.findall(r'\[\[',l['waves']))+len(re.findall(r'\]\], \[\[|\], \[\[',l['waves']))
        bossmap.append({'ch':c+1,'n':k+1,'name':l['name'],'world':l['world'],'boss':b[0] if b else None})
out['levels']=bossmap
# cosmetics
out['charSkins']=[{'id':a,'name':b,'rarity':c,'price':int(d)} for a,b,c,d in re.findall(r'\["(\w+)", "([^"]+)", "(\w+)", (\d+)\],?\n?',re.search(r'const CHAR_SKINS := \[(.*?)\n\]',cs,re.S).group(1))]
ws={}
wsb=re.search(r'const WEAPON_SKINS := \{(.*?)\n\}\n',cs,re.S).group(1)
for w,blk in re.findall(r'"(\w+)": \[(.*?)\n\t\],',wsb,re.S):
    ws[w]=[{'id':a,'name':b,'rarity':c,'price':int(d),'bullet':'#'+e} for a,b,c,d,e in re.findall(r'\["(\w+)", "([^"]+)", "(\w+)", (\d+), "(\w+)"\]',blk)]
out['weaponSkins']=ws
out['accessories']=[{'id':a,'name':b,'slot':c,'price':int(d),'rarity':e,'layer':f} for a,b,c,d,e,f in re.findall(r'\["(\w+)", "([^"]+)", "(\w+)", (\d+), "(\w+)", "(\w+)"\]',re.search(r'const ACCESSORIES := \[(.*?)\n\]',cs,re.S).group(1))]
out['eyeY']=[int(x) for x in re.search(r'const EYE_Y := \[(.*?)\]',cs).group(1).split(',')]
json.dump(out,open('/home/claude/extracted.json','w'),indent=1)
print({k:(len(v) if hasattr(v,'__len__') else v) for k,v in out.items()})
print(out['levelCounts'], out['worlds'][:2], list(out['weapons'].keys()))
print(out['weapons']['scream']); print(out['enemies']['boss_final']); print(out['pucolors'], out['palettes']['earth'])
print([l for l in out['levels'] if l['boss']][:3], sum(1 for l in out['levels'] if l['boss']))
print(out['levels'][:6])
