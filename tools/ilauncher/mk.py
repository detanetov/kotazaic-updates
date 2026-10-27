import re,base64,io,uuid,plistlib
from PIL import Image
SRC='/home/claude/kotazaic-updates/mlauncher.html'
SP='/tmp/claude-0/-home-claude/7d15d101-39bf-5e72-b41f-a90c0966aec6/scratchpad/'
URL='https://raw.githack.com/detanetov/kotazaic-updates/main/ilauncher.html'
h=open(SRC,encoding='utf-8').read()
def rep(a,b):
  global h; assert h.count(a)==1,(a,h.count(a)); h=h.replace(a,b)
# iOS head: fullscreen web app, icon, manifest
rep('<title>Kotazaic Launcher</title>','<title>Kotazaic Launcher</title>\n<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Kotazaic"><meta name="theme-color" content="#12102a"><link rel="apple-touch-icon" href="ilauncher-icon.png"><link rel="manifest" href="ilauncher.webmanifest">')
# launch games in a full-screen frame instead of navigating
rep("setTimeout(()=>location.href=furl(g.file),120)}","setTimeout(()=>kzIosOpen(g),120)}")
# the main script runs after the games are loaded from the phone storage
idx=h.rindex('<script>');h=h[:idx]+'<script type="text/kz-main" id="kzmain">'+h[idx+8:]
shim=open('shim.js',encoding='utf-8').read()
h=h.replace('</body>','<script>'+shim+'</script>\n</body>')
open('ilauncher.html','w',encoding='utf-8').write(h)
# icon
ic=Image.open(SP+'ico/launcher1024.png').convert('RGBA');bg=Image.new('RGBA',ic.size,(18,16,42,255));bg.alpha_composite(ic);ic=bg.convert('RGB')
ic.resize((180,180),Image.LANCZOS).save('ilauncher-icon.png',optimize=True);ic.resize((512,512),Image.LANCZOS).save('ilauncher-icon-512.png',optimize=True)
open('ilauncher.webmanifest','w').write('{"name":"Kotazaic Launcher","short_name":"Kotazaic","start_url":"ilauncher.html","display":"standalone","background_color":"#12102a","theme_color":"#12102a","icons":[{"src":"ilauncher-icon.png","sizes":"180x180","type":"image/png"},{"src":"ilauncher-icon-512.png","sizes":"512x512","type":"image/png"}]}')
# web clip profile: puts the launcher on the iPhone home screen as a full-screen app
bb=io.BytesIO();ic.resize((180,180),Image.LANCZOS).save(bb,'PNG')
clip={'PayloadType':'com.apple.webClip.managed','PayloadVersion':1,'PayloadIdentifier':'com.kotazaic.launcher.webclip','PayloadUUID':'7B0E6C1A-5D3F-4C2B-9A41-6F8E2D1C4B70','PayloadDisplayName':'Kotazaic Launcher','URL':URL,'Label':'Kotazaic','Icon':bb.getvalue(),'IsRemovable':True,'FullScreen':True,'Precomposed':True,'IgnoreManifestScope':True}
prof={'PayloadType':'Configuration','PayloadVersion':1,'PayloadIdentifier':'com.kotazaic.launcher','PayloadUUID':'C3A1F2E4-8B7D-4E6A-B1C2-9D0E5F4A3B21','PayloadDisplayName':'Kotazaic Launcher','PayloadDescription':'Добавляет Kotazaic Launcher на экран «Домой»: все игры с котозайцем в одном приложении.','PayloadOrganization':'Kotazaic','PayloadRemovalDisallowed':False,'PayloadContent':[clip]}
open('KotazaicLauncher.mobileconfig','wb').write(plistlib.dumps(prof))
print(len(h))
