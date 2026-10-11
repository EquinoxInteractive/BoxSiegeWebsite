import os, shutil, subprocess, glob
from PIL import Image
G='/home/claude/game/assets/'; O='/home/claude/site/public/assets/'
def mk(p): os.makedirs(os.path.dirname(p),exist_ok=True)
def webp(src,dst,maxw=None):
    if os.path.exists(dst) and os.path.getsize(dst)>0: return
    im=Image.open(src).convert('RGBA')
    if maxw and im.width>maxw:
        im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    mk(dst); im.save(dst,'WEBP',lossless=True,quality=100,method=1)
CH=[("p1","angry"),("p1","melow"),("p1","bandel"),("p1","ninja"),("p2","calm"),("p2","baik"),("p2","silat"),("p2","mime"),("p3","spiderweaver"),("p3","blind"),("p3","joker"),("p3","drunk"),("p4","bald-man"),("p4","savior"),("p4","spiderblack"),("p4","deadswim"),("p1","robot"),("p1","zombie"),("p2","pirate"),("p2","pocong"),("p3","vampire"),("p3","cyclops"),("p4","pumpkin"),("p4","alien")]
for pf,c in CH:
    webp(f'{G}sprites/characters/{pf}/{c}.png',f'{O}chars/{c}.webp')
    webp(f'{G}sprites/characters/{pf}/{c}_die.png',f'{O}chars/{c}_die.webp')
    for f in glob.glob(f'{G}sprites/skins/{c}/*.png'):
        b=os.path.basename(f)[:-4]
        if b.endswith('_die'): continue
        webp(f,f'{O}skins/{c}/{b}.webp')
for f in glob.glob(G+'sprites/accessories/*.png'): webp(f,O+'acc/'+os.path.basename(f)[:-4]+'.webp')
for p in ['p1','p2','p3','p4']:
    for f in glob.glob(f'{G}sprites/guns/{p}/*.png'): webp(f,f'{O}guns/{p}/'+os.path.basename(f)[:-4]+'.webp',maxw=520)
webp(G+'sprites/guns/bullet.png',O+'guns/bullet.webp')
for w in os.listdir(G+'sprites/weaponskins'):
    for f in glob.glob(f'{G}sprites/weaponskins/{w}/*.png'): webp(f,f'{O}wskins/{w}/'+os.path.basename(f)[:-4]+'.webp',maxw=520)
for f in glob.glob(G+'sprites/stages/*.png'): webp(f,O+'stages/'+os.path.basename(f)[:-4]+'.webp')
for f in glob.glob(G+'sprites/powerups/*.png'): webp(f,O+'pu/'+os.path.basename(f)[:-4]+'.webp')
for f in glob.glob(G+'sprites/campaign/*.png'): webp(f,O+'camp/'+os.path.basename(f)[:-4]+'.webp')
for n in ['title','heart','coin','infinite']:
    webp(G+f'sprites/ui/{n}.png',O+f'ui/{n}.webp',maxw=1024 if n=='title' else 256)
Image.open('/home/claude/game/icon.jpg').convert('RGB').resize((192,192)).save('/home/claude/site/public/favicon.png')
Image.open('/home/claude/game/icon.jpg').convert('RGB').save(O+'ui/icon.jpg',quality=88)
# fonts
mk(O+'font/x')
for f in ['badaboom.ttf','lilita_one.ttf','digital7.ttf']: shutil.copy(G+'fonts/'+f,O+'font/'+f)
# music
mk(O+'music/x')
for n in ['menu','campaign','game','boss']: shutil.copy(G+f'music/music_{n}.ogg',O+f'music/{n}.ogg')
# audio -> mp3
def mp3(src,dst,br='56k'):
    if os.path.exists(dst) and os.path.getsize(dst)>0: return
    mk(dst); subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-ac','1','-b:a',br,dst],check=True)
for pf,c in CH:
    mp3(f'{G}sfx/voice/char_{c.replace("-","_")}.WAV',f'{O}sfx/voice/{c}.mp3')
for w in ['smith','kurval','flamer','scream']:
    mp3(f'{G}sfx/voice/weapon_{w}.WAV',f'{O}sfx/voice/w_{w}.mp3')
for n in ['gun_smith.mp3','gun_kurval.mp3','gun_flamer.mp3','gun_scream.mp3','gun_secondary.mp3','knife_hit.wav','gun_empty.mp3','pu_heal.wav','pu_jump.mp3','pu_speed.mp3','pu_shield.wav','pu_invisible.wav','pu_ammo_refill.mp3','pu_swap_position.mp3','nuke.wav','freeze.wav','ui_hover.wav','ui_confirm.wav','ui_move.wav','ui_toggle_on.wav','ui_toggle_off.wav','star.wav','fight.mp3','won.mp3','perk_pick.wav','coin.wav','level_clear.wav','boss_roar.wav','hit.wav','shield_break.wav','bounce_pad.wav','lava_burn.wav','spike_hit.wav','arrow_fire.wav','crumble_fall.wav','swap_shuffle.wav','sudden_death.mp3','jump.wav']:
    s=G+'sfx/'+n
    if os.path.exists(s): mp3(s,O+'sfx/'+os.path.splitext(n)[0]+'.mp3',br='64k')
