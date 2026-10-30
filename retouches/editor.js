(() => {
  const API='https://mc-retouches-api.matt-889.workers.dev'
  const get=id=>document.getElementById(id)
  const state={token:null,original:null,current:null,versions:[],history:[],proposal:null,busy:false,comparison:null,ready:false}
  try {
    const incoming=new URLSearchParams(location.hash.slice(1)).get('access')
    if (incoming && /^[A-Za-z0-9_-]{43}$/.test(incoming)) sessionStorage.setItem('retouches-access',incoming)
    state.token=sessionStorage.getItem('retouches-access')
  } catch {}
  function error(message) { get('edit-error').textContent=message; get('edit-error').hidden=false }
  function clearError() { get('edit-error').hidden=true; get('edit-error').textContent='' }
  function controls() {
    get('editor-controls').disabled=!state.ready
    get('photo-upload').disabled=state.busy
    get('edit-request').disabled=state.busy
    get('create-retouch').disabled=state.busy || !state.original
    get('send-chat').disabled=state.busy || !state.original
    get('apply-proposal').disabled=state.busy
    get('chat-message').disabled=state.busy
    get('retouch-version').disabled=state.busy
  }
  async function request(path,body) {
    const response=await fetch(`${API}/api/${path}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${state.token}`,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})})
    const data=await response.json()
    if (!response.ok) {
      if (response.status===401) { state.ready=false; controls() }
      throw new Error(data.error || 'The editing service could not complete this request.')
    }
    if (Number.isFinite(data.remainingEdits)) get('editor-access').textContent=`Private editing is ready. ${data.remainingEdits} shared retouches remain today.`
    return data
  }
  async function busy(label,action) {
    if (state.busy) return
    state.busy=true
    controls()
    clearError()
    const started=Date.now()
    const update=()=>{ get('editor-status').textContent=`${label} ${Math.floor((Date.now()-started)/1000)} seconds. ${label.startsWith('Retouching')?'Retouching can take a few minutes.':'Please keep this tab open.'}` }
    update()
    const timer=setInterval(update,5000)
    try { await action() } catch(failure) { error(failure.message); get('editor-status').textContent='The request did not complete. Your original is still available.' }
    finally { clearInterval(timer); state.busy=false; controls() }
  }
  function addMessage(role,text) {
    const item=document.createElement('li')
    const speaker=document.createElement('span')
    speaker.className='speaker'
    speaker.textContent=role==='user'?'You':'Retouch assistant'
    const message=document.createElement('p')
    message.textContent=text
    item.append(speaker,message)
    get('retouch-conversation').append(item)
    item.scrollIntoView({block:'nearest'})
    state.history.push({role,text})
    state.history=state.history.slice(-8)
  }
  const dataUrl=blob=>new Promise((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload=()=>resolve(reader.result)
    reader.onerror=()=>reject(new Error('The photograph could not be opened.'))
    reader.readAsDataURL(blob)
  })
  async function prepare(file) {
    if (file.size>20_000_000) throw new Error('Choose a photograph smaller than 20 MB.')
    if (!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type)) throw new Error('Choose a JPEG, PNG or WebP photograph.')
    let bitmap
    try { bitmap=await createImageBitmap(file,{imageOrientation:'from-image'}) } catch { throw new Error('This browser cannot open that photograph. Save it as a JPEG and try again.') }
    if (bitmap.width/bitmap.height>3 || bitmap.height/bitmap.width>3) { bitmap.close(); throw new Error('Choose a photograph with a standard landscape or portrait shape.') }
    const scale=Math.min(1,2048/Math.max(bitmap.width,bitmap.height))
    const canvas=document.createElement('canvas')
    canvas.width=Math.round(bitmap.width*scale)
    canvas.height=Math.round(bitmap.height*scale)
    const context=canvas.getContext('2d')
    if (!context) { bitmap.close(); throw new Error('This browser could not prepare the photograph.') }
    context.drawImage(bitmap,0,0,canvas.width,canvas.height)
    bitmap.close()
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.86))
    if (!blob || blob.size>3_000_000) throw new Error('Try a smaller photograph; this one is too large to prepare.')
    return {url:await dataUrl(blob),ratio:`${canvas.width} / ${canvas.height}`}
  }
  function buildComparison() {
    const section=document.querySelector('.studies .study').cloneNode(true)
    section.dataset.photo='uploaded'
    section.querySelector('h3').textContent='Your retouch'
    section.querySelector('h3').id='uploaded-heading'
    section.setAttribute('aria-labelledby','uploaded-heading')
    section.querySelector('.notes').remove()
    const range=section.querySelector('input[type="range"]')
    range.id='uploaded-reveal'
    range.setAttribute('aria-label','Uploaded photo divider: original left, retouched right')
    section.querySelector('label').setAttribute('for',range.id)
    const output=section.querySelector('output')
    output.id='uploaded-percent'
    const help=section.querySelector('.comparison + .photo-labels + div')
    help.id='uploaded-help'
    const comparison=section.querySelector('.comparison')
    comparison.setAttribute('aria-label','Your photo: original and current retouch')
    const handle=section.querySelector('.drag-handle')
    handle.setAttribute('aria-label','Drag your photo comparison handle: original left, retouched right')
    handle.setAttribute('aria-describedby',help.id)
    const original=section.querySelector('.original')
    const after=section.querySelector('.retouched')
    original.alt='Your original photograph'
    after.alt='Your selected AI retouch'
    const divider=section.querySelector('.divider')
    function set(value) {
      value=Math.max(0,Math.min(100,value))
      range.value=value
      output.value=`${value}%`
      after.style.clipPath=`inset(0 0 0 ${value}%)`
      divider.style.left=`${value}%`
      divider.hidden=value===0 || value===100
      handle.style.left=`clamp(24px, ${value}%, calc(100% - 24px))`
      section.querySelector('.original-label').hidden=value<20
      section.querySelector('.retouched-label').hidden=value>80
      section.querySelectorAll('[data-reveal]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.reveal)===value)))
    }
    range.addEventListener('input',()=>set(Number(range.value)))
    section.querySelectorAll('[data-reveal]').forEach(button=>button.addEventListener('click',()=>set(Number(button.dataset.reveal))))
    let pointer=null
    function move(event) { const bounds=comparison.getBoundingClientRect(); set(Math.round((event.clientX-bounds.left)/bounds.width*100)) }
    comparison.addEventListener('pointerdown',event=>{ if(event.button!==0)return; pointer=event.pointerId; comparison.setPointerCapture(pointer); move(event) })
    comparison.addEventListener('pointermove',event=>{ if(event.pointerId===pointer)move(event) })
    for(const name of ['pointerup','pointercancel']) comparison.addEventListener(name,event=>{ if(event.pointerId!==pointer)return; pointer=null; if(comparison.hasPointerCapture(event.pointerId))comparison.releasePointerCapture(event.pointerId) })
    handle.addEventListener('keydown',event=>{ const values={ArrowLeft:Number(range.value)-5,ArrowRight:Number(range.value)+5,Home:0,End:100}; if(!(event.key in values))return; event.preventDefault(); set(values[event.key]) })
    get('result-comparison').replaceChildren(section)
    return (url,ratio)=>{ original.src=state.original; after.src=url; comparison.style.aspectRatio=ratio; set(50) }
  }
  function showVersion(index) {
    state.proposal=null
    get('edit-proposal').hidden=true
    const version=state.versions[index]
    state.current=version.image
    get('retouch-version').value=String(index)
    get('download-retouch').href=version.image
    get('download-retouch').download=`retouch-${index+1}.jpg`
    state.comparison(version.image,state.ratio)
  }
  async function retouch(prompt) {
    if (!state.original) return error('Choose an original photograph first.')
    if (!prompt.trim()) return error('Describe the changes you would like.')
    await busy('Retouching your photograph.',async()=>{
      const result=await request('edit',{original:state.original,current:state.current,prompt})
      if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(result.image || '')) throw new Error('The service did not return a valid photograph.')
      state.versions.push({image:result.image,prompt})
      const option=document.createElement('option')
      option.value=String(state.versions.length-1)
      option.textContent=`Version ${state.versions.length}`
      get('retouch-version').append(option)
      if (!state.comparison) state.comparison=buildComparison()
      showVersion(state.versions.length-1)
      get('uploaded-result').hidden=false
      get('upload-preview').hidden=true
      get('edit-proposal').hidden=true
      state.proposal=null
      addMessage('user',`Retouch requested: ${prompt}`)
      addMessage('assistant',`Version ${state.versions.length} is ready. Compare it with your original above, or ask for another adjustment.`)
      get('editor-status').textContent=`Version ${state.versions.length} is ready. ${result.remainingEdits} shared retouches remain today.`
    })
  }
  get('photo-upload').addEventListener('change',async()=>{
    const file=get('photo-upload').files[0]
    if (!file) return
    await busy('Preparing your photograph.',async()=>{
      const prepared=await prepare(file)
      state.original=prepared.url
      state.ratio=prepared.ratio
      state.current=null
      state.versions=[]
      state.history=[]
      state.proposal=null
      state.comparison=null
      get('retouch-conversation').replaceChildren()
      get('retouch-version').replaceChildren()
      get('result-comparison').replaceChildren()
      get('uploaded-result').hidden=true
      get('edit-proposal').hidden=true
      get('uploaded-original').src=state.original
      get('upload-preview').hidden=false
      get('editor-status').textContent='Original loaded. Describe the changes, then press Retouch photo, or start with a question in chat.'
    })
  })
  get('create-retouch').addEventListener('click',()=>retouch(get('edit-request').value))
  get('apply-proposal').addEventListener('click',()=>{ if(state.proposal)retouch(state.proposal) })
  get('retouch-version').addEventListener('change',()=>showVersion(Number(get('retouch-version').value)))
  get('chat-form').addEventListener('submit',async event=>{
    event.preventDefault()
    const message=get('chat-message').value.trim()
    if (!message || !state.original) return
    const history=[...state.history]
    await busy('Reading your photograph and message.',async()=>{
      get('edit-proposal').hidden=true
      state.proposal=null
      const reply=await request('chat',{original:state.original,current:state.current,message,history})
      addMessage('user',message)
      addMessage('assistant',reply.reply)
      get('chat-message').value=''
      if (reply.editPrompt) { state.proposal=reply.editPrompt; get('proposed-edit').textContent=reply.editPrompt; get('edit-proposal').hidden=false }
      get('editor-status').textContent=reply.editPrompt?'A change is proposed below. Press Apply this edit to generate it.':'Reply ready. No new retouch was generated.'
    })
  })
  controls()
  if (state.token) request('session').then(result=>{ state.ready=true; controls(); get('editor-access').textContent=`Private editing is ready. ${result.remainingEdits} shared retouches remain today.` }).catch(failure=>{ get('editor-access').textContent=failure.message })
})()
