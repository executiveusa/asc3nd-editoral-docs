// Same-site Vercel Function. Requires server-only env and separate client/staff access tokens.
// Reuses ASC3ND's existing client guide + progress tables. No volunteer data in this API.
import { createHash, timingSafeEqual } from "node:crypto";

const SLUG = "website-review-2026-11";
// IDs must match the reader slides; preserve legacy IDs for previously saved reviews.
const VALID_SLIDES = new Set([...Array.from({length:43},(_,i)=>`request-${String(i+1).padStart(2,"0")}`),...Array.from({length:6},(_,i)=>`client-input-${i+1}`),"release-header-logo","release-email-spacing","release-privacy","release-youth-safety","story","founders","pillars","footer","giving","events","event-name","event-structure","gallery","involved","project-joy","open"]);
const VALID_DECISIONS = new Set(["approve","change","question"]);
function h(s) { return createHash("sha256").update(String(s)).digest(); }
function equal(a,b) { return timingSafeEqual(h(a),h(b)); }
function auth(req) {
  const raw=req.headers.authorization || "";
  if(!raw.startsWith("Bearer ")) return null;
  const token=raw.slice(7);
  const client=process.env.ASC3ND_REVIEW_CLIENT_TOKEN;
  const staff=process.env.ASC3ND_REVIEW_STAFF_TOKEN;
  if(client && client.length>=24 && equal(token,client)) return "review-client";
  if(staff && staff.length>=24 && equal(token,staff)) return "review-staff";
  return null;
}
function fail(res,status,error){res.setHeader("Cache-Control","no-store");return res.status(status).json({ok:false,error})}
async function db(method,path,body) {
  const base=(process.env.SUPABASE_URL||"").replace(/\/$/,"");
  const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!base||!secret)throw new Error("Review database credentials are not provisioned");
  const r=await fetch(base+"/rest/v1/"+path,{method,headers:{"apikey":secret,"Authorization":"Bearer "+secret,"Content-Type":"application/json","Accept":"application/json","Prefer":"return=representation,resolution=merge-duplicates"},body:body===undefined?undefined:JSON.stringify(body),cache:"no-store"});
  const json=await r.json().catch(()=>null);
  if(!r.ok)throw new Error("Review storage failed ("+r.status+")");
  return json;
}
export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"&&req.method!=="PUT")return fail(res,405,"Method not allowed");
  const reviewer=auth(req);
  if(!reviewer)return fail(res,401,"Reviewer access required");
  try{
    if(req.method==="GET"){
      const rows=await db("GET","asc3nd_client_guide_progress?guide_slug=eq."+SLUG+"&client_key=in.(review-client,review-staff)&select=client_key,state,updated_at");
      const out={};
      for(const row of rows||[])out[row.client_key]={responses:row.state?.responses||{},updatedAt:row.updated_at};
      return res.status(200).json({ok:true,reviewer,reviewers:out});
    }
    const input=req.body;
    if(!input||typeof input!=="object"||Array.isArray(input))return fail(res,400,"Invalid payload");
    const slideId=input.slideId;
    if(typeof slideId!=="string"||!VALID_SLIDES.has(slideId))return fail(res,400,"Unknown slide");
    if(input.decision!==null&&input.decision!==undefined&&!VALID_DECISIONS.has(input.decision))return fail(res,400,"Unknown decision");
    if(input.comment!==undefined&&(typeof input.comment!=="string"||input.comment.length>3000))return fail(res,400,"Comment must be 3000 characters or less");
    const path="asc3nd_client_guide_progress?guide_slug=eq."+SLUG+"&client_key=eq."+reviewer+"&select=client_key,state,updated_at";
    const rows=await db("GET",path);
    const state={...(rows?.[0]?.state||{}),responses:{...(rows?.[0]?.state?.responses||{})}};
    const previous=state.responses[slideId]||{};
    state.responses[slideId]={...previous,...(input.decision!==undefined?{decision:input.decision}:{}),...(input.comment!==undefined?{comment:input.comment}:{}),updatedAt:new Date().toISOString()};
    const saved=await db("POST","asc3nd_client_guide_progress?on_conflict=guide_slug,client_key",[{guide_slug:SLUG,client_key:reviewer,state}]);
    return res.status(200).json({ok:true,reviewer,updatedAt:saved?.[0]?.updated_at||new Date().toISOString()});
  }catch(e){console.error("ASC3ND review persistence:",e.message);return fail(res,503,"Review autosave is unavailable; export your local notes")}
}
