const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/maplibre-gl-kWVbv8B-.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const xh="modulepreload",Sh=function(n){return"/odd-map/"+n},hl={},In=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let l=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=o?.nonce||o?.getAttribute("nonce");r=l(t.map(c=>{if(c=Sh(c),c in hl)return;hl[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":xh,u||(d.as="script"),d.crossOrigin="",d.href=c,a&&d.setAttribute("nonce",a),document.head.appendChild(d),u)return new Promise((p,_)=>{d.addEventListener("load",p),d.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})},Mh=Object.freeze({status:"aborted"});function $(n,e,t){function i(a,l){if(a._zod||Object.defineProperty(a,"_zod",{value:{def:l,constr:o,traits:new Set},enumerable:!1}),a._zod.traits.has(n))return;a._zod.traits.add(n),e(a,l);const c=o.prototype,u=Object.keys(c);for(let h=0;h<u.length;h++){const d=u[h];d in a||(a[d]=c[d].bind(a))}}const r=t?.Parent??Object;class s extends r{}Object.defineProperty(s,"name",{value:n});function o(a){var l;const c=t?.Parent?new s:this;i(c,a),(l=c._zod).deferred??(l.deferred=[]);for(const u of c._zod.deferred)u();return c}return Object.defineProperty(o,"init",{value:i}),Object.defineProperty(o,Symbol.hasInstance,{value:a=>t?.Parent&&a instanceof t.Parent?!0:a?._zod?.traits?.has(n)}),Object.defineProperty(o,"name",{value:n}),o}class Ii extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class Xc extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name="ZodEncodeError"}}const Zc={};function $n(n){return Zc}function qc(n){const e=Object.values(n).filter(i=>typeof i=="number");return Object.entries(n).filter(([i,r])=>e.indexOf(+i)===-1).map(([i,r])=>r)}function Co(n,e){return typeof e=="bigint"?e.toString():e}function ws(n){return{get value(){{const e=n();return Object.defineProperty(this,"value",{value:e}),e}}}}function La(n){return n==null}function Ia(n){const e=n.startsWith("^")?1:0,t=n.endsWith("$")?n.length-1:n.length;return n.slice(e,t)}function yh(n,e){const t=(n.toString().split(".")[1]||"").length,i=e.toString();let r=(i.split(".")[1]||"").length;if(r===0&&/\d?e-\d?/.test(i)){const l=i.match(/\d?e-(\d?)/);l?.[1]&&(r=Number.parseInt(l[1]))}const s=t>r?t:r,o=Number.parseInt(n.toFixed(s).replace(".","")),a=Number.parseInt(e.toFixed(s).replace(".",""));return o%a/10**s}const dl=Symbol("evaluating");function je(n,e,t){let i;Object.defineProperty(n,e,{get(){if(i!==dl)return i===void 0&&(i=dl,i=t()),i},set(r){Object.defineProperty(n,e,{value:r})},configurable:!0})}function fi(n,e,t){Object.defineProperty(n,e,{value:t,writable:!0,enumerable:!0,configurable:!0})}function qn(...n){const e={};for(const t of n){const i=Object.getOwnPropertyDescriptors(t);Object.assign(e,i)}return Object.defineProperties({},e)}function fl(n){return JSON.stringify(n)}function Eh(n){return n.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const Yc="captureStackTrace"in Error?Error.captureStackTrace:(...n)=>{};function dr(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}const bh=ws(()=>{if(typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{const n=Function;return new n(""),!0}catch{return!1}});function Oi(n){if(dr(n)===!1)return!1;const e=n.constructor;if(e===void 0||typeof e!="function")return!0;const t=e.prototype;return!(dr(t)===!1||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)}function jc(n){return Oi(n)?{...n}:Array.isArray(n)?[...n]:n}const Th=new Set(["string","number","symbol"]);function Fi(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Yn(n,e,t){const i=new n._zod.constr(e??n._zod.def);return(!e||t?.parent)&&(i._zod.parent=n),i}function Ee(n){const e=n;if(!e)return{};if(typeof e=="string")return{error:()=>e};if(e?.message!==void 0){if(e?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");e.error=e.message}return delete e.message,typeof e.error=="string"?{...e,error:()=>e.error}:e}function wh(n){return Object.keys(n).filter(e=>n[e]._zod.optin==="optional"&&n[e]._zod.optout==="optional")}const Ah={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]};function Ch(n,e){const t=n._zod.def,i=t.checks;if(i&&i.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const s=qn(n._zod.def,{get shape(){const o={};for(const a in e){if(!(a in t.shape))throw new Error(`Unrecognized key: "${a}"`);e[a]&&(o[a]=t.shape[a])}return fi(this,"shape",o),o},checks:[]});return Yn(n,s)}function Rh(n,e){const t=n._zod.def,i=t.checks;if(i&&i.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const s=qn(n._zod.def,{get shape(){const o={...n._zod.def.shape};for(const a in e){if(!(a in t.shape))throw new Error(`Unrecognized key: "${a}"`);e[a]&&delete o[a]}return fi(this,"shape",o),o},checks:[]});return Yn(n,s)}function Ph(n,e){if(!Oi(e))throw new Error("Invalid input to extend: expected a plain object");const t=n._zod.def.checks;if(t&&t.length>0){const s=n._zod.def.shape;for(const o in e)if(Object.getOwnPropertyDescriptor(s,o)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}const r=qn(n._zod.def,{get shape(){const s={...n._zod.def.shape,...e};return fi(this,"shape",s),s}});return Yn(n,r)}function Lh(n,e){if(!Oi(e))throw new Error("Invalid input to safeExtend: expected a plain object");const t=qn(n._zod.def,{get shape(){const i={...n._zod.def.shape,...e};return fi(this,"shape",i),i}});return Yn(n,t)}function Ih(n,e){const t=qn(n._zod.def,{get shape(){const i={...n._zod.def.shape,...e._zod.def.shape};return fi(this,"shape",i),i},get catchall(){return e._zod.def.catchall},checks:[]});return Yn(n,t)}function Dh(n,e,t){const r=e._zod.def.checks;if(r&&r.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");const o=qn(e._zod.def,{get shape(){const a=e._zod.def.shape,l={...a};if(t)for(const c in t){if(!(c in a))throw new Error(`Unrecognized key: "${c}"`);t[c]&&(l[c]=n?new n({type:"optional",innerType:a[c]}):a[c])}else for(const c in a)l[c]=n?new n({type:"optional",innerType:a[c]}):a[c];return fi(this,"shape",l),l},checks:[]});return Yn(e,o)}function Uh(n,e,t){const i=qn(e._zod.def,{get shape(){const r=e._zod.def.shape,s={...r};if(t)for(const o in t){if(!(o in s))throw new Error(`Unrecognized key: "${o}"`);t[o]&&(s[o]=new n({type:"nonoptional",innerType:r[o]}))}else for(const o in r)s[o]=new n({type:"nonoptional",innerType:r[o]});return fi(this,"shape",s),s}});return Yn(e,i)}function Pi(n,e=0){if(n.aborted===!0)return!0;for(let t=e;t<n.issues.length;t++)if(n.issues[t]?.continue!==!0)return!0;return!1}function ci(n,e){return e.map(t=>{var i;return(i=t).path??(i.path=[]),t.path.unshift(n),t})}function Rr(n){return typeof n=="string"?n:n?.message}function Xn(n,e,t){const i={...n,path:n.path??[]};if(!n.message){const r=Rr(n.inst?._zod.def?.error?.(n))??Rr(e?.error?.(n))??Rr(t.customError?.(n))??Rr(t.localeError?.(n))??"Invalid input";i.message=r}return delete i.inst,delete i.continue,e?.reportInput||delete i.input,i}function Da(n){return Array.isArray(n)?"array":typeof n=="string"?"string":"unknown"}function fr(...n){const[e,t,i]=n;return typeof e=="string"?{message:e,code:"custom",input:t,inst:i}:{...e}}const Kc=(n,e)=>{n.name="$ZodError",Object.defineProperty(n,"_zod",{value:n._zod,enumerable:!1}),Object.defineProperty(n,"issues",{value:e,enumerable:!1}),n.message=JSON.stringify(e,Co,2),Object.defineProperty(n,"toString",{value:()=>n.message,enumerable:!1})},Jc=$("$ZodError",Kc),Qc=$("$ZodError",Kc,{Parent:Error});function Nh(n,e=t=>t.message){const t={},i=[];for(const r of n.issues)r.path.length>0?(t[r.path[0]]=t[r.path[0]]||[],t[r.path[0]].push(e(r))):i.push(e(r));return{formErrors:i,fieldErrors:t}}function Oh(n,e=t=>t.message){const t={_errors:[]},i=r=>{for(const s of r.issues)if(s.code==="invalid_union"&&s.errors.length)s.errors.map(o=>i({issues:o}));else if(s.code==="invalid_key")i({issues:s.issues});else if(s.code==="invalid_element")i({issues:s.issues});else if(s.path.length===0)t._errors.push(e(s));else{let o=t,a=0;for(;a<s.path.length;){const l=s.path[a];a===s.path.length-1?(o[l]=o[l]||{_errors:[]},o[l]._errors.push(e(s))):o[l]=o[l]||{_errors:[]},o=o[l],a++}}};return i(n),t}const Ua=n=>(e,t,i,r)=>{const s=i?Object.assign(i,{async:!1}):{async:!1},o=e._zod.run({value:t,issues:[]},s);if(o instanceof Promise)throw new Ii;if(o.issues.length){const a=new(r?.Err??n)(o.issues.map(l=>Xn(l,s,$n())));throw Yc(a,r?.callee),a}return o.value},Na=n=>async(e,t,i,r)=>{const s=i?Object.assign(i,{async:!0}):{async:!0};let o=e._zod.run({value:t,issues:[]},s);if(o instanceof Promise&&(o=await o),o.issues.length){const a=new(r?.Err??n)(o.issues.map(l=>Xn(l,s,$n())));throw Yc(a,r?.callee),a}return o.value},As=n=>(e,t,i)=>{const r=i?{...i,async:!1}:{async:!1},s=e._zod.run({value:t,issues:[]},r);if(s instanceof Promise)throw new Ii;return s.issues.length?{success:!1,error:new(n??Jc)(s.issues.map(o=>Xn(o,r,$n())))}:{success:!0,data:s.value}},Fh=As(Qc),Cs=n=>async(e,t,i)=>{const r=i?Object.assign(i,{async:!0}):{async:!0};let s=e._zod.run({value:t,issues:[]},r);return s instanceof Promise&&(s=await s),s.issues.length?{success:!1,error:new n(s.issues.map(o=>Xn(o,r,$n())))}:{success:!0,data:s.value}},kh=Cs(Qc),zh=n=>(e,t,i)=>{const r=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return Ua(n)(e,t,r)},Bh=n=>(e,t,i)=>Ua(n)(e,t,i),Vh=n=>async(e,t,i)=>{const r=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return Na(n)(e,t,r)},Gh=n=>async(e,t,i)=>Na(n)(e,t,i),Hh=n=>(e,t,i)=>{const r=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return As(n)(e,t,r)},Wh=n=>(e,t,i)=>As(n)(e,t,i),$h=n=>async(e,t,i)=>{const r=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return Cs(n)(e,t,r)},Xh=n=>async(e,t,i)=>Cs(n)(e,t,i),Zh=/^[cC][^\s-]{8,}$/,qh=/^[0-9a-z]+$/,Yh=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,jh=/^[0-9a-vA-V]{20}$/,Kh=/^[A-Za-z0-9]{27}$/,Jh=/^[a-zA-Z0-9_-]{21}$/,Qh=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,ed=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,pl=n=>n?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${n}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,td=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,nd="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function id(){return new RegExp(nd,"u")}const rd=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,sd=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,od=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,ad=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,ld=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,eu=/^[A-Za-z0-9_-]*$/,cd=/^\+[1-9]\d{6,14}$/,tu="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",ud=new RegExp(`^${tu}$`);function nu(n){const e="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof n.precision=="number"?n.precision===-1?`${e}`:n.precision===0?`${e}:[0-5]\\d`:`${e}:[0-5]\\d\\.\\d{${n.precision}}`:`${e}(?::[0-5]\\d(?:\\.\\d+)?)?`}function hd(n){return new RegExp(`^${nu(n)}$`)}function dd(n){const e=nu({precision:n.precision}),t=["Z"];n.local&&t.push(""),n.offset&&t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const i=`${e}(?:${t.join("|")})`;return new RegExp(`^${tu}T(?:${i})$`)}const fd=n=>{const e=n?`[\\s\\S]{${n?.minimum??0},${n?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${e}$`)},pd=/^-?\d+$/,iu=/^-?\d+(?:\.\d+)?$/,md=/^(?:true|false)$/i,gd=/^[^A-Z]*$/,_d=/^[^a-z]*$/,Gt=$("$ZodCheck",(n,e)=>{var t;n._zod??(n._zod={}),n._zod.def=e,(t=n._zod).onattach??(t.onattach=[])}),ru={number:"number",bigint:"bigint",object:"date"},su=$("$ZodCheckLessThan",(n,e)=>{Gt.init(n,e);const t=ru[typeof e.value];n._zod.onattach.push(i=>{const r=i._zod.bag,s=(e.inclusive?r.maximum:r.exclusiveMaximum)??Number.POSITIVE_INFINITY;e.value<s&&(e.inclusive?r.maximum=e.value:r.exclusiveMaximum=e.value)}),n._zod.check=i=>{(e.inclusive?i.value<=e.value:i.value<e.value)||i.issues.push({origin:t,code:"too_big",maximum:typeof e.value=="object"?e.value.getTime():e.value,input:i.value,inclusive:e.inclusive,inst:n,continue:!e.abort})}}),ou=$("$ZodCheckGreaterThan",(n,e)=>{Gt.init(n,e);const t=ru[typeof e.value];n._zod.onattach.push(i=>{const r=i._zod.bag,s=(e.inclusive?r.minimum:r.exclusiveMinimum)??Number.NEGATIVE_INFINITY;e.value>s&&(e.inclusive?r.minimum=e.value:r.exclusiveMinimum=e.value)}),n._zod.check=i=>{(e.inclusive?i.value>=e.value:i.value>e.value)||i.issues.push({origin:t,code:"too_small",minimum:typeof e.value=="object"?e.value.getTime():e.value,input:i.value,inclusive:e.inclusive,inst:n,continue:!e.abort})}}),vd=$("$ZodCheckMultipleOf",(n,e)=>{Gt.init(n,e),n._zod.onattach.push(t=>{var i;(i=t._zod.bag).multipleOf??(i.multipleOf=e.value)}),n._zod.check=t=>{if(typeof t.value!=typeof e.value)throw new Error("Cannot mix number and bigint in multiple_of check.");(typeof t.value=="bigint"?t.value%e.value===BigInt(0):yh(t.value,e.value)===0)||t.issues.push({origin:typeof t.value,code:"not_multiple_of",divisor:e.value,input:t.value,inst:n,continue:!e.abort})}}),xd=$("$ZodCheckNumberFormat",(n,e)=>{Gt.init(n,e),e.format=e.format||"float64";const t=e.format?.includes("int"),i=t?"int":"number",[r,s]=Ah[e.format];n._zod.onattach.push(o=>{const a=o._zod.bag;a.format=e.format,a.minimum=r,a.maximum=s,t&&(a.pattern=pd)}),n._zod.check=o=>{const a=o.value;if(t){if(!Number.isInteger(a)){o.issues.push({expected:i,format:e.format,code:"invalid_type",continue:!1,input:a,inst:n});return}if(!Number.isSafeInteger(a)){a>0?o.issues.push({input:a,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:n,origin:i,inclusive:!0,continue:!e.abort}):o.issues.push({input:a,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:n,origin:i,inclusive:!0,continue:!e.abort});return}}a<r&&o.issues.push({origin:"number",input:a,code:"too_small",minimum:r,inclusive:!0,inst:n,continue:!e.abort}),a>s&&o.issues.push({origin:"number",input:a,code:"too_big",maximum:s,inclusive:!0,inst:n,continue:!e.abort})}}),Sd=$("$ZodCheckMaxLength",(n,e)=>{var t;Gt.init(n,e),(t=n._zod.def).when??(t.when=i=>{const r=i.value;return!La(r)&&r.length!==void 0}),n._zod.onattach.push(i=>{const r=i._zod.bag.maximum??Number.POSITIVE_INFINITY;e.maximum<r&&(i._zod.bag.maximum=e.maximum)}),n._zod.check=i=>{const r=i.value;if(r.length<=e.maximum)return;const o=Da(r);i.issues.push({origin:o,code:"too_big",maximum:e.maximum,inclusive:!0,input:r,inst:n,continue:!e.abort})}}),Md=$("$ZodCheckMinLength",(n,e)=>{var t;Gt.init(n,e),(t=n._zod.def).when??(t.when=i=>{const r=i.value;return!La(r)&&r.length!==void 0}),n._zod.onattach.push(i=>{const r=i._zod.bag.minimum??Number.NEGATIVE_INFINITY;e.minimum>r&&(i._zod.bag.minimum=e.minimum)}),n._zod.check=i=>{const r=i.value;if(r.length>=e.minimum)return;const o=Da(r);i.issues.push({origin:o,code:"too_small",minimum:e.minimum,inclusive:!0,input:r,inst:n,continue:!e.abort})}}),yd=$("$ZodCheckLengthEquals",(n,e)=>{var t;Gt.init(n,e),(t=n._zod.def).when??(t.when=i=>{const r=i.value;return!La(r)&&r.length!==void 0}),n._zod.onattach.push(i=>{const r=i._zod.bag;r.minimum=e.length,r.maximum=e.length,r.length=e.length}),n._zod.check=i=>{const r=i.value,s=r.length;if(s===e.length)return;const o=Da(r),a=s>e.length;i.issues.push({origin:o,...a?{code:"too_big",maximum:e.length}:{code:"too_small",minimum:e.length},inclusive:!0,exact:!0,input:i.value,inst:n,continue:!e.abort})}}),Rs=$("$ZodCheckStringFormat",(n,e)=>{var t,i;Gt.init(n,e),n._zod.onattach.push(r=>{const s=r._zod.bag;s.format=e.format,e.pattern&&(s.patterns??(s.patterns=new Set),s.patterns.add(e.pattern))}),e.pattern?(t=n._zod).check??(t.check=r=>{e.pattern.lastIndex=0,!e.pattern.test(r.value)&&r.issues.push({origin:"string",code:"invalid_format",format:e.format,input:r.value,...e.pattern?{pattern:e.pattern.toString()}:{},inst:n,continue:!e.abort})}):(i=n._zod).check??(i.check=()=>{})}),Ed=$("$ZodCheckRegex",(n,e)=>{Rs.init(n,e),n._zod.check=t=>{e.pattern.lastIndex=0,!e.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:"regex",input:t.value,pattern:e.pattern.toString(),inst:n,continue:!e.abort})}}),bd=$("$ZodCheckLowerCase",(n,e)=>{e.pattern??(e.pattern=gd),Rs.init(n,e)}),Td=$("$ZodCheckUpperCase",(n,e)=>{e.pattern??(e.pattern=_d),Rs.init(n,e)}),wd=$("$ZodCheckIncludes",(n,e)=>{Gt.init(n,e);const t=Fi(e.includes),i=new RegExp(typeof e.position=="number"?`^.{${e.position}}${t}`:t);e.pattern=i,n._zod.onattach.push(r=>{const s=r._zod.bag;s.patterns??(s.patterns=new Set),s.patterns.add(i)}),n._zod.check=r=>{r.value.includes(e.includes,e.position)||r.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:e.includes,input:r.value,inst:n,continue:!e.abort})}}),Ad=$("$ZodCheckStartsWith",(n,e)=>{Gt.init(n,e);const t=new RegExp(`^${Fi(e.prefix)}.*`);e.pattern??(e.pattern=t),n._zod.onattach.push(i=>{const r=i._zod.bag;r.patterns??(r.patterns=new Set),r.patterns.add(t)}),n._zod.check=i=>{i.value.startsWith(e.prefix)||i.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:e.prefix,input:i.value,inst:n,continue:!e.abort})}}),Cd=$("$ZodCheckEndsWith",(n,e)=>{Gt.init(n,e);const t=new RegExp(`.*${Fi(e.suffix)}$`);e.pattern??(e.pattern=t),n._zod.onattach.push(i=>{const r=i._zod.bag;r.patterns??(r.patterns=new Set),r.patterns.add(t)}),n._zod.check=i=>{i.value.endsWith(e.suffix)||i.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:e.suffix,input:i.value,inst:n,continue:!e.abort})}}),Rd=$("$ZodCheckOverwrite",(n,e)=>{Gt.init(n,e),n._zod.check=t=>{t.value=e.tx(t.value)}});class Pd{constructor(e=[]){this.content=[],this.indent=0,this&&(this.args=e)}indented(e){this.indent+=1,e(this),this.indent-=1}write(e){if(typeof e=="function"){e(this,{execution:"sync"}),e(this,{execution:"async"});return}const i=e.split(`
`).filter(o=>o),r=Math.min(...i.map(o=>o.length-o.trimStart().length)),s=i.map(o=>o.slice(r)).map(o=>" ".repeat(this.indent*2)+o);for(const o of s)this.content.push(o)}compile(){const e=Function,t=this?.args,r=[...(this?.content??[""]).map(s=>`  ${s}`)];return new e(...t,r.join(`
`))}}const Ld={major:4,minor:3,patch:5},ct=$("$ZodType",(n,e)=>{var t;n??(n={}),n._zod.def=e,n._zod.bag=n._zod.bag||{},n._zod.version=Ld;const i=[...n._zod.def.checks??[]];n._zod.traits.has("$ZodCheck")&&i.unshift(n);for(const r of i)for(const s of r._zod.onattach)s(n);if(i.length===0)(t=n._zod).deferred??(t.deferred=[]),n._zod.deferred?.push(()=>{n._zod.run=n._zod.parse});else{const r=(o,a,l)=>{let c=Pi(o),u;for(const h of a){if(h._zod.def.when){if(!h._zod.def.when(o))continue}else if(c)continue;const d=o.issues.length,p=h._zod.check(o);if(p instanceof Promise&&l?.async===!1)throw new Ii;if(u||p instanceof Promise)u=(u??Promise.resolve()).then(async()=>{await p,o.issues.length!==d&&(c||(c=Pi(o,d)))});else{if(o.issues.length===d)continue;c||(c=Pi(o,d))}}return u?u.then(()=>o):o},s=(o,a,l)=>{if(Pi(o))return o.aborted=!0,o;const c=r(a,i,l);if(c instanceof Promise){if(l.async===!1)throw new Ii;return c.then(u=>n._zod.parse(u,l))}return n._zod.parse(c,l)};n._zod.run=(o,a)=>{if(a.skipChecks)return n._zod.parse(o,a);if(a.direction==="backward"){const c=n._zod.parse({value:o.value,issues:[]},{...a,skipChecks:!0});return c instanceof Promise?c.then(u=>s(u,o,a)):s(c,o,a)}const l=n._zod.parse(o,a);if(l instanceof Promise){if(a.async===!1)throw new Ii;return l.then(c=>r(c,i,a))}return r(l,i,a)}}je(n,"~standard",()=>({validate:r=>{try{const s=Fh(n,r);return s.success?{value:s.data}:{issues:s.error?.issues}}catch{return kh(n,r).then(o=>o.success?{value:o.data}:{issues:o.error?.issues})}},vendor:"zod",version:1}))}),Oa=$("$ZodString",(n,e)=>{ct.init(n,e),n._zod.pattern=[...n?._zod.bag?.patterns??[]].pop()??fd(n._zod.bag),n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=String(t.value)}catch{}return typeof t.value=="string"||t.issues.push({expected:"string",code:"invalid_type",input:t.value,inst:n}),t}}),ht=$("$ZodStringFormat",(n,e)=>{Rs.init(n,e),Oa.init(n,e)}),Id=$("$ZodGUID",(n,e)=>{e.pattern??(e.pattern=ed),ht.init(n,e)}),Dd=$("$ZodUUID",(n,e)=>{if(e.version){const i={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[e.version];if(i===void 0)throw new Error(`Invalid UUID version: "${e.version}"`);e.pattern??(e.pattern=pl(i))}else e.pattern??(e.pattern=pl());ht.init(n,e)}),Ud=$("$ZodEmail",(n,e)=>{e.pattern??(e.pattern=td),ht.init(n,e)}),Nd=$("$ZodURL",(n,e)=>{ht.init(n,e),n._zod.check=t=>{try{const i=t.value.trim(),r=new URL(i);e.hostname&&(e.hostname.lastIndex=0,e.hostname.test(r.hostname)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:e.hostname.source,input:t.value,inst:n,continue:!e.abort})),e.protocol&&(e.protocol.lastIndex=0,e.protocol.test(r.protocol.endsWith(":")?r.protocol.slice(0,-1):r.protocol)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:e.protocol.source,input:t.value,inst:n,continue:!e.abort})),e.normalize?t.value=r.href:t.value=i;return}catch{t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:n,continue:!e.abort})}}}),Od=$("$ZodEmoji",(n,e)=>{e.pattern??(e.pattern=id()),ht.init(n,e)}),Fd=$("$ZodNanoID",(n,e)=>{e.pattern??(e.pattern=Jh),ht.init(n,e)}),kd=$("$ZodCUID",(n,e)=>{e.pattern??(e.pattern=Zh),ht.init(n,e)}),zd=$("$ZodCUID2",(n,e)=>{e.pattern??(e.pattern=qh),ht.init(n,e)}),Bd=$("$ZodULID",(n,e)=>{e.pattern??(e.pattern=Yh),ht.init(n,e)}),Vd=$("$ZodXID",(n,e)=>{e.pattern??(e.pattern=jh),ht.init(n,e)}),Gd=$("$ZodKSUID",(n,e)=>{e.pattern??(e.pattern=Kh),ht.init(n,e)}),Hd=$("$ZodISODateTime",(n,e)=>{e.pattern??(e.pattern=dd(e)),ht.init(n,e)}),Wd=$("$ZodISODate",(n,e)=>{e.pattern??(e.pattern=ud),ht.init(n,e)}),$d=$("$ZodISOTime",(n,e)=>{e.pattern??(e.pattern=hd(e)),ht.init(n,e)}),Xd=$("$ZodISODuration",(n,e)=>{e.pattern??(e.pattern=Qh),ht.init(n,e)}),Zd=$("$ZodIPv4",(n,e)=>{e.pattern??(e.pattern=rd),ht.init(n,e),n._zod.bag.format="ipv4"}),qd=$("$ZodIPv6",(n,e)=>{e.pattern??(e.pattern=sd),ht.init(n,e),n._zod.bag.format="ipv6",n._zod.check=t=>{try{new URL(`http://[${t.value}]`)}catch{t.issues.push({code:"invalid_format",format:"ipv6",input:t.value,inst:n,continue:!e.abort})}}}),Yd=$("$ZodCIDRv4",(n,e)=>{e.pattern??(e.pattern=od),ht.init(n,e)}),jd=$("$ZodCIDRv6",(n,e)=>{e.pattern??(e.pattern=ad),ht.init(n,e),n._zod.check=t=>{const i=t.value.split("/");try{if(i.length!==2)throw new Error;const[r,s]=i;if(!s)throw new Error;const o=Number(s);if(`${o}`!==s)throw new Error;if(o<0||o>128)throw new Error;new URL(`http://[${r}]`)}catch{t.issues.push({code:"invalid_format",format:"cidrv6",input:t.value,inst:n,continue:!e.abort})}}});function au(n){if(n==="")return!0;if(n.length%4!==0)return!1;try{return atob(n),!0}catch{return!1}}const Kd=$("$ZodBase64",(n,e)=>{e.pattern??(e.pattern=ld),ht.init(n,e),n._zod.bag.contentEncoding="base64",n._zod.check=t=>{au(t.value)||t.issues.push({code:"invalid_format",format:"base64",input:t.value,inst:n,continue:!e.abort})}});function Jd(n){if(!eu.test(n))return!1;const e=n.replace(/[-_]/g,i=>i==="-"?"+":"/"),t=e.padEnd(Math.ceil(e.length/4)*4,"=");return au(t)}const Qd=$("$ZodBase64URL",(n,e)=>{e.pattern??(e.pattern=eu),ht.init(n,e),n._zod.bag.contentEncoding="base64url",n._zod.check=t=>{Jd(t.value)||t.issues.push({code:"invalid_format",format:"base64url",input:t.value,inst:n,continue:!e.abort})}}),ef=$("$ZodE164",(n,e)=>{e.pattern??(e.pattern=cd),ht.init(n,e)});function tf(n,e=null){try{const t=n.split(".");if(t.length!==3)return!1;const[i]=t;if(!i)return!1;const r=JSON.parse(atob(i));return!("typ"in r&&r?.typ!=="JWT"||!r.alg||e&&(!("alg"in r)||r.alg!==e))}catch{return!1}}const nf=$("$ZodJWT",(n,e)=>{ht.init(n,e),n._zod.check=t=>{tf(t.value,e.alg)||t.issues.push({code:"invalid_format",format:"jwt",input:t.value,inst:n,continue:!e.abort})}}),lu=$("$ZodNumber",(n,e)=>{ct.init(n,e),n._zod.pattern=n._zod.bag.pattern??iu,n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=Number(t.value)}catch{}const r=t.value;if(typeof r=="number"&&!Number.isNaN(r)&&Number.isFinite(r))return t;const s=typeof r=="number"?Number.isNaN(r)?"NaN":Number.isFinite(r)?void 0:"Infinity":void 0;return t.issues.push({expected:"number",code:"invalid_type",input:r,inst:n,...s?{received:s}:{}}),t}}),rf=$("$ZodNumberFormat",(n,e)=>{xd.init(n,e),lu.init(n,e)}),sf=$("$ZodBoolean",(n,e)=>{ct.init(n,e),n._zod.pattern=md,n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=!!t.value}catch{}const r=t.value;return typeof r=="boolean"||t.issues.push({expected:"boolean",code:"invalid_type",input:r,inst:n}),t}}),of=$("$ZodUnknown",(n,e)=>{ct.init(n,e),n._zod.parse=t=>t}),af=$("$ZodNever",(n,e)=>{ct.init(n,e),n._zod.parse=(t,i)=>(t.issues.push({expected:"never",code:"invalid_type",input:t.value,inst:n}),t)});function ml(n,e,t){n.issues.length&&e.issues.push(...ci(t,n.issues)),e.value[t]=n.value}const lf=$("$ZodArray",(n,e)=>{ct.init(n,e),n._zod.parse=(t,i)=>{const r=t.value;if(!Array.isArray(r))return t.issues.push({expected:"array",code:"invalid_type",input:r,inst:n}),t;t.value=Array(r.length);const s=[];for(let o=0;o<r.length;o++){const a=r[o],l=e.element._zod.run({value:a,issues:[]},i);l instanceof Promise?s.push(l.then(c=>ml(c,t,o))):ml(l,t,o)}return s.length?Promise.all(s).then(()=>t):t}});function fs(n,e,t,i,r){if(n.issues.length){if(r&&!(t in i))return;e.issues.push(...ci(t,n.issues))}n.value===void 0?t in i&&(e.value[t]=void 0):e.value[t]=n.value}function cu(n){const e=Object.keys(n.shape);for(const i of e)if(!n.shape?.[i]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${i}": expected a Zod schema`);const t=wh(n.shape);return{...n,keys:e,keySet:new Set(e),numKeys:e.length,optionalKeys:new Set(t)}}function uu(n,e,t,i,r,s){const o=[],a=r.keySet,l=r.catchall._zod,c=l.def.type,u=l.optout==="optional";for(const h in e){if(a.has(h))continue;if(c==="never"){o.push(h);continue}const d=l.run({value:e[h],issues:[]},i);d instanceof Promise?n.push(d.then(p=>fs(p,t,h,e,u))):fs(d,t,h,e,u)}return o.length&&t.issues.push({code:"unrecognized_keys",keys:o,input:e,inst:s}),n.length?Promise.all(n).then(()=>t):t}const cf=$("$ZodObject",(n,e)=>{if(ct.init(n,e),!Object.getOwnPropertyDescriptor(e,"shape")?.get){const a=e.shape;Object.defineProperty(e,"shape",{get:()=>{const l={...a};return Object.defineProperty(e,"shape",{value:l}),l}})}const i=ws(()=>cu(e));je(n._zod,"propValues",()=>{const a=e.shape,l={};for(const c in a){const u=a[c]._zod;if(u.values){l[c]??(l[c]=new Set);for(const h of u.values)l[c].add(h)}}return l});const r=dr,s=e.catchall;let o;n._zod.parse=(a,l)=>{o??(o=i.value);const c=a.value;if(!r(c))return a.issues.push({expected:"object",code:"invalid_type",input:c,inst:n}),a;a.value={};const u=[],h=o.shape;for(const d of o.keys){const p=h[d],_=p._zod.optout==="optional",S=p._zod.run({value:c[d],issues:[]},l);S instanceof Promise?u.push(S.then(m=>fs(m,a,d,c,_))):fs(S,a,d,c,_)}return s?uu(u,c,a,l,i.value,n):u.length?Promise.all(u).then(()=>a):a}}),uf=$("$ZodObjectJIT",(n,e)=>{cf.init(n,e);const t=n._zod.parse,i=ws(()=>cu(e)),r=d=>{const p=new Pd(["shape","payload","ctx"]),_=i.value,S=b=>{const E=fl(b);return`shape[${E}]._zod.run({ value: input[${E}], issues: [] }, ctx)`};p.write("const input = payload.value;");const m=Object.create(null);let f=0;for(const b of _.keys)m[b]=`key_${f++}`;p.write("const newResult = {};");for(const b of _.keys){const E=m[b],T=fl(b),R=d[b]?._zod?.optout==="optional";p.write(`const ${E} = ${S(b)};`),R?p.write(`
        if (${E}.issues.length) {
          if (${T} in input) {
            payload.issues = payload.issues.concat(${E}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${T}, ...iss.path] : [${T}]
            })));
          }
        }
        
        if (${E}.value === undefined) {
          if (${T} in input) {
            newResult[${T}] = undefined;
          }
        } else {
          newResult[${T}] = ${E}.value;
        }
        
      `):p.write(`
        if (${E}.issues.length) {
          payload.issues = payload.issues.concat(${E}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${T}, ...iss.path] : [${T}]
          })));
        }
        
        if (${E}.value === undefined) {
          if (${T} in input) {
            newResult[${T}] = undefined;
          }
        } else {
          newResult[${T}] = ${E}.value;
        }
        
      `)}p.write("payload.value = newResult;"),p.write("return payload;");const w=p.compile();return(b,E)=>w(d,b,E)};let s;const o=dr,a=!Zc.jitless,c=a&&bh.value,u=e.catchall;let h;n._zod.parse=(d,p)=>{h??(h=i.value);const _=d.value;return o(_)?a&&c&&p?.async===!1&&p.jitless!==!0?(s||(s=r(e.shape)),d=s(d,p),u?uu([],_,d,p,h,n):d):t(d,p):(d.issues.push({expected:"object",code:"invalid_type",input:_,inst:n}),d)}});function gl(n,e,t,i){for(const s of n)if(s.issues.length===0)return e.value=s.value,e;const r=n.filter(s=>!Pi(s));return r.length===1?(e.value=r[0].value,r[0]):(e.issues.push({code:"invalid_union",input:e.value,inst:t,errors:n.map(s=>s.issues.map(o=>Xn(o,i,$n())))}),e)}const hu=$("$ZodUnion",(n,e)=>{ct.init(n,e),je(n._zod,"optin",()=>e.options.some(r=>r._zod.optin==="optional")?"optional":void 0),je(n._zod,"optout",()=>e.options.some(r=>r._zod.optout==="optional")?"optional":void 0),je(n._zod,"values",()=>{if(e.options.every(r=>r._zod.values))return new Set(e.options.flatMap(r=>Array.from(r._zod.values)))}),je(n._zod,"pattern",()=>{if(e.options.every(r=>r._zod.pattern)){const r=e.options.map(s=>s._zod.pattern);return new RegExp(`^(${r.map(s=>Ia(s.source)).join("|")})$`)}});const t=e.options.length===1,i=e.options[0]._zod.run;n._zod.parse=(r,s)=>{if(t)return i(r,s);let o=!1;const a=[];for(const l of e.options){const c=l._zod.run({value:r.value,issues:[]},s);if(c instanceof Promise)a.push(c),o=!0;else{if(c.issues.length===0)return c;a.push(c)}}return o?Promise.all(a).then(l=>gl(l,r,n,s)):gl(a,r,n,s)}}),hf=$("$ZodDiscriminatedUnion",(n,e)=>{e.inclusive=!1,hu.init(n,e);const t=n._zod.parse;je(n._zod,"propValues",()=>{const r={};for(const s of e.options){const o=s._zod.propValues;if(!o||Object.keys(o).length===0)throw new Error(`Invalid discriminated union option at index "${e.options.indexOf(s)}"`);for(const[a,l]of Object.entries(o)){r[a]||(r[a]=new Set);for(const c of l)r[a].add(c)}}return r});const i=ws(()=>{const r=e.options,s=new Map;for(const o of r){const a=o._zod.propValues?.[e.discriminator];if(!a||a.size===0)throw new Error(`Invalid discriminated union option at index "${e.options.indexOf(o)}"`);for(const l of a){if(s.has(l))throw new Error(`Duplicate discriminator value "${String(l)}"`);s.set(l,o)}}return s});n._zod.parse=(r,s)=>{const o=r.value;if(!dr(o))return r.issues.push({code:"invalid_type",expected:"object",input:o,inst:n}),r;const a=i.value.get(o?.[e.discriminator]);return a?a._zod.run(r,s):e.unionFallback?t(r,s):(r.issues.push({code:"invalid_union",errors:[],note:"No matching discriminator",discriminator:e.discriminator,input:o,path:[e.discriminator],inst:n}),r)}}),df=$("$ZodIntersection",(n,e)=>{ct.init(n,e),n._zod.parse=(t,i)=>{const r=t.value,s=e.left._zod.run({value:r,issues:[]},i),o=e.right._zod.run({value:r,issues:[]},i);return s instanceof Promise||o instanceof Promise?Promise.all([s,o]).then(([l,c])=>_l(t,l,c)):_l(t,s,o)}});function Ro(n,e){if(n===e)return{valid:!0,data:n};if(n instanceof Date&&e instanceof Date&&+n==+e)return{valid:!0,data:n};if(Oi(n)&&Oi(e)){const t=Object.keys(e),i=Object.keys(n).filter(s=>t.indexOf(s)!==-1),r={...n,...e};for(const s of i){const o=Ro(n[s],e[s]);if(!o.valid)return{valid:!1,mergeErrorPath:[s,...o.mergeErrorPath]};r[s]=o.data}return{valid:!0,data:r}}if(Array.isArray(n)&&Array.isArray(e)){if(n.length!==e.length)return{valid:!1,mergeErrorPath:[]};const t=[];for(let i=0;i<n.length;i++){const r=n[i],s=e[i],o=Ro(r,s);if(!o.valid)return{valid:!1,mergeErrorPath:[i,...o.mergeErrorPath]};t.push(o.data)}return{valid:!0,data:t}}return{valid:!1,mergeErrorPath:[]}}function _l(n,e,t){const i=new Map;let r;for(const a of e.issues)if(a.code==="unrecognized_keys"){r??(r=a);for(const l of a.keys)i.has(l)||i.set(l,{}),i.get(l).l=!0}else n.issues.push(a);for(const a of t.issues)if(a.code==="unrecognized_keys")for(const l of a.keys)i.has(l)||i.set(l,{}),i.get(l).r=!0;else n.issues.push(a);const s=[...i].filter(([,a])=>a.l&&a.r).map(([a])=>a);if(s.length&&r&&n.issues.push({...r,keys:s}),Pi(n))return n;const o=Ro(e.value,t.value);if(!o.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);return n.value=o.data,n}const ff=$("$ZodTuple",(n,e)=>{ct.init(n,e);const t=e.items;n._zod.parse=(i,r)=>{const s=i.value;if(!Array.isArray(s))return i.issues.push({input:s,inst:n,expected:"tuple",code:"invalid_type"}),i;i.value=[];const o=[],a=[...t].reverse().findIndex(u=>u._zod.optin!=="optional"),l=a===-1?0:t.length-a;if(!e.rest){const u=s.length>t.length,h=s.length<l-1;if(u||h)return i.issues.push({...u?{code:"too_big",maximum:t.length,inclusive:!0}:{code:"too_small",minimum:t.length},input:s,inst:n,origin:"array"}),i}let c=-1;for(const u of t){if(c++,c>=s.length&&c>=l)continue;const h=u._zod.run({value:s[c],issues:[]},r);h instanceof Promise?o.push(h.then(d=>Pr(d,i,c))):Pr(h,i,c)}if(e.rest){const u=s.slice(t.length);for(const h of u){c++;const d=e.rest._zod.run({value:h,issues:[]},r);d instanceof Promise?o.push(d.then(p=>Pr(p,i,c))):Pr(d,i,c)}}return o.length?Promise.all(o).then(()=>i):i}});function Pr(n,e,t){n.issues.length&&e.issues.push(...ci(t,n.issues)),e.value[t]=n.value}const pf=$("$ZodRecord",(n,e)=>{ct.init(n,e),n._zod.parse=(t,i)=>{const r=t.value;if(!Oi(r))return t.issues.push({expected:"record",code:"invalid_type",input:r,inst:n}),t;const s=[],o=e.keyType._zod.values;if(o){t.value={};const a=new Set;for(const c of o)if(typeof c=="string"||typeof c=="number"||typeof c=="symbol"){a.add(typeof c=="number"?c.toString():c);const u=e.valueType._zod.run({value:r[c],issues:[]},i);u instanceof Promise?s.push(u.then(h=>{h.issues.length&&t.issues.push(...ci(c,h.issues)),t.value[c]=h.value})):(u.issues.length&&t.issues.push(...ci(c,u.issues)),t.value[c]=u.value)}let l;for(const c in r)a.has(c)||(l=l??[],l.push(c));l&&l.length>0&&t.issues.push({code:"unrecognized_keys",input:r,inst:n,keys:l})}else{t.value={};for(const a of Reflect.ownKeys(r)){if(a==="__proto__")continue;let l=e.keyType._zod.run({value:a,issues:[]},i);if(l instanceof Promise)throw new Error("Async schemas not supported in object keys currently");if(typeof a=="string"&&iu.test(a)&&l.issues.length&&l.issues.some(h=>h.code==="invalid_type"&&h.expected==="number")){const h=e.keyType._zod.run({value:Number(a),issues:[]},i);if(h instanceof Promise)throw new Error("Async schemas not supported in object keys currently");h.issues.length===0&&(l=h)}if(l.issues.length){e.mode==="loose"?t.value[a]=r[a]:t.issues.push({code:"invalid_key",origin:"record",issues:l.issues.map(h=>Xn(h,i,$n())),input:a,path:[a],inst:n});continue}const u=e.valueType._zod.run({value:r[a],issues:[]},i);u instanceof Promise?s.push(u.then(h=>{h.issues.length&&t.issues.push(...ci(a,h.issues)),t.value[l.value]=h.value})):(u.issues.length&&t.issues.push(...ci(a,u.issues)),t.value[l.value]=u.value)}}return s.length?Promise.all(s).then(()=>t):t}}),mf=$("$ZodEnum",(n,e)=>{ct.init(n,e);const t=qc(e.entries),i=new Set(t);n._zod.values=i,n._zod.pattern=new RegExp(`^(${t.filter(r=>Th.has(typeof r)).map(r=>typeof r=="string"?Fi(r):r.toString()).join("|")})$`),n._zod.parse=(r,s)=>{const o=r.value;return i.has(o)||r.issues.push({code:"invalid_value",values:t,input:o,inst:n}),r}}),gf=$("$ZodLiteral",(n,e)=>{if(ct.init(n,e),e.values.length===0)throw new Error("Cannot create literal schema with no valid values");const t=new Set(e.values);n._zod.values=t,n._zod.pattern=new RegExp(`^(${e.values.map(i=>typeof i=="string"?Fi(i):i?Fi(i.toString()):String(i)).join("|")})$`),n._zod.parse=(i,r)=>{const s=i.value;return t.has(s)||i.issues.push({code:"invalid_value",values:e.values,input:s,inst:n}),i}}),_f=$("$ZodTransform",(n,e)=>{ct.init(n,e),n._zod.parse=(t,i)=>{if(i.direction==="backward")throw new Xc(n.constructor.name);const r=e.transform(t.value,t);if(i.async)return(r instanceof Promise?r:Promise.resolve(r)).then(o=>(t.value=o,t));if(r instanceof Promise)throw new Ii;return t.value=r,t}});function vl(n,e){return n.issues.length&&e===void 0?{issues:[],value:void 0}:n}const du=$("$ZodOptional",(n,e)=>{ct.init(n,e),n._zod.optin="optional",n._zod.optout="optional",je(n._zod,"values",()=>e.innerType._zod.values?new Set([...e.innerType._zod.values,void 0]):void 0),je(n._zod,"pattern",()=>{const t=e.innerType._zod.pattern;return t?new RegExp(`^(${Ia(t.source)})?$`):void 0}),n._zod.parse=(t,i)=>{if(e.innerType._zod.optin==="optional"){const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(s=>vl(s,t.value)):vl(r,t.value)}return t.value===void 0?t:e.innerType._zod.run(t,i)}}),vf=$("$ZodExactOptional",(n,e)=>{du.init(n,e),je(n._zod,"values",()=>e.innerType._zod.values),je(n._zod,"pattern",()=>e.innerType._zod.pattern),n._zod.parse=(t,i)=>e.innerType._zod.run(t,i)}),xf=$("$ZodNullable",(n,e)=>{ct.init(n,e),je(n._zod,"optin",()=>e.innerType._zod.optin),je(n._zod,"optout",()=>e.innerType._zod.optout),je(n._zod,"pattern",()=>{const t=e.innerType._zod.pattern;return t?new RegExp(`^(${Ia(t.source)}|null)$`):void 0}),je(n._zod,"values",()=>e.innerType._zod.values?new Set([...e.innerType._zod.values,null]):void 0),n._zod.parse=(t,i)=>t.value===null?t:e.innerType._zod.run(t,i)}),Sf=$("$ZodDefault",(n,e)=>{ct.init(n,e),n._zod.optin="optional",je(n._zod,"values",()=>e.innerType._zod.values),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);if(t.value===void 0)return t.value=e.defaultValue,t;const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(s=>xl(s,e)):xl(r,e)}});function xl(n,e){return n.value===void 0&&(n.value=e.defaultValue),n}const Mf=$("$ZodPrefault",(n,e)=>{ct.init(n,e),n._zod.optin="optional",je(n._zod,"values",()=>e.innerType._zod.values),n._zod.parse=(t,i)=>(i.direction==="backward"||t.value===void 0&&(t.value=e.defaultValue),e.innerType._zod.run(t,i))}),yf=$("$ZodNonOptional",(n,e)=>{ct.init(n,e),je(n._zod,"values",()=>{const t=e.innerType._zod.values;return t?new Set([...t].filter(i=>i!==void 0)):void 0}),n._zod.parse=(t,i)=>{const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(s=>Sl(s,n)):Sl(r,n)}});function Sl(n,e){return!n.issues.length&&n.value===void 0&&n.issues.push({code:"invalid_type",expected:"nonoptional",input:n.value,inst:e}),n}const Ef=$("$ZodCatch",(n,e)=>{ct.init(n,e),je(n._zod,"optin",()=>e.innerType._zod.optin),je(n._zod,"optout",()=>e.innerType._zod.optout),je(n._zod,"values",()=>e.innerType._zod.values),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(s=>(t.value=s.value,s.issues.length&&(t.value=e.catchValue({...t,error:{issues:s.issues.map(o=>Xn(o,i,$n()))},input:t.value}),t.issues=[]),t)):(t.value=r.value,r.issues.length&&(t.value=e.catchValue({...t,error:{issues:r.issues.map(s=>Xn(s,i,$n()))},input:t.value}),t.issues=[]),t)}}),bf=$("$ZodPipe",(n,e)=>{ct.init(n,e),je(n._zod,"values",()=>e.in._zod.values),je(n._zod,"optin",()=>e.in._zod.optin),je(n._zod,"optout",()=>e.out._zod.optout),je(n._zod,"propValues",()=>e.in._zod.propValues),n._zod.parse=(t,i)=>{if(i.direction==="backward"){const s=e.out._zod.run(t,i);return s instanceof Promise?s.then(o=>Lr(o,e.in,i)):Lr(s,e.in,i)}const r=e.in._zod.run(t,i);return r instanceof Promise?r.then(s=>Lr(s,e.out,i)):Lr(r,e.out,i)}});function Lr(n,e,t){return n.issues.length?(n.aborted=!0,n):e._zod.run({value:n.value,issues:n.issues},t)}const Tf=$("$ZodReadonly",(n,e)=>{ct.init(n,e),je(n._zod,"propValues",()=>e.innerType._zod.propValues),je(n._zod,"values",()=>e.innerType._zod.values),je(n._zod,"optin",()=>e.innerType?._zod?.optin),je(n._zod,"optout",()=>e.innerType?._zod?.optout),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(Ml):Ml(r)}});function Ml(n){return n.value=Object.freeze(n.value),n}const wf=$("$ZodCustom",(n,e)=>{Gt.init(n,e),ct.init(n,e),n._zod.parse=(t,i)=>t,n._zod.check=t=>{const i=t.value,r=e.fn(i);if(r instanceof Promise)return r.then(s=>yl(s,t,i,n));yl(r,t,i,n)}});function yl(n,e,t,i){if(!n){const r={code:"custom",input:t,inst:i,path:[...i._zod.def.path??[]],continue:!i._zod.def.abort};i._zod.def.params&&(r.params=i._zod.def.params),e.issues.push(fr(r))}}var El;class Af{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){const i=t[0];return this._map.set(e,i),i&&typeof i=="object"&&"id"in i&&this._idmap.set(i.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){const t=this._map.get(e);return t&&typeof t=="object"&&"id"in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){const t=e._zod.parent;if(t){const i={...this.get(t)??{}};delete i.id;const r={...i,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}}function Cf(){return new Af}(El=globalThis).__zod_globalRegistry??(El.__zod_globalRegistry=Cf());const or=globalThis.__zod_globalRegistry;function Rf(n,e){return new n({type:"string",...Ee(e)})}function Pf(n,e){return new n({type:"string",format:"email",check:"string_format",abort:!1,...Ee(e)})}function bl(n,e){return new n({type:"string",format:"guid",check:"string_format",abort:!1,...Ee(e)})}function Lf(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,...Ee(e)})}function If(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...Ee(e)})}function Df(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...Ee(e)})}function Uf(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...Ee(e)})}function Nf(n,e){return new n({type:"string",format:"url",check:"string_format",abort:!1,...Ee(e)})}function Of(n,e){return new n({type:"string",format:"emoji",check:"string_format",abort:!1,...Ee(e)})}function Ff(n,e){return new n({type:"string",format:"nanoid",check:"string_format",abort:!1,...Ee(e)})}function kf(n,e){return new n({type:"string",format:"cuid",check:"string_format",abort:!1,...Ee(e)})}function zf(n,e){return new n({type:"string",format:"cuid2",check:"string_format",abort:!1,...Ee(e)})}function Bf(n,e){return new n({type:"string",format:"ulid",check:"string_format",abort:!1,...Ee(e)})}function Vf(n,e){return new n({type:"string",format:"xid",check:"string_format",abort:!1,...Ee(e)})}function Gf(n,e){return new n({type:"string",format:"ksuid",check:"string_format",abort:!1,...Ee(e)})}function Hf(n,e){return new n({type:"string",format:"ipv4",check:"string_format",abort:!1,...Ee(e)})}function Wf(n,e){return new n({type:"string",format:"ipv6",check:"string_format",abort:!1,...Ee(e)})}function $f(n,e){return new n({type:"string",format:"cidrv4",check:"string_format",abort:!1,...Ee(e)})}function Xf(n,e){return new n({type:"string",format:"cidrv6",check:"string_format",abort:!1,...Ee(e)})}function Zf(n,e){return new n({type:"string",format:"base64",check:"string_format",abort:!1,...Ee(e)})}function qf(n,e){return new n({type:"string",format:"base64url",check:"string_format",abort:!1,...Ee(e)})}function Yf(n,e){return new n({type:"string",format:"e164",check:"string_format",abort:!1,...Ee(e)})}function jf(n,e){return new n({type:"string",format:"jwt",check:"string_format",abort:!1,...Ee(e)})}function Kf(n,e){return new n({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...Ee(e)})}function Jf(n,e){return new n({type:"string",format:"date",check:"string_format",...Ee(e)})}function Qf(n,e){return new n({type:"string",format:"time",check:"string_format",precision:null,...Ee(e)})}function ep(n,e){return new n({type:"string",format:"duration",check:"string_format",...Ee(e)})}function tp(n,e){return new n({type:"number",checks:[],...Ee(e)})}function np(n,e){return new n({type:"number",check:"number_format",abort:!1,format:"safeint",...Ee(e)})}function ip(n,e){return new n({type:"boolean",...Ee(e)})}function rp(n){return new n({type:"unknown"})}function sp(n,e){return new n({type:"never",...Ee(e)})}function Tl(n,e){return new su({check:"less_than",...Ee(e),value:n,inclusive:!1})}function zs(n,e){return new su({check:"less_than",...Ee(e),value:n,inclusive:!0})}function wl(n,e){return new ou({check:"greater_than",...Ee(e),value:n,inclusive:!1})}function Bs(n,e){return new ou({check:"greater_than",...Ee(e),value:n,inclusive:!0})}function Al(n,e){return new vd({check:"multiple_of",...Ee(e),value:n})}function fu(n,e){return new Sd({check:"max_length",...Ee(e),maximum:n})}function ps(n,e){return new Md({check:"min_length",...Ee(e),minimum:n})}function pu(n,e){return new yd({check:"length_equals",...Ee(e),length:n})}function op(n,e){return new Ed({check:"string_format",format:"regex",...Ee(e),pattern:n})}function ap(n){return new bd({check:"string_format",format:"lowercase",...Ee(n)})}function lp(n){return new Td({check:"string_format",format:"uppercase",...Ee(n)})}function cp(n,e){return new wd({check:"string_format",format:"includes",...Ee(e),includes:n})}function up(n,e){return new Ad({check:"string_format",format:"starts_with",...Ee(e),prefix:n})}function hp(n,e){return new Cd({check:"string_format",format:"ends_with",...Ee(e),suffix:n})}function Xi(n){return new Rd({check:"overwrite",tx:n})}function dp(n){return Xi(e=>e.normalize(n))}function fp(){return Xi(n=>n.trim())}function pp(){return Xi(n=>n.toLowerCase())}function mp(){return Xi(n=>n.toUpperCase())}function gp(){return Xi(n=>Eh(n))}function _p(n,e,t){return new n({type:"array",element:e,...Ee(t)})}function vp(n,e,t){return new n({type:"custom",check:"custom",fn:e,...Ee(t)})}function xp(n){const e=Sp(t=>(t.addIssue=i=>{if(typeof i=="string")t.issues.push(fr(i,t.value,e._zod.def));else{const r=i;r.fatal&&(r.continue=!1),r.code??(r.code="custom"),r.input??(r.input=t.value),r.inst??(r.inst=e),r.continue??(r.continue=!e._zod.def.abort),t.issues.push(fr(r))}},n(t.value,t)));return e}function Sp(n,e){const t=new Gt({check:"custom",...Ee(e)});return t._zod.check=n,t}function mu(n){let e=n?.target??"draft-2020-12";return e==="draft-4"&&(e="draft-04"),e==="draft-7"&&(e="draft-07"),{processors:n.processors??{},metadataRegistry:n?.metadata??or,target:e,unrepresentable:n?.unrepresentable??"throw",override:n?.override??(()=>{}),io:n?.io??"output",counter:0,seen:new Map,cycles:n?.cycles??"ref",reused:n?.reused??"inline",external:n?.external??void 0}}function vt(n,e,t={path:[],schemaPath:[]}){var i;const r=n._zod.def,s=e.seen.get(n);if(s)return s.count++,t.schemaPath.includes(n)&&(s.cycle=t.path),s.schema;const o={schema:{},count:1,cycle:void 0,path:t.path};e.seen.set(n,o);const a=n._zod.toJSONSchema?.();if(a)o.schema=a;else{const u={...t,schemaPath:[...t.schemaPath,n],path:t.path};if(n._zod.processJSONSchema)n._zod.processJSONSchema(e,o.schema,u);else{const d=o.schema,p=e.processors[r.type];if(!p)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${r.type}`);p(n,e,d,u)}const h=n._zod.parent;h&&(o.ref||(o.ref=h),vt(h,e,u),e.seen.get(h).isParent=!0)}const l=e.metadataRegistry.get(n);return l&&Object.assign(o.schema,l),e.io==="input"&&Ut(n)&&(delete o.schema.examples,delete o.schema.default),e.io==="input"&&o.schema._prefault&&((i=o.schema).default??(i.default=o.schema._prefault)),delete o.schema._prefault,e.seen.get(n).schema}function gu(n,e){const t=n.seen.get(e);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=new Map;for(const o of n.seen.entries()){const a=n.metadataRegistry.get(o[0])?.id;if(a){const l=i.get(a);if(l&&l!==o[0])throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);i.set(a,o[0])}}const r=o=>{const a=n.target==="draft-2020-12"?"$defs":"definitions";if(n.external){const h=n.external.registry.get(o[0])?.id,d=n.external.uri??(_=>_);if(h)return{ref:d(h)};const p=o[1].defId??o[1].schema.id??`schema${n.counter++}`;return o[1].defId=p,{defId:p,ref:`${d("__shared")}#/${a}/${p}`}}if(o[1]===t)return{ref:"#"};const c=`#/${a}/`,u=o[1].schema.id??`__schema${n.counter++}`;return{defId:u,ref:c+u}},s=o=>{if(o[1].schema.$ref)return;const a=o[1],{ref:l,defId:c}=r(o);a.def={...a.schema},c&&(a.defId=c);const u=a.schema;for(const h in u)delete u[h];u.$ref=l};if(n.cycles==="throw")for(const o of n.seen.entries()){const a=o[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const o of n.seen.entries()){const a=o[1];if(e===o[0]){s(o);continue}if(n.external){const c=n.external.registry.get(o[0])?.id;if(e!==o[0]&&c){s(o);continue}}if(n.metadataRegistry.get(o[0])?.id){s(o);continue}if(a.cycle){s(o);continue}if(a.count>1&&n.reused==="ref"){s(o);continue}}}function _u(n,e){const t=n.seen.get(e);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=o=>{const a=n.seen.get(o);if(a.ref===null)return;const l=a.def??a.schema,c={...l},u=a.ref;if(a.ref=null,u){i(u);const d=n.seen.get(u),p=d.schema;if(p.$ref&&(n.target==="draft-07"||n.target==="draft-04"||n.target==="openapi-3.0")?(l.allOf=l.allOf??[],l.allOf.push(p)):Object.assign(l,p),Object.assign(l,c),o._zod.parent===u)for(const S in l)S==="$ref"||S==="allOf"||S in c||delete l[S];if(p.$ref)for(const S in l)S==="$ref"||S==="allOf"||S in d.def&&JSON.stringify(l[S])===JSON.stringify(d.def[S])&&delete l[S]}const h=o._zod.parent;if(h&&h!==u){i(h);const d=n.seen.get(h);if(d?.schema.$ref&&(l.$ref=d.schema.$ref,d.def))for(const p in l)p==="$ref"||p==="allOf"||p in d.def&&JSON.stringify(l[p])===JSON.stringify(d.def[p])&&delete l[p]}n.override({zodSchema:o,jsonSchema:l,path:a.path??[]})};for(const o of[...n.seen.entries()].reverse())i(o[0]);const r={};if(n.target==="draft-2020-12"?r.$schema="https://json-schema.org/draft/2020-12/schema":n.target==="draft-07"?r.$schema="http://json-schema.org/draft-07/schema#":n.target==="draft-04"?r.$schema="http://json-schema.org/draft-04/schema#":n.target,n.external?.uri){const o=n.external.registry.get(e)?.id;if(!o)throw new Error("Schema is missing an `id` property");r.$id=n.external.uri(o)}Object.assign(r,t.def??t.schema);const s=n.external?.defs??{};for(const o of n.seen.entries()){const a=o[1];a.def&&a.defId&&(s[a.defId]=a.def)}n.external||Object.keys(s).length>0&&(n.target==="draft-2020-12"?r.$defs=s:r.definitions=s);try{const o=JSON.parse(JSON.stringify(r));return Object.defineProperty(o,"~standard",{value:{...e["~standard"],jsonSchema:{input:ms(e,"input",n.processors),output:ms(e,"output",n.processors)}},enumerable:!1,writable:!1}),o}catch{throw new Error("Error converting schema to JSON.")}}function Ut(n,e){const t=e??{seen:new Set};if(t.seen.has(n))return!1;t.seen.add(n);const i=n._zod.def;if(i.type==="transform")return!0;if(i.type==="array")return Ut(i.element,t);if(i.type==="set")return Ut(i.valueType,t);if(i.type==="lazy")return Ut(i.getter(),t);if(i.type==="promise"||i.type==="optional"||i.type==="nonoptional"||i.type==="nullable"||i.type==="readonly"||i.type==="default"||i.type==="prefault")return Ut(i.innerType,t);if(i.type==="intersection")return Ut(i.left,t)||Ut(i.right,t);if(i.type==="record"||i.type==="map")return Ut(i.keyType,t)||Ut(i.valueType,t);if(i.type==="pipe")return Ut(i.in,t)||Ut(i.out,t);if(i.type==="object"){for(const r in i.shape)if(Ut(i.shape[r],t))return!0;return!1}if(i.type==="union"){for(const r of i.options)if(Ut(r,t))return!0;return!1}if(i.type==="tuple"){for(const r of i.items)if(Ut(r,t))return!0;return!!(i.rest&&Ut(i.rest,t))}return!1}const Mp=(n,e={})=>t=>{const i=mu({...t,processors:e});return vt(n,i),gu(i,n),_u(i,n)},ms=(n,e,t={})=>i=>{const{libraryOptions:r,target:s}=i??{},o=mu({...r??{},target:s,io:e,processors:t});return vt(n,o),gu(o,n),_u(o,n)},yp={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Ep=(n,e,t,i)=>{const r=t;r.type="string";const{minimum:s,maximum:o,format:a,patterns:l,contentEncoding:c}=n._zod.bag;if(typeof s=="number"&&(r.minLength=s),typeof o=="number"&&(r.maxLength=o),a&&(r.format=yp[a]??a,r.format===""&&delete r.format,a==="time"&&delete r.format),c&&(r.contentEncoding=c),l&&l.size>0){const u=[...l];u.length===1?r.pattern=u[0].source:u.length>1&&(r.allOf=[...u.map(h=>({...e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0"?{type:"string"}:{},pattern:h.source}))])}},bp=(n,e,t,i)=>{const r=t,{minimum:s,maximum:o,format:a,multipleOf:l,exclusiveMaximum:c,exclusiveMinimum:u}=n._zod.bag;typeof a=="string"&&a.includes("int")?r.type="integer":r.type="number",typeof u=="number"&&(e.target==="draft-04"||e.target==="openapi-3.0"?(r.minimum=u,r.exclusiveMinimum=!0):r.exclusiveMinimum=u),typeof s=="number"&&(r.minimum=s,typeof u=="number"&&e.target!=="draft-04"&&(u>=s?delete r.minimum:delete r.exclusiveMinimum)),typeof c=="number"&&(e.target==="draft-04"||e.target==="openapi-3.0"?(r.maximum=c,r.exclusiveMaximum=!0):r.exclusiveMaximum=c),typeof o=="number"&&(r.maximum=o,typeof c=="number"&&e.target!=="draft-04"&&(c<=o?delete r.maximum:delete r.exclusiveMaximum)),typeof l=="number"&&(r.multipleOf=l)},Tp=(n,e,t,i)=>{t.type="boolean"},wp=(n,e,t,i)=>{t.not={}},Ap=(n,e,t,i)=>{},Cp=(n,e,t,i)=>{const r=n._zod.def,s=qc(r.entries);s.every(o=>typeof o=="number")&&(t.type="number"),s.every(o=>typeof o=="string")&&(t.type="string"),t.enum=s},Rp=(n,e,t,i)=>{const r=n._zod.def,s=[];for(const o of r.values)if(o===void 0){if(e.unrepresentable==="throw")throw new Error("Literal `undefined` cannot be represented in JSON Schema")}else if(typeof o=="bigint"){if(e.unrepresentable==="throw")throw new Error("BigInt literals cannot be represented in JSON Schema");s.push(Number(o))}else s.push(o);if(s.length!==0)if(s.length===1){const o=s[0];t.type=o===null?"null":typeof o,e.target==="draft-04"||e.target==="openapi-3.0"?t.enum=[o]:t.const=o}else s.every(o=>typeof o=="number")&&(t.type="number"),s.every(o=>typeof o=="string")&&(t.type="string"),s.every(o=>typeof o=="boolean")&&(t.type="boolean"),s.every(o=>o===null)&&(t.type="null"),t.enum=s},Pp=(n,e,t,i)=>{if(e.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},Lp=(n,e,t,i)=>{if(e.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},Ip=(n,e,t,i)=>{const r=t,s=n._zod.def,{minimum:o,maximum:a}=n._zod.bag;typeof o=="number"&&(r.minItems=o),typeof a=="number"&&(r.maxItems=a),r.type="array",r.items=vt(s.element,e,{...i,path:[...i.path,"items"]})},Dp=(n,e,t,i)=>{const r=t,s=n._zod.def;r.type="object",r.properties={};const o=s.shape;for(const c in o)r.properties[c]=vt(o[c],e,{...i,path:[...i.path,"properties",c]});const a=new Set(Object.keys(o)),l=new Set([...a].filter(c=>{const u=s.shape[c]._zod;return e.io==="input"?u.optin===void 0:u.optout===void 0}));l.size>0&&(r.required=Array.from(l)),s.catchall?._zod.def.type==="never"?r.additionalProperties=!1:s.catchall?s.catchall&&(r.additionalProperties=vt(s.catchall,e,{...i,path:[...i.path,"additionalProperties"]})):e.io==="output"&&(r.additionalProperties=!1)},Up=(n,e,t,i)=>{const r=n._zod.def,s=r.inclusive===!1,o=r.options.map((a,l)=>vt(a,e,{...i,path:[...i.path,s?"oneOf":"anyOf",l]}));s?t.oneOf=o:t.anyOf=o},Np=(n,e,t,i)=>{const r=n._zod.def,s=vt(r.left,e,{...i,path:[...i.path,"allOf",0]}),o=vt(r.right,e,{...i,path:[...i.path,"allOf",1]}),a=c=>"allOf"in c&&Object.keys(c).length===1,l=[...a(s)?s.allOf:[s],...a(o)?o.allOf:[o]];t.allOf=l},Op=(n,e,t,i)=>{const r=t,s=n._zod.def;r.type="array";const o=e.target==="draft-2020-12"?"prefixItems":"items",a=e.target==="draft-2020-12"||e.target==="openapi-3.0"?"items":"additionalItems",l=s.items.map((d,p)=>vt(d,e,{...i,path:[...i.path,o,p]})),c=s.rest?vt(s.rest,e,{...i,path:[...i.path,a,...e.target==="openapi-3.0"?[s.items.length]:[]]}):null;e.target==="draft-2020-12"?(r.prefixItems=l,c&&(r.items=c)):e.target==="openapi-3.0"?(r.items={anyOf:l},c&&r.items.anyOf.push(c),r.minItems=l.length,c||(r.maxItems=l.length)):(r.items=l,c&&(r.additionalItems=c));const{minimum:u,maximum:h}=n._zod.bag;typeof u=="number"&&(r.minItems=u),typeof h=="number"&&(r.maxItems=h)},Fp=(n,e,t,i)=>{const r=t,s=n._zod.def;r.type="object";const o=s.keyType,l=o._zod.bag?.patterns;if(s.mode==="loose"&&l&&l.size>0){const u=vt(s.valueType,e,{...i,path:[...i.path,"patternProperties","*"]});r.patternProperties={};for(const h of l)r.patternProperties[h.source]=u}else(e.target==="draft-07"||e.target==="draft-2020-12")&&(r.propertyNames=vt(s.keyType,e,{...i,path:[...i.path,"propertyNames"]})),r.additionalProperties=vt(s.valueType,e,{...i,path:[...i.path,"additionalProperties"]});const c=o._zod.values;if(c){const u=[...c].filter(h=>typeof h=="string"||typeof h=="number");u.length>0&&(r.required=u)}},kp=(n,e,t,i)=>{const r=n._zod.def,s=vt(r.innerType,e,i),o=e.seen.get(n);e.target==="openapi-3.0"?(o.ref=r.innerType,t.nullable=!0):t.anyOf=[s,{type:"null"}]},zp=(n,e,t,i)=>{const r=n._zod.def;vt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType},Bp=(n,e,t,i)=>{const r=n._zod.def;vt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType,t.default=JSON.parse(JSON.stringify(r.defaultValue))},Vp=(n,e,t,i)=>{const r=n._zod.def;vt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType,e.io==="input"&&(t._prefault=JSON.parse(JSON.stringify(r.defaultValue)))},Gp=(n,e,t,i)=>{const r=n._zod.def;vt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType;let o;try{o=r.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}t.default=o},Hp=(n,e,t,i)=>{const r=n._zod.def,s=e.io==="input"?r.in._zod.def.type==="transform"?r.out:r.in:r.out;vt(s,e,i);const o=e.seen.get(n);o.ref=s},Wp=(n,e,t,i)=>{const r=n._zod.def;vt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType,t.readOnly=!0},vu=(n,e,t,i)=>{const r=n._zod.def;vt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType},$p=$("ZodISODateTime",(n,e)=>{Hd.init(n,e),pt.init(n,e)});function Xp(n){return Kf($p,n)}const Zp=$("ZodISODate",(n,e)=>{Wd.init(n,e),pt.init(n,e)});function qp(n){return Jf(Zp,n)}const Yp=$("ZodISOTime",(n,e)=>{$d.init(n,e),pt.init(n,e)});function jp(n){return Qf(Yp,n)}const Kp=$("ZodISODuration",(n,e)=>{Xd.init(n,e),pt.init(n,e)});function Jp(n){return ep(Kp,n)}const Qp=(n,e)=>{Jc.init(n,e),n.name="ZodError",Object.defineProperties(n,{format:{value:t=>Oh(n,t)},flatten:{value:t=>Nh(n,t)},addIssue:{value:t=>{n.issues.push(t),n.message=JSON.stringify(n.issues,Co,2)}},addIssues:{value:t=>{n.issues.push(...t),n.message=JSON.stringify(n.issues,Co,2)}},isEmpty:{get(){return n.issues.length===0}}})},Qt=$("ZodError",Qp,{Parent:Error}),em=Ua(Qt),tm=Na(Qt),nm=As(Qt),im=Cs(Qt),rm=zh(Qt),sm=Bh(Qt),om=Vh(Qt),am=Gh(Qt),lm=Hh(Qt),cm=Wh(Qt),um=$h(Qt),hm=Xh(Qt),dt=$("ZodType",(n,e)=>(ct.init(n,e),Object.assign(n["~standard"],{jsonSchema:{input:ms(n,"input"),output:ms(n,"output")}}),n.toJSONSchema=Mp(n,{}),n.def=e,n.type=e.type,Object.defineProperty(n,"_def",{value:e}),n.check=(...t)=>n.clone(qn(e,{checks:[...e.checks??[],...t.map(i=>typeof i=="function"?{_zod:{check:i,def:{check:"custom"},onattach:[]}}:i)]}),{parent:!0}),n.with=n.check,n.clone=(t,i)=>Yn(n,t,i),n.brand=()=>n,n.register=((t,i)=>(t.add(n,i),n)),n.parse=(t,i)=>em(n,t,i,{callee:n.parse}),n.safeParse=(t,i)=>nm(n,t,i),n.parseAsync=async(t,i)=>tm(n,t,i,{callee:n.parseAsync}),n.safeParseAsync=async(t,i)=>im(n,t,i),n.spa=n.safeParseAsync,n.encode=(t,i)=>rm(n,t,i),n.decode=(t,i)=>sm(n,t,i),n.encodeAsync=async(t,i)=>om(n,t,i),n.decodeAsync=async(t,i)=>am(n,t,i),n.safeEncode=(t,i)=>lm(n,t,i),n.safeDecode=(t,i)=>cm(n,t,i),n.safeEncodeAsync=async(t,i)=>um(n,t,i),n.safeDecodeAsync=async(t,i)=>hm(n,t,i),n.refine=(t,i)=>n.check(cg(t,i)),n.superRefine=t=>n.check(ug(t)),n.overwrite=t=>n.check(Xi(t)),n.optional=()=>Pl(n),n.exactOptional=()=>jm(n),n.nullable=()=>Ll(n),n.nullish=()=>Pl(Ll(n)),n.nonoptional=t=>ng(n,t),n.array=()=>Cn(n),n.or=t=>km([n,t]),n.and=t=>Gm(n,t),n.transform=t=>Il(n,qm(t)),n.default=t=>Qm(n,t),n.prefault=t=>tg(n,t),n.catch=t=>rg(n,t),n.pipe=t=>Il(n,t),n.readonly=()=>ag(n),n.describe=t=>{const i=n.clone();return or.add(i,{description:t}),i},Object.defineProperty(n,"description",{get(){return or.get(n)?.description},configurable:!0}),n.meta=(...t)=>{if(t.length===0)return or.get(n);const i=n.clone();return or.add(i,t[0]),i},n.isOptional=()=>n.safeParse(void 0).success,n.isNullable=()=>n.safeParse(null).success,n.apply=t=>t(n),n)),xu=$("_ZodString",(n,e)=>{Oa.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(i,r,s)=>Ep(n,i,r);const t=n._zod.bag;n.format=t.format??null,n.minLength=t.minimum??null,n.maxLength=t.maximum??null,n.regex=(...i)=>n.check(op(...i)),n.includes=(...i)=>n.check(cp(...i)),n.startsWith=(...i)=>n.check(up(...i)),n.endsWith=(...i)=>n.check(hp(...i)),n.min=(...i)=>n.check(ps(...i)),n.max=(...i)=>n.check(fu(...i)),n.length=(...i)=>n.check(pu(...i)),n.nonempty=(...i)=>n.check(ps(1,...i)),n.lowercase=i=>n.check(ap(i)),n.uppercase=i=>n.check(lp(i)),n.trim=()=>n.check(fp()),n.normalize=(...i)=>n.check(dp(...i)),n.toLowerCase=()=>n.check(pp()),n.toUpperCase=()=>n.check(mp()),n.slugify=()=>n.check(gp())}),dm=$("ZodString",(n,e)=>{Oa.init(n,e),xu.init(n,e),n.email=t=>n.check(Pf(fm,t)),n.url=t=>n.check(Nf(pm,t)),n.jwt=t=>n.check(jf(Rm,t)),n.emoji=t=>n.check(Of(mm,t)),n.guid=t=>n.check(bl(Cl,t)),n.uuid=t=>n.check(Lf(Ir,t)),n.uuidv4=t=>n.check(If(Ir,t)),n.uuidv6=t=>n.check(Df(Ir,t)),n.uuidv7=t=>n.check(Uf(Ir,t)),n.nanoid=t=>n.check(Ff(gm,t)),n.guid=t=>n.check(bl(Cl,t)),n.cuid=t=>n.check(kf(_m,t)),n.cuid2=t=>n.check(zf(vm,t)),n.ulid=t=>n.check(Bf(xm,t)),n.base64=t=>n.check(Zf(wm,t)),n.base64url=t=>n.check(qf(Am,t)),n.xid=t=>n.check(Vf(Sm,t)),n.ksuid=t=>n.check(Gf(Mm,t)),n.ipv4=t=>n.check(Hf(ym,t)),n.ipv6=t=>n.check(Wf(Em,t)),n.cidrv4=t=>n.check($f(bm,t)),n.cidrv6=t=>n.check(Xf(Tm,t)),n.e164=t=>n.check(Yf(Cm,t)),n.datetime=t=>n.check(Xp(t)),n.date=t=>n.check(qp(t)),n.time=t=>n.check(jp(t)),n.duration=t=>n.check(Jp(t))});function Pe(n){return Rf(dm,n)}const pt=$("ZodStringFormat",(n,e)=>{ht.init(n,e),xu.init(n,e)}),fm=$("ZodEmail",(n,e)=>{Ud.init(n,e),pt.init(n,e)}),Cl=$("ZodGUID",(n,e)=>{Id.init(n,e),pt.init(n,e)}),Ir=$("ZodUUID",(n,e)=>{Dd.init(n,e),pt.init(n,e)}),pm=$("ZodURL",(n,e)=>{Nd.init(n,e),pt.init(n,e)}),mm=$("ZodEmoji",(n,e)=>{Od.init(n,e),pt.init(n,e)}),gm=$("ZodNanoID",(n,e)=>{Fd.init(n,e),pt.init(n,e)}),_m=$("ZodCUID",(n,e)=>{kd.init(n,e),pt.init(n,e)}),vm=$("ZodCUID2",(n,e)=>{zd.init(n,e),pt.init(n,e)}),xm=$("ZodULID",(n,e)=>{Bd.init(n,e),pt.init(n,e)}),Sm=$("ZodXID",(n,e)=>{Vd.init(n,e),pt.init(n,e)}),Mm=$("ZodKSUID",(n,e)=>{Gd.init(n,e),pt.init(n,e)}),ym=$("ZodIPv4",(n,e)=>{Zd.init(n,e),pt.init(n,e)}),Em=$("ZodIPv6",(n,e)=>{qd.init(n,e),pt.init(n,e)}),bm=$("ZodCIDRv4",(n,e)=>{Yd.init(n,e),pt.init(n,e)}),Tm=$("ZodCIDRv6",(n,e)=>{jd.init(n,e),pt.init(n,e)}),wm=$("ZodBase64",(n,e)=>{Kd.init(n,e),pt.init(n,e)}),Am=$("ZodBase64URL",(n,e)=>{Qd.init(n,e),pt.init(n,e)}),Cm=$("ZodE164",(n,e)=>{ef.init(n,e),pt.init(n,e)}),Rm=$("ZodJWT",(n,e)=>{nf.init(n,e),pt.init(n,e)}),Su=$("ZodNumber",(n,e)=>{lu.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(i,r,s)=>bp(n,i,r),n.gt=(i,r)=>n.check(wl(i,r)),n.gte=(i,r)=>n.check(Bs(i,r)),n.min=(i,r)=>n.check(Bs(i,r)),n.lt=(i,r)=>n.check(Tl(i,r)),n.lte=(i,r)=>n.check(zs(i,r)),n.max=(i,r)=>n.check(zs(i,r)),n.int=i=>n.check(Rl(i)),n.safe=i=>n.check(Rl(i)),n.positive=i=>n.check(wl(0,i)),n.nonnegative=i=>n.check(Bs(0,i)),n.negative=i=>n.check(Tl(0,i)),n.nonpositive=i=>n.check(zs(0,i)),n.multipleOf=(i,r)=>n.check(Al(i,r)),n.step=(i,r)=>n.check(Al(i,r)),n.finite=()=>n;const t=n._zod.bag;n.minValue=Math.max(t.minimum??Number.NEGATIVE_INFINITY,t.exclusiveMinimum??Number.NEGATIVE_INFINITY)??null,n.maxValue=Math.min(t.maximum??Number.POSITIVE_INFINITY,t.exclusiveMaximum??Number.POSITIVE_INFINITY)??null,n.isInt=(t.format??"").includes("int")||Number.isSafeInteger(t.multipleOf??.5),n.isFinite=!0,n.format=t.format??null});function at(n){return tp(Su,n)}const Pm=$("ZodNumberFormat",(n,e)=>{rf.init(n,e),Su.init(n,e)});function Rl(n){return np(Pm,n)}const Lm=$("ZodBoolean",(n,e)=>{sf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Tp(n,t,i)});function Im(n){return ip(Lm,n)}const Dm=$("ZodUnknown",(n,e)=>{of.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Ap()});function Po(){return rp(Dm)}const Um=$("ZodNever",(n,e)=>{af.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>wp(n,t,i)});function Nm(n){return sp(Um,n)}const Om=$("ZodArray",(n,e)=>{lf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Ip(n,t,i,r),n.element=e.element,n.min=(t,i)=>n.check(ps(t,i)),n.nonempty=t=>n.check(ps(1,t)),n.max=(t,i)=>n.check(fu(t,i)),n.length=(t,i)=>n.check(pu(t,i)),n.unwrap=()=>n.element});function Cn(n,e){return _p(Om,n,e)}const Fm=$("ZodObject",(n,e)=>{uf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Dp(n,t,i,r),je(n,"shape",()=>e.shape),n.keyof=()=>ki(Object.keys(n._zod.def.shape)),n.catchall=t=>n.clone({...n._zod.def,catchall:t}),n.passthrough=()=>n.clone({...n._zod.def,catchall:Po()}),n.loose=()=>n.clone({...n._zod.def,catchall:Po()}),n.strict=()=>n.clone({...n._zod.def,catchall:Nm()}),n.strip=()=>n.clone({...n._zod.def,catchall:void 0}),n.extend=t=>Ph(n,t),n.safeExtend=t=>Lh(n,t),n.merge=t=>Ih(n,t),n.pick=t=>Ch(n,t),n.omit=t=>Rh(n,t),n.partial=(...t)=>Dh(yu,n,t[0]),n.required=(...t)=>Uh(Eu,n,t[0])});function yt(n,e){const t={type:"object",shape:n??{},...Ee(e)};return new Fm(t)}const Mu=$("ZodUnion",(n,e)=>{hu.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Up(n,t,i,r),n.options=e.options});function km(n,e){return new Mu({type:"union",options:n,...Ee(e)})}const zm=$("ZodDiscriminatedUnion",(n,e)=>{Mu.init(n,e),hf.init(n,e)});function Bm(n,e,t){return new zm({type:"union",options:e,discriminator:n,...Ee(t)})}const Vm=$("ZodIntersection",(n,e)=>{df.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Np(n,t,i,r)});function Gm(n,e){return new Vm({type:"intersection",left:n,right:e})}const Hm=$("ZodTuple",(n,e)=>{ff.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Op(n,t,i,r),n.rest=t=>n.clone({...n._zod.def,rest:t})});function Wm(n,e,t){const i=e instanceof ct,r=i?t:e,s=i?e:null;return new Hm({type:"tuple",items:n,rest:s,...Ee(r)})}const $m=$("ZodRecord",(n,e)=>{pf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Fp(n,t,i,r),n.keyType=e.keyType,n.valueType=e.valueType});function gs(n,e,t){return new $m({type:"record",keyType:n,valueType:e,...Ee(t)})}const Lo=$("ZodEnum",(n,e)=>{mf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(i,r,s)=>Cp(n,i,r),n.enum=e.entries,n.options=Object.values(e.entries);const t=new Set(Object.keys(e.entries));n.extract=(i,r)=>{const s={};for(const o of i)if(t.has(o))s[o]=e.entries[o];else throw new Error(`Key ${o} not found in enum`);return new Lo({...e,checks:[],...Ee(r),entries:s})},n.exclude=(i,r)=>{const s={...e.entries};for(const o of i)if(t.has(o))delete s[o];else throw new Error(`Key ${o} not found in enum`);return new Lo({...e,checks:[],...Ee(r),entries:s})}});function ki(n,e){const t=Array.isArray(n)?Object.fromEntries(n.map(i=>[i,i])):n;return new Lo({type:"enum",entries:t,...Ee(e)})}const Xm=$("ZodLiteral",(n,e)=>{gf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Rp(n,t,i),n.values=new Set(e.values),Object.defineProperty(n,"value",{get(){if(e.values.length>1)throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");return e.values[0]}})});function Fa(n,e){return new Xm({type:"literal",values:Array.isArray(n)?n:[n],...Ee(e)})}const Zm=$("ZodTransform",(n,e)=>{_f.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Lp(n,t),n._zod.parse=(t,i)=>{if(i.direction==="backward")throw new Xc(n.constructor.name);t.addIssue=s=>{if(typeof s=="string")t.issues.push(fr(s,t.value,e));else{const o=s;o.fatal&&(o.continue=!1),o.code??(o.code="custom"),o.input??(o.input=t.value),o.inst??(o.inst=n),t.issues.push(fr(o))}};const r=e.transform(t.value,t);return r instanceof Promise?r.then(s=>(t.value=s,t)):(t.value=r,t)}});function qm(n){return new Zm({type:"transform",transform:n})}const yu=$("ZodOptional",(n,e)=>{du.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>vu(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function Pl(n){return new yu({type:"optional",innerType:n})}const Ym=$("ZodExactOptional",(n,e)=>{vf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>vu(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function jm(n){return new Ym({type:"optional",innerType:n})}const Km=$("ZodNullable",(n,e)=>{xf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>kp(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function Ll(n){return new Km({type:"nullable",innerType:n})}const Jm=$("ZodDefault",(n,e)=>{Sf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Bp(n,t,i,r),n.unwrap=()=>n._zod.def.innerType,n.removeDefault=n.unwrap});function Qm(n,e){return new Jm({type:"default",innerType:n,get defaultValue(){return typeof e=="function"?e():jc(e)}})}const eg=$("ZodPrefault",(n,e)=>{Mf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Vp(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function tg(n,e){return new eg({type:"prefault",innerType:n,get defaultValue(){return typeof e=="function"?e():jc(e)}})}const Eu=$("ZodNonOptional",(n,e)=>{yf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>zp(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function ng(n,e){return new Eu({type:"nonoptional",innerType:n,...Ee(e)})}const ig=$("ZodCatch",(n,e)=>{Ef.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Gp(n,t,i,r),n.unwrap=()=>n._zod.def.innerType,n.removeCatch=n.unwrap});function rg(n,e){return new ig({type:"catch",innerType:n,catchValue:typeof e=="function"?e:()=>e})}const sg=$("ZodPipe",(n,e)=>{bf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Hp(n,t,i,r),n.in=e.in,n.out=e.out});function Il(n,e){return new sg({type:"pipe",in:n,out:e})}const og=$("ZodReadonly",(n,e)=>{Tf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Wp(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function ag(n){return new og({type:"readonly",innerType:n})}const lg=$("ZodCustom",(n,e)=>{wf.init(n,e),dt.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Pp(n,t)});function cg(n,e={}){return vp(lg,n,e)}function ug(n){return xp(n)}const Io={custom:"custom"};function ka(n){return n.trim().toUpperCase()}function hg(n){return n.trim().toLowerCase()}function Dl(n){return n.trim().toLowerCase()}function dg(n){return n.trim().toLowerCase()}function fg(n,e){const t=dg(n);if(!/^region-[a-z0-9]+-[a-z0-9-]+$/.test(t))throw new Error(`Invalid svgPathId: "${n}". Must match pattern: region-{clientId}-{regionId}`);return t}const bu=yt({type:Fa("geoAlbersUsa"),scale:at().positive(),translate:Wm([at(),at()])}),pg=yt({x:at(),y:at()}),mg=yt({officeCode:Pe().transform(ka),lat:at(),lon:at(),svgX:at().nonnegative(),svgY:at().nonnegative()}),gg=yt({officeCode:Pe().transform(ka),lat:at(),lon:at(),svgOverride:pg.optional()}),Tu=yt({id:Pe().transform(hg),name:Pe(),svgPathId:Pe().transform((n,e)=>{try{return fg(n)}catch(t){const i=t;return e.addIssue({code:Io.custom,message:i.message}),Mh}})}),_g=yt({configVersion:Fa(1),mapId:Pe(),clientId:Pe(),mapAssetHash:Pe().regex(/^[a-f0-9]{64}$/),viewBox:yt({x:at(),y:at(),width:at().positive(),height:at().positive()}),coordinates:Cn(mg),pinAsset:Pe().optional(),regions:Cn(Tu).optional(),projection:bu.optional()}),vg=yt({configVersion:Fa(2),mapId:Pe(),clientId:Pe(),mapAssetHash:Pe().regex(/^[a-f0-9]{64}$/),viewBox:yt({x:at(),y:at(),width:at().positive(),height:at().positive()}),projection:bu,coordinates:Cn(gg),pinAsset:Pe().optional(),regions:Cn(Tu).optional()}),xg=Bm("configVersion",[_g,vg]),Sg={usg:()=>In(()=>import("./usg-map-config-DjK_gDtx.js"),[]),oddessentials:()=>In(()=>import("./oddessentials-map-config-CXTfR3ZG.js"),[])},Mg={usg:()=>In(()=>import("./usg-client-C12NXggC.js"),[]),oddessentials:()=>In(()=>import("./oddessentials-client-8hxIFX2v.js"),[])};let Dr=null;async function Ps(){if(Dr)return Dr;{const n=await In(()=>import("./clients.demo-Cn2FaUfE.js"),[]);Dr=n.default||n}return Dr}async function wu(n){const e=await Ps();if(!e.clients.includes(n))throw new Error(`Client "${n}" not found in registry. Available clients: ${e.clients.join(", ")}. (Mode: production)`);const i=Sg[n];if(!i)throw new Error(`Client "${n}" is in registry but not in import map. This is a configuration error—add the client to the appropriate import map.`);const r=await i();return r.default??r}async function yg(n){const e=await Ps();if(!e.clients.includes(n))throw new Error(`Client "${n}" not found in registry. Available clients: ${e.clients.join(", ")}. (Mode: production)`);const i=Mg[n];if(!i)throw new Error(`Client "${n}" is in registry but not in client config import map. This is a configuration error—add the client to the appropriate client config import map.`);const r=await i();return r.default??r}async function Eg(){return[...(await Ps()).clients]}async function bg(){const n=await Ps();return n.defaultClient??n.clients[0]}const _s=new Map;let zi=null;const Vs=new Map;async function Tg(n){const e=Dl(n);if(_s.has(e)){zi=e,console.log(`✅ Projection already initialized for client: ${e}`);return}const t=Vs.get(e);if(t)return console.log(`⏳ Waiting for in-flight initialization: ${e}`),t;const i=(async()=>{try{const r=await wu(e),s=xg.parse(r);if(Dl(s.clientId)!==e)throw new Error(`Config clientId mismatch: requested "${e}", config declares "${s.clientId}"`);let o;if(s.configVersion===1)o=new Map(s.coordinates.map(a=>[a.officeCode,{x:a.svgX,y:a.svgY}]));else{const{projectAllToSvg:a}=await In(async()=>{const{projectAllToSvg:l}=await import("./svg-projection-DeQm7jbk.js");return{projectAllToSvg:l}},[]);o=await a(s.coordinates,s.projection)}_s.set(e,{config:s,coordMap:o}),zi=e,console.log(`✅ Projection initialized for client: ${e} (${o.size} offices)`)}catch(r){throw console.error(`Failed to initialize projection for client "${e}":`,r),r}})();Vs.set(e,i);try{await i}finally{Vs.delete(e)}}function wg(){if(!zi||!_s.has(zi))throw new Error("Projection not initialized. Call initProjection() first.")}function Ul(n){wg();const e=_s.get(zi),t=ka(n),i=e.coordMap.get(t);if(!i)throw new Error(`🚨 MISSING COORDINATE: Office "${n}" (normalized: "${t}") has no coordinate mapping. Add to config/usg-map-config.json via coordinate-capture tool. (Client: ${zi})`);return i}const vs=1,Au=Pe().regex(/^https:\/\//,"URLs must use the HTTPS protocol.").max(2048,"URL exceeds maximum length."),Gs=Pe().regex(/^#[0-9a-fA-F]{6}$/,"Invalid color format. Expected CSS hex color (e.g., #1a5276)."),Ag=yt({lat:at().min(-90).max(90),lon:at().min(-180).max(180),source:ki(["verified","business_district","city_centroid","region_centroid"]),confidence:ki(["high","medium","low"]),approximate:Im()}),Cu=yt({name:Pe().min(1).max(128),title:Pe().min(1).max(128),phone:Pe().min(1).max(30),email:Pe().email("Invalid email format.").max(254),vcardUrl:Au.optional()}),Cg=yt({officeCode:Pe().min(1).max(32),city:Pe().min(1).max(128),state:Pe().min(1).max(128),officeType:ki(["Branch Office","Satellite Sales Office"]),address:Pe().max(512).nullable().default(null),directionsUrl:Au.optional(),region:Pe().min(1).max(128),coordinates:Ag}),Rg=yt({claims:Pe().email("Invalid email format.").max(254).optional(),lossRuns:Pe().email("Invalid email format.").max(254).optional(),accounting:Pe().email("Invalid email format.").max(254).optional()}),Pg=yt({mainPhone:Pe().max(30).optional(),mainEmail:Pe().email("Invalid email format.").max(254).optional(),departmentEmails:Rg.optional(),accountingContact:yt({name:Pe().min(1).max(128),title:Pe().min(1).max(128),phone:Pe().min(1).max(30),email:Pe().email("Invalid email format.").max(254)}).optional()}),Lg=yt({distance:at().positive(),lat:at(),lon:at()}),Ig=yt({provider:ki(["maplibre","apple","google"]).default("maplibre"),tileStyleUrl:Pe().url().optional(),appleMapToken:Pe().optional(),googleMapsApiKey:Pe().optional(),defaultZoom:at().min(1).max(20).default(15),defaultTileStyle:ki(["light","dark"]).default("light")}).optional(),Dg=yt({primaryColor:Gs.optional(),accentColor:Gs.optional(),regionColors:gs(Pe(),Gs).optional(),cameraViews:gs(Pe(),Lg).optional(),mapProvider:Ig}),Ug=yt({name:Pe().min(1),personnel:Cn(Cu)}),Ng=yt({schemaVersion:at().int().min(1).superRefine((n,e)=>{n>vs&&e.addIssue({code:Io.custom,message:`Configuration schema version ${n} is not supported. Maximum supported: ${vs}.`})}),clientId:Pe().regex(/^[a-z][a-z0-9]*$/,"Invalid clientId: must be lowercase alphanumeric."),name:Pe().min(1).max(256),copyrightHolder:Pe().min(1).max(256),tagline:Pe().max(500).optional(),offices:Cn(Cg).min(1),regionalPersonnel:gs(Pe(),Cn(Cu)).optional(),specialtyDivisions:Cn(Ug).optional(),globalContacts:Pg.optional(),theme:Dg.optional(),metadata:gs(Pe(),Po()).optional()}).superRefine((n,e)=>{const t=new Set;for(let i=0;i<n.offices.length;i++){const r=n.offices[i].officeCode;t.has(r)&&e.addIssue({code:Io.custom,message:`Duplicate office code: ${r}.`,path:["offices",i,"officeCode"]}),t.add(r)}});function Og(n){return n.issues.map(e=>`${e.path.length>0?`${e.path.join(".")}: `:""}${e.message}`)}let xs=null,ar=null,lr=null,ss=null;function Fg(){ar=null,lr=null,ss=null}async function kg(n){const e=await yg(n),t=e;if(typeof t.schemaVersion=="number"&&t.schemaVersion>vs)throw new Error(`Configuration schema version ${t.schemaVersion} is not supported. Maximum supported: ${vs}.`);const i=Ng.safeParse(e);if(!i.success){const r=Og(i.error);throw new Error(`Client config validation failed for "${n}":
${r.join(`
`)}`)}return xs=i.data,Fg(),xs}function an(){if(!xs)throw new Error("Client config not loaded. Call loadClientConfig() first.");return xs}function Bi(){return ar||(ar=an().offices.map(e=>({...e,regionName:e.region})),ar)}function pr(){if(lr)return lr;const n=an(),e=new Map;for(const t of n.offices)e.has(t.region)||e.set(t.region,{offices:[],personnel:[]}),e.get(t.region).offices.push(t);if(n.regionalPersonnel)for(const[t,i]of Object.entries(n.regionalPersonnel))e.has(t)||e.set(t,{offices:[],personnel:[]}),e.get(t).personnel=i;return lr=Array.from(e.entries()).map(([t,i])=>({name:t,offices:i.offices,personnel:i.personnel})),lr}function mr(n){return ss||(ss=new Map(pr().map(e=>[e.name,e]))),ss.get(n)}function zg(n){return an().offices.filter(t=>t.region===n)}function Ss(){const e=an().theme?.mapProvider;return{provider:e?.provider??"maplibre",tileStyleUrl:e?.tileStyleUrl,appleMapToken:e?.appleMapToken,googleMapsApiKey:e?.googleMapsApiKey,defaultZoom:e?.defaultZoom??15,defaultTileStyle:e?.defaultTileStyle??"light"}}function Bg(n){const e=an(),t=new Set(n);for(const i of e.offices)t.has(i.region)||console.warn(`Office "${i.officeCode}" references unknown region "${i.region}".`)}function Vg(n,e,t,i){const r=n.x-e,s=n.y-e,o=n.x+n.width+e,a=n.y+n.height+e,l=Math.max(0,r),c=Math.max(0,s),u=Math.min(t,o),h=Math.min(i,a);return{x:l,y:c,width:Math.max(0,u-l),height:Math.max(0,h-c)}}const Wn=960,Rn=600,Gg=30,Hg=.9,Wg=1.1,Di=60,Ms=Wn,$g=5;function Xg(n,e,t){const i=t?Hg:Wg;let r=n.w*i,s=n.h*i;r<Di?(r=Di,s=Di*(Rn/Wn)):r>Ms&&(r=Ms,s=Rn);const o=e.x-(e.x-n.x)*(r/n.w),a=e.y-(e.y-n.y)*(s/n.h);return{x:o,y:a,w:r,h:s}}function Zg(n,e,t){if(t.width<=0||t.height<=0)return{...n};const i=e.dx*(n.w/t.width),r=e.dy*(n.h/t.height);let s=n.x-i,o=n.y-r;return s=Math.max(0,Math.min(Wn-n.w,s)),o=Math.max(0,Math.min(Rn-n.h,o)),{x:s,y:o,w:n.w,h:n.h}}function qg(n,e,t,i){if(i.width<=0||i.height<=0)return{...n};const r=Math.hypot(e[1].x-e[0].x,e[1].y-e[0].y),s=Math.hypot(t[1].x-t[0].x,t[1].y-t[0].y);if(r===0||s===0)return{...n};const o=r/s;let a=n.w*o,l=n.h*o;a<Di?(a=Di,l=Di*(Rn/Wn)):a>Ms&&(a=Ms,l=Rn);const c=(t[0].x+t[1].x)/2,u=(t[0].y+t[1].y)/2,h=n.x+c/i.width*n.w,d=n.y+u/i.height*n.h,p=c/i.width,_=u/i.height;let S=h-p*a,m=d-_*l;return S=Math.max(0,Math.min(Wn-a,S)),m=Math.max(0,Math.min(Rn-l,m)),{x:S,y:m,w:a,h:l}}class Hs{container;options;svgElement=null;selectedRegion=null;selectedOffice=null;regionBounds=new Map;currentViewBox={x:0,y:0,w:Wn,h:Rn};viewBoxAnimationId=null;boundHandleWheel=null;isDragging=!1;wasDragging=!1;dragStartScreenPos=null;dragStartViewBox=null;boundPointerDown=null;boundPointerMove=null;boundPointerUp=null;boundClickCapture=null;pointers=new Map;isPinching=!1;wasPinching=!1;pinchStartPointers=null;pinchStartViewBox=null;markersReady=!1;pendingRegionSelection=null;markerCache=new Map;constructor(e,t={}){this.container=e,this.options={onRegionClick:t.onRegionClick??(()=>{}),onOfficeClick:t.onOfficeClick??(()=>{}),onReset:t.onReset??(()=>{})}}async init(){this.markersReady=!1,this.pendingRegionSelection=null;try{const e=an().clientId;await Tg(e),console.log("✅ Projection system initialized");const i=((await wu(e)).regions??[]).map(r=>r.name);Bg(i)}catch(e){console.error("❌ Failed to initialize projection:",e),this.container.innerHTML=`
                <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
                    <h2>🚨 Map Initialization Failed</h2>
                    <p>Could not load map configuration. Please check the console for details.</p>
                    <pre>${e}</pre>
                </div>
            `;return}try{const t=(await In(()=>import("./usa-regions-CZn3_yKP.js"),[])).default;if(this.container.innerHTML=t,this.svgElement=this.container.querySelector("svg"),!this.svgElement)throw new Error("SVG element not found after loading")}catch(e){console.error("❌ Failed to load SVG:",e),this.container.innerHTML=`
                <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
                    <h2>🚨 SVG Loading Failed</h2>
                    <p>Could not load map SVG. Please check the console for details.</p>
                    <pre></pre>
                </div>
            `;const t=this.container.querySelector("pre");t&&(t.textContent=String(e));return}this.calculateRegionBounds(),this.setupEventListeners(),this.addMarkers(),this.boundHandleWheel=e=>this.handleWheel(e),this.container.addEventListener("wheel",this.boundHandleWheel,{passive:!1}),this.boundPointerDown=e=>this.handlePointerDown(e),this.boundPointerMove=e=>this.handlePointerMove(e),this.boundPointerUp=e=>this.handlePointerUp(e),this.boundClickCapture=e=>{(this.wasDragging||this.wasPinching)&&(this.wasDragging=!1,this.wasPinching=!1,e.stopPropagation(),e.preventDefault())},this.container.addEventListener("pointerdown",this.boundPointerDown),this.container.addEventListener("pointermove",this.boundPointerMove),this.container.addEventListener("pointerup",this.boundPointerUp),this.container.addEventListener("pointercancel",this.boundPointerUp),this.container.addEventListener("click",this.boundClickCapture,{capture:!0})}dispose(){this.viewBoxAnimationId!==null&&(cancelAnimationFrame(this.viewBoxAnimationId),this.viewBoxAnimationId=null),this.boundHandleWheel&&(this.container.removeEventListener("wheel",this.boundHandleWheel),this.boundHandleWheel=null),this.boundPointerDown&&(this.container.removeEventListener("pointerdown",this.boundPointerDown),this.boundPointerDown=null),this.boundPointerMove&&(this.container.removeEventListener("pointermove",this.boundPointerMove),this.boundPointerMove=null),this.boundPointerUp&&(this.container.removeEventListener("pointerup",this.boundPointerUp),this.container.removeEventListener("pointercancel",this.boundPointerUp),this.boundPointerUp=null),this.boundClickCapture&&(this.container.removeEventListener("click",this.boundClickCapture,{capture:!0}),this.boundClickCapture=null)}calculateRegionBounds(){if(!this.svgElement)return;this.svgElement.querySelectorAll("[data-region]").forEach(t=>{const i=t.dataset.region;if(i)try{const r=t.getBBox();this.regionBounds.set(i,Vg(r,Gg,Wn,Rn))}catch(r){console.warn(`Failed to calculate bounds for region: ${i}`,r)}})}setupEventListeners(){if(!this.svgElement)return;this.svgElement.querySelectorAll("[data-region]").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.region;i&&(this.selectRegion(i),this.options.onRegionClick(i))}),t.addEventListener("keydown",i=>{if(i.key==="Enter"||i.key===" "){i.preventDefault();const r=t.dataset.region;r&&(this.selectRegion(r),this.options.onRegionClick(r))}})})}addMarkers(){if(!this.svgElement)return;const e=this.svgElement.querySelector("#markers");if(!e)return;const t=Bi();let i=0,r=0;if(t.forEach(s=>{try{const{x:o,y:a}=Ul(s.officeCode),l=document.createElementNS("http://www.w3.org/2000/svg","g");l.setAttribute("class","marker-group"),l.setAttribute("data-office-code",s.officeCode),l.setAttribute("data-region",s.regionName),l.setAttribute("transform",`translate(${o}, ${a})`);const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","M 0,0 C -2,-6 -4,-8 -4,-12 A 4,4 0 1,1 4,-12 C 4,-8 2,-6 0,0 Z"),c.setAttribute("class","marker"),c.setAttribute("vector-effect","non-scaling-stroke"),c.setAttribute("role","button"),c.setAttribute("tabindex","0"),c.setAttribute("aria-label",`${s.city}, ${s.state} - ${s.officeType}`),l.style.pointerEvents="auto",l.addEventListener("click",d=>{d.stopPropagation(),this.selectOffice(s),this.options.onOfficeClick(s)}),c.addEventListener("keydown",d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this.selectOffice(s),this.options.onOfficeClick(s))});const h=document.createElementNS("http://www.w3.org/2000/svg","circle");h.setAttribute("cx","0"),h.setAttribute("cy","-8"),h.setAttribute("r","12"),h.setAttribute("fill","transparent"),h.setAttribute("stroke","none"),h.setAttribute("aria-hidden","true"),l.appendChild(h),l.appendChild(c),e.appendChild(l),this.markerCache.set(s.officeCode,{group:l,marker:c}),i++}catch(o){console.error(`🚨 ${o.message}`),r++;const l=document.createElementNS("http://www.w3.org/2000/svg","g");l.setAttribute("class","marker-error-group"),l.setAttribute("data-office-code",s.officeCode),l.setAttribute("data-region",s.regionName),l.setAttribute("transform","translate(0, 0)");const c=document.createElementNS("http://www.w3.org/2000/svg","text");c.setAttribute("x","0"),c.setAttribute("y","0"),c.setAttribute("font-size","20"),c.setAttribute("fill","red"),c.setAttribute("text-anchor","middle"),c.textContent="❌",c.setAttribute("aria-label",`Error: ${s.officeCode} missing coordinates`),l.appendChild(c),e.appendChild(l)}}),console.log(`📍 Markers: ${i} placed, ${r} errors`),r>0&&console.warn(`⚠️ ${r} offices missing coordinates. Run tools/coordinate-capture.html to fix.`),this.markersReady=!0,this.pendingRegionSelection){const s=this.pendingRegionSelection;this.pendingRegionSelection=null,this.selectedRegion=s,this.selectedOffice=null,this.ensureMarkersVisible(s),this.highlightRegion(s)}}selectRegion(e){this.selectedRegion=e,this.selectedOffice=null;const t=this.regionBounds.get(e);if(t&&this.animateViewBox(t.x,t.y,t.width,t.height),!this.markersReady){this.pendingRegionSelection=e;return}this.ensureMarkersVisible(e),this.highlightRegion(e)}selectOffice(e){this.selectedOffice=e,e.regionName&&(this.selectedRegion=e.regionName),this.markersReady&&e.regionName&&this.ensureMarkersVisible(e.regionName);try{const{x:t,y:i}=Ul(e.officeCode),r=100,s=100;this.animateViewBox(t-r/2,i-s/2,r,s),this.highlightMarker(e.officeCode)}catch(t){const i=t;console.error(`❌ Cannot zoom to office ${e.officeCode}:`,i.message)}}reset(){this.selectedRegion=null,this.selectedOffice=null,this.pendingRegionSelection=null,this.animateViewBox(0,0,Wn,Rn),this.ensureMarkersVisible(),this.clearHighlights(),this.options.onReset()}handleWheel(e){e.preventDefault();const t=this.svgElement;if(!t)return;const i=Math.sign(e.deltaY);if(i===0)return;const r=i<0,s=t.getScreenCTM();if(!s)return;const o=t.createSVGPoint();o.x=e.clientX,o.y=e.clientY;const a=o.matrixTransform(s.inverse()),l=Xg(this.currentViewBox,a,r);this.viewBoxAnimationId!==null&&(cancelAnimationFrame(this.viewBoxAnimationId),this.viewBoxAnimationId=null),this.currentViewBox=l,t.setAttribute("viewBox",`${l.x} ${l.y} ${l.w} ${l.h}`)}handlePointerDown(e){if(!(e.pointerType==="mouse"&&e.button!==0)){if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===1)this.dragStartScreenPos={x:e.clientX,y:e.clientY},this.dragStartViewBox={...this.currentViewBox},this.isDragging=!1,this.wasDragging=!1,this.wasPinching=!1,this.viewBoxAnimationId!==null&&(cancelAnimationFrame(this.viewBoxAnimationId),this.viewBoxAnimationId=null);else if(this.pointers.size>=2){this.isDragging=!1,this.container.style.cursor="grab";for(const i of this.pointers.keys())this.container.setPointerCapture(i);const t=Array.from(this.pointers.values());this.pinchStartPointers=[{...t[0]},{...t[1]}],this.pinchStartViewBox={...this.currentViewBox},this.isPinching=!0}}}handlePointerMove(e){if(!this.pointers.has(e.pointerId))return;if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.isPinching&&this.pointers.size>=2&&this.pinchStartPointers&&this.pinchStartViewBox){const s=Array.from(this.pointers.values()),o=[s[0],s[1]],a=qg(this.pinchStartViewBox,this.pinchStartPointers,o,{width:this.container.clientWidth,height:this.container.clientHeight});this.currentViewBox=a,this.svgElement&&this.svgElement.setAttribute("viewBox",`${a.x} ${a.y} ${a.w} ${a.h}`);return}if(this.pointers.size!==1||this.isPinching||this.wasPinching||!this.dragStartScreenPos||!this.dragStartViewBox)return;const t=e.clientX-this.dragStartScreenPos.x,i=e.clientY-this.dragStartScreenPos.y;if(!this.isDragging&&Math.hypot(t,i)<=$g)return;this.isDragging||(this.isDragging=!0,this.container.style.cursor="grabbing",this.container.setPointerCapture(e.pointerId));const r=Zg(this.dragStartViewBox,{dx:t,dy:i},{width:this.container.clientWidth,height:this.container.clientHeight});this.currentViewBox=r,this.svgElement&&this.svgElement.setAttribute("viewBox",`${r.x} ${r.y} ${r.w} ${r.h}`)}handlePointerUp(e){if(this.pointers.has(e.pointerId)){try{this.container.releasePointerCapture(e.pointerId)}catch{}this.pointers.delete(e.pointerId),this.isPinching?this.pointers.size<2&&(this.isPinching=!1,this.wasPinching=!0,this.pinchStartPointers=null,this.pinchStartViewBox=null):this.isDragging&&(this.wasDragging=!0),this.pointers.size===0&&(this.isDragging=!1,this.wasPinching=!1,this.dragStartScreenPos=null,this.dragStartViewBox=null,this.container.style.cursor="grab")}}animateViewBox(e,t,i,r){const s=this.svgElement;if(!s)return;this.viewBoxAnimationId!==null&&(cancelAnimationFrame(this.viewBoxAnimationId),this.viewBoxAnimationId=null);const o=[this.currentViewBox.x,this.currentViewBox.y,this.currentViewBox.w,this.currentViewBox.h],a=[e,t,i,r],l=500,c=performance.now(),u=h=>{const d=h-c,p=Math.min(d/l,1),_=1-Math.pow(1-p,3),S=o.map((m,f)=>m+(a[f]-m)*_);s.setAttribute("viewBox",S.join(" ")),this.currentViewBox={x:S[0],y:S[1],w:S[2],h:S[3]},p<1?this.viewBoxAnimationId=requestAnimationFrame(u):this.viewBoxAnimationId=null};this.viewBoxAnimationId=requestAnimationFrame(u)}ensureMarkersVisible(e){if(!this.svgElement)return;this.svgElement.querySelectorAll(".marker-group").forEach(i=>{i.style.pointerEvents="auto"})}highlightRegion(e){if(!this.svgElement)return;this.svgElement.querySelectorAll("[data-region]").forEach(i=>{i.classList.remove("selected")});const t=this.svgElement.querySelector(`[data-region="${e}"]`);t&&t.classList.add("selected")}highlightMarker(e){if(!this.svgElement)return;this.svgElement.querySelectorAll(".marker-group").forEach(i=>{const r=i.querySelector(".marker");r&&(r.classList.remove("selected"),i.dataset.officeCode===e&&r.classList.add("selected"))})}updateMarkerStates(e){if(this.svgElement)for(const t of e){const i=this.markerCache.get(t.officeCode);if(!i)continue;const{marker:r}=i;r.classList.toggle("marker--selected",t.selected),r.classList.toggle("marker--highlighted",t.highlighted),r.classList.toggle("marker--dimmed",t.dimmed),r.classList.toggle("marker--subdued",t.subdued)}}clearHighlights(){this.svgElement&&this.svgElement.querySelectorAll(".selected").forEach(e=>{e.classList.remove("selected")})}getState(){return{selectedRegion:this.selectedRegion,selectedOffice:this.selectedOffice}}}const za="182",Yg=0,Nl=1,jg=2,os=1,Kg=2,cr=3,Zn=0,Ft=1,Tn=2,Pn=0,Ui=1,Do=2,Ol=3,Fl=4,Jg=5,oi=100,Qg=101,e_=102,t_=103,n_=104,i_=200,r_=201,s_=202,o_=203,Uo=204,No=205,a_=206,l_=207,c_=208,u_=209,h_=210,d_=211,f_=212,p_=213,m_=214,Oo=0,Fo=1,ko=2,Vi=3,zo=4,Bo=5,Vo=6,Go=7,Ba=0,g_=1,__=2,mn=0,Ru=1,Pu=2,Lu=3,Iu=4,Du=5,Uu=6,Nu=7,Ou=300,di=301,Gi=302,Ho=303,Wo=304,Ls=306,gr=1e3,An=1001,$o=1002,At=1003,v_=1004,Ur=1005,Lt=1006,Ws=1007,ui=1008,Zt=1009,Fu=1010,ku=1011,_r=1012,Va=1013,_n=1014,fn=1015,Dn=1016,Ga=1017,Ha=1018,vr=1020,zu=35902,Bu=35899,Vu=1021,Gu=1022,sn=1023,Un=1026,hi=1027,Hu=1028,Wa=1029,Hi=1030,$a=1031,Xa=1033,as=33776,ls=33777,cs=33778,us=33779,Xo=35840,Zo=35841,qo=35842,Yo=35843,jo=36196,Ko=37492,Jo=37496,Qo=37488,ea=37489,ta=37490,na=37491,ia=37808,ra=37809,sa=37810,oa=37811,aa=37812,la=37813,ca=37814,ua=37815,ha=37816,da=37817,fa=37818,pa=37819,ma=37820,ga=37821,_a=36492,va=36494,xa=36495,Sa=36283,Ma=36284,ya=36285,Ea=36286,x_=3200,Wu=0,S_=1,Gn="",Kt="srgb",Wi="srgb-linear",ys="linear",et="srgb",mi=7680,kl=519,M_=512,y_=513,E_=514,Za=515,b_=516,T_=517,qa=518,w_=519,zl=35044,Bl="300 es",pn=2e3,Es=2001;function $u(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function xr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function A_(){const n=xr("canvas");return n.style.display="block",n}const Vl={};function Gl(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ie(...n){const e="THREE."+n.shift();console.warn(e,...n)}function We(...n){const e="THREE."+n.shift();console.error(e,...n)}function Sr(...n){const e=n.join(" ");e in Vl||(Vl[e]=!0,Ie(...n))}function C_(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}class Zi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],$s=Math.PI/180,ba=180/Math.PI;function yr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]).toLowerCase()}function Ve(n,e,t){return Math.max(e,Math.min(t,n))}function R_(n,e){return(n%e+e)%e}function Xs(n,e,t){return(1-t)*n+t*e}function Ki(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Vt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Xe{constructor(e=0,t=0){Xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Er{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3],d=s[o+0],p=s[o+1],_=s[o+2],S=s[o+3];if(a<=0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a>=1){e[t+0]=d,e[t+1]=p,e[t+2]=_,e[t+3]=S;return}if(h!==S||l!==d||c!==p||u!==_){let m=l*d+c*p+u*_+h*S;m<0&&(d=-d,p=-p,_=-_,S=-S,m=-m);let f=1-a;if(m<.9995){const w=Math.acos(m),b=Math.sin(w);f=Math.sin(f*w)/b,a=Math.sin(a*w)/b,l=l*f+d*a,c=c*f+p*a,u=u*f+_*a,h=h*f+S*a}else{l=l*f+d*a,c=c*f+p*a,u=u*f+_*a,h=h*f+S*a;const w=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=w,c*=w,u*=w,h*=w}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],p=s[o+2],_=s[o+3];return e[t]=a*_+u*h+l*p-c*d,e[t+1]=l*_+u*d+c*h-a*p,e[t+2]=c*_+u*p+a*d-l*h,e[t+3]=u*_-a*h-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),p=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h-d*p*_;break;case"YXZ":this._x=d*u*h+c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h+d*p*_;break;case"ZXY":this._x=d*u*h-c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h-d*p*_;break;case"ZYX":this._x=d*u*h-c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h+d*p*_;break;case"YZX":this._x=d*u*h+c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h-d*p*_;break;case"XZY":this._x=d*u*h-c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h+d*p*_;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Hl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Hl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Zs.copy(this).projectOnVector(e),this.sub(Zs)}reflect(e){return this.sub(Zs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zs=new N,Hl=new Er;class Ue{constructor(e,t,i,r,s,o,a,l,c){Ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],_=i[8],S=r[0],m=r[3],f=r[6],w=r[1],b=r[4],E=r[7],T=r[2],A=r[5],R=r[8];return s[0]=o*S+a*w+l*T,s[3]=o*m+a*b+l*A,s[6]=o*f+a*E+l*R,s[1]=c*S+u*w+h*T,s[4]=c*m+u*b+h*A,s[7]=c*f+u*E+h*R,s[2]=d*S+p*w+_*T,s[5]=d*m+p*b+_*A,s[8]=d*f+p*E+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,p=c*s-o*l,_=t*h+i*d+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/_;return e[0]=h*S,e[1]=(r*c-u*i)*S,e[2]=(a*i-r*o)*S,e[3]=d*S,e[4]=(u*t-r*l)*S,e[5]=(r*s-a*t)*S,e[6]=p*S,e[7]=(i*l-c*t)*S,e[8]=(o*t-i*s)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(qs.makeScale(e,t)),this}rotate(e){return this.premultiply(qs.makeRotation(-e)),this}translate(e,t){return this.premultiply(qs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const qs=new Ue,Wl=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$l=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function P_(){const n={enabled:!0,workingColorSpace:Wi,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===et&&(r.r=Ln(r.r),r.g=Ln(r.g),r.b=Ln(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===et&&(r.r=Ni(r.r),r.g=Ni(r.g),r.b=Ni(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Gn?ys:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Sr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Sr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Wi]:{primaries:e,whitePoint:i,transfer:ys,toXYZ:Wl,fromXYZ:$l,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Kt},outputColorSpaceConfig:{drawingBufferColorSpace:Kt}},[Kt]:{primaries:e,whitePoint:i,transfer:et,toXYZ:Wl,fromXYZ:$l,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Kt}}}),n}const $e=P_();function Ln(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ni(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let gi;class L_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{gi===void 0&&(gi=xr("canvas")),gi.width=e.width,gi.height=e.height;const r=gi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=gi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ln(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ln(t[i]/255)*255):t[i]=Ln(t[i]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let I_=0;class Ya{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:I_++}),this.uuid=yr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ys(r[o].image)):s.push(Ys(r[o]))}else s=Ys(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Ys(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?L_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let D_=0;const js=new N;class It extends Zi{constructor(e=It.DEFAULT_IMAGE,t=It.DEFAULT_MAPPING,i=An,r=An,s=Lt,o=ui,a=sn,l=Zt,c=It.DEFAULT_ANISOTROPY,u=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:D_++}),this.uuid=yr(),this.name="",this.source=new Ya(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(js).x}get height(){return this.source.getSize(js).y}get depth(){return this.source.getSize(js).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ou)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gr:e.x=e.x-Math.floor(e.x);break;case An:e.x=e.x<0?0:1;break;case $o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case gr:e.y=e.y-Math.floor(e.y);break;case An:e.y=e.y<0?0:1;break;case $o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=Ou;It.DEFAULT_ANISOTROPY=1;class _t{constructor(e=0,t=0,i=0,r=1){_t.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],_=l[9],S=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-S)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+S)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,E=(p+1)/2,T=(f+1)/2,A=(u+d)/4,R=(h+S)/4,O=(_+m)/4;return b>E&&b>T?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=A/i,s=R/i):E>T?E<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),i=A/r,s=O/r):T<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),i=R/s,r=O/s),this.set(i,r,s,t),this}let w=Math.sqrt((m-_)*(m-_)+(h-S)*(h-S)+(d-u)*(d-u));return Math.abs(w)<.001&&(w=1),this.x=(m-_)/w,this.y=(h-S)/w,this.z=(d-u)/w,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class U_ extends Zi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Lt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new It(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Lt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Ya(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gn extends U_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Xu extends It{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=At,this.minFilter=At,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class N_ extends It{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=At,this.minFilter=At,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class br{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(en.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(en.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=en.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,en):en.fromBufferAttribute(s,o),en.applyMatrix4(e.matrixWorld),this.expandByPoint(en);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Nr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Nr.copy(i.boundingBox)),Nr.applyMatrix4(e.matrixWorld),this.union(Nr)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,en),en.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ji),Or.subVectors(this.max,Ji),_i.subVectors(e.a,Ji),vi.subVectors(e.b,Ji),xi.subVectors(e.c,Ji),Nn.subVectors(vi,_i),On.subVectors(xi,vi),Jn.subVectors(_i,xi);let t=[0,-Nn.z,Nn.y,0,-On.z,On.y,0,-Jn.z,Jn.y,Nn.z,0,-Nn.x,On.z,0,-On.x,Jn.z,0,-Jn.x,-Nn.y,Nn.x,0,-On.y,On.x,0,-Jn.y,Jn.x,0];return!Ks(t,_i,vi,xi,Or)||(t=[1,0,0,0,1,0,0,0,1],!Ks(t,_i,vi,xi,Or))?!1:(Fr.crossVectors(Nn,On),t=[Fr.x,Fr.y,Fr.z],Ks(t,_i,vi,xi,Or))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,en).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(en).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Sn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Sn=[new N,new N,new N,new N,new N,new N,new N,new N],en=new N,Nr=new br,_i=new N,vi=new N,xi=new N,Nn=new N,On=new N,Jn=new N,Ji=new N,Or=new N,Fr=new N,Qn=new N;function Ks(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Qn.fromArray(n,s);const a=r.x*Math.abs(Qn.x)+r.y*Math.abs(Qn.y)+r.z*Math.abs(Qn.z),l=e.dot(Qn),c=t.dot(Qn),u=i.dot(Qn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const O_=new br,Qi=new N,Js=new N;class Is{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):O_.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qi.subVectors(e,this.center);const t=Qi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Qi,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Js.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qi.copy(e.center).add(Js)),this.expandByPoint(Qi.copy(e.center).sub(Js))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Mn=new N,Qs=new N,kr=new N,Fn=new N,eo=new N,zr=new N,to=new N;class ja{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mn.copy(this.origin).addScaledVector(this.direction,t),Mn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Qs.copy(e).add(t).multiplyScalar(.5),kr.copy(t).sub(e).normalize(),Fn.copy(this.origin).sub(Qs);const s=e.distanceTo(t)*.5,o=-this.direction.dot(kr),a=Fn.dot(this.direction),l=-Fn.dot(kr),c=Fn.lengthSq(),u=Math.abs(1-o*o);let h,d,p,_;if(u>0)if(h=o*l-a,d=o*a-l,_=s*u,h>=0)if(d>=-_)if(d<=_){const S=1/u;h*=S,d*=S,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-_?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c):d<=_?(h=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Qs).addScaledVector(kr,d),p}intersectSphere(e,t){Mn.subVectors(e.center,this.origin);const i=Mn.dot(this.direction),r=Mn.dot(Mn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Mn)!==null}intersectTriangle(e,t,i,r,s){eo.subVectors(t,e),zr.subVectors(i,e),to.crossVectors(eo,zr);let o=this.direction.dot(to),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,e);const l=a*this.direction.dot(zr.crossVectors(Fn,zr));if(l<0)return null;const c=a*this.direction.dot(eo.cross(Fn));if(c<0||l+c>o)return null;const u=-a*Fn.dot(to);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,i,r,s,o,a,l,c,u,h,d,p,_,S,m){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,d,p,_,S,m)}set(e,t,i,r,s,o,a,l,c,u,h,d,p,_,S,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=_,f[11]=S,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/Si.setFromMatrixColumn(e,0).length(),s=1/Si.setFromMatrixColumn(e,1).length(),o=1/Si.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,p=o*h,_=a*u,S=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=p+_*c,t[5]=d-S*c,t[9]=-a*l,t[2]=S-d*c,t[6]=_+p*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*u,p=l*h,_=c*u,S=c*h;t[0]=d+S*a,t[4]=_*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=p*a-_,t[6]=S+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*u,p=l*h,_=c*u,S=c*h;t[0]=d-S*a,t[4]=-o*h,t[8]=_+p*a,t[1]=p+_*a,t[5]=o*u,t[9]=S-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*u,p=o*h,_=a*u,S=a*h;t[0]=l*u,t[4]=_*c-p,t[8]=d*c+S,t[1]=l*h,t[5]=S*c+d,t[9]=p*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,_=a*l,S=a*c;t[0]=l*u,t[4]=S-d*h,t[8]=_*h+p,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*h+_,t[10]=d-S*h}else if(e.order==="XZY"){const d=o*l,p=o*c,_=a*l,S=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+S,t[5]=o*u,t[9]=p*h-_,t[2]=_*h-p,t[6]=a*u,t[10]=S*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(F_,e,k_)}lookAt(e,t,i){const r=this.elements;return $t.subVectors(e,t),$t.lengthSq()===0&&($t.z=1),$t.normalize(),kn.crossVectors(i,$t),kn.lengthSq()===0&&(Math.abs(i.z)===1?$t.x+=1e-4:$t.z+=1e-4,$t.normalize(),kn.crossVectors(i,$t)),kn.normalize(),Br.crossVectors($t,kn),r[0]=kn.x,r[4]=Br.x,r[8]=$t.x,r[1]=kn.y,r[5]=Br.y,r[9]=$t.y,r[2]=kn.z,r[6]=Br.z,r[10]=$t.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],_=i[2],S=i[6],m=i[10],f=i[14],w=i[3],b=i[7],E=i[11],T=i[15],A=r[0],R=r[4],O=r[8],v=r[12],M=r[1],L=r[5],k=r[9],F=r[13],G=r[2],Z=r[6],V=r[10],W=r[14],K=r[3],he=r[7],ae=r[11],de=r[15];return s[0]=o*A+a*M+l*G+c*K,s[4]=o*R+a*L+l*Z+c*he,s[8]=o*O+a*k+l*V+c*ae,s[12]=o*v+a*F+l*W+c*de,s[1]=u*A+h*M+d*G+p*K,s[5]=u*R+h*L+d*Z+p*he,s[9]=u*O+h*k+d*V+p*ae,s[13]=u*v+h*F+d*W+p*de,s[2]=_*A+S*M+m*G+f*K,s[6]=_*R+S*L+m*Z+f*he,s[10]=_*O+S*k+m*V+f*ae,s[14]=_*v+S*F+m*W+f*de,s[3]=w*A+b*M+E*G+T*K,s[7]=w*R+b*L+E*Z+T*he,s[11]=w*O+b*k+E*V+T*ae,s[15]=w*v+b*F+E*W+T*de,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],p=e[14],_=e[3],S=e[7],m=e[11],f=e[15],w=l*p-c*d,b=a*p-c*h,E=a*d-l*h,T=o*p-c*u,A=o*d-l*u,R=o*h-a*u;return t*(S*w-m*b+f*E)-i*(_*w-m*T+f*A)+r*(_*b-S*T+f*R)-s*(_*E-S*A+m*R)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],p=e[11],_=e[12],S=e[13],m=e[14],f=e[15],w=h*m*c-S*d*c+S*l*p-a*m*p-h*l*f+a*d*f,b=_*d*c-u*m*c-_*l*p+o*m*p+u*l*f-o*d*f,E=u*S*c-_*h*c+_*a*p-o*S*p-u*a*f+o*h*f,T=_*h*l-u*S*l-_*a*d+o*S*d+u*a*m-o*h*m,A=t*w+i*b+r*E+s*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=w*R,e[1]=(S*d*s-h*m*s-S*r*p+i*m*p+h*r*f-i*d*f)*R,e[2]=(a*m*s-S*l*s+S*r*c-i*m*c-a*r*f+i*l*f)*R,e[3]=(h*l*s-a*d*s-h*r*c+i*d*c+a*r*p-i*l*p)*R,e[4]=b*R,e[5]=(u*m*s-_*d*s+_*r*p-t*m*p-u*r*f+t*d*f)*R,e[6]=(_*l*s-o*m*s-_*r*c+t*m*c+o*r*f-t*l*f)*R,e[7]=(o*d*s-u*l*s+u*r*c-t*d*c-o*r*p+t*l*p)*R,e[8]=E*R,e[9]=(_*h*s-u*S*s-_*i*p+t*S*p+u*i*f-t*h*f)*R,e[10]=(o*S*s-_*a*s+_*i*c-t*S*c-o*i*f+t*a*f)*R,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*p-t*a*p)*R,e[12]=T*R,e[13]=(u*S*r-_*h*r+_*i*d-t*S*d-u*i*m+t*h*m)*R,e[14]=(_*a*r-o*S*r-_*i*l+t*S*l+o*i*m-t*a*m)*R,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*d+t*a*d)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,p=s*u,_=s*h,S=o*u,m=o*h,f=a*h,w=l*c,b=l*u,E=l*h,T=i.x,A=i.y,R=i.z;return r[0]=(1-(S+f))*T,r[1]=(p+E)*T,r[2]=(_-b)*T,r[3]=0,r[4]=(p-E)*A,r[5]=(1-(d+f))*A,r[6]=(m+w)*A,r[7]=0,r[8]=(_+b)*R,r[9]=(m-w)*R,r[10]=(1-(d+S))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;if(e.x=r[12],e.y=r[13],e.z=r[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let s=Si.set(r[0],r[1],r[2]).length();const o=Si.set(r[4],r[5],r[6]).length(),a=Si.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),tn.copy(this);const c=1/s,u=1/o,h=1/a;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=u,tn.elements[5]*=u,tn.elements[6]*=u,tn.elements[8]*=h,tn.elements[9]*=h,tn.elements[10]*=h,t.setFromRotationMatrix(tn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=pn,l=!1){const c=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),p=(i+r)/(i-r);let _,S;if(l)_=s/(o-s),S=o*s/(o-s);else if(a===pn)_=-(o+s)/(o-s),S=-2*o*s/(o-s);else if(a===Es)_=-o/(o-s),S=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=pn,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),p=-(i+r)/(i-r);let _,S;if(l)_=1/(o-s),S=o/(o-s);else if(a===pn)_=-2/(o-s),S=-(o+s)/(o-s);else if(a===Es)_=-1/(o-s),S=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=_,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Si=new N,tn=new ut,F_=new N(0,0,0),k_=new N(1,1,1),kn=new N,Br=new N,$t=new N,Xl=new ut,Zl=new Er;class vn{constructor(e=0,t=0,i=0,r=vn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Xl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Zl.setFromEuler(this),this.setFromQuaternion(Zl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vn.DEFAULT_ORDER="XYZ";class Ka{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let z_=0;const ql=new N,Mi=new Er,yn=new ut,Vr=new N,er=new N,B_=new N,V_=new Er,Yl=new N(1,0,0),jl=new N(0,1,0),Kl=new N(0,0,1),Jl={type:"added"},G_={type:"removed"},yi={type:"childadded",child:null},no={type:"childremoved",child:null};class Ct extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:z_++}),this.uuid=yr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new N,t=new vn,i=new Er,r=new N(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ut},normalMatrix:{value:new Ue}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(Yl,e)}rotateY(e){return this.rotateOnAxis(jl,e)}rotateZ(e){return this.rotateOnAxis(Kl,e)}translateOnAxis(e,t){return ql.copy(e).applyQuaternion(this.quaternion),this.position.add(ql.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yl,e)}translateY(e){return this.translateOnAxis(jl,e)}translateZ(e){return this.translateOnAxis(Kl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Vr.copy(e):Vr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(er,Vr,this.up):yn.lookAt(Vr,er,this.up),this.quaternion.setFromRotationMatrix(yn),r&&(yn.extractRotation(r.matrixWorld),Mi.setFromRotationMatrix(yn),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(We("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jl),yi.child=e,this.dispatchEvent(yi),yi.child=null):We("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(G_),no.child=e,this.dispatchEvent(no),no.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jl),yi.child=e,this.dispatchEvent(yi),yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,B_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,V_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),p=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ct.DEFAULT_UP=new N(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new N,En=new N,io=new N,bn=new N,Ei=new N,bi=new N,Ql=new N,ro=new N,so=new N,oo=new N,ao=new _t,lo=new _t,co=new _t;class rn{constructor(e=new N,t=new N,i=new N){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),nn.subVectors(e,t),r.cross(nn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){nn.subVectors(r,t),En.subVectors(i,t),io.subVectors(e,t);const o=nn.dot(nn),a=nn.dot(En),l=nn.dot(io),c=En.dot(En),u=En.dot(io),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,p=(c*l-a*u)*d,_=(o*u-a*l)*d;return s.set(1-p-_,_,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,bn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,bn.x),l.addScaledVector(o,bn.y),l.addScaledVector(a,bn.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return ao.setScalar(0),lo.setScalar(0),co.setScalar(0),ao.fromBufferAttribute(e,t),lo.fromBufferAttribute(e,i),co.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(ao,s.x),o.addScaledVector(lo,s.y),o.addScaledVector(co,s.z),o}static isFrontFacing(e,t,i,r){return nn.subVectors(i,t),En.subVectors(e,t),nn.cross(En).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return nn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),nn.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return rn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Ei.subVectors(r,i),bi.subVectors(s,i),ro.subVectors(e,i);const l=Ei.dot(ro),c=bi.dot(ro);if(l<=0&&c<=0)return t.copy(i);so.subVectors(e,r);const u=Ei.dot(so),h=bi.dot(so);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Ei,o);oo.subVectors(e,s);const p=Ei.dot(oo),_=bi.dot(oo);if(_>=0&&p<=_)return t.copy(s);const S=p*c-l*_;if(S<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(i).addScaledVector(bi,a);const m=u*_-p*h;if(m<=0&&h-u>=0&&p-_>=0)return Ql.subVectors(s,r),a=(h-u)/(h-u+(p-_)),t.copy(r).addScaledVector(Ql,a);const f=1/(m+S+d);return o=S*f,a=d*f,t.copy(i).addScaledVector(Ei,o).addScaledVector(bi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Zu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zn={h:0,s:0,l:0},Gr={h:0,s:0,l:0};function uo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ge{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=$e.workingColorSpace){if(e=R_(e,1),t=Ve(t,0,1),i=Ve(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=uo(o,s,e+1/3),this.g=uo(o,s,e),this.b=uo(o,s,e-1/3)}return $e.colorSpaceToWorking(this,r),this}setStyle(e,t=Kt){function i(s){s!==void 0&&parseFloat(s)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kt){const i=Zu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ln(e.r),this.g=Ln(e.g),this.b=Ln(e.b),this}copyLinearToSRGB(e){return this.r=Ni(e.r),this.g=Ni(e.g),this.b=Ni(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kt){return $e.workingToColorSpace(Pt.copy(this),e),Math.round(Ve(Pt.r*255,0,255))*65536+Math.round(Ve(Pt.g*255,0,255))*256+Math.round(Ve(Pt.b*255,0,255))}getHexString(e=Kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Pt.copy(this),t);const i=Pt.r,r=Pt.g,s=Pt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Kt){$e.workingToColorSpace(Pt.copy(this),e);const t=Pt.r,i=Pt.g,r=Pt.b;return e!==Kt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(zn),this.setHSL(zn.h+e,zn.s+t,zn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(zn),e.getHSL(Gr);const i=Xs(zn.h,Gr.h,t),r=Xs(zn.s,Gr.s,t),s=Xs(zn.l,Gr.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new Ge;Ge.NAMES=Zu;let H_=0;class qi extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:H_++}),this.uuid=yr(),this.name="",this.type="Material",this.blending=Ui,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uo,this.blendDst=No,this.blendEquation=oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=Vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mi,this.stencilZFail=mi,this.stencilZPass=mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(i.blending=this.blending),this.side!==Zn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Uo&&(i.blendSrc=this.blendSrc),this.blendDst!==No&&(i.blendDst=this.blendDst),this.blendEquation!==oi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==mi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==mi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class bs extends qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mt=new N,Hr=new Xe;let W_=0;class on{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:W_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=zl,this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Hr.fromBufferAttribute(this,t),Hr.applyMatrix3(e),this.setXY(t,Hr.x,Hr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ki(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Vt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ki(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ki(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ki(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ki(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),i=Vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),i=Vt(i,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),i=Vt(i,this.array),r=Vt(r,this.array),s=Vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==zl&&(e.usage=this.usage),e}}class qu extends on{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Yu extends on{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class kt extends on{constructor(e,t,i){super(new Float32Array(e),t,i)}}let $_=0;const jt=new ut,ho=new Ct,Ti=new N,Xt=new br,tr=new br,wt=new N;class qt extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$_++}),this.uuid=yr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($u(e)?Yu:qu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ue().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return jt.makeRotationFromQuaternion(e),this.applyMatrix4(jt),this}rotateX(e){return jt.makeRotationX(e),this.applyMatrix4(jt),this}rotateY(e){return jt.makeRotationY(e),this.applyMatrix4(jt),this}rotateZ(e){return jt.makeRotationZ(e),this.applyMatrix4(jt),this}translate(e,t,i){return jt.makeTranslation(e,t,i),this.applyMatrix4(jt),this}scale(e,t,i){return jt.makeScale(e,t,i),this.applyMatrix4(jt),this}lookAt(e){return ho.lookAt(e),ho.updateMatrix(),this.applyMatrix4(ho.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new kt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new br);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Xt.setFromBufferAttribute(s),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Xt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Xt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Xt.min),this.boundingBox.expandByPoint(Xt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&We('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(Xt.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];tr.setFromBufferAttribute(a),this.morphTargetsRelative?(wt.addVectors(Xt.min,tr.min),Xt.expandByPoint(wt),wt.addVectors(Xt.max,tr.max),Xt.expandByPoint(wt)):(Xt.expandByPoint(tr.min),Xt.expandByPoint(tr.max))}Xt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(wt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)wt.fromBufferAttribute(a,c),l&&(Ti.fromBufferAttribute(e,c),wt.add(Ti)),r=Math.max(r,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&We('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){We("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let O=0;O<i.count;O++)a[O]=new N,l[O]=new N;const c=new N,u=new N,h=new N,d=new Xe,p=new Xe,_=new Xe,S=new N,m=new N;function f(O,v,M){c.fromBufferAttribute(i,O),u.fromBufferAttribute(i,v),h.fromBufferAttribute(i,M),d.fromBufferAttribute(s,O),p.fromBufferAttribute(s,v),_.fromBufferAttribute(s,M),u.sub(c),h.sub(c),p.sub(d),_.sub(d);const L=1/(p.x*_.y-_.x*p.y);isFinite(L)&&(S.copy(u).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(L),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(L),a[O].add(S),a[v].add(S),a[M].add(S),l[O].add(m),l[v].add(m),l[M].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let O=0,v=w.length;O<v;++O){const M=w[O],L=M.start,k=M.count;for(let F=L,G=L+k;F<G;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const b=new N,E=new N,T=new N,A=new N;function R(O){T.fromBufferAttribute(r,O),A.copy(T);const v=a[O];b.copy(v),b.sub(T.multiplyScalar(T.dot(v))).normalize(),E.crossVectors(A,v);const L=E.dot(l[O])<0?-1:1;o.setXYZW(O,b.x,b.y,b.z,L)}for(let O=0,v=w.length;O<v;++O){const M=w[O],L=M.start,k=M.count;for(let F=L,G=L+k;F<G;F+=3)R(e.getX(F+0)),R(e.getX(F+1)),R(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new on(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new N,s=new N,o=new N,a=new N,l=new N,c=new N,u=new N,h=new N;if(e)for(let d=0,p=e.count;d<p;d+=3){const _=e.getX(d+0),S=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,S),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,S),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let p=0,_=0;for(let S=0,m=l.length;S<m;S++){a.isInterleavedBufferAttribute?p=l[S]*a.data.stride+a.offset:p=l[S]*u;for(let f=0;f<u;f++)d[_++]=c[p++]}return new on(d,u,h)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=e(d,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ec=new ut,ei=new ja,Wr=new Is,tc=new N,$r=new N,Xr=new N,Zr=new N,fo=new N,qr=new N,nc=new N,Yr=new N;class Ot extends Ct{constructor(e=new qt,t=new bs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){qr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(fo.fromBufferAttribute(h,e),o?qr.addScaledVector(fo,u):qr.addScaledVector(fo.sub(t),u))}t.add(qr)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Wr.copy(i.boundingSphere),Wr.applyMatrix4(s),ei.copy(e.ray).recast(e.near),!(Wr.containsPoint(ei.origin)===!1&&(ei.intersectSphere(Wr,tc)===null||ei.origin.distanceToSquared(tc)>(e.far-e.near)**2))&&(ec.copy(s).invert(),ei.copy(e.ray).applyMatrix4(ec),!(i.boundingBox!==null&&ei.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ei)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,S=d.length;_<S;_++){const m=d[_],f=o[m.materialIndex],w=Math.max(m.start,p.start),b=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let E=w,T=b;E<T;E+=3){const A=a.getX(E),R=a.getX(E+1),O=a.getX(E+2);r=jr(this,f,e,i,c,u,h,A,R,O),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,p.start),S=Math.min(a.count,p.start+p.count);for(let m=_,f=S;m<f;m+=3){const w=a.getX(m),b=a.getX(m+1),E=a.getX(m+2);r=jr(this,o,e,i,c,u,h,w,b,E),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,S=d.length;_<S;_++){const m=d[_],f=o[m.materialIndex],w=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let E=w,T=b;E<T;E+=3){const A=E,R=E+1,O=E+2;r=jr(this,f,e,i,c,u,h,A,R,O),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,p.start),S=Math.min(l.count,p.start+p.count);for(let m=_,f=S;m<f;m+=3){const w=m,b=m+1,E=m+2;r=jr(this,o,e,i,c,u,h,w,b,E),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function X_(n,e,t,i,r,s,o,a){let l;if(e.side===Ft?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Zn,a),l===null)return null;Yr.copy(a),Yr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Yr);return c<t.near||c>t.far?null:{distance:c,point:Yr.clone(),object:n}}function jr(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,$r),n.getVertexPosition(l,Xr),n.getVertexPosition(c,Zr);const u=X_(n,e,t,i,$r,Xr,Zr,nc);if(u){const h=new N;rn.getBarycoord(nc,$r,Xr,Zr,h),r&&(u.uv=rn.getInterpolatedAttribute(r,a,l,c,h,new Xe)),s&&(u.uv1=rn.getInterpolatedAttribute(s,a,l,c,h,new Xe)),o&&(u.normal=rn.getInterpolatedAttribute(o,a,l,c,h,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new N,materialIndex:0};rn.getNormal($r,Xr,Zr,d.normal),u.face=d,u.barycoord=h}return u}class Tr extends qt{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,p=0;_("z","y","x",-1,-1,i,t,e,o,s,0),_("z","y","x",1,-1,i,t,-e,o,s,1),_("x","z","y",1,1,e,i,t,r,o,2),_("x","z","y",1,-1,e,i,-t,r,o,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new kt(c,3)),this.setAttribute("normal",new kt(u,3)),this.setAttribute("uv",new kt(h,2));function _(S,m,f,w,b,E,T,A,R,O,v){const M=E/R,L=T/O,k=E/2,F=T/2,G=A/2,Z=R+1,V=O+1;let W=0,K=0;const he=new N;for(let ae=0;ae<V;ae++){const de=ae*L-F;for(let ze=0;ze<Z;ze++){const Oe=ze*M-k;he[S]=Oe*w,he[m]=de*b,he[f]=G,c.push(he.x,he.y,he.z),he[S]=0,he[m]=0,he[f]=A>0?1:-1,u.push(he.x,he.y,he.z),h.push(ze/R),h.push(1-ae/O),W+=1}}for(let ae=0;ae<O;ae++)for(let de=0;de<R;de++){const ze=d+de+Z*ae,Oe=d+de+Z*(ae+1),ft=d+(de+1)+Z*(ae+1),lt=d+(de+1)+Z*ae;l.push(ze,Oe,lt),l.push(Oe,ft,lt),K+=6}a.addGroup(p,K,v),p+=K,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Tr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $i(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Nt(n){const e={};for(let t=0;t<n.length;t++){const i=$i(n[t]);for(const r in i)e[r]=i[r]}return e}function Z_(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function ju(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const q_={clone:$i,merge:Nt};var Y_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,j_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ln extends qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Y_,this.fragmentShader=j_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$i(e.uniforms),this.uniformsGroups=Z_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Ku extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=pn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Bn=new N,ic=new Xe,rc=new Xe;class Jt extends Ku{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ba*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan($s*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ba*2*Math.atan(Math.tan($s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z)}getViewSize(e,t){return this.getViewBounds(e,ic,rc),t.subVectors(rc,ic)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan($s*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const wi=-90,Ai=1;class K_ extends Ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Jt(wi,Ai,e,t);r.layers=this.layers,this.add(r);const s=new Jt(wi,Ai,e,t);s.layers=this.layers,this.add(s);const o=new Jt(wi,Ai,e,t);o.layers=this.layers,this.add(o);const a=new Jt(wi,Ai,e,t);a.layers=this.layers,this.add(a);const l=new Jt(wi,Ai,e,t);l.layers=this.layers,this.add(l);const c=new Jt(wi,Ai,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===pn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Es)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Ju extends It{constructor(e=[],t=di,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Qu extends gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Ju(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Tr(5,5,5),s=new ln({name:"CubemapFromEquirect",uniforms:$i(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ft,blending:Pn});s.uniforms.tEquirect.value=t;const o=new Ot(r,s),a=t.minFilter;return t.minFilter===ui&&(t.minFilter=Lt),new K_(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class wn extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const J_={type:"move"};class po{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const S of e.hand.values()){const m=t.getJointPose(S,i),f=this._getHandJoint(c,S);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,_=.005;c.inputState.pinching&&d>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(J_)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new wn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Q_ extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ev extends It{constructor(e=null,t=1,i=1,r,s,o,a,l,c=At,u=At,h,d){super(null,o,a,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const mo=new N,tv=new N,nv=new Ue;class si{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=mo.subVectors(i,t).cross(tv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(mo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||nv.getNormalMatrix(e),r=this.coplanarPoint(mo).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ti=new Is,iv=new Xe(.5,.5),Kr=new N;class Ja{constructor(e=new si,t=new si,i=new si,r=new si,s=new si,o=new si){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=pn,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],p=s[7],_=s[8],S=s[9],m=s[10],f=s[11],w=s[12],b=s[13],E=s[14],T=s[15];if(r[0].setComponents(c-o,p-u,f-_,T-w).normalize(),r[1].setComponents(c+o,p+u,f+_,T+w).normalize(),r[2].setComponents(c+a,p+h,f+S,T+b).normalize(),r[3].setComponents(c-a,p-h,f-S,T-b).normalize(),i)r[4].setComponents(l,d,m,E).normalize(),r[5].setComponents(c-l,p-d,f-m,T-E).normalize();else if(r[4].setComponents(c-l,p-d,f-m,T-E).normalize(),t===pn)r[5].setComponents(c+l,p+d,f+m,T+E).normalize();else if(t===Es)r[5].setComponents(l,d,m,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(e){ti.center.set(0,0,0);const t=iv.distanceTo(e.center);return ti.radius=.7071067811865476+t,ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Kr.x=r.normal.x>0?e.max.x:e.min.x,Kr.y=r.normal.y>0?e.max.y:e.min.y,Kr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Kr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class eh extends qi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const sc=new ut,Ta=new ja,Jr=new Is,Qr=new N;class rv extends Ct{constructor(e=new qt,t=new eh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Jr.copy(i.boundingSphere),Jr.applyMatrix4(r),Jr.radius+=s,e.ray.intersectsSphere(Jr)===!1)return;sc.copy(r).invert(),Ta.copy(e.ray).applyMatrix4(sc);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let _=d,S=p;_<S;_++){const m=c.getX(_);Qr.fromBufferAttribute(h,m),oc(Qr,m,l,r,e,t,this)}}else{const d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=d,S=p;_<S;_++)Qr.fromBufferAttribute(h,_),oc(Qr,_,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function oc(n,e,t,i,r,s,o){const a=Ta.distanceSqToPoint(n);if(a<t){const l=new N;Ta.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Mr extends It{constructor(e,t,i=_n,r,s,o,a=At,l=At,c,u=Un,h=1){if(u!==Un&&u!==hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ya(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class sv extends Mr{constructor(e,t=_n,i=di,r,s,o=At,a=At,l,c=Un){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class th extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Qa extends qt{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],p=[];let _=0;const S=[],m=i/2;let f=0;w(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new kt(h,3)),this.setAttribute("normal",new kt(d,3)),this.setAttribute("uv",new kt(p,2));function w(){const E=new N,T=new N;let A=0;const R=(t-e)/i;for(let O=0;O<=s;O++){const v=[],M=O/s,L=M*(t-e)+e;for(let k=0;k<=r;k++){const F=k/r,G=F*l+a,Z=Math.sin(G),V=Math.cos(G);T.x=L*Z,T.y=-M*i+m,T.z=L*V,h.push(T.x,T.y,T.z),E.set(Z,R,V).normalize(),d.push(E.x,E.y,E.z),p.push(F,1-M),v.push(_++)}S.push(v)}for(let O=0;O<r;O++)for(let v=0;v<s;v++){const M=S[v][O],L=S[v+1][O],k=S[v+1][O+1],F=S[v][O+1];(e>0||v!==0)&&(u.push(M,L,F),A+=3),(t>0||v!==s-1)&&(u.push(L,k,F),A+=3)}c.addGroup(f,A,0),f+=A}function b(E){const T=_,A=new Xe,R=new N;let O=0;const v=E===!0?e:t,M=E===!0?1:-1;for(let k=1;k<=r;k++)h.push(0,m*M,0),d.push(0,M,0),p.push(.5,.5),_++;const L=_;for(let k=0;k<=r;k++){const G=k/r*l+a,Z=Math.cos(G),V=Math.sin(G);R.x=v*V,R.y=m*M,R.z=v*Z,h.push(R.x,R.y,R.z),d.push(0,M,0),A.x=Z*.5+.5,A.y=V*.5*M+.5,p.push(A.x,A.y),_++}for(let k=0;k<r;k++){const F=T+k,G=L+k;E===!0?u.push(G,G+1,F):u.push(G+1,G,F),O+=3}c.addGroup(f,O,E===!0?1:2),f+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qa(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ds extends qt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,p=[],_=[],S=[],m=[];for(let f=0;f<u;f++){const w=f*d-o;for(let b=0;b<c;b++){const E=b*h-s;_.push(E,-w,0),S.push(0,0,1),m.push(b/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let w=0;w<a;w++){const b=w+c*f,E=w+c*(f+1),T=w+1+c*(f+1),A=w+1+c*f;p.push(b,E,A),p.push(E,T,A)}this.setIndex(p),this.setAttribute("position",new kt(_,3)),this.setAttribute("normal",new kt(S,3)),this.setAttribute("uv",new kt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.width,e.height,e.widthSegments,e.heightSegments)}}class ai extends qt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new N,d=new N,p=[],_=[],S=[],m=[];for(let f=0;f<=i;f++){const w=[],b=f/i;let E=0;f===0&&o===0?E=.5/t:f===i&&l===Math.PI&&(E=-.5/t);for(let T=0;T<=t;T++){const A=T/t;h.x=-e*Math.cos(r+A*s)*Math.sin(o+b*a),h.y=e*Math.cos(o+b*a),h.z=e*Math.sin(r+A*s)*Math.sin(o+b*a),_.push(h.x,h.y,h.z),d.copy(h).normalize(),S.push(d.x,d.y,d.z),m.push(A+E,1-b),w.push(c++)}u.push(w)}for(let f=0;f<i;f++)for(let w=0;w<t;w++){const b=u[f][w+1],E=u[f][w],T=u[f+1][w],A=u[f+1][w+1];(f!==0||o>0)&&p.push(b,E,A),(f!==i-1||l<Math.PI)&&p.push(E,T,A)}this.setIndex(p),this.setAttribute("position",new kt(_,3)),this.setAttribute("normal",new kt(S,3)),this.setAttribute("uv",new kt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ai(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ov extends ln{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class go extends qi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ge(16777215),this.specular=new Ge(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wu,this.normalScale=new Xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class av extends qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=x_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lv extends qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const _o={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class cv{constructor(e,t,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const p=c[h],_=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const uv=new cv;class el{constructor(e){this.manager=e!==void 0?e:uv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}el.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ci=new WeakMap;class hv extends el{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=_o.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);else{let h=Ci.get(o);h===void 0&&(h=[],Ci.set(o,h)),h.push({onLoad:t,onError:r})}return o}const a=xr("img");function l(){u(),t&&t(this);const h=Ci.get(this)||[];for(let d=0;d<h.length;d++){const p=h[d];p.onLoad&&p.onLoad(this)}Ci.delete(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),_o.remove(`image:${e}`);const d=Ci.get(this)||[];for(let p=0;p<d.length;p++){const _=d[p];_.onError&&_.onError(h)}Ci.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),_o.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}}class dv extends el{constructor(e){super(e)}load(e,t,i,r){const s=new It,o=new hv(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},i,r),s}}class nh extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const vo=new ut,ac=new N,lc=new N;class fv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xe(512,512),this.mapType=Zt,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ja,this._frameExtents=new Xe(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;ac.setFromMatrixPosition(e.matrixWorld),t.position.copy(ac),lc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(lc),t.updateMatrixWorld(),vo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(vo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class tl extends Ku{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class pv extends fv{constructor(){super(new tl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cc extends nh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new pv}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class mv extends nh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class gv extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const uc=new ut;class _v{constructor(e,t,i=0,r=1/0){this.ray=new ja(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Ka,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):We("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return uc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(uc),this}intersectObject(e,t=!0,i=[]){return wa(e,this,i,t),i.sort(hc),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)wa(e[r],this,i,t);return i.sort(hc),i}}function hc(n,e){return n.distance-e.distance}function wa(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)wa(s[o],e,t,!0)}}function dc(n,e,t,i){const r=vv(i);switch(t){case Vu:return n*e;case Hu:return n*e/r.components*r.byteLength;case Wa:return n*e/r.components*r.byteLength;case Hi:return n*e*2/r.components*r.byteLength;case $a:return n*e*2/r.components*r.byteLength;case Gu:return n*e*3/r.components*r.byteLength;case sn:return n*e*4/r.components*r.byteLength;case Xa:return n*e*4/r.components*r.byteLength;case as:case ls:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case cs:case us:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zo:case Yo:return Math.max(n,16)*Math.max(e,8)/4;case Xo:case qo:return Math.max(n,8)*Math.max(e,8)/2;case jo:case Ko:case Qo:case ea:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Jo:case ta:case na:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ia:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ra:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case sa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case oa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case aa:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case la:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ca:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ua:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ha:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case da:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case fa:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case pa:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ma:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ga:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case _a:case va:case xa:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Sa:case Ma:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ya:case Ea:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vv(n){switch(n){case Zt:case Fu:return{byteLength:1,components:1};case _r:case ku:case Dn:return{byteLength:2,components:1};case Ga:case Ha:return{byteLength:2,components:4};case _n:case Va:case fn:return{byteLength:4,components:1};case zu:case Bu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:za}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=za);function ih(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function xv(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((p,_)=>p.start-_.start);let d=0;for(let p=1;p<h.length;p++){const _=h[d],S=h[p];S.start<=_.start+_.count+1?_.count=Math.max(_.count,S.start+S.count-_.start):(++d,h[d]=S)}h.length=d+1;for(let p=0,_=h.length;p<_;p++){const S=h[p];n.bufferSubData(c,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var Sv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ev=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Av=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Rv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Iv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Dv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Uv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ov=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Hv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$v=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,e0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,t0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,n0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,i0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,r0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,s0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,o0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,a0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,l0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,c0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,u0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,h0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,d0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,f0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,p0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,m0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,g0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,v0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,x0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,S0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,M0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,y0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,E0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,b0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,T0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,w0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,A0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,C0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,R0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,P0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,L0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,I0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,D0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,U0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,N0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,O0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,F0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,k0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,G0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,H0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,W0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,X0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Z0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,q0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Y0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,j0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,K0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,J0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Q0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ex=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,nx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ix=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ox=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ax=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ux=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,px=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_x=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,vx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ex=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,wx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ax=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Cx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Rx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Px=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ix=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ux=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ox=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Vx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Wx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$x=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:Sv,alphahash_pars_fragment:Mv,alphamap_fragment:yv,alphamap_pars_fragment:Ev,alphatest_fragment:bv,alphatest_pars_fragment:Tv,aomap_fragment:wv,aomap_pars_fragment:Av,batching_pars_vertex:Cv,batching_vertex:Rv,begin_vertex:Pv,beginnormal_vertex:Lv,bsdfs:Iv,iridescence_fragment:Dv,bumpmap_pars_fragment:Uv,clipping_planes_fragment:Nv,clipping_planes_pars_fragment:Ov,clipping_planes_pars_vertex:Fv,clipping_planes_vertex:kv,color_fragment:zv,color_pars_fragment:Bv,color_pars_vertex:Vv,color_vertex:Gv,common:Hv,cube_uv_reflection_fragment:Wv,defaultnormal_vertex:$v,displacementmap_pars_vertex:Xv,displacementmap_vertex:Zv,emissivemap_fragment:qv,emissivemap_pars_fragment:Yv,colorspace_fragment:jv,colorspace_pars_fragment:Kv,envmap_fragment:Jv,envmap_common_pars_fragment:Qv,envmap_pars_fragment:e0,envmap_pars_vertex:t0,envmap_physical_pars_fragment:d0,envmap_vertex:n0,fog_vertex:i0,fog_pars_vertex:r0,fog_fragment:s0,fog_pars_fragment:o0,gradientmap_pars_fragment:a0,lightmap_pars_fragment:l0,lights_lambert_fragment:c0,lights_lambert_pars_fragment:u0,lights_pars_begin:h0,lights_toon_fragment:f0,lights_toon_pars_fragment:p0,lights_phong_fragment:m0,lights_phong_pars_fragment:g0,lights_physical_fragment:_0,lights_physical_pars_fragment:v0,lights_fragment_begin:x0,lights_fragment_maps:S0,lights_fragment_end:M0,logdepthbuf_fragment:y0,logdepthbuf_pars_fragment:E0,logdepthbuf_pars_vertex:b0,logdepthbuf_vertex:T0,map_fragment:w0,map_pars_fragment:A0,map_particle_fragment:C0,map_particle_pars_fragment:R0,metalnessmap_fragment:P0,metalnessmap_pars_fragment:L0,morphinstance_vertex:I0,morphcolor_vertex:D0,morphnormal_vertex:U0,morphtarget_pars_vertex:N0,morphtarget_vertex:O0,normal_fragment_begin:F0,normal_fragment_maps:k0,normal_pars_fragment:z0,normal_pars_vertex:B0,normal_vertex:V0,normalmap_pars_fragment:G0,clearcoat_normal_fragment_begin:H0,clearcoat_normal_fragment_maps:W0,clearcoat_pars_fragment:$0,iridescence_pars_fragment:X0,opaque_fragment:Z0,packing:q0,premultiplied_alpha_fragment:Y0,project_vertex:j0,dithering_fragment:K0,dithering_pars_fragment:J0,roughnessmap_fragment:Q0,roughnessmap_pars_fragment:ex,shadowmap_pars_fragment:tx,shadowmap_pars_vertex:nx,shadowmap_vertex:ix,shadowmask_pars_fragment:rx,skinbase_vertex:sx,skinning_pars_vertex:ox,skinning_vertex:ax,skinnormal_vertex:lx,specularmap_fragment:cx,specularmap_pars_fragment:ux,tonemapping_fragment:hx,tonemapping_pars_fragment:dx,transmission_fragment:fx,transmission_pars_fragment:px,uv_pars_fragment:mx,uv_pars_vertex:gx,uv_vertex:_x,worldpos_vertex:vx,background_vert:xx,background_frag:Sx,backgroundCube_vert:Mx,backgroundCube_frag:yx,cube_vert:Ex,cube_frag:bx,depth_vert:Tx,depth_frag:wx,distance_vert:Ax,distance_frag:Cx,equirect_vert:Rx,equirect_frag:Px,linedashed_vert:Lx,linedashed_frag:Ix,meshbasic_vert:Dx,meshbasic_frag:Ux,meshlambert_vert:Nx,meshlambert_frag:Ox,meshmatcap_vert:Fx,meshmatcap_frag:kx,meshnormal_vert:zx,meshnormal_frag:Bx,meshphong_vert:Vx,meshphong_frag:Gx,meshphysical_vert:Hx,meshphysical_frag:Wx,meshtoon_vert:$x,meshtoon_frag:Xx,points_vert:Zx,points_frag:qx,shadow_vert:Yx,shadow_frag:jx,sprite_vert:Kx,sprite_frag:Jx},le={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},dn={basic:{uniforms:Nt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Nt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Nt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Nt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Nt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Nt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Nt([le.points,le.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Nt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Nt([le.common,le.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Nt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Nt([le.sprite,le.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distance:{uniforms:Nt([le.common,le.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distance_vert,fragmentShader:Ne.distance_frag},shadow:{uniforms:Nt([le.lights,le.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};dn.physical={uniforms:Nt([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const es={r:0,b:0,g:0},ni=new vn,Qx=new ut;function eS(n,e,t,i,r,s,o){const a=new Ge(0);let l=s===!0?0:1,c,u,h=null,d=0,p=null;function _(b){let E=b.isScene===!0?b.background:null;return E&&E.isTexture&&(E=(b.backgroundBlurriness>0?t:e).get(E)),E}function S(b){let E=!1;const T=_(b);T===null?f(a,l):T&&T.isColor&&(f(T,1),E=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(b,E){const T=_(E);T&&(T.isCubeTexture||T.mapping===Ls)?(u===void 0&&(u=new Ot(new Tr(1,1,1),new ln({name:"BackgroundCubeMaterial",uniforms:$i(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,R,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ni.copy(E.backgroundRotation),ni.x*=-1,ni.y*=-1,ni.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ni.y*=-1,ni.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Qx.makeRotationFromEuler(ni)),u.material.toneMapped=$e.getTransfer(T.colorSpace)!==et,(h!==T||d!==T.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,h=T,d=T.version,p=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Ot(new Ds(2,2),new ln({name:"BackgroundMaterial",uniforms:$i(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=$e.getTransfer(T.colorSpace)!==et,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(h!==T||d!==T.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=T,d=T.version,p=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,E){b.getRGB(es,ju(n)),i.buffers.color.setClear(es.r,es.g,es.b,E,o)}function w(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,E=1){a.set(b),l=E,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(a,l)},render:S,addToRenderList:m,dispose:w}}function tS(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(M,L,k,F,G){let Z=!1;const V=h(F,k,L);s!==V&&(s=V,c(s.object)),Z=p(M,F,k,G),Z&&_(M,F,k,G),G!==null&&e.update(G,n.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,E(M,L,k,F),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function h(M,L,k){const F=k.wireframe===!0;let G=i[M.id];G===void 0&&(G={},i[M.id]=G);let Z=G[L.id];Z===void 0&&(Z={},G[L.id]=Z);let V=Z[F];return V===void 0&&(V=d(l()),Z[F]=V),V}function d(M){const L=[],k=[],F=[];for(let G=0;G<t;G++)L[G]=0,k[G]=0,F[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:k,attributeDivisors:F,object:M,attributes:{},index:null}}function p(M,L,k,F){const G=s.attributes,Z=L.attributes;let V=0;const W=k.getAttributes();for(const K in W)if(W[K].location>=0){const ae=G[K];let de=Z[K];if(de===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(de=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(de=M.instanceColor)),ae===void 0||ae.attribute!==de||de&&ae.data!==de.data)return!0;V++}return s.attributesNum!==V||s.index!==F}function _(M,L,k,F){const G={},Z=L.attributes;let V=0;const W=k.getAttributes();for(const K in W)if(W[K].location>=0){let ae=Z[K];ae===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor));const de={};de.attribute=ae,ae&&ae.data&&(de.data=ae.data),G[K]=de,V++}s.attributes=G,s.attributesNum=V,s.index=F}function S(){const M=s.newAttributes;for(let L=0,k=M.length;L<k;L++)M[L]=0}function m(M){f(M,0)}function f(M,L){const k=s.newAttributes,F=s.enabledAttributes,G=s.attributeDivisors;k[M]=1,F[M]===0&&(n.enableVertexAttribArray(M),F[M]=1),G[M]!==L&&(n.vertexAttribDivisor(M,L),G[M]=L)}function w(){const M=s.newAttributes,L=s.enabledAttributes;for(let k=0,F=L.length;k<F;k++)L[k]!==M[k]&&(n.disableVertexAttribArray(k),L[k]=0)}function b(M,L,k,F,G,Z,V){V===!0?n.vertexAttribIPointer(M,L,k,G,Z):n.vertexAttribPointer(M,L,k,F,G,Z)}function E(M,L,k,F){S();const G=F.attributes,Z=k.getAttributes(),V=L.defaultAttributeValues;for(const W in Z){const K=Z[W];if(K.location>=0){let he=G[W];if(he===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(he=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(he=M.instanceColor)),he!==void 0){const ae=he.normalized,de=he.itemSize,ze=e.get(he);if(ze===void 0)continue;const Oe=ze.buffer,ft=ze.type,lt=ze.bytesPerElement,q=ft===n.INT||ft===n.UNSIGNED_INT||he.gpuType===Va;if(he.isInterleavedBufferAttribute){const J=he.data,me=J.stride,De=he.offset;if(J.isInstancedInterleavedBuffer){for(let ve=0;ve<K.locationSize;ve++)f(K.location+ve,J.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ve=0;ve<K.locationSize;ve++)m(K.location+ve);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let ve=0;ve<K.locationSize;ve++)b(K.location+ve,de/K.locationSize,ft,ae,me*lt,(De+de/K.locationSize*ve)*lt,q)}else{if(he.isInstancedBufferAttribute){for(let J=0;J<K.locationSize;J++)f(K.location+J,he.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let J=0;J<K.locationSize;J++)m(K.location+J);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let J=0;J<K.locationSize;J++)b(K.location+J,de/K.locationSize,ft,ae,de*lt,de/K.locationSize*J*lt,q)}}else if(V!==void 0){const ae=V[W];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(K.location,ae);break;case 3:n.vertexAttrib3fv(K.location,ae);break;case 4:n.vertexAttrib4fv(K.location,ae);break;default:n.vertexAttrib1fv(K.location,ae)}}}}w()}function T(){O();for(const M in i){const L=i[M];for(const k in L){const F=L[k];for(const G in F)u(F[G].object),delete F[G];delete L[k]}delete i[M]}}function A(M){if(i[M.id]===void 0)return;const L=i[M.id];for(const k in L){const F=L[k];for(const G in F)u(F[G].object),delete F[G];delete L[k]}delete i[M.id]}function R(M){for(const L in i){const k=i[L];if(k[M.id]===void 0)continue;const F=k[M.id];for(const G in F)u(F[G].object),delete F[G];delete k[M.id]}}function O(){v(),o=!0,s!==r&&(s=r,c(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:O,resetDefaultState:v,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:S,enableAttribute:m,disableUnusedAttributes:w}}function nS(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let _=0;_<h;_++)p+=u[_];t.update(p,i,1)}function l(c,u,h,d){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)o(c[_],u[_],d[_]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let _=0;for(let S=0;S<h;S++)_+=u[S]*d[S];t.update(_,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function iS(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==sn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const O=R===Dn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Zt&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==fn&&!O)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Ie("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),w=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),A=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:_,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:w,maxVaryings:b,maxFragmentUniforms:E,maxSamples:T,samples:A}}function rS(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new si,a=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||i!==0||r;return r=d,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,p){const _=h.clippingPlanes,S=h.clipIntersection,m=h.clipShadows,f=n.get(h);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const w=s?0:i,b=w*4;let E=f.clippingState||null;l.value=E,E=u(_,d,b,p);for(let T=0;T!==b;++T)E[T]=t[T];f.clippingState=E,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,p,_){const S=h!==null?h.length:0;let m=null;if(S!==0){if(m=l.value,_!==!0||m===null){const f=p+S*4,w=d.matrixWorldInverse;a.getNormalMatrix(w),(m===null||m.length<f)&&(m=new Float32Array(f));for(let b=0,E=p;b!==S;++b,E+=4)o.copy(h[b]).applyMatrix4(w,a),o.normal.toArray(m,E),m[E+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,m}}function sS(n){let e=new WeakMap;function t(o,a){return a===Ho?o.mapping=di:a===Wo&&(o.mapping=Gi),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ho||a===Wo)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Qu(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Hn=4,fc=[.125,.215,.35,.446,.526,.582],li=20,oS=256,nr=new tl,pc=new Ge;let xo=null,So=0,Mo=0,yo=!1;const aS=new N;class mc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=aS}=s;xo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_c(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(xo,So,Mo),this._renderer.xr.enabled=yo,e.scissorTest=!1,Ri(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===di||e.mapping===Gi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Lt,minFilter:Lt,generateMipmaps:!1,type:Dn,format:sn,colorSpace:Wi,depthBuffer:!1},r=gc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gc(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=lS(s)),this._blurMaterial=uS(s,e,t),this._ggxMaterial=cS(s,e,t)}return r}_compileMaterial(e){const t=new Ot(new qt,e);this._renderer.compile(t,nr)}_sceneToCubeUV(e,t,i,r,s){const l=new Jt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(pc),h.toneMapping=mn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ot(new Tr,new bs({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,m=S.material;let f=!1;const w=e.background;w?w.isColor&&(m.color.copy(w),e.background=null,f=!0):(m.color.copy(pc),f=!0);for(let b=0;b<6;b++){const E=b%3;E===0?(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[b],s.y,s.z)):E===1?(l.up.set(0,0,c[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[b],s.z)):(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[b]));const T=this._cubeSize;Ri(r,E*T,b>2?T:0,T,T),h.setRenderTarget(r),f&&h.render(S,l),h.render(e,l)}h.toneMapping=p,h.autoClear=d,e.background=w}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===di||e.mapping===Gi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=vc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_c());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ri(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,nr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,p=h*d,{_lodMax:_}=this,S=this._sizeLods[i],m=3*S*(i>_-Hn?i-_+Hn:0),f=4*(this._cubeSize-S);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=_-t,Ri(s,m,f,3*S,2*S),r.setRenderTarget(s),r.render(a,nr),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=_-i,Ri(e,m,f,3*S,2*S),r.setRenderTarget(e),r.render(a,nr)}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&We("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[r];h.material=c;const d=c.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*li-1),S=s/_,m=isFinite(s)?1+Math.floor(u*S):li;m>li&&Ie(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${li}`);const f=[];let w=0;for(let R=0;R<li;++R){const O=R/S,v=Math.exp(-O*O/2);f.push(v),R===0?w+=v:R<m&&(w+=2*v)}for(let R=0;R<f.length;R++)f[R]=f[R]/w;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:b}=this;d.dTheta.value=_,d.mipInt.value=b-i;const E=this._sizeLods[r],T=3*E*(r>b-Hn?r-b+Hn:0),A=4*(this._cubeSize-E);Ri(t,T,A,3*E,2*E),l.setRenderTarget(t),l.render(h,nr)}}function lS(n){const e=[],t=[],i=[];let r=n;const s=n-Hn+1+fc.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>n-Hn?l=fc[o-n+Hn-1]:o===0&&(l=0),t.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,_=6,S=3,m=2,f=1,w=new Float32Array(S*_*p),b=new Float32Array(m*_*p),E=new Float32Array(f*_*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,O=A>2?0:-1,v=[R,O,0,R+2/3,O,0,R+2/3,O+1,0,R,O,0,R+2/3,O+1,0,R,O+1,0];w.set(v,S*_*A),b.set(d,m*_*A);const M=[A,A,A,A,A,A];E.set(M,f*_*A)}const T=new qt;T.setAttribute("position",new on(w,S)),T.setAttribute("uv",new on(b,m)),T.setAttribute("faceIndex",new on(E,f)),i.push(new Ot(T,null)),r>Hn&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function gc(n,e,t){const i=new gn(n,e,t);return i.texture.mapping=Ls,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ri(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function cS(n,e,t){return new ln({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:oS,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Us(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function uS(n,e,t){const i=new Float32Array(li),r=new N(0,1,0);return new ln({name:"SphericalGaussianBlur",defines:{n:li,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Us(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function _c(){return new ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Us(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function vc(){return new ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Us(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Us(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function hS(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ho||l===Wo,u=l===di||l===Gi;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new mc(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new mc(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function dS(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Sr("WebGLRenderer: "+i+" extension not supported."),r}}}function fS(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const _ in d.attributes)e.remove(d.attributes[_]);d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const p in d)e.update(d[p],n.ARRAY_BUFFER)}function c(h){const d=[],p=h.index,_=h.attributes.position;let S=0;if(p!==null){const w=p.array;S=p.version;for(let b=0,E=w.length;b<E;b+=3){const T=w[b+0],A=w[b+1],R=w[b+2];d.push(T,A,A,R,R,T)}}else if(_!==void 0){const w=_.array;S=_.version;for(let b=0,E=w.length/3-1;b<E;b+=3){const T=b+0,A=b+1,R=b+2;d.push(T,A,A,R,R,T)}}else return;const m=new($u(d)?Yu:qu)(d,1);m.version=S;const f=s.get(h);f&&e.remove(f),s.set(h,m)}function u(h){const d=s.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function pS(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,p){n.drawElements(i,p,s,d*o),t.update(p,i,1)}function c(d,p,_){_!==0&&(n.drawElementsInstanced(i,p,s,d*o,_),t.update(p,i,_))}function u(d,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,d,0,_);let m=0;for(let f=0;f<_;f++)m+=p[f];t.update(m,i,1)}function h(d,p,_,S){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],S[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,d,0,S,0,_);let f=0;for(let w=0;w<_;w++)f+=p[w]*S[w];t.update(f,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function mS(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:We("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function gS(n,e,t){const i=new WeakMap,r=new _t;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let v=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,S=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let b=0;p===!0&&(b=1),_===!0&&(b=2),S===!0&&(b=3);let E=a.attributes.position.count*b,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*h),R=new Xu(A,E,T,h);R.type=fn,R.needsUpdate=!0;const O=b*4;for(let M=0;M<h;M++){const L=m[M],k=f[M],F=w[M],G=E*T*4*M;for(let Z=0;Z<L.count;Z++){const V=Z*O;p===!0&&(r.fromBufferAttribute(L,Z),A[G+V+0]=r.x,A[G+V+1]=r.y,A[G+V+2]=r.z,A[G+V+3]=0),_===!0&&(r.fromBufferAttribute(k,Z),A[G+V+4]=r.x,A[G+V+5]=r.y,A[G+V+6]=r.z,A[G+V+7]=0),S===!0&&(r.fromBufferAttribute(F,Z),A[G+V+8]=r.x,A[G+V+9]=r.y,A[G+V+10]=r.z,A[G+V+11]=F.itemSize===4?r.w:1)}}d={count:h,texture:R,size:new Xe(E,T)},i.set(a,d),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let S=0;S<c.length;S++)p+=c[S];const _=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function _S(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const vS={[Ru]:"LINEAR_TONE_MAPPING",[Pu]:"REINHARD_TONE_MAPPING",[Lu]:"CINEON_TONE_MAPPING",[Iu]:"ACES_FILMIC_TONE_MAPPING",[Uu]:"AGX_TONE_MAPPING",[Nu]:"NEUTRAL_TONE_MAPPING",[Du]:"CUSTOM_TONE_MAPPING"};function xS(n,e,t,i,r){const s=new gn(e,t,{type:n,depthBuffer:i,stencilBuffer:r}),o=new gn(e,t,{type:Dn,depthBuffer:!1,stencilBuffer:!1}),a=new qt;a.setAttribute("position",new kt([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new kt([0,2,0,0,2,0],2));const l=new ov({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Ot(a,l),u=new tl(-1,1,1,-1,0,1);let h=null,d=null,p=!1,_,S=null,m=[],f=!1;this.setSize=function(w,b){s.setSize(w,b),o.setSize(w,b);for(let E=0;E<m.length;E++){const T=m[E];T.setSize&&T.setSize(w,b)}},this.setEffects=function(w){m=w,f=m.length>0&&m[0].isRenderPass===!0;const b=s.width,E=s.height;for(let T=0;T<m.length;T++){const A=m[T];A.setSize&&A.setSize(b,E)}},this.begin=function(w,b){if(p||w.toneMapping===mn&&m.length===0)return!1;if(S=b,b!==null){const E=b.width,T=b.height;(s.width!==E||s.height!==T)&&this.setSize(E,T)}return f===!1&&w.setRenderTarget(s),_=w.toneMapping,w.toneMapping=mn,!0},this.hasRenderPass=function(){return f},this.end=function(w,b){w.toneMapping=_,p=!0;let E=s,T=o;for(let A=0;A<m.length;A++){const R=m[A];if(R.enabled!==!1&&(R.render(w,T,E,b),R.needsSwap!==!1)){const O=E;E=T,T=O}}if(h!==w.outputColorSpace||d!==w.toneMapping){h=w.outputColorSpace,d=w.toneMapping,l.defines={},$e.getTransfer(h)===et&&(l.defines.SRGB_TRANSFER="");const A=vS[d];A&&(l.defines[A]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=E.texture,w.setRenderTarget(S),w.render(c,u),S=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const rh=new It,Aa=new Mr(1,1),sh=new Xu,oh=new N_,ah=new Ju,xc=[],Sc=[],Mc=new Float32Array(16),yc=new Float32Array(9),Ec=new Float32Array(4);function Yi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=xc[r];if(s===void 0&&(s=new Float32Array(r),xc[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Et(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function bt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ns(n,e){let t=Sc[e];t===void 0&&(t=new Int32Array(e),Sc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function SS(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function MS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2fv(this.addr,e),bt(t,e)}}function yS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;n.uniform3fv(this.addr,e),bt(t,e)}}function ES(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4fv(this.addr,e),bt(t,e)}}function bS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(Et(t,i))return;Ec.set(i),n.uniformMatrix2fv(this.addr,!1,Ec),bt(t,i)}}function TS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(Et(t,i))return;yc.set(i),n.uniformMatrix3fv(this.addr,!1,yc),bt(t,i)}}function wS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(Et(t,i))return;Mc.set(i),n.uniformMatrix4fv(this.addr,!1,Mc),bt(t,i)}}function AS(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function CS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2iv(this.addr,e),bt(t,e)}}function RS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3iv(this.addr,e),bt(t,e)}}function PS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4iv(this.addr,e),bt(t,e)}}function LS(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function IS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2uiv(this.addr,e),bt(t,e)}}function DS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3uiv(this.addr,e),bt(t,e)}}function US(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4uiv(this.addr,e),bt(t,e)}}function NS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Aa.compareFunction=t.isReversedDepthBuffer()?qa:Za,s=Aa):s=rh,t.setTexture2D(e||s,r)}function OS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||oh,r)}function FS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||ah,r)}function kS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||sh,r)}function zS(n){switch(n){case 5126:return SS;case 35664:return MS;case 35665:return yS;case 35666:return ES;case 35674:return bS;case 35675:return TS;case 35676:return wS;case 5124:case 35670:return AS;case 35667:case 35671:return CS;case 35668:case 35672:return RS;case 35669:case 35673:return PS;case 5125:return LS;case 36294:return IS;case 36295:return DS;case 36296:return US;case 35678:case 36198:case 36298:case 36306:case 35682:return NS;case 35679:case 36299:case 36307:return OS;case 35680:case 36300:case 36308:case 36293:return FS;case 36289:case 36303:case 36311:case 36292:return kS}}function BS(n,e){n.uniform1fv(this.addr,e)}function VS(n,e){const t=Yi(e,this.size,2);n.uniform2fv(this.addr,t)}function GS(n,e){const t=Yi(e,this.size,3);n.uniform3fv(this.addr,t)}function HS(n,e){const t=Yi(e,this.size,4);n.uniform4fv(this.addr,t)}function WS(n,e){const t=Yi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function $S(n,e){const t=Yi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function XS(n,e){const t=Yi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function ZS(n,e){n.uniform1iv(this.addr,e)}function qS(n,e){n.uniform2iv(this.addr,e)}function YS(n,e){n.uniform3iv(this.addr,e)}function jS(n,e){n.uniform4iv(this.addr,e)}function KS(n,e){n.uniform1uiv(this.addr,e)}function JS(n,e){n.uniform2uiv(this.addr,e)}function QS(n,e){n.uniform3uiv(this.addr,e)}function eM(n,e){n.uniform4uiv(this.addr,e)}function tM(n,e,t){const i=this.cache,r=e.length,s=Ns(t,r);Et(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=Aa:o=rh;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function nM(n,e,t){const i=this.cache,r=e.length,s=Ns(t,r);Et(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||oh,s[o])}function iM(n,e,t){const i=this.cache,r=e.length,s=Ns(t,r);Et(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||ah,s[o])}function rM(n,e,t){const i=this.cache,r=e.length,s=Ns(t,r);Et(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||sh,s[o])}function sM(n){switch(n){case 5126:return BS;case 35664:return VS;case 35665:return GS;case 35666:return HS;case 35674:return WS;case 35675:return $S;case 35676:return XS;case 5124:case 35670:return ZS;case 35667:case 35671:return qS;case 35668:case 35672:return YS;case 35669:case 35673:return jS;case 5125:return KS;case 36294:return JS;case 36295:return QS;case 36296:return eM;case 35678:case 36198:case 36298:case 36306:case 35682:return tM;case 35679:case 36299:case 36307:return nM;case 35680:case 36300:case 36308:case 36293:return iM;case 36289:case 36303:case 36311:case 36292:return rM}}class oM{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=zS(t.type)}}class aM{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=sM(t.type)}}class lM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Eo=/(\w+)(\])?(\[|\.)?/g;function bc(n,e){n.seq.push(e),n.map[e.id]=e}function cM(n,e,t){const i=n.name,r=i.length;for(Eo.lastIndex=0;;){const s=Eo.exec(i),o=Eo.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){bc(t,c===void 0?new oM(a,n,e):new aM(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new lM(a),bc(t,h)),t=h}}}class hs{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);cM(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function Tc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const uM=37297;let hM=0;function dM(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const wc=new Ue;function fM(n){$e._getMatrix(wc,$e.workingColorSpace,n);const e=`mat3( ${wc.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(n)){case ys:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ac(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+dM(n.getShaderSource(e),a)}else return s}function pM(n,e){const t=fM(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const mM={[Ru]:"Linear",[Pu]:"Reinhard",[Lu]:"Cineon",[Iu]:"ACESFilmic",[Uu]:"AgX",[Nu]:"Neutral",[Du]:"Custom"};function gM(n,e){const t=mM[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ts=new N;function _M(){$e.getLuminanceCoefficients(ts);const n=ts.x.toFixed(4),e=ts.y.toFixed(4),t=ts.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ur).join(`
`)}function xM(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function SM(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function ur(n){return n!==""}function Cc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Rc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const MM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ca(n){return n.replace(MM,EM)}const yM=new Map;function EM(n,e){let t=Ne[e];if(t===void 0){const i=yM.get(e);if(i!==void 0)t=Ne[i],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Ca(t)}const bM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pc(n){return n.replace(bM,TM)}function TM(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Lc(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const wM={[os]:"SHADOWMAP_TYPE_PCF",[cr]:"SHADOWMAP_TYPE_VSM"};function AM(n){return wM[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const CM={[di]:"ENVMAP_TYPE_CUBE",[Gi]:"ENVMAP_TYPE_CUBE",[Ls]:"ENVMAP_TYPE_CUBE_UV"};function RM(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":CM[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const PM={[Gi]:"ENVMAP_MODE_REFRACTION"};function LM(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":PM[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const IM={[Ba]:"ENVMAP_BLENDING_MULTIPLY",[g_]:"ENVMAP_BLENDING_MIX",[__]:"ENVMAP_BLENDING_ADD"};function DM(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":IM[n.combine]||"ENVMAP_BLENDING_NONE"}function UM(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function NM(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=AM(t),c=RM(t),u=LM(t),h=DM(t),d=UM(t),p=vM(t),_=xM(s),S=r.createProgram();let m,f,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ur).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ur).join(`
`),f.length>0&&(f+=`
`)):(m=[Lc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ur).join(`
`),f=[Lc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mn?"#define TONE_MAPPING":"",t.toneMapping!==mn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==mn?gM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,pM("linearToOutputTexel",t.outputColorSpace),_M(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ur).join(`
`)),o=Ca(o),o=Cc(o,t),o=Rc(o,t),a=Ca(a),a=Cc(a,t),a=Rc(a,t),o=Pc(o),a=Pc(a),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Bl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Bl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const b=w+m+o,E=w+f+a,T=Tc(r,r.VERTEX_SHADER,b),A=Tc(r,r.FRAGMENT_SHADER,E);r.attachShader(S,T),r.attachShader(S,A),t.index0AttributeName!==void 0?r.bindAttribLocation(S,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function R(L){if(n.debug.checkShaderErrors){const k=r.getProgramInfoLog(S)||"",F=r.getShaderInfoLog(T)||"",G=r.getShaderInfoLog(A)||"",Z=k.trim(),V=F.trim(),W=G.trim();let K=!0,he=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,S,T,A);else{const ae=Ac(r,T,"vertex"),de=Ac(r,A,"fragment");We("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+Z+`
`+ae+`
`+de)}else Z!==""?Ie("WebGLProgram: Program Info Log:",Z):(V===""||W==="")&&(he=!1);he&&(L.diagnostics={runnable:K,programLog:Z,vertexShader:{log:V,prefix:m},fragmentShader:{log:W,prefix:f}})}r.deleteShader(T),r.deleteShader(A),O=new hs(r,S),v=SM(r,S)}let O;this.getUniforms=function(){return O===void 0&&R(this),O};let v;this.getAttributes=function(){return v===void 0&&R(this),v};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(S,uM)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=hM++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=T,this.fragmentShader=A,this}let OM=0;class FM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new kM(e),t.set(e,i)),i}}class kM{constructor(e){this.id=OM++,this.code=e,this.usedTimes=0}}function zM(n,e,t,i,r,s,o){const a=new Ka,l=new FM,c=new Set,u=[],h=new Map,d=r.logarithmicDepthBuffer;let p=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,M,L,k,F){const G=k.fog,Z=F.geometry,V=v.isMeshStandardMaterial?k.environment:null,W=(v.isMeshStandardMaterial?t:e).get(v.envMap||V),K=W&&W.mapping===Ls?W.image.height:null,he=_[v.type];v.precision!==null&&(p=r.getMaxPrecision(v.precision),p!==v.precision&&Ie("WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));const ae=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,de=ae!==void 0?ae.length:0;let ze=0;Z.morphAttributes.position!==void 0&&(ze=1),Z.morphAttributes.normal!==void 0&&(ze=2),Z.morphAttributes.color!==void 0&&(ze=3);let Oe,ft,lt,q;if(he){const Je=dn[he];Oe=Je.vertexShader,ft=Je.fragmentShader}else Oe=v.vertexShader,ft=v.fragmentShader,l.update(v),lt=l.getVertexShaderID(v),q=l.getFragmentShaderID(v);const J=n.getRenderTarget(),me=n.state.buffers.depth.getReversed(),De=F.isInstancedMesh===!0,ve=F.isBatchedMesh===!0,Ze=!!v.map,Tt=!!v.matcap,He=!!W,Ke=!!v.aoMap,nt=!!v.lightMap,Fe=!!v.bumpMap,xt=!!v.normalMap,C=!!v.displacementMap,St=!!v.emissiveMap,Ye=!!v.metalnessMap,rt=!!v.roughnessMap,Se=v.anisotropy>0,y=v.clearcoat>0,g=v.dispersion>0,I=v.iridescence>0,X=v.sheen>0,j=v.transmission>0,H=Se&&!!v.anisotropyMap,ye=y&&!!v.clearcoatMap,ie=y&&!!v.clearcoatNormalMap,xe=y&&!!v.clearcoatRoughnessMap,Ce=I&&!!v.iridescenceMap,ee=I&&!!v.iridescenceThicknessMap,se=X&&!!v.sheenColorMap,_e=X&&!!v.sheenRoughnessMap,Me=!!v.specularMap,re=!!v.specularColorMap,ke=!!v.specularIntensityMap,P=j&&!!v.transmissionMap,ue=j&&!!v.thicknessMap,te=!!v.gradientMap,fe=!!v.alphaMap,Q=v.alphaTest>0,Y=!!v.alphaHash,ne=!!v.extensions;let Le=mn;v.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Le=n.toneMapping);const st={shaderID:he,shaderType:v.type,shaderName:v.name,vertexShader:Oe,fragmentShader:ft,defines:v.defines,customVertexShaderID:lt,customFragmentShaderID:q,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:ve,batchingColor:ve&&F._colorsTexture!==null,instancing:De,instancingColor:De&&F.instanceColor!==null,instancingMorph:De&&F.morphTexture!==null,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Wi,alphaToCoverage:!!v.alphaToCoverage,map:Ze,matcap:Tt,envMap:He,envMapMode:He&&W.mapping,envMapCubeUVHeight:K,aoMap:Ke,lightMap:nt,bumpMap:Fe,normalMap:xt,displacementMap:C,emissiveMap:St,normalMapObjectSpace:xt&&v.normalMapType===S_,normalMapTangentSpace:xt&&v.normalMapType===Wu,metalnessMap:Ye,roughnessMap:rt,anisotropy:Se,anisotropyMap:H,clearcoat:y,clearcoatMap:ye,clearcoatNormalMap:ie,clearcoatRoughnessMap:xe,dispersion:g,iridescence:I,iridescenceMap:Ce,iridescenceThicknessMap:ee,sheen:X,sheenColorMap:se,sheenRoughnessMap:_e,specularMap:Me,specularColorMap:re,specularIntensityMap:ke,transmission:j,transmissionMap:P,thicknessMap:ue,gradientMap:te,opaque:v.transparent===!1&&v.blending===Ui&&v.alphaToCoverage===!1,alphaMap:fe,alphaTest:Q,alphaHash:Y,combine:v.combine,mapUv:Ze&&S(v.map.channel),aoMapUv:Ke&&S(v.aoMap.channel),lightMapUv:nt&&S(v.lightMap.channel),bumpMapUv:Fe&&S(v.bumpMap.channel),normalMapUv:xt&&S(v.normalMap.channel),displacementMapUv:C&&S(v.displacementMap.channel),emissiveMapUv:St&&S(v.emissiveMap.channel),metalnessMapUv:Ye&&S(v.metalnessMap.channel),roughnessMapUv:rt&&S(v.roughnessMap.channel),anisotropyMapUv:H&&S(v.anisotropyMap.channel),clearcoatMapUv:ye&&S(v.clearcoatMap.channel),clearcoatNormalMapUv:ie&&S(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&S(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&S(v.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&S(v.iridescenceThicknessMap.channel),sheenColorMapUv:se&&S(v.sheenColorMap.channel),sheenRoughnessMapUv:_e&&S(v.sheenRoughnessMap.channel),specularMapUv:Me&&S(v.specularMap.channel),specularColorMapUv:re&&S(v.specularColorMap.channel),specularIntensityMapUv:ke&&S(v.specularIntensityMap.channel),transmissionMapUv:P&&S(v.transmissionMap.channel),thicknessMapUv:ue&&S(v.thicknessMap.channel),alphaMapUv:fe&&S(v.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(xt||Se),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!Z.attributes.uv&&(Ze||fe),fog:!!G,useFog:v.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:v.flatShading===!0&&v.wireframe===!1,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:me,skinning:F.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:ze,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Le,decodeVideoTexture:Ze&&v.map.isVideoTexture===!0&&$e.getTransfer(v.map.colorSpace)===et,decodeVideoTextureEmissive:St&&v.emissiveMap.isVideoTexture===!0&&$e.getTransfer(v.emissiveMap.colorSpace)===et,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Tn,flipSided:v.side===Ft,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ne&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ne&&v.extensions.multiDraw===!0||ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return st.vertexUv1s=c.has(1),st.vertexUv2s=c.has(2),st.vertexUv3s=c.has(3),c.clear(),st}function f(v){const M=[];if(v.shaderID?M.push(v.shaderID):(M.push(v.customVertexShaderID),M.push(v.customFragmentShaderID)),v.defines!==void 0)for(const L in v.defines)M.push(L),M.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(w(M,v),b(M,v),M.push(n.outputColorSpace)),M.push(v.customProgramCacheKey),M.join()}function w(v,M){v.push(M.precision),v.push(M.outputColorSpace),v.push(M.envMapMode),v.push(M.envMapCubeUVHeight),v.push(M.mapUv),v.push(M.alphaMapUv),v.push(M.lightMapUv),v.push(M.aoMapUv),v.push(M.bumpMapUv),v.push(M.normalMapUv),v.push(M.displacementMapUv),v.push(M.emissiveMapUv),v.push(M.metalnessMapUv),v.push(M.roughnessMapUv),v.push(M.anisotropyMapUv),v.push(M.clearcoatMapUv),v.push(M.clearcoatNormalMapUv),v.push(M.clearcoatRoughnessMapUv),v.push(M.iridescenceMapUv),v.push(M.iridescenceThicknessMapUv),v.push(M.sheenColorMapUv),v.push(M.sheenRoughnessMapUv),v.push(M.specularMapUv),v.push(M.specularColorMapUv),v.push(M.specularIntensityMapUv),v.push(M.transmissionMapUv),v.push(M.thicknessMapUv),v.push(M.combine),v.push(M.fogExp2),v.push(M.sizeAttenuation),v.push(M.morphTargetsCount),v.push(M.morphAttributeCount),v.push(M.numDirLights),v.push(M.numPointLights),v.push(M.numSpotLights),v.push(M.numSpotLightMaps),v.push(M.numHemiLights),v.push(M.numRectAreaLights),v.push(M.numDirLightShadows),v.push(M.numPointLightShadows),v.push(M.numSpotLightShadows),v.push(M.numSpotLightShadowsWithMaps),v.push(M.numLightProbes),v.push(M.shadowMapType),v.push(M.toneMapping),v.push(M.numClippingPlanes),v.push(M.numClipIntersection),v.push(M.depthPacking)}function b(v,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),v.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),v.push(a.mask)}function E(v){const M=_[v.type];let L;if(M){const k=dn[M];L=q_.clone(k.uniforms)}else L=v.uniforms;return L}function T(v,M){let L=h.get(M);return L!==void 0?++L.usedTimes:(L=new NM(n,M,v,s),u.push(L),h.set(M,L)),L}function A(v){if(--v.usedTimes===0){const M=u.indexOf(v);u[M]=u[u.length-1],u.pop(),h.delete(v.cacheKey),v.destroy()}}function R(v){l.remove(v)}function O(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:E,acquireProgram:T,releaseProgram:A,releaseShaderCache:R,programs:u,dispose:O}}function BM(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function VM(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Ic(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Dc(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,p,_,S,m){let f=n[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:_,renderOrder:h.renderOrder,z:S,group:m},n[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=_,f.renderOrder=h.renderOrder,f.z=S,f.group=m),e++,f}function a(h,d,p,_,S,m){const f=o(h,d,p,_,S,m);p.transmission>0?i.push(f):p.transparent===!0?r.push(f):t.push(f)}function l(h,d,p,_,S,m){const f=o(h,d,p,_,S,m);p.transmission>0?i.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function c(h,d){t.length>1&&t.sort(h||VM),i.length>1&&i.sort(d||Ic),r.length>1&&r.sort(d||Ic)}function u(){for(let h=e,d=n.length;h<d;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function GM(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Dc,n.set(i,[o])):r>=s.length?(o=new Dc,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function HM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Ge};break;case"SpotLight":t={position:new N,direction:new N,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new N,halfWidth:new N,halfHeight:new N};break}return n[e.id]=t,t}}}function WM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let $M=0;function XM(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ZM(n){const e=new HM,t=WM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);const r=new N,s=new ut,o=new ut;function a(c){let u=0,h=0,d=0;for(let v=0;v<9;v++)i.probe[v].set(0,0,0);let p=0,_=0,S=0,m=0,f=0,w=0,b=0,E=0,T=0,A=0,R=0;c.sort(XM);for(let v=0,M=c.length;v<M;v++){const L=c[v],k=L.color,F=L.intensity,G=L.distance;let Z=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Hi?Z=L.shadow.map.texture:Z=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=k.r*F,h+=k.g*F,d+=k.b*F;else if(L.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(L.sh.coefficients[V],F);R++}else if(L.isDirectionalLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const W=L.shadow,K=t.get(L);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,i.directionalShadow[p]=K,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=L.shadow.matrix,w++}i.directional[p]=V,p++}else if(L.isSpotLight){const V=e.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(k).multiplyScalar(F),V.distance=G,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,i.spot[S]=V;const W=L.shadow;if(L.map&&(i.spotLightMap[T]=L.map,T++,W.updateMatrices(L),L.castShadow&&A++),i.spotLightMatrix[S]=W.matrix,L.castShadow){const K=t.get(L);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,i.spotShadow[S]=K,i.spotShadowMap[S]=Z,E++}S++}else if(L.isRectAreaLight){const V=e.get(L);V.color.copy(k).multiplyScalar(F),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=V,m++}else if(L.isPointLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){const W=L.shadow,K=t.get(L);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,K.shadowCameraNear=W.camera.near,K.shadowCameraFar=W.camera.far,i.pointShadow[_]=K,i.pointShadowMap[_]=Z,i.pointShadowMatrix[_]=L.shadow.matrix,b++}i.point[_]=V,_++}else if(L.isHemisphereLight){const V=e.get(L);V.skyColor.copy(L.color).multiplyScalar(F),V.groundColor.copy(L.groundColor).multiplyScalar(F),i.hemi[f]=V,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const O=i.hash;(O.directionalLength!==p||O.pointLength!==_||O.spotLength!==S||O.rectAreaLength!==m||O.hemiLength!==f||O.numDirectionalShadows!==w||O.numPointShadows!==b||O.numSpotShadows!==E||O.numSpotMaps!==T||O.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=S,i.rectArea.length=m,i.point.length=_,i.hemi.length=f,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=E+T-A,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,O.directionalLength=p,O.pointLength=_,O.spotLength=S,O.rectAreaLength=m,O.hemiLength=f,O.numDirectionalShadows=w,O.numPointShadows=b,O.numSpotShadows=E,O.numSpotMaps=T,O.numLightProbes=R,i.version=$M++)}function l(c,u){let h=0,d=0,p=0,_=0,S=0;const m=u.matrixWorldInverse;for(let f=0,w=c.length;f<w;f++){const b=c[f];if(b.isDirectionalLight){const E=i.directional[h];E.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),h++}else if(b.isSpotLight){const E=i.spot[p];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const E=i.rectArea[_];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(m),o.identity(),s.copy(b.matrixWorld),s.premultiply(m),o.extractRotation(s),E.halfWidth.set(b.width*.5,0,0),E.halfHeight.set(0,b.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),_++}else if(b.isPointLight){const E=i.point[d];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const E=i.hemi[S];E.direction.setFromMatrixPosition(b.matrixWorld),E.direction.transformDirection(m),S++}}}return{setup:a,setupView:l,state:i}}function Uc(n){const e=new ZM(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function qM(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Uc(n),e.set(r,[a])):s>=o.length?(a=new Uc(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const YM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,KM=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],JM=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],Nc=new ut,ir=new N,bo=new N;function QM(n,e,t){let i=new Ja;const r=new Xe,s=new Xe,o=new _t,a=new av,l=new lv,c={},u=t.maxTextureSize,h={[Zn]:Ft,[Ft]:Zn,[Tn]:Tn},d=new ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:YM,fragmentShader:jM}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const _=new qt;_.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new Ot(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=os;let f=this.type;this.render=function(A,R,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;A.type===Kg&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),A.type=os);const v=n.getRenderTarget(),M=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Pn),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const F=f!==this.type;F&&R.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(Z=>Z.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,Z=A.length;G<Z;G++){const V=A[G],W=V.shadow;if(W===void 0){Ie("WebGLShadowMap:",V,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const K=W.getFrameExtents();if(r.multiply(K),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/K.x),r.x=s.x*K.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/K.y),r.y=s.y*K.y,W.mapSize.y=s.y)),W.map===null||F===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===cr){if(V.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new gn(r.x,r.y,{format:Hi,type:Dn,minFilter:Lt,magFilter:Lt,generateMipmaps:!1}),W.map.texture.name=V.name+".shadowMap",W.map.depthTexture=new Mr(r.x,r.y,fn),W.map.depthTexture.name=V.name+".shadowMapDepth",W.map.depthTexture.format=Un,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=At,W.map.depthTexture.magFilter=At}else{V.isPointLight?(W.map=new Qu(r.x),W.map.depthTexture=new sv(r.x,_n)):(W.map=new gn(r.x,r.y),W.map.depthTexture=new Mr(r.x,r.y,_n)),W.map.depthTexture.name=V.name+".shadowMap",W.map.depthTexture.format=Un;const ae=n.state.buffers.depth.getReversed();this.type===os?(W.map.depthTexture.compareFunction=ae?qa:Za,W.map.depthTexture.minFilter=Lt,W.map.depthTexture.magFilter=Lt):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=At,W.map.depthTexture.magFilter=At)}W.camera.updateProjectionMatrix()}const he=W.map.isWebGLCubeRenderTarget?6:1;for(let ae=0;ae<he;ae++){if(W.map.isWebGLCubeRenderTarget)n.setRenderTarget(W.map,ae),n.clear();else{ae===0&&(n.setRenderTarget(W.map),n.clear());const de=W.getViewport(ae);o.set(s.x*de.x,s.y*de.y,s.x*de.z,s.y*de.w),k.viewport(o)}if(V.isPointLight){const de=W.camera,ze=W.matrix,Oe=V.distance||de.far;Oe!==de.far&&(de.far=Oe,de.updateProjectionMatrix()),ir.setFromMatrixPosition(V.matrixWorld),de.position.copy(ir),bo.copy(de.position),bo.add(KM[ae]),de.up.copy(JM[ae]),de.lookAt(bo),de.updateMatrixWorld(),ze.makeTranslation(-ir.x,-ir.y,-ir.z),Nc.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),W._frustum.setFromProjectionMatrix(Nc,de.coordinateSystem,de.reversedDepth)}else W.updateMatrices(V);i=W.getFrustum(),E(R,O,W.camera,V,this.type)}W.isPointLightShadow!==!0&&this.type===cr&&w(W,O),W.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(v,M,L)};function w(A,R){const O=e.update(S);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new gn(r.x,r.y,{format:Hi,type:Dn})),d.uniforms.shadow_pass.value=A.map.depthTexture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(R,null,O,d,S,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(R,null,O,p,S,null)}function b(A,R,O,v){let M=null;const L=O.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)M=L;else if(M=O.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const k=M.uuid,F=R.uuid;let G=c[k];G===void 0&&(G={},c[k]=G);let Z=G[F];Z===void 0&&(Z=M.clone(),G[F]=Z,R.addEventListener("dispose",T)),M=Z}if(M.visible=R.visible,M.wireframe=R.wireframe,v===cr?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:h[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,O.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const k=n.properties.get(M);k.light=O}return M}function E(A,R,O,v,M){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===cr)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,A.matrixWorld);const F=e.update(A),G=A.material;if(Array.isArray(G)){const Z=F.groups;for(let V=0,W=Z.length;V<W;V++){const K=Z[V],he=G[K.materialIndex];if(he&&he.visible){const ae=b(A,he,v,M);A.onBeforeShadow(n,A,R,O,F,ae,K),n.renderBufferDirect(O,null,F,ae,A,K),A.onAfterShadow(n,A,R,O,F,ae,K)}}}else if(G.visible){const Z=b(A,G,v,M);A.onBeforeShadow(n,A,R,O,F,Z,null),n.renderBufferDirect(O,null,F,Z,A,null),A.onAfterShadow(n,A,R,O,F,Z,null)}}const k=A.children;for(let F=0,G=k.length;F<G;F++)E(k[F],R,O,v,M)}function T(A){A.target.removeEventListener("dispose",T);for(const O in c){const v=c[O],M=A.target.uuid;M in v&&(v[M].dispose(),delete v[M])}}}const ey={[Oo]:Fo,[ko]:Vo,[zo]:Go,[Vi]:Bo,[Fo]:Oo,[Vo]:ko,[Go]:zo,[Bo]:Vi};function ty(n,e){function t(){let P=!1;const ue=new _t;let te=null;const fe=new _t(0,0,0,0);return{setMask:function(Q){te!==Q&&!P&&(n.colorMask(Q,Q,Q,Q),te=Q)},setLocked:function(Q){P=Q},setClear:function(Q,Y,ne,Le,st){st===!0&&(Q*=Le,Y*=Le,ne*=Le),ue.set(Q,Y,ne,Le),fe.equals(ue)===!1&&(n.clearColor(Q,Y,ne,Le),fe.copy(ue))},reset:function(){P=!1,te=null,fe.set(-1,0,0,0)}}}function i(){let P=!1,ue=!1,te=null,fe=null,Q=null;return{setReversed:function(Y){if(ue!==Y){const ne=e.get("EXT_clip_control");Y?ne.clipControlEXT(ne.LOWER_LEFT_EXT,ne.ZERO_TO_ONE_EXT):ne.clipControlEXT(ne.LOWER_LEFT_EXT,ne.NEGATIVE_ONE_TO_ONE_EXT),ue=Y;const Le=Q;Q=null,this.setClear(Le)}},getReversed:function(){return ue},setTest:function(Y){Y?J(n.DEPTH_TEST):me(n.DEPTH_TEST)},setMask:function(Y){te!==Y&&!P&&(n.depthMask(Y),te=Y)},setFunc:function(Y){if(ue&&(Y=ey[Y]),fe!==Y){switch(Y){case Oo:n.depthFunc(n.NEVER);break;case Fo:n.depthFunc(n.ALWAYS);break;case ko:n.depthFunc(n.LESS);break;case Vi:n.depthFunc(n.LEQUAL);break;case zo:n.depthFunc(n.EQUAL);break;case Bo:n.depthFunc(n.GEQUAL);break;case Vo:n.depthFunc(n.GREATER);break;case Go:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=Y}},setLocked:function(Y){P=Y},setClear:function(Y){Q!==Y&&(ue&&(Y=1-Y),n.clearDepth(Y),Q=Y)},reset:function(){P=!1,te=null,fe=null,Q=null,ue=!1}}}function r(){let P=!1,ue=null,te=null,fe=null,Q=null,Y=null,ne=null,Le=null,st=null;return{setTest:function(Je){P||(Je?J(n.STENCIL_TEST):me(n.STENCIL_TEST))},setMask:function(Je){ue!==Je&&!P&&(n.stencilMask(Je),ue=Je)},setFunc:function(Je,cn,xn){(te!==Je||fe!==cn||Q!==xn)&&(n.stencilFunc(Je,cn,xn),te=Je,fe=cn,Q=xn)},setOp:function(Je,cn,xn){(Y!==Je||ne!==cn||Le!==xn)&&(n.stencilOp(Je,cn,xn),Y=Je,ne=cn,Le=xn)},setLocked:function(Je){P=Je},setClear:function(Je){st!==Je&&(n.clearStencil(Je),st=Je)},reset:function(){P=!1,ue=null,te=null,fe=null,Q=null,Y=null,ne=null,Le=null,st=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,p=[],_=null,S=!1,m=null,f=null,w=null,b=null,E=null,T=null,A=null,R=new Ge(0,0,0),O=0,v=!1,M=null,L=null,k=null,F=null,G=null;const Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,W=0;const K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(K)[1]),V=W>=1):K.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),V=W>=2);let he=null,ae={};const de=n.getParameter(n.SCISSOR_BOX),ze=n.getParameter(n.VIEWPORT),Oe=new _t().fromArray(de),ft=new _t().fromArray(ze);function lt(P,ue,te,fe){const Q=new Uint8Array(4),Y=n.createTexture();n.bindTexture(P,Y),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ne=0;ne<te;ne++)P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY?n.texImage3D(ue,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,Q):n.texImage2D(ue+ne,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Q);return Y}const q={};q[n.TEXTURE_2D]=lt(n.TEXTURE_2D,n.TEXTURE_2D,1),q[n.TEXTURE_CUBE_MAP]=lt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[n.TEXTURE_2D_ARRAY]=lt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),q[n.TEXTURE_3D]=lt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(n.DEPTH_TEST),o.setFunc(Vi),Fe(!1),xt(Nl),J(n.CULL_FACE),Ke(Pn);function J(P){u[P]!==!0&&(n.enable(P),u[P]=!0)}function me(P){u[P]!==!1&&(n.disable(P),u[P]=!1)}function De(P,ue){return h[P]!==ue?(n.bindFramebuffer(P,ue),h[P]=ue,P===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ue),P===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ue),!0):!1}function ve(P,ue){let te=p,fe=!1;if(P){te=d.get(ue),te===void 0&&(te=[],d.set(ue,te));const Q=P.textures;if(te.length!==Q.length||te[0]!==n.COLOR_ATTACHMENT0){for(let Y=0,ne=Q.length;Y<ne;Y++)te[Y]=n.COLOR_ATTACHMENT0+Y;te.length=Q.length,fe=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,fe=!0);fe&&n.drawBuffers(te)}function Ze(P){return _!==P?(n.useProgram(P),_=P,!0):!1}const Tt={[oi]:n.FUNC_ADD,[Qg]:n.FUNC_SUBTRACT,[e_]:n.FUNC_REVERSE_SUBTRACT};Tt[t_]=n.MIN,Tt[n_]=n.MAX;const He={[i_]:n.ZERO,[r_]:n.ONE,[s_]:n.SRC_COLOR,[Uo]:n.SRC_ALPHA,[h_]:n.SRC_ALPHA_SATURATE,[c_]:n.DST_COLOR,[a_]:n.DST_ALPHA,[o_]:n.ONE_MINUS_SRC_COLOR,[No]:n.ONE_MINUS_SRC_ALPHA,[u_]:n.ONE_MINUS_DST_COLOR,[l_]:n.ONE_MINUS_DST_ALPHA,[d_]:n.CONSTANT_COLOR,[f_]:n.ONE_MINUS_CONSTANT_COLOR,[p_]:n.CONSTANT_ALPHA,[m_]:n.ONE_MINUS_CONSTANT_ALPHA};function Ke(P,ue,te,fe,Q,Y,ne,Le,st,Je){if(P===Pn){S===!0&&(me(n.BLEND),S=!1);return}if(S===!1&&(J(n.BLEND),S=!0),P!==Jg){if(P!==m||Je!==v){if((f!==oi||E!==oi)&&(n.blendEquation(n.FUNC_ADD),f=oi,E=oi),Je)switch(P){case Ui:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Do:n.blendFunc(n.ONE,n.ONE);break;case Ol:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Fl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:We("WebGLState: Invalid blending: ",P);break}else switch(P){case Ui:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Do:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ol:We("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fl:We("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:We("WebGLState: Invalid blending: ",P);break}w=null,b=null,T=null,A=null,R.set(0,0,0),O=0,m=P,v=Je}return}Q=Q||ue,Y=Y||te,ne=ne||fe,(ue!==f||Q!==E)&&(n.blendEquationSeparate(Tt[ue],Tt[Q]),f=ue,E=Q),(te!==w||fe!==b||Y!==T||ne!==A)&&(n.blendFuncSeparate(He[te],He[fe],He[Y],He[ne]),w=te,b=fe,T=Y,A=ne),(Le.equals(R)===!1||st!==O)&&(n.blendColor(Le.r,Le.g,Le.b,st),R.copy(Le),O=st),m=P,v=!1}function nt(P,ue){P.side===Tn?me(n.CULL_FACE):J(n.CULL_FACE);let te=P.side===Ft;ue&&(te=!te),Fe(te),P.blending===Ui&&P.transparent===!1?Ke(Pn):Ke(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),s.setMask(P.colorWrite);const fe=P.stencilWrite;a.setTest(fe),fe&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),St(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):me(n.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(P){M!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),M=P)}function xt(P){P!==Yg?(J(n.CULL_FACE),P!==L&&(P===Nl?n.cullFace(n.BACK):P===jg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):me(n.CULL_FACE),L=P}function C(P){P!==k&&(V&&n.lineWidth(P),k=P)}function St(P,ue,te){P?(J(n.POLYGON_OFFSET_FILL),(F!==ue||G!==te)&&(n.polygonOffset(ue,te),F=ue,G=te)):me(n.POLYGON_OFFSET_FILL)}function Ye(P){P?J(n.SCISSOR_TEST):me(n.SCISSOR_TEST)}function rt(P){P===void 0&&(P=n.TEXTURE0+Z-1),he!==P&&(n.activeTexture(P),he=P)}function Se(P,ue,te){te===void 0&&(he===null?te=n.TEXTURE0+Z-1:te=he);let fe=ae[te];fe===void 0&&(fe={type:void 0,texture:void 0},ae[te]=fe),(fe.type!==P||fe.texture!==ue)&&(he!==te&&(n.activeTexture(te),he=te),n.bindTexture(P,ue||q[P]),fe.type=P,fe.texture=ue)}function y(){const P=ae[he];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function g(){try{n.compressedTexImage2D(...arguments)}catch(P){We("WebGLState:",P)}}function I(){try{n.compressedTexImage3D(...arguments)}catch(P){We("WebGLState:",P)}}function X(){try{n.texSubImage2D(...arguments)}catch(P){We("WebGLState:",P)}}function j(){try{n.texSubImage3D(...arguments)}catch(P){We("WebGLState:",P)}}function H(){try{n.compressedTexSubImage2D(...arguments)}catch(P){We("WebGLState:",P)}}function ye(){try{n.compressedTexSubImage3D(...arguments)}catch(P){We("WebGLState:",P)}}function ie(){try{n.texStorage2D(...arguments)}catch(P){We("WebGLState:",P)}}function xe(){try{n.texStorage3D(...arguments)}catch(P){We("WebGLState:",P)}}function Ce(){try{n.texImage2D(...arguments)}catch(P){We("WebGLState:",P)}}function ee(){try{n.texImage3D(...arguments)}catch(P){We("WebGLState:",P)}}function se(P){Oe.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),Oe.copy(P))}function _e(P){ft.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),ft.copy(P))}function Me(P,ue){let te=c.get(ue);te===void 0&&(te=new WeakMap,c.set(ue,te));let fe=te.get(P);fe===void 0&&(fe=n.getUniformBlockIndex(ue,P.name),te.set(P,fe))}function re(P,ue){const fe=c.get(ue).get(P);l.get(ue)!==fe&&(n.uniformBlockBinding(ue,fe,P.__bindingPointIndex),l.set(ue,fe))}function ke(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},he=null,ae={},h={},d=new WeakMap,p=[],_=null,S=!1,m=null,f=null,w=null,b=null,E=null,T=null,A=null,R=new Ge(0,0,0),O=0,v=!1,M=null,L=null,k=null,F=null,G=null,Oe.set(0,0,n.canvas.width,n.canvas.height),ft.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:J,disable:me,bindFramebuffer:De,drawBuffers:ve,useProgram:Ze,setBlending:Ke,setMaterial:nt,setFlipSided:Fe,setCullFace:xt,setLineWidth:C,setPolygonOffset:St,setScissorTest:Ye,activeTexture:rt,bindTexture:Se,unbindTexture:y,compressedTexImage2D:g,compressedTexImage3D:I,texImage2D:Ce,texImage3D:ee,updateUBOMapping:Me,uniformBlockBinding:re,texStorage2D:ie,texStorage3D:xe,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:H,compressedTexSubImage3D:ye,scissor:se,viewport:_e,reset:ke}}function ny(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xe,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(y,g){return p?new OffscreenCanvas(y,g):xr("canvas")}function S(y,g,I){let X=1;const j=Se(y);if((j.width>I||j.height>I)&&(X=I/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement<"u"&&y instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&y instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&y instanceof ImageBitmap||typeof VideoFrame<"u"&&y instanceof VideoFrame){const H=Math.floor(X*j.width),ye=Math.floor(X*j.height);h===void 0&&(h=_(H,ye));const ie=g?_(H,ye):h;return ie.width=H,ie.height=ye,ie.getContext("2d").drawImage(y,0,0,H,ye),Ie("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+H+"x"+ye+")."),ie}else return"data"in y&&Ie("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),y;return y}function m(y){return y.generateMipmaps}function f(y){n.generateMipmap(y)}function w(y){return y.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:y.isWebGL3DRenderTarget?n.TEXTURE_3D:y.isWebGLArrayRenderTarget||y.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(y,g,I,X,j=!1){if(y!==null){if(n[y]!==void 0)return n[y];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+y+"'")}let H=g;if(g===n.RED&&(I===n.FLOAT&&(H=n.R32F),I===n.HALF_FLOAT&&(H=n.R16F),I===n.UNSIGNED_BYTE&&(H=n.R8)),g===n.RED_INTEGER&&(I===n.UNSIGNED_BYTE&&(H=n.R8UI),I===n.UNSIGNED_SHORT&&(H=n.R16UI),I===n.UNSIGNED_INT&&(H=n.R32UI),I===n.BYTE&&(H=n.R8I),I===n.SHORT&&(H=n.R16I),I===n.INT&&(H=n.R32I)),g===n.RG&&(I===n.FLOAT&&(H=n.RG32F),I===n.HALF_FLOAT&&(H=n.RG16F),I===n.UNSIGNED_BYTE&&(H=n.RG8)),g===n.RG_INTEGER&&(I===n.UNSIGNED_BYTE&&(H=n.RG8UI),I===n.UNSIGNED_SHORT&&(H=n.RG16UI),I===n.UNSIGNED_INT&&(H=n.RG32UI),I===n.BYTE&&(H=n.RG8I),I===n.SHORT&&(H=n.RG16I),I===n.INT&&(H=n.RG32I)),g===n.RGB_INTEGER&&(I===n.UNSIGNED_BYTE&&(H=n.RGB8UI),I===n.UNSIGNED_SHORT&&(H=n.RGB16UI),I===n.UNSIGNED_INT&&(H=n.RGB32UI),I===n.BYTE&&(H=n.RGB8I),I===n.SHORT&&(H=n.RGB16I),I===n.INT&&(H=n.RGB32I)),g===n.RGBA_INTEGER&&(I===n.UNSIGNED_BYTE&&(H=n.RGBA8UI),I===n.UNSIGNED_SHORT&&(H=n.RGBA16UI),I===n.UNSIGNED_INT&&(H=n.RGBA32UI),I===n.BYTE&&(H=n.RGBA8I),I===n.SHORT&&(H=n.RGBA16I),I===n.INT&&(H=n.RGBA32I)),g===n.RGB&&(I===n.UNSIGNED_INT_5_9_9_9_REV&&(H=n.RGB9_E5),I===n.UNSIGNED_INT_10F_11F_11F_REV&&(H=n.R11F_G11F_B10F)),g===n.RGBA){const ye=j?ys:$e.getTransfer(X);I===n.FLOAT&&(H=n.RGBA32F),I===n.HALF_FLOAT&&(H=n.RGBA16F),I===n.UNSIGNED_BYTE&&(H=ye===et?n.SRGB8_ALPHA8:n.RGBA8),I===n.UNSIGNED_SHORT_4_4_4_4&&(H=n.RGBA4),I===n.UNSIGNED_SHORT_5_5_5_1&&(H=n.RGB5_A1)}return(H===n.R16F||H===n.R32F||H===n.RG16F||H===n.RG32F||H===n.RGBA16F||H===n.RGBA32F)&&e.get("EXT_color_buffer_float"),H}function E(y,g){let I;return y?g===null||g===_n||g===vr?I=n.DEPTH24_STENCIL8:g===fn?I=n.DEPTH32F_STENCIL8:g===_r&&(I=n.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===_n||g===vr?I=n.DEPTH_COMPONENT24:g===fn?I=n.DEPTH_COMPONENT32F:g===_r&&(I=n.DEPTH_COMPONENT16),I}function T(y,g){return m(y)===!0||y.isFramebufferTexture&&y.minFilter!==At&&y.minFilter!==Lt?Math.log2(Math.max(g.width,g.height))+1:y.mipmaps!==void 0&&y.mipmaps.length>0?y.mipmaps.length:y.isCompressedTexture&&Array.isArray(y.image)?g.mipmaps.length:1}function A(y){const g=y.target;g.removeEventListener("dispose",A),O(g),g.isVideoTexture&&u.delete(g)}function R(y){const g=y.target;g.removeEventListener("dispose",R),M(g)}function O(y){const g=i.get(y);if(g.__webglInit===void 0)return;const I=y.source,X=d.get(I);if(X){const j=X[g.__cacheKey];j.usedTimes--,j.usedTimes===0&&v(y),Object.keys(X).length===0&&d.delete(I)}i.remove(y)}function v(y){const g=i.get(y);n.deleteTexture(g.__webglTexture);const I=y.source,X=d.get(I);delete X[g.__cacheKey],o.memory.textures--}function M(y){const g=i.get(y);if(y.depthTexture&&(y.depthTexture.dispose(),i.remove(y.depthTexture)),y.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(g.__webglFramebuffer[X]))for(let j=0;j<g.__webglFramebuffer[X].length;j++)n.deleteFramebuffer(g.__webglFramebuffer[X][j]);else n.deleteFramebuffer(g.__webglFramebuffer[X]);g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer[X])}else{if(Array.isArray(g.__webglFramebuffer))for(let X=0;X<g.__webglFramebuffer.length;X++)n.deleteFramebuffer(g.__webglFramebuffer[X]);else n.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&n.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let X=0;X<g.__webglColorRenderbuffer.length;X++)g.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(g.__webglColorRenderbuffer[X]);g.__webglDepthRenderbuffer&&n.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const I=y.textures;for(let X=0,j=I.length;X<j;X++){const H=i.get(I[X]);H.__webglTexture&&(n.deleteTexture(H.__webglTexture),o.memory.textures--),i.remove(I[X])}i.remove(y)}let L=0;function k(){L=0}function F(){const y=L;return y>=r.maxTextures&&Ie("WebGLTextures: Trying to use "+y+" texture units while this GPU supports only "+r.maxTextures),L+=1,y}function G(y){const g=[];return g.push(y.wrapS),g.push(y.wrapT),g.push(y.wrapR||0),g.push(y.magFilter),g.push(y.minFilter),g.push(y.anisotropy),g.push(y.internalFormat),g.push(y.format),g.push(y.type),g.push(y.generateMipmaps),g.push(y.premultiplyAlpha),g.push(y.flipY),g.push(y.unpackAlignment),g.push(y.colorSpace),g.join()}function Z(y,g){const I=i.get(y);if(y.isVideoTexture&&Ye(y),y.isRenderTargetTexture===!1&&y.isExternalTexture!==!0&&y.version>0&&I.__version!==y.version){const X=y.image;if(X===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{q(I,y,g);return}}else y.isExternalTexture&&(I.__webglTexture=y.sourceTexture?y.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,I.__webglTexture,n.TEXTURE0+g)}function V(y,g){const I=i.get(y);if(y.isRenderTargetTexture===!1&&y.version>0&&I.__version!==y.version){q(I,y,g);return}else y.isExternalTexture&&(I.__webglTexture=y.sourceTexture?y.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,I.__webglTexture,n.TEXTURE0+g)}function W(y,g){const I=i.get(y);if(y.isRenderTargetTexture===!1&&y.version>0&&I.__version!==y.version){q(I,y,g);return}t.bindTexture(n.TEXTURE_3D,I.__webglTexture,n.TEXTURE0+g)}function K(y,g){const I=i.get(y);if(y.isCubeDepthTexture!==!0&&y.version>0&&I.__version!==y.version){J(I,y,g);return}t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+g)}const he={[gr]:n.REPEAT,[An]:n.CLAMP_TO_EDGE,[$o]:n.MIRRORED_REPEAT},ae={[At]:n.NEAREST,[v_]:n.NEAREST_MIPMAP_NEAREST,[Ur]:n.NEAREST_MIPMAP_LINEAR,[Lt]:n.LINEAR,[Ws]:n.LINEAR_MIPMAP_NEAREST,[ui]:n.LINEAR_MIPMAP_LINEAR},de={[M_]:n.NEVER,[w_]:n.ALWAYS,[y_]:n.LESS,[Za]:n.LEQUAL,[E_]:n.EQUAL,[qa]:n.GEQUAL,[b_]:n.GREATER,[T_]:n.NOTEQUAL};function ze(y,g){if(g.type===fn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Lt||g.magFilter===Ws||g.magFilter===Ur||g.magFilter===ui||g.minFilter===Lt||g.minFilter===Ws||g.minFilter===Ur||g.minFilter===ui)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(y,n.TEXTURE_WRAP_S,he[g.wrapS]),n.texParameteri(y,n.TEXTURE_WRAP_T,he[g.wrapT]),(y===n.TEXTURE_3D||y===n.TEXTURE_2D_ARRAY)&&n.texParameteri(y,n.TEXTURE_WRAP_R,he[g.wrapR]),n.texParameteri(y,n.TEXTURE_MAG_FILTER,ae[g.magFilter]),n.texParameteri(y,n.TEXTURE_MIN_FILTER,ae[g.minFilter]),g.compareFunction&&(n.texParameteri(y,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(y,n.TEXTURE_COMPARE_FUNC,de[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===At||g.minFilter!==Ur&&g.minFilter!==ui||g.type===fn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){const I=e.get("EXT_texture_filter_anisotropic");n.texParameterf(y,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function Oe(y,g){let I=!1;y.__webglInit===void 0&&(y.__webglInit=!0,g.addEventListener("dispose",A));const X=g.source;let j=d.get(X);j===void 0&&(j={},d.set(X,j));const H=G(g);if(H!==y.__cacheKey){j[H]===void 0&&(j[H]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,I=!0),j[H].usedTimes++;const ye=j[y.__cacheKey];ye!==void 0&&(j[y.__cacheKey].usedTimes--,ye.usedTimes===0&&v(g)),y.__cacheKey=H,y.__webglTexture=j[H].texture}return I}function ft(y,g,I){return Math.floor(Math.floor(y/I)/g)}function lt(y,g,I,X){const H=y.updateRanges;if(H.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,g.width,g.height,I,X,g.data);else{H.sort((ee,se)=>ee.start-se.start);let ye=0;for(let ee=1;ee<H.length;ee++){const se=H[ye],_e=H[ee],Me=se.start+se.count,re=ft(_e.start,g.width,4),ke=ft(se.start,g.width,4);_e.start<=Me+1&&re===ke&&ft(_e.start+_e.count-1,g.width,4)===re?se.count=Math.max(se.count,_e.start+_e.count-se.start):(++ye,H[ye]=_e)}H.length=ye+1;const ie=n.getParameter(n.UNPACK_ROW_LENGTH),xe=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,g.width);for(let ee=0,se=H.length;ee<se;ee++){const _e=H[ee],Me=Math.floor(_e.start/4),re=Math.ceil(_e.count/4),ke=Me%g.width,P=Math.floor(Me/g.width),ue=re,te=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,ke),n.pixelStorei(n.UNPACK_SKIP_ROWS,P),t.texSubImage2D(n.TEXTURE_2D,0,ke,P,ue,te,I,X,g.data)}y.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ie),n.pixelStorei(n.UNPACK_SKIP_PIXELS,xe),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function q(y,g,I){let X=n.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),g.isData3DTexture&&(X=n.TEXTURE_3D);const j=Oe(y,g),H=g.source;t.bindTexture(X,y.__webglTexture,n.TEXTURE0+I);const ye=i.get(H);if(H.version!==ye.__version||j===!0){t.activeTexture(n.TEXTURE0+I);const ie=$e.getPrimaries($e.workingColorSpace),xe=g.colorSpace===Gn?null:$e.getPrimaries(g.colorSpace),Ce=g.colorSpace===Gn||ie===xe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ee=S(g.image,!1,r.maxTextureSize);ee=rt(g,ee);const se=s.convert(g.format,g.colorSpace),_e=s.convert(g.type);let Me=b(g.internalFormat,se,_e,g.colorSpace,g.isVideoTexture);ze(X,g);let re;const ke=g.mipmaps,P=g.isVideoTexture!==!0,ue=ye.__version===void 0||j===!0,te=H.dataReady,fe=T(g,ee);if(g.isDepthTexture)Me=E(g.format===hi,g.type),ue&&(P?t.texStorage2D(n.TEXTURE_2D,1,Me,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,Me,ee.width,ee.height,0,se,_e,null));else if(g.isDataTexture)if(ke.length>0){P&&ue&&t.texStorage2D(n.TEXTURE_2D,fe,Me,ke[0].width,ke[0].height);for(let Q=0,Y=ke.length;Q<Y;Q++)re=ke[Q],P?te&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,re.width,re.height,se,_e,re.data):t.texImage2D(n.TEXTURE_2D,Q,Me,re.width,re.height,0,se,_e,re.data);g.generateMipmaps=!1}else P?(ue&&t.texStorage2D(n.TEXTURE_2D,fe,Me,ee.width,ee.height),te&&lt(g,ee,se,_e)):t.texImage2D(n.TEXTURE_2D,0,Me,ee.width,ee.height,0,se,_e,ee.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){P&&ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Me,ke[0].width,ke[0].height,ee.depth);for(let Q=0,Y=ke.length;Q<Y;Q++)if(re=ke[Q],g.format!==sn)if(se!==null)if(P){if(te)if(g.layerUpdates.size>0){const ne=dc(re.width,re.height,g.format,g.type);for(const Le of g.layerUpdates){const st=re.data.subarray(Le*ne/re.data.BYTES_PER_ELEMENT,(Le+1)*ne/re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,Le,re.width,re.height,1,se,st)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,re.width,re.height,ee.depth,se,re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,Me,re.width,re.height,ee.depth,0,re.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?te&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,re.width,re.height,ee.depth,se,_e,re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,Me,re.width,re.height,ee.depth,0,se,_e,re.data)}else{P&&ue&&t.texStorage2D(n.TEXTURE_2D,fe,Me,ke[0].width,ke[0].height);for(let Q=0,Y=ke.length;Q<Y;Q++)re=ke[Q],g.format!==sn?se!==null?P?te&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,re.width,re.height,se,re.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,Me,re.width,re.height,0,re.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?te&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,re.width,re.height,se,_e,re.data):t.texImage2D(n.TEXTURE_2D,Q,Me,re.width,re.height,0,se,_e,re.data)}else if(g.isDataArrayTexture)if(P){if(ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Me,ee.width,ee.height,ee.depth),te)if(g.layerUpdates.size>0){const Q=dc(ee.width,ee.height,g.format,g.type);for(const Y of g.layerUpdates){const ne=ee.data.subarray(Y*Q/ee.data.BYTES_PER_ELEMENT,(Y+1)*Q/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Y,ee.width,ee.height,1,se,_e,ne)}g.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,se,_e,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Me,ee.width,ee.height,ee.depth,0,se,_e,ee.data);else if(g.isData3DTexture)P?(ue&&t.texStorage3D(n.TEXTURE_3D,fe,Me,ee.width,ee.height,ee.depth),te&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,se,_e,ee.data)):t.texImage3D(n.TEXTURE_3D,0,Me,ee.width,ee.height,ee.depth,0,se,_e,ee.data);else if(g.isFramebufferTexture){if(ue)if(P)t.texStorage2D(n.TEXTURE_2D,fe,Me,ee.width,ee.height);else{let Q=ee.width,Y=ee.height;for(let ne=0;ne<fe;ne++)t.texImage2D(n.TEXTURE_2D,ne,Me,Q,Y,0,se,_e,null),Q>>=1,Y>>=1}}else if(ke.length>0){if(P&&ue){const Q=Se(ke[0]);t.texStorage2D(n.TEXTURE_2D,fe,Me,Q.width,Q.height)}for(let Q=0,Y=ke.length;Q<Y;Q++)re=ke[Q],P?te&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,se,_e,re):t.texImage2D(n.TEXTURE_2D,Q,Me,se,_e,re);g.generateMipmaps=!1}else if(P){if(ue){const Q=Se(ee);t.texStorage2D(n.TEXTURE_2D,fe,Me,Q.width,Q.height)}te&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,se,_e,ee)}else t.texImage2D(n.TEXTURE_2D,0,Me,se,_e,ee);m(g)&&f(X),ye.__version=H.version,g.onUpdate&&g.onUpdate(g)}y.__version=g.version}function J(y,g,I){if(g.image.length!==6)return;const X=Oe(y,g),j=g.source;t.bindTexture(n.TEXTURE_CUBE_MAP,y.__webglTexture,n.TEXTURE0+I);const H=i.get(j);if(j.version!==H.__version||X===!0){t.activeTexture(n.TEXTURE0+I);const ye=$e.getPrimaries($e.workingColorSpace),ie=g.colorSpace===Gn?null:$e.getPrimaries(g.colorSpace),xe=g.colorSpace===Gn||ye===ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Ce=g.isCompressedTexture||g.image[0].isCompressedTexture,ee=g.image[0]&&g.image[0].isDataTexture,se=[];for(let Y=0;Y<6;Y++)!Ce&&!ee?se[Y]=S(g.image[Y],!0,r.maxCubemapSize):se[Y]=ee?g.image[Y].image:g.image[Y],se[Y]=rt(g,se[Y]);const _e=se[0],Me=s.convert(g.format,g.colorSpace),re=s.convert(g.type),ke=b(g.internalFormat,Me,re,g.colorSpace),P=g.isVideoTexture!==!0,ue=H.__version===void 0||X===!0,te=j.dataReady;let fe=T(g,_e);ze(n.TEXTURE_CUBE_MAP,g);let Q;if(Ce){P&&ue&&t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,ke,_e.width,_e.height);for(let Y=0;Y<6;Y++){Q=se[Y].mipmaps;for(let ne=0;ne<Q.length;ne++){const Le=Q[ne];g.format!==sn?Me!==null?P?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne,0,0,Le.width,Le.height,Me,Le.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne,ke,Le.width,Le.height,0,Le.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne,0,0,Le.width,Le.height,Me,re,Le.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne,ke,Le.width,Le.height,0,Me,re,Le.data)}}}else{if(Q=g.mipmaps,P&&ue){Q.length>0&&fe++;const Y=Se(se[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,ke,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ee){P?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,se[Y].width,se[Y].height,Me,re,se[Y].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,ke,se[Y].width,se[Y].height,0,Me,re,se[Y].data);for(let ne=0;ne<Q.length;ne++){const st=Q[ne].image[Y].image;P?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne+1,0,0,st.width,st.height,Me,re,st.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne+1,ke,st.width,st.height,0,Me,re,st.data)}}else{P?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Me,re,se[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,ke,Me,re,se[Y]);for(let ne=0;ne<Q.length;ne++){const Le=Q[ne];P?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne+1,0,0,Me,re,Le.image[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ne+1,ke,Me,re,Le.image[Y])}}}m(g)&&f(n.TEXTURE_CUBE_MAP),H.__version=j.version,g.onUpdate&&g.onUpdate(g)}y.__version=g.version}function me(y,g,I,X,j,H){const ye=s.convert(I.format,I.colorSpace),ie=s.convert(I.type),xe=b(I.internalFormat,ye,ie,I.colorSpace),Ce=i.get(g),ee=i.get(I);if(ee.__renderTarget=g,!Ce.__hasExternalTextures){const se=Math.max(1,g.width>>H),_e=Math.max(1,g.height>>H);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?t.texImage3D(j,H,xe,se,_e,g.depth,0,ye,ie,null):t.texImage2D(j,H,xe,se,_e,0,ye,ie,null)}t.bindFramebuffer(n.FRAMEBUFFER,y),St(g)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,j,ee.__webglTexture,0,C(g)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,j,ee.__webglTexture,H),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(y,g,I){if(n.bindRenderbuffer(n.RENDERBUFFER,y),g.depthBuffer){const X=g.depthTexture,j=X&&X.isDepthTexture?X.type:null,H=E(g.stencilBuffer,j),ye=g.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;St(g)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,C(g),H,g.width,g.height):I?n.renderbufferStorageMultisample(n.RENDERBUFFER,C(g),H,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,H,g.width,g.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ye,n.RENDERBUFFER,y)}else{const X=g.textures;for(let j=0;j<X.length;j++){const H=X[j],ye=s.convert(H.format,H.colorSpace),ie=s.convert(H.type),xe=b(H.internalFormat,ye,ie,H.colorSpace);St(g)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,C(g),xe,g.width,g.height):I?n.renderbufferStorageMultisample(n.RENDERBUFFER,C(g),xe,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,xe,g.width,g.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ve(y,g,I){const X=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,y),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(g.depthTexture);if(j.__renderTarget=g,(!j.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X){if(j.__webglInit===void 0&&(j.__webglInit=!0,g.depthTexture.addEventListener("dispose",A)),j.__webglTexture===void 0){j.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),ze(n.TEXTURE_CUBE_MAP,g.depthTexture);const Ce=s.convert(g.depthTexture.format),ee=s.convert(g.depthTexture.type);let se;g.depthTexture.format===Un?se=n.DEPTH_COMPONENT24:g.depthTexture.format===hi&&(se=n.DEPTH24_STENCIL8);for(let _e=0;_e<6;_e++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,se,g.width,g.height,0,Ce,ee,null)}}else Z(g.depthTexture,0);const H=j.__webglTexture,ye=C(g),ie=X?n.TEXTURE_CUBE_MAP_POSITIVE_X+I:n.TEXTURE_2D,xe=g.depthTexture.format===hi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(g.depthTexture.format===Un)St(g)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,xe,ie,H,0,ye):n.framebufferTexture2D(n.FRAMEBUFFER,xe,ie,H,0);else if(g.depthTexture.format===hi)St(g)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,xe,ie,H,0,ye):n.framebufferTexture2D(n.FRAMEBUFFER,xe,ie,H,0);else throw new Error("Unknown depthTexture format")}function Ze(y){const g=i.get(y),I=y.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==y.depthTexture){const X=y.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),X){const j=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),g.__depthDisposeCallback=j}g.__boundDepthTexture=X}if(y.depthTexture&&!g.__autoAllocateDepthBuffer)if(I)for(let X=0;X<6;X++)ve(g.__webglFramebuffer[X],y,X);else{const X=y.texture.mipmaps;X&&X.length>0?ve(g.__webglFramebuffer[0],y,0):ve(g.__webglFramebuffer,y,0)}else if(I){g.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[X]),g.__webglDepthbuffer[X]===void 0)g.__webglDepthbuffer[X]=n.createRenderbuffer(),De(g.__webglDepthbuffer[X],y,!1);else{const j=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=g.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,H),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,H)}}else{const X=y.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=n.createRenderbuffer(),De(g.__webglDepthbuffer,y,!1);else{const j=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=g.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,H),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,H)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Tt(y,g,I){const X=i.get(y);g!==void 0&&me(X.__webglFramebuffer,y,y.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),I!==void 0&&Ze(y)}function He(y){const g=y.texture,I=i.get(y),X=i.get(g);y.addEventListener("dispose",R);const j=y.textures,H=y.isWebGLCubeRenderTarget===!0,ye=j.length>1;if(ye||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=g.version,o.memory.textures++),H){I.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(g.mipmaps&&g.mipmaps.length>0){I.__webglFramebuffer[ie]=[];for(let xe=0;xe<g.mipmaps.length;xe++)I.__webglFramebuffer[ie][xe]=n.createFramebuffer()}else I.__webglFramebuffer[ie]=n.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){I.__webglFramebuffer=[];for(let ie=0;ie<g.mipmaps.length;ie++)I.__webglFramebuffer[ie]=n.createFramebuffer()}else I.__webglFramebuffer=n.createFramebuffer();if(ye)for(let ie=0,xe=j.length;ie<xe;ie++){const Ce=i.get(j[ie]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),o.memory.textures++)}if(y.samples>0&&St(y)===!1){I.__webglMultisampledFramebuffer=n.createFramebuffer(),I.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let ie=0;ie<j.length;ie++){const xe=j[ie];I.__webglColorRenderbuffer[ie]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,I.__webglColorRenderbuffer[ie]);const Ce=s.convert(xe.format,xe.colorSpace),ee=s.convert(xe.type),se=b(xe.internalFormat,Ce,ee,xe.colorSpace,y.isXRRenderTarget===!0),_e=C(y);n.renderbufferStorageMultisample(n.RENDERBUFFER,_e,se,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ie,n.RENDERBUFFER,I.__webglColorRenderbuffer[ie])}n.bindRenderbuffer(n.RENDERBUFFER,null),y.depthBuffer&&(I.__webglDepthRenderbuffer=n.createRenderbuffer(),De(I.__webglDepthRenderbuffer,y,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(H){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),ze(n.TEXTURE_CUBE_MAP,g);for(let ie=0;ie<6;ie++)if(g.mipmaps&&g.mipmaps.length>0)for(let xe=0;xe<g.mipmaps.length;xe++)me(I.__webglFramebuffer[ie][xe],y,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,xe);else me(I.__webglFramebuffer[ie],y,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(g)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let ie=0,xe=j.length;ie<xe;ie++){const Ce=j[ie],ee=i.get(Ce);let se=n.TEXTURE_2D;(y.isWebGL3DRenderTarget||y.isWebGLArrayRenderTarget)&&(se=y.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(se,ee.__webglTexture),ze(se,Ce),me(I.__webglFramebuffer,y,Ce,n.COLOR_ATTACHMENT0+ie,se,0),m(Ce)&&f(se)}t.unbindTexture()}else{let ie=n.TEXTURE_2D;if((y.isWebGL3DRenderTarget||y.isWebGLArrayRenderTarget)&&(ie=y.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,X.__webglTexture),ze(ie,g),g.mipmaps&&g.mipmaps.length>0)for(let xe=0;xe<g.mipmaps.length;xe++)me(I.__webglFramebuffer[xe],y,g,n.COLOR_ATTACHMENT0,ie,xe);else me(I.__webglFramebuffer,y,g,n.COLOR_ATTACHMENT0,ie,0);m(g)&&f(ie),t.unbindTexture()}y.depthBuffer&&Ze(y)}function Ke(y){const g=y.textures;for(let I=0,X=g.length;I<X;I++){const j=g[I];if(m(j)){const H=w(y),ye=i.get(j).__webglTexture;t.bindTexture(H,ye),f(H),t.unbindTexture()}}}const nt=[],Fe=[];function xt(y){if(y.samples>0){if(St(y)===!1){const g=y.textures,I=y.width,X=y.height;let j=n.COLOR_BUFFER_BIT;const H=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ye=i.get(y),ie=g.length>1;if(ie)for(let Ce=0;Ce<g.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const xe=y.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let Ce=0;Ce<g.length;Ce++){if(y.resolveDepthBuffer&&(y.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),y.stencilBuffer&&y.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),ie){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ye.__webglColorRenderbuffer[Ce]);const ee=i.get(g[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ee,0)}n.blitFramebuffer(0,0,I,X,0,0,I,X,j,n.NEAREST),l===!0&&(nt.length=0,Fe.length=0,nt.push(n.COLOR_ATTACHMENT0+Ce),y.depthBuffer&&y.resolveDepthBuffer===!1&&(nt.push(H),Fe.push(H),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Fe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,nt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ie)for(let Ce=0;Ce<g.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,ye.__webglColorRenderbuffer[Ce]);const ee=i.get(g[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,ee,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(y.depthBuffer&&y.resolveDepthBuffer===!1&&l){const g=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[g])}}}function C(y){return Math.min(r.maxSamples,y.samples)}function St(y){const g=i.get(y);return y.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Ye(y){const g=o.render.frame;u.get(y)!==g&&(u.set(y,g),y.update())}function rt(y,g){const I=y.colorSpace,X=y.format,j=y.type;return y.isCompressedTexture===!0||y.isVideoTexture===!0||I!==Wi&&I!==Gn&&($e.getTransfer(I)===et?(X!==sn||j!==Zt)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):We("WebGLTextures: Unsupported texture color space:",I)),g}function Se(y){return typeof HTMLImageElement<"u"&&y instanceof HTMLImageElement?(c.width=y.naturalWidth||y.width,c.height=y.naturalHeight||y.height):typeof VideoFrame<"u"&&y instanceof VideoFrame?(c.width=y.displayWidth,c.height=y.displayHeight):(c.width=y.width,c.height=y.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=k,this.setTexture2D=Z,this.setTexture2DArray=V,this.setTexture3D=W,this.setTextureCube=K,this.rebindTextures=Tt,this.setupRenderTarget=He,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=me,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function iy(n,e){function t(i,r=Gn){let s;const o=$e.getTransfer(r);if(i===Zt)return n.UNSIGNED_BYTE;if(i===Ga)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ha)return n.UNSIGNED_SHORT_5_5_5_1;if(i===zu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Bu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Fu)return n.BYTE;if(i===ku)return n.SHORT;if(i===_r)return n.UNSIGNED_SHORT;if(i===Va)return n.INT;if(i===_n)return n.UNSIGNED_INT;if(i===fn)return n.FLOAT;if(i===Dn)return n.HALF_FLOAT;if(i===Vu)return n.ALPHA;if(i===Gu)return n.RGB;if(i===sn)return n.RGBA;if(i===Un)return n.DEPTH_COMPONENT;if(i===hi)return n.DEPTH_STENCIL;if(i===Hu)return n.RED;if(i===Wa)return n.RED_INTEGER;if(i===Hi)return n.RG;if(i===$a)return n.RG_INTEGER;if(i===Xa)return n.RGBA_INTEGER;if(i===as||i===ls||i===cs||i===us)if(o===et)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===as)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ls)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===cs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===us)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===as)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ls)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===cs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===us)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Xo||i===Zo||i===qo||i===Yo)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Xo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Zo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===qo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Yo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===jo||i===Ko||i===Jo||i===Qo||i===ea||i===ta||i===na)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===jo||i===Ko)return o===et?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Jo)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Qo)return s.COMPRESSED_R11_EAC;if(i===ea)return s.COMPRESSED_SIGNED_R11_EAC;if(i===ta)return s.COMPRESSED_RG11_EAC;if(i===na)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ia||i===ra||i===sa||i===oa||i===aa||i===la||i===ca||i===ua||i===ha||i===da||i===fa||i===pa||i===ma||i===ga)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===ia)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ra)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===sa)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===oa)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===aa)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===la)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ca)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ua)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ha)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===da)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===fa)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===pa)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ma)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ga)return o===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===_a||i===va||i===xa)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===_a)return o===et?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===va)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===xa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Sa||i===Ma||i===ya||i===Ea)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Sa)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ma)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ya)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ea)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===vr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const ry=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class oy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new th(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ln({vertexShader:ry,fragmentShader:sy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ot(new Ds(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ay extends Zi{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,_=null;const S=typeof XRWebGLBinding<"u",m=new oy,f={},w=t.getContextAttributes();let b=null,E=null;const T=[],A=[],R=new Xe;let O=null;const v=new Jt;v.viewport=new _t;const M=new Jt;M.viewport=new _t;const L=[v,M],k=new gv;let F=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=T[q];return J===void 0&&(J=new po,T[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=T[q];return J===void 0&&(J=new po,T[q]=J),J.getGripSpace()},this.getHand=function(q){let J=T[q];return J===void 0&&(J=new po,T[q]=J),J.getHandSpace()};function Z(q){const J=A.indexOf(q.inputSource);if(J===-1)return;const me=T[J];me!==void 0&&(me.update(q.inputSource,q.frame,c||o),me.dispatchEvent({type:q.type,data:q.inputSource}))}function V(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",W);for(let q=0;q<T.length;q++){const J=A[q];J!==null&&(A[q]=null,T[q].disconnect(J))}F=null,G=null,m.reset();for(const q in f)delete f[q];e.setRenderTarget(b),p=null,d=null,h=null,r=null,E=null,lt.stop(),i.isPresenting=!1,e.setPixelRatio(O),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h===null&&S&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(b=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",V),r.addEventListener("inputsourceschange",W),w.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(R),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let me=null,De=null,ve=null;w.depth&&(ve=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,me=w.stencil?hi:Un,De=w.stencil?vr:_n);const Ze={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Ze),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),E=new gn(d.textureWidth,d.textureHeight,{format:sn,type:Zt,depthTexture:new Mr(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,me),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const me={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,me),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new gn(p.framebufferWidth,p.framebufferHeight,{format:sn,type:Zt,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),lt.setContext(r),lt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(q){for(let J=0;J<q.removed.length;J++){const me=q.removed[J],De=A.indexOf(me);De>=0&&(A[De]=null,T[De].disconnect(me))}for(let J=0;J<q.added.length;J++){const me=q.added[J];let De=A.indexOf(me);if(De===-1){for(let Ze=0;Ze<T.length;Ze++)if(Ze>=A.length){A.push(me),De=Ze;break}else if(A[Ze]===null){A[Ze]=me,De=Ze;break}if(De===-1)break}const ve=T[De];ve&&ve.connect(me)}}const K=new N,he=new N;function ae(q,J,me){K.setFromMatrixPosition(J.matrixWorld),he.setFromMatrixPosition(me.matrixWorld);const De=K.distanceTo(he),ve=J.projectionMatrix.elements,Ze=me.projectionMatrix.elements,Tt=ve[14]/(ve[10]-1),He=ve[14]/(ve[10]+1),Ke=(ve[9]+1)/ve[5],nt=(ve[9]-1)/ve[5],Fe=(ve[8]-1)/ve[0],xt=(Ze[8]+1)/Ze[0],C=Tt*Fe,St=Tt*xt,Ye=De/(-Fe+xt),rt=Ye*-Fe;if(J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(rt),q.translateZ(Ye),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),ve[10]===-1)q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Se=Tt+Ye,y=He+Ye,g=C-rt,I=St+(De-rt),X=Ke*He/y*Se,j=nt*He/y*Se;q.projectionMatrix.makePerspective(g,I,X,j,Se,y),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function de(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let J=q.near,me=q.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(me=m.depthFar)),k.near=M.near=v.near=J,k.far=M.far=v.far=me,(F!==k.near||G!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),F=k.near,G=k.far),k.layers.mask=q.layers.mask|6,v.layers.mask=k.layers.mask&3,M.layers.mask=k.layers.mask&5;const De=q.parent,ve=k.cameras;de(k,De);for(let Ze=0;Ze<ve.length;Ze++)de(ve[Ze],De);ve.length===2?ae(k,v,M):k.projectionMatrix.copy(v.projectionMatrix),ze(q,k,De)};function ze(q,J,me){me===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(me.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ba*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(q){return f[q]};let Oe=null;function ft(q,J){if(u=J.getViewerPose(c||o),_=J,u!==null){const me=u.views;p!==null&&(e.setRenderTargetFramebuffer(E,p.framebuffer),e.setRenderTarget(E));let De=!1;me.length!==k.cameras.length&&(k.cameras.length=0,De=!0);for(let He=0;He<me.length;He++){const Ke=me[He];let nt=null;if(p!==null)nt=p.getViewport(Ke);else{const xt=h.getViewSubImage(d,Ke);nt=xt.viewport,He===0&&(e.setRenderTargetTextures(E,xt.colorTexture,xt.depthStencilTexture),e.setRenderTarget(E))}let Fe=L[He];Fe===void 0&&(Fe=new Jt,Fe.layers.enable(He),Fe.viewport=new _t,L[He]=Fe),Fe.matrix.fromArray(Ke.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(Ke.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(nt.x,nt.y,nt.width,nt.height),He===0&&(k.matrix.copy(Fe.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),De===!0&&k.cameras.push(Fe)}const ve=r.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){h=i.getBinding();const He=h.getDepthInformation(me[0]);He&&He.isValid&&He.texture&&m.init(He,r.renderState)}if(ve&&ve.includes("camera-access")&&S){e.state.unbindTexture(),h=i.getBinding();for(let He=0;He<me.length;He++){const Ke=me[He].camera;if(Ke){let nt=f[Ke];nt||(nt=new th,f[Ke]=nt);const Fe=h.getCameraImage(Ke);nt.sourceTexture=Fe}}}}for(let me=0;me<T.length;me++){const De=A[me],ve=T[me];De!==null&&ve!==void 0&&ve.update(De,J,c||o)}Oe&&Oe(q,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),_=null}const lt=new ih;lt.setAnimationLoop(ft),this.setAnimationLoop=function(q){Oe=q},this.dispose=function(){}}}const ii=new vn,ly=new ut;function cy(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,ju(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,w,b,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),h(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,E)):f.isMeshMatcapMaterial?(s(m,f),_(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),S(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,w,b):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ft&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ft&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const w=e.get(f),b=w.envMap,E=w.envMapRotation;b&&(m.envMap.value=b,ii.copy(E),ii.x*=-1,ii.y*=-1,ii.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ii.y*=-1,ii.z*=-1),m.envMapRotation.value.setFromMatrix4(ly.makeRotationFromEuler(ii)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,w,b){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*w,m.scale.value=b*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,w){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ft&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function S(m,f){const w=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function uy(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,b){const E=b.program;i.uniformBlockBinding(w,E)}function c(w,b){let E=r[w.id];E===void 0&&(_(w),E=u(w),r[w.id]=E,w.addEventListener("dispose",m));const T=b.program;i.updateUBOMapping(w,T);const A=e.render.frame;s[w.id]!==A&&(d(w),s[w.id]=A)}function u(w){const b=h();w.__bindingPointIndex=b;const E=n.createBuffer(),T=w.__size,A=w.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,T,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,E),E}function h(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return We("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const b=r[w.id],E=w.uniforms,T=w.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let A=0,R=E.length;A<R;A++){const O=Array.isArray(E[A])?E[A]:[E[A]];for(let v=0,M=O.length;v<M;v++){const L=O[v];if(p(L,A,v,T)===!0){const k=L.__offset,F=Array.isArray(L.value)?L.value:[L.value];let G=0;for(let Z=0;Z<F.length;Z++){const V=F[Z],W=S(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,k+G,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,G),G+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(w,b,E,T){const A=w.value,R=b+"_"+E;if(T[R]===void 0)return typeof A=="number"||typeof A=="boolean"?T[R]=A:T[R]=A.clone(),!0;{const O=T[R];if(typeof A=="number"||typeof A=="boolean"){if(O!==A)return T[R]=A,!0}else if(O.equals(A)===!1)return O.copy(A),!0}return!1}function _(w){const b=w.uniforms;let E=0;const T=16;for(let R=0,O=b.length;R<O;R++){const v=Array.isArray(b[R])?b[R]:[b[R]];for(let M=0,L=v.length;M<L;M++){const k=v[M],F=Array.isArray(k.value)?k.value:[k.value];for(let G=0,Z=F.length;G<Z;G++){const V=F[G],W=S(V),K=E%T,he=K%W.boundary,ae=K+he;E+=he,ae!==0&&T-ae<W.storage&&(E+=T-ae),k.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=E,E+=W.storage}}}const A=E%T;return A>0&&(E+=T-A),w.__size=E,w.__cache={},this}function S(w){const b={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(b.boundary=4,b.storage=4):w.isVector2?(b.boundary=8,b.storage=8):w.isVector3||w.isColor?(b.boundary=16,b.storage=12):w.isVector4?(b.boundary=16,b.storage=16):w.isMatrix3?(b.boundary=48,b.storage=48):w.isMatrix4?(b.boundary=64,b.storage=64):w.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ie("WebGLRenderer: Unsupported uniform value type.",w),b}function m(w){const b=w.target;b.removeEventListener("dispose",m);const E=o.indexOf(b.__bindingPointIndex);o.splice(E,1),n.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function f(){for(const w in r)n.deleteBuffer(r[w]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}const hy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let un=null;function dy(){return un===null&&(un=new ev(hy,16,16,Hi,Dn),un.name="DFG_LUT",un.minFilter=Lt,un.magFilter=Lt,un.wrapS=An,un.wrapT=An,un.generateMipmaps=!1,un.needsUpdate=!0),un}class fy{constructor(e={}){const{canvas:t=A_(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:p=Zt}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=o;const S=p,m=new Set([Xa,$a,Wa]),f=new Set([Zt,_n,_r,vr,Ga,Ha]),w=new Uint32Array(4),b=new Int32Array(4);let E=null,T=null;const A=[],R=[];let O=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let M=!1;this._outputColorSpace=Kt;let L=0,k=0,F=null,G=-1,Z=null;const V=new _t,W=new _t;let K=null;const he=new Ge(0);let ae=0,de=t.width,ze=t.height,Oe=1,ft=null,lt=null;const q=new _t(0,0,de,ze),J=new _t(0,0,de,ze);let me=!1;const De=new Ja;let ve=!1,Ze=!1;const Tt=new ut,He=new N,Ke=new _t,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Fe=!1;function xt(){return F===null?Oe:1}let C=i;function St(x,D){return t.getContext(x,D)}try{const x={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${za}`),t.addEventListener("webglcontextlost",Le,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",Je,!1),C===null){const D="webgl2";if(C=St(D,x),C===null)throw St(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw We("WebGLRenderer: "+x.message),x}let Ye,rt,Se,y,g,I,X,j,H,ye,ie,xe,Ce,ee,se,_e,Me,re,ke,P,ue,te,fe,Q;function Y(){Ye=new dS(C),Ye.init(),te=new iy(C,Ye),rt=new iS(C,Ye,e,te),Se=new ty(C,Ye),rt.reversedDepthBuffer&&d&&Se.buffers.depth.setReversed(!0),y=new mS(C),g=new BM,I=new ny(C,Ye,Se,g,rt,te,y),X=new sS(v),j=new hS(v),H=new xv(C),fe=new tS(C,H),ye=new fS(C,H,y,fe),ie=new _S(C,ye,H,y),ke=new gS(C,rt,I),_e=new rS(g),xe=new zM(v,X,j,Ye,rt,fe,_e),Ce=new cy(v,g),ee=new GM,se=new qM(Ye),re=new eS(v,X,j,Se,ie,_,l),Me=new QM(v,ie,rt),Q=new uy(C,y,rt,Se),P=new nS(C,Ye,y),ue=new pS(C,Ye,y),y.programs=xe.programs,v.capabilities=rt,v.extensions=Ye,v.properties=g,v.renderLists=ee,v.shadowMap=Me,v.state=Se,v.info=y}Y(),S!==Zt&&(O=new xS(S,t.width,t.height,r,s));const ne=new ay(v,C);this.xr=ne,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const x=Ye.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Ye.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return Oe},this.setPixelRatio=function(x){x!==void 0&&(Oe=x,this.setSize(de,ze,!1))},this.getSize=function(x){return x.set(de,ze)},this.setSize=function(x,D,B=!0){if(ne.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}de=x,ze=D,t.width=Math.floor(x*Oe),t.height=Math.floor(D*Oe),B===!0&&(t.style.width=x+"px",t.style.height=D+"px"),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,x,D)},this.getDrawingBufferSize=function(x){return x.set(de*Oe,ze*Oe).floor()},this.setDrawingBufferSize=function(x,D,B){de=x,ze=D,Oe=B,t.width=Math.floor(x*B),t.height=Math.floor(D*B),this.setViewport(0,0,x,D)},this.setEffects=function(x){if(S===Zt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let D=0;D<x.length;D++)if(x[D].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(x||[])},this.getCurrentViewport=function(x){return x.copy(V)},this.getViewport=function(x){return x.copy(q)},this.setViewport=function(x,D,B,z){x.isVector4?q.set(x.x,x.y,x.z,x.w):q.set(x,D,B,z),Se.viewport(V.copy(q).multiplyScalar(Oe).round())},this.getScissor=function(x){return x.copy(J)},this.setScissor=function(x,D,B,z){x.isVector4?J.set(x.x,x.y,x.z,x.w):J.set(x,D,B,z),Se.scissor(W.copy(J).multiplyScalar(Oe).round())},this.getScissorTest=function(){return me},this.setScissorTest=function(x){Se.setScissorTest(me=x)},this.setOpaqueSort=function(x){ft=x},this.setTransparentSort=function(x){lt=x},this.getClearColor=function(x){return x.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor(...arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha(...arguments)},this.clear=function(x=!0,D=!0,B=!0){let z=0;if(x){let U=!1;if(F!==null){const oe=F.texture.format;U=m.has(oe)}if(U){const oe=F.texture.type,pe=f.has(oe),ce=re.getClearColor(),ge=re.getClearAlpha(),be=ce.r,Ae=ce.g,Te=ce.b;pe?(w[0]=be,w[1]=Ae,w[2]=Te,w[3]=ge,C.clearBufferuiv(C.COLOR,0,w)):(b[0]=be,b[1]=Ae,b[2]=Te,b[3]=ge,C.clearBufferiv(C.COLOR,0,b))}else z|=C.COLOR_BUFFER_BIT}D&&(z|=C.DEPTH_BUFFER_BIT),B&&(z|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Le,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Je,!1),re.dispose(),ee.dispose(),se.dispose(),g.dispose(),X.dispose(),j.dispose(),ie.dispose(),fe.dispose(),Q.dispose(),xe.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",rl),ne.removeEventListener("sessionend",sl),jn.stop()};function Le(x){x.preventDefault(),Gl("WebGLRenderer: Context Lost."),M=!0}function st(){Gl("WebGLRenderer: Context Restored."),M=!1;const x=y.autoReset,D=Me.enabled,B=Me.autoUpdate,z=Me.needsUpdate,U=Me.type;Y(),y.autoReset=x,Me.enabled=D,Me.autoUpdate=B,Me.needsUpdate=z,Me.type=U}function Je(x){We("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function cn(x){const D=x.target;D.removeEventListener("dispose",cn),xn(D)}function xn(x){hh(x),g.remove(x)}function hh(x){const D=g.get(x).programs;D!==void 0&&(D.forEach(function(B){xe.releaseProgram(B)}),x.isShaderMaterial&&xe.releaseShaderCache(x))}this.renderBufferDirect=function(x,D,B,z,U,oe){D===null&&(D=nt);const pe=U.isMesh&&U.matrixWorld.determinant()<0,ce=fh(x,D,B,z,U);Se.setMaterial(z,pe);let ge=B.index,be=1;if(z.wireframe===!0){if(ge=ye.getWireframeAttribute(B),ge===void 0)return;be=2}const Ae=B.drawRange,Te=B.attributes.position;let Be=Ae.start*be,tt=(Ae.start+Ae.count)*be;oe!==null&&(Be=Math.max(Be,oe.start*be),tt=Math.min(tt,(oe.start+oe.count)*be)),ge!==null?(Be=Math.max(Be,0),tt=Math.min(tt,ge.count)):Te!=null&&(Be=Math.max(Be,0),tt=Math.min(tt,Te.count));const mt=tt-Be;if(mt<0||mt===1/0)return;fe.setup(U,z,ce,B,ge);let gt,it=P;if(ge!==null&&(gt=H.get(ge),it=ue,it.setIndex(gt)),U.isMesh)z.wireframe===!0?(Se.setLineWidth(z.wireframeLinewidth*xt()),it.setMode(C.LINES)):it.setMode(C.TRIANGLES);else if(U.isLine){let we=z.linewidth;we===void 0&&(we=1),Se.setLineWidth(we*xt()),U.isLineSegments?it.setMode(C.LINES):U.isLineLoop?it.setMode(C.LINE_LOOP):it.setMode(C.LINE_STRIP)}else U.isPoints?it.setMode(C.POINTS):U.isSprite&&it.setMode(C.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Sr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),it.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ye.get("WEBGL_multi_draw"))it.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const we=U._multiDrawStarts,Qe=U._multiDrawCounts,qe=U._multiDrawCount,Ht=ge?H.get(ge).bytesPerElement:1,pi=g.get(z).currentProgram.getUniforms();for(let Wt=0;Wt<qe;Wt++)pi.setValue(C,"_gl_DrawID",Wt),it.render(we[Wt]/Ht,Qe[Wt])}else if(U.isInstancedMesh)it.renderInstances(Be,mt,U.count);else if(B.isInstancedBufferGeometry){const we=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Qe=Math.min(B.instanceCount,we);it.renderInstances(Be,mt,Qe)}else it.render(Be,mt)};function il(x,D,B){x.transparent===!0&&x.side===Tn&&x.forceSinglePass===!1?(x.side=Ft,x.needsUpdate=!0,Cr(x,D,B),x.side=Zn,x.needsUpdate=!0,Cr(x,D,B),x.side=Tn):Cr(x,D,B)}this.compile=function(x,D,B=null){B===null&&(B=x),T=se.get(B),T.init(D),R.push(T),B.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(T.pushLight(U),U.castShadow&&T.pushShadow(U))}),x!==B&&x.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(T.pushLight(U),U.castShadow&&T.pushShadow(U))}),T.setupLights();const z=new Set;return x.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const oe=U.material;if(oe)if(Array.isArray(oe))for(let pe=0;pe<oe.length;pe++){const ce=oe[pe];il(ce,B,U),z.add(ce)}else il(oe,B,U),z.add(oe)}),T=R.pop(),z},this.compileAsync=function(x,D,B=null){const z=this.compile(x,D,B);return new Promise(U=>{function oe(){if(z.forEach(function(pe){g.get(pe).currentProgram.isReady()&&z.delete(pe)}),z.size===0){U(x);return}setTimeout(oe,10)}Ye.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Os=null;function dh(x){Os&&Os(x)}function rl(){jn.stop()}function sl(){jn.start()}const jn=new ih;jn.setAnimationLoop(dh),typeof self<"u"&&jn.setContext(self),this.setAnimationLoop=function(x){Os=x,ne.setAnimationLoop(x),x===null?jn.stop():jn.start()},ne.addEventListener("sessionstart",rl),ne.addEventListener("sessionend",sl),this.render=function(x,D){if(D!==void 0&&D.isCamera!==!0){We("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;const B=ne.enabled===!0&&ne.isPresenting===!0,z=O!==null&&(F===null||B)&&O.begin(v,F);if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(D),D=ne.getCamera()),x.isScene===!0&&x.onBeforeRender(v,x,D,F),T=se.get(x,R.length),T.init(D),R.push(T),Tt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),De.setFromProjectionMatrix(Tt,pn,D.reversedDepth),Ze=this.localClippingEnabled,ve=_e.init(this.clippingPlanes,Ze),E=ee.get(x,A.length),E.init(),A.push(E),ne.enabled===!0&&ne.isPresenting===!0){const pe=v.xr.getDepthSensingMesh();pe!==null&&Fs(pe,D,-1/0,v.sortObjects)}Fs(x,D,0,v.sortObjects),E.finish(),v.sortObjects===!0&&E.sort(ft,lt),Fe=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,Fe&&re.addToRenderList(E,x),this.info.render.frame++,ve===!0&&_e.beginShadows();const U=T.state.shadowsArray;if(Me.render(U,x,D),ve===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset(),(z&&O.hasRenderPass())===!1){const pe=E.opaque,ce=E.transmissive;if(T.setupLights(),D.isArrayCamera){const ge=D.cameras;if(ce.length>0)for(let be=0,Ae=ge.length;be<Ae;be++){const Te=ge[be];al(pe,ce,x,Te)}Fe&&re.render(x);for(let be=0,Ae=ge.length;be<Ae;be++){const Te=ge[be];ol(E,x,Te,Te.viewport)}}else ce.length>0&&al(pe,ce,x,D),Fe&&re.render(x),ol(E,x,D)}F!==null&&k===0&&(I.updateMultisampleRenderTarget(F),I.updateRenderTargetMipmap(F)),z&&O.end(v),x.isScene===!0&&x.onAfterRender(v,x,D),fe.resetDefaultState(),G=-1,Z=null,R.pop(),R.length>0?(T=R[R.length-1],ve===!0&&_e.setGlobalState(v.clippingPlanes,T.state.camera)):T=null,A.pop(),A.length>0?E=A[A.length-1]:E=null};function Fs(x,D,B,z){if(x.visible===!1)return;if(x.layers.test(D.layers)){if(x.isGroup)B=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(D);else if(x.isLight)T.pushLight(x),x.castShadow&&T.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||De.intersectsSprite(x)){z&&Ke.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Tt);const pe=ie.update(x),ce=x.material;ce.visible&&E.push(x,pe,ce,B,Ke.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||De.intersectsObject(x))){const pe=ie.update(x),ce=x.material;if(z&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Ke.copy(x.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ke.copy(pe.boundingSphere.center)),Ke.applyMatrix4(x.matrixWorld).applyMatrix4(Tt)),Array.isArray(ce)){const ge=pe.groups;for(let be=0,Ae=ge.length;be<Ae;be++){const Te=ge[be],Be=ce[Te.materialIndex];Be&&Be.visible&&E.push(x,pe,Be,B,Ke.z,Te)}}else ce.visible&&E.push(x,pe,ce,B,Ke.z,null)}}const oe=x.children;for(let pe=0,ce=oe.length;pe<ce;pe++)Fs(oe[pe],D,B,z)}function ol(x,D,B,z){const{opaque:U,transmissive:oe,transparent:pe}=x;T.setupLightsView(B),ve===!0&&_e.setGlobalState(v.clippingPlanes,B),z&&Se.viewport(V.copy(z)),U.length>0&&Ar(U,D,B),oe.length>0&&Ar(oe,D,B),pe.length>0&&Ar(pe,D,B),Se.buffers.depth.setTest(!0),Se.buffers.depth.setMask(!0),Se.buffers.color.setMask(!0),Se.setPolygonOffset(!1)}function al(x,D,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[z.id]===void 0){const Be=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[z.id]=new gn(1,1,{generateMipmaps:!0,type:Be?Dn:Zt,minFilter:ui,samples:rt.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const oe=T.state.transmissionRenderTarget[z.id],pe=z.viewport||V;oe.setSize(pe.z*v.transmissionResolutionScale,pe.w*v.transmissionResolutionScale);const ce=v.getRenderTarget(),ge=v.getActiveCubeFace(),be=v.getActiveMipmapLevel();v.setRenderTarget(oe),v.getClearColor(he),ae=v.getClearAlpha(),ae<1&&v.setClearColor(16777215,.5),v.clear(),Fe&&re.render(B);const Ae=v.toneMapping;v.toneMapping=mn;const Te=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),T.setupLightsView(z),ve===!0&&_e.setGlobalState(v.clippingPlanes,z),Ar(x,B,z),I.updateMultisampleRenderTarget(oe),I.updateRenderTargetMipmap(oe),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let tt=0,mt=D.length;tt<mt;tt++){const gt=D[tt],{object:it,geometry:we,material:Qe,group:qe}=gt;if(Qe.side===Tn&&it.layers.test(z.layers)){const Ht=Qe.side;Qe.side=Ft,Qe.needsUpdate=!0,ll(it,B,z,we,Qe,qe),Qe.side=Ht,Qe.needsUpdate=!0,Be=!0}}Be===!0&&(I.updateMultisampleRenderTarget(oe),I.updateRenderTargetMipmap(oe))}v.setRenderTarget(ce,ge,be),v.setClearColor(he,ae),Te!==void 0&&(z.viewport=Te),v.toneMapping=Ae}function Ar(x,D,B){const z=D.isScene===!0?D.overrideMaterial:null;for(let U=0,oe=x.length;U<oe;U++){const pe=x[U],{object:ce,geometry:ge,group:be}=pe;let Ae=pe.material;Ae.allowOverride===!0&&z!==null&&(Ae=z),ce.layers.test(B.layers)&&ll(ce,D,B,ge,Ae,be)}}function ll(x,D,B,z,U,oe){x.onBeforeRender(v,D,B,z,U,oe),x.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),U.onBeforeRender(v,D,B,z,x,oe),U.transparent===!0&&U.side===Tn&&U.forceSinglePass===!1?(U.side=Ft,U.needsUpdate=!0,v.renderBufferDirect(B,D,z,U,x,oe),U.side=Zn,U.needsUpdate=!0,v.renderBufferDirect(B,D,z,U,x,oe),U.side=Tn):v.renderBufferDirect(B,D,z,U,x,oe),x.onAfterRender(v,D,B,z,U,oe)}function Cr(x,D,B){D.isScene!==!0&&(D=nt);const z=g.get(x),U=T.state.lights,oe=T.state.shadowsArray,pe=U.state.version,ce=xe.getParameters(x,U.state,oe,D,B),ge=xe.getProgramCacheKey(ce);let be=z.programs;z.environment=x.isMeshStandardMaterial?D.environment:null,z.fog=D.fog,z.envMap=(x.isMeshStandardMaterial?j:X).get(x.envMap||z.environment),z.envMapRotation=z.environment!==null&&x.envMap===null?D.environmentRotation:x.envMapRotation,be===void 0&&(x.addEventListener("dispose",cn),be=new Map,z.programs=be);let Ae=be.get(ge);if(Ae!==void 0){if(z.currentProgram===Ae&&z.lightsStateVersion===pe)return ul(x,ce),Ae}else ce.uniforms=xe.getUniforms(x),x.onBeforeCompile(ce,v),Ae=xe.acquireProgram(ce,ge),be.set(ge,Ae),z.uniforms=ce.uniforms;const Te=z.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Te.clippingPlanes=_e.uniform),ul(x,ce),z.needsLights=mh(x),z.lightsStateVersion=pe,z.needsLights&&(Te.ambientLightColor.value=U.state.ambient,Te.lightProbe.value=U.state.probe,Te.directionalLights.value=U.state.directional,Te.directionalLightShadows.value=U.state.directionalShadow,Te.spotLights.value=U.state.spot,Te.spotLightShadows.value=U.state.spotShadow,Te.rectAreaLights.value=U.state.rectArea,Te.ltc_1.value=U.state.rectAreaLTC1,Te.ltc_2.value=U.state.rectAreaLTC2,Te.pointLights.value=U.state.point,Te.pointLightShadows.value=U.state.pointShadow,Te.hemisphereLights.value=U.state.hemi,Te.directionalShadowMap.value=U.state.directionalShadowMap,Te.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Te.spotShadowMap.value=U.state.spotShadowMap,Te.spotLightMatrix.value=U.state.spotLightMatrix,Te.spotLightMap.value=U.state.spotLightMap,Te.pointShadowMap.value=U.state.pointShadowMap,Te.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=Ae,z.uniformsList=null,Ae}function cl(x){if(x.uniformsList===null){const D=x.currentProgram.getUniforms();x.uniformsList=hs.seqWithValue(D.seq,x.uniforms)}return x.uniformsList}function ul(x,D){const B=g.get(x);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.batchingColor=D.batchingColor,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.instancingMorph=D.instancingMorph,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function fh(x,D,B,z,U){D.isScene!==!0&&(D=nt),I.resetTextureUnits();const oe=D.fog,pe=z.isMeshStandardMaterial?D.environment:null,ce=F===null?v.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Wi,ge=(z.isMeshStandardMaterial?j:X).get(z.envMap||pe),be=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ae=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Te=!!B.morphAttributes.position,Be=!!B.morphAttributes.normal,tt=!!B.morphAttributes.color;let mt=mn;z.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(mt=v.toneMapping);const gt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,it=gt!==void 0?gt.length:0,we=g.get(z),Qe=T.state.lights;if(ve===!0&&(Ze===!0||x!==Z)){const Dt=x===Z&&z.id===G;_e.setState(z,x,Dt)}let qe=!1;z.version===we.__version?(we.needsLights&&we.lightsStateVersion!==Qe.state.version||we.outputColorSpace!==ce||U.isBatchedMesh&&we.batching===!1||!U.isBatchedMesh&&we.batching===!0||U.isBatchedMesh&&we.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&we.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&we.instancing===!1||!U.isInstancedMesh&&we.instancing===!0||U.isSkinnedMesh&&we.skinning===!1||!U.isSkinnedMesh&&we.skinning===!0||U.isInstancedMesh&&we.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&we.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&we.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&we.instancingMorph===!1&&U.morphTexture!==null||we.envMap!==ge||z.fog===!0&&we.fog!==oe||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==_e.numPlanes||we.numIntersection!==_e.numIntersection)||we.vertexAlphas!==be||we.vertexTangents!==Ae||we.morphTargets!==Te||we.morphNormals!==Be||we.morphColors!==tt||we.toneMapping!==mt||we.morphTargetsCount!==it)&&(qe=!0):(qe=!0,we.__version=z.version);let Ht=we.currentProgram;qe===!0&&(Ht=Cr(z,D,U));let pi=!1,Wt=!1,ji=!1;const ot=Ht.getUniforms(),zt=we.uniforms;if(Se.useProgram(Ht.program)&&(pi=!0,Wt=!0,ji=!0),z.id!==G&&(G=z.id,Wt=!0),pi||Z!==x){Se.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),ot.setValue(C,"projectionMatrix",x.projectionMatrix),ot.setValue(C,"viewMatrix",x.matrixWorldInverse);const Bt=ot.map.cameraPosition;Bt!==void 0&&Bt.setValue(C,He.setFromMatrixPosition(x.matrixWorld)),rt.logarithmicDepthBuffer&&ot.setValue(C,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ot.setValue(C,"isOrthographic",x.isOrthographicCamera===!0),Z!==x&&(Z=x,Wt=!0,ji=!0)}if(we.needsLights&&(Qe.state.directionalShadowMap.length>0&&ot.setValue(C,"directionalShadowMap",Qe.state.directionalShadowMap,I),Qe.state.spotShadowMap.length>0&&ot.setValue(C,"spotShadowMap",Qe.state.spotShadowMap,I),Qe.state.pointShadowMap.length>0&&ot.setValue(C,"pointShadowMap",Qe.state.pointShadowMap,I)),U.isSkinnedMesh){ot.setOptional(C,U,"bindMatrix"),ot.setOptional(C,U,"bindMatrixInverse");const Dt=U.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),ot.setValue(C,"boneTexture",Dt.boneTexture,I))}U.isBatchedMesh&&(ot.setOptional(C,U,"batchingTexture"),ot.setValue(C,"batchingTexture",U._matricesTexture,I),ot.setOptional(C,U,"batchingIdTexture"),ot.setValue(C,"batchingIdTexture",U._indirectTexture,I),ot.setOptional(C,U,"batchingColorTexture"),U._colorsTexture!==null&&ot.setValue(C,"batchingColorTexture",U._colorsTexture,I));const Yt=B.morphAttributes;if((Yt.position!==void 0||Yt.normal!==void 0||Yt.color!==void 0)&&ke.update(U,B,Ht),(Wt||we.receiveShadow!==U.receiveShadow)&&(we.receiveShadow=U.receiveShadow,ot.setValue(C,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(zt.envMap.value=ge,zt.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&D.environment!==null&&(zt.envMapIntensity.value=D.environmentIntensity),zt.dfgLUT!==void 0&&(zt.dfgLUT.value=dy()),Wt&&(ot.setValue(C,"toneMappingExposure",v.toneMappingExposure),we.needsLights&&ph(zt,ji),oe&&z.fog===!0&&Ce.refreshFogUniforms(zt,oe),Ce.refreshMaterialUniforms(zt,z,Oe,ze,T.state.transmissionRenderTarget[x.id]),hs.upload(C,cl(we),zt,I)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(hs.upload(C,cl(we),zt,I),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ot.setValue(C,"center",U.center),ot.setValue(C,"modelViewMatrix",U.modelViewMatrix),ot.setValue(C,"normalMatrix",U.normalMatrix),ot.setValue(C,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Dt=z.uniformsGroups;for(let Bt=0,ks=Dt.length;Bt<ks;Bt++){const Kn=Dt[Bt];Q.update(Kn,Ht),Q.bind(Kn,Ht)}}return Ht}function ph(x,D){x.ambientLightColor.needsUpdate=D,x.lightProbe.needsUpdate=D,x.directionalLights.needsUpdate=D,x.directionalLightShadows.needsUpdate=D,x.pointLights.needsUpdate=D,x.pointLightShadows.needsUpdate=D,x.spotLights.needsUpdate=D,x.spotLightShadows.needsUpdate=D,x.rectAreaLights.needsUpdate=D,x.hemisphereLights.needsUpdate=D}function mh(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(x,D,B){const z=g.get(x);z.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),g.get(x.texture).__webglTexture=D,g.get(x.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,D){const B=g.get(x);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0};const gh=C.createFramebuffer();this.setRenderTarget=function(x,D=0,B=0){F=x,L=D,k=B;let z=null,U=!1,oe=!1;if(x){const ce=g.get(x);if(ce.__useDefaultFramebuffer!==void 0){Se.bindFramebuffer(C.FRAMEBUFFER,ce.__webglFramebuffer),V.copy(x.viewport),W.copy(x.scissor),K=x.scissorTest,Se.viewport(V),Se.scissor(W),Se.setScissorTest(K),G=-1;return}else if(ce.__webglFramebuffer===void 0)I.setupRenderTarget(x);else if(ce.__hasExternalTextures)I.rebindTextures(x,g.get(x.texture).__webglTexture,g.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const Ae=x.depthTexture;if(ce.__boundDepthTexture!==Ae){if(Ae!==null&&g.has(Ae)&&(x.width!==Ae.image.width||x.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(x)}}const ge=x.texture;(ge.isData3DTexture||ge.isDataArrayTexture||ge.isCompressedArrayTexture)&&(oe=!0);const be=g.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(be[D])?z=be[D][B]:z=be[D],U=!0):x.samples>0&&I.useMultisampledRTT(x)===!1?z=g.get(x).__webglMultisampledFramebuffer:Array.isArray(be)?z=be[B]:z=be,V.copy(x.viewport),W.copy(x.scissor),K=x.scissorTest}else V.copy(q).multiplyScalar(Oe).floor(),W.copy(J).multiplyScalar(Oe).floor(),K=me;if(B!==0&&(z=gh),Se.bindFramebuffer(C.FRAMEBUFFER,z)&&Se.drawBuffers(x,z),Se.viewport(V),Se.scissor(W),Se.setScissorTest(K),U){const ce=g.get(x.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+D,ce.__webglTexture,B)}else if(oe){const ce=D;for(let ge=0;ge<x.textures.length;ge++){const be=g.get(x.textures[ge]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+ge,be.__webglTexture,B,ce)}}else if(x!==null&&B!==0){const ce=g.get(x.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ce.__webglTexture,B)}G=-1},this.readRenderTargetPixels=function(x,D,B,z,U,oe,pe,ce=0){if(!(x&&x.isWebGLRenderTarget)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=g.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&pe!==void 0&&(ge=ge[pe]),ge){Se.bindFramebuffer(C.FRAMEBUFFER,ge);try{const be=x.textures[ce],Ae=be.format,Te=be.type;if(!rt.textureFormatReadable(Ae)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(Te)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=x.width-z&&B>=0&&B<=x.height-U&&(x.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+ce),C.readPixels(D,B,z,U,te.convert(Ae),te.convert(Te),oe))}finally{const be=F!==null?g.get(F).__webglFramebuffer:null;Se.bindFramebuffer(C.FRAMEBUFFER,be)}}},this.readRenderTargetPixelsAsync=async function(x,D,B,z,U,oe,pe,ce=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=g.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&pe!==void 0&&(ge=ge[pe]),ge)if(D>=0&&D<=x.width-z&&B>=0&&B<=x.height-U){Se.bindFramebuffer(C.FRAMEBUFFER,ge);const be=x.textures[ce],Ae=be.format,Te=be.type;if(!rt.textureFormatReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Be=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Be),C.bufferData(C.PIXEL_PACK_BUFFER,oe.byteLength,C.STREAM_READ),x.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+ce),C.readPixels(D,B,z,U,te.convert(Ae),te.convert(Te),0);const tt=F!==null?g.get(F).__webglFramebuffer:null;Se.bindFramebuffer(C.FRAMEBUFFER,tt);const mt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await C_(C,mt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Be),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,oe),C.deleteBuffer(Be),C.deleteSync(mt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,D=null,B=0){const z=Math.pow(2,-B),U=Math.floor(x.image.width*z),oe=Math.floor(x.image.height*z),pe=D!==null?D.x:0,ce=D!==null?D.y:0;I.setTexture2D(x,0),C.copyTexSubImage2D(C.TEXTURE_2D,B,0,0,pe,ce,U,oe),Se.unbindTexture()};const _h=C.createFramebuffer(),vh=C.createFramebuffer();this.copyTextureToTexture=function(x,D,B=null,z=null,U=0,oe=null){oe===null&&(U!==0?(Sr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=U,U=0):oe=0);let pe,ce,ge,be,Ae,Te,Be,tt,mt;const gt=x.isCompressedTexture?x.mipmaps[oe]:x.image;if(B!==null)pe=B.max.x-B.min.x,ce=B.max.y-B.min.y,ge=B.isBox3?B.max.z-B.min.z:1,be=B.min.x,Ae=B.min.y,Te=B.isBox3?B.min.z:0;else{const Yt=Math.pow(2,-U);pe=Math.floor(gt.width*Yt),ce=Math.floor(gt.height*Yt),x.isDataArrayTexture?ge=gt.depth:x.isData3DTexture?ge=Math.floor(gt.depth*Yt):ge=1,be=0,Ae=0,Te=0}z!==null?(Be=z.x,tt=z.y,mt=z.z):(Be=0,tt=0,mt=0);const it=te.convert(D.format),we=te.convert(D.type);let Qe;D.isData3DTexture?(I.setTexture3D(D,0),Qe=C.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(I.setTexture2DArray(D,0),Qe=C.TEXTURE_2D_ARRAY):(I.setTexture2D(D,0),Qe=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,D.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,D.unpackAlignment);const qe=C.getParameter(C.UNPACK_ROW_LENGTH),Ht=C.getParameter(C.UNPACK_IMAGE_HEIGHT),pi=C.getParameter(C.UNPACK_SKIP_PIXELS),Wt=C.getParameter(C.UNPACK_SKIP_ROWS),ji=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,gt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,gt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,be),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ae),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Te);const ot=x.isDataArrayTexture||x.isData3DTexture,zt=D.isDataArrayTexture||D.isData3DTexture;if(x.isDepthTexture){const Yt=g.get(x),Dt=g.get(D),Bt=g.get(Yt.__renderTarget),ks=g.get(Dt.__renderTarget);Se.bindFramebuffer(C.READ_FRAMEBUFFER,Bt.__webglFramebuffer),Se.bindFramebuffer(C.DRAW_FRAMEBUFFER,ks.__webglFramebuffer);for(let Kn=0;Kn<ge;Kn++)ot&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,g.get(x).__webglTexture,U,Te+Kn),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,g.get(D).__webglTexture,oe,mt+Kn)),C.blitFramebuffer(be,Ae,pe,ce,Be,tt,pe,ce,C.DEPTH_BUFFER_BIT,C.NEAREST);Se.bindFramebuffer(C.READ_FRAMEBUFFER,null),Se.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(U!==0||x.isRenderTargetTexture||g.has(x)){const Yt=g.get(x),Dt=g.get(D);Se.bindFramebuffer(C.READ_FRAMEBUFFER,_h),Se.bindFramebuffer(C.DRAW_FRAMEBUFFER,vh);for(let Bt=0;Bt<ge;Bt++)ot?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Yt.__webglTexture,U,Te+Bt):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Yt.__webglTexture,U),zt?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Dt.__webglTexture,oe,mt+Bt):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Dt.__webglTexture,oe),U!==0?C.blitFramebuffer(be,Ae,pe,ce,Be,tt,pe,ce,C.COLOR_BUFFER_BIT,C.NEAREST):zt?C.copyTexSubImage3D(Qe,oe,Be,tt,mt+Bt,be,Ae,pe,ce):C.copyTexSubImage2D(Qe,oe,Be,tt,be,Ae,pe,ce);Se.bindFramebuffer(C.READ_FRAMEBUFFER,null),Se.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else zt?x.isDataTexture||x.isData3DTexture?C.texSubImage3D(Qe,oe,Be,tt,mt,pe,ce,ge,it,we,gt.data):D.isCompressedArrayTexture?C.compressedTexSubImage3D(Qe,oe,Be,tt,mt,pe,ce,ge,it,gt.data):C.texSubImage3D(Qe,oe,Be,tt,mt,pe,ce,ge,it,we,gt):x.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,oe,Be,tt,pe,ce,it,we,gt.data):x.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,oe,Be,tt,gt.width,gt.height,it,gt.data):C.texSubImage2D(C.TEXTURE_2D,oe,Be,tt,pe,ce,it,we,gt);C.pixelStorei(C.UNPACK_ROW_LENGTH,qe),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ht),C.pixelStorei(C.UNPACK_SKIP_PIXELS,pi),C.pixelStorei(C.UNPACK_SKIP_ROWS,Wt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,ji),oe===0&&D.generateMipmaps&&C.generateMipmap(Qe),Se.unbindTexture()},this.initRenderTarget=function(x){g.get(x).__webglFramebuffer===void 0&&I.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?I.setTextureCube(x,0):x.isData3DTexture?I.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?I.setTexture2DArray(x,0):I.setTexture2D(x,0),Se.unbindTexture()},this.resetState=function(){L=0,k=0,F=null,Se.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const py={"Northeast Region":"#1a5276","Southeast Region":"#196f3d","South Region":"#b9770e","Southern California":"#7d3c98","West Region":"#2874a6","Midwest Region":"#a04000"},my={"Northeast Region":{distance:180,lat:41,lon:-77},"Southeast Region":{distance:180,lat:30,lon:-84},"South Region":{distance:180,lat:31,lon:-98},"Southern California":{distance:180,lat:34,lon:-118},"West Region":{distance:180,lat:45,lon:-115},"Midwest Region":{distance:180,lat:43,lon:-90}},gy={distance:280,lat:39,lon:-98},_y=/^#[0-9a-fA-F]{6}$/;function wr(n){if(!_y.test(n))throw new Error(`Invalid hex color: "${n}". Expected format: #RRGGBB.`)}function vy(n){return wr(n),parseInt(n.replace("#",""),16)}function Re(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function To(n){try{const t=new URL(n,"https://placeholder.invalid").protocol.toLowerCase();return t==="https:"||t==="http:"||t==="mailto:"||t==="tel:"?Re(n):""}catch{return""}}const wo={light:"https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",dark:"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"};let Vn=null;class ds{map=null;marker=null;mapContainer=null;customStyleUrl;disposed=!1;markerClickHandler=null;markersSourceId="office-markers";markersLoaded=!1;pendingMarkers=[];currentStyle="light";styleGeneration=0;markerEventHandlers=[];constructor(e){this.customStyleUrl=e}async initialize(e,t){if(Vn||(Vn=await In(()=>import("./maplibre-gl-CX2frlnR.js").then(s=>s.m),[]),await In(()=>Promise.resolve({}),__vite__mapDeps([0]))),this.disposed)return;this.mapContainer=document.createElement("div"),this.mapContainer.style.width="100%",this.mapContainer.style.height="100%",e.appendChild(this.mapContainer),this.currentStyle=t.style??"light";const i=this.customStyleUrl??wo[this.currentStyle];this.map=new Vn.Map({container:this.mapContainer,style:i,center:[0,0],zoom:t.zoom,interactive:t.interactive,attributionControl:t.attributionControl?void 0:!1}),await new Promise((s,o)=>{if(!this.map){o(new Error("Map not initialized"));return}this.map.on("load",()=>s()),this.map.on("error",a=>o(a.error??a))}),this.map.on("error",s=>{console.warn("[MapLibre] Tile error:",s.error?.message??s)});const r=this.mapContainer.querySelector("canvas");r&&(r.addEventListener("webglcontextlost",s=>{s.preventDefault(),console.warn("[MapLibre] WebGL context lost, attempting recovery")}),r.addEventListener("webglcontextrestored",()=>{this.map?.triggerRepaint()}))}setLocation(e,t,i){if(!this.map||!Vn)return;this.map.setCenter([t,e]),this.marker&&(this.marker.remove(),this.marker=null);const r=document.createElement("div");r.className="minimap-marker";const s=document.createElement("div");s.className="minimap-marker-pin",s.style.backgroundColor=i?.color??"var(--color-primary, #00396c)",r.appendChild(s);const o=document.createElement("div");o.className="minimap-marker-shadow",r.appendChild(o),this.marker=new Vn.Marker({element:r,anchor:"bottom"}).setLngLat([t,e]).addTo(this.map)}flyTo(e,t,i){this.map&&(this.map.flyTo({center:[t,e],zoom:i?.zoom??this.map.getZoom(),duration:i?.duration??1500,essential:!0}),this.marker&&this.marker.setLngLat([t,e]))}updateMarkerStyle(e){if(!this.marker)return;const i=this.marker.getElement().querySelector(".minimap-marker-pin");i&&(i.style.backgroundColor=e.color)}resize(){this.map?.resize()}removeMarkerEventHandlers(){if(this.map){for(const{event:e,layer:t,handler:i}of this.markerEventHandlers)this.map.off(e,t,i);this.markerEventHandlers=[]}}dispose(){this.disposed||(this.disposed=!0,this.removeMarkerEventHandlers(),this.marker&&(this.marker.remove(),this.marker=null),this.map&&(this.map.remove(),this.map=null),this.mapContainer=null)}setMarkers(e){if(!this.map||!Vn)return;this.pendingMarkers=e;const t={type:"FeatureCollection",features:e.map(c=>({type:"Feature",geometry:{type:"Point",coordinates:[c.lon,c.lat]},properties:{officeCode:c.officeCode,label:c.label,color:c.color,regionName:c.regionName}}))};if(this.markersLoaded){for(const c of["clusters","cluster-count","unclustered-point"])this.map.getLayer(c)&&this.map.removeLayer(c);this.map.getSource(this.markersSourceId)&&this.map.removeSource(this.markersSourceId)}this.map.addSource(this.markersSourceId,{type:"geojson",data:t,promoteId:"officeCode",cluster:!0,clusterMaxZoom:14,clusterRadius:50}),this.map.addLayer({id:"clusters",type:"circle",source:this.markersSourceId,filter:["has","point_count"],paint:{"circle-color":["step",["get","point_count"],"#2a6db5",10,"#3580c8",30,"#4a90d9"],"circle-radius":["step",["get","point_count"],22,10,32,30,42],"circle-stroke-width":2,"circle-stroke-color":"#ffffff","circle-opacity":.9}}),this.map.addLayer({id:"cluster-count",type:"symbol",source:this.markersSourceId,filter:["has","point_count"],layout:{"text-field":"{point_count_abbreviated}","text-size":13,"text-font":["Open Sans Bold","Arial Unicode MS Bold"]},paint:{"text-color":"#ffffff","text-halo-color":"rgba(0, 0, 0, 0.3)","text-halo-width":1}}),this.map.addLayer({id:"unclustered-point",type:"circle",source:this.markersSourceId,filter:["!",["has","point_count"]],paint:{"circle-color":"#0066cc","circle-radius":9,"circle-stroke-width":2.5,"circle-stroke-color":"#ffffff","circle-opacity":["case",["boolean",["feature-state","dimmed"],!1],.4,1]}}),this.removeMarkerEventHandlers();const i=c=>{const h=c.features?.[0]?.properties?.officeCode;typeof h=="string"&&this.markerClickHandler&&this.markerClickHandler(h)};this.map.on("click","unclustered-point",i),this.markerEventHandlers.push({event:"click",layer:"unclustered-point",handler:i});const r=async c=>{const u=c.features?.[0];if(!u||!this.map)return;const h=this.map.getSource(this.markersSourceId);if(h&&"getClusterExpansionZoom"in h)try{const d=await h.getClusterExpansionZoom(u.properties?.cluster_id);if(d==null||!this.map)return;const p=u.geometry.coordinates;this.map.easeTo({center:[p[0],p[1]],zoom:d})}catch{}};this.map.on("click","clusters",r),this.markerEventHandlers.push({event:"click",layer:"clusters",handler:r});const s=()=>{this.map&&(this.map.getCanvas().style.cursor="pointer")},o=()=>{this.map&&(this.map.getCanvas().style.cursor="")},a=()=>{this.map&&(this.map.getCanvas().style.cursor="pointer")},l=()=>{this.map&&(this.map.getCanvas().style.cursor="")};this.map.on("mouseenter","unclustered-point",s),this.map.on("mouseleave","unclustered-point",o),this.map.on("mouseenter","clusters",a),this.map.on("mouseleave","clusters",l),this.markerEventHandlers.push({event:"mouseenter",layer:"unclustered-point",handler:s},{event:"mouseleave",layer:"unclustered-point",handler:o},{event:"mouseenter",layer:"clusters",handler:a},{event:"mouseleave",layer:"clusters",handler:l}),this.markersLoaded=!0}updateMarkerStates(e){if(!(!this.map||!this.markersLoaded||!this.map.getSource(this.markersSourceId)))for(const i of e)this.map.setFeatureState({source:this.markersSourceId,id:i.officeCode},{dimmed:i.dimmed,selected:i.selected,highlighted:i.highlighted})}fitBounds(e,t=50,i=10){if(!this.map||!Vn||e.length===0)return;const r=new Vn.LngLatBounds;for(const s of e)r.extend([s.lon,s.lat]);this.map.fitBounds(r,{padding:t,maxZoom:i,duration:1e3})}onMarkerClick(e){this.markerClickHandler=e}setStyle(e){if(!this.map||this.disposed||e===this.currentStyle)return;this.currentStyle=e;const t=this.customStyleUrl??wo[e];this.markersLoaded=!1,this.removeMarkerEventHandlers();const i=++this.styleGeneration;this.map.setStyle(t);const r=e==="dark"?"light":"dark",s=()=>{this.disposed||!this.map||i!==this.styleGeneration||this.pendingMarkers.length>0&&this.setMarkers(this.pendingMarkers)},o=l=>{if(this.map?.off("style.load",a),this.disposed||!this.map||i!==this.styleGeneration||this.map.isStyleLoaded())return;console.warn("[MapLibre] Style load failed, reverting to",r,l.error?.message),this.currentStyle=r;const c=this.customStyleUrl??wo[r];this.map.setStyle(c),this.map.once("style.load",s)},a=()=>{this.map?.off("error",o),s()};this.map.once("style.load",a),this.map.once("error",o)}getMapElement(){if(!this.mapContainer)throw new Error("Map not initialized. Call initialize() first.");return this.mapContainer}}const xy="https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";let rr=null;function Sy(){return typeof window<"u"&&window.mapkit?Promise.resolve():rr||(rr=new Promise((n,e)=>{const t=document.createElement("script");t.src=xy,t.onload=()=>n(),t.onerror=()=>{rr=null,e(new Error("Failed to load Apple MapKit JS from CDN"))},document.head.appendChild(t)}),rr)}function My(){return window.mapkit??null}let Oc=!1;class yy{mk=null;map=null;marker=null;mapContainer=null;token;disposed=!1;selectHandler=null;constructor(e){this.token=e}async initialize(e,t){if(await Sy(),this.disposed)return;if(this.mk=My(),!this.mk)throw new Error("Apple MapKit JS failed to initialize");Oc||(this.mk.init({authorizationCallback:r=>{r(this.token)}}),Oc=!0),this.mapContainer=document.createElement("div"),this.mapContainer.style.width="100%",this.mapContainer.style.height="100%",e.appendChild(this.mapContainer);const i=t.style==="dark"?this.mk.Map.ColorScheme?.Dark??"dark":this.mk.Map.ColorScheme?.Light??"light";this.map=new this.mk.Map(this.mapContainer,{center:new this.mk.Coordinate(0,0),showsCompass:"hidden",isZoomEnabled:t.interactive,isScrollEnabled:t.interactive,isRotateEnabled:!1,showsMapTypeControl:!1,colorScheme:i})}setLocation(e,t,i){if(!this.map||!this.mk)return;const r=new this.mk.Coordinate(e,t);this.map.setCenterAnimated(r,!1),this.marker&&(this.map.removeAnnotation(this.marker),this.marker=null),this.marker=new this.mk.MarkerAnnotation(r,{color:i?.color??"#00396c",glyphColor:"#ffffff",title:i?.label??""}),this.map.addAnnotation(this.marker)}flyTo(e,t,i){if(!this.map||!this.mk)return;const r=new this.mk.Coordinate(e,t),s=this.zoomToSpan(i?.zoom??15),o=new this.mk.CoordinateSpan(s,s),a=new this.mk.CoordinateRegion(r,o);this.map.setRegionAnimated(a,!0),this.marker&&(this.marker.coordinate=r)}updateMarkerStyle(e){this.marker&&(this.marker.color=e.color)}resize(){}dispose(){this.disposed||(this.disposed=!0,this.map&&(this.selectHandler&&(this.map.removeEventListener("select",this.selectHandler),this.selectHandler=null),this.map.destroy(),this.map=null),this.marker=null,this.mk=null,this.mapContainer&&(this.mapContainer.remove(),this.mapContainer=null))}setMarkers(e){if(!this.map||!this.mk)return;this.map.annotations?.length>0&&(this.map.removeAnnotations(this.map.annotations),this.marker=null);const t=e.map(i=>{const r=new this.mk.Coordinate(i.lat,i.lon);return new this.mk.MarkerAnnotation(r,{color:i.color,title:i.label,glyphColor:"#ffffff",data:{officeCode:i.officeCode}})});this.map.addAnnotations(t)}updateMarkerStates(e){}fitBounds(e,t=50,i=10){if(!this.map||!this.mk||e.length===0)return;const r=e.map(m=>m.lat),s=e.map(m=>m.lon),o=Math.min(...r),a=Math.max(...r),l=Math.min(...s),c=Math.max(...s),u=new this.mk.Coordinate((o+a)/2,(l+c)/2),h=this.zoomToSpan(i),d=Math.max((a-o)*1.2,h),p=Math.max((c-l)*1.2,h),_=new this.mk.CoordinateSpan(d,p),S=new this.mk.CoordinateRegion(u,_);this.map.setRegionAnimated(S,!0)}onMarkerClick(e){this.map&&(this.selectHandler&&this.map.removeEventListener("select",this.selectHandler),this.selectHandler=t=>{const i=t.annotation?.data?.officeCode;i&&e(i)},this.map.addEventListener("select",this.selectHandler))}setStyle(e){!this.map||!this.mk||this.disposed||(this.map.colorScheme=e==="dark"?this.mk.Map.ColorScheme?.Dark??"dark":this.mk.Map.ColorScheme?.Light??"light")}getMapElement(){if(!this.mapContainer)throw new Error("Map not initialized. Call initialize() first.");return this.mapContainer}zoomToSpan(e){return 360/Math.pow(2,e)}}const Ey="https://maps.googleapis.com/maps/api/js";let sr=null;function by(n){return typeof window<"u"&&window.google&&window.google.maps?Promise.resolve():sr||(sr=new Promise((e,t)=>{const i="__oddMapGoogleInit";window[i]=()=>{delete window[i],e()};const r=document.createElement("script");r.src=`${Ey}?key=${encodeURIComponent(n)}&callback=${i}&v=weekly`,r.async=!0,r.defer=!0,r.onerror=()=>{delete window[i],sr=null,t(new Error("Failed to load Google Maps JS API from CDN"))},document.head.appendChild(r)}),sr)}function Ty(){return window.google?.maps??null}class wy{gm=null;map=null;marker=null;markers=[];mapContainer=null;apiKey;disposed=!1;markerClickHandler=null;eventListeners=[];constructor(e){this.apiKey=e}async initialize(e,t){if(await by(this.apiKey),this.disposed)return;if(this.gm=Ty(),!this.gm)throw new Error("Google Maps JS API failed to initialize");this.mapContainer=document.createElement("div"),this.mapContainer.style.width="100%",this.mapContainer.style.height="100%",e.appendChild(this.mapContainer);const i=t.style==="dark"?"DEMO_MAP_ID":void 0;this.map=new this.gm.Map(this.mapContainer,{center:{lat:0,lng:0},zoom:t.zoom,disableDefaultUI:!0,zoomControl:t.interactive,scrollwheel:t.interactive,draggable:t.interactive,mapTypeControl:!1,streetViewControl:!1,fullscreenControl:!1,mapId:i,colorScheme:t.style==="dark"?"DARK":"LIGHT"})}setLocation(e,t,i){if(!(!this.map||!this.gm))if(this.map.setCenter({lat:e,lng:t}),this.marker&&(this.marker.setMap(null),this.marker=null),this.gm.marker?.AdvancedMarkerElement){const r=document.createElement("div");r.style.width="24px",r.style.height="24px",r.style.borderRadius="50%",r.style.backgroundColor=i?.color??"#00396c",r.style.border="3px solid #ffffff",r.style.boxShadow="0 2px 6px rgba(0,0,0,0.3)",this.marker=new this.gm.marker.AdvancedMarkerElement({map:this.map,position:{lat:e,lng:t},content:r,title:i?.label??""})}else this.marker=new this.gm.Marker({map:this.map,position:{lat:e,lng:t},title:i?.label??""})}flyTo(e,t,i){!this.map||!this.gm||(this.map.panTo({lat:e,lng:t}),i?.zoom!=null&&this.map.setZoom(i.zoom),this.marker&&(this.marker.position!==void 0&&typeof this.marker.position=="object"?this.marker.position={lat:e,lng:t}:typeof this.marker.setPosition=="function"&&this.marker.setPosition({lat:e,lng:t})))}updateMarkerStyle(e){if(!this.marker)return;const t=this.marker.content;t instanceof HTMLElement&&(t.style.backgroundColor=e.color)}resize(){!this.map||!this.gm||this.gm.event.trigger(this.map,"resize")}dispose(){if(!this.disposed){this.disposed=!0;for(const e of this.eventListeners)typeof e=="object"&&e!==null&&"remove"in e?e.remove():this.gm?.event?.removeListener&&this.gm.event.removeListener(e);this.eventListeners=[],this.marker&&(this.marker.setMap?.(null),this.marker=null);for(const e of this.markers)e.setMap?.(null);this.markers=[],this.map=null,this.gm=null,this.mapContainer&&(this.mapContainer.remove(),this.mapContainer=null)}}setMarkers(e){if(!(!this.map||!this.gm)){for(const t of this.markers)t.setMap?.(null);this.markers=[];for(const t of this.eventListeners)typeof t=="object"&&t!==null&&"remove"in t?t.remove():this.gm?.event?.removeListener&&this.gm.event.removeListener(t);this.eventListeners=[],this.marker&&(this.marker.setMap?.(null),this.marker=null);for(const t of e){const i={lat:t.lat,lng:t.lon};if(this.gm.marker?.AdvancedMarkerElement){const r=document.createElement("div");r.style.width="18px",r.style.height="18px",r.style.borderRadius="50%",r.style.backgroundColor=t.color||"#0066cc",r.style.border="2.5px solid #ffffff",r.style.boxShadow="0 2px 4px rgba(0,0,0,0.3)",r.style.cursor="pointer";const s=new this.gm.marker.AdvancedMarkerElement({map:this.map,position:i,content:r,title:t.label}),o=s.addListener("click",()=>{this.markerClickHandler&&this.markerClickHandler(t.officeCode)});this.eventListeners.push(o),this.markers.push(s)}else{const r=new this.gm.Marker({map:this.map,position:i,title:t.label}),s=this.gm.event.addListener(r,"click",()=>{this.markerClickHandler&&this.markerClickHandler(t.officeCode)});this.eventListeners.push(s),this.markers.push(r)}}}}updateMarkerStates(e){}fitBounds(e,t=50,i=10){if(!this.map||!this.gm||e.length===0)return;const r=new this.gm.LatLngBounds;for(const o of e)r.extend({lat:o.lat,lng:o.lon});this.map.fitBounds(r,t);const s=this.gm.event.addListenerOnce(this.map,"idle",()=>{this.map&&this.map.getZoom()>i&&this.map.setZoom(i)});this.eventListeners.push(s)}onMarkerClick(e){this.markerClickHandler=e}setStyle(e){if(!(!this.map||!this.gm||this.disposed))try{this.map.setOptions({colorScheme:e==="dark"?"DARK":"LIGHT"})}catch{}}getMapElement(){if(!this.mapContainer)throw new Error("Map not initialized. Call initialize() first.");return this.mapContainer}}const Ay={provider:"maplibre"};function lh(n){const e=n??Ay;return e.provider==="apple"?e.appleMapToken?new yy(e.appleMapToken):(console.warn("[map-provider] Apple Maps provider requested but no appleMapToken provided. Falling back to MapLibre."),new ds(e.tileStyleUrl)):e.provider==="google"?e.googleMapsApiKey?new wy(e.googleMapsApiKey):(console.warn("[map-provider] Google Maps provider requested but no googleMapsApiKey provided. Falling back to MapLibre."),new ds(e.tileStyleUrl)):new ds(e.tileStyleUrl)}function Cy(n){return lh(n)}class Ry{backdrop;dialog;mapContainer;closeBtn;onClose;previouslyFocused=null;handleKeydown;handleBackdropClick;constructor(e){this.onClose=e.onClose,this.previouslyFocused=document.activeElement,this.backdrop=document.createElement("div"),this.backdrop.className="map-expand-overlay",this.backdrop.setAttribute("aria-hidden","true"),this.dialog=document.createElement("div"),this.dialog.className="map-expand-dialog",this.dialog.setAttribute("role","dialog"),this.dialog.setAttribute("aria-modal","true"),this.dialog.setAttribute("aria-label","Expanded map view"),this.mapContainer=document.createElement("div"),this.mapContainer.className="map-expand-content",this.closeBtn=document.createElement("button"),this.closeBtn.className="map-expand-close-btn",this.closeBtn.setAttribute("aria-label","Close expanded map"),this.closeBtn.type="button",this.closeBtn.innerHTML=`
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    `,this.dialog.appendChild(this.closeBtn),this.dialog.appendChild(this.mapContainer),document.body.appendChild(this.backdrop),document.body.appendChild(this.dialog),requestAnimationFrame(()=>{this.backdrop.classList.add("visible"),this.dialog.classList.add("visible")}),this.handleKeydown=t=>{if(t.key==="Escape"&&(t.preventDefault(),t.stopPropagation(),this.close()),t.key==="Tab"){const i=this.dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');if(i.length===0)return;const r=i[0],s=i[i.length-1];t.shiftKey&&document.activeElement===r?(t.preventDefault(),s.focus()):!t.shiftKey&&document.activeElement===s&&(t.preventDefault(),r.focus())}},this.handleBackdropClick=t=>{t.target===this.backdrop&&this.close()},document.addEventListener("keydown",this.handleKeydown),this.backdrop.addEventListener("click",this.handleBackdropClick),this.closeBtn.addEventListener("click",()=>this.close()),requestAnimationFrame(()=>this.closeBtn.focus())}setMapElement(e){this.mapContainer.appendChild(e)}close(){this.onClose(),document.removeEventListener("keydown",this.handleKeydown),this.backdrop.removeEventListener("click",this.handleBackdropClick),this.backdrop.classList.remove("visible"),this.dialog.classList.remove("visible"),setTimeout(()=>{this.backdrop.remove(),this.dialog.remove(),this.previouslyFocused?.focus&&this.previouslyFocused.focus()},200)}}class ch{provider=null;container;mapWrapper;expandBtn;overlay=null;currentOfficeCode=null;lastOffice=null;lastBrandColor="#00396c";tileStyle;initializing=!1;disposed=!1;resizeObserver=null;contextLostHandler=null;constructor(e){this.container=e,this.tileStyle=Ss().defaultTileStyle,this.mapWrapper=document.createElement("div"),this.mapWrapper.className="mini-map-wrapper",this.container.appendChild(this.mapWrapper),this.expandBtn=document.createElement("button"),this.expandBtn.className="mini-map-expand-btn",this.expandBtn.setAttribute("aria-label","Expand map"),this.expandBtn.title="Expand map",this.expandBtn.innerHTML=`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 3 21 3 21 9"></polyline>
        <polyline points="9 21 3 21 3 15"></polyline>
        <line x1="21" y1="3" x2="14" y2="10"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      </svg>
    `,this.container.appendChild(this.expandBtn),this.expandBtn.addEventListener("click",()=>this.expand())}async show(e,t){if(this.disposed||this.currentOfficeCode===e.officeCode&&this.provider)return;const{lat:i,lon:r}=e.coordinates;if(this.provider&&this.currentOfficeCode!==null){this.currentOfficeCode=e.officeCode,this.lastOffice=e,this.provider.flyTo(i,r,{duration:1e3});return}if(!this.initializing){this.initializing=!0;try{const s=Ss();if(this.provider=lh(s),await this.provider.initialize(this.mapWrapper,{zoom:s.defaultZoom,interactive:!0,attributionControl:!0,style:this.tileStyle}),this.disposed){this.provider?.dispose(),this.provider=null;return}this.provider.setLocation(i,r,{color:t}),this.currentOfficeCode=e.officeCode,this.lastOffice=e,this.lastBrandColor=t,this.setupResizeObserver(),this.setupContextLostHandler()}catch(s){console.error("[mini-map] Failed to initialize map provider:",s),this.provider?.dispose(),this.provider=null,this.showFallback()}finally{this.initializing=!1}}}flyTo(e){if(!this.provider||this.disposed)return;const{lat:t,lon:i}=e.coordinates;this.currentOfficeCode=e.officeCode,this.lastOffice=e,this.provider.flyTo(t,i,{duration:1e3})}expand(){if(!this.provider||this.disposed)return;const e=this.provider.getMapElement();this.overlay=new Ry({onClose:()=>{this.mapWrapper.appendChild(e),this.provider?.resize(),this.overlay=null}}),this.overlay.setMapElement(e),this.provider.resize()}dispose(){this.disposed||(this.disposed=!0,this.overlay&&(this.overlay.close(),this.overlay=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.contextLostHandler&&(this.mapWrapper.querySelector("canvas")?.removeEventListener("webglcontextlost",this.contextLostHandler),this.contextLostHandler=null),this.provider&&(this.provider.dispose(),this.provider=null),this.currentOfficeCode=null,this.container.innerHTML="")}setupContextLostHandler(){if(this.contextLostHandler)return;const e=this.mapWrapper.querySelector("canvas");e&&(this.contextLostHandler=()=>{this.disposed||!this.lastOffice||(console.warn("[mini-map] WebGL context lost, reinitializing map"),this.provider&&(this.provider.dispose(),this.provider=null),this.currentOfficeCode=null,this.mapWrapper.innerHTML=`
        <div class="mini-map-fallback">
          <p>Reloading map...</p>
        </div>
      `,setTimeout(()=>{this.disposed||!this.lastOffice||(this.mapWrapper.innerHTML="",this.initializing=!1,this.contextLostHandler=null,this.show(this.lastOffice,this.lastBrandColor))},300))},e.addEventListener("webglcontextlost",this.contextLostHandler))}setupResizeObserver(){if(!(this.resizeObserver||!this.provider))try{this.resizeObserver=new ResizeObserver(()=>{this.provider?.resize()}),this.resizeObserver.observe(this.container)}catch{}}setTileStyle(e){this.tileStyle=e,this.provider?.setStyle&&this.provider.setStyle(e)}showFallback(){this.mapWrapper.innerHTML=`
      <div class="mini-map-fallback">
        <p>Map unavailable</p>
        <p class="mini-map-fallback-hint">Check your internet connection</p>
      </div>
    `}}class Py{constructor(){this.modal=null,this.overlay=null,this.miniMap=null,this.focusableElements=[],this.previouslyFocused=null,this.isOpen=!1,this.handleKeydown=this.handleKeydown.bind(this),this.handleClickOutside=this.handleClickOutside.bind(this)}show(e,t){this.isOpen&&this.close(),this.previouslyFocused=document.activeElement,this.createModal(e,t),this.isOpen=!0,document.addEventListener("keydown",this.handleKeydown),requestAnimationFrame(()=>{this.updateFocusableElements(),this.focusableElements.length>0&&this.focusableElements[0].focus()})}createModal(e,t){this.overlay=document.createElement("div"),this.overlay.className="office-modal-overlay",this.overlay.setAttribute("aria-hidden","true"),this.overlay.addEventListener("click",this.handleClickOutside),this.modal=document.createElement("div"),this.modal.className="office-modal",this.modal.setAttribute("role","dialog"),this.modal.setAttribute("aria-modal","true"),this.modal.setAttribute("aria-labelledby","office-modal-title");const i=this.buildDirectionsUrl(e);if(this.modal.innerHTML=`
            <div class="office-modal-header">
                <h2 id="office-modal-title">${Re(e.city)}, ${Re(e.state)}</h2>
                <button 
                    class="office-modal-close" 
                    aria-label="Close modal"
                    type="button"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="office-modal-body">
                <div class="office-modal-info">
                    <p class="office-type">${Re(e.officeType||"Office")}</p>
                    ${e.address?`
                        <p class="office-address">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${Re(e.address)}
                        </p>
                    `:""}
                    ${t?.personnel?.[0]?`
                        <div class="office-contact">
                            <p class="contact-name">${Re(t.personnel[0].name)}</p>
                            <p class="contact-title">${Re(t.personnel[0].title)}</p>
                            ${t.personnel[0].phone?`
                                <p class="contact-phone">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                    <a href="tel:${Re(t.personnel[0].phone)}">${Re(t.personnel[0].phone)}</a>
                                </p>
                            `:""}
                            ${t.personnel[0].email?`
                                <p class="contact-email">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                    <a href="mailto:${Re(t.personnel[0].email)}">${Re(t.personnel[0].email)}</a>
                                </p>
                            `:""}
                        </div>
                    `:""}
                </div>
                <div class="mini-map-container" id="modal-mini-map"></div>
            </div>
            <div class="office-modal-footer">
                <a 
                    href="${i}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn btn-primary directions-btn"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                    </svg>
                    Get Directions
                </a>
            </div>
        `,this.modal.querySelector(".office-modal-close").addEventListener("click",()=>this.close()),document.body.appendChild(this.overlay),document.body.appendChild(this.modal),requestAnimationFrame(()=>{this.overlay.classList.add("visible"),this.modal.classList.add("visible")}),e.coordinates?.lat&&e.coordinates?.lon){const s=this.modal.querySelector("#modal-mini-map");if(s){const o=getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()||"#00396c";this.miniMap=new ch(s),this.miniMap.show(e,o)}}}buildDirectionsUrl(e){return e.coordinates?.lat&&e.coordinates?.lon?`https://www.google.com/maps/dir/?api=1&destination=${e.coordinates.lat},${e.coordinates.lon}`:e.address?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.address)}`:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.city+", "+e.state)}`}updateFocusableElements(){if(!this.modal)return;const e=["button:not([disabled])","a[href]","input:not([disabled])","textarea:not([disabled])","select:not([disabled])",'[tabindex]:not([tabindex="-1"])'];this.focusableElements=Array.from(this.modal.querySelectorAll(e.join(",")))}handleKeydown(e){if(this.isOpen){if(e.key==="Escape"){e.preventDefault(),this.close();return}if(e.key==="Tab"){if(this.updateFocusableElements(),this.focusableElements.length===0)return;const t=this.focusableElements[0],i=this.focusableElements[this.focusableElements.length-1];e.shiftKey&&document.activeElement===t?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),t.focus())}}}handleClickOutside(e){e.target===this.overlay&&this.close()}close(){this.isOpen&&(this.isOpen=!1,document.removeEventListener("keydown",this.handleKeydown),this.modal&&this.modal.classList.remove("visible"),this.overlay&&this.overlay.classList.remove("visible"),setTimeout(()=>{this.miniMap&&(this.miniMap.dispose(),this.miniMap=null),this.modal?.parentNode&&this.modal.parentNode.removeChild(this.modal),this.overlay?.parentNode&&this.overlay.parentNode.removeChild(this.overlay),this.modal=null,this.overlay=null,this.previouslyFocused&&this.previouslyFocused.focus&&this.previouslyFocused.focus()},200))}}let Li=null;function Ly(n,e){return Li||(Li=new Py),Li.show(n,e),Li}function Fc(){Li&&Li.close()}const hr=100,kc=64,Iy=1.15,Dy=.05,Uy=.005,Ny=5;function Oy(n){const e=Math.sign(n);return e===0?0:-e*Dy}function Fy(n){return n===0?0:-n*Uy}const ky=.25,zy=.15;function By(n,e){return n?e<ky:e<zy}function Vy(){const n=an(),e={...py,...n.theme?.regionColors},t={};for(const[i,r]of Object.entries(e))try{t[i]=vy(r)}catch{console.warn(`Invalid color for region "${i}": "${r}". Using default.`),t[i]=4890367}return t}function Ao(){const n=an();return{USA:gy,...my,...n.theme?.cameraViews}}const Gy=86,Hy=.15;function Ra(n,e,t=hr){const i=n*(Math.PI/180),r=e*(Math.PI/180);return{x:t*Math.cos(i)*Math.sin(r),y:t*Math.sin(i),z:t*Math.cos(i)*Math.cos(r)}}function zc(n,e,t){const i=Ra(n,e,t);return new N(i.x,i.y,i.z)}function Wy(n){let e=0,t=0,i=0;return n.forEach(r=>{r.coordinates&&(e+=r.coordinates.lat,t+=r.coordinates.lon,i++)}),i===0?null:{lat:e/i,lon:t/i}}class $y{constructor(e,t={}){this.container=e,this.options={onRegionClick:t.onRegionClick||(()=>{}),onOfficeClick:t.onOfficeClick||(()=>{}),onReset:t.onReset||(()=>{})},this.scene=null,this.camera=null,this.renderer=null,this.raycaster=new _v,this.mouse=new Xe,this.animationFrameId=null,this.globeGroup=null,this.markerGroup=null,this.regionOverlayGroup=null,this.staticGroup=null,this.earthMesh=null,this.atmosphere=null,this.markerMeshes=new Map,this.regionHalos=new Map,this.selectedRegion=null,this.selectedOffice=null,this.hoveredMesh=null,this.animating=!1,this.autoRotate=!1,this.userWantsAutoRotate=!1,this.rotationSpeed=5e-4,this._boundOnResize=null,this._boundOnPointerMove=null,this._boundOnClick=null,this._boundOnWheel=null,this.isDragging=!1,this.wasDragging=!1,this.dragStartX=null,this.dragStartY=null,this.previousX=null,this.autoRotateWasEnabled=!1,this._boundPointerDown=null,this._boundPointerMove=null,this._boundPointerUp=null,this._tempVectors={worldPos:new N,toMarker:new N,cameraDir:new N,normalizedWorldPos:new N},this._lastExpensiveUpdate=0,this._expensiveUpdateInterval=250,this._resizeTimeout=null,this._cachedHalos=null,this.tooltip=null,this.init()}async init(){this.scene=new Q_,this.scene.background=new Ge(661032),this.globeGroup=new wn,this.globeGroup.name="globeGroup",this.scene.add(this.globeGroup),this.markerGroup=new wn,this.markerGroup.name="markerGroup",this.globeGroup.add(this.markerGroup),this.regionOverlayGroup=new wn,this.regionOverlayGroup.name="regionOverlayGroup",this.globeGroup.add(this.regionOverlayGroup),this.staticGroup=new wn,this.staticGroup.name="staticGroup",this.scene.add(this.staticGroup);const e=this.container.clientWidth/this.container.clientHeight;this.camera=new Jt(45,e,1,2e3);const i=Ao().USA,r=zc(i.lat,i.lon,i.distance);this.camera.position.copy(r),this.camera.lookAt(0,0,0),this.renderer=new fy({antialias:!0}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.container.appendChild(this.renderer.domElement),this.createLighting(),this.createEarth(),this.createAtmosphere(),this.createStars(),this.createRegionHalos(),this.createMarkers(),this.createTooltip(),this.setupEventListeners(),this.animate()}createLighting(){const e=new mv(16777215,.4);this.staticGroup.add(e);const t=new cc(16777215,1);t.position.set(200,100,150),this.staticGroup.add(t);const i=new cc(5089023,.3);i.position.set(-100,50,-100),this.staticGroup.add(i)}createEarth(){const e=new ai(hr,kc,kc),i=new dv().load("/odd-map/textures/earth-day.jpg");i.wrapS=gr,i.wrapT=gr,i.offset.x=Gy/360,i.offset.y=Hy;const r=new go({map:i,bumpScale:.5,shininess:10,specular:new Ge(3355443)});this.earthMesh=new Ot(e,r),this.earthMesh.name="earth",this.earthMesh.userData={type:"earth"},this.globeGroup.add(this.earthMesh)}createAtmosphere(){const e=new ai(hr*Iy,64,64),t=new ln({vertexShader:`
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,blending:Do,side:Ft,transparent:!0});this.atmosphere=new Ot(e,t),this.atmosphere.name="atmosphere",this.atmosphere.userData={type:"decoration"},this.globeGroup.add(this.atmosphere)}createStars(){const e=new qt,t=1e3,i=new Float32Array(t*3);for(let o=0;o<t*3;o+=3){const a=500+Math.random()*500,l=Math.random()*Math.PI*2,c=Math.acos(2*Math.random()-1);i[o]=a*Math.sin(c)*Math.cos(l),i[o+1]=a*Math.sin(c)*Math.sin(l),i[o+2]=a*Math.cos(c)}e.setAttribute("position",new on(i,3));const r=new eh({color:16777215,size:1,transparent:!0,opacity:.8}),s=new rv(e,r);s.userData={type:"decoration"},this.staticGroup.add(s)}createRegionHalos(){pr().forEach(e=>{const t=e.name,i=Wy(e.offices);if(!i)return;const r=Ra(i.lat,i.lon,hr+1),o=Vy()[t]||4890367,a=new ai(5,16,16),l=new bs({color:o,transparent:!0,opacity:0}),c=new Ot(a,l);c.position.set(r.x,r.y,r.z),c.userData={regionName:t,type:"region",centroidLat:i.lat,centroidLon:i.lon},this.regionOverlayGroup.add(c),this.regionHalos.set(t,c)})}createMarkers(){Bi().forEach(t=>{if(!t.coordinates)return;const i=Ra(t.coordinates.lat,t.coordinates.lon,hr+2),r=new wn;r.name=`marker-${t.officeCode}`;const s=new Qa(.6,.6,2.5,8),o=new go({color:16729156,emissive:3342336,shininess:100}),a=new Ot(s,o);a.position.y=1.25,r.add(a);const l=new ai(1,16,16),c=new go({color:16739179,emissive:4456448,shininess:100}),u=new Ot(l,c);u.position.y=3,r.add(u);const h=new ai(1.5,16,16),d=new bs({color:16746632,transparent:!0,opacity:0}),p=new Ot(h,d);p.position.y=3,p.userData.isGlow=!0,r.add(p),r.position.set(i.x,i.y,i.z);const _=new N(i.x,i.y,i.z).normalize();r.quaternion.setFromUnitVectors(new N(0,1,0),_),r.userData={office:t,type:"marker",regionName:t.regionName,worldPosition:new N(i.x,i.y,i.z)},r.visible=!0,this.markerGroup.add(r),this.markerMeshes.set(t.officeCode,r)})}createTooltip(){this.tooltip=document.createElement("div"),this.tooltip.className="map3d-tooltip",this.container.style.position="relative",this.container.appendChild(this.tooltip)}setupEventListeners(){this._boundOnPointerMove=e=>this.onPointerMove(e),this._boundOnClick=e=>this.onClick(e),this._boundOnResize=()=>this.onResize(),this._boundOnWheel=e=>this.handleWheel(e),this.container.addEventListener("pointermove",this._boundOnPointerMove),this.container.addEventListener("click",this._boundOnClick),window.addEventListener("resize",this._boundOnResize),this.container.addEventListener("wheel",this._boundOnWheel,{passive:!1}),this._boundPointerDown=e=>this.handlePointerDown(e),this._boundPointerMove=e=>this.handlePointerMove(e),this._boundPointerUp=e=>this.handlePointerUp(e),this.container.addEventListener("pointerdown",this._boundPointerDown),this.container.addEventListener("pointermove",this._boundPointerMove),this.container.addEventListener("pointerup",this._boundPointerUp),this.container.addEventListener("pointercancel",this._boundPointerUp)}handleWheel(e){if(e.preventDefault(),!this.globeGroup)return;const t=Oy(e.deltaY);t!==0&&(this.globeGroup.rotation.y+=t)}handlePointerDown(e){!e.isPrimary||e.button!==0||(this.dragStartX=e.clientX,this.dragStartY=e.clientY,this.previousX=e.clientX,this.isDragging=!1,this.wasDragging=!1,this.autoRotateWasEnabled=this.autoRotate,this.container.setPointerCapture(e.pointerId))}handlePointerMove(e){if(!e.isPrimary||this.dragStartX===null)return;const t=e.clientX-this.dragStartX,i=e.clientY-this.dragStartY;if(!this.isDragging&&Math.hypot(t,i)<=Ny)return;this.isDragging||(this.isDragging=!0,this.autoRotate=!1,this.container.style.cursor="grabbing");const r=e.clientX-this.previousX;this.previousX=e.clientX,this.globeGroup&&(this.globeGroup.rotation.y+=Fy(r))}handlePointerUp(e){e.isPrimary&&(this.isDragging&&(this.wasDragging=!0,this.autoRotateWasEnabled&&this.userWantsAutoRotate&&(this.autoRotate=!0)),this.isDragging=!1,this.dragStartX=null,this.dragStartY=null,this.previousX=null,this.container.style.cursor="")}getInteractiveObjects(){this._cachedHalos||(this._cachedHalos=[],this.regionHalos.forEach(t=>{this._cachedHalos.push(t)}));const e=[];this.markerMeshes.forEach(t=>{t.visible&&e.push(t)});for(let t=0;t<this._cachedHalos.length;t++)e.push(this._cachedHalos[t]);return e}onPointerMove(e){const t=this.container.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const i=this.getInteractiveObjects(),r=this.raycaster.intersectObjects(i,!0),s=this.hoveredMesh;if(this.hoveredMesh=null,this.tooltip.style.opacity="0",r.length>0){let o=r[0].object;for(;o&&!o.userData.type;)o=o.parent;o&&(o.userData.type==="region"||o.userData.type==="marker")&&(this.hoveredMesh=o,this.container.style.cursor="pointer",this.autoRotate=!1,o.userData.type==="region"?this.tooltip.textContent=o.userData.regionName:o.userData.type==="marker"&&(this.tooltip.textContent=`${o.userData.office.city}, ${o.userData.office.state}`),this.tooltip.style.left=`${e.clientX-t.left+10}px`,this.tooltip.style.top=`${e.clientY-t.top+10}px`,this.tooltip.style.opacity="1")}this.hoveredMesh||(this.container.style.cursor="default"),s!==this.hoveredMesh&&this.updateHoverGlow(s,this.hoveredMesh)}updateHoverGlow(e,t){e&&e.userData.type==="marker"&&e.children.forEach(i=>{i.userData.isGlow&&(i.material.opacity=0)}),t&&t.userData.type==="marker"&&t.children.forEach(i=>{i.userData.isGlow&&(i.material.opacity=.4)})}onClick(e){if(this.wasDragging){this.wasDragging=!1;return}if(this.hoveredMesh){if(this.hoveredMesh.userData.type==="region")this.selectRegion(this.hoveredMesh.userData.regionName),this.options.onRegionClick(this.hoveredMesh.userData.regionName);else if(this.hoveredMesh.userData.type==="marker"){const t=this.hoveredMesh.userData.office;this.selectOffice(t),this.options.onOfficeClick(t);const i=mr(t.regionName);Ly(t,i)}}}onResize(){this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(()=>{if(this._resizeTimeout=null,!this.container||!this.camera||!this.renderer)return;const e=this.container.clientWidth,t=this.container.clientHeight;e===0||t===0||(this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t))},100)}updateExpensiveMarkerStates(){if(this.animating)return;const{worldPos:e,toMarker:t,normalizedWorldPos:i}=this._tempVectors,r=this.camera.position;this.markerMeshes.forEach((s,o)=>{s.userData._dimmed&&s.children.forEach(u=>{u.material&&!u.userData.isGlow&&(u.material.transparent=!0,u.material.opacity=.3),u.userData.isGlow&&(u.material.opacity=0)}),s.getWorldPosition(e),t.copy(e).sub(r).normalize(),i.copy(e).normalize();const a=t.dot(i);if(s.visible=By(s.visible,a),!s.visible)return;const l=r.distanceTo(e),c=Math.max(.5,Math.min(1.5,200/l));s.scale.setScalar(c)})}updateMarkerStates(e){for(const t of e){const i=this.markerMeshes.get(t.officeCode);if(i){if(i.userData._dimmed=t.dimmed,t.dimmed){i.children.forEach(r=>{r.material&&!r.userData.isGlow&&(r.material.transparent=!0,r.material.opacity=.3),r.userData.isGlow&&(r.material.opacity=0)});continue}if(t.subdued){i.children.forEach(r=>{r.material&&!r.userData.isGlow&&(r.material.transparent=!0,r.material.opacity=.55),r.userData.isGlow&&(r.material.opacity=0)});continue}i.children.forEach(r=>{r.material&&!r.userData.isGlow&&(r.material.opacity=1,r.material.transparent=!1)}),i.children.forEach(r=>{r.userData.isGlow?r.material.opacity=t.selected?.5:0:r.geometry?.type==="SphereGeometry"&&!r.userData.isGlow&&r.material.emissive.setHex(t.selected?6702080:4456448)}),t.highlighted&&!t.selected&&i.children.forEach(r=>{r.userData.isGlow&&(r.material.opacity=.4)})}}}selectRegion(e){this.selectedRegion=e,this.selectedOffice=null,this.autoRotate=!1;const t=Ao(),i=t[e]||t.USA;this.animateToTarget(i.lat,i.lon,i.distance),setTimeout(()=>this.updateExpensiveMarkerStates(),100)}selectOffice(e){this.selectedOffice=e,e.coordinates&&this.animateToTarget(e.coordinates.lat,e.coordinates.lon,150)}reset(){this.selectedRegion=null,this.selectedOffice=null,this.autoRotate=!1,this.userWantsAutoRotate=!1,Fc();const t=Ao().USA;this.animateToTarget(t.lat,t.lon,t.distance),this.options.onReset()}animateToTarget(e,t,i,r=1e3){if(this.animating)return;this.animating=!0,this.autoRotate=!1;const s=this.globeGroup.rotation.y,o=t+s*180/Math.PI,a=zc(e,o,i),l=this.camera.position.clone(),c=performance.now(),u=h=>{if(!this.animating)return;const d=h-c,p=Math.min(d/r,1),_=1-Math.pow(1-p,3);this.camera.position.lerpVectors(l,a,_),this.camera.lookAt(0,0,0),p<1?requestAnimationFrame(u):(this.animating=!1,this.autoRotate=this.userWantsAutoRotate,this.updateExpensiveMarkerStates())};requestAnimationFrame(u)}animate(){this.animationFrameId=requestAnimationFrame(()=>this.animate()),this.autoRotate&&this.globeGroup&&(this.globeGroup.rotation.y+=this.rotationSpeed);const e=Date.now();e-this._lastExpensiveUpdate>this._expensiveUpdateInterval&&(this.updateExpensiveMarkerStates(),this._lastExpensiveUpdate=e);const t=Date.now()*.002;if(this.hoveredMesh?.userData.type==="marker"&&this.hoveredMesh.children.forEach(i=>{if(i.userData.isGlow){const r=Math.sin(t)*.15+.4;i.material.opacity=r}}),this.selectedOffice){const i=this.markerMeshes.get(this.selectedOffice.officeCode);i&&i!==this.hoveredMesh&&i.children.forEach(r=>{if(r.userData.isGlow){const s=Math.sin(t)*.1+.35;r.material.opacity=s}})}this.renderer.render(this.scene,this.camera)}getState(){return{selectedRegion:this.selectedRegion,selectedOffice:this.selectedOffice}}cancelAnimation(){this.animating=!1,this.autoRotate=!1,this.userWantsAutoRotate=!1}toggleAutoRotate(){return this.userWantsAutoRotate=!this.userWantsAutoRotate,this.autoRotate=this.userWantsAutoRotate,this.userWantsAutoRotate}getAutoRotate(){return this.userWantsAutoRotate}getSceneGraph(){return{globeGroup:this.globeGroup,markerGroup:this.markerGroup,regionOverlayGroup:this.regionOverlayGroup,staticGroup:this.staticGroup,earthMesh:this.earthMesh}}dispose(){try{if(this.cancelAnimation(),this._resizeTimeout&&(clearTimeout(this._resizeTimeout),this._resizeTimeout=null),this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this._boundOnResize&&window.removeEventListener("resize",this._boundOnResize),this._boundOnPointerMove&&this.container&&this.container.removeEventListener("pointermove",this._boundOnPointerMove),this._boundOnClick&&this.container&&this.container.removeEventListener("click",this._boundOnClick),this._boundOnWheel&&this.container&&this.container.removeEventListener("wheel",this._boundOnWheel),this._boundPointerDown&&this.container&&this.container.removeEventListener("pointerdown",this._boundPointerDown),this._boundPointerMove&&this.container&&this.container.removeEventListener("pointermove",this._boundPointerMove),this._boundPointerUp&&this.container&&(this.container.removeEventListener("pointerup",this._boundPointerUp),this.container.removeEventListener("pointercancel",this._boundPointerUp)),this.tooltip&&this.tooltip.parentNode&&this.tooltip.parentNode.removeChild(this.tooltip),Fc(),this.earthMesh&&(this.earthMesh.geometry?.dispose(),this.earthMesh.material?.map&&this.earthMesh.material.map.dispose(),this.earthMesh.material?.dispose()),this.atmosphere&&(this.atmosphere.geometry?.dispose(),this.atmosphere.material?.dispose()),this.markerMeshes){const e=new Set,t=new Set;this.markerMeshes.forEach(i=>{i.children.forEach(r=>{r.geometry&&!e.has(r.geometry)&&(e.add(r.geometry),r.geometry.dispose()),r.material&&(Array.isArray(r.material)?r.material:[r.material]).forEach(o=>{o&&!t.has(o)&&(t.add(o),o.dispose())})})})}this.regionHalos&&this.regionHalos.forEach(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(i=>i?.dispose())}),this.staticGroup&&this.staticGroup.children.forEach(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}finally{this.renderer&&(this.renderer.dispose(),this.renderer.forceContextLoss(),this.container&&this.renderer.domElement?.parentNode===this.container&&this.container.removeChild(this.renderer.domElement))}}}class Xy{provider=null;container;mapContainer;onOfficeClick;markers=[];disposed=!1;config;constructor(e,t){this.container=e,this.onOfficeClick=t.onOfficeClick??null,this.config=Ss(),this.mapContainer=document.createElement("div"),this.mapContainer.className="tile-map-container",this.container.appendChild(this.mapContainer)}async init(e){this.provider=Cy(this.config);const t={zoom:4,interactive:!0,attributionControl:!0,style:this.config.defaultTileStyle??"light"};try{await this.provider.initialize(this.mapContainer,t)}catch(i){if(this.config.provider!=="maplibre")console.warn(`[tile-map] ${this.config.provider} provider failed to initialize. Falling back to MapLibre.`,i),this.provider.dispose(),this.mapContainer.innerHTML="",this.provider=new ds(this.config.tileStyleUrl),await this.provider.initialize(this.mapContainer,t);else throw i}if(this.disposed){this.provider?.dispose(),this.provider=null;return}if(this.onOfficeClick){const i=this.onOfficeClick;this.provider.onMarkerClick(r=>{const o=Bi().find(a=>a.officeCode===r);o&&i(o)})}this.loadOfficeMarkers(e)}loadOfficeMarkers(e){if(!this.provider)return;const t=Bi(),i=getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()||"#00396c";this.markers=t.filter(r=>r.coordinates).map(r=>({officeCode:r.officeCode,lat:r.coordinates.lat,lon:r.coordinates.lon,label:`${r.city}, ${r.state}`,color:i,regionName:r.regionName})),this.provider.setMarkers(this.markers),e?this.provider.flyTo(e.lat,e.lon,{zoom:e.zoom,duration:0}):this.markers.length>0&&this.provider.fitBounds(this.markers)}selectRegion(e){if(!this.provider)return;const t=zg(e);if(t.length===0)return;const i=getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()||"#00396c",r=t.map(s=>({officeCode:s.officeCode,lat:s.coordinates.lat,lon:s.coordinates.lon,label:`${s.city}, ${s.state}`,color:i,regionName:e}));this.provider.fitBounds(r,60)}selectOffice(e){if(!this.provider)return;const{lat:t,lon:i}=e.coordinates;this.provider.flyTo(t,i,{zoom:12,duration:1e3})}reset(){this.provider&&this.provider.flyTo(39.8283,-98.5795,{zoom:4,duration:1e3})}updateMarkerStates(e){this.provider&&this.provider.updateMarkerStates(e)}setTileStyle(e){this.provider&&this.provider.setStyle?.(e)}dispose(){this.disposed||(this.disposed=!0,this.provider&&(this.provider.dispose(),this.provider=null),this.markers=[],this.mapContainer.remove())}}class Zy{constructor(e,t={}){this.container=e,this.options={onClose:t.onClose||(()=>{}),onOfficeClick:t.onOfficeClick||null},this.currentOffice=null,this.currentRegion=null,this.miniMap=null,this.miniMapContainer=null,this.init()}init(){this.container.innerHTML=`
      <div class="panel-content">
        <div class="panel-header">
          <h2 class="panel-title">Select a Location</h2>
          <button class="panel-close btn btn-secondary" aria-label="Close panel">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="panel-body">
          <p class="panel-placeholder"></p>
        </div>
      </div>
    `,this.closeBtn=this.container.querySelector(".panel-close"),this.titleEl=this.container.querySelector(".panel-title"),this.bodyEl=this.container.querySelector(".panel-body");const e=this.bodyEl.querySelector(".panel-placeholder");if(e)try{e.textContent=`Click on a region to explore ${an().name} offices.`}catch{e.textContent="Click on a region to explore offices."}this.closeBtn.addEventListener("click",()=>{this.options.onClose()}),this.closeBtn.classList.add("panel-close--hidden"),this.setupMobileGestures()}setupMobileGestures(){let e=0,t=0,i=0,r=!1;this.container.addEventListener("touchstart",o=>{if(!this.container.classList.contains("open")||!o.touches.length)return;e=o.touches[0].clientY,t=this.bodyEl.scrollTop,i=0,r=!0},{passive:!0}),this.container.addEventListener("touchmove",o=>{if(!r||!o.touches.length)return;const l=o.touches[0].clientY-e;t<=1&&l>0&&(o.preventDefault(),i=l*.6,this.container.style.transform=`translateY(${i}px)`,this.container.style.transition="none")},{passive:!1});const s=()=>{r&&(r=!1,i>80?(this.container.style.transition="transform 0.25s ease-out",this.container.style.transform="translateY(100%)",this.container.classList.remove("open"),this.options.onClose(),setTimeout(()=>{this.container.style.transition="",this.container.style.transform=""},250)):i>0&&(this.container.style.transition="transform 0.2s ease-out",this.container.style.transform="",setTimeout(()=>{this.container.style.transition=""},200)),i=0)};this.container.addEventListener("touchend",s,{passive:!0}),this.container.addEventListener("touchcancel",s,{passive:!0})}showRegion(e){this.miniMap&&(this.miniMap.dispose(),this.miniMap=null,this.miniMapContainer=null),this.currentRegion=e,this.currentOffice=null,this.closeBtn.classList.remove("panel-close--hidden"),this.titleEl.textContent=e.name;const t=e.offices||[],i=e.personnel||[];let r="";if(i.length>0){const s=i[0];r+=`
        <div class="region-manager">
          <h3>Regional Manager</h3>
          <div class="contact-card">
            <div class="contact-name">${Re(s.name)}</div>
            <div class="contact-title">${Re(s.title)}</div>
            ${s.phone?`<div class="contact-phone"><a href="tel:${Re(s.phone)}">${Re(s.phone)}</a></div>`:""}
            ${s.email?`<div class="contact-email"><a href="mailto:${Re(s.email)}">${Re(s.email)}</a></div>`:""}
            ${s.vcardUrl?`<a href="${To(s.vcardUrl)}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">Download vCard</a>`:""}
          </div>
        </div>
      `}t.length>0?r+=`
        <div class="office-list">
          <h3>Offices in this Region</h3>
          <ul class="office-items">
            ${t.map(s=>`
              <li class="office-item" data-office-code="${Re(s.officeCode)}">
                <button class="office-btn">
                  <span class="office-city">${Re(s.city)}, ${Re(s.state)}</span>
                  <span class="office-code">${Re(s.officeCode)}</span>
                  <span class="office-type">${Re(s.officeType)}</span>
                </button>
              </li>
            `).join("")}
          </ul>
        </div>
      `:r+='<p class="no-offices">No offices in this region.</p>',this.bodyEl.innerHTML=r,this.bodyEl.querySelectorAll(".office-btn").forEach(s=>{s.addEventListener("click",()=>{const o=s.closest(".office-item").dataset.officeCode,a=t.find(l=>l.officeCode===o);a&&(this.options.onOfficeClick?this.options.onOfficeClick(a,e):this.showOffice(a,e))})}),this.container.classList.add("open")}showOffice(e,t){this.currentOffice=e,this.currentRegion=t,this.closeBtn.classList.remove("panel-close--hidden"),this.titleEl.textContent=`${e.city}, ${e.state}`;const r=(t?.personnel||[])[0];let s=`
      <div class="office-details">
        <!-- Logo placeholder slot -->
        <div class="office-logo-slot" style="--logo-url: var(--logo-url, none)">
          <div class="logo-placeholder" aria-hidden="true"></div>
        </div>

        <div class="office-header">
          <div class="office-code-badge">${Re(e.officeCode)}</div>
          <div class="office-type-badge ${e.officeType==="Satellite Sales Office"?"satellite":"branch"}">${Re(e.officeType)}</div>
        </div>

        ${e.address?`
          <div class="office-address">
            <h4>Address</h4>
            <address>${Re(e.address)}</address>
            <a href="${To(e.directionsUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`)}" class="btn btn-accent" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Get Directions
            </a>
          </div>
        `:`
          <div class="office-address">
            <p class="no-address">Address not available for this satellite office.</p>
          </div>
        `}
    `;if(r&&(s+=`
        <div class="office-contact">
          <h4>Contact</h4>
          <div class="contact-card">
            <div class="contact-name">${Re(r.name)}</div>
            <div class="contact-title">${Re(r.title)}</div>
            ${r.phone?`<div class="contact-phone"><a href="tel:${Re(r.phone)}">${Re(r.phone)}</a></div>`:""}
            ${r.email?`<div class="contact-email"><a href="mailto:${Re(r.email)}">${Re(r.email)}</a></div>`:""}
            ${r.vcardUrl?`
              <a href="${To(r.vcardUrl)}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Download vCard
              </a>
            `:""}
          </div>
        </div>
      `),e.coordinates?.approximate&&(s+=`
        <div class="coord-warning">
          <small>📍 Location shown is approximate (${Re(e.coordinates.source)})</small>
        </div>
      `),s+="</div>",this.bodyEl.innerHTML=s,this.container.classList.add("open"),e.coordinates?.lat&&e.coordinates?.lon){this.miniMapContainer||(this.miniMapContainer=document.createElement("div"),this.miniMapContainer.className="mini-map-container",this.miniMapContainer.id="details-mini-map"),this.bodyEl.querySelector(".office-details")?.appendChild(this.miniMapContainer);const o=getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()||"#00396c";this.miniMap||(this.miniMap=new ch(this.miniMapContainer)),this.miniMap.show(e,o)}}showPlaceholder(e){if(this.miniMap&&(this.miniMap.dispose(),this.miniMap=null,this.miniMapContainer=null),!e)try{e=`Click on a region to explore ${an().name} offices.`}catch{e="Click on a region to explore offices."}this.currentOffice=null,this.currentRegion=null,this.titleEl.textContent="Select a Location",this.bodyEl.innerHTML='<p class="panel-placeholder"></p>',this.bodyEl.querySelector(".panel-placeholder").textContent=e,this.closeBtn.classList.add("panel-close--hidden")}setMiniMapStyle(e){this.miniMap&&this.miniMap.setTileStyle(e)}close(){this.container.classList.remove("open")}open(){this.container.classList.add("open")}}class qy{constructor(e){this.container=e,this.init()}init(){let e=`
      <div class="specialty-panel">
        <h2 class="specialty-panel-title">Specialty Divisions</h2>
        <p class="specialty-panel-desc">Our specialty divisions serve clients nationwide.</p>
        <div class="specialty-accordion">
    `;(an().specialtyDivisions??[]).forEach((i,r)=>{const s=i.personnel||[];e+=`
        <div class="accordion-item" data-index="${r}">
          <button class="accordion-header" aria-expanded="false" aria-controls="division-${r}">
            <span class="accordion-title">${Re(i.name)}</span>
            <span class="accordion-count">${s.length} contact${s.length!==1?"s":""}</span>
            <svg class="accordion-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="accordion-content" id="division-${r}" hidden>
            <div class="personnel-list">
              ${s.map(o=>`
                <div class="personnel-card">
                  <div class="personnel-name">${Re(o.name)}</div>
                  <div class="personnel-title">${Re(o.title||"")}</div>
                  <div class="personnel-contact">
                    ${o.phone?`<a href="tel:${Re(o.phone)}" class="contact-link phone">${Re(o.phone)}</a>`:""}
                    ${o.email?`<a href="mailto:${Re(o.email)}" class="contact-link email">${Re(o.email)}</a>`:""}
                  </div>
                  ${o.vcardUrl?`
                    <a href="${Re(o.vcardUrl)}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener">
                      Download vCard
                    </a>
                  `:""}
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `}),e+=`
        </div>
      </div>
    `,this.container.innerHTML=e,this.setupAccordion()}setupAccordion(){this.container.querySelectorAll(".accordion-header").forEach(t=>{t.addEventListener("click",()=>{const i=t.closest(".accordion-item"),r=i.querySelector(".accordion-content"),s=t.getAttribute("aria-expanded")==="true";this.container.querySelectorAll(".accordion-item").forEach(o=>{o!==i&&(o.querySelector(".accordion-header").setAttribute("aria-expanded","false"),o.querySelector(".accordion-content").hidden=!0,o.classList.remove("open"))}),t.setAttribute("aria-expanded",!s),r.hidden=s,i.classList.toggle("open",!s)})})}}class Yy{constructor(e,t={}){this.container=e,this.options={onRegionClick:t.onRegionClick||(()=>{}),onOfficeClick:t.onOfficeClick||(()=>{})},this.selectedRegion=null,this.init()}init(){let e=`
      <nav class="region-nav" aria-label="Regions">
        <h2 class="region-nav-title">Regions</h2>
        <ul class="region-list">
    `;pr().forEach(t=>{const i=t.offices||[];e+=`
        <li class="region-list-item" data-region="${Re(t.name)}">
          <button class="region-btn" aria-expanded="false">
            <span class="region-name">${Re(t.name)}</span>
            <span class="region-count">${i.length} office${i.length!==1?"s":""}</span>
          </button>
          <ul class="office-sublist" hidden>
            ${i.map(r=>`
              <li class="office-subitem" data-office-code="${Re(r.officeCode)}">
                <button class="office-subbtn">
                  <span class="office-city">${Re(r.city)}, ${Re(r.state)}</span>
                  <span class="office-type">${r.officeType==="Satellite Sales Office"?"Satellite":"Branch"}</span>
                </button>
              </li>
            `).join("")}
          </ul>
        </li>
      `}),e+=`
        </ul>
      </nav>
    `,this.container.innerHTML=e,this.setupEventListeners()}setupEventListeners(){this.container.querySelectorAll(".region-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.closest(".region-list-item"),i=t.dataset.region,r=t.querySelector(".office-sublist"),s=e.getAttribute("aria-expanded")==="true";if(this.container.querySelectorAll(".region-list-item").forEach(o=>{o!==t&&(o.querySelector(".region-btn").setAttribute("aria-expanded","false"),o.querySelector(".office-sublist").hidden=!0,o.classList.remove("expanded"))}),e.setAttribute("aria-expanded",!s),r.hidden=s,t.classList.toggle("expanded",!s),!s){this.selectedRegion=i;const o=mr(i);this.options.onRegionClick(o)}})}),this.container.querySelectorAll(".office-subbtn").forEach(e=>{e.addEventListener("click",()=>{const t=e.closest(".office-subitem"),i=t.dataset.officeCode,s=t.closest(".region-list-item").dataset.region,o=mr(s),a=o?.offices.find(l=>l.officeCode===i);a&&(this.container.querySelectorAll(".office-subitem").forEach(l=>l.classList.remove("selected")),t.classList.add("selected"),this.options.onOfficeClick(a,o))})})}highlightRegion(e){this.container.querySelectorAll(".region-list-item").forEach(t=>{t.dataset.region===e?(t.classList.add("active"),t.querySelector(".region-btn").setAttribute("aria-expanded","true"),t.querySelector(".office-sublist").hidden=!1):t.classList.remove("active")})}reset(){this.selectedRegion=null,this.container.querySelectorAll(".region-list-item").forEach(e=>{e.classList.remove("active","expanded"),e.querySelector(".region-btn").setAttribute("aria-expanded","false"),e.querySelector(".office-sublist").hidden=!0}),this.container.querySelectorAll(".office-subitem").forEach(e=>{e.classList.remove("selected")})}}function jy(n){const{allOffices:e,selectedRegion:t,selectedOfficeCode:i,hoveredOfficeCode:r}=n;return e.map(s=>({officeCode:s.officeCode,regionName:s.regionName,visible:!0,selected:s.officeCode===i,highlighted:s.officeCode===r,dimmed:t!==null&&s.regionName!==t,subdued:i!==null&&t!==null&&s.regionName===t&&s.officeCode!==i}))}function Ky(n){if(document.title=`${n.name} - Locations Map`,eE(`Interactive locations map for ${n.name}`),ns("#loading-logo",n.name),ns("#header-logo",n.name),Jy("#header-tagline",n.tagline),n.globalContacts)if(Qy("#footer-phone",n.globalContacts.mainPhone),is("#footer-email",n.globalContacts.mainEmail),is("#footer-claims",n.globalContacts.departmentEmails?.claims),is("#footer-lossruns",n.globalContacts.departmentEmails?.lossRuns),is("#footer-accounting",n.globalContacts.departmentEmails?.accounting),n.globalContacts.accountingContact){const e=n.globalContacts.accountingContact;ns("#accounting-contact",`${e.name}, ${e.title} - ${e.phone}`)}else ri("#accounting-contact");else{ri("#footer-phone"),ri("#footer-email"),ri("#footer-claims"),ri("#footer-lossruns"),ri("#footer-accounting"),ri("#accounting-contact");const e=document.querySelector(".footer-contact .footer-label");e&&(e.textContent="Contact information not available.")}ns("#copyright",`© ${new Date().getFullYear()} ${n.copyrightHolder}`)}function ns(n,e){const t=document.querySelector(n);t&&(t.textContent=e)}function Jy(n,e){const t=document.querySelector(n);t&&(e?(t.textContent=e,t.style.display=""):t.style.display="none")}function Qy(n,e){const t=document.querySelector(n);t&&(e?(t.textContent=e,t.href=`tel:${e.replace(/[^+\d]/g,"")}`,t.style.display=""):t.style.display="none")}function is(n,e){const t=document.querySelector(n);t&&(e?(t.textContent=e,t.href=`mailto:${e}`,t.style.display=""):t.style.display="none")}function ri(n){const e=document.querySelector(n);e&&(e.style.display="none")}function eE(n){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",n)}const Bc="#f5f5f5",Vc="#252540";function Pa(n){wr(n);const e=parseInt(n.slice(1,3),16)/255,t=parseInt(n.slice(3,5),16)/255,i=parseInt(n.slice(5,7),16)/255,r=s=>s<=.03928?s/12.92:((s+.055)/1.055)**2.4;return .2126*r(e)+.7152*r(t)+.0722*r(i)}function Gc(n,e){const t=Pa(n),i=Pa(e),r=Math.max(t,i),s=Math.min(t,i);return(r+.05)/(s+.05)}function rs(n,e,t=4.5){if(Gc(n,e)>=t)return n;const i=Pa(e),{h:r,s,l:o}=uh(n),a=i>.5?-.01:.01;let l=o;for(let c=0;c<100;c++){l=Math.max(0,Math.min(1,l+a));const u=Ts(r,s,l);if(Gc(u,e)>=t)return u}return Ts(r,s,Math.max(0,Math.min(1,l)))}function tE(n){if(!n)return;const e=document.documentElement.style;if(n.primaryColor){e.setProperty("--color-primary",n.primaryColor);const{light:t,dark:i}=Hc(n.primaryColor);e.setProperty("--color-primary-light",t),e.setProperty("--color-primary-dark",i),e.setProperty("--color-bg-overlay",iE(n.primaryColor,.8)),e.setProperty("--color-primary-on-light",rs(n.primaryColor,Bc)),e.setProperty("--color-primary-on-dark",rs(n.primaryColor,Vc))}if(n.accentColor){e.setProperty("--color-accent",n.accentColor);const{light:t,dark:i}=Hc(n.accentColor);e.setProperty("--color-accent-light",t),e.setProperty("--color-accent-dark",i),e.setProperty("--color-accent-on-light",rs(n.accentColor,Bc)),e.setProperty("--color-accent-on-dark",rs(n.accentColor,Vc))}if(n.regionColors)for(const[t,i]of Object.entries(n.regionColors))try{wr(i);const r=nE(t);e.setProperty(`--color-region-${r}`,i)}catch{console.warn(`Invalid regionColor for "${t}": "${i}". Skipping.`)}}function nE(n){return n.toLowerCase().replace(/\s+/g,"-")}function Hc(n){const{h:e,s:t,l:i}=uh(n);return{light:Ts(e,t,Math.min(1,i+.15)),dark:Ts(e,t,Math.max(0,i-.15))}}function iE(n,e){wr(n);const t=parseInt(n.slice(1,3),16),i=parseInt(n.slice(3,5),16),r=parseInt(n.slice(5,7),16);return`rgba(${t}, ${i}, ${r}, ${e})`}function uh(n){wr(n);const e=parseInt(n.slice(1,3),16)/255,t=parseInt(n.slice(3,5),16)/255,i=parseInt(n.slice(5,7),16)/255,r=Math.max(e,t,i),s=Math.min(e,t,i),o=(r+s)/2;if(r===s)return{h:0,s:0,l:o};const a=r-s,l=o>.5?a/(2-r-s):a/(r+s);let c=0;return r===e?c=((t-i)/a+(t<i?6:0))/6:r===t?c=((i-e)/a+2)/6:c=((e-t)/a+4)/6,{h:c,s:l,l:o}}function Ts(n,e,t){if(e===0){const u=Math.round(t*255).toString(16).padStart(2,"0");return`#${u}${u}${u}`}const i=(c,u,h)=>{let d=h;return d<0&&(d+=1),d>1&&(d-=1),d<1/6?c+(u-c)*6*d:d<1/2?u:d<2/3?c+(u-c)*(2/3-d)*6:c},r=t<.5?t*(1+e):t+e-t*e,s=2*t-r,o=Math.round(i(s,r,n+1/3)*255),a=Math.round(i(s,r,n)*255),l=Math.round(i(s,r,n-1/3)*255);return`#${o.toString(16).padStart(2,"0")}${a.toString(16).padStart(2,"0")}${l.toString(16).padStart(2,"0")}`}function Wc(n,e){return"regionName"in n&&typeof n.regionName=="string"&&n.regionName.length>0?n:{...n,regionName:e}}const hn={USA_VIEW:"USA_VIEW",REGION_VIEW:"REGION_VIEW",LOCATION_VIEW:"LOCATION_VIEW"};class nl{state=hn.USA_VIEW;selectedRegion=null;selectedOffice=null;mapMode;transitioning=!1;resetting=!1;map=null;panel=null;regionList=null;specialtyPanel=null;mapContainer;panelContainer;regionListContainer;specialtyContainer;resetBtn;stateIndicator;modeSelector;spinBtn;tileStyleBtn;tileStyle="light";collapseLeftBtn;collapseRightBtn;layoutEl;boundHashChange=null;boundKeydown=null;boundCollapseLeft=null;boundCollapseRight=null;constructor(){this.mapMode="tile",this.mapContainer=document.getElementById("map-container"),this.panelContainer=document.getElementById("details-panel"),this.regionListContainer=document.getElementById("region-list"),this.specialtyContainer=document.getElementById("specialty-divisions"),this.resetBtn=document.getElementById("reset-btn"),this.stateIndicator=document.getElementById("state-indicator"),this.modeSelector=document.querySelector(".mode-selector"),this.spinBtn=document.getElementById("spin-toggle"),this.tileStyleBtn=document.getElementById("tile-style-toggle"),this.collapseLeftBtn=document.getElementById("collapse-left"),this.collapseRightBtn=document.getElementById("collapse-right"),this.layoutEl=document.querySelector(".layout"),this.init()}async init(){let e;try{const i=await Eg();if(i.length===0){console.error("Client registry is empty — no clients configured."),this.mapContainer&&(this.mapContainer.innerHTML=`
            <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
              <h2>Configuration Error</h2>
              <p>No clients configured in registry. Please contact the administrator.</p>
            </div>`);return}const r=new URLSearchParams(window.location.search).get("client");if(r!==null){if(e=r.trim().toLowerCase(),!i.includes(e)){console.error(`Unknown client: "${e}". Available: ${i.join(", ")}`),this.mapContainer&&(this.mapContainer.innerHTML=`
              <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
                <h2>Configuration Error</h2>
                <p>Unknown client: &quot;${e.replace(/[<>"&]/g,"")}&quot;. Check the client registry.</p>
              </div>`);return}}else e=await bg()}catch(i){console.error("Failed to load client registry:",i),this.mapContainer&&(this.mapContainer.innerHTML=`
          <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
            <h2>Configuration Error</h2>
            <p>Could not load client registry. Please check the console for details.</p>
          </div>`);return}try{const i=await kg(e);Ky(i),tE(i.theme),this.tileStyle=Ss().defaultTileStyle}catch(i){console.error(`Failed to load client config for "${e}":`,i),this.mapContainer&&(this.mapContainer.innerHTML=`
          <div style="padding: 20px; color: red; border: 2px solid red; margin: 20px;">
            <h2>Configuration Error</h2>
            <p>Could not load client configuration. Please check the console for details.</p>
          </div>`);return}await this.initMap(),this.modeSelector&&(this.modeSelector.addEventListener("click",i=>{const r=i.target.closest(".mode-btn");if(!r)return;const s=r.dataset.mode;s&&s!==this.mapMode&&this.switchMapMode(s)}),this.updateModeSelector()),this.spinBtn&&this.spinBtn.addEventListener("click",()=>this.handleSpinToggle()),this.updateSpinButtonVisibility(),this.tileStyleBtn&&this.tileStyleBtn.addEventListener("click",()=>this.handleTileStyleToggle()),this.updateTileStyleButtonVisibility(),this.updateTileStyleButton(),this.collapseLeftBtn&&(this.boundCollapseLeft=()=>this.toggleSidebar("left"),this.collapseLeftBtn.addEventListener("click",this.boundCollapseLeft)),this.collapseRightBtn&&(this.boundCollapseRight=()=>this.toggleSidebar("right"),this.collapseRightBtn.addEventListener("click",this.boundCollapseRight)),this.panelContainer&&(this.panel=new Zy(this.panelContainer,{onClose:()=>this.handlePanelClose(),onOfficeClick:(i,r)=>this.handleOfficeClick(i,r)})),this.regionListContainer&&(this.regionList=new Yy(this.regionListContainer,{onRegionClick:i=>this.handleRegionClick(i.name),onOfficeClick:(i,r)=>this.handleOfficeClick(i,r)})),this.specialtyContainer&&(this.specialtyPanel=new qy(this.specialtyContainer)),this.resetBtn&&this.resetBtn.addEventListener("click",()=>this.handleReset()),this.handleHashChange(),this.boundHashChange=()=>this.handleHashChange(),window.addEventListener("hashchange",this.boundHashChange),this.boundKeydown=i=>this.handleKeydown(i),document.addEventListener("keydown",this.boundKeydown);const t=document.getElementById("loading-screen");t&&setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),500)},300),this.updateUI()}async initMap(e){if(!this.mapContainer)return;this.map?.dispose&&this.map.dispose(),this.mapContainer.innerHTML="";const t={onRegionClick:i=>this.handleRegionClick(i),onOfficeClick:i=>this.handleOfficeClick(i),onReset:()=>this.handleReset()};if(this.mapMode==="3d")try{this.map=new $y(this.mapContainer,t),document.body.dataset.mapMode="3d"}catch(i){console.warn("3D map failed, falling back to 2D:",i),this.mapMode="2d";const r=new Hs(this.mapContainer,t);await r.init(),this.map=r,document.body.dataset.mapMode="2d"}else if(this.mapMode==="tile")try{const i=new Xy(this.mapContainer,t);await i.init(e),this.map=i,document.body.dataset.mapMode="tile"}catch(i){console.warn("Tile map failed, falling back to 2D:",i),this.mapMode="2d";const r=new Hs(this.mapContainer,t);await r.init(),this.map=r,document.body.dataset.mapMode="2d"}else{const i=new Hs(this.mapContainer,t);await i.init(),this.map=i,document.body.dataset.mapMode="2d"}}lastToggleTime=0;static TOGGLE_DEBOUNCE_MS=500;async switchMapMode(e){if(this.transitioning||e===this.mapMode)return;const t=performance.now();if(!(t-this.lastToggleTime<nl.TOGGLE_DEBOUNCE_MS)){this.lastToggleTime=t,this.transitioning=!0,this.setModeButtonsEnabled(!1);try{const i=this.selectedRegion?.name??null,r=this.selectedOffice?.officeCode??null,s=this.selectedOffice,o=this.selectedRegion;let a;if(e==="tile"){if(s?.coordinates)a={lat:s.coordinates.lat,lon:s.coordinates.lon,zoom:12};else if(i){const l=Bi().filter(c=>"regionName"in c&&c.regionName===i);if(l.length>0){const c=l.reduce((h,d)=>h+d.coordinates.lat,0)/l.length,u=l.reduce((h,d)=>h+d.coordinates.lon,0)/l.length;a={lat:c,lon:u,zoom:6}}}}if(this.mapMode=e,await this.initMap(a),this.updateModeSelector(),this.updateSpinButtonVisibility(),this.updateTileStyleButtonVisibility(),this.updateSpinButton(),this.updateTileStyleButton(),e==="tile"&&this.map&&typeof this.map.setTileStyle=="function"&&this.map.setTileStyle(this.tileStyle),r&&s&&o&&this.map){const l=Wc(s,o.name);this.map.selectOffice(l),this.panel?.showOffice(l,o)}else i&&o&&this.map&&(this.map.selectRegion(i),this.panel?.showRegion(o))}finally{this.transitioning=!1,this.setModeButtonsEnabled(!0)}}}updateModeSelector(){if(!this.modeSelector)return;this.modeSelector.querySelectorAll(".mode-btn").forEach(t=>{const r=t.dataset.mode===this.mapMode;t.classList.toggle("active",r),t.setAttribute("aria-pressed",String(r))})}setModeButtonsEnabled(e){if(!this.modeSelector)return;this.modeSelector.querySelectorAll(".mode-btn").forEach(i=>{i.disabled=!e})}handleSpinToggle(){this.mapMode!=="3d"||!this.map||"toggleAutoRotate"in this.map&&(this.map.toggleAutoRotate(),this.updateSpinButton())}updateSpinButton(){if(!this.spinBtn)return;const e=this.mapMode==="3d"&&this.map&&"getAutoRotate"in this.map?this.map.getAutoRotate():!1;this.spinBtn.classList.toggle("active",e),this.spinBtn.setAttribute("aria-pressed",String(e))}updateSpinButtonVisibility(){this.spinBtn&&(this.spinBtn.hidden=this.mapMode!=="3d")}handleTileStyleToggle(){this.mapMode!=="tile"||!this.map||(this.tileStyle=this.tileStyle==="light"?"dark":"light",typeof this.map.setTileStyle=="function"&&this.map.setTileStyle(this.tileStyle),this.panel&&typeof this.panel.setMiniMapStyle=="function"&&this.panel.setMiniMapStyle(this.tileStyle),this.updateTileStyleButton())}updateTileStyleButton(){if(!this.tileStyleBtn)return;const e=this.tileStyle==="dark";this.tileStyleBtn.classList.toggle("active",e),this.tileStyleBtn.setAttribute("aria-pressed",String(e)),this.tileStyleBtn.title=e?"Switch to light map":"Switch to dark map",this.tileStyleBtn.setAttribute("aria-label",e?"Switch to light map":"Switch to dark map")}updateTileStyleButtonVisibility(){this.tileStyleBtn&&(this.tileStyleBtn.hidden=this.mapMode!=="tile")}toggleSidebar(e){if(!this.layoutEl)return;const t=e==="left"?"left-collapsed":"right-collapsed",i=e==="left"?this.regionListContainer:this.panelContainer,r=e==="left"?this.collapseLeftBtn:this.collapseRightBtn,s=this.layoutEl.classList.toggle(t);i?.classList.toggle("collapsed",s),r?.classList.toggle("expanded",s);const o=e==="left"?"region panel":"details panel",a=s?"Expand":"Collapse";r?.setAttribute("aria-label",`${a} ${o}`),r?.setAttribute("title",`${a} ${o}`),r?.setAttribute("aria-expanded",String(!s));const l=()=>window.dispatchEvent(new Event("resize"));let c=!1;const u=h=>{h.target!==this.layoutEl||h.propertyName!=="grid-template-columns"||(c=!0,this.layoutEl?.removeEventListener("transitionend",u),l())};this.layoutEl.addEventListener("transitionend",u),setTimeout(()=>{c||(this.layoutEl?.removeEventListener("transitionend",u),l())},350)}dispatchMarkerStates(){if(!this.map)return;const e=Bi(),t=jy({allOffices:e,selectedRegion:this.selectedRegion?.name??null,selectedOfficeCode:this.selectedOffice?.officeCode??null,hoveredOfficeCode:null});this.map.updateMarkerStates?.(t)}handleRegionClick(e){const t=mr(e);t&&(this.state=hn.REGION_VIEW,this.selectedRegion=t,this.selectedOffice=null,history.replaceState(null,"",`#region=${encodeURIComponent(e)}`),this.map?.selectRegion(e),this.dispatchMarkerStates(),this.panel?.showRegion(t),this.regionList?.highlightRegion(e),this.updateUI())}handleOfficeClick(e,t=null){if(!t&&this.selectedRegion?t=this.selectedRegion:t||(t=pr().find(r=>r.offices.some(s=>s.officeCode===e.officeCode))||null,!t&&"regionName"in e&&(t=mr(e.regionName)||null)),!t)return;this.state=hn.LOCATION_VIEW,this.selectedRegion=t,this.selectedOffice=e,history.replaceState(null,"",`#office=${encodeURIComponent(e.officeCode)}`);const i=Wc(e,t.name);this.map?.selectOffice(i),this.dispatchMarkerStates(),this.panel?.showOffice(e,t),this.updateUI()}handlePanelClose(){this.state!==hn.USA_VIEW&&this.handleReset()}handleReset(){if(!this.resetting){this.resetting=!0;try{this.state=hn.USA_VIEW,this.selectedRegion=null,this.selectedOffice=null,history.pushState(null,"",window.location.pathname),this.map?.reset(),this.dispatchMarkerStates(),this.panel?.showPlaceholder(),this.panel?.close(),this.regionList?.reset(),this.updateUI()}finally{this.resetting=!1}}}handleHashChange(){const e=window.location.hash.slice(1);if(!e)return;const t=new URLSearchParams(e);if(t.has("office")){const i=decodeURIComponent(t.get("office")||""),r=pr().find(s=>s.offices.some(o=>o.officeCode===i));if(r){const s=r.offices.find(o=>o.officeCode===i);if(s){this.handleOfficeClick(s,r);return}}}if(t.has("region")){const i=decodeURIComponent(t.get("region")||"");this.handleRegionClick(i);return}}handleKeydown(e){e.key==="Escape"&&(this.state===hn.LOCATION_VIEW?this.selectedRegion&&this.handleRegionClick(this.selectedRegion.name):this.state===hn.REGION_VIEW&&this.handleReset())}updateUI(){if(this.stateIndicator){let e="USA";this.state===hn.REGION_VIEW&&this.selectedRegion?e=`USA > ${this.selectedRegion.name}`:this.state===hn.LOCATION_VIEW&&this.selectedOffice&&(e=`USA > ${this.selectedRegion?.name||""} > ${this.selectedOffice.city}`),this.stateIndicator.textContent=e}this.resetBtn&&(this.resetBtn.hidden=this.state===hn.USA_VIEW),document.body.dataset.state=this.state.toLowerCase()}getState(){return{state:this.state,selectedRegion:this.selectedRegion,selectedOffice:this.selectedOffice}}dispose(){this.map?.dispose&&this.map.dispose(),this.boundHashChange&&(window.removeEventListener("hashchange",this.boundHashChange),this.boundHashChange=null),this.boundKeydown&&(document.removeEventListener("keydown",this.boundKeydown),this.boundKeydown=null),this.boundCollapseLeft&&this.collapseLeftBtn&&(this.collapseLeftBtn.removeEventListener("click",this.boundCollapseLeft),this.boundCollapseLeft=null),this.boundCollapseRight&&this.collapseRightBtn&&(this.collapseRightBtn.removeEventListener("click",this.boundCollapseRight),this.boundCollapseRight=null)}}let $c=null;document.addEventListener("DOMContentLoaded",()=>{$c=new nl,window.app=$c});export{In as _};
