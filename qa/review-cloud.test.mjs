import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
const endpoint="https://cyxdevcjycmffhmwxojh.supabase.co/functions/v1/asc3nd-editbook-review";
const origin="http://127.0.0.1:4173";
const session=randomUUID();
async function call(method,body,customOrigin=origin){
  const url=method==="GET"?endpoint+"?session="+encodeURIComponent(session):endpoint;
  const res=await fetch(url,{
    method,
    headers:{"Origin":customOrigin,"Content-Type":"application/json"},
    body:method==="PUT"?JSON.stringify(body):undefined,
    signal:AbortSignal.timeout(16000)
  });
  return {status:res.status,json:await res.json().catch(()=>null)};
}
test("no-code public review API can persist, read own notes and deny cross-session reads", async()=>{
  const payload={session,slideId:"request-01",slideNumber:1,
    comment:"",decision:null,reviewerName:""};
  const saved=await call("PUT",payload);
  assert.equal(saved.status,200,JSON.stringify(saved.json));
  assert.equal(saved.json?.ok,true);
  const read=await call("GET");
  assert.equal(read.status,200,JSON.stringify(read.json));
  assert.deepEqual(read.json.responses["request-01"].comment,"");
  assert.equal(Object.keys(read.json.responses).length,1);
  const other=await fetch(endpoint+"?session="+randomUUID(),{headers:{Origin:origin},signal:AbortSignal.timeout(16000)});
  assert.equal(other.status,200);
  const remote=await other.json();
  assert.deepEqual(remote.responses,{});
});
test("reject invalid slide, oversize comment and unauthorized origin",async()=>{
 const base={session,slideId:"invalid-foo",slideNumber:1,comment:"",decision:null,reviewerName:""};
 assert.equal((await call("PUT",base)).status,400);
 assert.equal((await call("PUT",{...base,slideId:"request-01",comment:"x".repeat(3001)})).status,400);
 const forbidden=await call("PUT",{...base,slideId:"request-01"},"https://untrusted.example");
 assert.equal(forbidden.status,403);
});
