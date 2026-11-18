// ASC3ND code-free review autosave. Anonymous reviewers only read/write their own
// unguessable browser session. Owner notifications reuse existing Supabase outbox.
import { createClient } from "npm:@supabase/supabase-js@2";
const SLUG = "website-review-2026-11";
const SESSION = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const VALID = new Set([
  ...Array.from({ length: 43 }, (_, i) => "request-" + String(i + 1).padStart(2,"0")),
  ...Array.from({ length: 6 }, (_, i) => "client-input-" + (i + 1)),
  "release-header-logo","release-email-spacing","release-privacy","release-youth-safety"
]);
const DECISIONS = new Set(["approve","change","question"]);
function allowed(origin: string): boolean {
  return origin === "https://asc3nd-editoral-docs.vercel.app" ||
    /^https:\/\/asc3nd-editoral-docs-[a-z0-9-]+\.vercel\.app$/.test(origin) ||
    origin === "http://127.0.0.1:4173" || origin === "http://localhost:4173";
}
function cors(origin: string) {
  return {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",
    "Vary":"Origin","Access-Control-Allow-Origin":origin,
    "Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"GET, PUT, OPTIONS",
    "X-Content-Type-Options":"nosniff"};
}
function reply(origin: string, status: number, data: unknown) {
  return new Response(JSON.stringify(data),{status,headers:cors(origin)});
}
function secretKey(): string | undefined {
  const modern=Deno.env.get("SUPABASE_SECRET_KEYS");
  if(modern){try{const parsed=JSON.parse(modern);if(parsed?.default)return parsed.default;}catch{}}
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||undefined;
}
Deno.serve(async (req: Request) => {
  const origin=req.headers.get("origin")||"";
  if(!allowed(origin)) return new Response("Forbidden",{status:403,headers:{"Cache-Control":"no-store"}});
  if(req.method==="OPTIONS")return reply(origin,200,{ok:true});
  if(req.method!=="GET" && req.method!=="PUT")return reply(origin,405,{ok:false,error:"method_not_allowed"});
  const key=secretKey(),url=Deno.env.get("SUPABASE_URL");
  if(!key||!url)return reply(origin,503,{ok:false,error:"review_storage_unconfigured"});
  const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const db=admin.from("asc3nd_client_guide_progress");
  try {
    if(req.method==="GET"){
      const session=new URL(req.url).searchParams.get("session")||"";
      if(!SESSION.test(session))return reply(origin,400,{ok:false,error:"invalid_session"});
      const {data,error}=await db.select("client_key,state").eq("guide_slug",SLUG)
        .like("client_key","public:"+session+":%").limit(53);
      if(error)throw new Error("Review read failed");
      const responses:Record<string,unknown>={};
      for(const row of data||[]){
        const id=row.client_key.slice(("public:"+session+":").length);
        if(VALID.has(id))responses[id]={
          decision:row.state?.decision||null,comment:row.state?.comment||"",
          updatedAt:row.state?.updatedAt||null,reviewerName:row.state?.reviewerName||""
        };
      }
      return reply(origin,200,{ok:true,responses});
    }
    const length=Number(req.headers.get("content-length")||"0");
    if(length>4500)return reply(origin,413,{ok:false,error:"payload_too_large"});
    const input=await req.json().catch(()=>null);
    if(!input||typeof input!=="object"||Array.isArray(input))
      return reply(origin,400,{ok:false,error:"invalid_payload"});
    const {session,slideId,comment,decision,reviewerName,slideNumber}=input;
    if(typeof session!=="string"||!SESSION.test(session)||!VALID.has(slideId))
      return reply(origin,400,{ok:false,error:"invalid_review"});
    if(typeof comment!=="string"||comment.length>3000||comment.includes("\u0000"))
      return reply(origin,400,{ok:false,error:"invalid_comment"});
    if(decision!==null&&!DECISIONS.has(decision))
      return reply(origin,400,{ok:false,error:"invalid_decision"});
    if(typeof reviewerName!=="string"||reviewerName.length>80)
      return reply(origin,400,{ok:false,error:"invalid_name"});
    if(!Number.isInteger(slideNumber)||slideNumber<1||slideNumber>53)
      return reply(origin,400,{ok:false,error:"invalid_page"});
    const client_key="public:"+session+":"+slideId;
    const {data:prior,error:readError}=await db.select("state").eq("guide_slug",SLUG)
      .eq("client_key",client_key).maybeSingle();
    if(readError)throw new Error("Review lookup failed");
    const previous=prior?.state||{};
    if(previous.comment===comment&&previous.decision===decision&&previous.reviewerName===reviewerName)
      return reply(origin,200,{ok:true,unchanged:true,updatedAt:previous.updatedAt});
    const now=new Date();
    if(previous.updatedAt && now.getTime()-new Date(previous.updatedAt).getTime()<500)
      return reply(origin,429,{ok:false,error:"too_many_edits"});
    const lastNotify=previous.lastNotifiedAt?new Date(previous.lastNotifiedAt).getTime():0;
    const shouldNotify=Boolean(comment.trim()||decision) && now.getTime()-lastNotify>=120000;
    const state={
      slideId,slideNumber,comment,decision,reviewerName,
      updatedAt:now.toISOString(),lastNotifiedAt:shouldNotify?now.toISOString():previous.lastNotifiedAt||null,
      notifyOwner:shouldNotify,
      history:[...(Array.isArray(previous.history)?previous.history.slice(-19):[]),
        {comment,decision,updatedAt:now.toISOString()}].slice(-20)
    };
    const {error:saveError}=await db.upsert({guide_slug:SLUG,client_key,state},
      {onConflict:"guide_slug,client_key"});
    if(saveError)throw new Error("Review write failed");
    return reply(origin,200,{ok:true,updatedAt:state.updatedAt,ownerNotificationQueued:shouldNotify});
  }catch(error){
    console.error("ASC3ND editbook review error",error instanceof Error?error.message:"unknown");
    return reply(origin,503,{ok:false,error:"cloud_save_unavailable"});
  }
});
