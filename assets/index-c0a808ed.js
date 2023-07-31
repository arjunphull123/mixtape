(function(){const m=document.createElement("link").relList;if(m&&m.supports&&m.supports("modulepreload"))return;for(const y of document.querySelectorAll('link[rel="modulepreload"]'))s(y);new MutationObserver(y=>{for(const S of y)if(S.type==="childList")for(const E of S.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&s(E)}).observe(document,{childList:!0,subtree:!0});function e(y){const S={};return y.integrity&&(S.integrity=y.integrity),y.referrerPolicy&&(S.referrerPolicy=y.referrerPolicy),y.crossOrigin==="use-credentials"?S.credentials="include":y.crossOrigin==="anonymous"?S.credentials="omit":S.credentials="same-origin",S}function s(y){if(y.ep)return;y.ep=!0;const S=e(y);fetch(y.href,S)}})();var $=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ue(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var ie={exports:{}};(function(r){(function(m){var e=D(),s=se(),y=ce(),S=le(),E={imagePlaceholder:void 0,cacheBust:!1},A={toSvg:N,toPng:g,toJpeg:k,toBlob:v,toPixelData:f,impl:{fontFaces:y,images:S,util:e,inliner:s,options:{}}};r.exports=A;function N(o,n){return n=n||{},I(n),Promise.resolve(o).then(function(c){return V(c,n.filter,!0)}).then(q).then(X).then(i).then(function(c){return G(c,n.width||e.width(o),n.height||e.height(o))});function i(c){return n.bgcolor&&(c.style.backgroundColor=n.bgcolor),n.width&&(c.style.width=n.width+"px"),n.height&&(c.style.height=n.height+"px"),n.style&&Object.keys(n.style).forEach(function(h){c.style[h]=n.style[h]}),c}}function f(o,n){return J(o,n||{}).then(function(i){return i.getContext("2d").getImageData(0,0,e.width(o),e.height(o)).data})}function g(o,n){return J(o,n||{}).then(function(i){return i.toDataURL()})}function k(o,n){return n=n||{},J(o,n).then(function(i){return i.toDataURL("image/jpeg",n.quality||1)})}function v(o,n){return J(o,n||{}).then(e.canvasToBlob)}function I(o){typeof o.imagePlaceholder>"u"?A.impl.options.imagePlaceholder=E.imagePlaceholder:A.impl.options.imagePlaceholder=o.imagePlaceholder,typeof o.cacheBust>"u"?A.impl.options.cacheBust=E.cacheBust:A.impl.options.cacheBust=o.cacheBust}function J(o,n){return N(o,n).then(e.makeImage).then(e.delay(100)).then(function(c){var h=i(o);return h.getContext("2d").drawImage(c,0,0),h});function i(c){var h=document.createElement("canvas");if(h.width=n.width||e.width(c),h.height=n.height||e.height(c),n.bgcolor){var d=h.getContext("2d");d.fillStyle=n.bgcolor,d.fillRect(0,0,h.width,h.height)}return h}}function V(o,n,i){if(!i&&n&&!n(o))return Promise.resolve();return Promise.resolve(o).then(c).then(function(a){return h(o,a,n)}).then(function(a){return d(o,a)});function c(a){return a instanceof HTMLCanvasElement?e.makeImage(a.toDataURL()):a.cloneNode(!1)}function h(a,l,T){var O=a.childNodes;if(O.length===0)return Promise.resolve(l);return b(l,e.asArray(O),T).then(function(){return l});function b(F,x,P){var B=Promise.resolve();return x.forEach(function(_){B=B.then(function(){return V(_,P)}).then(function(C){C&&F.appendChild(C)})}),B}}function d(a,l){if(!(l instanceof Element))return l;return Promise.resolve().then(T).then(O).then(b).then(F).then(function(){return l});function T(){x(window.getComputedStyle(a),l.style);function x(P,B){P.cssText?B.cssText=P.cssText:_(P,B);function _(C,M){e.asArray(C).forEach(function(t){M.setProperty(t,C.getPropertyValue(t),C.getPropertyPriority(t))})}}}function O(){[":before",":after"].forEach(function(P){x(P)});function x(P){var B=window.getComputedStyle(a,P),_=B.getPropertyValue("content");if(_===""||_==="none")return;var C=e.uid();l.className=l.className+" "+C;var M=document.createElement("style");M.appendChild(t(C,P,B)),l.appendChild(M);function t(u,w,p){var L="."+u+":"+w,U=p.cssText?W(p):K(p);return document.createTextNode(L+"{"+U+"}");function W(R){var j=R.getPropertyValue("content");return R.cssText+" content: "+j+";"}function K(R){return e.asArray(R).map(j).join("; ")+";";function j(z){return z+": "+R.getPropertyValue(z)+(R.getPropertyPriority(z)?" !important":"")}}}}}function b(){a instanceof HTMLTextAreaElement&&(l.innerHTML=a.value),a instanceof HTMLInputElement&&l.setAttribute("value",a.value)}function F(){l instanceof SVGElement&&(l.setAttribute("xmlns","http://www.w3.org/2000/svg"),l instanceof SVGRectElement&&["width","height"].forEach(function(x){var P=l.getAttribute(x);P&&l.style.setProperty(x,P)}))}}}function q(o){return y.resolveAll().then(function(n){var i=document.createElement("style");return o.appendChild(i),i.appendChild(document.createTextNode(n)),o})}function X(o){return S.inlineAll(o).then(function(){return o})}function G(o,n,i){return Promise.resolve(o).then(function(c){return c.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),new XMLSerializer().serializeToString(c)}).then(e.escapeXhtml).then(function(c){return'<foreignObject x="0" y="0" width="100%" height="100%">'+c+"</foreignObject>"}).then(function(c){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+n+'" height="'+i+'">'+c+"</svg>"}).then(function(c){return"data:image/svg+xml;charset=utf-8,"+c})}function D(){return{escape:F,parseExtension:n,mimeType:i,dataAsUrl:b,isDataUrl:c,canvasToBlob:d,resolveUrl:a,getAndEncode:O,uid:l(),delay:x,asArray:P,escapeXhtml:B,makeImage:T,width:_,height:C};function o(){var t="application/font-woff",u="image/jpeg";return{woff:t,woff2:t,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:u,jpeg:u,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml"}}function n(t){var u=/\.([^\.\/]*?)$/g.exec(t);return u?u[1]:""}function i(t){var u=n(t).toLowerCase();return o()[u]||""}function c(t){return t.search(/^(data:)/)!==-1}function h(t){return new Promise(function(u){for(var w=window.atob(t.toDataURL().split(",")[1]),p=w.length,L=new Uint8Array(p),U=0;U<p;U++)L[U]=w.charCodeAt(U);u(new Blob([L],{type:"image/png"}))})}function d(t){return t.toBlob?new Promise(function(u){t.toBlob(u)}):h(t)}function a(t,u){var w=document.implementation.createHTMLDocument(),p=w.createElement("base");w.head.appendChild(p);var L=w.createElement("a");return w.body.appendChild(L),p.href=u,L.href=t,L.href}function l(){var t=0;return function(){return"u"+u()+t++;function u(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)}}}function T(t){return new Promise(function(u,w){var p=new Image;p.onload=function(){u(p)},p.onerror=w,p.src=t})}function O(t){var u=3e4;return A.impl.options.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime()),new Promise(function(w){var p=new XMLHttpRequest;p.onreadystatechange=W,p.ontimeout=K,p.responseType="blob",p.timeout=u,p.open("GET",t,!0),p.send();var L;if(A.impl.options.imagePlaceholder){var U=A.impl.options.imagePlaceholder.split(/,/);U&&U[1]&&(L=U[1])}function W(){if(p.readyState===4){if(p.status!==200){L?w(L):R("cannot fetch resource: "+t+", status: "+p.status);return}var j=new FileReader;j.onloadend=function(){var z=j.result.split(/,/)[1];w(z)},j.readAsDataURL(p.response)}}function K(){L?w(L):R("timeout of "+u+"ms occured while fetching resource: "+t)}function R(j){console.error(j),w("")}})}function b(t,u){return"data:"+u+";base64,"+t}function F(t){return t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1")}function x(t){return function(u){return new Promise(function(w){setTimeout(function(){w(u)},t)})}}function P(t){for(var u=[],w=t.length,p=0;p<w;p++)u.push(t[p]);return u}function B(t){return t.replace(/#/g,"%23").replace(/\n/g,"%0A")}function _(t){var u=M(t,"border-left-width"),w=M(t,"border-right-width");return t.scrollWidth+u+w}function C(t){var u=M(t,"border-top-width"),w=M(t,"border-bottom-width");return t.scrollHeight+u+w}function M(t,u){var w=window.getComputedStyle(t).getPropertyValue(u);return parseFloat(w.replace("px",""))}}function se(){var o=/url\(['"]?([^'"]+?)['"]?\)/g;return{inlineAll:h,shouldProcess:n,impl:{readUrls:i,inline:c}};function n(d){return d.search(o)!==-1}function i(d){for(var a=[],l;(l=o.exec(d))!==null;)a.push(l[1]);return a.filter(function(T){return!e.isDataUrl(T)})}function c(d,a,l,T){return Promise.resolve(a).then(function(b){return l?e.resolveUrl(b,l):b}).then(T||e.getAndEncode).then(function(b){return e.dataAsUrl(b,e.mimeType(a))}).then(function(b){return d.replace(O(a),"$1"+b+"$3")});function O(b){return new RegExp(`(url\\(['"]?)(`+e.escape(b)+`)(['"]?\\))`,"g")}}function h(d,a,l){if(T())return Promise.resolve(d);return Promise.resolve(d).then(i).then(function(O){var b=Promise.resolve(d);return O.forEach(function(F){b=b.then(function(x){return c(x,F,a,l)})}),b});function T(){return!n(d)}}}function ce(){return{resolveAll:o,impl:{readAll:n}};function o(){return n().then(function(i){return Promise.all(i.map(function(c){return c.resolve()}))}).then(function(i){return i.join(`
`)})}function n(){return Promise.resolve(e.asArray(document.styleSheets)).then(c).then(i).then(function(d){return d.map(h)});function i(d){return d.filter(function(a){return a.type===CSSRule.FONT_FACE_RULE}).filter(function(a){return s.shouldProcess(a.style.getPropertyValue("src"))})}function c(d){var a=[];return d.forEach(function(l){try{e.asArray(l.cssRules||[]).forEach(a.push.bind(a))}catch(T){console.log("Error while reading CSS rules from "+l.href,T.toString())}}),a}function h(d){return{resolve:function(){var l=(d.parentStyleSheet||{}).href;return s.inlineAll(d.cssText,l)},src:function(){return d.style.getPropertyValue("src")}}}}}function le(){return{inlineAll:n,impl:{newImage:o}};function o(i){return{inline:c};function c(h){return e.isDataUrl(i.src)?Promise.resolve():Promise.resolve(i.src).then(h||e.getAndEncode).then(function(d){return e.dataAsUrl(d,e.mimeType(i.src))}).then(function(d){return new Promise(function(a,l){i.onload=a,i.onerror=l,i.src=d})})}}function n(i){if(!(i instanceof Element))return Promise.resolve(i);return c(i).then(function(){return i instanceof HTMLImageElement?o(i).inline():Promise.all(e.asArray(i.childNodes).map(function(h){return n(h)}))});function c(h){var d=h.style.getPropertyValue("background");return d?s.inlineAll(d).then(function(a){h.style.setProperty("background",a,h.style.getPropertyPriority("background"))}).then(function(){return h}):Promise.resolve(h)}}}})()})(ie);var de=ie.exports;const fe=ue(de);var me={exports:{}};(function(r,m){(function(e,s){s()})($,function(){function e(f,g){return typeof g>"u"?g={autoBom:!1}:typeof g!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),g={autoBom:!g}),g.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(f.type)?new Blob(["\uFEFF",f],{type:f.type}):f}function s(f,g,k){var v=new XMLHttpRequest;v.open("GET",f),v.responseType="blob",v.onload=function(){N(v.response,g,k)},v.onerror=function(){console.error("could not download file")},v.send()}function y(f){var g=new XMLHttpRequest;g.open("HEAD",f,!1);try{g.send()}catch{}return 200<=g.status&&299>=g.status}function S(f){try{f.dispatchEvent(new MouseEvent("click"))}catch{var g=document.createEvent("MouseEvents");g.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),f.dispatchEvent(g)}}var E=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof $=="object"&&$.global===$?$:void 0,A=E.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),N=E.saveAs||(typeof window!="object"||window!==E?function(){}:"download"in HTMLAnchorElement.prototype&&!A?function(f,g,k){var v=E.URL||E.webkitURL,I=document.createElement("a");g=g||f.name||"download",I.download=g,I.rel="noopener",typeof f=="string"?(I.href=f,I.origin===location.origin?S(I):y(I.href)?s(f,g,k):S(I,I.target="_blank")):(I.href=v.createObjectURL(f),setTimeout(function(){v.revokeObjectURL(I.href)},4e4),setTimeout(function(){S(I)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,k){if(g=g||f.name||"download",typeof f!="string")navigator.msSaveOrOpenBlob(e(f,k),g);else if(y(f))s(f,g,k);else{var v=document.createElement("a");v.href=f,v.target="_blank",setTimeout(function(){S(v)})}}:function(f,g,k,v){if(v=v||open("","_blank"),v&&(v.document.title=v.document.body.innerText="downloading..."),typeof f=="string")return s(f,g,k);var I=f.type==="application/octet-stream",J=/constructor/i.test(E.HTMLElement)||E.safari,V=/CriOS\/[\d]+/.test(navigator.userAgent);if((V||I&&J||A)&&typeof FileReader<"u"){var q=new FileReader;q.onloadend=function(){var D=q.result;D=V?D:D.replace(/^data:[^;]*;/,"data:attachment/file;"),v?v.location.href=D:location=D,v=null},q.readAsDataURL(f)}else{var X=E.URL||E.webkitURL,G=X.createObjectURL(f);v?v.location=G:location.href=G,v=null,setTimeout(function(){X.revokeObjectURL(G)},4e4)}});E.saveAs=N.saveAs=N,r.exports=N})})(me);const ne="4b027ab3c8dd4b1f9ef6d083d0b51fb5",ge=new URLSearchParams(window.location.search),re=ge.get("code");var Y="short_term",oe="'s Mix Vol. 1";let H,Q,Z,ee,te;function he(){sessionStorage.clear()}document.getElementById("logout").addEventListener("click",he);var pe=document.getElementById("info-button"),ye=document.getElementById("close-info");pe.addEventListener("click",function(){const r=document.querySelector("body");r.classList.contains("show-info")?r.classList.remove("show-info"):r.classList.add("show-info")});ye.addEventListener("click",function(){document.querySelector("body").classList.remove("show-info")});if(!re)document.getElementById("log-in-button").addEventListener("click",function(){ve(ne)});else{const r=document.getElementById("loading");r.style.display="flex",sessionStorage.getItem("accessToken")?H=JSON.parse(sessionStorage.getItem("accessToken")):(H=await Ee(ne,re),sessionStorage.setItem("accessToken",JSON.stringify(H))),sessionStorage.getItem("profile")?Q=JSON.parse(sessionStorage.getItem("profile")):(Q=await be(H),sessionStorage.setItem("profile",JSON.stringify(Q))),sessionStorage.getItem("tracksShort")?Z=JSON.parse(sessionStorage.getItem("tracksShort")):(Z=await Ie(H),sessionStorage.setItem("tracksShort",JSON.stringify(Z))),sessionStorage.getItem("tracksMedium")?ee=JSON.parse(sessionStorage.getItem("tracksMedium")):(ee=await Pe(H),sessionStorage.setItem("tracksMedium",JSON.stringify(ee))),sessionStorage.getItem("tracksLong")?te=JSON.parse(sessionStorage.getItem("tracksLong")):(te=await Le(H),sessionStorage.setItem("tracksLong",JSON.stringify(te))),window.profile=JSON.parse(sessionStorage.getItem("profile")),window.tracksShort=JSON.parse(sessionStorage.getItem("tracksShort")),window.tracksMedium=JSON.parse(sessionStorage.getItem("tracksMedium")),window.tracksLong=JSON.parse(sessionStorage.getItem("tracksLong")),ae(window.profile,window.tracksShort),window.innerWidth<500&&(document.getElementById("mix-head").style.display="block",document.getElementById("mix-tag").style.display="block"),document.querySelector("body").classList.remove("lock-scroll"),r.style.display="none"}window.addEventListener("resize",function(){window.innerWidth>499?(document.getElementById("mix-head").style.display="none",document.getElementById("mix-tag").style.display="none"):(document.getElementById("mix-head").style.display="block",document.getElementById("mix-tag").style.display="block")});async function ve(r){const m=we(128),e=await Se(m);sessionStorage.setItem("verifier",m);const s=new URLSearchParams;s.append("client_id",r),s.append("response_type","code"),s.append("redirect_uri","http://localhost:4173/callback"),s.append("scope","user-top-read"),s.append("code_challenge_method","S256"),s.append("code_challenge",e),document.location=`https://accounts.spotify.com/authorize?${s.toString()}`}function we(r){let m="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let s=0;s<r;s++)m+=e.charAt(Math.floor(Math.random()*e.length));return m}async function Se(r){const m=new TextEncoder().encode(r),e=await window.crypto.subtle.digest("SHA-256",m);return btoa(String.fromCharCode.apply(null,[...new Uint8Array(e)])).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function Ee(r,m){const e=sessionStorage.getItem("verifier"),s=new URLSearchParams;s.append("client_id",r),s.append("grant_type","authorization_code"),s.append("code",m),s.append("redirect_uri","http://localhost:4173/callback"),s.append("code_verifier",e);const y=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:s}),{access_token:S}=await y.json();return S}async function be(r){return await(await fetch("https://api.spotify.com/v1/me/",{method:"GET",headers:{Authorization:`Bearer ${r}`}})).json()}async function Ie(r){return await(await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term",{method:"GET",headers:{Authorization:`Bearer ${r}`}})).json()}async function Pe(r){return await(await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term",{method:"GET",headers:{Authorization:`Bearer ${r}`}})).json()}async function Le(r){return await(await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term",{method:"GET",headers:{Authorization:`Bearer ${r}`}})).json()}function Ae(r){var m=r.artists,e="";return m.forEach(s=>{e+=s.name+", "}),e.slice(0,-2)}function ae(r,m){const e=new Date;var s=e.getMonth()+1+"/"+e.getDate()+"/"+e.getFullYear();document.getElementById("date").innerHTML=s,document.getElementById("cassette-title").innerText=r.display_name+oe,document.getElementById("mixtape-name-input").value=r.display_name+oe,document.getElementById("start-container").style.display="none",document.getElementById("customize-container").style.display="flex";for(var y=0;y<20;y++){var S=m.items[y],E=S.name,A=Ae(S);document.getElementById("track-"+(y+1)).innerHTML=E+" - "+A}}document.querySelectorAll(".time-range-option").forEach(r=>{r.addEventListener("click",function(){if(!this.classList.contains("active")){document.querySelectorAll(".time-range-option").forEach(s=>{s.classList.remove("active")}),this.classList.add("active"),Y=this.id;const m={"short-term":window.tracksShort,"medium-term":window.tracksMedium,"long-term":window.tracksLong},e={"short-term":"Last month","medium-term":"Last 6 months","long-term":"All time"};ae(window.profile,m[Y]),document.getElementById("time").innerHTML=e[Y]}})});document.getElementById("mixtape-name-input").addEventListener("input",Te);function Te(r){document.getElementById("cassette-title").innerHTML=r.target.value}sessionStorage.getItem("cardBg")||sessionStorage.setItem("cardBg",window.getComputedStyle(document.documentElement).getPropertyValue("--card-bg"));sessionStorage.getItem("bgColor")||sessionStorage.setItem("bgColor",window.getComputedStyle(document.documentElement).getPropertyValue("--bg-color"));sessionStorage.getItem("activeColor")||sessionStorage.setItem("activeColor","color-1");document.documentElement.style.setProperty("--card-bg",sessionStorage.getItem("cardBg"));document.documentElement.style.setProperty("--bg-color",sessionStorage.getItem("bgColor"));document.querySelectorAll(".color-button").forEach(r=>{r.classList.remove("active")});document.getElementById(sessionStorage.getItem("activeColor")).classList.add("active");document.querySelectorAll(".color-button").forEach(r=>{r.addEventListener("click",function(){if(!this.classList.contains("active")){document.querySelectorAll(".color-button").forEach(s=>{s.classList.remove("active")}),this.classList.add("active");const m=window.getComputedStyle(document.documentElement).getPropertyValue("--"+this.id),e=window.getComputedStyle(document.documentElement).getPropertyValue("--bg-"+this.id);document.documentElement.style.setProperty("--card-bg",m),document.documentElement.style.setProperty("--bg-color",e),sessionStorage.setItem("cardBg",m),sessionStorage.setItem("bgColor",e),sessionStorage.setItem("activeColor",this.id)}})});function ke(){var r=document.getElementById("mixtape-container");fe.toBlob(r).then(function(m){window.saveAs(m,"mixtape.png")})}document.getElementById("save-and-share").addEventListener("click",ke);
