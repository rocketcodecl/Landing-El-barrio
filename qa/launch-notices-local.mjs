import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import bcrypt from 'bcryptjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=await mkdtemp(path.join(tmpdir(),'elbarrio-launch-'));
const active='11111111-1111-4111-8111-111111111111';
const draft='22222222-2222-4222-8222-222222222222';
const beta='11111111-1111-1111-1111-111111111111';
const ids=['a'.repeat(24),'b'.repeat(24),'c'.repeat(24),'d'.repeat(24)];
const people=[
 {id:ids[0],nombre:'QA Activo',correo:'active@example.invalid',comuna:'Las Condes',whatsapp:'+56912345678',participantType:'vecino',neighborhoodId:active,uvCode:'024',mirrorStatus:'legacy'},
 {id:ids[1],nombre:'QA Draft',correo:'draft@example.invalid',comuna:'Las Condes',whatsapp:'+56912345679',participantType:'servicio',neighborhoodId:draft,uvCode:'016',mirrorStatus:'legacy'},
 {id:ids[2],nombre:'QA Sin UV',correo:'other@example.invalid',comuna:'Las Condes',whatsapp:'+56912345670',participantType:'comercio',neighborhoodId:null,mirrorStatus:'legacy'},
 {id:ids[3],nombre:'Fernando Beta',correo:'beta@example.invalid',comuna:'Las Condes',whatsapp:'+56912345671',participantType:'vecino',neighborhoodId:beta,uvCode:'C-4',uvName:'El Barrio',mirrorStatus:'legacy'}
];
await writeFile(path.join(data,'waitlist.json'),JSON.stringify(people));
await writeFile(path.join(data,'users.json'),JSON.stringify([{username:'qa_admin',passwordHash:await bcrypt.hash('qa-password',7)}]));
const mock=path.join(data,'mock-fetch.mjs');
await writeFile(mock,[
 "globalThis.fetch=async (input,init)=>{",
 "if(!String(input).endsWith('/rest/v1/rpc/landing_notice_uv_states_contabo'))throw Error('Unexpected outbound fetch');",
 "const body=JSON.parse(init.body||'{}');",
 "if(body.p_token!=='qa-token')return new Response('{}',{status:403});",
 "const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',c='11111111-1111-1111-1111-111111111111';",
 "const states=body.p_ids.filter(id=>id===a||id===b||id===c).map(id=>({neighborhoodId:id,uvCode:id===a?'024':id===b?'016':'C-4',comuna:'LAS CONDES',uvName:id===c?'El Barrio':id===a?'UV Activa':'UV Borrador',launchStatus:id===a?'active':'draft',isActive:true,eligible:id!==b,noticeMode:id===c?'beta':'launch'}));",
 "return new Response(JSON.stringify(states),{status:200,headers:{'Content-Type':'application/json'}});",
 "};"
].join('\n'));
const freePort=()=>new Promise((resolve,reject)=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});s.on('error',reject);});
const port=await freePort();
const server=spawn(process.execPath,['--import',mock,path.join(root,'server/index.mjs')],{
 cwd:root,env:{...process.env,PORT:String(port),DATA_DIR:data,ELBARRIO_DATA_DIR:data,AUTH_SECRET:'qa-secret',SUPABASE_PROJECT_URL:'https://mock.supabase.invalid',SUPABASE_PUBLIC_KEY:'sb_publishable_qa',CONTABO_BRIDGE_TOKEN:'qa-token'},stdio:['ignore','pipe','pipe']
});
let stderr='';server.stderr.on('data',c=>stderr+=c.toString().slice(0,1600));
const base='http://127.0.0.1:'+port;
const assert=(cond,msg)=>{if(!cond)throw Error(msg)};
async function req(uri,options={}){const r=await fetch(base+uri,options);return {status:r.status,body:await r.json().catch(()=>null),headers:r.headers};}
try{
 let ready=false;
 for(let i=0;i<45;i++){await new Promise(r=>setTimeout(r,120));try{if((await req('/api/health')).status===200){ready=true;break}}catch{}}
 assert(ready,'Server not ready: '+stderr);
 assert((await req('/api/launch-notices')).status===401,'GET leaked');
 assert((await req('/api/launch-notices/'+ids[0]+'/prepare',{method:'POST'})).status===401,'POST leaked');
 const login=await req('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'qa_admin',password:'qa-password'})});
 assert(login.status===200,'Login failed');
 const headers={Cookie:login.headers.get('set-cookie').split(';')[0],'Content-Type':'application/json',Origin:'https://elbarrio.lat'};
 const get=()=>req('/api/launch-notices',{headers});
 const post=(id,action,body={})=>req('/api/launch-notices/'+id+'/'+action,{method:'POST',headers,body:JSON.stringify(body)});
 let list=await get();
 assert(list.status===200,'GET failed');
 assert(list.body.summary.total===4&&list.body.summary.eligible===2&&list.body.summary.withoutUv===1,'Counts wrong');
 assert(list.body.rows.find(x=>x.id===ids[1]).canPrepare===false,'Draft eligible by mistake');
 assert(list.body.rows.find(x=>x.id===ids[3]).uvName==='El Barrio','Beta community label missing');
 assert(list.body.rows.find(x=>x.id===ids[3]).canPrepare===true,'Active beta remains blocked');
 assert((await post(ids[1],'prepare')).status===409,'Draft not blocked');
 assert((await post(ids[2],'prepare')).status===409,'Unmapped not blocked');
 const betaPrepared=await post(ids[3],'prepare');
 assert(betaPrepared.status===200,'Beta should prepare');
 const betaText=new URL(betaPrepared.body.whatsappUrl).searchParams.get('text');
 assert(betaText.includes('como comunidad beta'),'Beta text must not imply general launch');
 assert(betaText.includes('https://play.google.com/store/apps/details?id=lat.elbarrio.app')&&betaText.includes('https://apps.apple.com/cl/app/el-barrio/id6828169099'),'Beta store links missing');
 assert((await post(ids[0],'confirm',{confirmation:'MENSAJE_ENVIADO'})).status===409,'Unprepared confirmed');
 let prepared=await post(ids[0],'prepare');
 assert(prepared.status===200,'Active prepare failed');
 assert(new URL(prepared.body.whatsappUrl).searchParams.get('text').includes('https://play.google.com/store/apps/details?id=lat.elbarrio.app'),'Play link missing');
 assert(new URL(prepared.body.whatsappUrl).searchParams.get('text').includes('https://apps.apple.com/cl/app/el-barrio/id6828169099'),'Apple link missing');
 assert((await post(ids[0],'confirm',{confirmation:'WRONG'})).status===400,'Wrong confirmation accepted');
 assert((await req('/api/launch-notices/'+ids[0]+'/confirm',{method:'POST',headers:{...headers,Origin:'https://evil.example'},body:JSON.stringify({confirmation:'MENSAJE_ENVIADO'})})).status===403,'Bad origin accepted');
 const done=await post(ids[0],'confirm',{confirmation:'MENSAJE_ENVIADO'});
 assert(done.status===200,'Send confirmation failed');
 assert((await post(ids[0],'prepare')).status===409,'Duplicate prepare accepted');
 assert((await post(ids[0],'confirm',{confirmation:'MENSAJE_ENVIADO'})).status===409,'Double confirmation accepted');
 list=await get();
 assert(list.body.summary.sent===1&&list.body.summary.eligible===1,'Final summary wrong');
 const audit=JSON.parse(await readFile(path.join(data,'launch-notices.json')));
 assert(Object.keys(audit).length===2&&audit[ids[0]].status==='sent'&&audit[ids[3]].status==='prepared'&&audit[ids[3]].noticeMode==='beta','Audit incorrect');
 assert(!JSON.stringify(audit).includes('56912345678'),'Audit leaks phone number');
 console.log('LAUNCH_NOTICES_QA_OK',JSON.stringify({auth:true,draftBlocked:true,unmappedBlocked:true,activePrepare:true,betaPrepare:true,stores:true,betaCopy:true,manualConfirm:true,duplicateBlocked:true,noPhonePersisted:true}));
}finally{
 server.kill('SIGTERM');
 await new Promise(resolve=>{server.once('exit',resolve);setTimeout(resolve,1200)});
 await rm(data,{recursive:true,force:true});
}
