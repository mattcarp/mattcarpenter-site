import json,time,urllib.request,urllib.parse,xml.etree.ElementTree as ET
UA={'User-Agent':'mc-briefings/1.0 (preview)'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=20).read()
now=int(time.time()); since=now-30*86400
topics={
 'voice':['on-device voice assistant','local speech recognition','offline TTS'],
 'edge':['Jetson','edge AI','NPU'],
 'sdr':['SDR','software defined radio','RTL-SDR'],
 'sotto':['Sotto Sound'],
 'malta':['Malta'],
 'agents':['AI agents','agentic'],
}
out={'hn':{},'reddit':{},'github':{},'gnews':{},'errors':{}}
for t,qs in topics.items():
    for q in qs:
        try:
            u='https://hn.algolia.com/api/v1/search?'+urllib.parse.urlencode({'query':q,'tags':'story','numericFilters':f'created_at_i>{since}','hitsPerPage':20})
            for h in json.loads(get(u))['hits']:
                out['hn'].setdefault(t,[]).append({'title':h['title'],'url':h.get('url') or f"https://news.ycombinator.com/item?id={h['objectID']}",'hn':f"https://news.ycombinator.com/item?id={h['objectID']}",'points':h.get('points',0),'ts':h['created_at_i']})
        except Exception as e: out['errors'][f'hn:{q}']=str(e)
        try:
            u='https://news.google.com/rss/search?'+urllib.parse.urlencode({'q':q+' when:30d','hl':'en-US','gl':'US','ceid':'US:en'})
            r=ET.fromstring(get(u))
            for it in r.iter('item'):
                out['gnews'].setdefault(t,[]).append({'title':it.findtext('title'),'url':it.findtext('link'),'date':it.findtext('pubDate'),'src':it.findtext('source')})
        except Exception as e: out['errors'][f'gn:{q}']=str(e)
for sub in ['LocalLLaMA','RTLSDR','malta','sdr','JetsonNano']:
    try:
        d=json.loads(get(f'https://www.reddit.com/r/{sub}/top.json?t=week&limit=25'))
        out['reddit'][sub]=[{'title':c['data']['title'],'url':'https://www.reddit.com'+c['data']['permalink'],'ext':c['data'].get('url'),'score':c['data']['score']} for c in d['data']['children']]
    except Exception as e: out['errors'][f'reddit:{sub}']=str(e)
d=time.strftime('%Y-%m-%d',time.gmtime(since))
for t,q in [('voice','speech-to-text OR text-to-speech local'),('agents','ai agent'),('sdr','sdr'),('edge','jetson')]:
    try:
        u='https://api.github.com/search/repositories?'+urllib.parse.urlencode({'q':f'{q} created:>{d}','sort':'stars','per_page':8})
        out['github'][t]=[{'title':r['full_name']+': '+(r['description'] or ''),'url':r['html_url'],'stars':r['stargazers_count']} for r in json.loads(get(u))['items']]
    except Exception as e: out['errors'][f'gh:{t}']=str(e)
json.dump(out,open('raw.json','w'),indent=1)
for k in ['hn','gnews','github','reddit']: print(k,{a:len(b) for a,b in out[k].items()})
print(out['errors'])
