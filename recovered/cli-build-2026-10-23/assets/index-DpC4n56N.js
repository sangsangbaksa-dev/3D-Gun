(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hh="170",Ig=0,Du=1,zg=2,k0=1,Ug=2,Ti=3,ls=0,gn=1,be=2,rs=0,Hs=1,ui=2,Iu=3,zu=4,Ng=5,Ls=100,Fg=101,Og=102,Bg=103,Hg=104,Gg=200,Vg=201,Wg=202,$g=203,Ed=204,Td=205,Xg=206,qg=207,Yg=208,jg=209,Kg=210,Zg=211,Jg=212,Qg=213,tx=214,Ad=0,Cd=1,Rd=2,Xo=3,kd=4,Pd=5,Ld=6,Dd=7,Gh=0,ex=1,nx=2,as=0,ix=1,sx=2,ox=3,rx=4,ax=5,cx=6,lx=7,P0=300,qo=301,Yo=302,Id=303,zd=304,Dc=306,Ud=1e3,Us=1001,Nd=1002,Pn=1003,dx=1004,ca=1005,ci=1006,qc=1007,Ns=1008,zi=1009,L0=1010,D0=1011,$r=1012,Vh=1013,Ys=1014,li=1015,ta=1016,Wh=1017,$h=1018,jo=1020,I0=35902,z0=1021,U0=1022,ni=1023,N0=1024,F0=1025,Bo=1026,Ko=1027,Xh=1028,qh=1029,O0=1030,Yh=1031,jh=1033,sc=33776,oc=33777,rc=33778,ac=33779,Fd=35840,Od=35841,Bd=35842,Hd=35843,Gd=36196,Vd=37492,Wd=37496,$d=37808,Xd=37809,qd=37810,Yd=37811,jd=37812,Kd=37813,Zd=37814,Jd=37815,Qd=37816,th=37817,eh=37818,nh=37819,ih=37820,sh=37821,cc=36492,oh=36494,rh=36495,B0=36283,ah=36284,ch=36285,lh=36286,hx=3200,ux=3201,Kh=0,fx=1,ns="",mn="srgb",nr="srgb-linear",Ic="linear",me="srgb",eo=7680,Uu=519,px=512,mx=513,gx=514,H0=515,xx=516,vx=517,yx=518,bx=519,dh=35044,Nu="300 es",Ci=2e3,yc=2001;class ir{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Yc=Math.PI/180,hh=180/Math.PI;function Pi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[i&255]+sn[i>>8&255]+sn[i>>16&255]+sn[i>>24&255]+"-"+sn[t&255]+sn[t>>8&255]+"-"+sn[t>>16&15|64]+sn[t>>24&255]+"-"+sn[e&63|128]+sn[e>>8&255]+"-"+sn[e>>16&255]+sn[e>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function an(i,t,e){return Math.max(t,Math.min(e,i))}function Mx(i,t){return(i%t+t)%t}function jc(i,t,e){return(1-e)*i+e*t}function ai(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(an(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xt{constructor(t,e,n,s,o,r,a,c,l){Xt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l)}set(t,e,n,s,o,r,a,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=a,d[3]=e,d[4]=o,d[5]=c,d[6]=n,d[7]=r,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],c=n[6],l=n[1],d=n[4],h=n[7],u=n[2],f=n[5],g=n[8],x=s[0],p=s[3],m=s[6],_=s[1],b=s[4],v=s[7],I=s[2],T=s[5],A=s[8];return o[0]=r*x+a*_+c*I,o[3]=r*p+a*b+c*T,o[6]=r*m+a*v+c*A,o[1]=l*x+d*_+h*I,o[4]=l*p+d*b+h*T,o[7]=l*m+d*v+h*A,o[2]=u*x+f*_+g*I,o[5]=u*p+f*b+g*T,o[8]=u*m+f*v+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],d=t[8];return e*r*d-e*a*l-n*o*d+n*a*c+s*o*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],d=t[8],h=d*r-a*l,u=a*c-d*o,f=l*o-r*c,g=e*h+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=h*x,t[1]=(s*l-d*n)*x,t[2]=(a*n-s*r)*x,t[3]=u*x,t[4]=(d*e-s*c)*x,t[5]=(s*o-a*e)*x,t[6]=f*x,t[7]=(n*c-l*e)*x,t[8]=(r*e-n*o)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*r+l*a)+r+t,-s*l,s*c,-s*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Kc.makeScale(t,e)),this}rotate(t){return this.premultiply(Kc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Kc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Kc=new Xt;function G0(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function bc(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _x(){const i=bc("canvas");return i.style.display="block",i}const Fu={};function kr(i){i in Fu||(Fu[i]=!0,console.warn(i))}function wx(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}function Sx(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ex(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ee={enabled:!0,workingColorSpace:nr,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===me&&(i.r=Li(i.r),i.g=Li(i.g),i.b=Li(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===me&&(i.r=Ho(i.r),i.g=Ho(i.g),i.b=Ho(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ns?Ic:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ho(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Ou=[.64,.33,.3,.6,.15,.06],Bu=[.2126,.7152,.0722],Hu=[.3127,.329],Gu=new Xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vu=new Xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ee.define({[nr]:{primaries:Ou,whitePoint:Hu,transfer:Ic,toXYZ:Gu,fromXYZ:Vu,luminanceCoefficients:Bu,workingColorSpaceConfig:{unpackColorSpace:mn},outputColorSpaceConfig:{drawingBufferColorSpace:mn}},[mn]:{primaries:Ou,whitePoint:Hu,transfer:me,toXYZ:Gu,fromXYZ:Vu,luminanceCoefficients:Bu,outputColorSpaceConfig:{drawingBufferColorSpace:mn}}});let no;class Tx{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{no===void 0&&(no=bc("canvas")),no.width=t.width,no.height=t.height;const n=no.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=no}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=bc("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=Li(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Li(e[n]/255)*255):e[n]=Li(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ax=0;class V0{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ax++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(Zc(s[r].image)):o.push(Zc(s[r]))}else o=Zc(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function Zc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Tx.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Cx=0;class cn extends ir{constructor(t=cn.DEFAULT_IMAGE,e=cn.DEFAULT_MAPPING,n=Us,s=Us,o=ci,r=Ns,a=ni,c=zi,l=cn.DEFAULT_ANISOTROPY,d=ns){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cx++}),this.uuid=Pi(),this.name="",this.source=new V0(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==P0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ud:t.x=t.x-Math.floor(t.x);break;case Us:t.x=t.x<0?0:1;break;case Nd:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ud:t.y=t.y-Math.floor(t.y);break;case Us:t.y=t.y<0?0:1;break;case Nd:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=P0;cn.DEFAULT_ANISOTROPY=1;class xe{constructor(t=0,e=0,n=0,s=1){xe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],d=c[4],h=c[8],u=c[1],f=c[5],g=c[9],x=c[2],p=c[6],m=c[10];if(Math.abs(d-u)<.01&&Math.abs(h-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(l+1)/2,v=(f+1)/2,I=(m+1)/2,T=(d+u)/4,A=(h+x)/4,C=(g+p)/4;return b>v&&b>I?b<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(b),s=T/n,o=A/n):v>I?v<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(v),n=T/s,o=C/s):I<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(I),n=A/o,s=C/o),this.set(n,s,o,e),this}let _=Math.sqrt((p-g)*(p-g)+(h-x)*(h-x)+(u-d)*(u-d));return Math.abs(_)<.001&&(_=1),this.x=(p-g)/_,this.y=(h-x)/_,this.z=(u-d)/_,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Rx extends ir{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new xe(0,0,t,e),this.scissorTest=!1,this.viewport=new xe(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ci,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const o=new cn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);o.flipY=!1,o.generateMipmaps=n.generateMipmaps,o.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new V0(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class js extends Rx{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class W0 extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class kx extends cn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $n{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let c=n[s+0],l=n[s+1],d=n[s+2],h=n[s+3];const u=o[r+0],f=o[r+1],g=o[r+2],x=o[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h;return}if(a===1){t[e+0]=u,t[e+1]=f,t[e+2]=g,t[e+3]=x;return}if(h!==x||c!==u||l!==f||d!==g){let p=1-a;const m=c*u+l*f+d*g+h*x,_=m>=0?1:-1,b=1-m*m;if(b>Number.EPSILON){const I=Math.sqrt(b),T=Math.atan2(I,m*_);p=Math.sin(p*T)/I,a=Math.sin(a*T)/I}const v=a*_;if(c=c*p+u*v,l=l*p+f*v,d=d*p+g*v,h=h*p+x*v,p===1-a){const I=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=I,l*=I,d*=I,h*=I}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],c=n[s+1],l=n[s+2],d=n[s+3],h=o[r],u=o[r+1],f=o[r+2],g=o[r+3];return t[e]=a*g+d*h+c*f-l*u,t[e+1]=c*g+d*u+l*h-a*f,t[e+2]=l*g+d*f+a*u-c*h,t[e+3]=d*g-a*h-c*u-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(n/2),d=a(s/2),h=a(o/2),u=c(n/2),f=c(s/2),g=c(o/2);switch(r){case"XYZ":this._x=u*d*h+l*f*g,this._y=l*f*h-u*d*g,this._z=l*d*g+u*f*h,this._w=l*d*h-u*f*g;break;case"YXZ":this._x=u*d*h+l*f*g,this._y=l*f*h-u*d*g,this._z=l*d*g-u*f*h,this._w=l*d*h+u*f*g;break;case"ZXY":this._x=u*d*h-l*f*g,this._y=l*f*h+u*d*g,this._z=l*d*g+u*f*h,this._w=l*d*h-u*f*g;break;case"ZYX":this._x=u*d*h-l*f*g,this._y=l*f*h+u*d*g,this._z=l*d*g-u*f*h,this._w=l*d*h+u*f*g;break;case"YZX":this._x=u*d*h+l*f*g,this._y=l*f*h+u*d*g,this._z=l*d*g-u*f*h,this._w=l*d*h-u*f*g;break;case"XZY":this._x=u*d*h-l*f*g,this._y=l*f*h-u*d*g,this._z=l*d*g+u*f*h,this._w=l*d*h+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],c=e[9],l=e[2],d=e[6],h=e[10],u=n+a+h;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(d-c)*f,this._y=(o-l)*f,this._z=(r-s)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(d-c)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(o+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(o-l)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(r-s)/f,this._x=(o+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(an(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+r*a+s*l-o*c,this._y=s*d+r*c+o*a-n*l,this._z=o*d+r*l+n*c-s*a,this._w=r*d-n*a-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*r+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,a),h=Math.sin((1-e)*d)/l,u=Math.sin(e*d)/l;return this._w=r*h+this._w*u,this._x=n*h+this._x*u,this._y=s*h+this._y*u,this._z=o*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Wu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Wu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*s-a*n),d=2*(a*e-o*s),h=2*(o*n-r*e);return this.x=e+c*l+r*h-a*d,this.y=n+c*d+a*l-o*h,this.z=s+c*h+o*d-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,c=e.z;return this.x=s*c-o*a,this.y=o*r-n*c,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Jc.copy(this).projectOnVector(t),this.sub(Jc)}reflect(t){return this.sub(Jc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(an(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jc=new L,Wu=new $n;class hs{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Yn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Yn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Yn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,Yn):Yn.fromBufferAttribute(o,r),Yn.applyMatrix4(t.matrixWorld),this.expandByPoint(Yn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),la.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),la.copy(n.boundingBox)),la.applyMatrix4(t.matrixWorld),this.union(la)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Yn),Yn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(dr),da.subVectors(this.max,dr),io.subVectors(t.a,dr),so.subVectors(t.b,dr),oo.subVectors(t.c,dr),Hi.subVectors(so,io),Gi.subVectors(oo,so),ms.subVectors(io,oo);let e=[0,-Hi.z,Hi.y,0,-Gi.z,Gi.y,0,-ms.z,ms.y,Hi.z,0,-Hi.x,Gi.z,0,-Gi.x,ms.z,0,-ms.x,-Hi.y,Hi.x,0,-Gi.y,Gi.x,0,-ms.y,ms.x,0];return!Qc(e,io,so,oo,da)||(e=[1,0,0,0,1,0,0,0,1],!Qc(e,io,so,oo,da))?!1:(ha.crossVectors(Hi,Gi),e=[ha.x,ha.y,ha.z],Qc(e,io,so,oo,da))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Yn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Yn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const vi=[new L,new L,new L,new L,new L,new L,new L,new L],Yn=new L,la=new hs,io=new L,so=new L,oo=new L,Hi=new L,Gi=new L,ms=new L,dr=new L,da=new L,ha=new L,gs=new L;function Qc(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){gs.fromArray(i,o);const a=s.x*Math.abs(gs.x)+s.y*Math.abs(gs.y)+s.z*Math.abs(gs.z),c=t.dot(gs),l=e.dot(gs),d=n.dot(gs);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>a)return!1}return!0}const Px=new hs,hr=new L,tl=new L;class Qs{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Px.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hr.subVectors(t,this.center);const e=hr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(hr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(tl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hr.copy(t.center).add(tl)),this.expandByPoint(hr.copy(t.center).sub(tl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const yi=new L,el=new L,ua=new L,Vi=new L,nl=new L,fa=new L,il=new L;class Zh{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,yi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=yi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(yi.copy(this.origin).addScaledVector(this.direction,e),yi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){el.copy(t).add(e).multiplyScalar(.5),ua.copy(e).sub(t).normalize(),Vi.copy(this.origin).sub(el);const o=t.distanceTo(e)*.5,r=-this.direction.dot(ua),a=Vi.dot(this.direction),c=-Vi.dot(ua),l=Vi.lengthSq(),d=Math.abs(1-r*r);let h,u,f,g;if(d>0)if(h=r*c-a,u=r*a-c,g=o*d,h>=0)if(u>=-g)if(u<=g){const x=1/d;h*=x,u*=x,f=h*(h+r*u+2*a)+u*(r*h+u+2*c)+l}else u=o,h=Math.max(0,-(r*u+a)),f=-h*h+u*(u+2*c)+l;else u=-o,h=Math.max(0,-(r*u+a)),f=-h*h+u*(u+2*c)+l;else u<=-g?(h=Math.max(0,-(-r*o+a)),u=h>0?-o:Math.min(Math.max(-o,-c),o),f=-h*h+u*(u+2*c)+l):u<=g?(h=0,u=Math.min(Math.max(-o,-c),o),f=u*(u+2*c)+l):(h=Math.max(0,-(r*o+a)),u=h>0?o:Math.min(Math.max(-o,-c),o),f=-h*h+u*(u+2*c)+l);else u=r>0?-o:o,h=Math.max(0,-(r*u+a)),f=-h*h+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(el).addScaledVector(ua,u),f}intersectSphere(t,e){yi.subVectors(t.center,this.origin);const n=yi.dot(this.direction),s=yi.dot(yi)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,c=n+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,c;const l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,s=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,s=(t.min.x-u.x)*l),d>=0?(o=(t.min.y-u.y)*d,r=(t.max.y-u.y)*d):(o=(t.max.y-u.y)*d,r=(t.min.y-u.y)*d),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),h>=0?(a=(t.min.z-u.z)*h,c=(t.max.z-u.z)*h):(a=(t.max.z-u.z)*h,c=(t.min.z-u.z)*h),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,yi)!==null}intersectTriangle(t,e,n,s,o){nl.subVectors(e,t),fa.subVectors(n,t),il.crossVectors(nl,fa);let r=this.direction.dot(il),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;Vi.subVectors(this.origin,t);const c=a*this.direction.dot(fa.crossVectors(Vi,fa));if(c<0)return null;const l=a*this.direction.dot(nl.cross(Vi));if(l<0||c+l>r)return null;const d=-a*Vi.dot(il);return d<0?null:this.at(d/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt{constructor(t,e,n,s,o,r,a,c,l,d,h,u,f,g,x,p){Kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l,d,h,u,f,g,x,p)}set(t,e,n,s,o,r,a,c,l,d,h,u,f,g,x,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=o,m[5]=r,m[9]=a,m[13]=c,m[2]=l,m[6]=d,m[10]=h,m[14]=u,m[3]=f,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ro.setFromMatrixColumn(t,0).length(),o=1/ro.setFromMatrixColumn(t,1).length(),r=1/ro.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(o),h=Math.sin(o);if(t.order==="XYZ"){const u=r*d,f=r*h,g=a*d,x=a*h;e[0]=c*d,e[4]=-c*h,e[8]=l,e[1]=f+g*l,e[5]=u-x*l,e[9]=-a*c,e[2]=x-u*l,e[6]=g+f*l,e[10]=r*c}else if(t.order==="YXZ"){const u=c*d,f=c*h,g=l*d,x=l*h;e[0]=u+x*a,e[4]=g*a-f,e[8]=r*l,e[1]=r*h,e[5]=r*d,e[9]=-a,e[2]=f*a-g,e[6]=x+u*a,e[10]=r*c}else if(t.order==="ZXY"){const u=c*d,f=c*h,g=l*d,x=l*h;e[0]=u-x*a,e[4]=-r*h,e[8]=g+f*a,e[1]=f+g*a,e[5]=r*d,e[9]=x-u*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const u=r*d,f=r*h,g=a*d,x=a*h;e[0]=c*d,e[4]=g*l-f,e[8]=u*l+x,e[1]=c*h,e[5]=x*l+u,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const u=r*c,f=r*l,g=a*c,x=a*l;e[0]=c*d,e[4]=x-u*h,e[8]=g*h+f,e[1]=h,e[5]=r*d,e[9]=-a*d,e[2]=-l*d,e[6]=f*h+g,e[10]=u-x*h}else if(t.order==="XZY"){const u=r*c,f=r*l,g=a*c,x=a*l;e[0]=c*d,e[4]=-h,e[8]=l*d,e[1]=u*h+x,e[5]=r*d,e[9]=f*h-g,e[2]=g*h-f,e[6]=a*d,e[10]=x*h+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Lx,t,Dx)}lookAt(t,e,n){const s=this.elements;return En.subVectors(t,e),En.lengthSq()===0&&(En.z=1),En.normalize(),Wi.crossVectors(n,En),Wi.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Wi.crossVectors(n,En)),Wi.normalize(),pa.crossVectors(En,Wi),s[0]=Wi.x,s[4]=pa.x,s[8]=En.x,s[1]=Wi.y,s[5]=pa.y,s[9]=En.y,s[2]=Wi.z,s[6]=pa.z,s[10]=En.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],c=n[8],l=n[12],d=n[1],h=n[5],u=n[9],f=n[13],g=n[2],x=n[6],p=n[10],m=n[14],_=n[3],b=n[7],v=n[11],I=n[15],T=s[0],A=s[4],C=s[8],y=s[12],M=s[1],R=s[5],z=s[9],D=s[13],V=s[2],K=s[6],j=s[10],et=s[14],q=s[3],lt=s[7],gt=s[11],At=s[15];return o[0]=r*T+a*M+c*V+l*q,o[4]=r*A+a*R+c*K+l*lt,o[8]=r*C+a*z+c*j+l*gt,o[12]=r*y+a*D+c*et+l*At,o[1]=d*T+h*M+u*V+f*q,o[5]=d*A+h*R+u*K+f*lt,o[9]=d*C+h*z+u*j+f*gt,o[13]=d*y+h*D+u*et+f*At,o[2]=g*T+x*M+p*V+m*q,o[6]=g*A+x*R+p*K+m*lt,o[10]=g*C+x*z+p*j+m*gt,o[14]=g*y+x*D+p*et+m*At,o[3]=_*T+b*M+v*V+I*q,o[7]=_*A+b*R+v*K+I*lt,o[11]=_*C+b*z+v*j+I*gt,o[15]=_*y+b*D+v*et+I*At,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],c=t[9],l=t[13],d=t[2],h=t[6],u=t[10],f=t[14],g=t[3],x=t[7],p=t[11],m=t[15];return g*(+o*c*h-s*l*h-o*a*u+n*l*u+s*a*f-n*c*f)+x*(+e*c*f-e*l*u+o*r*u-s*r*f+s*l*d-o*c*d)+p*(+e*l*h-e*a*f-o*r*h+n*r*f+o*a*d-n*l*d)+m*(-s*a*d-e*c*h+e*a*u+s*r*h-n*r*u+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],d=t[8],h=t[9],u=t[10],f=t[11],g=t[12],x=t[13],p=t[14],m=t[15],_=h*p*l-x*u*l+x*c*f-a*p*f-h*c*m+a*u*m,b=g*u*l-d*p*l-g*c*f+r*p*f+d*c*m-r*u*m,v=d*x*l-g*h*l+g*a*f-r*x*f-d*a*m+r*h*m,I=g*h*c-d*x*c-g*a*u+r*x*u+d*a*p-r*h*p,T=e*_+n*b+s*v+o*I;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=_*A,t[1]=(x*u*o-h*p*o-x*s*f+n*p*f+h*s*m-n*u*m)*A,t[2]=(a*p*o-x*c*o+x*s*l-n*p*l-a*s*m+n*c*m)*A,t[3]=(h*c*o-a*u*o-h*s*l+n*u*l+a*s*f-n*c*f)*A,t[4]=b*A,t[5]=(d*p*o-g*u*o+g*s*f-e*p*f-d*s*m+e*u*m)*A,t[6]=(g*c*o-r*p*o-g*s*l+e*p*l+r*s*m-e*c*m)*A,t[7]=(r*u*o-d*c*o+d*s*l-e*u*l-r*s*f+e*c*f)*A,t[8]=v*A,t[9]=(g*h*o-d*x*o-g*n*f+e*x*f+d*n*m-e*h*m)*A,t[10]=(r*x*o-g*a*o+g*n*l-e*x*l-r*n*m+e*a*m)*A,t[11]=(d*a*o-r*h*o-d*n*l+e*h*l+r*n*f-e*a*f)*A,t[12]=I*A,t[13]=(d*x*s-g*h*s+g*n*u-e*x*u-d*n*p+e*h*p)*A,t[14]=(g*a*s-r*x*s-g*n*c+e*x*c+r*n*p-e*a*p)*A,t[15]=(r*h*s-d*a*s+d*n*c-e*h*c-r*n*u+e*a*u)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,c=t.z,l=o*r,d=o*a;return this.set(l*r+n,l*a-s*c,l*c+s*a,0,l*a+s*c,d*a+n,d*c-s*r,0,l*c-s*a,d*c+s*r,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,c=e._w,l=o+o,d=r+r,h=a+a,u=o*l,f=o*d,g=o*h,x=r*d,p=r*h,m=a*h,_=c*l,b=c*d,v=c*h,I=n.x,T=n.y,A=n.z;return s[0]=(1-(x+m))*I,s[1]=(f+v)*I,s[2]=(g-b)*I,s[3]=0,s[4]=(f-v)*T,s[5]=(1-(u+m))*T,s[6]=(p+_)*T,s[7]=0,s[8]=(g+b)*A,s[9]=(p-_)*A,s[10]=(1-(u+x))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=ro.set(s[0],s[1],s[2]).length();const r=ro.set(s[4],s[5],s[6]).length(),a=ro.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],jn.copy(this);const l=1/o,d=1/r,h=1/a;return jn.elements[0]*=l,jn.elements[1]*=l,jn.elements[2]*=l,jn.elements[4]*=d,jn.elements[5]*=d,jn.elements[6]*=d,jn.elements[8]*=h,jn.elements[9]*=h,jn.elements[10]*=h,e.setFromRotationMatrix(jn),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=Ci){const c=this.elements,l=2*o/(e-t),d=2*o/(n-s),h=(e+t)/(e-t),u=(n+s)/(n-s);let f,g;if(a===Ci)f=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===yc)f=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=Ci){const c=this.elements,l=1/(e-t),d=1/(n-s),h=1/(r-o),u=(e+t)*l,f=(n+s)*d;let g,x;if(a===Ci)g=(r+o)*h,x=-2*h;else if(a===yc)g=o*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ro=new L,jn=new Kt,Lx=new L(0,0,0),Dx=new L(1,1,1),Wi=new L,pa=new L,En=new L,$u=new Kt,Xu=new $n;class _n{constructor(t=0,e=0,n=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],c=s[1],l=s[5],d=s[9],h=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(an(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-an(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,o),this._z=0);break;case"ZXY":this._x=Math.asin(an(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-an(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(an(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,o)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-an(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return $u.makeRotationFromQuaternion(t),this.setFromRotationMatrix($u,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xu.setFromEuler(this),this.setFromQuaternion(Xu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class $0{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ix=0;const qu=new L,ao=new $n,bi=new Kt,ma=new L,ur=new L,zx=new L,Ux=new $n,Yu=new L(1,0,0),ju=new L(0,1,0),Ku=new L(0,0,1),Zu={type:"added"},Nx={type:"removed"},co={type:"childadded",child:null},sl={type:"childremoved",child:null};class Re extends ir{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ix++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new L,e=new _n,n=new $n,s=new L(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Xt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ao.setFromAxisAngle(t,e),this.quaternion.multiply(ao),this}rotateOnWorldAxis(t,e){return ao.setFromAxisAngle(t,e),this.quaternion.premultiply(ao),this}rotateX(t){return this.rotateOnAxis(Yu,t)}rotateY(t){return this.rotateOnAxis(ju,t)}rotateZ(t){return this.rotateOnAxis(Ku,t)}translateOnAxis(t,e){return qu.copy(t).applyQuaternion(this.quaternion),this.position.add(qu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Yu,t)}translateY(t){return this.translateOnAxis(ju,t)}translateZ(t){return this.translateOnAxis(Ku,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ma.copy(t):ma.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ur.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bi.lookAt(ur,ma,this.up):bi.lookAt(ma,ur,this.up),this.quaternion.setFromRotationMatrix(bi),s&&(bi.extractRotation(s.matrixWorld),ao.setFromRotationMatrix(bi),this.quaternion.premultiply(ao.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zu),co.child=t,this.dispatchEvent(co),co.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nx),sl.child=t,this.dispatchEvent(sl),sl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bi.multiply(t.parent.matrixWorld)),t.applyMatrix4(bi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zu),co.child=t,this.dispatchEvent(co),co.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ur,t,zx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ur,Ux,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const h=c[l];o(t.shapes,h)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(o(t.materials,this.material[c]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(o(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),d=r(t.images),h=r(t.shapes),u=r(t.skeletons),f=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const c=[];for(const l in a){const d=a[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Re.DEFAULT_UP=new L(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Kn=new L,Mi=new L,ol=new L,_i=new L,lo=new L,ho=new L,Ju=new L,rl=new L,al=new L,cl=new L,ll=new xe,dl=new xe,hl=new xe;class Bn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Kn.subVectors(t,e),s.cross(Kn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){Kn.subVectors(s,e),Mi.subVectors(n,e),ol.subVectors(t,e);const r=Kn.dot(Kn),a=Kn.dot(Mi),c=Kn.dot(ol),l=Mi.dot(Mi),d=Mi.dot(ol),h=r*l-a*a;if(h===0)return o.set(0,0,0),null;const u=1/h,f=(l*c-a*d)*u,g=(r*d-a*c)*u;return o.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,_i)===null?!1:_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getInterpolation(t,e,n,s,o,r,a,c){return this.getBarycoord(t,e,n,s,_i)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,_i.x),c.addScaledVector(r,_i.y),c.addScaledVector(a,_i.z),c)}static getInterpolatedAttribute(t,e,n,s,o,r){return ll.setScalar(0),dl.setScalar(0),hl.setScalar(0),ll.fromBufferAttribute(t,e),dl.fromBufferAttribute(t,n),hl.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(ll,o.x),r.addScaledVector(dl,o.y),r.addScaledVector(hl,o.z),r}static isFrontFacing(t,e,n,s){return Kn.subVectors(n,e),Mi.subVectors(t,e),Kn.cross(Mi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Kn.subVectors(this.c,this.b),Mi.subVectors(this.a,this.b),Kn.cross(Mi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return Bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return Bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;lo.subVectors(s,n),ho.subVectors(o,n),rl.subVectors(t,n);const c=lo.dot(rl),l=ho.dot(rl);if(c<=0&&l<=0)return e.copy(n);al.subVectors(t,s);const d=lo.dot(al),h=ho.dot(al);if(d>=0&&h<=d)return e.copy(s);const u=c*h-d*l;if(u<=0&&c>=0&&d<=0)return r=c/(c-d),e.copy(n).addScaledVector(lo,r);cl.subVectors(t,o);const f=lo.dot(cl),g=ho.dot(cl);if(g>=0&&f<=g)return e.copy(o);const x=f*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(ho,a);const p=d*g-f*h;if(p<=0&&h-d>=0&&f-g>=0)return Ju.subVectors(o,s),a=(h-d)/(h-d+(f-g)),e.copy(s).addScaledVector(Ju,a);const m=1/(p+x+u);return r=x*m,a=u*m,e.copy(n).addScaledVector(lo,r).addScaledVector(ho,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const X0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},ga={h:0,s:0,l:0};function ul(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Dt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=mn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ee.workingColorSpace){if(t=Mx(t,1),e=an(e,0,1),n=an(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=ul(r,o,t+1/3),this.g=ul(r,o,t),this.b=ul(r,o,t-1/3)}return ee.toWorkingColorSpace(this,s),this}setStyle(t,e=mn){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=mn){const n=X0[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Li(t.r),this.g=Li(t.g),this.b=Li(t.b),this}copyLinearToSRGB(t){return this.r=Ho(t.r),this.g=Ho(t.g),this.b=Ho(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=mn){return ee.fromWorkingColorSpace(on.copy(this),t),Math.round(an(on.r*255,0,255))*65536+Math.round(an(on.g*255,0,255))*256+Math.round(an(on.b*255,0,255))}getHexString(t=mn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.fromWorkingColorSpace(on.copy(this),e);const n=on.r,s=on.g,o=on.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let c,l;const d=(a+r)/2;if(a===r)c=0,l=0;else{const h=r-a;switch(l=d<=.5?h/(r+a):h/(2-r-a),r){case n:c=(s-o)/h+(s<o?6:0);break;case s:c=(o-n)/h+2;break;case o:c=(n-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=ee.workingColorSpace){return ee.fromWorkingColorSpace(on.copy(this),e),t.r=on.r,t.g=on.g,t.b=on.b,t}getStyle(t=mn){ee.fromWorkingColorSpace(on.copy(this),t);const e=on.r,n=on.g,s=on.b;return t!==mn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($i),this.setHSL($i.h+t,$i.s+e,$i.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($i),t.getHSL(ga);const n=jc($i.h,ga.h,e),s=jc($i.s,ga.s,e),o=jc($i.l,ga.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new Dt;Dt.NAMES=X0;let Fx=0;class Fi extends ir{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fx++}),this.uuid=Pi(),this.name="",this.blending=Hs,this.side=ls,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ed,this.blendDst=Td,this.blendEquation=Ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=Xo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=eo,this.stencilZFail=eo,this.stencilZPass=eo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Hs&&(n.blending=this.blending),this.side!==ls&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ed&&(n.blendSrc=this.blendSrc),this.blendDst!==Td&&(n.blendDst=this.blendDst),this.blendEquation!==Ls&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Xo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==eo&&(n.stencilFail=this.stencilFail),this.stencilZFail!==eo&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==eo&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const c=o[a];delete c.metadata,r.push(c)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class kt extends Fi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Fe=new L,xa=new ut;class xn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=dh,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)xa.fromBufferAttribute(this,e),xa.applyMatrix3(t),this.setXY(e,xa.x,xa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ai(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ai(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ai(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ai(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ai(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),o=ge(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==dh&&(t.usage=this.usage),t}}class q0 extends xn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Y0 extends xn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class se extends xn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ox=0;const zn=new Kt,fl=new Re,uo=new L,Tn=new hs,fr=new hs,Xe=new L;class Le extends ir{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ox++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(G0(t)?Y0:q0)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Xt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return zn.makeRotationFromQuaternion(t),this.applyMatrix4(zn),this}rotateX(t){return zn.makeRotationX(t),this.applyMatrix4(zn),this}rotateY(t){return zn.makeRotationY(t),this.applyMatrix4(zn),this}rotateZ(t){return zn.makeRotationZ(t),this.applyMatrix4(zn),this}translate(t,e,n){return zn.makeTranslation(t,e,n),this.applyMatrix4(zn),this}scale(t,e,n){return zn.makeScale(t,e,n),this.applyMatrix4(zn),this}lookAt(t){return fl.lookAt(t),fl.updateMatrix(),this.applyMatrix4(fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(uo).negate(),this.translate(uo.x,uo.y,uo.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new se(n,3))}else{for(let n=0,s=e.count;n<s;n++){const o=t[n];e.setXYZ(n,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];Tn.setFromBufferAttribute(o),this.morphTargetsRelative?(Xe.addVectors(this.boundingBox.min,Tn.min),this.boundingBox.expandByPoint(Xe),Xe.addVectors(this.boundingBox.max,Tn.max),this.boundingBox.expandByPoint(Xe)):(this.boundingBox.expandByPoint(Tn.min),this.boundingBox.expandByPoint(Tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(Tn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];fr.setFromBufferAttribute(a),this.morphTargetsRelative?(Xe.addVectors(Tn.min,fr.min),Tn.expandByPoint(Xe),Xe.addVectors(Tn.max,fr.max),Tn.expandByPoint(Xe)):(Tn.expandByPoint(fr.min),Tn.expandByPoint(fr.max))}Tn.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)Xe.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(Xe));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],c=this.morphTargetsRelative;for(let l=0,d=a.count;l<d;l++)Xe.fromBufferAttribute(a,l),c&&(uo.fromBufferAttribute(t,l),Xe.add(uo)),s=Math.max(s,n.distanceToSquared(Xe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xn(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<n.count;C++)a[C]=new L,c[C]=new L;const l=new L,d=new L,h=new L,u=new ut,f=new ut,g=new ut,x=new L,p=new L;function m(C,y,M){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,y),h.fromBufferAttribute(n,M),u.fromBufferAttribute(o,C),f.fromBufferAttribute(o,y),g.fromBufferAttribute(o,M),d.sub(l),h.sub(l),f.sub(u),g.sub(u);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(x.copy(d).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(R),p.copy(h).multiplyScalar(f.x).addScaledVector(d,-g.x).multiplyScalar(R),a[C].add(x),a[y].add(x),a[M].add(x),c[C].add(p),c[y].add(p),c[M].add(p))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let C=0,y=_.length;C<y;++C){const M=_[C],R=M.start,z=M.count;for(let D=R,V=R+z;D<V;D+=3)m(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const b=new L,v=new L,I=new L,T=new L;function A(C){I.fromBufferAttribute(s,C),T.copy(I);const y=a[C];b.copy(y),b.sub(I.multiplyScalar(I.dot(y))).normalize(),v.crossVectors(T,y);const R=v.dot(c[C])<0?-1:1;r.setXYZW(C,b.x,b.y,b.z,R)}for(let C=0,y=_.length;C<y;++C){const M=_[C],R=M.start,z=M.count;for(let D=R,V=R+z;D<V;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new xn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new L,o=new L,r=new L,a=new L,c=new L,l=new L,d=new L,h=new L;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),x=t.getX(u+1),p=t.getX(u+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,x),r.fromBufferAttribute(e,p),d.subVectors(r,o),h.subVectors(s,o),d.cross(h),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),a.add(d),c.add(d),l.add(d),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),o.fromBufferAttribute(e,u+1),r.fromBufferAttribute(e,u+2),d.subVectors(r,o),h.subVectors(s,o),d.cross(h),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Xe.fromBufferAttribute(t,e),Xe.normalize(),t.setXYZ(e,Xe.x,Xe.y,Xe.z)}toNonIndexed(){function t(a,c){const l=a.array,d=a.itemSize,h=a.normalized,u=new l.constructor(c.length*d);let f=0,g=0;for(let x=0,p=c.length;x<p;x++){a.isInterleavedBufferAttribute?f=c[x]*a.data.stride+a.offset:f=c[x]*d;for(let m=0;m<d;m++)u[g++]=l[f++]}return new xn(u,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const o=this.morphAttributes;for(const a in o){const c=[],l=o[a];for(let d=0,h=l.length;d<h;d++){const u=l[d],f=t(u,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let h=0,u=l.length;h<u;h++){const f=l[h];d.push(f.toJSON(t.data))}d.length>0&&(s[c]=d,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const o=t.morphAttributes;for(const l in o){const d=[],h=o[l];for(let u=0,f=h.length;u<f;u++)d.push(h[u].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,d=r.length;l<d;l++){const h=r[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qu=new Kt,xs=new Zh,va=new Qs,tf=new L,ya=new L,ba=new L,Ma=new L,pl=new L,_a=new L,ef=new L,wa=new L;class ot extends Re{constructor(t=new Le,e=new kt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){_a.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const d=a[c],h=o[c];d!==0&&(pl.fromBufferAttribute(h,t),r?_a.addScaledVector(pl,d):_a.addScaledVector(pl.sub(e),d))}e.add(_a)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(o),xs.copy(t.ray).recast(t.near),!(va.containsPoint(xs.origin)===!1&&(xs.intersectSphere(va,tf)===null||xs.origin.distanceToSquared(tf)>(t.far-t.near)**2))&&(Qu.copy(o).invert(),xs.copy(t.ray).applyMatrix4(Qu),!(n.boundingBox!==null&&xs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,xs)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,c=o.attributes.position,l=o.attributes.uv,d=o.attributes.uv1,h=o.attributes.normal,u=o.groups,f=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const p=u[g],m=r[p.materialIndex],_=Math.max(p.start,f.start),b=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let v=_,I=b;v<I;v+=3){const T=a.getX(v),A=a.getX(v+1),C=a.getX(v+2);s=Sa(this,m,t,n,l,d,h,T,A,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let p=g,m=x;p<m;p+=3){const _=a.getX(p),b=a.getX(p+1),v=a.getX(p+2);s=Sa(this,r,t,n,l,d,h,_,b,v),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const p=u[g],m=r[p.materialIndex],_=Math.max(p.start,f.start),b=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let v=_,I=b;v<I;v+=3){const T=v,A=v+1,C=v+2;s=Sa(this,m,t,n,l,d,h,T,A,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let p=g,m=x;p<m;p+=3){const _=p,b=p+1,v=p+2;s=Sa(this,r,t,n,l,d,h,_,b,v),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function Bx(i,t,e,n,s,o,r,a){let c;if(t.side===gn?c=n.intersectTriangle(r,o,s,!0,a):c=n.intersectTriangle(s,o,r,t.side===ls,a),c===null)return null;wa.copy(a),wa.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(wa);return l<e.near||l>e.far?null:{distance:l,point:wa.clone(),object:i}}function Sa(i,t,e,n,s,o,r,a,c,l){i.getVertexPosition(a,ya),i.getVertexPosition(c,ba),i.getVertexPosition(l,Ma);const d=Bx(i,t,e,n,ya,ba,Ma,ef);if(d){const h=new L;Bn.getBarycoord(ef,ya,ba,Ma,h),s&&(d.uv=Bn.getInterpolatedAttribute(s,a,c,l,h,new ut)),o&&(d.uv1=Bn.getInterpolatedAttribute(o,a,c,l,h,new ut)),r&&(d.normal=Bn.getInterpolatedAttribute(r,a,c,l,h,new L),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new L,materialIndex:0};Bn.getNormal(ya,ba,Ma,u.normal),d.face=u,d.barycoord=h}return d}class Lt extends Le{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const c=[],l=[],d=[],h=[];let u=0,f=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new se(l,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(h,2));function g(x,p,m,_,b,v,I,T,A,C,y){const M=v/A,R=I/C,z=v/2,D=I/2,V=T/2,K=A+1,j=C+1;let et=0,q=0;const lt=new L;for(let gt=0;gt<j;gt++){const At=gt*R-D;for(let Vt=0;Vt<K;Vt++){const oe=Vt*M-z;lt[x]=oe*_,lt[p]=At*b,lt[m]=V,l.push(lt.x,lt.y,lt.z),lt[x]=0,lt[p]=0,lt[m]=T>0?1:-1,d.push(lt.x,lt.y,lt.z),h.push(Vt/A),h.push(1-gt/C),et+=1}}for(let gt=0;gt<C;gt++)for(let At=0;At<A;At++){const Vt=u+At+K*gt,oe=u+At+K*(gt+1),P=u+(At+1)+K*(gt+1),U=u+(At+1)+K*gt;c.push(Vt,oe,U),c.push(oe,P,U),q+=6}a.addGroup(f,q,y),f+=q,u+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Zo(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function pn(i){const t={};for(let e=0;e<i.length;e++){const n=Zo(i[e]);for(const s in n)t[s]=n[s]}return t}function Hx(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function j0(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}const Gx={clone:Zo,merge:pn};var Vx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ui extends Fi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vx,this.fragmentShader=Wx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zo(t.uniforms),this.uniformsGroups=Hx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class K0 extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=Ci}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xi=new L,nf=new ut,sf=new ut;class kn extends K0{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=hh*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Yc*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return hh*2*Math.atan(Math.tan(Yc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Xi.x,Xi.y).multiplyScalar(-t/Xi.z),Xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xi.x,Xi.y).multiplyScalar(-t/Xi.z)}getViewSize(t,e){return this.getViewBounds(t,nf,sf),e.subVectors(sf,nf)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Yc*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;o+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const fo=-90,po=1;class $x extends Re{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new kn(fo,po,t,e);s.layers=this.layers,this.add(s);const o=new kn(fo,po,t,e);o.layers=this.layers,this.add(o);const r=new kn(fo,po,t,e);r.layers=this.layers,this.add(r);const a=new kn(fo,po,t,e);a.layers=this.layers,this.add(a);const c=new kn(fo,po,t,e);c.layers=this.layers,this.add(c);const l=new kn(fo,po,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,c]=e;for(const l of e)this.remove(l);if(t===Ci)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===yc)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,c,l,d]=this.children,h=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(h,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Z0 extends cn{constructor(t,e,n,s,o,r,a,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:qo,super(t,e,n,s,o,r,a,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Xx extends js{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Z0(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ci}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Lt(5,5,5),o=new Ui({name:"CubemapFromEquirect",uniforms:Zo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:gn,blending:rs});o.uniforms.tEquirect.value=e;const r=new ot(s,o),a=e.minFilter;return e.minFilter===Ns&&(e.minFilter=ci),new $x(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}const ml=new L,qx=new L,Yx=new Xt;class ks{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ml.subVectors(n,e).cross(qx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ml),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Yx.getNormalMatrix(t),s=this.coplanarPoint(ml).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const vs=new Qs,Ea=new L;class Jh{constructor(t=new ks,e=new ks,n=new ks,s=new ks,o=new ks,r=new ks){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ci){const n=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],c=s[3],l=s[4],d=s[5],h=s[6],u=s[7],f=s[8],g=s[9],x=s[10],p=s[11],m=s[12],_=s[13],b=s[14],v=s[15];if(n[0].setComponents(c-o,u-l,p-f,v-m).normalize(),n[1].setComponents(c+o,u+l,p+f,v+m).normalize(),n[2].setComponents(c+r,u+d,p+g,v+_).normalize(),n[3].setComponents(c-r,u-d,p-g,v-_).normalize(),n[4].setComponents(c-a,u-h,p-x,v-b).normalize(),e===Ci)n[5].setComponents(c+a,u+h,p+x,v+b).normalize();else if(e===yc)n[5].setComponents(a,h,x,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vs)}intersectsSprite(t){return vs.center.set(0,0,0),vs.radius=.7071067811865476,vs.applyMatrix4(t.matrixWorld),this.intersectsSphere(vs)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ea.x=s.normal.x>0?t.max.x:t.min.x,Ea.y=s.normal.y>0?t.max.y:t.min.y,Ea.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ea)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function J0(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function jx(i){const t=new WeakMap;function e(a,c){const l=a.array,d=a.usage,h=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,d),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){const d=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,d);else{h.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<h.length;f++){const g=h[u],x=h[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,h[u]=x)}h.length=u+1;for(let f=0,g=h.length;f<g;f++){const x=h[f];i.bufferSubData(l,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const d=t.get(a);(!d||d.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:o,update:r}}class wn extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,d=c+1,h=t/a,u=e/c,f=[],g=[],x=[],p=[];for(let m=0;m<d;m++){const _=m*u-r;for(let b=0;b<l;b++){const v=b*h-o;g.push(v,-_,0),x.push(0,0,1),p.push(b/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let _=0;_<a;_++){const b=_+l*m,v=_+l*(m+1),I=_+1+l*(m+1),T=_+1+l*m;f.push(b,v,T),f.push(v,I,T)}this.setIndex(f),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(x,3)),this.setAttribute("uv",new se(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Kx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zx=`#ifdef USE_ALPHAHASH
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
#endif`,Jx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,t1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,e1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,n1=`#ifdef USE_AOMAP
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
#endif`,i1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,s1=`#ifdef USE_BATCHING
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
#endif`,o1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,r1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,a1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,c1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,l1=`#ifdef USE_IRIDESCENCE
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
#endif`,d1=`#ifdef USE_BUMPMAP
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
#endif`,h1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,u1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,f1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,p1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,m1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,g1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,x1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,v1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,y1=`#define PI 3.141592653589793
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
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,b1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,M1=`vec3 transformedNormal = objectNormal;
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
#endif`,_1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,w1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,S1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,E1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,T1="gl_FragColor = linearToOutputTexel( gl_FragColor );",A1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,C1=`#ifdef USE_ENVMAP
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
#endif`,R1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,k1=`#ifdef USE_ENVMAP
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
#endif`,P1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,L1=`#ifdef USE_ENVMAP
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
#endif`,D1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,I1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,z1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,U1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,N1=`#ifdef USE_GRADIENTMAP
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
}`,F1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,O1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,B1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,H1=`uniform bool receiveShadow;
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
#endif`,G1=`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
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
#endif`,V1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,W1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,X1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,q1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,Y1=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
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
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,j1=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif`,K1=`#if defined( RE_IndirectDiffuse )
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
#endif`,Z1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,J1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Q1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ev=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,nv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,iv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ov=`#if defined( USE_POINTS_UV )
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
#endif`,rv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,av=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hv=`#ifdef USE_MORPHTARGETS
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
#endif`,uv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,pv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,mv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vv=`#ifdef USE_NORMALMAP
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
#endif`,yv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_v=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ev=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Av=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Lv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Dv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Iv=`float getShadowMask() {
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,zv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Uv=`#ifdef USE_SKINNING
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
#endif`,Nv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fv=`#ifdef USE_SKINNING
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
#endif`,Ov=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vv=`#ifdef USE_TRANSMISSION
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
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Wv=`#ifdef USE_TRANSMISSION
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
#endif`,$v=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kv=`uniform sampler2D t2D;
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
}`,Zv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ty=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ey=`#include <common>
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
}`,ny=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,iy=`#define DISTANCE
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
}`,sy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
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
	gl_FragColor = packDepthToRGBA( dist );
}`,oy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ry=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ay=`uniform float scale;
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
}`,cy=`uniform vec3 diffuse;
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
}`,ly=`#include <common>
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
}`,dy=`uniform vec3 diffuse;
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
}`,hy=`#define LAMBERT
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
}`,uy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,fy=`#define MATCAP
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
}`,py=`#define MATCAP
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
}`,my=`#define NORMAL
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
}`,gy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xy=`#define PHONG
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
}`,vy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
}`,yy=`#define STANDARD
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
}`,by=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,My=`#define TOON
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
}`,_y=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,wy=`uniform float size;
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
}`,Sy=`uniform vec3 diffuse;
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
}`,Ey=`#include <common>
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
}`,Ty=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Ay=`uniform float rotation;
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
}`,Cy=`uniform vec3 diffuse;
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
}`,Yt={alphahash_fragment:Kx,alphahash_pars_fragment:Zx,alphamap_fragment:Jx,alphamap_pars_fragment:Qx,alphatest_fragment:t1,alphatest_pars_fragment:e1,aomap_fragment:n1,aomap_pars_fragment:i1,batching_pars_vertex:s1,batching_vertex:o1,begin_vertex:r1,beginnormal_vertex:a1,bsdfs:c1,iridescence_fragment:l1,bumpmap_pars_fragment:d1,clipping_planes_fragment:h1,clipping_planes_pars_fragment:u1,clipping_planes_pars_vertex:f1,clipping_planes_vertex:p1,color_fragment:m1,color_pars_fragment:g1,color_pars_vertex:x1,color_vertex:v1,common:y1,cube_uv_reflection_fragment:b1,defaultnormal_vertex:M1,displacementmap_pars_vertex:_1,displacementmap_vertex:w1,emissivemap_fragment:S1,emissivemap_pars_fragment:E1,colorspace_fragment:T1,colorspace_pars_fragment:A1,envmap_fragment:C1,envmap_common_pars_fragment:R1,envmap_pars_fragment:k1,envmap_pars_vertex:P1,envmap_physical_pars_fragment:G1,envmap_vertex:L1,fog_vertex:D1,fog_pars_vertex:I1,fog_fragment:z1,fog_pars_fragment:U1,gradientmap_pars_fragment:N1,lightmap_pars_fragment:F1,lights_lambert_fragment:O1,lights_lambert_pars_fragment:B1,lights_pars_begin:H1,lights_toon_fragment:V1,lights_toon_pars_fragment:W1,lights_phong_fragment:$1,lights_phong_pars_fragment:X1,lights_physical_fragment:q1,lights_physical_pars_fragment:Y1,lights_fragment_begin:j1,lights_fragment_maps:K1,lights_fragment_end:Z1,logdepthbuf_fragment:J1,logdepthbuf_pars_fragment:Q1,logdepthbuf_pars_vertex:tv,logdepthbuf_vertex:ev,map_fragment:nv,map_pars_fragment:iv,map_particle_fragment:sv,map_particle_pars_fragment:ov,metalnessmap_fragment:rv,metalnessmap_pars_fragment:av,morphinstance_vertex:cv,morphcolor_vertex:lv,morphnormal_vertex:dv,morphtarget_pars_vertex:hv,morphtarget_vertex:uv,normal_fragment_begin:fv,normal_fragment_maps:pv,normal_pars_fragment:mv,normal_pars_vertex:gv,normal_vertex:xv,normalmap_pars_fragment:vv,clearcoat_normal_fragment_begin:yv,clearcoat_normal_fragment_maps:bv,clearcoat_pars_fragment:Mv,iridescence_pars_fragment:_v,opaque_fragment:wv,packing:Sv,premultiplied_alpha_fragment:Ev,project_vertex:Tv,dithering_fragment:Av,dithering_pars_fragment:Cv,roughnessmap_fragment:Rv,roughnessmap_pars_fragment:kv,shadowmap_pars_fragment:Pv,shadowmap_pars_vertex:Lv,shadowmap_vertex:Dv,shadowmask_pars_fragment:Iv,skinbase_vertex:zv,skinning_pars_vertex:Uv,skinning_vertex:Nv,skinnormal_vertex:Fv,specularmap_fragment:Ov,specularmap_pars_fragment:Bv,tonemapping_fragment:Hv,tonemapping_pars_fragment:Gv,transmission_fragment:Vv,transmission_pars_fragment:Wv,uv_pars_fragment:$v,uv_pars_vertex:Xv,uv_vertex:qv,worldpos_vertex:Yv,background_vert:jv,background_frag:Kv,backgroundCube_vert:Zv,backgroundCube_frag:Jv,cube_vert:Qv,cube_frag:ty,depth_vert:ey,depth_frag:ny,distanceRGBA_vert:iy,distanceRGBA_frag:sy,equirect_vert:oy,equirect_frag:ry,linedashed_vert:ay,linedashed_frag:cy,meshbasic_vert:ly,meshbasic_frag:dy,meshlambert_vert:hy,meshlambert_frag:uy,meshmatcap_vert:fy,meshmatcap_frag:py,meshnormal_vert:my,meshnormal_frag:gy,meshphong_vert:xy,meshphong_frag:vy,meshphysical_vert:yy,meshphysical_frag:by,meshtoon_vert:My,meshtoon_frag:_y,points_vert:wy,points_frag:Sy,shadow_vert:Ey,shadow_frag:Ty,sprite_vert:Ay,sprite_frag:Cy},dt={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},oi={basic:{uniforms:pn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:pn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:pn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:pn([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:pn([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:pn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:pn([dt.points,dt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:pn([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:pn([dt.common,dt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:pn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:pn([dt.sprite,dt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:pn([dt.common,dt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:pn([dt.lights,dt.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};oi.physical={uniforms:pn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const Ta={r:0,b:0,g:0},ys=new _n,Ry=new Kt;function ky(i,t,e,n,s,o,r){const a=new Dt(0);let c=o===!0?0:1,l,d,h=null,u=0,f=null;function g(_){let b=_.isScene===!0?_.background:null;return b&&b.isTexture&&(b=(_.backgroundBlurriness>0?e:t).get(b)),b}function x(_){let b=!1;const v=g(_);v===null?m(a,c):v&&v.isColor&&(m(v,1),b=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,r):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(_,b){const v=g(b);v&&(v.isCubeTexture||v.mapping===Dc)?(d===void 0&&(d=new ot(new Lt(1,1,1),new Ui({name:"BackgroundCubeMaterial",uniforms:Zo(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(I,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ys.copy(b.backgroundRotation),ys.x*=-1,ys.y*=-1,ys.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ys.y*=-1,ys.z*=-1),d.material.uniforms.envMap.value=v,d.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Ry.makeRotationFromEuler(ys)),d.material.toneMapped=ee.getTransfer(v.colorSpace)!==me,(h!==v||u!==v.version||f!==i.toneMapping)&&(d.material.needsUpdate=!0,h=v,u=v.version,f=i.toneMapping),d.layers.enableAll(),_.unshift(d,d.geometry,d.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ot(new wn(2,2),new Ui({name:"BackgroundMaterial",uniforms:Zo(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:ls,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ee.getTransfer(v.colorSpace)!==me,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,f=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function m(_,b){_.getRGB(Ta,j0(i)),n.buffers.color.setClear(Ta.r,Ta.g,Ta.b,b,r)}return{getClearColor:function(){return a},setClearColor:function(_,b=1){a.set(_),c=b,m(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,m(a,c)},render:x,addToRenderList:p}}function Py(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let o=s,r=!1;function a(M,R,z,D,V){let K=!1;const j=h(D,z,R);o!==j&&(o=j,l(o.object)),K=f(M,D,z,V),K&&g(M,D,z,V),V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(K||r)&&(r=!1,v(M,R,z,D),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function d(M){return i.deleteVertexArray(M)}function h(M,R,z){const D=z.wireframe===!0;let V=n[M.id];V===void 0&&(V={},n[M.id]=V);let K=V[R.id];K===void 0&&(K={},V[R.id]=K);let j=K[D];return j===void 0&&(j=u(c()),K[D]=j),j}function u(M){const R=[],z=[],D=[];for(let V=0;V<e;V++)R[V]=0,z[V]=0,D[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:z,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,R,z,D){const V=o.attributes,K=R.attributes;let j=0;const et=z.getAttributes();for(const q in et)if(et[q].location>=0){const gt=V[q];let At=K[q];if(At===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(At=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(At=M.instanceColor)),gt===void 0||gt.attribute!==At||At&&gt.data!==At.data)return!0;j++}return o.attributesNum!==j||o.index!==D}function g(M,R,z,D){const V={},K=R.attributes;let j=0;const et=z.getAttributes();for(const q in et)if(et[q].location>=0){let gt=K[q];gt===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(gt=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(gt=M.instanceColor));const At={};At.attribute=gt,gt&&gt.data&&(At.data=gt.data),V[q]=At,j++}o.attributes=V,o.attributesNum=j,o.index=D}function x(){const M=o.newAttributes;for(let R=0,z=M.length;R<z;R++)M[R]=0}function p(M){m(M,0)}function m(M,R){const z=o.newAttributes,D=o.enabledAttributes,V=o.attributeDivisors;z[M]=1,D[M]===0&&(i.enableVertexAttribArray(M),D[M]=1),V[M]!==R&&(i.vertexAttribDivisor(M,R),V[M]=R)}function _(){const M=o.newAttributes,R=o.enabledAttributes;for(let z=0,D=R.length;z<D;z++)R[z]!==M[z]&&(i.disableVertexAttribArray(z),R[z]=0)}function b(M,R,z,D,V,K,j){j===!0?i.vertexAttribIPointer(M,R,z,V,K):i.vertexAttribPointer(M,R,z,D,V,K)}function v(M,R,z,D){x();const V=D.attributes,K=z.getAttributes(),j=R.defaultAttributeValues;for(const et in K){const q=K[et];if(q.location>=0){let lt=V[et];if(lt===void 0&&(et==="instanceMatrix"&&M.instanceMatrix&&(lt=M.instanceMatrix),et==="instanceColor"&&M.instanceColor&&(lt=M.instanceColor)),lt!==void 0){const gt=lt.normalized,At=lt.itemSize,Vt=t.get(lt);if(Vt===void 0)continue;const oe=Vt.buffer,P=Vt.type,U=Vt.bytesPerElement,J=P===i.INT||P===i.UNSIGNED_INT||lt.gpuType===Vh;if(lt.isInterleavedBufferAttribute){const X=lt.data,ct=X.stride,vt=lt.offset;if(X.isInstancedInterleavedBuffer){for(let Ut=0;Ut<q.locationSize;Ut++)m(q.location+Ut,X.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Ut=0;Ut<q.locationSize;Ut++)p(q.location+Ut);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let Ut=0;Ut<q.locationSize;Ut++)b(q.location+Ut,At/q.locationSize,P,gt,ct*U,(vt+At/q.locationSize*Ut)*U,J)}else{if(lt.isInstancedBufferAttribute){for(let X=0;X<q.locationSize;X++)m(q.location+X,lt.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let X=0;X<q.locationSize;X++)p(q.location+X);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let X=0;X<q.locationSize;X++)b(q.location+X,At/q.locationSize,P,gt,At*U,At/q.locationSize*X*U,J)}}else if(j!==void 0){const gt=j[et];if(gt!==void 0)switch(gt.length){case 2:i.vertexAttrib2fv(q.location,gt);break;case 3:i.vertexAttrib3fv(q.location,gt);break;case 4:i.vertexAttrib4fv(q.location,gt);break;default:i.vertexAttrib1fv(q.location,gt)}}}}_()}function I(){C();for(const M in n){const R=n[M];for(const z in R){const D=R[z];for(const V in D)d(D[V].object),delete D[V];delete R[z]}delete n[M]}}function T(M){if(n[M.id]===void 0)return;const R=n[M.id];for(const z in R){const D=R[z];for(const V in D)d(D[V].object),delete D[V];delete R[z]}delete n[M.id]}function A(M){for(const R in n){const z=n[R];if(z[M.id]===void 0)continue;const D=z[M.id];for(const V in D)d(D[V].object),delete D[V];delete z[M.id]}}function C(){y(),r=!0,o!==s&&(o=s,l(o.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:y,dispose:I,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:p,disableUnusedAttributes:_}}function Ly(i,t,e){let n;function s(l){n=l}function o(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function r(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),e.update(d,n,h))}function a(l,d,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let f=0;for(let g=0;g<h;g++)f+=d[g];e.update(f,n,1)}function c(l,d,h,u){if(h===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)r(l[g],d[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,d,0,u,0,h);let g=0;for(let x=0;x<h;x++)g+=d[x]*u[x];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Dy(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==ni&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const C=A===ta&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==zi&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==li&&!C)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const h=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:_,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:I,maxSamples:T}}function Iy(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new ks,a=new Xt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const f=h.length!==0||u||n!==0||s;return s=u,n=h.length,f},this.beginShadows=function(){o=!0,d(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(h,u){e=d(h,u,0)},this.setState=function(h,u,f){const g=h.clippingPlanes,x=h.clipIntersection,p=h.clipShadows,m=i.get(h);if(!s||g===null||g.length===0||o&&!p)o?d(null):l();else{const _=o?0:n,b=_*4;let v=m.clippingState||null;c.value=v,v=d(g,u,b,f);for(let I=0;I!==b;++I)v[I]=e[I];m.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(h,u,f,g){const x=h!==null?h.length:0;let p=null;if(x!==0){if(p=c.value,g!==!0||p===null){const m=f+x*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(p===null||p.length<m)&&(p=new Float32Array(m));for(let b=0,v=f;b!==x;++b,v+=4)r.copy(h[b]).applyMatrix4(_,a),r.normal.toArray(p,v),p[v+3]=r.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function zy(i){let t=new WeakMap;function e(r,a){return a===Id?r.mapping=qo:a===zd&&(r.mapping=Yo),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Id||a===zd)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Xx(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Q0 extends K0{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,r=o+l*this.view.width,a-=d*this.view.offsetY,c=a-d*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Lo=4,of=[.125,.215,.35,.446,.526,.582],Ds=20,gl=new Q0,rf=new Dt;let xl=null,vl=0,yl=0,bl=!1;const Ps=(1+Math.sqrt(5))/2,mo=1/Ps,af=[new L(-Ps,mo,0),new L(Ps,mo,0),new L(-mo,0,Ps),new L(mo,0,Ps),new L(0,Ps,-mo),new L(0,Ps,mo),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class cf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){xl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=df(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(xl,vl,yl),this._renderer.xr.enabled=bl,t.scissorTest=!1,Aa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===qo||t.mapping===Yo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),xl=this._renderer.getRenderTarget(),vl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ci,minFilter:ci,generateMipmaps:!1,type:ta,format:ni,colorSpace:nr,depthBuffer:!1},s=lf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lf(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Uy(o)),this._blurMaterial=Ny(o,t,e)}return s}_compileMaterial(t){const e=new ot(this._lodPlanes[0],t);this._renderer.compile(e,gl)}_sceneToCubeUV(t,e,n,s){const a=new kn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,u=d.toneMapping;d.getClearColor(rf),d.toneMapping=as,d.autoClear=!1;const f=new kt({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1}),g=new ot(new Lt,f);let x=!1;const p=t.background;p?p.isColor&&(f.color.copy(p),t.background=null,x=!0):(f.color.copy(rf),x=!0);for(let m=0;m<6;m++){const _=m%3;_===0?(a.up.set(0,c[m],0),a.lookAt(l[m],0,0)):_===1?(a.up.set(0,0,c[m]),a.lookAt(0,l[m],0)):(a.up.set(0,c[m],0),a.lookAt(0,0,l[m]));const b=this._cubeSize;Aa(s,_*b,m>2?b:0,b,b),d.setRenderTarget(s),x&&d.render(g,a),d.render(t,a)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=u,d.autoClear=h,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===qo||t.mapping===Yo;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=df());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new ot(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const c=this._cubeSize;Aa(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,gl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=af[(s-o-1)%af.length];this._blur(t,o-1,o,r,a)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new ot(this._lodPlanes[s],l),u=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*f):2*Math.PI/(2*Ds-1),x=o/g,p=isFinite(o)?1+Math.floor(d*x):Ds;p>Ds&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ds}`);const m=[];let _=0;for(let A=0;A<Ds;++A){const C=A/x,y=Math.exp(-C*C/2);m.push(y),A===0?_+=y:A<p&&(_+=2*y)}for(let A=0;A<m.length;A++)m[A]=m[A]/_;u.envMap.value=t.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=r==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:b}=this;u.dTheta.value=g,u.mipInt.value=b-n;const v=this._sizeLods[s],I=3*v*(s>b-Lo?s-b+Lo:0),T=4*(this._cubeSize-v);Aa(e,I,T,3*v,2*v),c.setRenderTarget(e),c.render(h,gl)}}function Uy(i){const t=[],e=[],n=[];let s=i;const o=i-Lo+1+of.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let c=1/a;r>i-Lo?c=of[r-i+Lo-1]:r===0&&(c=0),n.push(c);const l=1/(a-2),d=-l,h=1+l,u=[d,d,h,d,h,h,d,d,h,h,d,h],f=6,g=6,x=3,p=2,m=1,_=new Float32Array(x*g*f),b=new Float32Array(p*g*f),v=new Float32Array(m*g*f);for(let T=0;T<f;T++){const A=T%3*2/3-1,C=T>2?0:-1,y=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];_.set(y,x*g*T),b.set(u,p*g*T);const M=[T,T,T,T,T,T];v.set(M,m*g*T)}const I=new Le;I.setAttribute("position",new xn(_,x)),I.setAttribute("uv",new xn(b,p)),I.setAttribute("faceIndex",new xn(v,m)),t.push(I),s>Lo&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function lf(i,t,e){const n=new js(i,t,e);return n.texture.mapping=Dc,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Aa(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ny(i,t,e){const n=new Float32Array(Ds),s=new L(0,1,0);return new Ui({name:"SphericalGaussianBlur",defines:{n:Ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qh(),fragmentShader:`

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
		`,blending:rs,depthTest:!1,depthWrite:!1})}function df(){return new Ui({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qh(),fragmentShader:`

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
		`,blending:rs,depthTest:!1,depthWrite:!1})}function hf(){return new Ui({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:rs,depthTest:!1,depthWrite:!1})}function Qh(){return`

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
	`}function Fy(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Id||c===zd,d=c===qo||c===Yo;if(l||d){let h=t.get(a);const u=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new cf(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return l&&f&&f.height>0||d&&f&&s(f)?(e===null&&(e=new cf(i)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",o),h.texture):null}}}return a}function s(a){let c=0;const l=6;for(let d=0;d<l;d++)a[d]!==void 0&&c++;return c===l}function o(a){const c=a.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function Oy(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&kr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function By(i,t,e,n){const s={},o=new WeakMap;function r(h){const u=h.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const x=u.morphAttributes[g];for(let p=0,m=x.length;p<m;p++)t.remove(x[p])}u.removeEventListener("dispose",r),delete s[u.id];const f=o.get(u);f&&(t.remove(f),o.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(h,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,e.memory.geometries++),u}function c(h){const u=h.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const f=h.morphAttributes;for(const g in f){const x=f[g];for(let p=0,m=x.length;p<m;p++)t.update(x[p],i.ARRAY_BUFFER)}}function l(h){const u=[],f=h.index,g=h.attributes.position;let x=0;if(f!==null){const _=f.array;x=f.version;for(let b=0,v=_.length;b<v;b+=3){const I=_[b+0],T=_[b+1],A=_[b+2];u.push(I,T,T,A,A,I)}}else if(g!==void 0){const _=g.array;x=g.version;for(let b=0,v=_.length/3-1;b<v;b+=3){const I=b+0,T=b+1,A=b+2;u.push(I,T,T,A,A,I)}}else return;const p=new(G0(u)?Y0:q0)(u,1);p.version=x;const m=o.get(h);m&&t.remove(m),o.set(h,p)}function d(h){const u=o.get(h);if(u){const f=h.index;f!==null&&u.version<f.version&&l(h)}else l(h);return o.get(h)}return{get:a,update:c,getWireframeAttribute:d}}function Hy(i,t,e){let n;function s(u){n=u}let o,r;function a(u){o=u.type,r=u.bytesPerElement}function c(u,f){i.drawElements(n,f,o,u*r),e.update(f,n,1)}function l(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,o,u*r,g),e.update(f,n,g))}function d(u,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,o,u,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];e.update(p,n,1)}function h(u,f,g,x){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<u.length;m++)l(u[m]/r,f[m],x[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,o,u,0,x,0,g);let m=0;for(let _=0;_<g;_++)m+=f[_]*x[_];e.update(m,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Gy(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Vy(i,t,e){const n=new WeakMap,s=new xe;function o(r,a,c){const l=r.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=d!==void 0?d.length:0;let u=n.get(a);if(u===void 0||u.count!==h){let M=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",M)};var f=M;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],_=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),x===!0&&(v=2),p===!0&&(v=3);let I=a.attributes.position.count*v,T=1;I>t.maxTextureSize&&(T=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const A=new Float32Array(I*T*4*h),C=new W0(A,I,T,h);C.type=li,C.needsUpdate=!0;const y=v*4;for(let R=0;R<h;R++){const z=m[R],D=_[R],V=b[R],K=I*T*4*R;for(let j=0;j<z.count;j++){const et=j*y;g===!0&&(s.fromBufferAttribute(z,j),A[K+et+0]=s.x,A[K+et+1]=s.y,A[K+et+2]=s.z,A[K+et+3]=0),x===!0&&(s.fromBufferAttribute(D,j),A[K+et+4]=s.x,A[K+et+5]=s.y,A[K+et+6]=s.z,A[K+et+7]=0),p===!0&&(s.fromBufferAttribute(V,j),A[K+et+8]=s.x,A[K+et+9]=s.y,A[K+et+10]=s.z,A[K+et+11]=V.itemSize===4?s.w:1)}}u={count:h,texture:C,size:new ut(I,T)},n.set(a,u),a.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const x=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:o}}function Wy(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,d=c.geometry,h=t.get(c,d);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return h}function r(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:r}}class tm extends cn{constructor(t,e,n,s,o,r,a,c,l,d=Bo){if(d!==Bo&&d!==Ko)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===Bo&&(n=Ys),n===void 0&&d===Ko&&(n=jo),super(null,s,o,r,a,c,d,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Pn,this.minFilter=c!==void 0?c:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const em=new cn,uf=new tm(1,1),nm=new W0,im=new kx,sm=new Z0,ff=[],pf=[],mf=new Float32Array(16),gf=new Float32Array(9),xf=new Float32Array(4);function sr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=ff[s];if(o===void 0&&(o=new Float32Array(s),ff[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function Ve(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function We(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function zc(i,t){let e=pf[t];e===void 0&&(e=new Int32Array(t),pf[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function $y(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Xy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;i.uniform2fv(this.addr,t),We(e,t)}}function qy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ve(e,t))return;i.uniform3fv(this.addr,t),We(e,t)}}function Yy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;i.uniform4fv(this.addr,t),We(e,t)}}function jy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;xf.set(n),i.uniformMatrix2fv(this.addr,!1,xf),We(e,n)}}function Ky(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;gf.set(n),i.uniformMatrix3fv(this.addr,!1,gf),We(e,n)}}function Zy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;mf.set(n),i.uniformMatrix4fv(this.addr,!1,mf),We(e,n)}}function Jy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Qy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;i.uniform2iv(this.addr,t),We(e,t)}}function tb(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;i.uniform3iv(this.addr,t),We(e,t)}}function eb(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;i.uniform4iv(this.addr,t),We(e,t)}}function nb(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ib(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;i.uniform2uiv(this.addr,t),We(e,t)}}function sb(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;i.uniform3uiv(this.addr,t),We(e,t)}}function ob(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;i.uniform4uiv(this.addr,t),We(e,t)}}function rb(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(uf.compareFunction=H0,o=uf):o=em,e.setTexture2D(t||o,s)}function ab(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||im,s)}function cb(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||sm,s)}function lb(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||nm,s)}function db(i){switch(i){case 5126:return $y;case 35664:return Xy;case 35665:return qy;case 35666:return Yy;case 35674:return jy;case 35675:return Ky;case 35676:return Zy;case 5124:case 35670:return Jy;case 35667:case 35671:return Qy;case 35668:case 35672:return tb;case 35669:case 35673:return eb;case 5125:return nb;case 36294:return ib;case 36295:return sb;case 36296:return ob;case 35678:case 36198:case 36298:case 36306:case 35682:return rb;case 35679:case 36299:case 36307:return ab;case 35680:case 36300:case 36308:case 36293:return cb;case 36289:case 36303:case 36311:case 36292:return lb}}function hb(i,t){i.uniform1fv(this.addr,t)}function ub(i,t){const e=sr(t,this.size,2);i.uniform2fv(this.addr,e)}function fb(i,t){const e=sr(t,this.size,3);i.uniform3fv(this.addr,e)}function pb(i,t){const e=sr(t,this.size,4);i.uniform4fv(this.addr,e)}function mb(i,t){const e=sr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function gb(i,t){const e=sr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function xb(i,t){const e=sr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function vb(i,t){i.uniform1iv(this.addr,t)}function yb(i,t){i.uniform2iv(this.addr,t)}function bb(i,t){i.uniform3iv(this.addr,t)}function Mb(i,t){i.uniform4iv(this.addr,t)}function _b(i,t){i.uniform1uiv(this.addr,t)}function wb(i,t){i.uniform2uiv(this.addr,t)}function Sb(i,t){i.uniform3uiv(this.addr,t)}function Eb(i,t){i.uniform4uiv(this.addr,t)}function Tb(i,t,e){const n=this.cache,s=t.length,o=zc(e,s);Ve(n,o)||(i.uniform1iv(this.addr,o),We(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||em,o[r])}function Ab(i,t,e){const n=this.cache,s=t.length,o=zc(e,s);Ve(n,o)||(i.uniform1iv(this.addr,o),We(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||im,o[r])}function Cb(i,t,e){const n=this.cache,s=t.length,o=zc(e,s);Ve(n,o)||(i.uniform1iv(this.addr,o),We(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||sm,o[r])}function Rb(i,t,e){const n=this.cache,s=t.length,o=zc(e,s);Ve(n,o)||(i.uniform1iv(this.addr,o),We(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||nm,o[r])}function kb(i){switch(i){case 5126:return hb;case 35664:return ub;case 35665:return fb;case 35666:return pb;case 35674:return mb;case 35675:return gb;case 35676:return xb;case 5124:case 35670:return vb;case 35667:case 35671:return yb;case 35668:case 35672:return bb;case 35669:case 35673:return Mb;case 5125:return _b;case 36294:return wb;case 36295:return Sb;case 36296:return Eb;case 35678:case 36198:case 36298:case 36306:case 35682:return Tb;case 35679:case 36299:case 36307:return Ab;case 35680:case 36300:case 36308:case 36293:return Cb;case 36289:case 36303:case 36311:case 36292:return Rb}}class Pb{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=db(e.type)}}class Lb{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=kb(e.type)}}class Db{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const Ml=/(\w+)(\])?(\[|\.)?/g;function vf(i,t){i.seq.push(t),i.map[t.id]=t}function Ib(i,t,e){const n=i.name,s=n.length;for(Ml.lastIndex=0;;){const o=Ml.exec(n),r=Ml.lastIndex;let a=o[1];const c=o[2]==="]",l=o[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===s){vf(e,l===void 0?new Pb(a,i,t):new Lb(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new Db(a),vf(e,h)),e=h}}}class lc{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);Ib(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function yf(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const zb=37297;let Ub=0;function Nb(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}const bf=new Xt;function Fb(i){ee._getMatrix(bf,ee.workingColorSpace,i);const t=`mat3( ${bf.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(i)){case Ic:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Mf(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Nb(i.getShaderSource(t),r)}else return s}function Ob(i,t){const e=Fb(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Bb(i,t){let e;switch(t){case ix:e="Linear";break;case sx:e="Reinhard";break;case ox:e="Cineon";break;case rx:e="ACESFilmic";break;case cx:e="AgX";break;case lx:e="Neutral";break;case ax:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ca=new L;function Hb(){ee.getLuminanceCoefficients(Ca);const i=Ca.x.toFixed(4),t=Ca.y.toFixed(4),e=Ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Pr).join(`
`)}function Vb(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Wb(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function Pr(i){return i!==""}function _f(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wf(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const $b=/^[ \t]*#include +<([\w\d./]+)>/gm;function uh(i){return i.replace($b,qb)}const Xb=new Map;function qb(i,t){let e=Yt[t];if(e===void 0){const n=Xb.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return uh(e)}const Yb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sf(i){return i.replace(Yb,jb)}function jb(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Ef(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Kb(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===k0?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ug?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ti&&(t="SHADOWMAP_TYPE_VSM"),t}function Zb(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case qo:case Yo:t="ENVMAP_TYPE_CUBE";break;case Dc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Jb(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Yo:t="ENVMAP_MODE_REFRACTION";break}return t}function Qb(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Gh:t="ENVMAP_BLENDING_MULTIPLY";break;case ex:t="ENVMAP_BLENDING_MIX";break;case nx:t="ENVMAP_BLENDING_ADD";break}return t}function t2(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function e2(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=Kb(e),l=Zb(e),d=Jb(e),h=Qb(e),u=t2(e),f=Gb(e),g=Vb(o),x=s.createProgram();let p,m,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Pr).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Pr).join(`
`),m.length>0&&(m+=`
`)):(p=[Ef(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Pr).join(`
`),m=[Ef(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==as?"#define TONE_MAPPING":"",e.toneMapping!==as?Yt.tonemapping_pars_fragment:"",e.toneMapping!==as?Bb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,Ob("linearToOutputTexel",e.outputColorSpace),Hb(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Pr).join(`
`)),r=uh(r),r=_f(r,e),r=wf(r,e),a=uh(a),a=_f(a,e),a=wf(a,e),r=Sf(r),a=Sf(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===Nu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const b=_+p+r,v=_+m+a,I=yf(s,s.VERTEX_SHADER,b),T=yf(s,s.FRAGMENT_SHADER,v);s.attachShader(x,I),s.attachShader(x,T),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(R){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(x).trim(),D=s.getShaderInfoLog(I).trim(),V=s.getShaderInfoLog(T).trim();let K=!0,j=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,I,T);else{const et=Mf(s,I,"vertex"),q=Mf(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+z+`
`+et+`
`+q)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(D===""||V==="")&&(j=!1);j&&(R.diagnostics={runnable:K,programLog:z,vertexShader:{log:D,prefix:p},fragmentShader:{log:V,prefix:m}})}s.deleteShader(I),s.deleteShader(T),C=new lc(s,x),y=Wb(s,x)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,zb)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ub++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=I,this.fragmentShader=T,this}let n2=0;class i2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new s2(t),e.set(t,n)),n}}class s2{constructor(t){this.id=n2++,this.code=t,this.usedTimes=0}}function o2(i,t,e,n,s,o,r){const a=new $0,c=new i2,l=new Set,d=[],h=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return l.add(y),y===0?"uv":`uv${y}`}function p(y,M,R,z,D){const V=z.fog,K=D.geometry,j=y.isMeshStandardMaterial?z.environment:null,et=(y.isMeshStandardMaterial?e:t).get(y.envMap||j),q=et&&et.mapping===Dc?et.image.height:null,lt=g[y.type];y.precision!==null&&(f=s.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const gt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,At=gt!==void 0?gt.length:0;let Vt=0;K.morphAttributes.position!==void 0&&(Vt=1),K.morphAttributes.normal!==void 0&&(Vt=2),K.morphAttributes.color!==void 0&&(Vt=3);let oe,P,U,J;if(lt){const fe=oi[lt];oe=fe.vertexShader,P=fe.fragmentShader}else oe=y.vertexShader,P=y.fragmentShader,c.update(y),U=c.getVertexShaderID(y),J=c.getFragmentShaderID(y);const X=i.getRenderTarget(),ct=i.state.buffers.depth.getReversed(),vt=D.isInstancedMesh===!0,Ut=D.isBatchedMesh===!0,jt=!!y.map,Bt=!!y.matcap,ue=!!et,F=!!y.aoMap,Ze=!!y.lightMap,Ht=!!y.bumpMap,Zt=!!y.normalMap,zt=!!y.displacementMap,Me=!!y.emissiveMap,It=!!y.metalnessMap,k=!!y.roughnessMap,S=y.anisotropy>0,G=y.clearcoat>0,Q=y.dispersion>0,nt=y.iridescence>0,Z=y.sheen>0,Ct=y.transmission>0,ft=S&&!!y.anisotropyMap,yt=G&&!!y.clearcoatMap,te=G&&!!y.clearcoatNormalMap,rt=G&&!!y.clearcoatRoughnessMap,bt=nt&&!!y.iridescenceMap,Nt=nt&&!!y.iridescenceThicknessMap,Ft=Z&&!!y.sheenColorMap,Mt=Z&&!!y.sheenRoughnessMap,Jt=!!y.specularMap,qt=!!y.specularColorMap,ve=!!y.specularIntensityMap,N=Ct&&!!y.transmissionMap,ht=Ct&&!!y.thicknessMap,Y=!!y.gradientMap,tt=!!y.alphaMap,xt=y.alphaTest>0,pt=!!y.alphaHash,Wt=!!y.extensions;let De=as;y.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(De=i.toneMapping);const nn={shaderID:lt,shaderType:y.type,shaderName:y.name,vertexShader:oe,fragmentShader:P,defines:y.defines,customVertexShaderID:U,customFragmentShaderID:J,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Ut,batchingColor:Ut&&D._colorsTexture!==null,instancing:vt,instancingColor:vt&&D.instanceColor!==null,instancingMorph:vt&&D.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:X===null?i.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:nr,alphaToCoverage:!!y.alphaToCoverage,map:jt,matcap:Bt,envMap:ue,envMapMode:ue&&et.mapping,envMapCubeUVHeight:q,aoMap:F,lightMap:Ze,bumpMap:Ht,normalMap:Zt,displacementMap:u&&zt,emissiveMap:Me,normalMapObjectSpace:Zt&&y.normalMapType===fx,normalMapTangentSpace:Zt&&y.normalMapType===Kh,metalnessMap:It,roughnessMap:k,anisotropy:S,anisotropyMap:ft,clearcoat:G,clearcoatMap:yt,clearcoatNormalMap:te,clearcoatRoughnessMap:rt,dispersion:Q,iridescence:nt,iridescenceMap:bt,iridescenceThicknessMap:Nt,sheen:Z,sheenColorMap:Ft,sheenRoughnessMap:Mt,specularMap:Jt,specularColorMap:qt,specularIntensityMap:ve,transmission:Ct,transmissionMap:N,thicknessMap:ht,gradientMap:Y,opaque:y.transparent===!1&&y.blending===Hs&&y.alphaToCoverage===!1,alphaMap:tt,alphaTest:xt,alphaHash:pt,combine:y.combine,mapUv:jt&&x(y.map.channel),aoMapUv:F&&x(y.aoMap.channel),lightMapUv:Ze&&x(y.lightMap.channel),bumpMapUv:Ht&&x(y.bumpMap.channel),normalMapUv:Zt&&x(y.normalMap.channel),displacementMapUv:zt&&x(y.displacementMap.channel),emissiveMapUv:Me&&x(y.emissiveMap.channel),metalnessMapUv:It&&x(y.metalnessMap.channel),roughnessMapUv:k&&x(y.roughnessMap.channel),anisotropyMapUv:ft&&x(y.anisotropyMap.channel),clearcoatMapUv:yt&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:te&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:Nt&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ft&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&x(y.sheenRoughnessMap.channel),specularMapUv:Jt&&x(y.specularMap.channel),specularColorMapUv:qt&&x(y.specularColorMap.channel),specularIntensityMapUv:ve&&x(y.specularIntensityMap.channel),transmissionMapUv:N&&x(y.transmissionMap.channel),thicknessMapUv:ht&&x(y.thicknessMap.channel),alphaMapUv:tt&&x(y.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Zt||S),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!K.attributes.uv&&(jt||tt),fog:!!V,useFog:y.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:ct,skinning:D.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:Vt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:jt&&y.map.isVideoTexture===!0&&ee.getTransfer(y.map.colorSpace)===me,decodeVideoTextureEmissive:Me&&y.emissiveMap.isVideoTexture===!0&&ee.getTransfer(y.emissiveMap.colorSpace)===me,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===be,flipSided:y.side===gn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Wt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Wt&&y.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return nn.vertexUv1s=l.has(1),nn.vertexUv2s=l.has(2),nn.vertexUv3s=l.has(3),l.clear(),nn}function m(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)M.push(R),M.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(_(M,y),b(M,y),M.push(i.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function _(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function b(y,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),y.push(a.mask)}function v(y){const M=g[y.type];let R;if(M){const z=oi[M];R=Gx.clone(z.uniforms)}else R=y.uniforms;return R}function I(y,M){let R;for(let z=0,D=d.length;z<D;z++){const V=d[z];if(V.cacheKey===M){R=V,++R.usedTimes;break}}return R===void 0&&(R=new e2(i,M,y,o),d.push(R)),R}function T(y){if(--y.usedTimes===0){const M=d.indexOf(y);d[M]=d[d.length-1],d.pop(),y.destroy()}}function A(y){c.remove(y)}function C(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:v,acquireProgram:I,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:C}}function r2(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function n(r){i.delete(r)}function s(r,a,c){i.get(r)[a]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function a2(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Tf(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Af(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(h,u,f,g,x,p){let m=i[t];return m===void 0?(m={id:h.id,object:h,geometry:u,material:f,groupOrder:g,renderOrder:h.renderOrder,z:x,group:p},i[t]=m):(m.id=h.id,m.object=h,m.geometry=u,m.material=f,m.groupOrder=g,m.renderOrder=h.renderOrder,m.z=x,m.group=p),t++,m}function a(h,u,f,g,x,p){const m=r(h,u,f,g,x,p);f.transmission>0?n.push(m):f.transparent===!0?s.push(m):e.push(m)}function c(h,u,f,g,x,p){const m=r(h,u,f,g,x,p);f.transmission>0?n.unshift(m):f.transparent===!0?s.unshift(m):e.unshift(m)}function l(h,u){e.length>1&&e.sort(h||a2),n.length>1&&n.sort(u||Tf),s.length>1&&s.sort(u||Tf)}function d(){for(let h=t,u=i.length;h<u;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:c,finish:d,sort:l}}function c2(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new Af,i.set(n,[r])):s>=o.length?(r=new Af,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function l2(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Dt};break;case"SpotLight":e={position:new L,direction:new L,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function d2(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let h2=0;function u2(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function f2(i){const t=new l2,e=d2(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const s=new L,o=new Kt,r=new Kt;function a(l){let d=0,h=0,u=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,g=0,x=0,p=0,m=0,_=0,b=0,v=0,I=0,T=0,A=0;l.sort(u2);for(let y=0,M=l.length;y<M;y++){const R=l[y],z=R.color,D=R.intensity,V=R.distance,K=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=z.r*D,h+=z.g*D,u+=z.b*D;else if(R.isLightProbe){for(let j=0;j<9;j++)n.probe[j].addScaledVector(R.sh.coefficients[j],D);A++}else if(R.isDirectionalLight){const j=t.get(R);if(j.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const et=R.shadow,q=e.get(R);q.shadowIntensity=et.intensity,q.shadowBias=et.bias,q.shadowNormalBias=et.normalBias,q.shadowRadius=et.radius,q.shadowMapSize=et.mapSize,n.directionalShadow[f]=q,n.directionalShadowMap[f]=K,n.directionalShadowMatrix[f]=R.shadow.matrix,_++}n.directional[f]=j,f++}else if(R.isSpotLight){const j=t.get(R);j.position.setFromMatrixPosition(R.matrixWorld),j.color.copy(z).multiplyScalar(D),j.distance=V,j.coneCos=Math.cos(R.angle),j.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),j.decay=R.decay,n.spot[x]=j;const et=R.shadow;if(R.map&&(n.spotLightMap[I]=R.map,I++,et.updateMatrices(R),R.castShadow&&T++),n.spotLightMatrix[x]=et.matrix,R.castShadow){const q=e.get(R);q.shadowIntensity=et.intensity,q.shadowBias=et.bias,q.shadowNormalBias=et.normalBias,q.shadowRadius=et.radius,q.shadowMapSize=et.mapSize,n.spotShadow[x]=q,n.spotShadowMap[x]=K,v++}x++}else if(R.isRectAreaLight){const j=t.get(R);j.color.copy(z).multiplyScalar(D),j.halfWidth.set(R.width*.5,0,0),j.halfHeight.set(0,R.height*.5,0),n.rectArea[p]=j,p++}else if(R.isPointLight){const j=t.get(R);if(j.color.copy(R.color).multiplyScalar(R.intensity),j.distance=R.distance,j.decay=R.decay,R.castShadow){const et=R.shadow,q=e.get(R);q.shadowIntensity=et.intensity,q.shadowBias=et.bias,q.shadowNormalBias=et.normalBias,q.shadowRadius=et.radius,q.shadowMapSize=et.mapSize,q.shadowCameraNear=et.camera.near,q.shadowCameraFar=et.camera.far,n.pointShadow[g]=q,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=R.shadow.matrix,b++}n.point[g]=j,g++}else if(R.isHemisphereLight){const j=t.get(R);j.skyColor.copy(R.color).multiplyScalar(D),j.groundColor.copy(R.groundColor).multiplyScalar(D),n.hemi[m]=j,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=u;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==x||C.rectAreaLength!==p||C.hemiLength!==m||C.numDirectionalShadows!==_||C.numPointShadows!==b||C.numSpotShadows!==v||C.numSpotMaps!==I||C.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+I-T,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,C.directionalLength=f,C.pointLength=g,C.spotLength=x,C.rectAreaLength=p,C.hemiLength=m,C.numDirectionalShadows=_,C.numPointShadows=b,C.numSpotShadows=v,C.numSpotMaps=I,C.numLightProbes=A,n.version=h2++)}function c(l,d){let h=0,u=0,f=0,g=0,x=0;const p=d.matrixWorldInverse;for(let m=0,_=l.length;m<_;m++){const b=l[m];if(b.isDirectionalLight){const v=n.directional[h];v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(p),h++}else if(b.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(p),v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(p),f++}else if(b.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(p),r.identity(),o.copy(b.matrixWorld),o.premultiply(p),r.extractRotation(o),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(b.isPointLight){const v=n.point[u];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(p),u++}else if(b.isHemisphereLight){const v=n.hemi[x];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(p),x++}}}return{setup:a,setupView:c,state:n}}function Cf(i){const t=new f2(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function o(d){e.push(d)}function r(d){n.push(d)}function a(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:o,pushShadow:r}}function p2(i){let t=new WeakMap;function e(s,o=0){const r=t.get(s);let a;return r===void 0?(a=new Cf(i),t.set(s,[a])):o>=r.length?(a=new Cf(i),r.push(a)):a=r[o],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class m2 extends Fi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=hx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class g2 extends Fi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const x2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,v2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function y2(i,t,e){let n=new Jh;const s=new ut,o=new ut,r=new xe,a=new m2({depthPacking:ux}),c=new g2,l={},d=e.maxTextureSize,h={[ls]:gn,[gn]:ls,[be]:be},u=new Ui({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:x2,fragmentShader:v2}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ot(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=k0;let m=this.type;this.render=function(T,A,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const y=i.getRenderTarget(),M=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),z=i.state;z.setBlending(rs),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const D=m!==Ti&&this.type===Ti,V=m===Ti&&this.type!==Ti;for(let K=0,j=T.length;K<j;K++){const et=T[K],q=et.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const lt=q.getFrameExtents();if(s.multiply(lt),o.copy(q.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(o.x=Math.floor(d/lt.x),s.x=o.x*lt.x,q.mapSize.x=o.x),s.y>d&&(o.y=Math.floor(d/lt.y),s.y=o.y*lt.y,q.mapSize.y=o.y)),q.map===null||D===!0||V===!0){const At=this.type!==Ti?{minFilter:Pn,magFilter:Pn}:{};q.map!==null&&q.map.dispose(),q.map=new js(s.x,s.y,At),q.map.texture.name=et.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const gt=q.getViewportCount();for(let At=0;At<gt;At++){const Vt=q.getViewport(At);r.set(o.x*Vt.x,o.y*Vt.y,o.x*Vt.z,o.y*Vt.w),z.viewport(r),q.updateMatrices(et,At),n=q.getFrustum(),v(A,C,q.camera,et,this.type)}q.isPointLightShadow!==!0&&this.type===Ti&&_(q,C),q.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(y,M,R)};function _(T,A){const C=t.update(x);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new js(s.x,s.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,C,u,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,C,f,x,null)}function b(T,A,C,y){let M=null;const R=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)M=R;else if(M=C.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=M.uuid,D=A.uuid;let V=l[z];V===void 0&&(V={},l[z]=V);let K=V[D];K===void 0&&(K=M.clone(),V[D]=K,A.addEventListener("dispose",I)),M=K}if(M.visible=A.visible,M.wireframe=A.wireframe,y===Ti?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:h[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=i.properties.get(M);z.light=C}return M}function v(T,A,C,y,M){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===Ti)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const D=t.update(T),V=T.material;if(Array.isArray(V)){const K=D.groups;for(let j=0,et=K.length;j<et;j++){const q=K[j],lt=V[q.materialIndex];if(lt&&lt.visible){const gt=b(T,lt,y,M);T.onBeforeShadow(i,T,A,C,D,gt,q),i.renderBufferDirect(C,null,D,gt,T,q),T.onAfterShadow(i,T,A,C,D,gt,q)}}}else if(V.visible){const K=b(T,V,y,M);T.onBeforeShadow(i,T,A,C,D,K,null),i.renderBufferDirect(C,null,D,K,T,null),T.onAfterShadow(i,T,A,C,D,K,null)}}const z=T.children;for(let D=0,V=z.length;D<V;D++)v(z[D],A,C,y,M)}function I(T){T.target.removeEventListener("dispose",I);for(const C in l){const y=l[C],M=T.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const b2={[Ad]:Cd,[Rd]:Ld,[kd]:Dd,[Xo]:Pd,[Cd]:Ad,[Ld]:Rd,[Dd]:kd,[Pd]:Xo};function M2(i,t){function e(){let N=!1;const ht=new xe;let Y=null;const tt=new xe(0,0,0,0);return{setMask:function(xt){Y!==xt&&!N&&(i.colorMask(xt,xt,xt,xt),Y=xt)},setLocked:function(xt){N=xt},setClear:function(xt,pt,Wt,De,nn){nn===!0&&(xt*=De,pt*=De,Wt*=De),ht.set(xt,pt,Wt,De),tt.equals(ht)===!1&&(i.clearColor(xt,pt,Wt,De),tt.copy(ht))},reset:function(){N=!1,Y=null,tt.set(-1,0,0,0)}}}function n(){let N=!1,ht=!1,Y=null,tt=null,xt=null;return{setReversed:function(pt){if(ht!==pt){const Wt=t.get("EXT_clip_control");ht?Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.ZERO_TO_ONE_EXT):Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.NEGATIVE_ONE_TO_ONE_EXT);const De=xt;xt=null,this.setClear(De)}ht=pt},getReversed:function(){return ht},setTest:function(pt){pt?X(i.DEPTH_TEST):ct(i.DEPTH_TEST)},setMask:function(pt){Y!==pt&&!N&&(i.depthMask(pt),Y=pt)},setFunc:function(pt){if(ht&&(pt=b2[pt]),tt!==pt){switch(pt){case Ad:i.depthFunc(i.NEVER);break;case Cd:i.depthFunc(i.ALWAYS);break;case Rd:i.depthFunc(i.LESS);break;case Xo:i.depthFunc(i.LEQUAL);break;case kd:i.depthFunc(i.EQUAL);break;case Pd:i.depthFunc(i.GEQUAL);break;case Ld:i.depthFunc(i.GREATER);break;case Dd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}tt=pt}},setLocked:function(pt){N=pt},setClear:function(pt){xt!==pt&&(ht&&(pt=1-pt),i.clearDepth(pt),xt=pt)},reset:function(){N=!1,Y=null,tt=null,xt=null,ht=!1}}}function s(){let N=!1,ht=null,Y=null,tt=null,xt=null,pt=null,Wt=null,De=null,nn=null;return{setTest:function(fe){N||(fe?X(i.STENCIL_TEST):ct(i.STENCIL_TEST))},setMask:function(fe){ht!==fe&&!N&&(i.stencilMask(fe),ht=fe)},setFunc:function(fe,Xn,gi){(Y!==fe||tt!==Xn||xt!==gi)&&(i.stencilFunc(fe,Xn,gi),Y=fe,tt=Xn,xt=gi)},setOp:function(fe,Xn,gi){(pt!==fe||Wt!==Xn||De!==gi)&&(i.stencilOp(fe,Xn,gi),pt=fe,Wt=Xn,De=gi)},setLocked:function(fe){N=fe},setClear:function(fe){nn!==fe&&(i.clearStencil(fe),nn=fe)},reset:function(){N=!1,ht=null,Y=null,tt=null,xt=null,pt=null,Wt=null,De=null,nn=null}}}const o=new e,r=new n,a=new s,c=new WeakMap,l=new WeakMap;let d={},h={},u=new WeakMap,f=[],g=null,x=!1,p=null,m=null,_=null,b=null,v=null,I=null,T=null,A=new Dt(0,0,0),C=0,y=!1,M=null,R=null,z=null,D=null,V=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,et=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(q)[1]),j=et>=1):q.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),j=et>=2);let lt=null,gt={};const At=i.getParameter(i.SCISSOR_BOX),Vt=i.getParameter(i.VIEWPORT),oe=new xe().fromArray(At),P=new xe().fromArray(Vt);function U(N,ht,Y,tt){const xt=new Uint8Array(4),pt=i.createTexture();i.bindTexture(N,pt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Wt=0;Wt<Y;Wt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(ht,0,i.RGBA,1,1,tt,0,i.RGBA,i.UNSIGNED_BYTE,xt):i.texImage2D(ht+Wt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xt);return pt}const J={};J[i.TEXTURE_2D]=U(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=U(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=U(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=U(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),X(i.DEPTH_TEST),r.setFunc(Xo),Ht(!1),Zt(Du),X(i.CULL_FACE),F(rs);function X(N){d[N]!==!0&&(i.enable(N),d[N]=!0)}function ct(N){d[N]!==!1&&(i.disable(N),d[N]=!1)}function vt(N,ht){return h[N]!==ht?(i.bindFramebuffer(N,ht),h[N]=ht,N===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ht),N===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ht),!0):!1}function Ut(N,ht){let Y=f,tt=!1;if(N){Y=u.get(ht),Y===void 0&&(Y=[],u.set(ht,Y));const xt=N.textures;if(Y.length!==xt.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let pt=0,Wt=xt.length;pt<Wt;pt++)Y[pt]=i.COLOR_ATTACHMENT0+pt;Y.length=xt.length,tt=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,tt=!0);tt&&i.drawBuffers(Y)}function jt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const Bt={[Ls]:i.FUNC_ADD,[Fg]:i.FUNC_SUBTRACT,[Og]:i.FUNC_REVERSE_SUBTRACT};Bt[Bg]=i.MIN,Bt[Hg]=i.MAX;const ue={[Gg]:i.ZERO,[Vg]:i.ONE,[Wg]:i.SRC_COLOR,[Ed]:i.SRC_ALPHA,[Kg]:i.SRC_ALPHA_SATURATE,[Yg]:i.DST_COLOR,[Xg]:i.DST_ALPHA,[$g]:i.ONE_MINUS_SRC_COLOR,[Td]:i.ONE_MINUS_SRC_ALPHA,[jg]:i.ONE_MINUS_DST_COLOR,[qg]:i.ONE_MINUS_DST_ALPHA,[Zg]:i.CONSTANT_COLOR,[Jg]:i.ONE_MINUS_CONSTANT_COLOR,[Qg]:i.CONSTANT_ALPHA,[tx]:i.ONE_MINUS_CONSTANT_ALPHA};function F(N,ht,Y,tt,xt,pt,Wt,De,nn,fe){if(N===rs){x===!0&&(ct(i.BLEND),x=!1);return}if(x===!1&&(X(i.BLEND),x=!0),N!==Ng){if(N!==p||fe!==y){if((m!==Ls||v!==Ls)&&(i.blendEquation(i.FUNC_ADD),m=Ls,v=Ls),fe)switch(N){case Hs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ui:i.blendFunc(i.ONE,i.ONE);break;case Iu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case zu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Hs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ui:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Iu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case zu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,b=null,I=null,T=null,A.set(0,0,0),C=0,p=N,y=fe}return}xt=xt||ht,pt=pt||Y,Wt=Wt||tt,(ht!==m||xt!==v)&&(i.blendEquationSeparate(Bt[ht],Bt[xt]),m=ht,v=xt),(Y!==_||tt!==b||pt!==I||Wt!==T)&&(i.blendFuncSeparate(ue[Y],ue[tt],ue[pt],ue[Wt]),_=Y,b=tt,I=pt,T=Wt),(De.equals(A)===!1||nn!==C)&&(i.blendColor(De.r,De.g,De.b,nn),A.copy(De),C=nn),p=N,y=!1}function Ze(N,ht){N.side===be?ct(i.CULL_FACE):X(i.CULL_FACE);let Y=N.side===gn;ht&&(Y=!Y),Ht(Y),N.blending===Hs&&N.transparent===!1?F(rs):F(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),o.setMask(N.colorWrite);const tt=N.stencilWrite;a.setTest(tt),tt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Me(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?X(i.SAMPLE_ALPHA_TO_COVERAGE):ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ht(N){M!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),M=N)}function Zt(N){N!==Ig?(X(i.CULL_FACE),N!==R&&(N===Du?i.cullFace(i.BACK):N===zg?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ct(i.CULL_FACE),R=N}function zt(N){N!==z&&(j&&i.lineWidth(N),z=N)}function Me(N,ht,Y){N?(X(i.POLYGON_OFFSET_FILL),(D!==ht||V!==Y)&&(i.polygonOffset(ht,Y),D=ht,V=Y)):ct(i.POLYGON_OFFSET_FILL)}function It(N){N?X(i.SCISSOR_TEST):ct(i.SCISSOR_TEST)}function k(N){N===void 0&&(N=i.TEXTURE0+K-1),lt!==N&&(i.activeTexture(N),lt=N)}function S(N,ht,Y){Y===void 0&&(lt===null?Y=i.TEXTURE0+K-1:Y=lt);let tt=gt[Y];tt===void 0&&(tt={type:void 0,texture:void 0},gt[Y]=tt),(tt.type!==N||tt.texture!==ht)&&(lt!==Y&&(i.activeTexture(Y),lt=Y),i.bindTexture(N,ht||J[N]),tt.type=N,tt.texture=ht)}function G(){const N=gt[lt];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function nt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function bt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(N){oe.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),oe.copy(N))}function Mt(N){P.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),P.copy(N))}function Jt(N,ht){let Y=l.get(ht);Y===void 0&&(Y=new WeakMap,l.set(ht,Y));let tt=Y.get(N);tt===void 0&&(tt=i.getUniformBlockIndex(ht,N.name),Y.set(N,tt))}function qt(N,ht){const tt=l.get(ht).get(N);c.get(ht)!==tt&&(i.uniformBlockBinding(ht,tt,N.__bindingPointIndex),c.set(ht,tt))}function ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},lt=null,gt={},h={},u=new WeakMap,f=[],g=null,x=!1,p=null,m=null,_=null,b=null,v=null,I=null,T=null,A=new Dt(0,0,0),C=0,y=!1,M=null,R=null,z=null,D=null,V=null,oe.set(0,0,i.canvas.width,i.canvas.height),P.set(0,0,i.canvas.width,i.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:X,disable:ct,bindFramebuffer:vt,drawBuffers:Ut,useProgram:jt,setBlending:F,setMaterial:Ze,setFlipSided:Ht,setCullFace:Zt,setLineWidth:zt,setPolygonOffset:Me,setScissorTest:It,activeTexture:k,bindTexture:S,unbindTexture:G,compressedTexImage2D:Q,compressedTexImage3D:nt,texImage2D:bt,texImage3D:Nt,updateUBOMapping:Jt,uniformBlockBinding:qt,texStorage2D:te,texStorage3D:rt,texSubImage2D:Z,texSubImage3D:Ct,compressedTexSubImage2D:ft,compressedTexSubImage3D:yt,scissor:Ft,viewport:Mt,reset:ve}}function Rf(i,t,e,n){const s=_2(n);switch(e){case z0:return i*t;case N0:return i*t;case F0:return i*t*2;case Xh:return i*t/s.components*s.byteLength;case qh:return i*t/s.components*s.byteLength;case O0:return i*t*2/s.components*s.byteLength;case Yh:return i*t*2/s.components*s.byteLength;case U0:return i*t*3/s.components*s.byteLength;case ni:return i*t*4/s.components*s.byteLength;case jh:return i*t*4/s.components*s.byteLength;case sc:case oc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case rc:case ac:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Od:case Hd:return Math.max(i,16)*Math.max(t,8)/4;case Fd:case Bd:return Math.max(i,8)*Math.max(t,8)/2;case Gd:case Vd:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wd:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case $d:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xd:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case qd:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Yd:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case jd:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Kd:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Zd:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Jd:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Qd:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case th:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case eh:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case nh:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ih:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case sh:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case cc:case oh:case rh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case B0:case ah:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ch:case lh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function _2(i){switch(i){case zi:case L0:return{byteLength:1,components:1};case $r:case D0:case ta:return{byteLength:2,components:1};case Wh:case $h:return{byteLength:2,components:4};case Ys:case Vh:case li:return{byteLength:4,components:1};case I0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function w2(i,t,e,n,s,o,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ut,d=new WeakMap;let h;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(k,S){return f?new OffscreenCanvas(k,S):bc("canvas")}function x(k,S,G){let Q=1;const nt=It(k);if((nt.width>G||nt.height>G)&&(Q=G/Math.max(nt.width,nt.height)),Q<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const Z=Math.floor(Q*nt.width),Ct=Math.floor(Q*nt.height);h===void 0&&(h=g(Z,Ct));const ft=S?g(Z,Ct):h;return ft.width=Z,ft.height=Ct,ft.getContext("2d").drawImage(k,0,0,Z,Ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+Z+"x"+Ct+")."),ft}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),k;return k}function p(k){return k.generateMipmaps}function m(k){i.generateMipmap(k)}function _(k){return k.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?i.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(k,S,G,Q,nt=!1){if(k!==null){if(i[k]!==void 0)return i[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let Z=S;if(S===i.RED&&(G===i.FLOAT&&(Z=i.R32F),G===i.HALF_FLOAT&&(Z=i.R16F),G===i.UNSIGNED_BYTE&&(Z=i.R8)),S===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.R8UI),G===i.UNSIGNED_SHORT&&(Z=i.R16UI),G===i.UNSIGNED_INT&&(Z=i.R32UI),G===i.BYTE&&(Z=i.R8I),G===i.SHORT&&(Z=i.R16I),G===i.INT&&(Z=i.R32I)),S===i.RG&&(G===i.FLOAT&&(Z=i.RG32F),G===i.HALF_FLOAT&&(Z=i.RG16F),G===i.UNSIGNED_BYTE&&(Z=i.RG8)),S===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RG8UI),G===i.UNSIGNED_SHORT&&(Z=i.RG16UI),G===i.UNSIGNED_INT&&(Z=i.RG32UI),G===i.BYTE&&(Z=i.RG8I),G===i.SHORT&&(Z=i.RG16I),G===i.INT&&(Z=i.RG32I)),S===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),G===i.UNSIGNED_INT&&(Z=i.RGB32UI),G===i.BYTE&&(Z=i.RGB8I),G===i.SHORT&&(Z=i.RGB16I),G===i.INT&&(Z=i.RGB32I)),S===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),G===i.UNSIGNED_INT&&(Z=i.RGBA32UI),G===i.BYTE&&(Z=i.RGBA8I),G===i.SHORT&&(Z=i.RGBA16I),G===i.INT&&(Z=i.RGBA32I)),S===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),S===i.RGBA){const Ct=nt?Ic:ee.getTransfer(Q);G===i.FLOAT&&(Z=i.RGBA32F),G===i.HALF_FLOAT&&(Z=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Z=Ct===me?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function v(k,S){let G;return k?S===null||S===Ys||S===jo?G=i.DEPTH24_STENCIL8:S===li?G=i.DEPTH32F_STENCIL8:S===$r&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Ys||S===jo?G=i.DEPTH_COMPONENT24:S===li?G=i.DEPTH_COMPONENT32F:S===$r&&(G=i.DEPTH_COMPONENT16),G}function I(k,S){return p(k)===!0||k.isFramebufferTexture&&k.minFilter!==Pn&&k.minFilter!==ci?Math.log2(Math.max(S.width,S.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?S.mipmaps.length:1}function T(k){const S=k.target;S.removeEventListener("dispose",T),C(S),S.isVideoTexture&&d.delete(S)}function A(k){const S=k.target;S.removeEventListener("dispose",A),M(S)}function C(k){const S=n.get(k);if(S.__webglInit===void 0)return;const G=k.source,Q=u.get(G);if(Q){const nt=Q[S.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&y(k),Object.keys(Q).length===0&&u.delete(G)}n.remove(k)}function y(k){const S=n.get(k);i.deleteTexture(S.__webglTexture);const G=k.source,Q=u.get(G);delete Q[S.__cacheKey],r.memory.textures--}function M(k){const S=n.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),n.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(S.__webglFramebuffer[Q]))for(let nt=0;nt<S.__webglFramebuffer[Q].length;nt++)i.deleteFramebuffer(S.__webglFramebuffer[Q][nt]);else i.deleteFramebuffer(S.__webglFramebuffer[Q]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[Q])}else{if(Array.isArray(S.__webglFramebuffer))for(let Q=0;Q<S.__webglFramebuffer.length;Q++)i.deleteFramebuffer(S.__webglFramebuffer[Q]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Q=0;Q<S.__webglColorRenderbuffer.length;Q++)S.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[Q]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const G=k.textures;for(let Q=0,nt=G.length;Q<nt;Q++){const Z=n.get(G[Q]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),r.memory.textures--),n.remove(G[Q])}n.remove(k)}let R=0;function z(){R=0}function D(){const k=R;return k>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+s.maxTextures),R+=1,k}function V(k){const S=[];return S.push(k.wrapS),S.push(k.wrapT),S.push(k.wrapR||0),S.push(k.magFilter),S.push(k.minFilter),S.push(k.anisotropy),S.push(k.internalFormat),S.push(k.format),S.push(k.type),S.push(k.generateMipmaps),S.push(k.premultiplyAlpha),S.push(k.flipY),S.push(k.unpackAlignment),S.push(k.colorSpace),S.join()}function K(k,S){const G=n.get(k);if(k.isVideoTexture&&zt(k),k.isRenderTargetTexture===!1&&k.version>0&&G.__version!==k.version){const Q=k.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{P(G,k,S);return}}e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+S)}function j(k,S){const G=n.get(k);if(k.version>0&&G.__version!==k.version){P(G,k,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+S)}function et(k,S){const G=n.get(k);if(k.version>0&&G.__version!==k.version){P(G,k,S);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+S)}function q(k,S){const G=n.get(k);if(k.version>0&&G.__version!==k.version){U(G,k,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+S)}const lt={[Ud]:i.REPEAT,[Us]:i.CLAMP_TO_EDGE,[Nd]:i.MIRRORED_REPEAT},gt={[Pn]:i.NEAREST,[dx]:i.NEAREST_MIPMAP_NEAREST,[ca]:i.NEAREST_MIPMAP_LINEAR,[ci]:i.LINEAR,[qc]:i.LINEAR_MIPMAP_NEAREST,[Ns]:i.LINEAR_MIPMAP_LINEAR},At={[px]:i.NEVER,[bx]:i.ALWAYS,[mx]:i.LESS,[H0]:i.LEQUAL,[gx]:i.EQUAL,[yx]:i.GEQUAL,[xx]:i.GREATER,[vx]:i.NOTEQUAL};function Vt(k,S){if(S.type===li&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===ci||S.magFilter===qc||S.magFilter===ca||S.magFilter===Ns||S.minFilter===ci||S.minFilter===qc||S.minFilter===ca||S.minFilter===Ns)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(k,i.TEXTURE_WRAP_S,lt[S.wrapS]),i.texParameteri(k,i.TEXTURE_WRAP_T,lt[S.wrapT]),(k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY)&&i.texParameteri(k,i.TEXTURE_WRAP_R,lt[S.wrapR]),i.texParameteri(k,i.TEXTURE_MAG_FILTER,gt[S.magFilter]),i.texParameteri(k,i.TEXTURE_MIN_FILTER,gt[S.minFilter]),S.compareFunction&&(i.texParameteri(k,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(k,i.TEXTURE_COMPARE_FUNC,At[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Pn||S.minFilter!==ca&&S.minFilter!==Ns||S.type===li&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(k,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function oe(k,S){let G=!1;k.__webglInit===void 0&&(k.__webglInit=!0,S.addEventListener("dispose",T));const Q=S.source;let nt=u.get(Q);nt===void 0&&(nt={},u.set(Q,nt));const Z=V(S);if(Z!==k.__cacheKey){nt[Z]===void 0&&(nt[Z]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,G=!0),nt[Z].usedTimes++;const Ct=nt[k.__cacheKey];Ct!==void 0&&(nt[k.__cacheKey].usedTimes--,Ct.usedTimes===0&&y(S)),k.__cacheKey=Z,k.__webglTexture=nt[Z].texture}return G}function P(k,S,G){let Q=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Q=i.TEXTURE_3D);const nt=oe(k,S),Z=S.source;e.bindTexture(Q,k.__webglTexture,i.TEXTURE0+G);const Ct=n.get(Z);if(Z.version!==Ct.__version||nt===!0){e.activeTexture(i.TEXTURE0+G);const ft=ee.getPrimaries(ee.workingColorSpace),yt=S.colorSpace===ns?null:ee.getPrimaries(S.colorSpace),te=S.colorSpace===ns||ft===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let rt=x(S.image,!1,s.maxTextureSize);rt=Me(S,rt);const bt=o.convert(S.format,S.colorSpace),Nt=o.convert(S.type);let Ft=b(S.internalFormat,bt,Nt,S.colorSpace,S.isVideoTexture);Vt(Q,S);let Mt;const Jt=S.mipmaps,qt=S.isVideoTexture!==!0,ve=Ct.__version===void 0||nt===!0,N=Z.dataReady,ht=I(S,rt);if(S.isDepthTexture)Ft=v(S.format===Ko,S.type),ve&&(qt?e.texStorage2D(i.TEXTURE_2D,1,Ft,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,Ft,rt.width,rt.height,0,bt,Nt,null));else if(S.isDataTexture)if(Jt.length>0){qt&&ve&&e.texStorage2D(i.TEXTURE_2D,ht,Ft,Jt[0].width,Jt[0].height);for(let Y=0,tt=Jt.length;Y<tt;Y++)Mt=Jt[Y],qt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,Mt.width,Mt.height,bt,Nt,Mt.data):e.texImage2D(i.TEXTURE_2D,Y,Ft,Mt.width,Mt.height,0,bt,Nt,Mt.data);S.generateMipmaps=!1}else qt?(ve&&e.texStorage2D(i.TEXTURE_2D,ht,Ft,rt.width,rt.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,bt,Nt,rt.data)):e.texImage2D(i.TEXTURE_2D,0,Ft,rt.width,rt.height,0,bt,Nt,rt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){qt&&ve&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,Ft,Jt[0].width,Jt[0].height,rt.depth);for(let Y=0,tt=Jt.length;Y<tt;Y++)if(Mt=Jt[Y],S.format!==ni)if(bt!==null)if(qt){if(N)if(S.layerUpdates.size>0){const xt=Rf(Mt.width,Mt.height,S.format,S.type);for(const pt of S.layerUpdates){const Wt=Mt.data.subarray(pt*xt/Mt.data.BYTES_PER_ELEMENT,(pt+1)*xt/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,pt,Mt.width,Mt.height,1,bt,Wt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Mt.width,Mt.height,rt.depth,bt,Mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Ft,Mt.width,Mt.height,rt.depth,0,Mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Mt.width,Mt.height,rt.depth,bt,Nt,Mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Ft,Mt.width,Mt.height,rt.depth,0,bt,Nt,Mt.data)}else{qt&&ve&&e.texStorage2D(i.TEXTURE_2D,ht,Ft,Jt[0].width,Jt[0].height);for(let Y=0,tt=Jt.length;Y<tt;Y++)Mt=Jt[Y],S.format!==ni?bt!==null?qt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Mt.width,Mt.height,bt,Mt.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Ft,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,Mt.width,Mt.height,bt,Nt,Mt.data):e.texImage2D(i.TEXTURE_2D,Y,Ft,Mt.width,Mt.height,0,bt,Nt,Mt.data)}else if(S.isDataArrayTexture)if(qt){if(ve&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,Ft,rt.width,rt.height,rt.depth),N)if(S.layerUpdates.size>0){const Y=Rf(rt.width,rt.height,S.format,S.type);for(const tt of S.layerUpdates){const xt=rt.data.subarray(tt*Y/rt.data.BYTES_PER_ELEMENT,(tt+1)*Y/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,tt,rt.width,rt.height,1,bt,Nt,xt)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,bt,Nt,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,rt.width,rt.height,rt.depth,0,bt,Nt,rt.data);else if(S.isData3DTexture)qt?(ve&&e.texStorage3D(i.TEXTURE_3D,ht,Ft,rt.width,rt.height,rt.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,bt,Nt,rt.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,rt.width,rt.height,rt.depth,0,bt,Nt,rt.data);else if(S.isFramebufferTexture){if(ve)if(qt)e.texStorage2D(i.TEXTURE_2D,ht,Ft,rt.width,rt.height);else{let Y=rt.width,tt=rt.height;for(let xt=0;xt<ht;xt++)e.texImage2D(i.TEXTURE_2D,xt,Ft,Y,tt,0,bt,Nt,null),Y>>=1,tt>>=1}}else if(Jt.length>0){if(qt&&ve){const Y=It(Jt[0]);e.texStorage2D(i.TEXTURE_2D,ht,Ft,Y.width,Y.height)}for(let Y=0,tt=Jt.length;Y<tt;Y++)Mt=Jt[Y],qt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,bt,Nt,Mt):e.texImage2D(i.TEXTURE_2D,Y,Ft,bt,Nt,Mt);S.generateMipmaps=!1}else if(qt){if(ve){const Y=It(rt);e.texStorage2D(i.TEXTURE_2D,ht,Ft,Y.width,Y.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,Nt,rt)}else e.texImage2D(i.TEXTURE_2D,0,Ft,bt,Nt,rt);p(S)&&m(Q),Ct.__version=Z.version,S.onUpdate&&S.onUpdate(S)}k.__version=S.version}function U(k,S,G){if(S.image.length!==6)return;const Q=oe(k,S),nt=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+G);const Z=n.get(nt);if(nt.version!==Z.__version||Q===!0){e.activeTexture(i.TEXTURE0+G);const Ct=ee.getPrimaries(ee.workingColorSpace),ft=S.colorSpace===ns?null:ee.getPrimaries(S.colorSpace),yt=S.colorSpace===ns||Ct===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const te=S.isCompressedTexture||S.image[0].isCompressedTexture,rt=S.image[0]&&S.image[0].isDataTexture,bt=[];for(let tt=0;tt<6;tt++)!te&&!rt?bt[tt]=x(S.image[tt],!0,s.maxCubemapSize):bt[tt]=rt?S.image[tt].image:S.image[tt],bt[tt]=Me(S,bt[tt]);const Nt=bt[0],Ft=o.convert(S.format,S.colorSpace),Mt=o.convert(S.type),Jt=b(S.internalFormat,Ft,Mt,S.colorSpace),qt=S.isVideoTexture!==!0,ve=Z.__version===void 0||Q===!0,N=nt.dataReady;let ht=I(S,Nt);Vt(i.TEXTURE_CUBE_MAP,S);let Y;if(te){qt&&ve&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,Jt,Nt.width,Nt.height);for(let tt=0;tt<6;tt++){Y=bt[tt].mipmaps;for(let xt=0;xt<Y.length;xt++){const pt=Y[xt];S.format!==ni?Ft!==null?qt?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt,0,0,pt.width,pt.height,Ft,pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt,Jt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt,0,0,pt.width,pt.height,Ft,Mt,pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt,Jt,pt.width,pt.height,0,Ft,Mt,pt.data)}}}else{if(Y=S.mipmaps,qt&&ve){Y.length>0&&ht++;const tt=It(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,Jt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(rt){qt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,bt[tt].width,bt[tt].height,Ft,Mt,bt[tt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Jt,bt[tt].width,bt[tt].height,0,Ft,Mt,bt[tt].data);for(let xt=0;xt<Y.length;xt++){const Wt=Y[xt].image[tt].image;qt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt+1,0,0,Wt.width,Wt.height,Ft,Mt,Wt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt+1,Jt,Wt.width,Wt.height,0,Ft,Mt,Wt.data)}}else{qt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Ft,Mt,bt[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Jt,Ft,Mt,bt[tt]);for(let xt=0;xt<Y.length;xt++){const pt=Y[xt];qt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt+1,0,0,Ft,Mt,pt.image[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,xt+1,Jt,Ft,Mt,pt.image[tt])}}}p(S)&&m(i.TEXTURE_CUBE_MAP),Z.__version=nt.version,S.onUpdate&&S.onUpdate(S)}k.__version=S.version}function J(k,S,G,Q,nt,Z){const Ct=o.convert(G.format,G.colorSpace),ft=o.convert(G.type),yt=b(G.internalFormat,Ct,ft,G.colorSpace),te=n.get(S),rt=n.get(G);if(rt.__renderTarget=S,!te.__hasExternalTextures){const bt=Math.max(1,S.width>>Z),Nt=Math.max(1,S.height>>Z);nt===i.TEXTURE_3D||nt===i.TEXTURE_2D_ARRAY?e.texImage3D(nt,Z,yt,bt,Nt,S.depth,0,Ct,ft,null):e.texImage2D(nt,Z,yt,bt,Nt,0,Ct,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,k),Zt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,nt,rt.__webglTexture,0,Ht(S)):(nt===i.TEXTURE_2D||nt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,nt,rt.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function X(k,S,G){if(i.bindRenderbuffer(i.RENDERBUFFER,k),S.depthBuffer){const Q=S.depthTexture,nt=Q&&Q.isDepthTexture?Q.type:null,Z=v(S.stencilBuffer,nt),Ct=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=Ht(S);Zt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ft,Z,S.width,S.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,ft,Z,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Z,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ct,i.RENDERBUFFER,k)}else{const Q=S.textures;for(let nt=0;nt<Q.length;nt++){const Z=Q[nt],Ct=o.convert(Z.format,Z.colorSpace),ft=o.convert(Z.type),yt=b(Z.internalFormat,Ct,ft,Z.colorSpace),te=Ht(S);G&&Zt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,te,yt,S.width,S.height):Zt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te,yt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,yt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ct(k,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,k),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=n.get(S.depthTexture);Q.__renderTarget=S,(!Q.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),K(S.depthTexture,0);const nt=Q.__webglTexture,Z=Ht(S);if(S.depthTexture.format===Bo)Zt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0);else if(S.depthTexture.format===Ko)Zt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function vt(k){const S=n.get(k),G=k.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==k.depthTexture){const Q=k.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Q){const nt=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Q.removeEventListener("dispose",nt)};Q.addEventListener("dispose",nt),S.__depthDisposeCallback=nt}S.__boundDepthTexture=Q}if(k.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");ct(S.__webglFramebuffer,k)}else if(G){S.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[Q]),S.__webglDepthbuffer[Q]===void 0)S.__webglDepthbuffer[Q]=i.createRenderbuffer(),X(S.__webglDepthbuffer[Q],k,!1);else{const nt=k.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=S.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),X(S.__webglDepthbuffer,k,!1);else{const Q=k.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,nt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(k,S,G){const Q=n.get(k);S!==void 0&&J(Q.__webglFramebuffer,k,k.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&vt(k)}function jt(k){const S=k.texture,G=n.get(k),Q=n.get(S);k.addEventListener("dispose",A);const nt=k.textures,Z=k.isWebGLCubeRenderTarget===!0,Ct=nt.length>1;if(Ct||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=S.version,r.memory.textures++),Z){G.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[ft]=[];for(let yt=0;yt<S.mipmaps.length;yt++)G.__webglFramebuffer[ft][yt]=i.createFramebuffer()}else G.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let ft=0;ft<S.mipmaps.length;ft++)G.__webglFramebuffer[ft]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(Ct)for(let ft=0,yt=nt.length;ft<yt;ft++){const te=n.get(nt[ft]);te.__webglTexture===void 0&&(te.__webglTexture=i.createTexture(),r.memory.textures++)}if(k.samples>0&&Zt(k)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ft=0;ft<nt.length;ft++){const yt=nt[ft];G.__webglColorRenderbuffer[ft]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[ft]);const te=o.convert(yt.format,yt.colorSpace),rt=o.convert(yt.type),bt=b(yt.internalFormat,te,rt,yt.colorSpace,k.isXRRenderTarget===!0),Nt=Ht(k);i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,bt,k.width,k.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,G.__webglColorRenderbuffer[ft])}i.bindRenderbuffer(i.RENDERBUFFER,null),k.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),X(G.__webglDepthRenderbuffer,k,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Vt(i.TEXTURE_CUBE_MAP,S);for(let ft=0;ft<6;ft++)if(S.mipmaps&&S.mipmaps.length>0)for(let yt=0;yt<S.mipmaps.length;yt++)J(G.__webglFramebuffer[ft][yt],k,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,yt);else J(G.__webglFramebuffer[ft],k,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);p(S)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ct){for(let ft=0,yt=nt.length;ft<yt;ft++){const te=nt[ft],rt=n.get(te);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),Vt(i.TEXTURE_2D,te),J(G.__webglFramebuffer,k,te,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,0),p(te)&&m(i.TEXTURE_2D)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(ft=k.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ft,Q.__webglTexture),Vt(ft,S),S.mipmaps&&S.mipmaps.length>0)for(let yt=0;yt<S.mipmaps.length;yt++)J(G.__webglFramebuffer[yt],k,S,i.COLOR_ATTACHMENT0,ft,yt);else J(G.__webglFramebuffer,k,S,i.COLOR_ATTACHMENT0,ft,0);p(S)&&m(ft),e.unbindTexture()}k.depthBuffer&&vt(k)}function Bt(k){const S=k.textures;for(let G=0,Q=S.length;G<Q;G++){const nt=S[G];if(p(nt)){const Z=_(k),Ct=n.get(nt).__webglTexture;e.bindTexture(Z,Ct),m(Z),e.unbindTexture()}}}const ue=[],F=[];function Ze(k){if(k.samples>0){if(Zt(k)===!1){const S=k.textures,G=k.width,Q=k.height;let nt=i.COLOR_BUFFER_BIT;const Z=k.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ct=n.get(k),ft=S.length>1;if(ft)for(let yt=0;yt<S.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer);for(let yt=0;yt<S.length;yt++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(nt|=i.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(nt|=i.STENCIL_BUFFER_BIT)),ft){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ct.__webglColorRenderbuffer[yt]);const te=n.get(S[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,G,Q,0,0,G,Q,nt,i.NEAREST),c===!0&&(ue.length=0,F.length=0,ue.push(i.COLOR_ATTACHMENT0+yt),k.depthBuffer&&k.resolveDepthBuffer===!1&&(ue.push(Z),F.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,F)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ue))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ft)for(let yt=0;yt<S.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,Ct.__webglColorRenderbuffer[yt]);const te=n.get(S[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,te,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&c){const S=k.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function Ht(k){return Math.min(s.maxSamples,k.samples)}function Zt(k){const S=n.get(k);return k.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function zt(k){const S=r.render.frame;d.get(k)!==S&&(d.set(k,S),k.update())}function Me(k,S){const G=k.colorSpace,Q=k.format,nt=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||G!==nr&&G!==ns&&(ee.getTransfer(G)===me?(Q!==ni||nt!==zi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}function It(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(l.width=k.naturalWidth||k.width,l.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(l.width=k.displayWidth,l.height=k.displayHeight):(l.width=k.width,l.height=k.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=z,this.setTexture2D=K,this.setTexture2DArray=j,this.setTexture3D=et,this.setTextureCube=q,this.rebindTextures=Ut,this.setupRenderTarget=jt,this.updateRenderTargetMipmap=Bt,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=vt,this.setupFrameBufferTexture=J,this.useMultisampledRTT=Zt}function S2(i,t){function e(n,s=ns){let o;const r=ee.getTransfer(s);if(n===zi)return i.UNSIGNED_BYTE;if(n===Wh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===$h)return i.UNSIGNED_SHORT_5_5_5_1;if(n===I0)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===L0)return i.BYTE;if(n===D0)return i.SHORT;if(n===$r)return i.UNSIGNED_SHORT;if(n===Vh)return i.INT;if(n===Ys)return i.UNSIGNED_INT;if(n===li)return i.FLOAT;if(n===ta)return i.HALF_FLOAT;if(n===z0)return i.ALPHA;if(n===U0)return i.RGB;if(n===ni)return i.RGBA;if(n===N0)return i.LUMINANCE;if(n===F0)return i.LUMINANCE_ALPHA;if(n===Bo)return i.DEPTH_COMPONENT;if(n===Ko)return i.DEPTH_STENCIL;if(n===Xh)return i.RED;if(n===qh)return i.RED_INTEGER;if(n===O0)return i.RG;if(n===Yh)return i.RG_INTEGER;if(n===jh)return i.RGBA_INTEGER;if(n===sc||n===oc||n===rc||n===ac)if(r===me)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===sc)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===oc)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===rc)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ac)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===sc)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===oc)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===rc)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ac)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fd||n===Od||n===Bd||n===Hd)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Fd)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Od)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Bd)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Hd)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Gd||n===Vd||n===Wd)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===Gd||n===Vd)return r===me?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===Wd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===$d||n===Xd||n===qd||n===Yd||n===jd||n===Kd||n===Zd||n===Jd||n===Qd||n===th||n===eh||n===nh||n===ih||n===sh)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===$d)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Xd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===qd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Yd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===jd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Kd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Jd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qd)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===th)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===eh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ih)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sh)return r===me?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cc||n===oh||n===rh)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===cc)return r===me?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===oh)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===rh)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===B0||n===ah||n===ch||n===lh)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===cc)return o.COMPRESSED_RED_RGTC1_EXT;if(n===ah)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ch)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===lh)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===jo?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class E2 extends kn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class _t extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const T2={type:"move"};class _l{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const x of t.hand.values()){const p=e.getJointPose(x,n),m=this._getHandJoint(l,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],u=d.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(T2)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new _t;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const A2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C2=`
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

}`;class R2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new cn,o=t.properties.get(s);o.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ui({vertexShader:A2,fragmentShader:C2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ot(new wn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class k2 extends ir{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",c=1,l=null,d=null,h=null,u=null,f=null,g=null;const x=new R2,p=e.getContextAttributes();let m=null,_=null;const b=[],v=[],I=new ut;let T=null;const A=new kn;A.viewport=new xe;const C=new kn;C.viewport=new xe;const y=[A,C],M=new E2;let R=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(P){let U=b[P];return U===void 0&&(U=new _l,b[P]=U),U.getTargetRaySpace()},this.getControllerGrip=function(P){let U=b[P];return U===void 0&&(U=new _l,b[P]=U),U.getGripSpace()},this.getHand=function(P){let U=b[P];return U===void 0&&(U=new _l,b[P]=U),U.getHandSpace()};function D(P){const U=v.indexOf(P.inputSource);if(U===-1)return;const J=b[U];J!==void 0&&(J.update(P.inputSource,P.frame,l||r),J.dispatchEvent({type:P.type,data:P.inputSource}))}function V(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",K);for(let P=0;P<b.length;P++){const U=v[P];U!==null&&(v[P]=null,b[P].disconnect(U))}R=null,z=null,x.reset(),t.setRenderTarget(m),f=null,u=null,h=null,s=null,_=null,oe.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(P){o=P,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(P){a=P,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(P){l=P},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(P){if(s=P,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",V),s.addEventListener("inputsourceschange",K),p.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(I),s.renderState.layers===void 0){const U={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:o};f=new XRWebGLLayer(s,e,U),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new js(f.framebufferWidth,f.framebufferHeight,{format:ni,type:zi,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let U=null,J=null,X=null;p.depth&&(X=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,U=p.stencil?Ko:Bo,J=p.stencil?jo:Ys);const ct={colorFormat:e.RGBA8,depthFormat:X,scaleFactor:o};h=new XRWebGLBinding(s,e),u=h.createProjectionLayer(ct),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new js(u.textureWidth,u.textureHeight,{format:ni,type:zi,depthTexture:new tm(u.textureWidth,u.textureHeight,J,void 0,void 0,void 0,void 0,void 0,void 0,U),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(a),oe.setContext(s),oe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function K(P){for(let U=0;U<P.removed.length;U++){const J=P.removed[U],X=v.indexOf(J);X>=0&&(v[X]=null,b[X].disconnect(J))}for(let U=0;U<P.added.length;U++){const J=P.added[U];let X=v.indexOf(J);if(X===-1){for(let vt=0;vt<b.length;vt++)if(vt>=v.length){v.push(J),X=vt;break}else if(v[vt]===null){v[vt]=J,X=vt;break}if(X===-1)break}const ct=b[X];ct&&ct.connect(J)}}const j=new L,et=new L;function q(P,U,J){j.setFromMatrixPosition(U.matrixWorld),et.setFromMatrixPosition(J.matrixWorld);const X=j.distanceTo(et),ct=U.projectionMatrix.elements,vt=J.projectionMatrix.elements,Ut=ct[14]/(ct[10]-1),jt=ct[14]/(ct[10]+1),Bt=(ct[9]+1)/ct[5],ue=(ct[9]-1)/ct[5],F=(ct[8]-1)/ct[0],Ze=(vt[8]+1)/vt[0],Ht=Ut*F,Zt=Ut*Ze,zt=X/(-F+Ze),Me=zt*-F;if(U.matrixWorld.decompose(P.position,P.quaternion,P.scale),P.translateX(Me),P.translateZ(zt),P.matrixWorld.compose(P.position,P.quaternion,P.scale),P.matrixWorldInverse.copy(P.matrixWorld).invert(),ct[10]===-1)P.projectionMatrix.copy(U.projectionMatrix),P.projectionMatrixInverse.copy(U.projectionMatrixInverse);else{const It=Ut+zt,k=jt+zt,S=Ht-Me,G=Zt+(X-Me),Q=Bt*jt/k*It,nt=ue*jt/k*It;P.projectionMatrix.makePerspective(S,G,Q,nt,It,k),P.projectionMatrixInverse.copy(P.projectionMatrix).invert()}}function lt(P,U){U===null?P.matrixWorld.copy(P.matrix):P.matrixWorld.multiplyMatrices(U.matrixWorld,P.matrix),P.matrixWorldInverse.copy(P.matrixWorld).invert()}this.updateCamera=function(P){if(s===null)return;let U=P.near,J=P.far;x.texture!==null&&(x.depthNear>0&&(U=x.depthNear),x.depthFar>0&&(J=x.depthFar)),M.near=C.near=A.near=U,M.far=C.far=A.far=J,(R!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,z=M.far),A.layers.mask=P.layers.mask|2,C.layers.mask=P.layers.mask|4,M.layers.mask=A.layers.mask|C.layers.mask;const X=P.parent,ct=M.cameras;lt(M,X);for(let vt=0;vt<ct.length;vt++)lt(ct[vt],X);ct.length===2?q(M,A,C):M.projectionMatrix.copy(A.projectionMatrix),gt(P,M,X)};function gt(P,U,J){J===null?P.matrix.copy(U.matrixWorld):(P.matrix.copy(J.matrixWorld),P.matrix.invert(),P.matrix.multiply(U.matrixWorld)),P.matrix.decompose(P.position,P.quaternion,P.scale),P.updateMatrixWorld(!0),P.projectionMatrix.copy(U.projectionMatrix),P.projectionMatrixInverse.copy(U.projectionMatrixInverse),P.isPerspectiveCamera&&(P.fov=hh*2*Math.atan(1/P.projectionMatrix.elements[5]),P.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(P){c=P,u!==null&&(u.fixedFoveation=P),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=P)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)};let At=null;function Vt(P,U){if(d=U.getViewerPose(l||r),g=U,d!==null){const J=d.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let X=!1;J.length!==M.cameras.length&&(M.cameras.length=0,X=!0);for(let vt=0;vt<J.length;vt++){const Ut=J[vt];let jt=null;if(f!==null)jt=f.getViewport(Ut);else{const ue=h.getViewSubImage(u,Ut);jt=ue.viewport,vt===0&&(t.setRenderTargetTextures(_,ue.colorTexture,u.ignoreDepthValues?void 0:ue.depthStencilTexture),t.setRenderTarget(_))}let Bt=y[vt];Bt===void 0&&(Bt=new kn,Bt.layers.enable(vt),Bt.viewport=new xe,y[vt]=Bt),Bt.matrix.fromArray(Ut.transform.matrix),Bt.matrix.decompose(Bt.position,Bt.quaternion,Bt.scale),Bt.projectionMatrix.fromArray(Ut.projectionMatrix),Bt.projectionMatrixInverse.copy(Bt.projectionMatrix).invert(),Bt.viewport.set(jt.x,jt.y,jt.width,jt.height),vt===0&&(M.matrix.copy(Bt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),X===!0&&M.cameras.push(Bt)}const ct=s.enabledFeatures;if(ct&&ct.includes("depth-sensing")){const vt=h.getDepthInformation(J[0]);vt&&vt.isValid&&vt.texture&&x.init(t,vt,s.renderState)}}for(let J=0;J<b.length;J++){const X=v[J],ct=b[J];X!==null&&ct!==void 0&&ct.update(X,U,l||r)}At&&At(P,U),U.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:U}),g=null}const oe=new J0;oe.setAnimationLoop(Vt),this.setAnimationLoop=function(P){At=P},this.dispose=function(){}}}const bs=new _n,P2=new Kt;function L2(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,j0(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,_,b,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?o(p,m):m.isMeshToonMaterial?(o(p,m),h(p,m)):m.isMeshPhongMaterial?(o(p,m),d(p,m)):m.isMeshStandardMaterial?(o(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,v)):m.isMeshMatcapMaterial?(o(p,m),g(p,m)):m.isMeshDepthMaterial?o(p,m):m.isMeshDistanceMaterial?(o(p,m),x(p,m)):m.isMeshNormalMaterial?o(p,m):m.isLineBasicMaterial?(r(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,_,b):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function o(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===gn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===gn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const _=t.get(m),b=_.envMap,v=_.envMapRotation;b&&(p.envMap.value=b,bs.copy(v),bs.x*=-1,bs.y*=-1,bs.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(bs.y*=-1,bs.z*=-1),p.envMapRotation.value.setFromMatrix4(P2.makeRotationFromEuler(bs)),p.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function r(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,_,b){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*_,p.scale.value=b*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function d(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,_){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===gn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){const _=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function D2(i,t,e,n){let s={},o={},r=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,b){const v=b.program;n.uniformBlockBinding(_,v)}function l(_,b){let v=s[_.id];v===void 0&&(g(_),v=d(_),s[_.id]=v,_.addEventListener("dispose",p));const I=b.program;n.updateUBOMapping(_,I);const T=t.render.frame;o[_.id]!==T&&(u(_),o[_.id]=T)}function d(_){const b=h();_.__bindingPointIndex=b;const v=i.createBuffer(),I=_.__size,T=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,I,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,v),v}function h(){for(let _=0;_<a;_++)if(r.indexOf(_)===-1)return r.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const b=s[_.id],v=_.uniforms,I=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let T=0,A=v.length;T<A;T++){const C=Array.isArray(v[T])?v[T]:[v[T]];for(let y=0,M=C.length;y<M;y++){const R=C[y];if(f(R,T,y,I)===!0){const z=R.__offset,D=Array.isArray(R.value)?R.value:[R.value];let V=0;for(let K=0;K<D.length;K++){const j=D[K],et=x(j);typeof j=="number"||typeof j=="boolean"?(R.__data[0]=j,i.bufferSubData(i.UNIFORM_BUFFER,z+V,R.__data)):j.isMatrix3?(R.__data[0]=j.elements[0],R.__data[1]=j.elements[1],R.__data[2]=j.elements[2],R.__data[3]=0,R.__data[4]=j.elements[3],R.__data[5]=j.elements[4],R.__data[6]=j.elements[5],R.__data[7]=0,R.__data[8]=j.elements[6],R.__data[9]=j.elements[7],R.__data[10]=j.elements[8],R.__data[11]=0):(j.toArray(R.__data,V),V+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(_,b,v,I){const T=_.value,A=b+"_"+v;if(I[A]===void 0)return typeof T=="number"||typeof T=="boolean"?I[A]=T:I[A]=T.clone(),!0;{const C=I[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return I[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(_){const b=_.uniforms;let v=0;const I=16;for(let A=0,C=b.length;A<C;A++){const y=Array.isArray(b[A])?b[A]:[b[A]];for(let M=0,R=y.length;M<R;M++){const z=y[M],D=Array.isArray(z.value)?z.value:[z.value];for(let V=0,K=D.length;V<K;V++){const j=D[V],et=x(j),q=v%I,lt=q%et.boundary,gt=q+lt;v+=lt,gt!==0&&I-gt<et.storage&&(v+=I-gt),z.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=et.storage}}}const T=v%I;return T>0&&(v+=I-T),_.__size=v,_.__cache={},this}function x(_){const b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),b}function p(_){const b=_.target;b.removeEventListener("dispose",p);const v=r.indexOf(b.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete o[b.id]}function m(){for(const _ in s)i.deleteBuffer(s[_]);r=[],s={},o={}}return{bind:c,update:l,dispose:m}}class I2{constructor(t={}){const{canvas:e=_x(),context:n=null,depth:s=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=r;const g=new Uint32Array(4),x=new Int32Array(4);let p=null,m=null;const _=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=mn,this.toneMapping=as,this.toneMappingExposure=1;const v=this;let I=!1,T=0,A=0,C=null,y=-1,M=null;const R=new xe,z=new xe;let D=null;const V=new Dt(0);let K=0,j=e.width,et=e.height,q=1,lt=null,gt=null;const At=new xe(0,0,j,et),Vt=new xe(0,0,j,et);let oe=!1;const P=new Jh;let U=!1,J=!1;const X=new Kt,ct=new Kt,vt=new L,Ut=new xe,jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Bt=!1;function ue(){return C===null?q:1}let F=n;function Ze(E,O){return e.getContext(E,O)}try{const E={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Hh}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",xt,!1),e.addEventListener("webglcontextcreationerror",pt,!1),F===null){const O="webgl2";if(F=Ze(O,E),F===null)throw Ze(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ht,Zt,zt,Me,It,k,S,G,Q,nt,Z,Ct,ft,yt,te,rt,bt,Nt,Ft,Mt,Jt,qt,ve,N;function ht(){Ht=new Oy(F),Ht.init(),qt=new S2(F,Ht),Zt=new Dy(F,Ht,t,qt),zt=new M2(F,Ht),Zt.reverseDepthBuffer&&u&&zt.buffers.depth.setReversed(!0),Me=new Gy(F),It=new r2,k=new w2(F,Ht,zt,It,Zt,qt,Me),S=new zy(v),G=new Fy(v),Q=new jx(F),ve=new Py(F,Q),nt=new By(F,Q,Me,ve),Z=new Wy(F,nt,Q,Me),Ft=new Vy(F,Zt,k),rt=new Iy(It),Ct=new o2(v,S,G,Ht,Zt,ve,rt),ft=new L2(v,It),yt=new c2,te=new p2(Ht),Nt=new ky(v,S,G,zt,Z,f,c),bt=new y2(v,Z,Zt),N=new D2(F,Me,Zt,zt),Mt=new Ly(F,Ht,Me),Jt=new Hy(F,Ht,Me),Me.programs=Ct.programs,v.capabilities=Zt,v.extensions=Ht,v.properties=It,v.renderLists=yt,v.shadowMap=bt,v.state=zt,v.info=Me}ht();const Y=new k2(v,F);this.xr=Y,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=Ht.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ht.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(E){E!==void 0&&(q=E,this.setSize(j,et,!1))},this.getSize=function(E){return E.set(j,et)},this.setSize=function(E,O,W=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=E,et=O,e.width=Math.floor(E*q),e.height=Math.floor(O*q),W===!0&&(e.style.width=E+"px",e.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(j*q,et*q).floor()},this.setDrawingBufferSize=function(E,O,W){j=E,et=O,q=W,e.width=Math.floor(E*W),e.height=Math.floor(O*W),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(At)},this.setViewport=function(E,O,W,$){E.isVector4?At.set(E.x,E.y,E.z,E.w):At.set(E,O,W,$),zt.viewport(R.copy(At).multiplyScalar(q).round())},this.getScissor=function(E){return E.copy(Vt)},this.setScissor=function(E,O,W,$){E.isVector4?Vt.set(E.x,E.y,E.z,E.w):Vt.set(E,O,W,$),zt.scissor(z.copy(Vt).multiplyScalar(q).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(E){zt.setScissorTest(oe=E)},this.setOpaqueSort=function(E){lt=E},this.setTransparentSort=function(E){gt=E},this.getClearColor=function(E){return E.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor.apply(Nt,arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha.apply(Nt,arguments)},this.clear=function(E=!0,O=!0,W=!0){let $=0;if(E){let B=!1;if(C!==null){const at=C.texture.format;B=at===jh||at===Yh||at===qh}if(B){const at=C.texture.type,mt=at===zi||at===Ys||at===$r||at===jo||at===Wh||at===$h,St=Nt.getClearColor(),Et=Nt.getClearAlpha(),Ot=St.r,$t=St.g,Tt=St.b;mt?(g[0]=Ot,g[1]=$t,g[2]=Tt,g[3]=Et,F.clearBufferuiv(F.COLOR,0,g)):(x[0]=Ot,x[1]=$t,x[2]=Tt,x[3]=Et,F.clearBufferiv(F.COLOR,0,x))}else $|=F.COLOR_BUFFER_BIT}O&&($|=F.DEPTH_BUFFER_BIT),W&&($|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",xt,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),yt.dispose(),te.dispose(),It.dispose(),S.dispose(),G.dispose(),Z.dispose(),ve.dispose(),N.dispose(),Ct.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Eu),Y.removeEventListener("sessionend",Tu),ps.stop()};function tt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function xt(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const E=Me.autoReset,O=bt.enabled,W=bt.autoUpdate,$=bt.needsUpdate,B=bt.type;ht(),Me.autoReset=E,bt.enabled=O,bt.autoUpdate=W,bt.needsUpdate=$,bt.type=B}function pt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Wt(E){const O=E.target;O.removeEventListener("dispose",Wt),De(O)}function De(E){nn(E),It.remove(E)}function nn(E){const O=It.get(E).programs;O!==void 0&&(O.forEach(function(W){Ct.releaseProgram(W)}),E.isShaderMaterial&&Ct.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,W,$,B,at){O===null&&(O=jt);const mt=B.isMesh&&B.matrixWorld.determinant()<0,St=Pg(E,O,W,$,B);zt.setMaterial($,mt);let Et=W.index,Ot=1;if($.wireframe===!0){if(Et=nt.getWireframeAttribute(W),Et===void 0)return;Ot=2}const $t=W.drawRange,Tt=W.attributes.position;let ne=$t.start*Ot,ye=($t.start+$t.count)*Ot;at!==null&&(ne=Math.max(ne,at.start*Ot),ye=Math.min(ye,(at.start+at.count)*Ot)),Et!==null?(ne=Math.max(ne,0),ye=Math.min(ye,Et.count)):Tt!=null&&(ne=Math.max(ne,0),ye=Math.min(ye,Tt.count));const _e=ye-ne;if(_e<0||_e===1/0)return;ve.setup(B,$,St,W,Et);let vn,ce=Mt;if(Et!==null&&(vn=Q.get(Et),ce=Jt,ce.setIndex(vn)),B.isMesh)$.wireframe===!0?(zt.setLineWidth($.wireframeLinewidth*ue()),ce.setMode(F.LINES)):ce.setMode(F.TRIANGLES);else if(B.isLine){let Rt=$.linewidth;Rt===void 0&&(Rt=1),zt.setLineWidth(Rt*ue()),B.isLineSegments?ce.setMode(F.LINES):B.isLineLoop?ce.setMode(F.LINE_LOOP):ce.setMode(F.LINE_STRIP)}else B.isPoints?ce.setMode(F.POINTS):B.isSprite&&ce.setMode(F.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)ce.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Ht.get("WEBGL_multi_draw"))ce.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Rt=B._multiDrawStarts,xi=B._multiDrawCounts,le=B._multiDrawCount,qn=Et?Q.get(Et).bytesPerElement:1,to=It.get($).currentProgram.getUniforms();for(let Sn=0;Sn<le;Sn++)to.setValue(F,"_gl_DrawID",Sn),ce.render(Rt[Sn]/qn,xi[Sn])}else if(B.isInstancedMesh)ce.renderInstances(ne,_e,B.count);else if(W.isInstancedBufferGeometry){const Rt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,xi=Math.min(W.instanceCount,Rt);ce.renderInstances(ne,_e,xi)}else ce.render(ne,_e)};function fe(E,O,W){E.transparent===!0&&E.side===be&&E.forceSinglePass===!1?(E.side=gn,E.needsUpdate=!0,aa(E,O,W),E.side=ls,E.needsUpdate=!0,aa(E,O,W),E.side=be):aa(E,O,W)}this.compile=function(E,O,W=null){W===null&&(W=E),m=te.get(W),m.init(O),b.push(m),W.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),E!==W&&E.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights();const $=new Set;return E.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const at=B.material;if(at)if(Array.isArray(at))for(let mt=0;mt<at.length;mt++){const St=at[mt];fe(St,W,B),$.add(St)}else fe(at,W,B),$.add(at)}),b.pop(),m=null,$},this.compileAsync=function(E,O,W=null){const $=this.compile(E,O,W);return new Promise(B=>{function at(){if($.forEach(function(mt){It.get(mt).currentProgram.isReady()&&$.delete(mt)}),$.size===0){B(E);return}setTimeout(at,10)}Ht.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let Xn=null;function gi(E){Xn&&Xn(E)}function Eu(){ps.stop()}function Tu(){ps.start()}const ps=new J0;ps.setAnimationLoop(gi),typeof self<"u"&&ps.setContext(self),this.setAnimationLoop=function(E){Xn=E,Y.setAnimationLoop(E),E===null?ps.stop():ps.start()},Y.addEventListener("sessionstart",Eu),Y.addEventListener("sessionend",Tu),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(O),O=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,O,C),m=te.get(E,b.length),m.init(O),b.push(m),ct.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),P.setFromProjectionMatrix(ct),J=this.localClippingEnabled,U=rt.init(this.clippingPlanes,J),p=yt.get(E,_.length),p.init(),_.push(p),Y.enabled===!0&&Y.isPresenting===!0){const at=v.xr.getDepthSensingMesh();at!==null&&Xc(at,O,-1/0,v.sortObjects)}Xc(E,O,0,v.sortObjects),p.finish(),v.sortObjects===!0&&p.sort(lt,gt),Bt=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Bt&&Nt.addToRenderList(p,E),this.info.render.frame++,U===!0&&rt.beginShadows();const W=m.state.shadowsArray;bt.render(W,E,O),U===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=p.opaque,B=p.transmissive;if(m.setupLights(),O.isArrayCamera){const at=O.cameras;if(B.length>0)for(let mt=0,St=at.length;mt<St;mt++){const Et=at[mt];Cu($,B,E,Et)}Bt&&Nt.render(E);for(let mt=0,St=at.length;mt<St;mt++){const Et=at[mt];Au(p,E,Et,Et.viewport)}}else B.length>0&&Cu($,B,E,O),Bt&&Nt.render(E),Au(p,E,O);C!==null&&(k.updateMultisampleRenderTarget(C),k.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(v,E,O),ve.resetDefaultState(),y=-1,M=null,b.pop(),b.length>0?(m=b[b.length-1],U===!0&&rt.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,_.pop(),_.length>0?p=_[_.length-1]:p=null};function Xc(E,O,W,$){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||P.intersectsSprite(E)){$&&Ut.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ct);const mt=Z.update(E),St=E.material;St.visible&&p.push(E,mt,St,W,Ut.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||P.intersectsObject(E))){const mt=Z.update(E),St=E.material;if($&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ut.copy(E.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),Ut.copy(mt.boundingSphere.center)),Ut.applyMatrix4(E.matrixWorld).applyMatrix4(ct)),Array.isArray(St)){const Et=mt.groups;for(let Ot=0,$t=Et.length;Ot<$t;Ot++){const Tt=Et[Ot],ne=St[Tt.materialIndex];ne&&ne.visible&&p.push(E,mt,ne,W,Ut.z,Tt)}}else St.visible&&p.push(E,mt,St,W,Ut.z,null)}}const at=E.children;for(let mt=0,St=at.length;mt<St;mt++)Xc(at[mt],O,W,$)}function Au(E,O,W,$){const B=E.opaque,at=E.transmissive,mt=E.transparent;m.setupLightsView(W),U===!0&&rt.setGlobalState(v.clippingPlanes,W),$&&zt.viewport(R.copy($)),B.length>0&&ra(B,O,W),at.length>0&&ra(at,O,W),mt.length>0&&ra(mt,O,W),zt.buffers.depth.setTest(!0),zt.buffers.depth.setMask(!0),zt.buffers.color.setMask(!0),zt.setPolygonOffset(!1)}function Cu(E,O,W,$){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[$.id]===void 0&&(m.state.transmissionRenderTarget[$.id]=new js(1,1,{generateMipmaps:!0,type:Ht.has("EXT_color_buffer_half_float")||Ht.has("EXT_color_buffer_float")?ta:zi,minFilter:Ns,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));const at=m.state.transmissionRenderTarget[$.id],mt=$.viewport||R;at.setSize(mt.z,mt.w);const St=v.getRenderTarget();v.setRenderTarget(at),v.getClearColor(V),K=v.getClearAlpha(),K<1&&v.setClearColor(16777215,.5),v.clear(),Bt&&Nt.render(W);const Et=v.toneMapping;v.toneMapping=as;const Ot=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),m.setupLightsView($),U===!0&&rt.setGlobalState(v.clippingPlanes,$),ra(E,W,$),k.updateMultisampleRenderTarget(at),k.updateRenderTargetMipmap(at),Ht.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let Tt=0,ne=O.length;Tt<ne;Tt++){const ye=O[Tt],_e=ye.object,vn=ye.geometry,ce=ye.material,Rt=ye.group;if(ce.side===be&&_e.layers.test($.layers)){const xi=ce.side;ce.side=gn,ce.needsUpdate=!0,Ru(_e,W,$,vn,ce,Rt),ce.side=xi,ce.needsUpdate=!0,$t=!0}}$t===!0&&(k.updateMultisampleRenderTarget(at),k.updateRenderTargetMipmap(at))}v.setRenderTarget(St),v.setClearColor(V,K),Ot!==void 0&&($.viewport=Ot),v.toneMapping=Et}function ra(E,O,W){const $=O.isScene===!0?O.overrideMaterial:null;for(let B=0,at=E.length;B<at;B++){const mt=E[B],St=mt.object,Et=mt.geometry,Ot=$===null?mt.material:$,$t=mt.group;St.layers.test(W.layers)&&Ru(St,O,W,Et,Ot,$t)}}function Ru(E,O,W,$,B,at){E.onBeforeRender(v,O,W,$,B,at),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),B.onBeforeRender(v,O,W,$,E,at),B.transparent===!0&&B.side===be&&B.forceSinglePass===!1?(B.side=gn,B.needsUpdate=!0,v.renderBufferDirect(W,O,$,B,E,at),B.side=ls,B.needsUpdate=!0,v.renderBufferDirect(W,O,$,B,E,at),B.side=be):v.renderBufferDirect(W,O,$,B,E,at),E.onAfterRender(v,O,W,$,B,at)}function aa(E,O,W){O.isScene!==!0&&(O=jt);const $=It.get(E),B=m.state.lights,at=m.state.shadowsArray,mt=B.state.version,St=Ct.getParameters(E,B.state,at,O,W),Et=Ct.getProgramCacheKey(St);let Ot=$.programs;$.environment=E.isMeshStandardMaterial?O.environment:null,$.fog=O.fog,$.envMap=(E.isMeshStandardMaterial?G:S).get(E.envMap||$.environment),$.envMapRotation=$.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Ot===void 0&&(E.addEventListener("dispose",Wt),Ot=new Map,$.programs=Ot);let $t=Ot.get(Et);if($t!==void 0){if($.currentProgram===$t&&$.lightsStateVersion===mt)return Pu(E,St),$t}else St.uniforms=Ct.getUniforms(E),E.onBeforeCompile(St,v),$t=Ct.acquireProgram(St,Et),Ot.set(Et,$t),$.uniforms=St.uniforms;const Tt=$.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Tt.clippingPlanes=rt.uniform),Pu(E,St),$.needsLights=Dg(E),$.lightsStateVersion=mt,$.needsLights&&(Tt.ambientLightColor.value=B.state.ambient,Tt.lightProbe.value=B.state.probe,Tt.directionalLights.value=B.state.directional,Tt.directionalLightShadows.value=B.state.directionalShadow,Tt.spotLights.value=B.state.spot,Tt.spotLightShadows.value=B.state.spotShadow,Tt.rectAreaLights.value=B.state.rectArea,Tt.ltc_1.value=B.state.rectAreaLTC1,Tt.ltc_2.value=B.state.rectAreaLTC2,Tt.pointLights.value=B.state.point,Tt.pointLightShadows.value=B.state.pointShadow,Tt.hemisphereLights.value=B.state.hemi,Tt.directionalShadowMap.value=B.state.directionalShadowMap,Tt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Tt.spotShadowMap.value=B.state.spotShadowMap,Tt.spotLightMatrix.value=B.state.spotLightMatrix,Tt.spotLightMap.value=B.state.spotLightMap,Tt.pointShadowMap.value=B.state.pointShadowMap,Tt.pointShadowMatrix.value=B.state.pointShadowMatrix),$.currentProgram=$t,$.uniformsList=null,$t}function ku(E){if(E.uniformsList===null){const O=E.currentProgram.getUniforms();E.uniformsList=lc.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function Pu(E,O){const W=It.get(E);W.outputColorSpace=O.outputColorSpace,W.batching=O.batching,W.batchingColor=O.batchingColor,W.instancing=O.instancing,W.instancingColor=O.instancingColor,W.instancingMorph=O.instancingMorph,W.skinning=O.skinning,W.morphTargets=O.morphTargets,W.morphNormals=O.morphNormals,W.morphColors=O.morphColors,W.morphTargetsCount=O.morphTargetsCount,W.numClippingPlanes=O.numClippingPlanes,W.numIntersection=O.numClipIntersection,W.vertexAlphas=O.vertexAlphas,W.vertexTangents=O.vertexTangents,W.toneMapping=O.toneMapping}function Pg(E,O,W,$,B){O.isScene!==!0&&(O=jt),k.resetTextureUnits();const at=O.fog,mt=$.isMeshStandardMaterial?O.environment:null,St=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:nr,Et=($.isMeshStandardMaterial?G:S).get($.envMap||mt),Ot=$.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,$t=!!W.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Tt=!!W.morphAttributes.position,ne=!!W.morphAttributes.normal,ye=!!W.morphAttributes.color;let _e=as;$.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(_e=v.toneMapping);const vn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ce=vn!==void 0?vn.length:0,Rt=It.get($),xi=m.state.lights;if(U===!0&&(J===!0||E!==M)){const In=E===M&&$.id===y;rt.setState($,E,In)}let le=!1;$.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==xi.state.version||Rt.outputColorSpace!==St||B.isBatchedMesh&&Rt.batching===!1||!B.isBatchedMesh&&Rt.batching===!0||B.isBatchedMesh&&Rt.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Rt.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Rt.instancing===!1||!B.isInstancedMesh&&Rt.instancing===!0||B.isSkinnedMesh&&Rt.skinning===!1||!B.isSkinnedMesh&&Rt.skinning===!0||B.isInstancedMesh&&Rt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Rt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Rt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Rt.instancingMorph===!1&&B.morphTexture!==null||Rt.envMap!==Et||$.fog===!0&&Rt.fog!==at||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==rt.numPlanes||Rt.numIntersection!==rt.numIntersection)||Rt.vertexAlphas!==Ot||Rt.vertexTangents!==$t||Rt.morphTargets!==Tt||Rt.morphNormals!==ne||Rt.morphColors!==ye||Rt.toneMapping!==_e||Rt.morphTargetsCount!==ce)&&(le=!0):(le=!0,Rt.__version=$.version);let qn=Rt.currentProgram;le===!0&&(qn=aa($,O,B));let to=!1,Sn=!1,cr=!1;const we=qn.getUniforms(),si=Rt.uniforms;if(zt.useProgram(qn.program)&&(to=!0,Sn=!0,cr=!0),$.id!==y&&(y=$.id,Sn=!0),to||M!==E){zt.buffers.depth.getReversed()?(X.copy(E.projectionMatrix),Sx(X),Ex(X),we.setValue(F,"projectionMatrix",X)):we.setValue(F,"projectionMatrix",E.projectionMatrix),we.setValue(F,"viewMatrix",E.matrixWorldInverse);const Oi=we.map.cameraPosition;Oi!==void 0&&Oi.setValue(F,vt.setFromMatrixPosition(E.matrixWorld)),Zt.logarithmicDepthBuffer&&we.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&we.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,Sn=!0,cr=!0)}if(B.isSkinnedMesh){we.setOptional(F,B,"bindMatrix"),we.setOptional(F,B,"bindMatrixInverse");const In=B.skeleton;In&&(In.boneTexture===null&&In.computeBoneTexture(),we.setValue(F,"boneTexture",In.boneTexture,k))}B.isBatchedMesh&&(we.setOptional(F,B,"batchingTexture"),we.setValue(F,"batchingTexture",B._matricesTexture,k),we.setOptional(F,B,"batchingIdTexture"),we.setValue(F,"batchingIdTexture",B._indirectTexture,k),we.setOptional(F,B,"batchingColorTexture"),B._colorsTexture!==null&&we.setValue(F,"batchingColorTexture",B._colorsTexture,k));const lr=W.morphAttributes;if((lr.position!==void 0||lr.normal!==void 0||lr.color!==void 0)&&Ft.update(B,W,qn),(Sn||Rt.receiveShadow!==B.receiveShadow)&&(Rt.receiveShadow=B.receiveShadow,we.setValue(F,"receiveShadow",B.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(si.envMap.value=Et,si.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&O.environment!==null&&(si.envMapIntensity.value=O.environmentIntensity),Sn&&(we.setValue(F,"toneMappingExposure",v.toneMappingExposure),Rt.needsLights&&Lg(si,cr),at&&$.fog===!0&&ft.refreshFogUniforms(si,at),ft.refreshMaterialUniforms(si,$,q,et,m.state.transmissionRenderTarget[E.id]),lc.upload(F,ku(Rt),si,k)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(lc.upload(F,ku(Rt),si,k),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&we.setValue(F,"center",B.center),we.setValue(F,"modelViewMatrix",B.modelViewMatrix),we.setValue(F,"normalMatrix",B.normalMatrix),we.setValue(F,"modelMatrix",B.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const In=$.uniformsGroups;for(let Oi=0,Bi=In.length;Oi<Bi;Oi++){const Lu=In[Oi];N.update(Lu,qn),N.bind(Lu,qn)}}return qn}function Lg(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function Dg(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,O,W){It.get(E.texture).__webglTexture=O,It.get(E.depthTexture).__webglTexture=W;const $=It.get(E);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=W===void 0,$.__autoAllocateDepthBuffer||Ht.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){const W=It.get(E);W.__webglFramebuffer=O,W.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,W=0){C=E,T=O,A=W;let $=!0,B=null,at=!1,mt=!1;if(E){const Et=It.get(E);if(Et.__useDefaultFramebuffer!==void 0)zt.bindFramebuffer(F.FRAMEBUFFER,null),$=!1;else if(Et.__webglFramebuffer===void 0)k.setupRenderTarget(E);else if(Et.__hasExternalTextures)k.rebindTextures(E,It.get(E.texture).__webglTexture,It.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Tt=E.depthTexture;if(Et.__boundDepthTexture!==Tt){if(Tt!==null&&It.has(Tt)&&(E.width!==Tt.image.width||E.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");k.setupDepthRenderbuffer(E)}}const Ot=E.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(mt=!0);const $t=It.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray($t[O])?B=$t[O][W]:B=$t[O],at=!0):E.samples>0&&k.useMultisampledRTT(E)===!1?B=It.get(E).__webglMultisampledFramebuffer:Array.isArray($t)?B=$t[W]:B=$t,R.copy(E.viewport),z.copy(E.scissor),D=E.scissorTest}else R.copy(At).multiplyScalar(q).floor(),z.copy(Vt).multiplyScalar(q).floor(),D=oe;if(zt.bindFramebuffer(F.FRAMEBUFFER,B)&&$&&zt.drawBuffers(E,B),zt.viewport(R),zt.scissor(z),zt.setScissorTest(D),at){const Et=It.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+O,Et.__webglTexture,W)}else if(mt){const Et=It.get(E.texture),Ot=O||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Et.__webglTexture,W||0,Ot)}y=-1},this.readRenderTargetPixels=function(E,O,W,$,B,at,mt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=It.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){zt.bindFramebuffer(F.FRAMEBUFFER,St);try{const Et=E.texture,Ot=Et.format,$t=Et.type;if(!Zt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Zt.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-$&&W>=0&&W<=E.height-B&&F.readPixels(O,W,$,B,qt.convert(Ot),qt.convert($t),at)}finally{const Et=C!==null?It.get(C).__webglFramebuffer:null;zt.bindFramebuffer(F.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(E,O,W,$,B,at,mt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=It.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){const Et=E.texture,Ot=Et.format,$t=Et.type;if(!Zt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Zt.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-$&&W>=0&&W<=E.height-B){zt.bindFramebuffer(F.FRAMEBUFFER,St);const Tt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Tt),F.bufferData(F.PIXEL_PACK_BUFFER,at.byteLength,F.STREAM_READ),F.readPixels(O,W,$,B,qt.convert(Ot),qt.convert($t),0);const ne=C!==null?It.get(C).__webglFramebuffer:null;zt.bindFramebuffer(F.FRAMEBUFFER,ne);const ye=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await wx(F,ye,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Tt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,at),F.deleteBuffer(Tt),F.deleteSync(ye),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,O=null,W=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);const $=Math.pow(2,-W),B=Math.floor(E.image.width*$),at=Math.floor(E.image.height*$),mt=O!==null?O.x:0,St=O!==null?O.y:0;k.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,W,0,0,mt,St,B,at),zt.unbindTexture()},this.copyTextureToTexture=function(E,O,W=null,$=null,B=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1],O=arguments[2],B=arguments[3]||0,W=null);let at,mt,St,Et,Ot,$t,Tt,ne,ye;const _e=E.isCompressedTexture?E.mipmaps[B]:E.image;W!==null?(at=W.max.x-W.min.x,mt=W.max.y-W.min.y,St=W.isBox3?W.max.z-W.min.z:1,Et=W.min.x,Ot=W.min.y,$t=W.isBox3?W.min.z:0):(at=_e.width,mt=_e.height,St=_e.depth||1,Et=0,Ot=0,$t=0),$!==null?(Tt=$.x,ne=$.y,ye=$.z):(Tt=0,ne=0,ye=0);const vn=qt.convert(O.format),ce=qt.convert(O.type);let Rt;O.isData3DTexture?(k.setTexture3D(O,0),Rt=F.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(k.setTexture2DArray(O,0),Rt=F.TEXTURE_2D_ARRAY):(k.setTexture2D(O,0),Rt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,O.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,O.unpackAlignment);const xi=F.getParameter(F.UNPACK_ROW_LENGTH),le=F.getParameter(F.UNPACK_IMAGE_HEIGHT),qn=F.getParameter(F.UNPACK_SKIP_PIXELS),to=F.getParameter(F.UNPACK_SKIP_ROWS),Sn=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,_e.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_e.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Et),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ot),F.pixelStorei(F.UNPACK_SKIP_IMAGES,$t);const cr=E.isDataArrayTexture||E.isData3DTexture,we=O.isDataArrayTexture||O.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const si=It.get(E),lr=It.get(O),In=It.get(si.__renderTarget),Oi=It.get(lr.__renderTarget);zt.bindFramebuffer(F.READ_FRAMEBUFFER,In.__webglFramebuffer),zt.bindFramebuffer(F.DRAW_FRAMEBUFFER,Oi.__webglFramebuffer);for(let Bi=0;Bi<St;Bi++)cr&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,It.get(E).__webglTexture,B,$t+Bi),E.isDepthTexture?(we&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,It.get(O).__webglTexture,B,ye+Bi),F.blitFramebuffer(Et,Ot,at,mt,Tt,ne,at,mt,F.DEPTH_BUFFER_BIT,F.NEAREST)):we?F.copyTexSubImage3D(Rt,B,Tt,ne,ye+Bi,Et,Ot,at,mt):F.copyTexSubImage2D(Rt,B,Tt,ne,ye+Bi,Et,Ot,at,mt);zt.bindFramebuffer(F.READ_FRAMEBUFFER,null),zt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else we?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(Rt,B,Tt,ne,ye,at,mt,St,vn,ce,_e.data):O.isCompressedArrayTexture?F.compressedTexSubImage3D(Rt,B,Tt,ne,ye,at,mt,St,vn,_e.data):F.texSubImage3D(Rt,B,Tt,ne,ye,at,mt,St,vn,ce,_e):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,B,Tt,ne,at,mt,vn,ce,_e.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,B,Tt,ne,_e.width,_e.height,vn,_e.data):F.texSubImage2D(F.TEXTURE_2D,B,Tt,ne,at,mt,vn,ce,_e);F.pixelStorei(F.UNPACK_ROW_LENGTH,xi),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,le),F.pixelStorei(F.UNPACK_SKIP_PIXELS,qn),F.pixelStorei(F.UNPACK_SKIP_ROWS,to),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Sn),B===0&&O.generateMipmaps&&F.generateMipmap(Rt),zt.unbindTexture()},this.copyTextureToTexture3D=function(E,O,W=null,$=null,B=0){return E.isTexture!==!0&&(kr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,$=arguments[1]||null,E=arguments[2],O=arguments[3],B=arguments[4]||0),kr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,O,W,$,B)},this.initRenderTarget=function(E){It.get(E).__webglFramebuffer===void 0&&k.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?k.setTextureCube(E,0):E.isData3DTexture?k.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?k.setTexture2DArray(E,0):k.setTexture2D(E,0),zt.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,zt.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}}class Uc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Dt(t),this.near=e,this.far=n}clone(){return new Uc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class z2 extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class U2{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=dh,this.updateRanges=[],this.version=0,this.uuid=Pi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,o=this.stride;s<o;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const un=new L;class Mc{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)un.fromBufferAttribute(this,e),un.applyMatrix4(t),this.setXYZ(e,un.x,un.y,un.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)un.fromBufferAttribute(this,e),un.applyNormalMatrix(t),this.setXYZ(e,un.x,un.y,un.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)un.fromBufferAttribute(this,e),un.transformDirection(t),this.setXYZ(e,un.x,un.y,un.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=ai(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=ai(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=ai(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=ai(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=ai(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),o=ge(o,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=o,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let o=0;o<this.itemSize;o++)e.push(this.data.array[s+o])}return new xn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Mc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let o=0;o<this.itemSize;o++)e.push(this.data.array[s+o])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class tu extends Fi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let go;const pr=new L,xo=new L,vo=new L,yo=new ut,mr=new ut,om=new Kt,Ra=new L,gr=new L,ka=new L,kf=new ut,wl=new ut,Pf=new ut;class rm extends Re{constructor(t=new tu){if(super(),this.isSprite=!0,this.type="Sprite",go===void 0){go=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new U2(e,5);go.setIndex([0,1,2,0,2,3]),go.setAttribute("position",new Mc(n,3,0,!1)),go.setAttribute("uv",new Mc(n,2,3,!1))}this.geometry=go,this.material=t,this.center=new ut(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),xo.setFromMatrixScale(this.matrixWorld),om.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),vo.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xo.multiplyScalar(-vo.z);const n=this.material.rotation;let s,o;n!==0&&(o=Math.cos(n),s=Math.sin(n));const r=this.center;Pa(Ra.set(-.5,-.5,0),vo,r,xo,s,o),Pa(gr.set(.5,-.5,0),vo,r,xo,s,o),Pa(ka.set(.5,.5,0),vo,r,xo,s,o),kf.set(0,0),wl.set(1,0),Pf.set(1,1);let a=t.ray.intersectTriangle(Ra,gr,ka,!1,pr);if(a===null&&(Pa(gr.set(-.5,.5,0),vo,r,xo,s,o),wl.set(0,1),a=t.ray.intersectTriangle(Ra,ka,gr,!1,pr),a===null))return;const c=t.ray.origin.distanceTo(pr);c<t.near||c>t.far||e.push({distance:c,point:pr.clone(),uv:Bn.getInterpolation(pr,Ra,gr,ka,kf,wl,Pf,new ut),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Pa(i,t,e,n,s,o){yo.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(mr.x=o*yo.x-s*yo.y,mr.y=s*yo.x+o*yo.y):mr.copy(yo),i.copy(t),i.x+=mr.x,i.y+=mr.y,i.applyMatrix4(om)}class N2 extends cn{constructor(t=null,e=1,n=1,s,o,r,a,c,l=Pn,d=Pn,h,u){super(null,r,a,c,l,d,s,o,h,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Lf extends xn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bo=new Kt,Df=new Kt,La=[],If=new hs,F2=new Kt,xr=new ot,vr=new Qs;class Gs extends ot{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Lf(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,F2)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new hs),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bo),If.copy(t.boundingBox).applyMatrix4(bo),this.boundingBox.union(If)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bo),vr.copy(t.boundingSphere).applyMatrix4(bo),this.boundingSphere.union(vr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,o=n.length+1,r=t*o+1;for(let a=0;a<n.length;a++)n[a]=s[r+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vr.copy(this.boundingSphere),vr.applyMatrix4(n),t.ray.intersectsSphere(vr)!==!1))for(let o=0;o<s;o++){this.getMatrixAt(o,bo),Df.multiplyMatrices(n,bo),xr.matrixWorld=Df,xr.raycast(t,La);for(let r=0,a=La.length;r<a;r++){const c=La[r];c.instanceId=o,c.object=this,e.push(c)}La.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Lf(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new N2(new Float32Array(s*this.count),s,this.count,Xh,li));const o=this.morphTexture.source.data.data;let r=0;for(let l=0;l<n.length;l++)r+=n[l];const a=this.geometry.morphTargetsRelative?1:1-r,c=s*t;o[c]=a,o.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class _c extends Fi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Dt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const wc=new L,Sc=new L,zf=new Kt,yr=new Zh,Da=new Qs,Sl=new L,Uf=new L;class fh extends Re{constructor(t=new Le,e=new _c){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)wc.fromBufferAttribute(e,s-1),Sc.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=wc.distanceTo(Sc);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Da.copy(n.boundingSphere),Da.applyMatrix4(s),Da.radius+=o,t.ray.intersectsSphere(Da)===!1)return;zf.copy(s).invert(),yr.copy(t.ray).applyMatrix4(zf);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,d=n.index,u=n.attributes.position;if(d!==null){const f=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let x=f,p=g-1;x<p;x+=l){const m=d.getX(x),_=d.getX(x+1),b=Ia(this,t,yr,c,m,_);b&&e.push(b)}if(this.isLineLoop){const x=d.getX(g-1),p=d.getX(f),m=Ia(this,t,yr,c,x,p);m&&e.push(m)}}else{const f=Math.max(0,r.start),g=Math.min(u.count,r.start+r.count);for(let x=f,p=g-1;x<p;x+=l){const m=Ia(this,t,yr,c,x,x+1);m&&e.push(m)}if(this.isLineLoop){const x=Ia(this,t,yr,c,g-1,f);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Ia(i,t,e,n,s,o){const r=i.geometry.attributes.position;if(wc.fromBufferAttribute(r,s),Sc.fromBufferAttribute(r,o),e.distanceSqToSegment(wc,Sc,Sl,Uf)>n)return;Sl.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Sl);if(!(c<t.near||c>t.far))return{distance:c,point:Uf.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Nf=new L,Ff=new L;class O2 extends fh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)Nf.fromBufferAttribute(e,s),Ff.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Nf.distanceTo(Ff);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class am extends Fi{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Of=new Kt,ph=new Zh,za=new Qs,Ua=new L;class B2 extends Re{constructor(t=new Le,e=new am){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),za.copy(n.boundingSphere),za.applyMatrix4(s),za.radius+=o,t.ray.intersectsSphere(za)===!1)return;Of.copy(s).invert(),ph.copy(t.ray).applyMatrix4(Of);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){const u=Math.max(0,r.start),f=Math.min(l.count,r.start+r.count);for(let g=u,x=f;g<x;g++){const p=l.getX(g);Ua.fromBufferAttribute(h,p),Bf(Ua,p,c,s,t,e,this)}}else{const u=Math.max(0,r.start),f=Math.min(h.count,r.start+r.count);for(let g=u,x=f;g<x;g++)Ua.fromBufferAttribute(h,g),Bf(Ua,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Bf(i,t,e,n,s,o,r){const a=ph.distanceSqToPoint(i);if(a<e){const c=new L;ph.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;o.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:r})}}class or extends cn{constructor(t,e,n,s,o,r,a,c,l){super(t,e,n,s,o,r,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class pi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const o=n.length;let r;e?r=e:r=t*n[o-1];let a=0,c=o-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-r,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===r)return s/(o-1);const d=n[s],u=n[s+1]-d,f=(r-d)/u;return(s+f)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const r=this.getPoint(s),a=this.getPoint(o),c=e||(r.isVector2?new ut:new L);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new L,s=[],o=[],r=[],a=new L,c=new Kt;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new L)}o[0]=new L,r[0]=new L;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),h=Math.abs(s[0].y),u=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],a),r[0].crossVectors(s[0],o[0]);for(let f=1;f<=t;f++){if(o[f]=o[f-1].clone(),r[f]=r[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(an(s[f-1].dot(s[f]),-1,1));o[f].applyMatrix4(c.makeRotationAxis(a,g))}r[f].crossVectors(s[f],o[f])}if(e===!0){let f=Math.acos(an(o[0].dot(o[t]),-1,1));f/=t,s[0].dot(a.crossVectors(o[0],o[t]))>0&&(f=-f);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),r[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class eu extends pi{constructor(t=0,e=0,n=1,s=1,o=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new ut){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const r=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(r?o=0:o=s),this.aClockwise===!0&&!r&&(o===s?o=-s:o=o-s);const a=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const d=Math.cos(this.aRotation),h=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*d-f*h+this.aX,l=u*h+f*d+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class H2 extends eu{constructor(t,e,n,s,o,r){super(t,e,n,n,s,o,r),this.isArcCurve=!0,this.type="ArcCurve"}}function nu(){let i=0,t=0,e=0,n=0;function s(o,r,a,c){i=o,t=a,e=-3*o+3*r-2*a-c,n=2*o-2*r+a+c}return{initCatmullRom:function(o,r,a,c,l){s(r,a,l*(a-o),l*(c-r))},initNonuniformCatmullRom:function(o,r,a,c,l,d,h){let u=(r-o)/l-(a-o)/(l+d)+(a-r)/d,f=(a-r)/d-(c-r)/(d+h)+(c-a)/h;u*=d,f*=d,s(r,a,u,f)},calc:function(o){const r=o*o,a=r*o;return i+t*o+e*r+n*a}}}const Na=new L,El=new nu,Tl=new nu,Al=new nu;class G2 extends pi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){const n=e,s=this.points,o=s.length,r=(o-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/o)+1)*o:c===0&&a===o-1&&(a=o-2,c=1);let l,d;this.closed||a>0?l=s[(a-1)%o]:(Na.subVectors(s[0],s[1]).add(s[0]),l=Na);const h=s[a%o],u=s[(a+1)%o];if(this.closed||a+2<o?d=s[(a+2)%o]:(Na.subVectors(s[o-1],s[o-2]).add(s[o-1]),d=Na),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),x=Math.pow(h.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(d),f);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),El.initNonuniformCatmullRom(l.x,h.x,u.x,d.x,g,x,p),Tl.initNonuniformCatmullRom(l.y,h.y,u.y,d.y,g,x,p),Al.initNonuniformCatmullRom(l.z,h.z,u.z,d.z,g,x,p)}else this.curveType==="catmullrom"&&(El.initCatmullRom(l.x,h.x,u.x,d.x,this.tension),Tl.initCatmullRom(l.y,h.y,u.y,d.y,this.tension),Al.initCatmullRom(l.z,h.z,u.z,d.z,this.tension));return n.set(El.calc(c),Tl.calc(c),Al.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Hf(i,t,e,n,s){const o=(n-t)*.5,r=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+o+r)*c+(-3*e+3*n-2*o-r)*a+o*i+e}function V2(i,t){const e=1-i;return e*e*t}function W2(i,t){return 2*(1-i)*i*t}function $2(i,t){return i*i*t}function Ir(i,t,e,n){return V2(i,t)+W2(i,e)+$2(i,n)}function X2(i,t){const e=1-i;return e*e*e*t}function q2(i,t){const e=1-i;return 3*e*e*i*t}function Y2(i,t){return 3*(1-i)*i*i*t}function j2(i,t){return i*i*i*t}function zr(i,t,e,n,s){return X2(i,t)+q2(i,e)+Y2(i,n)+j2(i,s)}class cm extends pi{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(zr(t,s.x,o.x,r.x,a.x),zr(t,s.y,o.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class K2 extends pi{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(zr(t,s.x,o.x,r.x,a.x),zr(t,s.y,o.y,r.y,a.y),zr(t,s.z,o.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class lm extends pi{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Z2 extends pi{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dm extends pi{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(Ir(t,s.x,o.x,r.x),Ir(t,s.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class J2 extends pi{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(Ir(t,s.x,o.x,r.x),Ir(t,s.y,o.y,r.y),Ir(t,s.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hm extends pi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,o=(s.length-1)*t,r=Math.floor(o),a=o-r,c=s[r===0?r:r-1],l=s[r],d=s[r>s.length-2?s.length-1:r+1],h=s[r>s.length-3?s.length-1:r+2];return n.set(Hf(a,c.x,l.x,d.x,h.x),Hf(a,c.y,l.y,d.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var Gf=Object.freeze({__proto__:null,ArcCurve:H2,CatmullRomCurve3:G2,CubicBezierCurve:cm,CubicBezierCurve3:K2,EllipseCurve:eu,LineCurve:lm,LineCurve3:Z2,QuadraticBezierCurve:dm,QuadraticBezierCurve3:J2,SplineCurve:hm});class Q2 extends pi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gf[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const r=s[o]-n,a=this.curves[o],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const r=o[s],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Gf[s.type]().fromJSON(s))}return this}}class Vf extends Q2{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new lm(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new dm(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,r){const a=new cm(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(o,r));return this.curves.push(a),this.currentPoint.set(o,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new hm(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,o,r),this}absarc(t,e,n,s,o,r){return this.absellipse(t,e,n,n,s,o,r),this}ellipse(t,e,n,s,o,r,a,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,n,s,o,r,a,c),this}absellipse(t,e,n,s,o,r,a,c){const l=new eu(t,e,n,s,o,r,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class us extends Le{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const o=[],r=[],a=[],c=[],l=new L,d=new ut;r.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let h=0,u=3;h<=e;h++,u+=3){const f=n+h/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),r.push(l.x,l.y,l.z),a.push(0,0,1),d.x=(r[u]/t+1)/2,d.y=(r[u+1]/t+1)/2,c.push(d.x,d.y)}for(let h=1;h<=e;h++)o.push(h,h+1,0);this.setIndex(o),this.setAttribute("position",new se(r,3)),this.setAttribute("normal",new se(a,3)),this.setAttribute("uv",new se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new us(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ae extends Le{constructor(t=1,e=1,n=1,s=32,o=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const d=[],h=[],u=[],f=[];let g=0;const x=[],p=n/2;let m=0;_(),r===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(d),this.setAttribute("position",new se(h,3)),this.setAttribute("normal",new se(u,3)),this.setAttribute("uv",new se(f,2));function _(){const v=new L,I=new L;let T=0;const A=(e-t)/n;for(let C=0;C<=o;C++){const y=[],M=C/o,R=M*(e-t)+t;for(let z=0;z<=s;z++){const D=z/s,V=D*c+a,K=Math.sin(V),j=Math.cos(V);I.x=R*K,I.y=-M*n+p,I.z=R*j,h.push(I.x,I.y,I.z),v.set(K,A,j).normalize(),u.push(v.x,v.y,v.z),f.push(D,1-M),y.push(g++)}x.push(y)}for(let C=0;C<s;C++)for(let y=0;y<o;y++){const M=x[y][C],R=x[y+1][C],z=x[y+1][C+1],D=x[y][C+1];(t>0||y!==0)&&(d.push(M,R,D),T+=3),(e>0||y!==o-1)&&(d.push(R,z,D),T+=3)}l.addGroup(m,T,0),m+=T}function b(v){const I=g,T=new ut,A=new L;let C=0;const y=v===!0?t:e,M=v===!0?1:-1;for(let z=1;z<=s;z++)h.push(0,p*M,0),u.push(0,M,0),f.push(.5,.5),g++;const R=g;for(let z=0;z<=s;z++){const V=z/s*c+a,K=Math.cos(V),j=Math.sin(V);A.x=y*j,A.y=p*M,A.z=y*K,h.push(A.x,A.y,A.z),u.push(0,M,0),T.x=K*.5+.5,T.y=j*.5*M+.5,f.push(T.x,T.y),g++}for(let z=0;z<s;z++){const D=I+z,V=R+z;v===!0?d.push(V,V+1,D):d.push(V+1,V,D),C+=3}l.addGroup(m,C,v===!0?1:2),m+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ae(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fi extends ae{constructor(t=1,e=1,n=32,s=1,o=!1,r=0,a=Math.PI*2){super(0,t,e,n,s,o,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:a}}static fromJSON(t){return new fi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ea extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),l(n),d(),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(o.slice(),3)),this.setAttribute("uv",new se(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const b=new L,v=new L,I=new L;for(let T=0;T<e.length;T+=3)f(e[T+0],b),f(e[T+1],v),f(e[T+2],I),c(b,v,I,_)}function c(_,b,v,I){const T=I+1,A=[];for(let C=0;C<=T;C++){A[C]=[];const y=_.clone().lerp(v,C/T),M=b.clone().lerp(v,C/T),R=T-C;for(let z=0;z<=R;z++)z===0&&C===T?A[C][z]=y:A[C][z]=y.clone().lerp(M,z/R)}for(let C=0;C<T;C++)for(let y=0;y<2*(T-C)-1;y++){const M=Math.floor(y/2);y%2===0?(u(A[C][M+1]),u(A[C+1][M]),u(A[C][M])):(u(A[C][M+1]),u(A[C+1][M+1]),u(A[C+1][M]))}}function l(_){const b=new L;for(let v=0;v<o.length;v+=3)b.x=o[v+0],b.y=o[v+1],b.z=o[v+2],b.normalize().multiplyScalar(_),o[v+0]=b.x,o[v+1]=b.y,o[v+2]=b.z}function d(){const _=new L;for(let b=0;b<o.length;b+=3){_.x=o[b+0],_.y=o[b+1],_.z=o[b+2];const v=p(_)/2/Math.PI+.5,I=m(_)/Math.PI+.5;r.push(v,1-I)}g(),h()}function h(){for(let _=0;_<r.length;_+=6){const b=r[_+0],v=r[_+2],I=r[_+4],T=Math.max(b,v,I),A=Math.min(b,v,I);T>.9&&A<.1&&(b<.2&&(r[_+0]+=1),v<.2&&(r[_+2]+=1),I<.2&&(r[_+4]+=1))}}function u(_){o.push(_.x,_.y,_.z)}function f(_,b){const v=_*3;b.x=t[v+0],b.y=t[v+1],b.z=t[v+2]}function g(){const _=new L,b=new L,v=new L,I=new L,T=new ut,A=new ut,C=new ut;for(let y=0,M=0;y<o.length;y+=9,M+=6){_.set(o[y+0],o[y+1],o[y+2]),b.set(o[y+3],o[y+4],o[y+5]),v.set(o[y+6],o[y+7],o[y+8]),T.set(r[M+0],r[M+1]),A.set(r[M+2],r[M+3]),C.set(r[M+4],r[M+5]),I.copy(_).add(b).add(v).divideScalar(3);const R=p(I);x(T,M+0,_,R),x(A,M+2,b,R),x(C,M+4,v,R)}}function x(_,b,v,I){I<0&&_.x===1&&(r[b]=_.x-1),v.x===0&&v.z===0&&(r[b]=I/2/Math.PI+.5)}function p(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ea(t.vertices,t.indices,t.radius,t.details)}}class Jo extends ea{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,o=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(o,r,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Jo(t.radius,t.detail)}}class um extends Vf{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Vf().fromJSON(s))}return this}}const tM={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=fm(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,c,l,d,h,u,f;if(n&&(o=oM(i,t,o,e)),i.length>80*e){a=l=i[0],c=d=i[1];for(let g=e;g<s;g+=e)h=i[g],u=i[g+1],h<a&&(a=h),u<c&&(c=u),h>l&&(l=h),u>d&&(d=u);f=Math.max(l-a,d-c),f=f!==0?32767/f:0}return Xr(o,r,e,a,c,f,0),r}};function fm(i,t,e,n,s){let o,r;if(s===gM(i,t,e,n)>0)for(o=t;o<e;o+=n)r=Wf(o,i[o],i[o+1],r);else for(o=e-n;o>=t;o-=n)r=Wf(o,i[o],i[o+1],r);return r&&Nc(r,r.next)&&(Yr(r),r=r.next),r}function Ks(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Nc(e,e.next)||Pe(e.prev,e,e.next)===0)){if(Yr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Xr(i,t,e,n,s,o,r){if(!i)return;!r&&o&&dM(i,n,s,o);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,o?nM(i,n,s,o):eM(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Yr(i),i=l.next,a=l.next;continue}if(i=l,i===a){r?r===1?(i=iM(Ks(i),t,e),Xr(i,t,e,n,s,o,2)):r===2&&sM(i,t,e,n,s,o):Xr(Ks(i),t,e,n,s,o,1);break}}}function eM(i){const t=i.prev,e=i,n=i.next;if(Pe(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,c=e.y,l=n.y,d=s<o?s<r?s:r:o<r?o:r,h=a<c?a<l?a:l:c<l?c:l,u=s>o?s>r?s:r:o>r?o:r,f=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=d&&g.x<=u&&g.y>=h&&g.y<=f&&Do(s,a,o,c,r,l,g.x,g.y)&&Pe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function nM(i,t,e,n){const s=i.prev,o=i,r=i.next;if(Pe(s,o,r)>=0)return!1;const a=s.x,c=o.x,l=r.x,d=s.y,h=o.y,u=r.y,f=a<c?a<l?a:l:c<l?c:l,g=d<h?d<u?d:u:h<u?h:u,x=a>c?a>l?a:l:c>l?c:l,p=d>h?d>u?d:u:h>u?h:u,m=mh(f,g,t,e,n),_=mh(x,p,t,e,n);let b=i.prevZ,v=i.nextZ;for(;b&&b.z>=m&&v&&v.z<=_;){if(b.x>=f&&b.x<=x&&b.y>=g&&b.y<=p&&b!==s&&b!==r&&Do(a,d,c,h,l,u,b.x,b.y)&&Pe(b.prev,b,b.next)>=0||(b=b.prevZ,v.x>=f&&v.x<=x&&v.y>=g&&v.y<=p&&v!==s&&v!==r&&Do(a,d,c,h,l,u,v.x,v.y)&&Pe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;b&&b.z>=m;){if(b.x>=f&&b.x<=x&&b.y>=g&&b.y<=p&&b!==s&&b!==r&&Do(a,d,c,h,l,u,b.x,b.y)&&Pe(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;v&&v.z<=_;){if(v.x>=f&&v.x<=x&&v.y>=g&&v.y<=p&&v!==s&&v!==r&&Do(a,d,c,h,l,u,v.x,v.y)&&Pe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function iM(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!Nc(s,o)&&pm(s,n,n.next,o)&&qr(s,o)&&qr(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),Yr(n),Yr(n.next),n=i=o),n=n.next}while(n!==i);return Ks(n)}function sM(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&fM(r,a)){let c=mm(r,a);r=Ks(r,r.next),c=Ks(c,c.next),Xr(r,t,e,n,s,o,0),Xr(c,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function oM(i,t,e,n){const s=[];let o,r,a,c,l;for(o=0,r=t.length;o<r;o++)a=t[o]*n,c=o<r-1?t[o+1]*n:i.length,l=fm(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(uM(l));for(s.sort(rM),o=0;o<s.length;o++)e=aM(s[o],e);return e}function rM(i,t){return i.x-t.x}function aM(i,t){const e=cM(i,t);if(!e)return t;const n=mm(e,i);return Ks(n,n.next),Ks(e,e.next)}function cM(i,t){let e=t,n=-1/0,s;const o=i.x,r=i.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=o&&u>n&&(n=u,s=e.x<e.next.x?e:e.next,u===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,c=s.x,l=s.y;let d=1/0,h;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&Do(r<l?o:n,r,c,l,r<l?n:o,r,e.x,e.y)&&(h=Math.abs(r-e.y)/(o-e.x),qr(e,i)&&(h<d||h===d&&(e.x>s.x||e.x===s.x&&lM(s,e)))&&(s=e,d=h)),e=e.next;while(e!==a);return s}function lM(i,t){return Pe(i.prev,i,t.prev)<0&&Pe(t.next,i,i.next)<0}function dM(i,t,e,n){let s=i;do s.z===0&&(s.z=mh(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,hM(s)}function hM(i){let t,e,n,s,o,r,a,c,l=1;do{for(e=i,i=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,l*=2}while(r>1);return i}function mh(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function uM(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Do(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function fM(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!pM(i,t)&&(qr(i,t)&&qr(t,i)&&mM(i,t)&&(Pe(i.prev,i,t.prev)||Pe(i,t.prev,t))||Nc(i,t)&&Pe(i.prev,i,i.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Nc(i,t){return i.x===t.x&&i.y===t.y}function pm(i,t,e,n){const s=Oa(Pe(i,t,e)),o=Oa(Pe(i,t,n)),r=Oa(Pe(e,n,i)),a=Oa(Pe(e,n,t));return!!(s!==o&&r!==a||s===0&&Fa(i,e,t)||o===0&&Fa(i,n,t)||r===0&&Fa(e,i,n)||a===0&&Fa(e,t,n))}function Fa(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Oa(i){return i>0?1:i<0?-1:0}function pM(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&pm(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function qr(i,t){return Pe(i.prev,i,i.next)<0?Pe(i,t,i.next)>=0&&Pe(i,i.prev,t)>=0:Pe(i,t,i.prev)<0||Pe(i,i.next,t)<0}function mM(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function mm(i,t){const e=new gh(i.i,i.x,i.y),n=new gh(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Wf(i,t,e,n){const s=new gh(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Yr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function gh(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function gM(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class Ur{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return Ur.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];$f(t),Xf(n,t);let r=t.length;e.forEach($f);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,Xf(n,e[c]);const a=tM.triangulate(n,s);for(let c=0;c<a.length;c+=3)o.push(a.slice(c,c+3));return o}}function $f(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Xf(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class rr extends ea{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new rr(t.radius,t.detail)}}class Ln extends ea{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ln(t.radius,t.detail)}}class mi extends Le{constructor(t=.5,e=1,n=32,s=1,o=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:o,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],d=[];let h=t;const u=(e-t)/s,f=new L,g=new ut;for(let x=0;x<=s;x++){for(let p=0;p<=n;p++){const m=o+p/n*r;f.x=h*Math.cos(m),f.y=h*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,d.push(g.x,g.y)}h+=u}for(let x=0;x<s;x++){const p=x*(n+1);for(let m=0;m<n;m++){const _=m+p,b=_,v=_+n+1,I=_+n+2,T=_+1;a.push(b,v,T),a.push(v,I,T)}}this.setIndex(a),this.setAttribute("position",new se(c,3)),this.setAttribute("normal",new se(l,3)),this.setAttribute("uv",new se(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class iu extends Le{constructor(t=new um([new ut(0,.5),new ut(-.5,-.5),new ut(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],o=[],r=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(a,c,d),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new se(s,3)),this.setAttribute("normal",new se(o,3)),this.setAttribute("uv",new se(r,2));function l(d){const h=s.length/3,u=d.extractPoints(e);let f=u.shape;const g=u.holes;Ur.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=g.length;p<m;p++){const _=g[p];Ur.isClockWise(_)===!0&&(g[p]=_.reverse())}const x=Ur.triangulateShape(f,g);for(let p=0,m=g.length;p<m;p++){const _=g[p];f=f.concat(_)}for(let p=0,m=f.length;p<m;p++){const _=f[p];s.push(_.x,_.y,0),o.push(0,0,1),r.push(_.x,_.y)}for(let p=0,m=x.length;p<m;p++){const _=x[p],b=_[0]+h,v=_[1]+h,I=_[2]+h;n.push(b,v,I),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return xM(e,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const r=e[t.shapes[s]];n.push(r)}return new iu(n,t.curveSegments)}}function xM(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Dn extends Le{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(r+a,Math.PI);let l=0;const d=[],h=new L,u=new L,f=[],g=[],x=[],p=[];for(let m=0;m<=n;m++){const _=[],b=m/n;let v=0;m===0&&r===0?v=.5/e:m===n&&c===Math.PI&&(v=-.5/e);for(let I=0;I<=e;I++){const T=I/e;h.x=-t*Math.cos(s+T*o)*Math.sin(r+b*a),h.y=t*Math.cos(r+b*a),h.z=t*Math.sin(s+T*o)*Math.sin(r+b*a),g.push(h.x,h.y,h.z),u.copy(h).normalize(),x.push(u.x,u.y,u.z),p.push(T+v,1-b),_.push(l++)}d.push(_)}for(let m=0;m<n;m++)for(let _=0;_<e;_++){const b=d[m][_+1],v=d[m][_],I=d[m+1][_],T=d[m+1][_+1];(m!==0||r>0)&&f.push(b,v,T),(m!==n-1||c<Math.PI)&&f.push(v,I,T)}this.setIndex(f),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(x,3)),this.setAttribute("uv",new se(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class su extends Le{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const r=[],a=[],c=[],l=[],d=new L,h=new L,u=new L;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const x=g/s*o,p=f/n*Math.PI*2;h.x=(t+e*Math.cos(p))*Math.cos(x),h.y=(t+e*Math.cos(p))*Math.sin(x),h.z=e*Math.sin(p),a.push(h.x,h.y,h.z),d.x=t*Math.cos(x),d.y=t*Math.sin(x),u.subVectors(h,d).normalize(),c.push(u.x,u.y,u.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const x=(s+1)*f+g-1,p=(s+1)*(f-1)+g-1,m=(s+1)*(f-1)+g,_=(s+1)*f+g;r.push(x,p,_),r.push(p,m,_)}this.setIndex(r),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new su(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ri extends Fi{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Kh,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class $e extends Fi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Kh,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Fc extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Dt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class gm extends Fc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Dt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Cl=new Kt,qf=new L,Yf=new L;class xm{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new Kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jh,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;qf.setFromMatrixPosition(t.matrixWorld),e.position.copy(qf),Yf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Yf),e.updateMatrixWorld(),Cl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const jf=new Kt,br=new L,Rl=new L;class vM extends xm{constructor(){super(new kn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new xe(2,1,1,1),new xe(0,1,1,1),new xe(3,1,1,1),new xe(1,1,1,1),new xe(3,0,1,1),new xe(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,o=t.distance||n.far;o!==n.far&&(n.far=o,n.updateProjectionMatrix()),br.setFromMatrixPosition(t.matrixWorld),n.position.copy(br),Rl.copy(n.position),Rl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Rl),n.updateMatrixWorld(),s.makeTranslation(-br.x,-br.y,-br.z),jf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jf)}}class ar extends Fc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new vM}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class yM extends xm{constructor(){super(new Q0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class bM extends Fc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new yM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class MM{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Kf(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Kf();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Kf(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hh);const st={half:100,core:{x:0,z:0},buildRadius:14,playerStart:{x:0,z:10},playerStartYaw:Math.PI,zones:[{id:"base",kind:"base",x:0,z:0,r:16,danger:1,label:"기지"},{id:"forest",kind:"forest",x:-48,z:-38,r:24,danger:2,label:"검은 숲"},{id:"quarry",kind:"quarry",x:50,z:-34,r:20,danger:2,label:"채석장"},{id:"field",kind:"field",x:-46,z:40,r:22,danger:2,label:"버려진 밭"},{id:"ruins",kind:"ruins",x:46,z:44,r:24,danger:3,label:"무너진 시가지"},{id:"mine",kind:"mine",x:78,z:-76,r:16,danger:4,label:"폐광"},{id:"wasteland",kind:"wasteland",x:-78,z:78,r:18,danger:4,label:"잿빛 황무지"},{id:"boss",kind:"boss",x:0,z:-84,r:14,danger:5,label:"격리 구역"}],lanes:[{id:"N",waypoints:[{x:0,z:-92},{x:8,z:-60},{x:-4,z:-34},{x:0,z:-16}]},{id:"E",waypoints:[{x:92,z:6},{x:62,z:-6},{x:34,z:4},{x:16,z:0}]},{id:"S",waypoints:[{x:-6,z:92},{x:6,z:64},{x:-2,z:36},{x:0,z:16}]},{id:"W",waypoints:[{x:-92,z:-4},{x:-60,z:8},{x:-34,z:-2},{x:-16,z:0}]}],resourceNodes:[{kind:"tree",x:-34,z:-38,zone:"forest"},{kind:"tree",x:-50,z:-34,zone:"forest"},{kind:"tree",x:-40,z:-48,zone:"forest"},{kind:"tree",x:-62,z:-40,zone:"forest"},{kind:"tree",x:-59,z:-36,zone:"forest"},{kind:"tree",x:-45,z:-21,zone:"forest"},{kind:"tree",x:-40,z:-28,zone:"forest"},{kind:"tree",x:-64,z:-48,zone:"forest"},{kind:"tree",x:-54,z:-21,zone:"forest"},{kind:"tree",x:-39,z:-37,zone:"forest"},{kind:"tree",x:-35,z:-29,zone:"forest"},{kind:"tree",x:-37,z:-41,zone:"forest"},{kind:"tree",x:-46,z:-40,zone:"forest"},{kind:"tree",x:-52,z:-56,zone:"forest"},{kind:"rock",x:59,z:-37,zone:"quarry"},{kind:"rock",x:58,z:-21,zone:"quarry"},{kind:"rock",x:64,z:-39,zone:"quarry"},{kind:"rock",x:65,z:-34,zone:"quarry"},{kind:"rock",x:42,z:-30,zone:"quarry"},{kind:"rock",x:48,z:-36,zone:"quarry"},{kind:"rock",x:41,z:-21,zone:"quarry"},{kind:"rock",x:45,z:-45,zone:"quarry"},{kind:"rock",x:57,z:-43,zone:"quarry"},{kind:"rock",x:36,z:-27,zone:"quarry"},{kind:"rock",x:42,z:-34,zone:"quarry"},{kind:"rock",x:54,z:-33,zone:"quarry"},{kind:"herb",x:-43,z:35,zone:"field"},{kind:"herb",x:-54,z:51,zone:"field"},{kind:"herb",x:-37,z:47,zone:"field"},{kind:"herb",x:-40,z:53,zone:"field"},{kind:"herb",x:-63,z:34,zone:"field"},{kind:"herb",x:-31,z:51,zone:"field"},{kind:"herb",x:-30,z:39,zone:"field"},{kind:"herb",x:-56,z:35,zone:"field"},{kind:"herb",x:-36,z:28,zone:"field"},{kind:"herb",x:-56,z:40,zone:"field"},{kind:"wreck",x:36,z:42,zone:"ruins"},{kind:"wreck",x:61,z:40,zone:"ruins"},{kind:"wreck",x:57,z:61,zone:"ruins"},{kind:"wreck",x:42,z:34,zone:"ruins"},{kind:"wreck",x:52,z:33,zone:"ruins"},{kind:"wreck",x:61,z:55,zone:"ruins"},{kind:"wreck",x:49,z:44,zone:"ruins"},{kind:"wreck",x:61,z:47,zone:"ruins"},{kind:"wreck",x:41,z:62,zone:"ruins"},{kind:"iron",x:74,z:-66,zone:"mine"},{kind:"iron",x:88,z:-77,zone:"mine"},{kind:"iron",x:78,z:-82,zone:"mine"},{kind:"iron",x:73,z:-84,zone:"mine"},{kind:"iron",x:67,z:-76,zone:"mine"},{kind:"iron",x:71,z:-74,zone:"mine"},{kind:"iron",x:86,z:-69,zone:"mine"},{kind:"iron",x:82,z:-85,zone:"mine"},{kind:"wreck",x:-85,z:75,zone:"wasteland"},{kind:"wreck",x:-77,z:69,zone:"wasteland"},{kind:"wreck",x:-69,z:85,zone:"wasteland"},{kind:"wreck",x:-83,z:82,zone:"wasteland"}],chests:[{tier:0,x:-60,z:-39,zone:"forest"},{tier:0,x:59,z:-39,zone:"quarry"},{tier:0,x:-40,z:49,zone:"field"},{tier:1,x:41,z:55,zone:"ruins"},{tier:2,x:85,z:-80,zone:"mine"},{tier:2,x:-81,z:70,zone:"wasteland"},{tier:2,x:-6,z:-87,zone:"boss"}],props:[{kind:"wall",x:36,z:34,r:2.4},{kind:"wall",x:54,z:38,r:2.6},{kind:"wall",x:44,z:58,r:2.2},{kind:"car",x:30,z:50,r:1.8},{kind:"car",x:58,z:52,r:1.8},{kind:"bus",x:48,z:30,r:2.6},{kind:"barrel",x:-40,z:32,r:.7},{kind:"barrel",x:-54,z:46,r:.7},{kind:"container",x:-70,z:66,r:3},{kind:"car",x:-84,z:86,r:1.8},{kind:"boulder",x:56,z:-26,r:2.2},{kind:"boulder",x:42,z:-42,r:1.8},{kind:"boulder",x:80,z:-66,r:2.6},{kind:"sandbag",x:13,z:-13,r:1.4},{kind:"sandbag",x:-13,z:-13,r:1.4},{kind:"sandbag",x:13,z:13,r:1.4},{kind:"sandbag",x:-13,z:13,r:1.4},{kind:"container",x:-14,z:-78,r:3},{kind:"container",x:14,z:-78,r:3}]},na=50,ln=["wood","stone","iron","herb","parts"],dn={wood:"나무",stone:"돌",iron:"철",herb:"약초",parts:"부품"},Oc={wood:2,stone:3,iron:8,herb:4,parts:10},Zf=["tree","rock","iron","herb","wreck"],jr={tree:{name:"나무",verb:"나무 베기",res:"wood",work:2.2,yieldMin:3,yieldMax:5,respawnMin:80,respawnMax:120,radius:.7,depletedBlock:.4},rock:{name:"바위",verb:"바위 깨기",res:"stone",work:2.8,yieldMin:2,yieldMax:4,respawnMin:90,respawnMax:140,radius:1.1,depletedBlock:.35},iron:{name:"철광석",verb:"철광석 캐기",res:"iron",work:4,yieldMin:1,yieldMax:2,respawnMin:150,respawnMax:180,radius:1,depletedBlock:.35},herb:{name:"약초 덤불",verb:"약초 뜯기",res:"herb",work:1,yieldMin:2,yieldMax:3,respawnMin:60,respawnMax:90,radius:.55,depletedBlock:0},wreck:{name:"폐차",verb:"부품 뜯기",res:"parts",work:3.2,yieldMin:1,yieldMax:2,respawnMin:150,respawnMax:180,radius:1.5,depletedBlock:.8}},_M={forest:{tree:3.2,herb:.4},quarry:{rock:1.6,iron:.7},mine:{iron:1.4,rock:1},field:{herb:1.2,tree:.3},ruins:{wreck:.9,rock:.3,herb:.2},wasteland:{wreck:.25,rock:.3}},wM={tree:6,rock:3,iron:1.2,herb:12,wreck:4},vm={seed:20240607,baseMargin:2,laneHalfWidth:4,gap:1.4,edgeMargin:4,startClear:6,zoneBias:.35,tries:30},Jf=95,Qf=2.2,SM=.6,EM=.9,tp={normal:{chance:.3,min:1,max:1,special:!1},runner:{chance:.25,min:1,max:1,special:!1},fatty:{chance:.6,min:1,max:2,special:!1},boss:{chance:1,min:2,max:3,special:!0},king:{chance:1,min:5,max:5,special:!0}},dc=["pistol","shotgun","smg"],Vn={pistol:{name:"권총",dmg:14,rate:.34,mag:12,reload:1.5,pellets:1,spread:.004,range:80,recoil:.035,bloom:.6,falloff:.2,tracer:16770720},shotgun:{name:"샷건",dmg:9,rate:.85,mag:6,reload:2.3,pellets:7,spread:.075,range:28,recoil:.11,bloom:.15,falloff:.6,tracer:16756832},smg:{name:"기관총",dmg:7,rate:.085,mag:35,reload:2,pellets:1,spread:.035,range:60,recoil:.018,bloom:.12,falloff:.35,tracer:11067647}},Ni=["pistol","magnum","smg","shotgun","rifle","sniper"],he={pistol:{...Vn.pistol,kind:"pistol",auto:!0,pierce:1,adsFov:55,scope:!1,sway:1,snd:{pitch:170,len:.16,noise:.6,thump:.5},desc:"가볍고 안정적인 기본 권총"},shotgun:{...Vn.shotgun,kind:"shotgun",auto:!1,pierce:1,adsFov:55,scope:!1,sway:.7,snd:{pitch:95,len:.3,noise:.85,thump:1},desc:"근거리에서 압도적인 산탄"},smg:{...Vn.smg,kind:"smg",auto:!0,pierce:1,adsFov:55,scope:!1,sway:1.2,snd:{pitch:220,len:.11,noise:.7,thump:.35},desc:"빠른 연사, 탄이 퍼진다"},magnum:{name:"매그넘",dmg:42,rate:.55,mag:6,reload:2.2,pellets:1,spread:.006,range:95,recoil:.1,bloom:.9,falloff:.15,tracer:16765040,kind:"revolver",auto:!1,pierce:2,adsFov:55,scope:!1,sway:.8,snd:{pitch:120,len:.26,noise:.65,thump:.9},desc:"한 방이 묵직하고 관통한다"},rifle:{name:"돌격소총",dmg:12,rate:.105,mag:30,reload:2.3,pellets:1,spread:.014,range:110,recoil:.024,bloom:.1,falloff:.25,tracer:16769690,kind:"rifle",auto:!0,pierce:1,adsFov:55,scope:!1,sway:.8,snd:{pitch:150,len:.14,noise:.7,thump:.6},desc:"정확한 연사, 만능 주력 무기"},sniper:{name:"저격총",dmg:130,rate:1.25,mag:5,reload:2.9,pellets:1,spread:4e-4,range:220,recoil:.17,bloom:.5,falloff:0,tracer:12577023,kind:"sniper",auto:!1,pierce:3,adsFov:20,scope:!0,sway:.45,snd:{pitch:75,len:.42,noise:.55,thump:1},desc:"조준경으로 멀리서 관통 저격"}},ri={maxLv:5,perLevel:{dmg:.12,rate:.05,mag:.1,reload:.06,spread:.06,pelletEvery:2},gold:[60,120,220,380,600],parts:[1,2,3,5,8]},Cn={speed:6.5,aimSpeedMul:.7,dashSpeed:17,dashTime:.18,dashIframes:.3,hurtIframes:.15,radius:.4,bulletDrop:7e-5,sens:.0025,respawnDelay:3,headshotMul:2,aimAssist:.15},Nr=["tower","mgtower","barricade","trap","lab","barracks","shop"],Qt={lab:{name:"연구소",cost:{wood:10,stone:10,parts:3},radius:1.8,hp:300,height:3.2,desc:"E: 백신 제작"},barracks:{name:"숙소",cost:{wood:12,stone:4},radius:1.8,hp:300,height:2.6,desc:"아군 상한 +3"},barricade:{name:"바리케이드",cost:{wood:4},radius:1,hp:200,height:1.5,desc:"좀비가 먼저 부순다"},tower:{name:"감시탑",cost:{wood:10,stone:8},radius:1,hp:300,height:5,desc:"자동 사격, 업그레이드",turret:{ammo:40,refill:{wood:2,stone:1},levels:[{dmg:9,rate:.7,range:15,upCost:{},upGold:0},{dmg:14,rate:.6,range:17,upCost:{wood:10,stone:10,iron:2},upGold:0},{dmg:22,rate:.5,range:19,upCost:{stone:14,iron:6,parts:2},upGold:30}]}},shop:{name:"상점",cost:{wood:15,stone:10,iron:5},radius:1.8,hp:300,height:3,desc:"E: 자원 판매, 열쇠 구매"},mgtower:{name:"기관포탑",cost:{wood:10,stone:10,iron:8,parts:4},radius:1,hp:350,height:2.4,desc:"빠른 연사, 탄약 소모 큼",turret:{ammo:240,refill:{iron:2,parts:1},levels:[{dmg:4,rate:.11,range:13,upCost:{},upGold:0},{dmg:6,rate:.09,range:14.5,upCost:{iron:8,parts:3},upGold:0},{dmg:9,rate:.08,range:16,upCost:{iron:14,parts:6},upGold:40}]}},trap:{name:"슬로우 트랩",cost:{wood:6,iron:2},radius:1,hp:120,height:.4,desc:"범위 안 좀비 감속 + 지속 피해",trap:{radius:3.2,slow:.45,dps:7}}},Fr=2,ym=.5,TM=3,Rn={radius:2.2,height:4,hp:[500,800,1200,1800],blockR:3.4},Mr={pct:.2,cost:{wood:8,stone:6}},AM=[{cost:{stone:20,iron:6},gold:50},{cost:{stone:40,iron:14,parts:5},gold:150},{cost:{stone:80,iron:30,parts:12},gold:400}],CM=.6,xh={iron:80,gold:260},vh=[{id:"hp",branch:"생존",name:"튼튼한 몸",desc:"최대 체력 +20",max:5},{id:"dash",branch:"생존",name:"날쌘 발",desc:"대시 쿨타임 -0.3초",max:4},{id:"dmg",branch:"생존",name:"화력 강화",desc:"공격력 +10%",max:5},{id:"reload",branch:"생존",name:"빠른 손",desc:"재장전 시간 -13%",max:4},{id:"gspeed",branch:"채집",name:"채집 속도",desc:"채집 속도 +25% (아군 포함)",max:4},{id:"gextra",branch:"채집",name:"풍작",desc:"추가 획득 확률 +12%",max:5},{id:"mag",branch:"채집",name:"대용량 탄창",desc:"탄창 +20%",max:3},{id:"vrate",branch:"연구",name:"백신 개량",desc:"아군화 성공률 +8%",max:5},{id:"vcost",branch:"연구",name:"재료 절약",desc:"백신 재료 -10%",max:3},{id:"stun",branch:"연구",name:"기절 사격",desc:"기절 확률 +10%",max:4},{id:"cap",branch:"사령",name:"사령관",desc:"아군 상한 +2",max:5},{id:"adm",branch:"사령",name:"아군 강화",desc:"아군 공격력 +20%",max:5},{id:"ahp",branch:"사령",name:"아군 맷집",desc:"아군 체력 +25%",max:4}];function ou(i){const t=e=>i[e]||0;return{maxHp:100+20*t("hp"),dmgMul:1+.1*t("dmg"),dashCd:2-.3*t("dash"),reloadMul:1-.13*t("reload"),magMul:1+.2*t("mag"),gatherSpeed:1+.25*t("gspeed"),gatherExtra:.12*t("gextra"),vacBonus:.08*t("vrate"),vacCostMul:1-.1*t("vcost"),stunBonus:.1*t("stun"),allyCap:2+2*t("cap"),allyDmg:1+.2*t("adm"),allyHp:1+.25*t("ahp"),recoilMul:1}}const Mn=[{name:"초급 백신",herb:3,sample:2,sampleSp:0,parts:0,iron:0,rate:.4},{name:"중급 백신",herb:5,sample:3,sampleSp:0,parts:1,iron:0,rate:.6},{name:"고급 백신",herb:8,sample:0,sampleSp:2,parts:0,iron:2,rate:.8}],Fs=["fighter","guard","gatherer","researcher"],ze={fighter:{name:"전투병",desc:"플레이어를 따라다니며 함께 싸운다 (최대 3)",color:15026239,max:3},guard:{name:"경비병",desc:"핵 주변을 순찰하며 다가오는 좀비를 막는다",color:4164581,max:99},gatherer:{name:"채집병",desc:"자원을 캐서 기지로 가져온다",color:15050047,max:99},researcher:{name:"연구 보조",desc:"연구소 백신 제작 속도 증가",color:10841061,max:99}},Ke={hp:60,speed:5,dmg:9,atkRate:.8,atkRange:1.7,radius:.45,height:1.9,regenDelay:5,regen:2,aggro:12,leash:16},is={time:1.5,range:2.2,lowHpBonus:.2,bossPenalty:.3,minRate:.05,maxRate:.95},ep={time:3,perResearcher:.35},kl={time:3,carryRange:2.5},Kr=["나무 상자","철 상자","황금 상자"],Ec=["일반","고급","희귀","전설"],ru=[[70,25,5,0],[45,40,13,2],[10,45,35,10]],Or=10,Tc=[13620184,6736998,6728447,16763955],np=[null,"keys","goldKeys"],bm=2.4,RM=6,Br={burst:1.15,total:3.8},kM=[120,240,420],PM={1:{wood:1,iron:0},2:{wood:2,iron:0},3:{wood:2,iron:1},4:{wood:1,iron:2},5:{wood:1,iron:2}},ip={areaPer:4e3,max:40},_r={interval:360,ttl:150,minDanger:4},Pl={woodChance:.04,keyChance:.02,ttl:90},hc={ironEvery:5,ringMinK:.5,ringMaxK:.85},LM=14,DM=1,sp=["작업모","파티 고깔","요리사 모자","해적 두건","황금 왕관"],op=150,rp=60,IM=[[{kind:"res",w:30,res:"wood",min:6,max:12},{kind:"res",w:22,res:"stone",min:4,max:8},{kind:"res",w:16,res:"herb",min:3,max:6},{kind:"gold",w:24,min:15,max:30},{kind:"sample",w:8,min:1,max:1}],[{kind:"res",w:18,res:"iron",min:3,max:6},{kind:"res",w:14,res:"parts",min:2,max:3},{kind:"res",w:12,res:"herb",min:6,max:10},{kind:"gold",w:22,min:40,max:80},{kind:"sample",w:14,min:2,max:3},{kind:"key",w:10,n:1},{kind:"vaccine",w:10,tier:0,n:1},{kind:"weapon",w:4,id:"magnum"}],[{kind:"vaccine",w:20,tier:1,n:1},{kind:"res",w:14,res:"parts",min:4,max:6},{kind:"res",w:12,res:"iron",min:8,max:12},{kind:"sampleSp",w:12,min:1,max:1},{kind:"gold",w:16,min:100,max:180},{kind:"key",w:8,n:2},{kind:"skillPoint",w:8,n:1},{kind:"weapon",w:5,id:"shotgun"},{kind:"weapon",w:6,id:"magnum"},{kind:"weapon",w:4,id:"smg"},{kind:"weapon",w:3,id:"rifle"},{kind:"costume",w:4}],[{kind:"weapon",w:12,id:"smg"},{kind:"weapon",w:8,id:"shotgun"},{kind:"weapon",w:8,id:"magnum"},{kind:"weapon",w:14,id:"rifle"},{kind:"weapon",w:14,id:"sniper"},{kind:"vaccine",w:16,tier:2,n:1},{kind:"skillPoint",w:14,n:2},{kind:"goldKey",w:10,n:1},{kind:"gold",w:12,min:400,max:600},{kind:"sampleSp",w:8,min:3,max:3},{kind:"costume",w:6}]];function Mm(i,t){const e=40*Math.pow(1.08,Math.max(0,i-1)),n=10+i*.6,s=2.1+Math.min(1,i*.02);switch(t){case"runner":return{hp:e*.55,speed:4.4,dmg:n*.8,scale:.95};case"fatty":return{hp:e*2.6,speed:1.35,dmg:n*1.4,scale:1.5};case"crawler":return{hp:e*.45,speed:s*1.25,dmg:n*.7,scale:.9};case"swarmer":return{hp:e*.22,speed:5.3,dmg:n*.45,scale:.6};case"leaper":return{hp:e*.8,speed:3,dmg:n*1.1,scale:1.05};case"spitter":return{hp:e*.6,speed:2,dmg:n*.9,scale:1};case"bomber":return{hp:e*.7,speed:3.4,dmg:n*3.2,scale:1.15};case"screamer":return{hp:e*.75,speed:2.2,dmg:n*.5,scale:1.05};case"tank":return{hp:e*3.4,speed:1.5,dmg:n*1.5,scale:1.45};case"boss":return{hp:e*14,speed:2.4,dmg:n*2.2,scale:2.2};case"bossBomb":return{hp:e*12,speed:2.6,dmg:n*2,scale:2.3};case"bossAcid":return{hp:e*13,speed:2,dmg:n*1.9,scale:2.4};case"bossLord":return{hp:e*16,speed:2.4,dmg:n*2.4,scale:2.6};case"king":return{hp:14e3,speed:2.8,dmg:55,scale:3.2};default:return{hp:e,speed:s,dmg:n,scale:1}}}const au=40,_m=i=>Math.min(160,Math.round(8*Math.pow(1.12,Math.max(0,i-1)))),zM=5,Ee={provokedSpeed:1.3,prep:30,stunHpRatio:.3,stunBase:.35,stunTime:8,rageSpeed:1.3,fallbackRestart:4,aggroPlayer:16,aggroAlly:11,aggroStructure:7,reach:.9,windup:.45,waveClearGold:10,gasRadius:3.2,gasTime:4,gasDps:7,roamAggro:14,roamPerDanger:2,laneSpread:3},ei={normal:{name:"좀비",atkCd:1.1,radius:.45,height:1.9,reach:0},runner:{name:"달리기 좀비",atkCd:.8,radius:.4,height:1.8,reach:0},fatty:{name:"뚱보 좀비",atkCd:1.6,radius:.75,height:2.2,reach:.3,hit:{r:.85,h:2.8,headFrac:.82}},crawler:{name:"기어다니는 좀비",atkCd:.9,radius:.4,height:.85,reach:0,hit:{r:.45,h:.9,headFrac:.6},prone:{fwd:.83,r:.86,h:.85,head:{f:1.45,y:.58,r:.32},stun:{fwd:.48,r:.6,h:1.15,head:{f:.79,y:.89,r:.32}}}},swarmer:{name:"떼거리 좀비",atkCd:.7,radius:.28,height:1.15,reach:0},leaper:{name:"도약 좀비",atkCd:1,radius:.45,height:1.9,reach:0,hit:{r:.47,h:2.1},leap:{range:12,cd:4.5,windup:.55,time:.6,radius:1.8,dmgMul:1.3}},spitter:{name:"산성 좀비",atkCd:1,radius:.45,height:1.9,reach:0,keep:[6,15],spit:{cd:2.6,windup:.5,time:.8,radius:1.7,dmgMul:1,pool:3,dps:6}},bomber:{name:"폭탄 좀비",atkCd:1,radius:.55,height:2,reach:0,hit:{r:.58,h:2.35},bomb:{range:2.8,fuse:.8,radius:5,dmgMul:1,deathRadius:3.5,deathMul:.6}},screamer:{name:"비명 좀비",atkCd:1.5,radius:.45,height:1.95,reach:0,hit:{r:.47,h:2.05},keep:[8,12],scream:{cd:9,windup:.9,radius:28,buff:1.4,time:6,summon:"normal",count:2}},tank:{name:"장갑 좀비",atkCd:1.7,radius:.8,height:2.4,reach:.4,hit:{r:.88,h:2.9,headFrac:.82},armor:.5},boss:{name:"브루저",atkCd:1.3,radius:1,height:3.4,reach:.8,hit:{r:1.25,h:4.2,headFrac:.8}},bossBomb:{name:"폭파광",atkCd:1.3,radius:1.05,height:3.5,reach:.8,hit:{r:1.25,h:4.45,headFrac:.8}},bossAcid:{name:"산성 괴수",atkCd:1.4,radius:1.1,height:3.6,reach:.8,hit:{r:1.3,h:4.8,headFrac:.8}},bossLord:{name:"군단장",atkCd:1.2,radius:1.15,height:3.9,reach:.9,hit:{r:1.35,h:5.8,headFrac:.8},armor:.25},king:{name:"좀비 왕",atkCd:1.1,radius:1.5,height:5,reach:1.2,hit:{r:2,h:7,headFrac:.8}}},yh=["boss","bossBomb","bossAcid","bossLord"],UM=i=>i==="king"||yh.includes(i),ap=i=>i===na?"king":yh[(Math.floor(i/5)-1)%yh.length],wm=i=>i>0&&i%5===0,Un={slam:{windup:1.1,dmgMul:1.6},charge:{windup:.8,time:.7,speed:16,dmgMul:1.3},volley:{windup:.9,count:5,spread:.9,time:.9,radius:1.8,dmgMul:.9,pool:3,dps:6},bombRain:{windup:1.3,count:4,radius:4,dmgMul:1.4,scatter:7},summon:{windup:1.2},scream:{windup:1,radius:40,buff:1.4,time:8}},Ll={boss:{moves:[{kind:"slam",w:3},{kind:"charge",w:3}],slamRadius:5.5,cd:[5,3.2],summonCd:[99,99]},bossBomb:{moves:[{kind:"bombRain",w:3},{kind:"charge",w:2},{kind:"summon",w:2}],summon:[{type:"bomber",count:3}],slamRadius:6,cd:[4.5,3],summonCd:[16,11]},bossAcid:{moves:[{kind:"volley",w:4},{kind:"slam",w:2},{kind:"summon",w:1}],summon:[{type:"spitter",count:2},{type:"crawler",count:4}],slamRadius:6.5,cd:[4.5,3],summonCd:[18,12]},bossLord:{moves:[{kind:"scream",w:2},{kind:"summon",w:2},{kind:"charge",w:3},{kind:"slam",w:2}],summon:[{type:"runner",count:4},{type:"tank",count:1},{type:"leaper",count:2}],slamRadius:7,cd:[4,2.6],summonCd:[14,10]},king:{moves:[{kind:"slam",w:3},{kind:"charge",w:2},{kind:"summon",w:2},{kind:"bombRain",w:2},{kind:"scream",w:1}],summon:[{type:"normal",count:5},{type:"tank",count:1}],slamRadius:8,cd:[4,2.6],summonCd:[20,14]}},Is={fromWave:20,chanceBase:.08,chancePerWave:.01,chanceMax:.35,hp:2.5,dmg:1.4,scale:1.15,reward:3},NM=i=>i<Is.fromWave?0:Math.min(Is.chanceMax,Is.chanceBase+(i-Is.fromWave)*Is.chancePerWave),FM={normal:{gold:2,xp:5},runner:{gold:2,xp:7},fatty:{gold:5,xp:14},crawler:{gold:2,xp:5},swarmer:{gold:1,xp:2},leaper:{gold:4,xp:12},spitter:{gold:6,xp:16},bomber:{gold:5,xp:14},screamer:{gold:8,xp:20},tank:{gold:12,xp:28},boss:{gold:80,xp:150},bossBomb:{gold:100,xp:200},bossAcid:{gold:120,xp:250},bossLord:{gold:160,xp:350},king:{gold:500,xp:1e3}},OM=(i,t=0)=>Ee.prep+t,Sm=[{type:"crawler",from:4,base:.1,ramp:.01,max:.18,pack:1},{type:"runner",from:5,base:.08,ramp:.02,max:.25,pack:1},{type:"swarmer",from:7,base:.05,ramp:.01,max:.12,pack:6},{type:"fatty",from:7,base:.05,ramp:.01,max:.15,pack:1},{type:"leaper",from:10,base:.06,ramp:.015,max:.2,pack:1},{type:"spitter",from:12,base:.05,ramp:.012,max:.16,pack:1},{type:"tank",from:10,base:.04,ramp:.008,max:.12,pack:1},{type:"bomber",from:18,base:.05,ramp:.01,max:.14,pack:1},{type:"screamer",from:22,base:.03,ramp:.006,max:.08,pack:1}];function Dl(i){const t=Sm.filter(r=>i>=r.from).map(r=>({type:r.type,weight:Math.min(r.max,r.base+(i-r.from)*r.ramp),pack:r.pack})),e=t.reduce((r,a)=>r+a.weight,0),n=i<4?0:Math.min(.45,.05+(i-4)*.025),s=e>0?n/e:0,o=t.map(r=>({...r,weight:r.weight*s}));return o.unshift({type:"normal",weight:1-o.reduce((r,a)=>r+a.weight,0),pack:1}),o}const Ba=(i,t)=>{const e=Math.sin(i*127.1+t*311.7)*43758.5453;return e-Math.floor(e)};function Il(i,t){const e=Math.floor(i),n=Math.floor(t),s=i-e,o=t-n,r=s*s*(3-2*s),a=o*o*(3-2*o),c=Ba(e,n),l=Ba(e+1,n),d=Ba(e,n+1),h=Ba(e+1,n+1);return c+(l-c)*r+(d-c)*a+(c-l-d+h)*r*a}const Vs=(i,t)=>Il(i,t)*.5+Il(i*2.1,t*2.1)*.3+Il(i*4.3,t*4.3)*.2;function bh(i,t){const e=Hr(24,40,Math.hypot(i-st.core.x,t-st.core.z));if(e<=0)return 0;const n=Hr(4,14,Qo(i,t));return((Vs(i*.018+3.1,t*.018-7.4)-.5)*4.6+(Vs(i*.06,t*.06)-.5)*1)*e*n}function hn(i,t){const e=bh(i,t),n=Math.max(Math.abs(i),Math.abs(t))-st.half;if(n<=0)return e;const s=Math.min(1,n/30);return e+s*s*(10+Vs(i*.04,t*.04)*22)+Vs(i*.15,t*.15)*2*s}const BM={base:1843750,forest:2372382,quarry:3815990,mine:1710102,field:3879458,ruins:2368042,wasteland:2762016,boss:3021340},HM={base:1.05,field:1.08,forest:.95,quarry:1,boss:.92,mine:1,ruins:1,wasteland:1},GM=1843750,VM=2762016;function WM(i,t){const e=Vs(i*.08,t*.08);let n=Mo(GM),s=1;for(const u of st.zones){const f=Math.hypot(i-u.x,t-u.z),g=1-Hr(u.r-5,u.r+5,f+(e-.5)*6);g>0&&(n=Ha(n,Mo(BM[u.kind]),g),s+=(HM[u.kind]-s)*g)}const o=Qo(i,t);n=Ha(n,Mo(5917238),1-Hr(1.8,6,o+(e-.5)*3));const r=hn(i,t),a=r-bh(i,t);a>0&&(n=Ha(n,Mo(VM),Math.min(1,a/12)));const c=bh(i,t);n=Ha(n,c>0?Mo(3879458):Mo(1316890),Math.min(.25,Math.abs(c)*.15));const l=Hr(.55,.75,Vs(i*.025+17,t*.025-9))*.16,d=(Vs(i*.9,t*.9)-.5)*.08,h=(.82+e*.36)*2.2*s*(1-l+d);return[n[0]*h,n[1]*h,n[2]*h]}function Qo(i,t){let e=1e9;for(const n of st.lanes)for(let s=0;s<n.waypoints.length-1;s++){const o=n.waypoints[s],r=n.waypoints[s+1],a=r.x-o.x,c=r.z-o.z,l=Math.max(0,Math.min(1,((i-o.x)*a+(t-o.z)*c)/(a*a+c*c)));e=Math.min(e,Math.hypot(i-o.x-a*l,t-o.z-c*l))}return e}const Mo=i=>[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255],Ha=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e],Hr=(i,t,e)=>{const n=Math.max(0,Math.min(1,(e-i)/(t-i)));return n*n*(3-2*n)};function Mh(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),o={},r={},a=i[0].morphTargetsRelative,c=new Le;let l=0;for(let d=0;d<i.length;++d){const h=i[d];let u=0;if(e!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.morphAttributes[f])}if(t){let f;if(e)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,d),l+=f}}if(e){let d=0;const h=[];for(let u=0;u<i.length;++u){const f=i[u].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+d);d+=i[u].attributes.position.count}c.setIndex(h)}for(const d in o){const h=cp(o[d]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;c.setAttribute(d,h)}for(const d in r){const h=r[d][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[d]=[];for(let u=0;u<h;++u){const f=[];for(let x=0;x<r[d].length;++x)f.push(r[d][x][u]);const g=cp(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;c.morphAttributes[d].push(g)}}return c}function cp(i){let t,e,n,s=-1,o=0;for(let l=0;l<i.length;++l){const d=i[l];if(t===void 0&&(t=d.array.constructor),t!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=d.itemSize),e!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=d.normalized),n!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=d.count*e}const r=new t(o),a=new xn(r,e,n);let c=0;for(let l=0;l<i.length;++l){const d=i[l];if(d.isInterleavedBufferAttribute){const h=c/e;for(let u=0,f=d.count;u<f;u++)for(let g=0;g<e;g++){const x=d.getComponent(u,g);a.setComponent(u+h,g,x)}}else r.set(d.array,c);c+=d.count*e}return s!==void 0&&(a.gpuType=s),a}const qi=i=>new $e({color:i}),qe={rust:qi(6962726),steel:qi(4016722),concrete:qi(7105126),dark:qi(2369066),sand:qi(9075288),rock:qi(5920594),teal:qi(2846570),orange:qi(12081694)},$M=new us(1,24);let XM;const qM=()=>XM??(XM=(()=>{const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(0,0,0,0.55)"),e.addColorStop(.6,"rgba(0,0,0,0.25)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new kt({map:new or(i),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})})()),YM=new kt({color:16747050}),fn=(i,t,e,n,s=0,o=t/2,r=0)=>{const a=new ot(new Lt(i,t,e),n);return a.position.set(s,o,r),a};function Em(i,t,e){const n=new _t;switch(i){case"wall":{for(let o=0;o<4;o++)n.add(fn(t*.55,1.5+e*(o+3)%1*3,.5,qe.concrete,(o-1.5)*t*.5));n.add(fn(t*.4,.3,.9,qe.dark,t*.6,.15,.8));break}case"car":{n.add(fn(t*2.2,.8,t*1.1,qe.rust,0,.6),fn(t*1.2,.6,t,qe.dark,-t*.15,1.3));for(const o of[-.7,.7])for(const r of[-.5,.5])n.add(fn(.5,.5,.25,qe.dark,o*t,.25,r*t*1.1));n.rotation.z=.05;break}case"bus":n.add(fn(t*3.2,2.4,t*1.1,qe.orange,0,1.4),fn(t*3.1,.6,t*1.12,qe.dark,0,2.2)),n.rotation.z=-.12;break;case"barrel":{const o=new ot(new ae(t*.7,t*.7,1.2,10),e>.5?qe.rust:qe.teal);o.position.y=.6,n.add(o);break}case"container":n.add(fn(t*2,2.6,t*.9,e>.5?qe.teal:qe.rust,0,1.3));for(let o=-3;o<=3;o++)n.add(fn(.08,2.4,t*.92,qe.dark,o*t*.28,1.3));n.add(fn(t*1.9,.08,.04,YM,0,2.45,t*.46));break;case"boulder":{const o=new ot(new Jo(t,0),qe.rock);o.position.y=t*.55,o.scale.y=.7,n.add(o);break}case"sandbag":for(let o=0;o<3;o++)n.add(fn(t*1.6,.4,.7,qe.sand,0,.2+o*.4,o%2*.1));break;case"lamp":{const o=fn(.18,.18,6,qe.steel,0,.12,0);o.rotation.y=0,n.add(o),n.add(fn(.5,.25,.8,qe.dark,0,.2,3.1),fn(.6,.4,.6,qe.concrete,0,.2,-3));break}default:n.add(fn(t*2,1,t*2,qe.concrete))}const s=i!=="lamp";return n.traverse(o=>{o instanceof ot&&(o.castShadow=s,o.receiveShadow=s)}),n}const Tm={bus:{L:1.6,W:.55},car:{L:1.1,W:.55}},jM=new Set(["barrel","boulder","sandbag"]),_h=(i,t)=>jM.has(i)?.9+t*7.31%1*.2:1,KM=i=>Math.abs(Math.sin(i*91.7));function ZM(i,t){const e=[{x:i.x,z:i.z,r:i.r*_h(i.kind,t)}],n=Tm[i.kind];if(n){const s=t*Math.PI*2,o=Math.cos(s),r=-Math.sin(s),a=(n.L-n.W)*i.r;for(const c of[-1,1])e.push({x:i.x+o*a*c,z:i.z+r*a*c,r:n.W*i.r})}return e}function JM(i,t){st.props.forEach((e,n)=>{const s=KM(n),o=Em(e.kind,e.r,s);if(o.position.set(e.x,hn(e.x,e.z)-.05,e.z),o.rotation.y=s*Math.PI*2,o.scale.setScalar(_h(e.kind,s)),i.add(o),t.push(...ZM(e,s)),e.kind==="lamp")return;const r=new ot($M,qM()),a=!!Tm[e.kind],c=e.r*_h(e.kind,s)*1.35;r.rotation.set(-Math.PI/2,0,o.rotation.y),r.scale.set(c*(a?.9:1),c*(a?.9:1),1),r.position.set(e.x,hn(e.x,e.z)+.04,e.z),r.renderOrder=1,i.add(r)})}function QM(i){let t=11;const e=()=>(t=t*16807%2147483647)/2147483647;new Ri({color:3824224,metalness:0,roughness:.2,transparent:!0,opacity:.3,depthWrite:!1});for(const n of st.lanes)for(let s=0;s<n.waypoints.length-1;s++){const o=n.waypoints[s],r=n.waypoints[s+1],a=Math.hypot(r.x-o.x,r.z-o.z),c=-(r.z-o.z)/a,l=(r.x-o.x)/a;for(let d=.25;d<1;d+=.5){const h=e()<.5?-1:1,u=o.x+(r.x-o.x)*d+c*h*6,f=o.z+(r.z-o.z)*d+l*h*6;if(Math.hypot(u,f)<18)continue;const g=f>0&&f<40&&Math.abs(u)<10?Math.sign(u||1)*10:u,x=Em("lamp",1,e());x.position.set(g,hn(g,f)-.05,f),x.rotation.y=e()*Math.PI*2,i.add(x),e(),e()}}}function t_(i){let t=29;const e=()=>(t=t*16807%2147483647)/2147483647,n=180,s=new Jo(.22,0),o=new Ri({color:16777215,roughness:.95,flatShading:!0}),r=new Gs(s,o,n);r.receiveShadow=!0;const a=new Kt,c=new $n,l=new _n,d=new L,h=new L,u=[3817542,4014921,3620163].map(g=>new Dt(g));let f=0;for(let g=0;g<n*6&&f<n;g++){const x=e()*Math.PI*2,p=22+e()*70,m=Math.cos(x)*p,_=Math.sin(x)*p;if(Qo(m,_)<5)continue;const b=.5+e()*1.6;d.set(m,hn(m,_)+.05*b,_),l.set(e()*3,e()*3,e()*3),c.setFromEuler(l),h.set(b,b*(.4+e()*.5),b*(.7+e()*.6)),r.setMatrixAt(f,a.compose(d,c,h)),r.setColorAt(f,u[e()*u.length|0]),f++}r.count=f,i.add(r)}const zl={north:(i,t)=>t<0&&Math.abs(i)<-t,east:(i,t)=>i>0&&Math.abs(t)<=i,west:(i,t)=>i<0&&Math.abs(t)<=-i};function Go(i,t,e,n,s,o,r,a,c,l,d,h,u,f){let g=s;const x=()=>(g=g*16807%2147483647)/2147483647,p=new Gs(t,u??new Ri({color:16777215,roughness:.95,flatShading:!0}),n);p.receiveShadow=!0;const m=new Kt,_=new $n,b=new _n,v=new L,I=new L,T=e.map(C=>new Dt(C));let A=0;for(let C=0;C<n*8&&A<n;C++){const y=x()*Math.PI*2,M=o+x()*(r-o),R=Math.cos(y)*M,z=Math.sin(y)*M;if(Qo(R,z)<a||Math.hypot(R,z)<22||h&&!h(R,z))continue;const D=c+x()*(l-c);if(v.set(R,hn(R,z)-.03,z),b.set(d?0:(x()-.5)*.5,x()*6.3,d?0:(x()-.5)*.5),_.setFromEuler(b),I.set(D,D*(.7+x()*.6),D),p.setMatrixAt(A,m.compose(v,_,I)),p.setColorAt(A,T[x()*T.length|0]),A++,f){const V=Math.cos(b.y),K=Math.sin(b.y);for(const[j,et,q]of f.parts)f.obs.push({x:R+(j*V+et*K)*D,z:z+(-j*K+et*V)*D,r:q*D})}}p.count=A,i.add(p)}function e_(i,t=[]){const e=new fi(.35,.7,5,1,!0);e.translate(0,.35,0),Go(i,e,[5922620,7038016,5002806,8023624],150,41,20,95,4.5,.6,1.4,!1);const n=new Lt(1.2,.6,.7);n.translate(0,.3,0),Go(i,n,[6975088,6053986,7631468],36,53,24,90,6,.7,1.3,!1,void 0,void 0,{obs:t,parts:[[0,0,.6]]});const s=new ae(.28,.38,.5,7);s.translate(0,.25,0),Go(i,s,[4864556,4076330,5588015],30,67,26,95,6,.8,1.5,!0,void 0,void 0,{obs:t,parts:[[0,0,.38]]}),n_(i,t)}function n_(i,t){const e=[0,1,2].map(d=>{const h=new Lt(1.4,1.2+d*.9,.35);return h.translate((d-1)*1.35,(1.2+d*.9)/2,d*.08),h}),n=new Lt(.9,.5,.8);n.translate(1.6,.25,.9),n.rotateY(.4);const s=Mh([...e.map(d=>d.toNonIndexed()),n.toNonIndexed()]);Go(i,s,[7105126,6184282,7894384],40,83,26,92,6,.8,1.6,!0,zl.north,void 0,{obs:t,parts:[[-1.35,0,.7],[0,0,.7],[1.35,0,.7],[1.6,.9,.5]]});const o=new ae(.12,.26,4.2,6);o.translate(0,2.1,0);const r=[[.9,2.6,.8],[-1,3.1,-.6],[.4,3.6,2.2]].map(([d,h,u])=>{const f=new ae(.04,.09,1.5,5);return f.translate(0,.75,0),f.rotateZ(d),f.rotateY(u),f.translate(0,h,0),f.toNonIndexed()}),a=Mh([o.toNonIndexed(),...r]);Go(i,a,[4872762,4477494,5398591],45,97,26,95,6,.8,1.4,!1,zl.east,void 0,{obs:t,parts:[[0,0,.3]]});const c=new us(1.4,18);c.rotateX(-Math.PI/2),c.translate(0,.06,0);const l=new kt({color:3073750,transparent:!0,opacity:.22,depthWrite:!1,blending:ui,polygonOffset:!0,polygonOffsetFactor:-2});Go(i,c,[3073750,2406572,2071184],28,109,26,90,6,.7,1.8,!0,zl.west,l)}const Gr=[];let Qn,Vo;const wh=[];function i_(i){Gr.length=0,wh.length=0;const t=[];for(const h of[-Math.PI/2,0,Math.PI])for(let u=0;u<60&&t.length<Gr.length+3&&t.length<3;u++){const f=h+(u%7-3)*.12,g=30+u%9*4,x=Math.cos(f)*g,p=Math.sin(f)*g;if(Qo(x,p)>6&&Qo(x,p)<14&&Math.hypot(x,p)>24){t.push([x,p]);break}}const e=new ae(.09,.13,5.5,6);e.translate(0,2.75,0);const n=new Lt(1.2,.1,.1);n.translate(.55,5.45,0);const s=new Gs(Mh([e.toNonIndexed(),n.toNonIndexed()]),new Ri({color:4016722,roughness:.8}),3),o=new Lt(.4,.15,.25);o.translate(1.05,5.33,0),Qn=new Gs(o,new kt({color:16777215}),3);const r=new Kt;t.forEach(([h,u],f)=>{const g=hn(h,u)-.05,x=Math.atan2(-h,-u)+Math.PI/2;r.makeRotationY(x).setPosition(h,g,u),s.setMatrixAt(f,r),Qn.setMatrixAt(f,r),Qn.setColorAt(f,new Dt(14214352));const p=new ar(14214352,0,14,2);p.castShadow=!1,p.position.set(h+Math.cos(x)*1.05,g+5.1,u-Math.sin(x)*1.05),Gr.push({light:p,t:Math.random(),on:1})}),s.castShadow=s.receiveShadow=Qn.castShadow=Qn.receiveShadow=!1,s.count=Qn.count=t.length,i.add(s,Qn);const a=document.createElement("canvas");a.width=a.height=128;const c=a.getContext("2d"),l=c.createRadialGradient(64,64,0,64,64,64);l.addColorStop(0,"rgba(200,205,210,1)"),l.addColorStop(.5,"rgba(200,205,210,0.5)"),l.addColorStop(1,"rgba(200,205,210,0)"),c.fillStyle=l,c.fillRect(0,0,128,128);const d=new wn(1,1);d.rotateX(-Math.PI/2),Vo=new Gs(d,new kt({map:new or(a),transparent:!0,opacity:.15,depthWrite:!1}),5),Vo.renderOrder=2;for(let h=0;h<5;h++){const u=h*1.26+.3,f=30+h*9;wh.push({x:Math.cos(u)*f,z:Math.sin(u)*f,vx:Math.cos(u+1.6)*.5,vz:Math.sin(u+1.6)*.5,s:14+h*2,a:h})}Vo=void 0,Am(0)}function Am(i){for(const t of Gr){if(t.t-=i,t.t<=0){const e=Math.random();t.on=e<.25?0:e<.45?.35:1,t.t=t.on===1?.3+Math.random()*2.2:.04+Math.random()*.18}t.light.intensity=9*t.on}if(Qn){const t=new Dt;Gr.forEach((e,n)=>Qn.setColorAt(n,t.setRGB(.15+.7*e.on,.17+.72*e.on,.15+.66*e.on))),Qn.instanceColor&&(Qn.instanceColor.needsUpdate=!0)}if(Vo){const t=new Kt,e=new $n,n=new L,s=new L,o=new L(0,1,0);wh.forEach((r,a)=>{r.x+=r.vx*i,r.z+=r.vz*i,r.a+=i*.05;const c=Math.hypot(r.x,r.z);(c>95||c<24)&&(r.vx=-r.vx,r.vz=-r.vz),e.setFromAxisAngle(o,r.a),n.set(r.x,hn(r.x,r.z)+.6,r.z),s.set(r.s,1,r.s*.7),Vo.setMatrixAt(a,t.compose(n,e,s))}),Vo.instanceMatrix.needsUpdate=!0}}const Sh=[],Eh=[];let Ul=0;function s_(){const i=document.createElement("canvas");i.width=i.height=256;const t=i.getContext("2d");t.beginPath(),t.moveTo(128,18),t.lineTo(242,224),t.lineTo(14,224),t.closePath(),t.fillStyle="#0B1014",t.fill(),t.lineWidth=14,t.lineJoin="round",t.strokeStyle="#FF8A2A",t.stroke();const e=128,n=150;t.fillStyle="#FF8A2A",t.strokeStyle="#FF8A2A";for(let o=0;o<3;o++){const r=-Math.PI/2+o*(Math.PI*2/3),a=e+Math.cos(r)*20,c=n+Math.sin(r)*20;t.beginPath(),t.arc(a,c,24,0,Math.PI*2),t.lineWidth=9,t.stroke()}t.beginPath(),t.arc(e,n,30,0,Math.PI*2),t.lineWidth=6,t.stroke(),t.beginPath(),t.arc(e,n,8,0,Math.PI*2),t.fill();const s=new or(i);return s.colorSpace=mn,s}function o_(i){Sh.length=0,Eh.length=0;const t=s_(),e=new mi(2.6,2.85,48);for(const n of st.lanes){const s=n.waypoints[0],o=hn(s.x,s.z),r=new rm(new tu({map:t,transparent:!0,depthWrite:!1,fog:!0}));r.scale.set(1.6,1.6,1),r.position.set(s.x,o+2.5,s.z),r.userData.baseY=o+2.5,i.add(r),Sh.push(r);const a=new kt({color:16747050,transparent:!0,opacity:.55,depthWrite:!1,side:be,polygonOffset:!0,polygonOffsetFactor:-2}),c=new ot(e,a);c.rotation.x=-Math.PI/2,c.position.set(s.x,o+.05,s.z),c.renderOrder=1,i.add(c),Eh.push(a)}}function r_(i,t){Ul+=i;const e=Math.sin(Ul*Math.PI*2/1.6)*.15,n=t?.7+.3*Math.sin(Ul*Math.PI*2/1.2):1;for(const s of Sh)s.position.y=s.userData.baseY+e,s.material.opacity=n;for(const s of Eh)s.opacity=.55*n}const Io=st.half,Ue=[];function Cm(i){const t=new I2({canvas:i,antialias:!0});t.setPixelRatio(Math.min(devicePixelRatio,2)),t.shadowMap.enabled=!0;const e=new z2;e.background=new Dt(10466500),e.fog=new Uc(10466500,40,120);const n=new kn(70,1,.1,300);e.add(new gm(13624319,5918784,.9));const s=new bM(16773584,1.6);s.position.set(30,50,20),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),Object.assign(s.shadow.camera,{left:-40,right:40,top:40,bottom:-40,near:1,far:140}),e.add(s,s.target);const o=(Io+70)*2,r=220,a=new wn(o,o,r,r);a.rotateX(-Math.PI/2);const c=new Dt,l=a.attributes.position,d=new Float32Array(l.count*3);for(let f=0;f<l.count;f++){const g=l.getX(f),x=l.getZ(f);l.setY(f,hn(g,x));const[p,m,_]=WM(g,x);c.setRGB(p,m,_,mn),d.set([c.r,c.g,c.b],f*3)}a.setAttribute("color",new xn(d,3)),a.computeVertexNormals();const h=new ot(a,new $e({vertexColors:!0}));h.receiveShadow=!0,e.add(h),JM(e,Ue),QM(e),t_(e),e_(e,Ue),i_(e),o_(e);const u=()=>{t.setSize(innerWidth,innerHeight,!1),n.aspect=innerWidth/innerHeight,n.updateProjectionMatrix()};return addEventListener("resize",u),u(),{scene:e,camera:n,renderer:t,sun:s}}function cu(i,t){for(const e of Ue){const n=i.x-e.x,s=i.z-e.z,o=e.r+t,r=n*n+s*s;if(r<o*o&&r>1e-6){const a=Math.sqrt(r);i.x=e.x+n/a*o,i.z=e.z+s/a*o}}i.x=Math.max(-Io,Math.min(Io,i.x)),i.z=Math.max(-Io,Math.min(Io,i.z))}function Rm(i,t){const e=i.x-st.core.x,n=i.z-st.core.z,s=Rn.blockR+t,o=e*e+n*n;if(o>=s*s)return;const r=Math.sqrt(o);if(r<1e-6){i.z=st.core.z+s;return}i.x=st.core.x+e/r*s,i.z=st.core.z+n/r*s}function lu(i,t){cu(i,t),Rm(i,t)}const a_=Object.freeze(Object.defineProperty({__proto__:null,WORLD_HALF:Io,createWorld:Cm,getGroundY:hn,obstacles:Ue,resolveCoreDome:Rm,resolveObstacles:cu,resolvePlayerObstacles:lu},Symbol.toStringTag,{value:"Module"})),it={keys:new Set,mouseDown:!1,mouseRightDown:!1,dx:0,dy:0,locked:!1,fallback:!1,modalOpen:!1,pressed:new Set,lockNote:"",paused:!1};function c_(i){var t;try{const e=i.requestPointerLock();(t=e==null?void 0:e.catch)==null||t.call(e,()=>Th())}catch{Th()}}function Th(){it.fallback=!0,it.lockNote="마우스 잠금을 쓸 수 없어 방향키(또는 우클릭 드래그)로 시점을 돌립니다"}function l_(i){addEventListener("keydown",t=>{(t.code==="Tab"||t.code.startsWith("Arrow")||t.code==="Space")&&t.preventDefault(),t.repeat||it.pressed.add(t.code),it.keys.add(t.code),(t.code==="Escape"||t.code==="KeyP")&&!t.repeat&&!it.modalOpen&&(it.paused=!it.paused)}),addEventListener("keyup",t=>it.keys.delete(t.code)),addEventListener("blur",()=>{it.keys.clear(),it.mouseDown=!1,it.mouseRightDown=!1}),addEventListener("mousedown",t=>{t.button===0&&(it.mouseDown=!0),t.button===2&&(it.mouseRightDown=!0)}),addEventListener("mouseup",t=>{t.button===0&&(it.mouseDown=!1),t.button===2&&(it.mouseRightDown=!1)}),addEventListener("contextmenu",t=>t.preventDefault()),addEventListener("mousemove",t=>{(it.locked||it.mouseRightDown)&&(it.dx+=t.movementX,it.dy+=t.movementY)}),document.addEventListener("pointerlockchange",()=>{const t=it.locked;it.locked=document.pointerLockElement===i,it.locked&&(it.fallback=!1,it.lockNote=""),t&&!it.locked&&(performance.now(),it.modalOpen||(it.paused=!0))}),document.addEventListener("pointerlockerror",Th)}const d_=650*.75,lp=.15,h_=.6;let Nl=0,Fl=0;function u_(i){const t=it.keys,e=(t.has("ArrowRight")?1:0)-(t.has("ArrowLeft")?1:0),n=(t.has("ArrowDown")?1:0)-(t.has("ArrowUp")?1:0);Nl=e?Math.min(1,Nl+i/lp):0,Fl=n?Math.min(1,Fl+i/lp):0;const s=d_*i*(it.mouseRightDown?h_:1);it.dx+=e*s*Nl,it.dy+=n*s*.7*Fl}function f_(){it.dx=0,it.dy=0,it.pressed.clear()}const Ol=new Map,H={on(i,t){const e=Ol.get(i)??[];e.push(t),Ol.set(i,e)},emit(i,t){var e;(e=Ol.get(i))==null||e.forEach(n=>n(t))}},w={wave:0,phase:"prep",mode:"play",gold:0,keys:0,goldKeys:0,res:Object.fromEntries(ln.map(i=>[i,0])),samples:0,samplesSp:0,vaccines:[0,0,0],xp:0,skillPoints:0,skillLv:{},pity:0,weapons:["pistol"],weaponLv:{},weaponLvBonus:{},costumes:[],coreHp:500,coreMaxHp:500,allyCount:0,allyCapBonus:0,stats:ou({}),statMods:[],start:{gold:0,startWave:1,res:{},coreHp:0,prepBonus:0,samples:0,skillPoints:0,weapons:["pistol"],weaponLv:{},turretDmgMul:0},prepLeft:0,waveRemaining:0,checkpoint:0};function p_(){w.stats=ou(w.skillLv);for(const i of w.statMods)i(w.stats);ie()}function Ac(i,t=0){if(w.gold<t)return!1;for(const e of ln)if((i[e]??0)>w.res[e])return!1;for(const e of ln)w.res[e]-=i[e]??0;return w.gold-=t,ie(),!0}function km(i,t){w.res[i]+=t,ie()}function ie(){H.emit("state:changed",void 0)}const ki=[],Ne=[],bn=[];let m_=1;const Zr=()=>m_++;function du(i,t,e,n=1/0){let s,o=n*n;for(const r of i){if(r.dead)continue;const a=(r.x-t)**2+(r.z-e)**2;a<o&&(o=a,s=r)}return s}const hu={sensitivity:1,thirdPerson:!1,sfxVolume:.8,bgmVolume:.6,fov:75,reducedMotion:!1},Pm="3dgun.settings.v1",ii={...hu},Ga=(i,t,e,n)=>typeof i=="number"&&isFinite(i)?Math.min(e,Math.max(t,i)):n;function Lm(i,t){return{sensitivity:Ga(i.sensitivity,.2,3,t.sensitivity),thirdPerson:typeof i.thirdPerson=="boolean"?i.thirdPerson:t.thirdPerson,sfxVolume:Ga(i.sfxVolume,0,1,t.sfxVolume),bgmVolume:Ga(i.bgmVolume,0,1,t.bgmVolume),fov:Math.round(Ga(i.fov,60,100,t.fov)),reducedMotion:typeof i.reducedMotion=="boolean"?i.reducedMotion:t.reducedMotion}}function Dm(){H.emit("settings:change",{...ii}),H.emit("settings:volume",{bgm:ii.bgmVolume,sfx:ii.sfxVolume})}function Im(){try{const i=localStorage.getItem(Pm);i&&Object.assign(ii,Lm(JSON.parse(i),{...hu}))}catch{}return Dm(),ii}function Cc(i){Object.assign(ii,Lm(i,ii));try{localStorage.setItem(Pm,JSON.stringify(ii))}catch{}return Dm(),ii}function g_(){return Cc({...hu})}function x_(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}const dp=(i,t,e)=>Math.max(t,Math.min(e,i)),Lr=(i,t,e)=>i+(t-i)*e,v_=i=>({x:-Math.sin(i),z:-Math.cos(i)}),y_=i=>({x:Math.cos(i),z:-Math.sin(i)});function Bl(i){const t=Math.hypot(i.x,i.y,i.z)||1;return{x:i.x/t,y:i.y/t,z:i.z/t}}const b_=4.8,hp=.12,M_=1.3,__=0,w_=1.72,up=75,S_=55,E_=9,T_=.25,A_=.35,zm=i=>1-(1-i)*(1-i),C_=i=>1-(1-i)*(1-i);function R_(i,t,e){e&&(i.thirdPerson=!i.thirdPerson,i.viewFrom=i.viewT,i.viewU=0),i.viewU=Math.min(1,i.viewU+t/T_),i.viewT=Lr(i.viewFrom,i.thirdPerson?1:0,C_(i.viewU))}function k_(i,t,e,n,s){const o=e-i,r=n-t,a=o*o+r*r;if(a<1e-6)return 1;let c=1;for(const l of s){const d=l.r+A_,h=i-l.x,u=t-l.z,f=h*h+u*u-d*d;if(f<=0)continue;const g=2*(h*o+u*r),x=g*g-4*a*f;if(x<0)continue;const p=(-g-Math.sqrt(x))/(2*a);p>=0&&p<c&&(c=p)}return c}function fp(i,t=S_,e=[],n=up){const s=i.pitch-i.kick,o=Math.cos(s),r={x:-Math.sin(i.yaw)*o,y:-Math.sin(s),z:-Math.cos(i.yaw)*o},a=zm(i.aimT),c=i.viewT*(1-a);let l=Lr(hp,b_,c);const d=Lr(__,M_,c),h=Math.cos(i.yaw),u=-Math.sin(i.yaw);if(c>0&&e.length){const x=i.x+h*d*.25,p=i.z+u*d*.25,m=k_(x,p,i.x-r.x*l+h*d,i.z-r.z*l+u*d,e);l=Math.max(hp,l*m)}const f={x:i.x-r.x*l+h*d,y:Lr(i.y+w_-r.y*l,Math.max(i.y+.5,i.y+1.6-r.y*l),c),z:i.z-r.z*l+u*d},g=Lr(n,t*(n/up),a)+(i.dashT>0?E_:0);return{pos:f,dir:r,fov:g}}function P_(i,t){const e=t.x-i.pos.x,n=t.y+1.3-i.pos.y,s=t.z-i.pos.z,o=Math.max(0,e*i.dir.x+n*i.dir.y+s*i.dir.z);return{x:i.pos.x+i.dir.x*o,y:i.pos.y+i.dir.y*o,z:i.pos.z+i.dir.z*o}}function pp(i,t,e,n,s){if(i.iframes=Math.max(0,i.iframes-t),i.dashCd=Math.max(0,i.dashCd-t),i.kick=Math.max(0,i.kick-i.kickFrom*t/.3),i.dead){i.speed=0,i.moving=!1,i.aiming=!1,i.aimT=Math.max(0,i.aimT-t*6);return}i.yaw-=e.lookDx*Cn.sens,i.pitch=dp(i.pitch+e.lookDy*Cn.sens,-.6,.9),i.aiming=e.aim,i.aimT=dp(i.aimT+(e.aim?t/.18:-t/.15),0,1);const o=v_(i.yaw),r=y_(i.yaw);let a=o.x*e.forward+r.x*e.strafe,c=o.z*e.forward+r.z*e.strafe;const l=Math.hypot(a,c);l>0&&(a/=l,c/=l),e.dash&&i.dashCd<=0&&(i.dashT=Cn.dashTime,i.iframes=Math.max(i.iframes,Cn.dashIframes),i.dashCd=n,i.dashDirX=l>0?a:o.x,i.dashDirZ=l>0?c:o.z);let d=l>0?Cn.speed*(i.aiming?Cn.aimSpeedMul:1):0;i.moving=l>0,i.dashT>0&&(i.dashT-=t,a=i.dashDirX,c=i.dashDirZ,d=Cn.dashSpeed,i.moving=!0),i.x+=a*d*t,i.z+=c*d*t,s(i,Cn.radius),i.speed=d}function L_(i){return{x:st.playerStart.x,z:st.playerStart.z,y:0,hp:i,maxHp:i,yaw:st.playerStartYaw,pitch:.2,iframes:0,dashT:0,dashCd:0,dashDirX:0,dashDirZ:0,speed:0,moving:!1,aiming:!1,aimT:0,dead:!1,deadT:0,kick:0,kickFrom:0,thirdPerson:!1,viewT:0,viewFrom:0,viewU:1}}function Um(i,t,e,n,s,o){let r=-1/0,a=1/0;const c=t.x*t.x+t.z*t.z,l=i.x-e,d=i.z-n;if(c<1e-9){if(l*l+d*d>s*s)return null}else{const h=l*t.x+d*t.z,u=l*l+d*d-s*s,f=h*h-c*u;if(f<0)return null;const g=Math.sqrt(f);r=(-h-g)/c,a=(-h+g)/c}if(Math.abs(t.y)<1e-9){if(i.y<0||i.y>o)return null}else{let h=-i.y/t.y,u=(o-i.y)/t.y;h>u&&([h,u]=[u,h]),r=Math.max(r,h),a=Math.min(a,u)}return r=Math.max(r,0),r>a?null:r}function D_(i,t){return t.y<-1e-6&&i.y>0?-i.y/t.y:null}function I_(i,t,e,n,s=0){const o=[];for(const r of n){if(r.dead)continue;const a=Um({x:i.x,y:i.y-(r.hitY??0),z:i.z},t,r.hitX??r.x,r.hitZ??r.z,(r.hitR??r.radius)+s,r.hitH??r.height);a!==null&&a<=e&&o.push({target:r,t:a,y:i.y+t.y*a})}return o.sort((r,a)=>r.t-a.t)}function z_(i,t,e,n,s,o,r=6){const a=h=>({x:i.x+t.x*h,y:i.y+t.y*h-o*h*h,z:i.z+t.z*h}),c=[],l=new Set,d=e/r;for(let h=0;h<r;h++){const u=a(h*d),f=a((h+1)*d),g=f.x-u.x,x=f.y-u.y,p=f.z-u.z,m=Math.hypot(g,x,p),_={x:g/m,y:x/m,z:p/m};for(const v of I_(u,_,m,n,s)){if(l.has(v.target))continue;l.add(v.target);const I=h*d+v.t*(d/m);c.push({target:v.target,t:I,y:a(I).y})}const b=D_(u,_);if(b!==null&&b<=m)return{hits:c,ground:h*d+b*(d/m),at:a}}return{hits:c,ground:null,at:a}}function ia(i,t,e){const n=he[i],s=ri.perLevel;return{dmg:n.dmg*(1+s.dmg*t)*e.dmgMul,mag:Math.max(1,Math.round(n.mag*e.magMul*(1+s.mag*t))),reload:n.reload*e.reloadMul*(1-s.reload*t),spread:n.spread*(1-s.spread*t),rate:n.rate*(1-s.rate*t),pellets:n.pellets>1?n.pellets+Math.floor(t/s.pelletEvery):n.pellets}}const Bc=(i,t=i.current)=>(i.lv[t]??0)+(i.bonus[t]??0)+(i.bonus["*"]??0),Hn=(i,t,e=i.current)=>ia(e,Bc(i,e),t).mag;function U_(i,t,e){const n={current:"pistol",ammo:{},lv:t,bonus:e,reloadLeft:0,reloadTotal:0,cooldown:0,bloom:0,sinceShot:9};for(const s of Ni)n.ammo[s]=Hn(n,i,s);return n}const Rc=i=>i.reloadLeft>0;function N_(i,t,e){return i.cooldown=Math.max(0,i.cooldown-t),i.bloom=Math.max(0,i.bloom-t*2.2),i.sinceShot+=t,i.reloadLeft>0&&(i.reloadLeft-=t,i.reloadLeft<=0)?(i.reloadLeft=0,i.ammo[i.current]=Hn(i,e),"reloaded"):null}function mp(i,t){return Rc(i)||i.ammo[i.current]>=Hn(i,t)?!1:(i.reloadTotal=i.reloadLeft=ia(i.current,Bc(i),t).reload,!0)}function F_(i,t){return t===i.current?!1:(i.current=t,i.reloadLeft=0,i.cooldown=.28,!0)}function Nm(i,t,e,n){return ia(i.current,Bc(i),t).spread*(1+i.bloom)*(e?1.35:1)*(n?.5:1)}const O_=2.4;function B_(i,t,e,n=6){const s=t/n;for(let o=0;o<n;o++){const r=i(o*s),a=i((o+1)*s),c=a.x-r.x,l=a.y-r.y,d=a.z-r.z,h=Math.hypot(c,l,d),u={x:c/h,y:l/h,z:d/h};let f=null;for(const g of e){const x=Um(r,u,g.x,g.z,g.r,O_);x!==null&&x<=h&&(f===null||x<f)&&(f=x)}if(f!==null)return o*s+f*(s/h)}return null}function H_(i,t){var d;if(i.cooldown>0||Rc(i)||i.ammo[i.current]<=0)return null;const e=he[i.current],n=ia(i.current,Bc(i),t.stats);i.ammo[i.current]--,i.cooldown=n.rate,i.sinceShot=0;const s=Nm(i,t.stats,t.moving,t.aiming);i.bloom=Math.min(2,i.bloom+e.bloom);const o=Bl(t.dir),r=Math.abs(o.y)>.95?{x:1,y:0,z:0}:{x:0,y:1,z:0},a=Bl({x:o.y*r.z-o.z*r.y,y:o.z*r.x-o.x*r.z,z:o.x*r.y-o.y*r.x}),c={x:a.y*o.z-a.z*o.y,y:a.z*o.x-a.x*o.z,z:a.x*o.y-a.y*o.x},l=[];for(let h=0;h<n.pellets;h++){const u=t.rng()*Math.PI*2,f=Math.sqrt(t.rng())*s,g=Math.cos(u)*f,x=Math.sin(u)*f,p=Bl({x:o.x+a.x*g+c.x*x,y:o.y+a.y*g+c.y*x,z:o.z+a.z*g+c.z*x}),m=z_(t.origin,p,e.range,t.targets,Cn.aimAssist,Cn.bulletDrop),_=m.at,b=(d=t.walls)!=null&&d.length?B_(_,e.range,t.walls):null;b!==null&&(m.hits=m.hits.filter(C=>C.t<=b)),b!==null&&(m.ground===null||b<m.ground)&&(m.ground=b);const v=m.hits.slice(0,Math.max(1,e.pierce));if(v.length){let C=null;v.forEach((y,M)=>{const R=y.target,z=_(y.t),D=R.headAt,V=D?Math.hypot(z.x-D.x,z.y-D.y,z.z-D.z)<=D.r+.1:y.y-(R.hitY??0)>=(R.hitH??R.height)*(R.headFrac??.78),K=1-e.falloff*Math.min(1,y.t/e.range),j=n.dmg*K*Math.pow(.7,M)*(V?Cn.headshotMul:1);R.hit(j,!1);const et={x:_(y.t).x,y:_(y.t).y,z:_(y.t).z,kill:R.dead};C?(C.also.push(et),C.end=_(y.t),C.kill||(C.kill=R.dead),C.headshot||(C.headshot=V)):C={kind:"zombie",headshot:V,kill:R.dead,dmg:j,end:_(y.t),also:[]}}),l.push(C);continue}const I=m.ground,T=I!==null&&I<e.range?I:e.range,A=_(T);l.push({kind:I!==null&&I<e.range?"ground":"air",headshot:!1,kill:!1,dmg:0,end:{x:A.x,y:Math.max(0,A.y),z:A.z},also:[]})}return{weapon:i.current,pellets:l,ammoLeft:i.ammo[i.current]}}const G_=.35*Math.PI/180,V_=4*Math.PI/180;class W_{constructor(){this.pendingHits=[],this.lastHp=-1,this.lastMaxHp=-1,this.pendingRun=!1,this.fireBuf=0,this.player=L_(w.stats.maxHp),this.weapons=U_(w.stats,w.weaponLv,w.weaponLvBonus),H.on("player:hit",t=>this.pendingHits.push(t)),H.on("weapon:unlock",({weapon:t})=>{!(t in he)||w.weapons.includes(t)||(w.weapons.push(t),H.emit("toast",{text:`${he[t].name} 획득!`}),this.emitAmmo())}),H.on("run:start",()=>{this.pendingRun=!0}),H.on("weapon:upgrade",({weapon:t})=>this.upgrade(t))}spreadNow(){return Nm(this.weapons,w.stats,this.player.moving,this.player.aiming)}upgrade(t){if(!(t in he)||!w.weapons.includes(t))return!1;const e=w.weaponLv[t]??0;if(e>=ri.maxLv)return H.emit("toast",{text:`${he[t].name}은(는) 최대 강화`}),!1;if(!Ac({parts:ri.parts[e]},ri.gold[e]))return H.emit("toast",{text:"골드나 부품이 부족하다"}),!1;w.weaponLv[t]=e+1;const n=this.weapons;return n.ammo[t]+=Hn(n,w.stats,t)-Hn({...n,lv:{...n.lv,[t]:e}},w.stats,t),H.emit("weapon:upgraded",{weapon:t,level:e+1}),H.emit("toast",{text:`${he[t].name} 강화 Lv${e+1}`}),this.emitAmmo(),!0}emitAmmo(){const t=this.weapons;H.emit("weapon:ammo",{weapon:t.current,ammo:t.ammo[t.current],mag:Hn(t,w.stats),reloading:Rc(t)})}update(t,e,n){const s=this.player,o=this.weapons,r=w.stats,a={pose:null,shot:null,hurt:null,died:!1,respawned:!1,dashed:!1,dryFire:!1,reloadStarted:!1,reloadDone:!1,switched:!1};if(this.pendingRun&&this.resetRun(a),R_(s,t,!!e.toggleView),s.maxHp!==r.maxHp&&(!s.dead&&r.maxHp>s.maxHp&&(s.hp+=r.maxHp-s.maxHp),s.maxHp=r.maxHp,s.hp=Math.min(s.hp,s.maxHp)),s.dead&&s.hp>0&&this.revive(a),!n.combat)return this.pendingHits.length=0,pp(s,t,e,r.dashCd,n.collide),s.y=n.groundY(s.x,s.z),a.pose=fp(s,he[o.current].adsFov,n.camBlockers,n.baseFov),a;for(const d of this.pendingHits)s.dead||s.iframes>0||d.dmg<=0||(s.hp=Math.max(0,s.hp-d.dmg),s.iframes=Cn.hurtIframes,a.hurt={dmg:d.dmg,fromX:d.x,fromZ:d.z},s.hp<=0&&(s.dead=!0,s.deadT=0,o.reloadLeft=0,a.died=!0,H.emit("player:dead",void 0)));this.pendingHits.length=0,s.dead&&(s.deadT+=t,s.deadT>=Cn.respawnDelay&&w.phase!=="ended"&&(s.hp=s.maxHp,s.x=st.playerStart.x,s.z=st.playerStart.z,s.yaw=st.playerStartYaw,this.revive(a)));const c=s.dashT>0,l=s.dashCd<=0;if(pp(s,t,e,r.dashCd,n.collide),!c&&s.dashT>0&&l&&(a.dashed=!0),s.y=n.groundY(s.x,s.z),a.pose=fp(s,he[o.current].adsFov,n.camBlockers,n.baseFov),N_(o,t,r)==="reloaded"&&(a.reloadDone=!0,H.emit("weapon:sound",{weapon:o.current,kind:"reloadDone"}),this.emitAmmo()),!s.dead&&n.canShoot){if(e.slot!==null){const h=Ni[e.slot];h&&w.weapons.includes(h)&&F_(o,h)?(a.switched=!0,H.emit("weapon:switched",{weapon:h}),H.emit("weapon:sound",{weapon:h,kind:"switch"}),this.emitAmmo()):h&&!w.weapons.includes(h)&&H.emit("toast",{text:`${he[h].name}은(는) 아직 없다`})}if(e.reload&&mp(o,r)&&this.beginReload(a),this.fireBuf=e.firePressed?.2:Math.max(0,this.fireBuf-t),(he[o.current].auto?e.fire:this.fireBuf>0)&&!Rc(o))if(o.ammo[o.current]<=0)mp(o,r)?this.beginReload(a):a.dryFire=!0,e.firePressed&&H.emit("weapon:sound",{weapon:o.current,kind:"dry"});else{const h=H_(o,{origin:P_(a.pose,s),dir:a.pose.dir,targets:n.zombies,walls:n.walls,stats:r,aiming:s.aiming,moving:s.moving,rng:n.rng});if(h){a.shot=h,this.fireBuf=0,s.kick=Math.min(V_,s.kick+G_),s.kickFrom=s.kick,H.emit("weapon:fired",{weapon:h.weapon,ammo:h.ammoLeft,mag:Hn(o,r)}),H.emit("weapon:sound",{weapon:h.weapon,kind:"fire"});const u=h.pellets.some(f=>f.kill)?"kill":h.pellets.some(f=>f.headshot)?"headshot":h.pellets.some(f=>f.kind==="zombie")?"hit":null;u&&H.emit("weapon:sound",{weapon:h.weapon,kind:u}),u==="kill"&&h.pellets.some(f=>f.headshot)&&H.emit("weapon:sound",{weapon:h.weapon,kind:"headshot"}),this.emitAmmo()}}}return(s.hp!==this.lastHp||s.maxHp!==this.lastMaxHp)&&(this.lastHp=s.hp,this.lastMaxHp=s.maxHp,H.emit("player:hp",{hp:s.hp,maxHp:s.maxHp})),a}resetRun(t){this.pendingRun=!1;const e=this.player,n=this.weapons;w.weapons.length=0;for(const o of w.start.weapons??[])o in he&&!w.weapons.includes(o)&&w.weapons.push(o);w.weapons.length||w.weapons.push("pistol");const s=w.weapons[0];for(const o of Object.keys(w.weaponLv))delete w.weaponLv[o];n.current=s,n.reloadLeft=0,n.cooldown=.3,n.bloom=0;for(const o of Ni)n.ammo[o]=Hn(n,w.stats,o);e.maxHp=w.stats.maxHp,e.hp=e.maxHp,e.dead=!1,e.deadT=0,e.iframes=2,e.dashT=0,e.kick=0,e.x=st.playerStart.x,e.z=st.playerStart.z,e.yaw=st.playerStartYaw,this.pendingHits.length=0,t.respawned=!0,H.emit("weapon:switched",{weapon:s}),H.emit("player:respawn",{x:e.x,z:e.z}),this.emitAmmo()}beginReload(t){t.reloadStarted=!0,H.emit("weapon:sound",{weapon:this.weapons.current,kind:"reload"}),H.emit("weapon:reload",{weapon:this.weapons.current,duration:this.weapons.reloadTotal}),this.emitAmmo()}revive(t){const e=this.player;e.dead=!1,e.deadT=0,e.hp=Math.max(1,e.hp),e.iframes=2,e.dashT=0,e.kick=0,t.respawned=!0,H.emit("player:respawn",{x:e.x,z:e.z})}}const $_=32,X_=160;class q_{constructor(t){this.tracers=[],this.parts=[],this.tmp=new L;const e=new Lt(1,1,1);e.translate(0,0,.5);for(let s=0;s<$_;s++){const o=new kt({color:16777215,transparent:!0,depthWrite:!1,blending:ui}),r=new ot(e,o);r.visible=!1,r.frustumCulled=!1,t.add(r),this.tracers.push({mesh:r,mat:o,a:new L,b:new L,t:0,life:.1,len:5,active:!1})}const n=new Lt(1,1,1);for(let s=0;s<X_;s++){const o=new kt({color:16777215,transparent:!0,depthWrite:!1}),r=new ot(n,o);r.visible=!1,t.add(r),this.parts.push({mesh:r,mat:o,vx:0,vy:0,vz:0,g:0,life:0,max:1,spin:0,active:!1,scale0:.05,bounce:!1})}}tracer(t,e,n,s,o=220){const r=this.tracers.find(c=>!c.active)??this.tracers[0];r.a.copy(t),r.b.set(e.x,e.y,e.z);const a=r.a.distanceTo(r.b);r.len=Math.min(a,7),r.life=Math.max(.05,a/o),r.t=0,r.active=!0,r.mat.color.setHex(n),r.mesh.scale.set(s,s,1),r.mesh.visible=!0}spawn(t,e,n,s,o,r,a,c,l,d,h=!1){const u=this.parts.find(f=>!f.active)??this.parts[Math.floor(Math.random()*this.parts.length)];u.mesh.position.set(t,e,n),u.vx=s,u.vy=o,u.vz=r,u.g=d,u.life=u.max=l,u.scale0=c,u.bounce=h,u.spin=(Math.random()-.5)*18,u.mat.color.setHex(a),u.mat.opacity=1,u.mesh.scale.setScalar(c),u.mesh.rotation.set(Math.random()*3,Math.random()*3,0),u.mesh.visible=!0,u.active=!0}blood(t,e,n=7,s=10163220){for(let o=0;o<n;o++){const r=2+Math.random()*4;this.spawn(t.x,t.y,t.z,e.x*r*.6+(Math.random()-.5)*3,Math.random()*3+.5,e.z*r*.6+(Math.random()-.5)*3,o%3===0?6163211:s,.05+Math.random()*.07,.45+Math.random()*.3,14)}}impact(t,e=13218954){for(let n=0;n<5;n++)this.spawn(t.x,t.y+.03,t.z,(Math.random()-.5)*3,1+Math.random()*2.5,(Math.random()-.5)*3,n<2?16765562:e,.04+Math.random()*.05,.3+Math.random()*.25,10)}sparks(t,e,n){for(let s=0;s<n;s++)this.spawn(t.x,t.y,t.z,e.x*(4+Math.random()*8)+(Math.random()-.5)*2.5,e.y*6+Math.random()*1.5,e.z*(4+Math.random()*8)+(Math.random()-.5)*2.5,16762976,.03+Math.random()*.03,.12+Math.random()*.1,6)}casing(t,e,n,s,o=1){this.spawn(t.x,t.y,t.z,e*(2+Math.random()*1.5),2.2+Math.random(),n*(2+Math.random()*1.5),s?12597547:14263361,(s?.07:.045)*o,1.1,16,!0)}update(t){for(const e of this.tracers){if(!e.active)continue;e.t+=t;const n=e.t/e.life;if(n>=1.4){e.active=!1,e.mesh.visible=!1;continue}const s=Math.min(1,n),o=e.len/Math.max(.001,e.a.distanceTo(e.b)),r=Math.max(0,s-o);e.mesh.position.lerpVectors(e.a,e.b,s),this.tmp.lerpVectors(e.a,e.b,r);const a=e.mesh.position.distanceTo(this.tmp);e.mesh.lookAt(this.tmp),e.mesh.scale.z=Math.max(.01,a),e.mat.opacity=n>1?Math.max(0,1-(n-1)*2.5):.95}for(const e of this.parts){if(!e.active)continue;if(e.life-=t,e.life<=0){e.active=!1,e.mesh.visible=!1;continue}e.vy-=e.g*t,e.mesh.position.x+=e.vx*t,e.mesh.position.y+=e.vy*t,e.mesh.position.z+=e.vz*t,e.mesh.position.y<.03&&(e.mesh.position.y=.03,e.bounce&&Math.abs(e.vy)>1?(e.vy=-e.vy*.35,e.vx*=.5,e.vz*=.5):(e.vy=0,e.vx*=.8,e.vz*=.8)),e.mesh.rotation.x+=e.spin*t;const n=e.life/e.max;e.mat.opacity=Math.min(1,n*2),e.mesh.scale.setScalar(e.scale0*(.6+.4*n))}}}const Y_=`
.pv-scope{position:absolute;inset:0;opacity:0;background:radial-gradient(circle at center,transparent 0,transparent 33vmin,#000 33.3vmin)}
.pv-scope .ring{position:absolute;left:50%;top:50%;width:66.6vmin;height:66.6vmin;margin:-33.3vmin;border-radius:50%;box-shadow:inset 0 0 6vmin 2vmin #000c,0 0 0 1px #2ee6d666}
.pv-scope .h,.pv-scope .v{position:absolute;background:#2ee6d6;opacity:.9}
.pv-scope .h{left:calc(50% - 33vmin);top:50%;width:66vmin;height:1px}
.pv-scope .v{top:calc(50% - 33vmin);left:50%;height:66vmin;width:1px}
.pv-scope .tk{position:absolute;left:50%;width:14px;height:1px;margin-left:-7px;background:#ff8a2a}
.pv-scope .tk.s{width:8px;margin-left:-4px}
.pv-scope .hold{position:absolute;left:50%;top:calc(50% + 36vmin);transform:translateX(-50%);font:600 12px system-ui,sans-serif;color:#2ee6d6;letter-spacing:1px;opacity:.85}
.pv-holo{position:absolute;left:50%;top:50%;width:0;height:0;opacity:0}
.pv-holo::before{content:'';position:absolute;left:-1px;top:-1px;width:2px;height:2px;border-radius:50%;background:#2ee6d6;box-shadow:0 0 3px #2ee6d6}
.pv-holo::after{content:none}
.pv-adsvig{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.15) 100%)}
.pv-up{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#000a;pointer-events:auto;z-index:6}
.pv-up .box{background:#121A20F2;border:1px solid #2EE6D6;border-radius:10px;padding:18px 22px;min-width:560px;max-width:720px;max-height:86vh;overflow:auto;box-shadow:0 10px 40px #000}
.pv-up h2{margin:0 0 4px}.pv-up .sub{opacity:.75;font-size:13px;margin-bottom:10px}
.pv-up .g{display:grid;grid-template-columns:1fr auto;gap:2px 14px;align-items:center;padding:9px 0;border-bottom:1px solid #fff1}
.pv-up .g .n{font-weight:bold}.pv-up .g .n b{color:#FF8A2A;font-weight:bold;margin-left:6px}
.pv-up .g .d{font-size:12px;opacity:.75;grid-column:1}
.pv-up .g .s{font-size:12px;color:#9cf;grid-column:1}
.pv-up .g button{grid-column:2;grid-row:1 / span 3;background:#2EE6D6;color:#0b1014;font-weight:700;border:0;border-radius:5px;padding:8px 14px;cursor:pointer;font:inherit;min-width:130px}
.pv-up .g button:disabled{background:#2a3338;color:#7d8b90;cursor:default}
.pv-up .g.lock{opacity:.35}
.pv-up .x{margin-top:12px;text-align:right}.pv-up .x button{background:#44505f;color:#fff;border:0;border-radius:5px;padding:6px 14px;cursor:pointer;font:inherit}
.pv-lv{color:#FF8A2A;font-size:11px;margin-left:4px}

.pv-root{position:fixed;inset:0;pointer-events:none;z-index:3;font-family:'Pretendard','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#fff}
.pv-cross{position:absolute;left:50%;top:50%;width:0;height:0;transition:opacity .2s ease-out}
.pv-cross i{position:absolute;background:#fff;box-shadow:0 0 2px #000,0 0 4px #0008;border-radius:1px}
.pv-cross .t,.pv-cross .b{width:2px;height:8px;left:-1px}.pv-cross .l,.pv-cross .r{height:2px;width:8px;top:-1px}
.pv-cross .dot{width:2px;height:2px;left:-1px;top:-1px;opacity:.9}
.pv-scoped .pv-hit,.pv-scoped .pv-cross{visibility:hidden}
.pv-hit{position:absolute;left:50%;top:50%;width:0;height:0;opacity:0}
.pv-hit i{position:absolute;width:2px;height:7px;background:#2EE6D6;box-shadow:0 0 3px #000;left:-1px;top:-11px;transform-origin:1px 11px}
.pv-hit i{opacity:.75}.pv-hit.kill i{height:8px;opacity:1}
.pv-hit.head i{background:#FF8A2A;width:3px;height:9px;left:-1.5px;top:-12px;transform-origin:1.5px 12px;opacity:1;box-shadow:0 0 3px #000,0 0 6px #FF8A2A99}
.pv-dmgn{position:absolute;left:0;top:0;font-weight:800;font-size:15px;color:#fff;text-shadow:0 1px 2px #000,0 0 4px #000a;white-space:nowrap;font-variant-numeric:tabular-nums;will-change:transform,opacity}
.pv-dmgn.head{color:#FF8A2A;font-size:18px}
.pv-dir{position:absolute;left:50%;top:50%;width:0;height:0;opacity:0}
.pv-dir i{position:absolute;left:-34px;top:-118px;width:68px;height:18px;border-radius:50% 50% 0 0/100% 100% 0 0;border-top:4px solid #E0303A;filter:drop-shadow(0 0 4px #E0303A99)}
.pv-newz{position:absolute;left:50%;top:96px;transform:translateX(-50%);max-width:calc(100vw - 48px);box-sizing:border-box;padding:7px 18px;border-radius:8px;background:#121A20CC;border:1px solid #2EE6D655;color:#2EE6D6;font-size:16px;font-weight:700;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px #000;opacity:0}
.pv-rring{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px;opacity:0;transition:opacity .15s ease-out}
.pv-rring circle{fill:none;stroke-width:2}.pv-rring .bg{stroke:#0008}.pv-rring .fg{stroke:#2EE6D6;stroke-linecap:round;transform:rotate(-90deg);transform-origin:center}
.pv-scope .hm{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px;border:1px solid #2EE6D6;transform:rotate(45deg);opacity:0}
.pv-scope .hm.red{border-color:#FF8A2A}
.pv-hit i:nth-child(1){transform:rotate(45deg)}.pv-hit i:nth-child(2){transform:rotate(135deg)}
.pv-hit i:nth-child(3){transform:rotate(225deg)}.pv-hit i:nth-child(4){transform:rotate(315deg)}
.pv-vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(224,48,58,.65) 100%);opacity:0}
.pv-low{position:absolute;inset:0;box-shadow:inset 0 0 120px 30px rgba(224,48,58,.45);opacity:0;transition:opacity .4s ease-out}
.pv-low::after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 90px 10px rgba(224,48,58,.35);animation:pvPulse 1.6s ease-in-out infinite}
@keyframes pvPulse{50%{opacity:.25}}
.pv-ammo{position:absolute;right:12px;bottom:12px;text-align:right;text-shadow:0 2px 4px #000}
.pv-ammo .nm{font-size:13px;opacity:.85;letter-spacing:.5px;margin-bottom:4px}
.pv-ammo .n{font-size:34px;font-weight:bold;line-height:1;font-variant-numeric:tabular-nums;transition:color .25s ease-out}
.pv-ammo .n small{font-size:18px;opacity:.65;font-weight:normal}
.pv-ammo .n.low{color:#FF8A2A}
.pv-ammo .rl{height:5px;width:150px;margin:6px 0 0 auto;background:#0009;border:1px solid #fff3;border-radius:3px;overflow:hidden;opacity:0;transition:opacity .2s ease-out}
.pv-ammo .rl div{height:100%;width:0;background:#2EE6D6}
.pv-slots{display:flex;gap:4px;justify-content:flex-end;margin-top:6px}
.pv-slot{min-width:40px;padding:3px 6px;border-radius:5px;background:#121A20B3;border:1px solid #2ee6d633;font-size:11px;font-weight:600;text-align:center;color:#d4e2e5;text-shadow:0 1px 2px #000,0 0 4px #000a;transition:color .2s ease-out,border-color .2s ease-out,box-shadow .2s ease-out,background-color .2s ease-out}
.pv-slot b{display:block;font-size:13px;font-weight:600;color:#9fb6bd;line-height:1.1}
.pv-slot.cur{border-color:#2ee6d6;color:#2ee6d6;background:#0d1d20f0;box-shadow:0 0 10px #2ee6d666,inset 0 0 6px #2ee6d633}
.pv-slot.cur b{color:#2ee6d6}
.pv-slot.lock{color:#8a9aa0;border-style:dashed;border-color:#ffffff22}
.pv-slot.lock b{color:#6f8086}
/* 좁은 화면: 무기 칸은 번호만(현재 무기 이름은 탄약 위에 표시) → 1인칭 총과 겹치지 않게 칸 폭을 줄인다 */
@media (max-width:1400px){.pv-slots{gap:3px}.pv-slot{min-width:26px;padding:4px 6px;font-size:0}.pv-slot b{font-size:14px}}
.pv-dash{position:absolute;left:50%;top:calc(50% + 46px);width:56px;height:4px;margin-left:-28px;background:#0007;border-radius:2px;overflow:hidden;opacity:0;transition:opacity .2s ease-out}
@media (prefers-reduced-motion:reduce){.pv-low::after{animation:none}.pv-root *{transition-duration:.01s!important}}
.pv-dash div{height:100%;background:#2EE6D6;width:100%}
`;function j_(){const i=document.getElementById("hpFill"),t=document.getElementById("hpGhost"),e=i==null?void 0:i.closest(".bar");if(!i||!t||!e)return;let n=100;const s=()=>{const o=parseFloat(i.style.width);Number.isFinite(o)&&(t.classList.toggle("up",o>n),t.style.width=`${o}%`,e.classList.toggle("low",o>0&&o<30),n=o)};new MutationObserver(s).observe(i,{attributes:!0,attributeFilter:["style"]}),s()}const rn=(i,t="")=>{const e=document.createElement("div");return e.className=i,e.innerHTML=t,e};class K_{constructor(){this.root=rn("pv-root"),this.cross=rn("pv-cross",'<i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="dot"></i>'),this.hit=rn("pv-hit","<i></i><i></i><i></i><i></i>"),this.vig=rn("pv-vig"),this.low=rn("pv-low"),this.ammo=rn("pv-ammo",'<div class="nm"></div><div class="n"></div><div class="rl"><div></div></div><div class="pv-slots"></div>'),this.dash=rn("pv-dash","<div></div>"),this.dir=rn("pv-dir","<i></i>"),this.newz=rn("pv-newz"),this.rring=rn("pv-rring",'<svg viewBox="0 0 48 48" width="48" height="48"><circle class="bg" cx="24" cy="24" r="22"/><circle class="fg" cx="24" cy="24" r="22"/></svg>'),this.rringFg=this.rring.querySelector(".fg"),this.slotEls={},this.scope=rn("pv-scope",'<i class="ring"></i><i class="h"></i><i class="v"></i><i class="tk s" style="top:calc(50% + 3vmin)"></i><i class="tk" style="top:calc(50% + 6vmin)"></i><i class="tk s" style="top:calc(50% + 9vmin)"></i><i class="tk" style="top:calc(50% + 12vmin)"></i><i class="tk s" style="top:calc(50% + 15vmin)"></i><i class="tk" style="top:calc(50% + 18vmin)"></i><i class="tk s" style="top:calc(50% + 21vmin)"></i><i class="tk" style="top:calc(50% + 24vmin)"></i><span class="hold"></span><i class="hm"></i>'),this.holo=rn("pv-holo"),this.adsVig=rn("pv-adsvig"),this.holdEl=this.scope.querySelector(".hold"),this.crossFade=1,this.crossVis=!0;const t=document.createElement("style");t.textContent=Y_,document.head.appendChild(t),j_(),this.root.append(this.adsVig,this.holo,this.scope,this.vig,this.low,this.cross,this.hit,this.rring,this.dir,this.newz,this.dash),this.root.append(this.ammo),document.body.appendChild(this.root),this.nm=this.ammo.querySelector(".nm"),this.n=this.ammo.querySelector(".n"),this.rl=this.ammo.querySelector(".rl"),this.rlFill=this.rl.firstElementChild,this.slots=this.ammo.querySelector(".pv-slots"),Ni.forEach((e,n)=>{const s=rn("pv-slot",`<b>${n+1}</b>${he[e].name}`);this.slots.appendChild(s),this.slotEls[e]=s}),this.oldCross=document.getElementById("cross"),this.oldCross&&(this.oldCross.style.display="none")}setSpread(t,e){const n=5+t,s=this.cross;this.crossVis=e,s.style.opacity=String(e?this.crossFade:0),s.querySelector(".t").style.top=`${-n-8}px`,s.querySelector(".b").style.top=`${n}px`,s.querySelector(".l").style.left=`${-n-8}px`,s.querySelector(".r").style.left=`${n}px`}hitmarker(t){var e,n;if(this.root.classList.contains("pv-scoped")){const s=this.scope.querySelector(".hm");s.classList.toggle("red",t==="head"),(e=this.hmAnim)==null||e.cancel(),this.hmAnim=s.animate([{opacity:1,transform:"rotate(45deg) scale(.6)"},{opacity:1,transform:"rotate(45deg) scale(1)",offset:.3},{opacity:0,transform:"rotate(45deg) scale(1.1)"}],{duration:150,easing:"ease-out"});return}this.hit.className="pv-hit"+(t==="kill"?" kill":t==="head"?" head":""),(n=this.hitAnim)==null||n.cancel(),this.hitAnim=this.hit.animate([{opacity:1,transform:"scale(.7)"},{opacity:1,transform:"scale(1.1)",offset:.25},{opacity:0,transform:"scale(1.25)"}],{duration:150,easing:"ease-out"})}hurtFrom(t){var e;this.dir.style.transform=`rotate(${t}rad)`,(e=this.dirAnim)==null||e.cancel(),this.dirAnim=this.dir.animate([{opacity:.95},{opacity:.95,offset:.3},{opacity:0}],{duration:800,easing:"ease-out"})}damageNumber(t,e,n,s){if(n<=0||t<0||e<0||t>innerWidth||e>innerHeight)return;const o=rn("pv-dmgn"+(s?" head":""));o.textContent=String(Math.round(n));const r=(Math.random()-.5)*16;this.root.appendChild(o),o.animate([{opacity:1,transform:`translate(${t+r}px,${e}px) translate(-50%,-50%) scale(.85)`},{opacity:1,transform:`translate(${t+r}px,${e-14}px) translate(-50%,-50%) scale(1)`,offset:.25},{opacity:0,transform:`translate(${t+r}px,${e-42}px) translate(-50%,-50%) scale(1)`}],{duration:600,easing:"ease-out"}).onfinish=()=>o.remove()}newEnemy(t){var e;this.newz.textContent=`신규 감염체: ${t}`,(e=this.newzAnim)==null||e.cancel(),this.newzAnim=this.newz.animate([{opacity:0,transform:"translate(-50%,-6px)"},{opacity:1,transform:"translate(-50%,0)",offset:.125},{opacity:1,transform:"translate(-50%,0)",offset:.875},{opacity:0,transform:"translate(-50%,-6px)"}],{duration:2e3,easing:"ease-out"})}hurt(t){var e;(e=this.vigAnim)==null||e.cancel(),this.vigAnim=this.vig.animate([{opacity:Math.min(.8,.45+t)},{opacity:0}],{duration:300,easing:"ease-out"})}setHp(t,e){const n=e>0?Math.max(0,Math.min(1,t/e)):0,s=document.getElementById("hpFill"),o=document.getElementById("hpText");s&&(s.style.width=`${(n*100).toFixed(1)}%`),o&&(o.textContent=`HP ${Math.ceil(t)} / ${e}`)}setLowHp(t){this.low.style.opacity=t?"1":"0"}setScope(t,e,n=!1,s=2){const o=Math.max(0,Math.min(1,(t-.5)/.5)),r=o*o*(3-2*o);this.scope.style.opacity=e?String(r):"0",this.holo.style.opacity=e?"0":String(r),this.adsVig.style.opacity=e?"0":String(r),this.crossFade=1-Math.min(1,t*2),this.cross.style.opacity=String(this.crossVis?this.crossFade:0),this.root.classList.toggle("pv-scoped",e&&t>.3);const a=!e||t<.9?"":n?"숨 참는 중":s<=0?"숨 고르는 중":"Shift 숨참기";this.holdEl.textContent!==a&&(this.holdEl.textContent=a)}setWeapon(t,e,n,s){const o=w.weaponLv[t]??0;this.nm.innerHTML=`${he[t].name}${o?`<span class="pv-lv">Lv${o}</span>`:""}`,this.n.innerHTML=`${e}<small> / ${n}</small>`,this.n.classList.toggle("low",e<=Math.ceil(n*.25));for(const r of Ni)this.slotEls[r].classList.toggle("cur",r===t),this.slotEls[r].classList.toggle("lock",!s.includes(r))}setReload(t){this.rl.style.opacity=t===null?"0":"1",t!==null&&(this.rlFill.style.width=`${Math.round(t*100)}%`),this.rring.style.opacity=t===null?"0":".9",t!==null&&(this.rringFg.style.strokeDasharray=`${(t*138.2).toFixed(1)} 138.2`)}setDash(t){this.dash.style.opacity=t>=1?"0":"1",this.dash.firstElementChild.style.width=`${Math.round(t*100)}%`}dispose(){this.root.remove(),this.oldCross&&(this.oldCross.style.display="")}}class Z_{constructor(t,e){this.onUpgrade=t,this.onClose=e,this.el=rn("pv-up",'<div class="box"></div>'),this.box=this.el.firstElementChild,this.open=!1,document.body.appendChild(this.el),this.el.addEventListener("mousedown",n=>n.stopPropagation()),this.el.addEventListener("click",n=>{n.target===this.el&&e()})}show(t){this.open=t,this.el.style.display=t?"flex":"none",t&&this.refresh()}refresh(){var n;if(!this.open)return;const t=(s,o)=>{const r=ia(s,o,w.stats),a=he[s],c=(r.dmg*a.pellets/a.rate).toFixed(0);return`피해 ${r.dmg.toFixed(0)}${a.pellets>1?"×"+a.pellets:""} · 탄창 ${r.mag} · 재장전 ${r.reload.toFixed(1)}초 · 초당 ${c}`};let e=`<h2>무기 강화 <small style="font-weight:normal;opacity:.7">(V 로 닫기)</small></h2><div class="sub">골드 ${w.gold} · ${dn.parts} ${w.res.parts}</div>`;for(const s of Ni){const o=he[s],r=w.weapons.includes(s),a=w.weaponLv[s]??0,c=a>=ri.maxLv,l=c?"":`${ri.gold[a]}G + ${dn.parts} ${ri.parts[a]}`,d=r&&!c&&w.gold>=ri.gold[a]&&w.res.parts>=ri.parts[a];e+=`<div class="g${r?"":" lock"}"><div class="n">${o.name}<b>${r?"Lv"+a+"/"+ri.maxLv:"미보유"}</b></div><div class="d">${o.desc}</div><div class="s">${r?t(s,a)+(c?"":"  →  "+t(s,a+1)):"상자에서 획득"}</div>`+(r?`<button data-id="${s}"${d?"":" disabled"}>${c?"최대 강화":"강화 "+l}</button>`:"")+"</div>"}e+='<div class="x"><button data-close>닫기</button></div>',this.box.innerHTML=e,this.box.querySelectorAll("button[data-id]").forEach(s=>s.addEventListener("click",()=>this.onUpgrade(s.dataset.id))),(n=this.box.querySelector("[data-close]"))==null||n.addEventListener("click",this.onClose)}dispose(){this.el.remove()}}const zs=class zs{constructor(){if(this.ac=null,this.master=null,this.noise=null,this.lastHit=0,this.title=!1,this.aim={aim:!1,scoped:!1,hold:!1},this.lastAim=0,this.hum=null,this.duck=null,this.voices=0,this.comp=null,this.bgm=null,this.storyBus=null,this.drone=null,this.storyNodes=new Set,this.lastHead=0,this.vol={bgm:1,sfx:1},zs.bound)return;zs.bound=!0;const t=()=>{var e;((e=this.ac)==null?void 0:e.state)==="suspended"&&!document.hidden&&this.ac.resume()};window.addEventListener("pointerdown",t),window.addEventListener("keydown",t),document.addEventListener("visibilitychange",()=>{this.ac&&(document.hidden?(this.stopHum(),this.ac.suspend()):this.ac.resume())}),H.on("weapon:sound",({weapon:e,kind:n})=>this.play(e,n)),H.on("enemy:killed",({type:e,byAlly:n})=>{n||this.bigKill(e)}),H.on("wave:clear",()=>this.waveClear()),H.on("title:hold",({open:e})=>{this.title=e,e&&this.silenceAim()}),H.on("player:dead",()=>this.silenceAim()),H.on("enemy:newType",()=>this.newTypeSting()),window.addEventListener("player:aimstate",e=>this.aimState(e.detail)),window.addEventListener("tycoon:purchase",e=>{const n=e.detail??{};this.purchase(n.kind??"",n.id??"",n.level??1)}),window.addEventListener("story:scene",e=>{var n;return this.storyScene(((n=e.detail)==null?void 0:n.index)??0)}),window.addEventListener("story:end",()=>this.storyEnd()),window.addEventListener("settings:volume",e=>{const n=e.detail??{},s=(o,r)=>typeof o=="number"&&isFinite(o)?Math.min(1,Math.max(0,o)):r;this.vol={bgm:s(n.bgm,this.vol.bgm),sfx:s(n.sfx,this.vol.sfx)},this.applyVol()}),window.addEventListener("settings:change",e=>{const n=e.detail??{},s=(o,r)=>typeof o=="number"&&isFinite(o)?Math.min(1,Math.max(0,o)):r;this.vol={bgm:s(n.bgmVolume,this.vol.bgm),sfx:s(n.sfxVolume,this.vol.sfx)},this.applyVol()})}track(t,...e){this.voices++,t.onended=()=>{this.voices--,t.disconnect(),e.forEach(n=>n.disconnect())}}ensure(){if(document.hidden)return null;if(this.ac)return this.ac.state==="suspended"?(this.ac.resume(),this.ac):this.ac;const t=window.AudioContext??window.webkitAudioContext;if(!t)return null;try{this.ac=new t,this.master=this.ac.createGain(),this.master.gain.value=.4*this.vol.sfx;const e=this.ac.createDynamicsCompressor();e.threshold.value=-14,e.knee.value=6,e.ratio.value=12,e.attack.value=.002,e.release.value=.12,this.duck=this.ac.createGain(),this.master.connect(e).connect(this.duck).connect(this.ac.destination),this.comp=e,this.bgm=this.ac.createGain(),this.bgm.gain.value=this.vol.bgm,this.bgm.connect(e),this.storyBus=this.ac.createGain(),this.storyBus.connect(this.master);const n=this.ac.sampleRate;this.noise=this.ac.createBuffer(1,n,this.ac.sampleRate);const s=this.noise.getChannelData(0);for(let o=0;o<n;o++)s[o]=Math.random()*2-1}catch{this.ac=null}return this.ac}burst(t,e,n,s,o,r="bandpass"){const a=this.ac,c=a.createBufferSource(),l=a.createBiquadFilter(),d=a.createGain();c.buffer=this.noise,l.type=r,l.frequency.value=n,l.Q.value=s,d.gain.setValueAtTime(o,t),d.gain.exponentialRampToValueAtTime(.001,t+e),c.connect(l).connect(d).connect(this.master),this.track(c,l,d),c.start(t,Math.random()*.5),c.stop(t+e+.02)}tone(t,e,n,s,o,r="sine"){const a=this.ac,c=a.createOscillator(),l=a.createGain();c.type=r,c.frequency.setValueAtTime(e,t),c.frequency.exponentialRampToValueAtTime(Math.max(20,n),t+s),l.gain.setValueAtTime(o,t),l.gain.exponentialRampToValueAtTime(.001,t+s),c.connect(l).connect(this.master),this.track(c,l),c.start(t),c.stop(t+s+.02)}play(t,e){if(this.title)return;const n=this.ensure();if(!n||!this.master||this.voices>48&&e!=="fire")return;const s=n.currentTime,o=he[t].snd,r=.94+Math.random()*.12;switch(e){case"fire":{const a=o.pitch*r,c=he[t].kind==="sniper";this.burst(s,.012,7e3,.6,.6*o.noise+.2,"highpass"),this.tone(s,3200*r,900,.015,.25,"square"),this.burst(s,o.len,a*14,.8,.9*o.noise+.1),this.tone(s,a*1.6,a*.3,o.len*1.2,.9*o.thump),this.tone(s,70*r,38,.09+o.thump*.08,.7*o.thump+.15),this.burst(s+.03,.03,2600*r,4,.18),this.burst(s+o.len*.3,o.len*2.5+(c?.6:0),c?700:1100,.4,.12+(c?.15:0),"lowpass");break}case"dry":this.tone(s,2600,1900,.025,.22,"square"),this.burst(s,.02,4e3,5,.2);break;case"switch":this.tone(s,1500,900,.06,.16,"triangle"),this.burst(s+.04,.04,3e3,3,.18);break;case"reload":this.burst(s+.05,.05,1200,4,.35),this.tone(s+.05,420,260,.05,.2,"square"),this.burst(s+.3,.05,1900,4,.4),this.tone(s+.3,700,320,.06,.22,"square");break;case"reloadDone":this.burst(s,.04,2400,5,.45),this.burst(s+.07,.06,1300,4,.5),this.tone(s+.07,480,200,.08,.28,"square");break;case"hit":if(s-this.lastHit<.03)return;this.lastHit=s,this.tone(s,260*r,110,.06,.3),this.burst(s,.04,900,1.5,.25);break;case"headshot":if(s-this.lastHead<.04)return;this.lastHead=s,this.tone(s,260*r,110,.05,.22),this.burst(s,.006,7500,8,.3,"highpass"),this.tone(s,3100*r,2900,.045,.2,"square"),this.tone(s,4650*r,4400,.07,.12,"triangle"),this.burst(s+.002,.02,6200,12,.22);break;case"kill":this.tone(s,200,55,.2,.4),this.burst(s,.12,500,1,.3,"lowpass"),this.tone(s+.02,1100,1100,.08,.12,"triangle");break}}purchase(t,e,n){const s=this.ensure();if(!s||!this.master)return;const o=s.currentTime,r=(a,c)=>[1,1.26,1.5].forEach((l,d)=>this.tone(a+d*.06,c*l,c*l,.25,.16,"triangle"));switch(t){case"upgrade":e==="w_recoil"?(this.burst(o,.03,3e3,6,.35),this.tone(o,900,1400,.08,.15,"square"),this.burst(o+.09,.025,4200,8,.4),this.tone(o+.09,2200,1600,.02,.2,"square"),r(o+.14,700*Math.pow(1.06,n-1))):r(o,600*Math.pow(1.06,Math.max(0,n-1)));break;case"gun":this.burst(o,.06,1100,3,.5),this.tone(o,300,150,.08,.3,"square"),this.burst(o+.14,.07,1600,3,.55),this.tone(o+.14,420,180,.1,.35,"square"),this.tone(o+.14,90,45,.15,.4);break;case"turret":this.tone(o,140,60,.25,.5),this.burst(o,.12,700,1.5,.45,"lowpass"),this.tone(o+.02,1250,1180,.35,.1,"triangle"),this.tone(o+.02,1870,1800,.3,.07,"sine");break;case"ally":this.burst(o,.35,6e3,1,.25,"highpass"),this.tone(o+.25,330,330,.5,.18,"sine"),this.tone(o+.25,495,495,.5,.1,"sine");break;case"refund":[1320,1100,880].forEach((a,c)=>this.tone(o+c*.07,a,a,.15,.12,"sine"));break}}bigKill(t){if(this.title||!zs.BIG.test(t))return;const e=this.ensure();if(!e||!this.master||this.voices>48)return;const n=e.currentTime,s=/^(boss|king)/i.test(t)?1.5:1;this.tone(n,120,32,.35*s,.6),this.tone(n,60,28,.5*s,.45*s),this.burst(n+.01,.18*s,320,.7,.4,"lowpass"),this.burst(n+.05,.12,700,3,.25),this.burst(n+.11,.08,520,4,.2)}silenceAim(){this.aim={aim:!1,scoped:!1,hold:!1},this.stopHum(),this.muffle(!1)}newTypeSting(){if(this.title)return;const t=this.ensure();if(!t||!this.master||this.voices>48)return;const e=t.currentTime;this.tone(e,220,208,.45,.12,"sawtooth"),this.tone(e,233,220,.45,.08,"sawtooth"),this.tone(e+.12,880,840,.3,.07,"triangle")}waveClear(){if(this.title)return;const t=this.ensure();if(!t||!this.master)return;const e=t.currentTime;this.tone(e,180,360,.35,.12,"sawtooth"),[[1,0],[1.25,.09],[1.5,.18],[2,.3]].forEach(([n,s])=>{this.tone(e+s,330*n*.98,330*n,.7-s,.1,"triangle"),this.tone(e+s,330*n*1.004,330*n*1.006,.75-s,.05,"sine")}),this.burst(e+.3,.6,5e3,.6,.05,"highpass")}aimState(t){const e=this.aim;if(t.aim===e.aim&&t.scoped===e.scoped&&t.hold===e.hold)return;if(this.aim={...t},this.title){this.stopHum(),this.muffle(!1);return}const n=this.ensure();if(!n||!this.master)return;const s=n.currentTime,o=s-this.lastAim<.15;t.aim!==e.aim&&!o&&(this.burst(s,.09,t.aim?1800:1400,.8,.05),this.burst(s+.03,.02,2600,5,.04)),t.scoped!==e.scoped&&(t.scoped?(o||this.burst(s,.015,5200,6,.12),o||this.tone(s,3400,2800,.02,.06,"square"),this.startHum(s)):this.stopHum()),!o&&(t.aim!==e.aim||t.scoped!==e.scoped)&&(this.lastAim=s),t.hold!==e.hold&&(t.hold?(this.breath(s,!0),this.muffle(!0)):(this.muffle(!1),(t.scoped||e.scoped)&&this.breath(s,!1)))}breath(t,e){const n=this.ac,s=n.createBufferSource(),o=n.createBiquadFilter(),r=n.createGain(),a=e?.45:.6;s.buffer=this.noise,o.type="bandpass",o.Q.value=.7,o.frequency.setValueAtTime(e?700:1300,t),o.frequency.linearRampToValueAtTime(e?1300:600,t+a),r.gain.setValueAtTime(1e-4,t),r.gain.linearRampToValueAtTime(.05,t+a*.4),r.gain.linearRampToValueAtTime(1e-4,t+a),s.connect(o).connect(r).connect(this.master),this.track(s,o,r),s.start(t,Math.random()*.3),s.stop(t+a+.02)}muffle(t){if(!this.ac||!this.duck)return;const e=this.duck.gain,n=this.ac.currentTime;e.cancelScheduledValues(n),e.setTargetAtTime(t?.55:1,n,t?.12:.2)}startHum(t){if(this.hum)return;const e=this.ac,n=e.createOscillator(),s=e.createGain();n.frequency.value=62,s.gain.setValueAtTime(1e-4,t),s.gain.linearRampToValueAtTime(.025,t+.3),n.connect(s).connect(this.master),n.onended=()=>{n.disconnect(),s.disconnect()},n.start(t),this.hum={o:n,g:s}}stopHum(){if(!this.hum||!this.ac)return;const{o:t,g:e}=this.hum,n=this.ac.currentTime;e.gain.cancelScheduledValues(n),e.gain.setTargetAtTime(1e-4,n,.06),t.stop(n+.4),this.hum=null}applyVol(){if(!this.ac||!this.master||!this.bgm)return;const t=this.ac.currentTime;this.master.gain.setTargetAtTime(.4*this.vol.sfx,t,.05),this.bgm.gain.setTargetAtTime(this.vol.bgm,t,.05)}sNode(t,...e){return this.storyNodes.add(t),this.voices++,t.onended=()=>{this.voices--,this.storyNodes.delete(t),t.disconnect(),e.forEach(n=>n.disconnect())},t}sNoise(t,e,n,s,o,r,a="bandpass",c=.004){const l=this.ac,d=l.createBufferSource(),h=l.createBiquadFilter(),u=l.createGain();d.buffer=this.noise,d.loop=!0,h.type=a,h.Q.value=o,h.frequency.setValueAtTime(n,t),h.frequency.exponentialRampToValueAtTime(Math.max(20,s),t+e),u.gain.setValueAtTime(1e-4,t),u.gain.linearRampToValueAtTime(r,t+c),u.gain.exponentialRampToValueAtTime(1e-4,t+e),d.connect(h).connect(u).connect(this.storyBus),this.sNode(d,h,u),d.start(t,Math.random()*.5),d.stop(t+e+.03)}sTone(t,e,n,s,o,r="sine",a=.005){const c=this.ac,l=c.createOscillator(),d=c.createGain();l.type=r,l.frequency.setValueAtTime(e,t),l.frequency.exponentialRampToValueAtTime(Math.max(20,n),t+s),d.gain.setValueAtTime(1e-4,t),d.gain.linearRampToValueAtTime(o,t+a),d.gain.exponentialRampToValueAtTime(1e-4,t+s),l.connect(d).connect(this.storyBus),this.sNode(l,d),l.start(t),l.stop(t+s+.03)}startDrone(t){const e=this.ac;if(this.drone)return;const n=e.createGain(),s=e.createBiquadFilter();s.type="lowpass",s.Q.value=.7,s.frequency.setValueAtTime(180,t),s.frequency.linearRampToValueAtTime(900,t+18),n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.05,t+3),n.gain.linearRampToValueAtTime(.11,t+18),s.connect(n).connect(this.bgm);const o=[],r=[s,n];for(const[u,f,g,x]of[[41.2,"sawtooth",-7,.5],[41.2,"sawtooth",7,.5],[61.7,"triangle",0,.35],[82.4,"sine",3,.25]]){const p=e.createOscillator(),m=e.createGain();p.type=f,p.frequency.value=u,p.detune.value=g,m.gain.value=x,p.connect(m).connect(s),r.push(m),o.push(p),p.start(t)}const a=e.createOscillator(),c=e.createGain();a.frequency.value=.08,c.gain.value=60,a.connect(c).connect(s.frequency),a.start(t),o.push(a),r.push(c);const l=e.createBufferSource(),d=e.createBiquadFilter(),h=e.createGain();l.buffer=this.noise,l.loop=!0,d.type="bandpass",d.frequency.value=320,d.Q.value=.6,h.gain.value=.25,l.connect(d).connect(h).connect(n),l.start(t),o.push(l),r.push(d,h),o.forEach(u=>{this.voices++,u.onended=()=>{this.voices--,u.disconnect()}}),this.drone={srcs:o,g:n,nodes:r}}storyScene(t){const e=this.ensure();if(!e||!this.storyBus)return;const n=e.currentTime+.02,s=Math.max(0,Math.min(6,Math.floor(t)));if((s===0||!this.drone)&&this.startDrone(n),!(this.voices>56)){this.sTone(n,72,34,.9,.28),this.sNoise(n-.01,.7,2400,260,.8,.12,"bandpass",.18);for(let o=0,r=n+.25;r<n+2.2;o++,r+=.07+Math.random()*.06)this.sNoise(r,.025,3200+Math.random()*900,2600,6,.035+Math.random()*.015,"bandpass",.001),o%5===0&&this.sTone(r,1900,1500,.02,.008,"square",.001);s===5&&(this.sTone(n+.05,55,28,1.8,.45,"sine"),this.sTone(n+.05,110,52,.6,.14,"sawtooth"),this.sNoise(n+.05,1.4,900,120,.7,.2,"lowpass",.003),this.sTone(n+.05,880,860,1.6,.03,"triangle",.02)),s===6&&(this.sTone(n,110,440,1.6,.08,"sawtooth",1.2),this.sTone(n,165,660,1.6,.05,"sawtooth",1.2),this.sNoise(n,1.6,300,6e3,1.2,.1,"bandpass",1.4),this.sTone(n+1.6,60,30,1.2,.4,"sine",.004),this.sNoise(n+1.6,.8,1800,200,.7,.15,"lowpass",.002))}}storyEnd(){if(!this.ac)return;const t=this.ac.currentTime;if(this.drone){const{srcs:n,g:s,nodes:o}=this.drone;s.gain.cancelScheduledValues(t),s.gain.setValueAtTime(Math.max(1e-4,s.gain.value),t),s.gain.linearRampToValueAtTime(1e-4,t+.6),n.forEach(r=>{try{r.stop(t+.65)}catch{}}),setTimeout(()=>o.forEach(r=>r.disconnect()),800),this.drone=null}const e=this.storyBus;e&&(e.gain.cancelScheduledValues(t),e.gain.setValueAtTime(e.gain.value,t),e.gain.linearRampToValueAtTime(1e-4,t+.6),setTimeout(()=>{var s;const n=((s=this.ac)==null?void 0:s.currentTime)??0;this.storyNodes.forEach(o=>{try{o.stop()}catch{}}),e.gain.setValueAtTime(1,n+.05)},650))}};zs.bound=!1,zs.BIG=/^(fatty|tank|armou?red|boss|king)/i;let Ah=zs;function je(i,t,e=1){const n=new _t,s=[],o=u=>{const f=new $e({color:u});return s.push(f),f},r=(u,f,g,x,p,m,_,b=n)=>{const v=new ot(new Lt(u,f,g),x);return v.position.set(p,m,_),v.castShadow=!0,b.add(v),v},a=o(t),c=o(i),l=o(2962240),d=[],h=[];for(const u of[-1,1]){const f=new _t;f.position.set(u*.17,.7,0),r(.26,.7,.26,l,0,-.35,0,f),n.add(f),d.push(f);const g=new _t;g.position.set(u*.42,1.38,0),r(.2,.65,.2,c,0,-.3,0,g),n.add(g),h.push(g)}return r(.62,.75,.36,a,0,1.08,0),r(.42,.42,.42,c,0,1.68,0),n.scale.setScalar(e),{group:n,mats:s,legs:d,arms:h,walk:0}}function Hc(i,t,e){i.walk+=t*e*2.2;const n=Math.sin(i.walk)*Math.min(1,e/3)*.7;i.legs[0].rotation.x=n,i.legs[1].rotation.x=-n}const Nn=(i,t=.25,e=.5,n=0,s=0)=>new Ri({color:i,metalness:t*.45,roughness:e,emissive:n,emissiveIntensity:s});let J_=null;function Q_(){return{steel:Nn(10791860,.7,.4),dark:Nn(3817287,.5,.5),black:Nn(1908515,.3,.6),poly:Nn(4014408,.05,.8),wood:Nn(8079912,0,.7),woodDk:Nn(5583643,0,.75),brass:Nn(13214026,.8,.3),shell:Nn(12597547,0,.6),olive:Nn(5660735,.1,.75),redDot:Nn(16722474,0,.3,16719904,1.6),lens:Nn(7328767,.2,.1,1731210,.9),white:Nn(15987694,0,.5,16777215,.4)}}const Wo=new Map,tw=(i,t,e)=>{const n=`b${i},${t},${e}`;return Wo.has(n)||Wo.set(n,new Lt(i,t,e)),Wo.get(n)},ew=(i,t,e=10)=>{const n=`c${i},${t},${e}`;if(!Wo.has(n)){const s=new ae(i,i,t,e);s.rotateX(Math.PI/2),Wo.set(n,s)}return Wo.get(n)};let nw=class{constructor(t){this.M=t,this.root=new _t,this.parts={}}put(t,e,n,s,o,r=0,a=0,c=0){return t.position.set(n,s,o),t.rotation.set(r,a,c),e.add(t),t}box(t,e,n,s,o,r,a,c=0,l=this.root,d=0,h=0){const u=new ot(tw(t,e,n),s);return u.castShadow=!1,this.put(u,l,o,r,a,c,d,h)}cyl(t,e,n,s,o,r,a=this.root,c=10){const l=new ot(ew(t,e,c),n);return l.castShadow=!1,this.put(l,a,s,o,r)}group(t,e,n,s,o=0){const r=new _t;return this.put(r,this.root,e,n,s,o),this.parts[t]={obj:r,rest:r.position.clone(),restRot:r.rotation.clone()},r}node(t,e,n){return this.put(new Re,this.root,t,e,n)}finish(t,e,n,s=!1){return this.root.scale.setScalar(n),{root:this.root,muzzle:t,eject:e,parts:this.parts,scoped:s}}};function iw(i){const{steel:t,dark:e,poly:n,white:s,black:o}=i.M,r=i.group("slide",0,.055,-.13);i.box(.056,.07,.3,t,0,0,0,0,r),i.box(.058,.012,.3,e,0,.036,0,0,r);for(let c=0;c<4;c++)i.box(.06,.06,.008,e,0,0,.1+c*.016,0,r);i.box(.01,.022,.05,o,.029,.01,-.04,0,r),i.box(.014,.014,.016,s,0,.044,-.13,0,r),i.box(.03,.014,.014,e,0,.044,.13,0,r),i.cyl(.011,.04,o,0,-.005,-.165,r,8),i.box(.05,.038,.27,n,0,.004,-.115,0),i.box(.05,.02,.07,n,0,-.02,-.19,0),i.box(.052,.16,.07,n,0,-.085,.02,.2);for(let c=0;c<4;c++)i.box(.054,.006,.062,e,0,-.06-c*.026,.012-c*.005,.2);i.box(.05,.01,.07,n,0,-.025,-.05,0),i.box(.012,.045,.01,n,0,-.05,-.085,0),i.box(.012,.01,.06,n,0,-.072,-.058,0),i.box(.01,.026,.01,t,0,-.04,-.045,.3);const a=i.group("mag",0,0,0,.2);return i.box(.044,.11,.058,e,0,-.16,.02,0,a),i.box(.05,.014,.066,o,0,-.222,.02,0,a),i.finish(i.node(0,.055,-.3),i.node(.03,.065,-.1),1.45)}function sw(i){const{steel:t,dark:e,wood:n,woodDk:s,brass:o,white:r,black:a}=i.M;i.cyl(.02,.3,t,0,.045,-.3,void 0,12),i.box(.016,.014,.3,e,0,.073,-.3,0),i.box(.034,.03,.22,e,0,.016,-.26,0),i.cyl(.016,.02,a,0,.045,-.462,void 0,8),i.box(.012,.022,.02,r,0,.088,-.44,0),i.box(.052,.09,.15,t,0,.025,-.02,0),i.box(.032,.014,.02,e,0,.078,.04,0);const c=i.group("drum",0,.04,-.095);i.cyl(.044,.085,t,0,0,0,c,14);for(let d=0;d<6;d++){const h=d/6*Math.PI*2;i.cyl(.011,.088,a,Math.cos(h)*.027,Math.sin(h)*.027,0,c,8),i.cyl(.008,.01,o,Math.cos(h)*.027,Math.sin(h)*.027,.046,c,8)}const l=i.group("hammer",0,.075,.07);return i.box(.014,.04,.016,e,0,.01,0,-.5,l),i.box(.05,.14,.085,s,0,-.08,.05,.28),i.box(.054,.12,.012,n,0,-.085,.01,.28),i.box(.012,.012,.075,t,0,-.04,-.06,0),i.box(.012,.04,.012,t,0,-.06,-.095,0),i.box(.01,.026,.01,t,0,-.03,-.045,.25),i.finish(i.node(0,.045,-.47),i.node(.04,.04,-.09),1.45)}function ow(i){const{steel:t,dark:e,poly:n,black:s,redDot:o,white:r}=i.M;i.box(.062,.085,.32,e,0,.01,-.12,0),i.box(.066,.02,.3,n,0,.058,-.12,0),i.cyl(.03,.2,t,0,.012,-.36,void 0,12);for(let c=0;c<4;c++)i.box(.066,.012,.022,s,0,.012,-.29-c*.045,0);i.cyl(.011,.07,s,0,.012,-.5,void 0,8),i.box(.012,.03,.012,r,0,.068,-.45,0),i.box(.04,.03,.07,s,0,.082,-.12,0),i.box(.036,.034,.008,e,0,.11,-.085,0),i.box(.036,.034,.008,e,0,.11,-.155,0),i.box(.034,.03,.002,o,0,.11,-.119,0),i.box(.05,.1,.07,n,0,-.065,.03,.22),i.box(.05,.1,.06,n,0,-.07,-.34,0),i.box(.012,.012,.07,n,0,-.045,-.05,0),i.box(.012,.04,.012,n,0,-.06,-.085,0),i.box(.012,.012,.075,n,0,-.08,-.05,0),i.box(.01,.026,.01,t,0,-.045,-.045,.25),i.box(.012,.012,.045,t,.04,.03,-.01,0),i.box(.01,.01,.26,t,-.022,.03,.2,0),i.box(.01,.01,.26,t,.022,.03,.2,0),i.box(.05,.075,.028,n,0,.012,.335,0);const a=i.group("mag",0,0,0);return i.box(.042,.13,.062,e,0,-.14,-.1,-.06,a),i.box(.042,.12,.062,e,0,-.26,-.082,-.12,a),i.box(.046,.012,.068,s,0,-.325,-.07,-.12,a),i.finish(i.node(0,.012,-.54),i.node(.034,.045,-.09),1.4)}function rw(i){const{steel:t,dark:e,wood:n,woodDk:s,shell:o,brass:r,black:a,white:c}=i.M;i.cyl(.022,.66,t,0,.04,-.4,void 0,12),i.cyl(.019,.5,e,0,-.005,-.34,void 0,10),i.box(.01,.012,.62,a,0,.066,-.4,0),i.cyl(.026,.016,a,0,.04,-.725,void 0,10),i.box(.012,.018,.012,c,0,.078,-.7,0),i.box(.064,.095,.24,e,0,.02,-.04,0),i.box(.012,.03,.08,a,.034,.03,-.04,0);const l=i.group("pump",0,-.005,-.4);i.box(.07,.062,.2,s,0,0,0,0,l);for(let d=0;d<5;d++)i.box(.074,.05,.008,n,0,0,-.07+d*.035,0,l);i.box(.012,.012,.07,t,0,-.07,-.05,0),i.box(.012,.04,.012,t,0,-.05,-.09,0),i.box(.01,.026,.01,t,0,-.045,-.045,.25),i.box(.058,.115,.34,n,0,-.03,.26,-.13),i.box(.06,.12,.02,a,0,-.045,.44,-.13),i.box(.06,.1,.05,s,0,-.055,.04,.3);for(let d=0;d<4;d++)i.cyl(.011,.045,o,-.037,.03,-.02+d*.026,void 0,8),i.cyl(.0115,.012,r,-.037,.03,-0+d*.026+0,void 0,8).position.z=-0+d*.026+.02;return i.finish(i.node(0,.04,-.74),i.node(.04,.04,-.05),1.3)}function aw(i){const{steel:t,dark:e,poly:n,black:s,olive:o,redDot:r,white:a}=i.M;i.box(.058,.085,.3,e,0,.02,-.08,0),i.box(.06,.07,.3,n,0,.012,-.4,0);for(let d=0;d<6;d++)i.box(.064,.012,.014,e,0,.052,-.28-d*.045,0);for(let d=0;d<3;d++)i.box(.064,.016,.03,s,0,-.016,-.34-d*.07,0);i.cyl(.011,.14,t,0,.02,-.62,void 0,8),i.cyl(.018,.07,s,0,.02,-.72,void 0,8),i.box(.012,.045,.012,a,0,.065,-.62,0),i.box(.04,.012,.09,s,0,.068,-.05,0),i.box(.044,.045,.01,e,0,.095,-.09,0),i.box(.044,.045,.01,e,0,.095,-.01,0),i.box(.044,.01,.09,e,0,.12,-.05,0),i.box(.034,.03,.002,r,0,.097,-.05,0),i.box(.05,.11,.07,n,0,-.07,.03,.25),i.box(.012,.012,.075,n,0,-.045,-.06,0),i.box(.012,.04,.012,n,0,-.06,-.1,0),i.box(.012,.012,.08,n,0,-.08,-.06,0),i.box(.01,.026,.01,t,0,-.045,-.055,.25),i.cyl(.018,.2,e,0,.03,.17,void 0,8),i.box(.052,.11,.2,o,0,0,.34,-.1),i.box(.054,.12,.016,s,0,0,.445,-.1);const c=i.group("bolt",.036,.04,-.03);i.box(.01,.014,.04,t,0,0,0,0,c);const l=i.group("mag",0,0,0);return i.box(.042,.12,.07,e,0,-.105,-.12,-.12,l),i.box(.042,.1,.07,e,0,-.21,-.1,-.3,l),i.box(.046,.012,.074,s,0,-.265,-.085,-.3,l),i.finish(i.node(0,.02,-.76),i.node(.034,.05,-.05),1.3)}function cw(i){const{steel:t,dark:e,poly:n,black:s,olive:o,lens:r,woodDk:a,wood:c}=i.M;i.box(.06,.09,.34,e,0,.02,-.06,0),i.cyl(.018,.75,t,0,.03,-.6,void 0,12),i.cyl(.026,.1,e,0,.03,-1,void 0,10);for(let h=0;h<3;h++)i.box(.06,.008,.014,s,0,.03,-.97-h*.03,0);i.box(.062,.065,.36,n,0,.005,-.4,0),i.cyl(.026,.34,s,0,.115,-.12,void 0,12),i.cyl(.037,.07,s,0,.115,-.3,void 0,12),i.cyl(.034,.06,s,0,.115,.06,void 0,12),i.cyl(.031,.004,r,0,.115,-.337,void 0,12),i.cyl(.028,.004,r,0,.115,.092,void 0,12),i.cyl(.012,.03,e,0,.156,-.12,void 0,8).rotation.set(0,0,0),i.box(.03,.04,.03,e,0,.07,-.2,0),i.box(.03,.04,.03,e,0,.07,-.02,0);const l=i.group("bolt",.04,.045,0);i.cyl(.007,.07,t,.03,0,0,l,6).rotation.set(0,0,Math.PI/2),i.cyl(.014,.02,s,.07,0,0,l,8),i.box(.056,.12,.18,o,0,-.01,.2,0),i.box(.056,.05,.26,o,0,.04,.38,0),i.box(.058,.06,.2,o,0,-.1,.34,-.05),i.box(.06,.15,.02,s,0,-.01,.5,0),i.box(.05,.1,.06,o,0,-.07,.04,.3),i.box(.012,.012,.07,t,0,-.045,-.06,0),i.box(.012,.035,.012,t,0,-.06,-.1,0),i.cyl(.006,.18,t,-.025,-.05,-.5,void 0,6).rotation.set(.1,0,0),i.cyl(.006,.18,t,.025,-.05,-.5,void 0,6).rotation.set(.1,0,0);const d=i.group("mag",0,0,0);return i.box(.04,.07,.1,e,0,-.09,-.07,0,d),i.finish(i.node(0,.03,-1.06),i.node(.034,.05,0),1.2,!0)}const lw={pistol:iw,magnum:sw,smg:ow,shotgun:rw,rifle:aw,sniper:cw};function dw(i){const t=new nw(J_??(J_=Q_()));return lw[i](t)}const hw=378,uw=.35,fw=.64,Va=.5,pw=.45,gp=.5,mw=.5,gw=Math.tan(55*Math.PI/360);function xw(){const i=new _t,t=new $e({color:2766400}),e=new kt({color:3951704}),n=new $e({color:1713196}),s=new kt({color:3073750}),o=(l,d,h,u,f,g,x,p=0)=>{const m=new ot(new Lt(l,d,h),u);return m.position.set(f,g,x),m.rotation.x=p,m.castShadow=!1,i.add(m),m};o(.066,.1,.085,t,0,-.07,.03,.2),o(.02,.03,.06,t,.03,-.02,-.02,0),o(.068,.003,.012,e,0,-.022,-.012,.2),o(.06,.07,.11,t,0,-.13,.11,.55);const r=new _t;r.position.set(0,-.16,.15),r.rotation.x=.55,i.add(r);const a=new ot(new Lt(.085,.09,.22),n);a.position.z=.11,r.add(a);const c=new ot(new Lt(.088,.093,.004),s);return c.position.z=.001,r.add(c),i.traverse(l=>{l.castShadow=!1}),i}function vw(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"#fff"),e.addColorStop(.5,"rgba(255,255,255,.6)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new or(i)}const xp=.05,Fm=i=>Math.max(0,Math.min(1,i)),Om=i=>(i=Fm(i),i*i*(3-2*i)),_o=(i,t,e)=>Om((i-t)/(e-t));class yw{constructor(t){this.pivot=new _t,this.adsPos=new L,this.tmpV=new L,this.guns={},this.flashMats=[],this.flashT=0,this.recoil=0,this.deadFall=0,this.drumAngle=0,this.drumTarget=0,this.swayX=0,this.swayY=0,this.lastYaw=0,this.lastPitch=0,this.bobT=0,this.time=0,this.lastShotAge=9,this.fpPos=new L,this.sightH={},this.model=je(14726284,3829413);const e=this.model.group,n=new ot(new Lt(.46,.12,.5),new $e({color:2372170}));n.position.set(0,1.94,-.03),e.add(n);const s=new ot(new Lt(.5,.58,.22),new $e({color:5069370}));s.position.set(0,1.1,.29),e.add(s),this.pivot.position.set(.11,1.47,-.5),e.add(this.pivot);for(const o of Ni){const r=dw(o);r.root.visible=!1,this.pivot.add(r.root),this.guns[o]=r,this.sightH[o]=new hs().setFromObject(r.root).max.y}this.flash=new _t;for(let o=0;o<2;o++){const r=new kt({color:16747050,transparent:!0,depthWrite:!1,blending:ui,side:be});this.flashMats.push(r);const a=new ot(new wn(.5,.5),r);a.rotation.z=o*Math.PI/4,this.flash.add(a);const c=new ot(new wn(.5,.5),r);c.rotation.y=Math.PI/2,c.rotation.z=o*Math.PI/4,c.position.z=-.12,this.flash.add(c)}this.flash.visible=!1,this.light=new ar(16756832,0,7,2),this.flash.add(this.light),this.hand=xw(),this.pivot.add(this.hand),e.traverse(o=>{o.castShadow=!1}),this.blob=new ot(new us(.45,24),new kt({map:vw(),color:0,transparent:!0,opacity:0,depthWrite:!1})),this.blob.rotation.x=-Math.PI/2,this.blob.renderOrder=1,t.add(this.blob),t.add(e)}muzzleWorld(t,e=new L){return this.model.group.updateMatrixWorld(!0),this.guns[t.current].muzzle.getWorldPosition(e)}muzzleDir(t,e=new L){const n=this.guns[t.current].root.getWorldQuaternion(new $n);return e.set(0,0,-1).applyQuaternion(n)}ejectWorld(t,e=new L){return this.model.group.updateMatrixWorld(!0),this.guns[t.current].eject.getWorldPosition(e)}fired(t){const e=he[t.current];this.recoil=1,this.flashT=xp,this.lastShotAge=0,this.drumTarget+=Math.PI/3,this.guns[t.current].muzzle.add(this.flash);const s=e.kind;this.flash.scale.setScalar(s==="shotgun"?1.8:s==="sniper"?1.6:s==="revolver"?1.5:s==="smg"?.9:s==="rifle"?1.1:1.2),this.flash.rotation.z=Math.random()*Math.PI,this.flash.visible=!0,this.light.intensity=s==="shotgun"||s==="sniper"?6:3}gunScreenRect(t){let e=1,n=-1,s=-1,o=1;const r=new L;this.pivot.updateWorldMatrix(!0,!0),this.pivot.traverseVisible(u=>{const f=u;if(!f.isMesh)return;const g=f.geometry.attributes.position;for(let x=0;x<g.count;x++)r.fromBufferAttribute(g,x).applyMatrix4(f.matrixWorld).project(t),!(r.z>=1)&&(e=Math.min(e,r.x),n=Math.max(n,r.x),s=Math.max(s,r.y),o=Math.min(o,r.y))});const a=innerWidth,c=innerHeight,l=u=>Math.max(-1,Math.min(1,u)),d=Object.values(this.guns).find(u=>u.root.visible),h=d?d.muzzle.getWorldPosition(new L).project(t):null;return{tipX:h?(h.x+1)/2*a:-1,tipY:h?(1-h.y)/2*c:-1,left:(l(e)+1)/2*a,right:(l(n)+1)/2*a,top:(1-l(s))/2*c,bottom:(1-l(o))/2*c}}gunScreenFrac(t){if(!this.pivot.visible)return 0;let e=-1;const n=new L;return this.pivot.updateWorldMatrix(!0,!0),this.pivot.traverseVisible(s=>{const o=s;if(!o.isMesh)return;const r=o.geometry.attributes.position;for(let a=0;a<r.count;a++)n.fromBufferAttribute(r,a).applyMatrix4(o.matrixWorld).project(t),n.z<1&&Math.abs(n.x)<=1&&(e=Math.max(e,n.y))}),Math.max(0,Math.min(1,(e+1)/2))}update(t,e,n,s){const o=this.model.group;this.time+=t;for(const U of Ni)this.guns[U].root.visible=U===n.current;const r=this.guns[n.current],a=he[n.current];o.position.set(e.x,e.y,e.z),o.rotation.y=e.yaw,Hc(this.model,t,e.speed),this.deadFall+=((e.dead?1:0)-this.deadFall)*Math.min(1,t*7),o.rotation.x=-this.deadFall*1.45,o.position.y=e.y+this.deadFall*.25;let c=e.yaw-this.lastYaw;c>Math.PI?c-=Math.PI*2:c<-Math.PI&&(c+=Math.PI*2);const l=e.pitch-this.lastPitch;this.lastYaw=e.yaw,this.lastPitch=e.pitch;const d=a.sway*(1-.65*e.aimT),h=Math.max(-.07,Math.min(.07,c*.9))*d,u=Math.max(-.05,Math.min(.05,l*.9))*d,f=Math.min(1,t*12);this.swayX+=(h-this.swayX)*f,this.swayY+=(u-this.swayY)*f,this.swayX*=Math.max(0,1-t*6),this.swayY*=Math.max(0,1-t*6),this.bobT+=t*(e.speed>.5?e.speed*1.5:0);const g=e.speed>.5?Math.min(1,e.speed/6)*(1-.7*e.aimT):0,x=Math.sin(this.bobT*2)*.012*g,p=Math.cos(this.bobT)*.01*g,m=Math.sin(this.time*1.6)*.004*(1-.5*e.aimT);this.recoil=Math.max(0,this.recoil-t/.12),this.lastShotAge+=t;const _=a.kind==="sniper"?1.6:a.kind==="shotgun"?1.4:a.kind==="revolver"?1.3:a.kind==="smg"?.55:.85,b=this.recoil*.06*_,v=this.recoil*.0524*_,I=n.reloadLeft>0&&n.reloadTotal>0,T=I?1-n.reloadLeft/n.reloadTotal:0;let A=0,C=0,y=0;const M=r.parts.mag;if(M&&this.animateMag(M,I?T:0,a.kind),I){const U=Math.sin(Fm(T)*Math.PI);A=U*(a.kind==="shotgun"?.5:.75),C=U*(a.kind==="shotgun"?.25:.12),y=U*.08;const J=r.parts.drum;if(J&&(J.obj.position.x=J.rest.x-.07*U,J.obj.rotation.z=this.drumAngle+U*0),a.kind==="shotgun"&&r.parts.pump){const X=T*3%1;r.parts.pump.obj.position.z=r.parts.pump.rest.z+Math.sin(X*Math.PI)*.07}a.kind==="sniper"&&r.parts.bolt&&T>.82&&this.animateBolt(r.parts.bolt,(T-.82)/.18)}else{const U=r.parts.drum;U&&(U.obj.position.x=U.rest.x)}const R=this.lastShotAge,z=r.parts.slide;if(z&&(z.obj.position.z=z.rest.z+(n.ammo[n.current]<=0&&!I?.06:0)+Math.max(0,1-R/.07)*.055),!I){if(r.parts.pump&&a.kind==="shotgun"){const U=(R-.22)/.4;r.parts.pump.obj.position.z=r.parts.pump.rest.z+(U>0&&U<1?Math.sin(U*Math.PI)*.085:0)}r.parts.bolt&&a.kind==="sniper"&&this.animateBolt(r.parts.bolt,(R-.28)/.7),r.parts.bolt&&a.kind==="rifle"&&(r.parts.bolt.obj.position.z=r.parts.bolt.rest.z+Math.max(0,1-R/.06)*.05)}const D=r.parts.drum;D&&(this.drumAngle+=(this.drumTarget-this.drumAngle)*Math.min(1,t*18),D.obj.rotation.z=this.drumAngle);const V=r.parts.hammer;V&&(V.obj.rotation.x=-.6*Math.max(0,1-R/.18)+.2*Om(R/.5-.2));const K=-(e.pitch-e.kick)+.1,j=0,et=!e.dead&&(e.aimT>.35||e.viewT<.5),q=e.dead?0:1-e.viewT;this.hand.visible=q>.5&&!(a.scope&&e.aimT>.6),this.blob.material.opacity=.38*e.viewT*(1-this.deadFall),this.blob.position.set(e.x,e.y+.03,e.z);for(const U of o.children)U!==this.pivot&&(U.visible=!et);if(this.pivot.visible=!(a.scope&&e.aimT>.6),this.pivot.rotation.set(K-.2*e.aimT+v-A+this.swayY*.8,this.swayX*1.2,C+this.swayX*.5),this.pivot.position.set(.11+j+p+this.swayX*.4,1.47-A*.14+x+m-this.swayY*.3,-.5+b+y),q>0){const U=Math.tan(s*Math.PI/360),J=innerWidth/Math.max(1,innerHeight),X=e.pitch-e.kick,ct=Math.sin(X),vt=Math.cos(X),Ut=1.72+ct*.12,jt=vt*.12,Bt=innerWidth/2,ue=Math.min(uw,Math.max(0,(Bt-hw)/Bt)),F=fw*Va*U,Ze=ue*Va*U*J;this.fpPos.set(Ze+p+this.swayX*.3,Ut-ct*Va-vt*F+x+m-A*.08,jt-vt*Va+ct*F+b*.6+y),this.pivot.position.lerp(this.fpPos,q)}const lt=1+(pw-1)*q;if(e.aimT>0){const U=zm(e.aimT),J=Math.tan(s*Math.PI/360),X=e.pitch-e.kick,ct=Math.sin(X),vt=Math.cos(X),Ut=1.72+ct*.12,jt=vt*.12,Bt=mw*J/gw,ue=this.sightH[n.current]*Bt;this.adsPos.set(0,Ut-ct*gp-vt*ue,jt-vt*gp+ct*ue),this.pivot.position.lerp(this.adsPos.add(this.tmpV.set(this.swayX*.05,x*.15+m*.5,b*.4)),U),this.pivot.rotation.x+=(-X+v*.5-this.pivot.rotation.x)*U,this.pivot.rotation.y*=1-U,this.pivot.rotation.z*=1-U,this.pivot.scale.setScalar(lt+(Bt-lt)*U)}else this.pivot.scale.setScalar(lt);const gt=Math.PI/2+K+v-A+this.swayY*.8,[At,Vt]=this.model.arms;if(Vt.rotation.set(gt,0,-.5+this.swayX),At.rotation.set(gt,0,.95+this.swayX*.6),this.flashT>0){this.flashT-=t;const U=Math.max(0,this.flashT/xp);this.flashMats.forEach(J=>J.opacity=U),this.light.intensity*=.55,this.flashT<=0&&(this.flash.visible=!1,this.light.intensity=0)}const oe=e.iframes>0&&!e.dead&&Math.floor(e.iframes*24)%2===0,P=e.dashT>0;for(const U of this.model.mats)U.transparent=!0,U.opacity=oe?.4:P?.65:1}animateMag(t,e,n){const s=t.obj;if(e<=0){s.visible=!0,s.position.copy(t.rest),s.rotation.copy(t.restRot);return}const o=_o(e,.12,.34),r=_o(e,.55,.78),a=o*(1-r);s.visible=!(e>.34&&e<.5);const c=n==="smg"?.34:.22;s.position.set(t.rest.x,t.rest.y-c*a,t.rest.z+.05*a),s.rotation.set(t.restRot.x+.5*a,t.restRot.y,t.restRot.z)}animateBolt(t,e){const n=t.obj;if(e<=0||e>=1){n.position.copy(t.rest),n.rotation.copy(t.restRot);return}const s=_o(e,0,.2)*(1-_o(e,.8,1)),o=_o(e,.2,.5)*(1-_o(e,.5,.8));n.rotation.z=t.restRot.z-1*s,n.position.set(t.rest.x,t.rest.y,t.rest.z+.1*o)}}function bw(i){return Ch().player}const Wa=new L;function Mw(i,t,e,n){Wa.set(t.x,t.y+.25,t.z).project(i),!(Wa.z>1)&&Je.damageNumber((Wa.x*.5+.5)*innerWidth,(-Wa.y*.5+.5)*innerHeight,e,n)}const uc={combat:!0};let _w=null;function Ch(){return _w??(_w=new W_)}const ww={x:st.core.x,z:st.core.z,r:3.4},Hl=[],Gl=[];function Sw(){Gl.length=0;for(const i of Ue)!i.owner&&i.r<=3&&Gl.push(i);return Gl}function Ew(){return Hl.length=0,Hl.push(ww,...Ue),Hl}const zo={sensitivity:1,fov:75};let fc=null;H.on("settings:change",i=>{zo.sensitivity=i.sensitivity,zo.fov=i.fov,fc=i.thirdPerson});const vp=["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6"];let wo,Yi,Je,Te,yp=!1,ji=0,bp=!1,Vl=!1,$a=0,Mp="",Wl=0,Ms=2,wr=0;const Tw=x_(Math.random()*2**32>>>0),Aw=new L,Cw=new L,_p=new L,wp={init(i){addEventListener("keydown",s=>{s.code==="F3"&&s.preventDefault()}),Im(),wo=new yw(i.scene),Yi=new q_(i.scene);const t=Ch(),e=t.weapons;if(!uc.combat)return;Je=new K_,new Ah,Te=new Z_(s=>H.emit("weapon:upgrade",{weapon:s}),pc);const n=()=>Te==null?void 0:Te.refresh();H.on("state:changed",n),H.on("weapon:upgraded",()=>{n(),Je.setWeapon(e.current,e.ammo[e.current],Hn(e,w.stats),w.weapons)}),H.on("weapon:switched",()=>Je.setWeapon(e.current,e.ammo[e.current],Hn(e,w.stats),w.weapons)),H.on("run:start",()=>{Te!=null&&Te.open&&pc()}),H.on("run:over",()=>{Te!=null&&Te.open&&(Te.show(!1),H.emit("ui:modal",{open:!1}))}),addEventListener("keydown",s=>{s.code==="Escape"&&(Te!=null&&Te.open)&&pc()}),Je.setWeapon(e.current,e.ammo[e.current],Hn(e,w.stats),w.weapons),H.on("player:hp",s=>Je.setHp(s.hp,s.maxHp)),H.on("enemy:newType",s=>Je.newEnemy(s.name)),Je.setHp(t.player.hp,t.player.maxHp)},update(i,t){const e=Ch(),n=e.player,s=e.weapons,o=w.mode==="play"&&w.phase!=="ended",r=it.keys,a=he[s.current].scope&&n.aimT>.5,c=t.camera.fov>0?Math.min(1,Math.tan(t.camera.fov*Math.PI/360)/Math.tan(zo.fov*Math.PI/360)):1;bp&&!it.locked&&(Vl=!0),bp=it.locked,it.mouseRightDown||(Vl=!1),s.current!==Mp&&(Mp=s.current,$a=.25),$a=Math.max(0,$a-i);const l=!Vl&&$a<=0&&s.reloadLeft<=0&&n.dashT<=0&&!n.dead,d=document.activeElement,h=!!d&&(d.tagName==="INPUT"||d.tagName==="TEXTAREA"||d.isContentEditable),u=it.mouseDown||r.has("Space")&&!h&&!(Te!=null&&Te.open),f={forward:o?(r.has("KeyW")?1:0)-(r.has("KeyS")?1:0):0,strafe:o?(r.has("KeyD")?1:0)-(r.has("KeyA")?1:0):0,lookDx:w.mode==="play"?it.dx*c*zo.sensitivity:0,lookDy:w.mode==="play"?it.dy*c*zo.sensitivity:0,dash:o&&!a&&it.pressed.has("ShiftLeft"),aim:o&&l&&it.mouseRightDown,fire:o&&u,firePressed:o&&u&&!yp,reload:o&&it.pressed.has("KeyR"),slot:null,toggleView:fc!==null&&fc!==e.player.thirdPerson};yp=u,fc=null,it.pressed.has("F3")&&Cc({thirdPerson:!e.player.thirdPerson}),Te&&it.pressed.has("KeyV")&&(w.mode==="play"||Te.open)&&Rw();for(let b=0;b<vp.length;b++)it.pressed.has(vp[b])&&(f.slot=b);const g=e.update(i,f,{zombies:ki,collide:lu,camBlockers:Ew(),walls:Sw(),baseFov:zo.fov,groundY:hn,rng:Tw,canShoot:o,combat:uc.combat}),x=t.camera;if(x.fov=g.pose.fov,x.updateProjectionMatrix(),ji=Math.max(0,ji-i*6),x.position.set(g.pose.pos.x,g.pose.pos.y,g.pose.pos.z),x.lookAt(x.position.x+g.pose.dir.x,x.position.y+g.pose.dir.y,x.position.z+g.pose.dir.z),Wl+=i,a&&r.has("ShiftLeft")&&Ms>0?(Ms=Math.max(0,Ms-i),wr=1):(wr=0,r.has("ShiftLeft")||(Ms=Math.min(2,Ms+i*.5))),a){const b=.3*Math.PI/180*(wr?.08:Ms<=0?1.8:1);x.rotateY(Math.sin(Wl*Math.PI)*b),x.rotateX(Math.sin(Wl*Math.PI*2)*b*.5)}window.dispatchEvent(new CustomEvent("player:aimstate",{detail:{aim:o&&n.aiming,scoped:o&&a,hold:o&&wr===1}}));const p=Math.min(3,ji)*.005*(x.fov*Math.PI/180);if(x.rotateX((Math.random()-.5)*2*p),x.rotateY((Math.random()-.5)*2*p),t.aimDir.set(g.pose.dir.x,g.pose.dir.y,g.pose.dir.z),t.world.sun.position.set(n.x+30,50,n.z+20),t.world.sun.target.position.set(n.x,0,n.z),wo.update(i,n,s,g.pose.fov),!uc.combat)return;if(g.shot){const b=he[g.shot.weapon];wo.fired(s);const v=wo.muzzleWorld(s,Aw),I=wo.muzzleDir(s,Cw);ji=Math.min(3,ji+1),Yi.sparks(v,I,b.pellets>1?6:3),wo.ejectWorld(s,_p),b.kind!=="revolver"&&Yi.casing(_p,Math.cos(n.yaw),-Math.sin(n.yaw),b.kind==="shotgun",b.kind==="sniper"||b.kind==="rifle"?1.3:1);let T=null;for(const A of g.shot.pellets)if(Yi.tracer(v,A.end,b.tracer,b.kind==="shotgun"?.025:b.kind==="sniper"?.07:.04,b.kind==="sniper"?400:220),A.kind==="zombie"){Yi.blood(A.end,{x:-g.pose.dir.x,y:0,z:-g.pose.dir.z},A.kill?12:5);for(const C of A.also)Yi.blood(C,{x:-g.pose.dir.x,y:0,z:-g.pose.dir.z},C.kill?10:4);A.kill?T="kill":A.headshot&&T!=="kill"?T="head":T||(T="hit"),Mw(x,A.end,A.dmg,A.headshot)}else A.kind==="ground"&&Yi.impact(A.end);T&&Je.hitmarker(T)}if((g.switched||g.reloadDone||g.reloadStarted||g.shot)&&Je.setWeapon(s.current,s.ammo[s.current],Hn(s,w.stats),w.weapons),g.hurt){Je.hurt(Math.min(.4,g.hurt.dmg/60));const b=Math.atan2(g.hurt.fromX-n.x,-(g.hurt.fromZ-n.z))-Math.atan2(g.pose.dir.x,-g.pose.dir.z);(g.hurt.fromX!==n.x||g.hurt.fromZ!==n.z)&&Je.hurtFrom(b),ji=Math.min(3,ji+1.5)}g.died&&(ji=3),Yi.update(i);const m=e.spreadNow(),_=Math.tan(m)/Math.tan(g.pose.fov*Math.PI/360)*(innerHeight/2);Je.setScope(n.aimT,he[s.current].scope,wr>0,Ms),Je.setSpread(Math.min(80,_),!n.dead),Je.setReload(s.reloadLeft>0?1-s.reloadLeft/s.reloadTotal:null),Je.setLowHp(!n.dead&&n.hp/n.maxHp<=.3),Je.setDash(n.dashCd>0?1-n.dashCd/w.stats.dashCd:1)}};function Rw(){var i;if(Te){if(Te.open)return pc();Te.show(!0),w.mode="modal",it.modalOpen=!0,(i=document.exitPointerLock)==null||i.call(document),H.emit("ui:modal",{open:!0})}}function pc(){Te==null||Te.show(!1),w.phase!=="ended"&&(w.mode="play",it.modalOpen=!1,H.emit("ui:modal",{open:!1}))}function kw(i,t){const e=Cm(i);l_(i);const n=bw(e.scene),s={world:e,scene:e.scene,camera:e.camera,player:n,aimDir:new L(0,0,-1)};t.forEach(u=>{var f;return(f=u.init)==null?void 0:f.call(u,s)});const o=document.getElementById("pauseBanner"),r=document.getElementById("lockHint");i.addEventListener("mousedown",()=>{it.paused=!1,it.locked||c_(i)});let a=0,c=null;const l=8e3;addEventListener("keydown",u=>{if(u.code!=="F1"||(u.preventDefault(),u.repeat))return;c=!(r?!r.classList.contains("gone"):!1)});const d=new MM;function h(){const u=Math.min(.05,d.getDelta());if(o&&(o.style.display=it.paused?"block":"none"),r){const f=!it.paused&&!document.body.classList.contains("titleOn");r.style.display=f?"block":"none";const g=performance.now();f&&!a&&(a=g);const x=a>0&&g-a>l;r.classList.toggle("gone",c===null?x:!c)}if(!it.paused){u_(u);for(const f of t)f.update(u,s)}e.renderer.render(e.scene,e.camera),f_(),requestAnimationFrame(h)}return h(),s}const uu=new Set,Jr=i=>uu.add(i),fu=i=>uu.delete(i);let Fn=null,Sp=null;const Ep={update(i,t){var r,a;const{x:e,z:n}=t.player;Fn=null;let s=1/0;for(const c of uu){const l=Math.hypot(c.x-e,c.z-n);l<=c.range&&l<s&&c.label()!==null&&(s=l,Fn=c)}const o=(Fn==null?void 0:Fn.label())??null;o!==Sp&&(Sp=o,H.emit("interact:prompt",{text:o})),Fn&&(it.pressed.has("KeyE")&&((r=Fn.press)==null||r.call(Fn)),it.keys.has("KeyE")&&((a=Fn.hold)==null||a.call(Fn,i)))}};function Pw(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}const mc=(i,t,e)=>t+(e-t)*i(),Bm=(i,t,e)=>t+Math.floor(i()*(e-t+1));function Lw(i,t,e){const n=e.x-t.x,s=e.z-t.z,o=n*n+s*s,r=o===0?0:Math.max(0,Math.min(1,((i.x-t.x)*n+(i.z-t.z)*s)/o));return Math.hypot(i.x-(t.x+n*r),i.z-(t.z+s*r))}function Dw(i,t){const e=vm,n=t.half-e.edgeMargin,s=t.buildRadius+e.baseMargin,o=[];let r=1;const a=(h,u,f)=>{if(Math.abs(h)>n||Math.abs(u)>n||Math.hypot(h-t.core.x,u-t.core.z)<s+f||Math.hypot(h-t.playerStart.x,u-t.playerStart.z)<e.startClear+f)return!1;for(const g of t.lanes)for(let x=0;x+1<g.waypoints.length;x++)if(Lw({x:h,z:u},g.waypoints[x],g.waypoints[x+1])<e.laneHalfWidth+f)return!1;for(const g of o)if(Math.hypot(h-g.x,u-g.z)<g.r+f+e.gap)return!1;return!0},c=(h,u,f,g,x)=>{const p=jr[h],m=p.radius*x;return a(u,f,m)?(o.push({id:r++,kind:h,res:p.res,x:u,z:f,yaw:i()*Math.PI*2,scale:x,variant:i(),r:m,zone:g,state:"ready",progress:0,idle:99,hitT:0,respawnT:0}),!0):!1},l=()=>mc(i,.85,1.25);if(t.resourceNodes.length>0){for(const h of t.resourceNodes){const u=jr[h.kind],f=l();o.push({id:r++,kind:h.kind,res:u.res,x:h.x,z:h.z,yaw:i()*Math.PI*2,scale:f,variant:i(),r:u.radius*f,zone:h.zone,state:"ready",progress:0,idle:99,hitT:0,respawnT:0})}return o}for(const h of t.zones){const u=_M[h.kind];if(!u)continue;const f=Math.PI*h.r*h.r/100;for(const g of Zf){const x=Math.round((u[g]??0)*f);for(let p=0;p<x;p++)for(let m=0;m<e.tries;m++){const _=i()*Math.PI*2,b=h.r*Math.pow(i(),.5+e.zoneBias);if(c(g,h.x+Math.cos(_)*b,h.z+Math.sin(_)*b,h.id,l()))break}}}const d=(t.half*2)**2/1e4;for(const h of Zf){const u=Math.round((wM[h]??0)*d);for(let f=0;f<u;f++)for(let g=0;g<e.tries&&!c(h,mc(i,-n,n),mc(i,-n,n),"",l());g++);}return o}function Iw(i,t){return{nodes:Dw(i,t),events:[]}}function zw(i,t){for(const e of i.nodes)e.idle+=t,e.state==="depleted"?(e.respawnT-=t,e.respawnT<=0&&(e.state="ready",e.progress=0,i.events.push({t:"respawn",id:e.id}))):e.progress>0&&e.idle>SM&&(e.progress=Math.max(0,e.progress-EM*t))}function Tp(i,t,e,n,s,o){if(t.state!=="ready")return null;const r=jr[t.kind];if(t.idle=0,t.progress+=e*n/r.work,t.hitT-=e,t.hitT<=0&&(t.hitT=.26,i.events.push({t:"hit",id:t.id})),t.progress<1)return null;const a=o()<s,c=Bm(o,r.yieldMin,r.yieldMax)+(a?1:0);return t.state="depleted",t.progress=0,t.respawnT=mc(o,r.respawnMin,r.respawnMax),i.events.push({t:"done",id:t.id,res:t.res,amount:c,extra:a}),{id:t.id,res:t.res,amount:c,extra:a}}function Ap(i){return i.state==="ready"?i.r:i.r*jr[i.kind].depletedBlock}function Uw(i,t){const e=tp[i]??tp.normal;return t()>=e.chance?null:{special:e.special,amount:Bm(t,e.min,e.max)}}function Nw(i){for(const t of i.nodes)t.state="ready",t.progress=0,t.idle=99,t.hitT=0,t.respawnT=0;i.events.length=0}const Cp=new Map;function ke(i,t={}){const e=`${i}|${t.flat??!0}|${t.emissive??0}`;let n=Cp.get(e);return n||(n=new $e({color:i,flatShading:t.flat??!0,emissive:t.emissive??0}),Cp.set(e,n)),n}const Rp=new Map;function Ae(i,t){let e=Rp.get(i);return e||(e=t(),Rp.set(i,e)),e}function de(i,t,e,n=0,s=0,o=0){const r=new ot(t,e);return r.position.set(n,s,o),r.castShadow=!0,r.receiveShadow=!0,i.add(r),r}function Gn(i,t,e=.12){const n=new Dt(i),s={h:0,s:0,l:0};return n.getHSL(s),n.setHSL(s.h+(t-.5)*.04,s.s,Math.min(.9,Math.max(.05,s.l+(t-.5)*e*2))),n.getHex()}function Fw(i,t,e,n){const s=Math.sin(i*127.1+t*311.7+e*74.7+n*19.19)*43758.5453;return s-Math.floor(s)}function Vr(i,t,e=.28,n=.72){const s=new rr(i,1),o=s.attributes.position;for(let r=0;r<o.count;r++){const a=o.getX(r),c=o.getY(r),l=o.getZ(r),d=1+(Fw(Math.round(a*50),Math.round(c*50),Math.round(l*50),t)-.5)*2*e;o.setXYZ(r,a*d,c*d*n,l*d)}return s.computeVertexNormals(),s}function Ow(i){const t=new _t,e=new _t,n=new _t;t.add(n,e);const s=i.variant,o=ke(Gn(7031339,s));if(de(n,Ae("stump",()=>new ae(.26,.34,.42,8)),o,0,.21,0),de(n,Ae("stumpTop",()=>new ae(.22,.22,.04,8)),ke(13806706),0,.43,0),s<.62)return de(e,Ae("pineTrunk",()=>new ae(.15,.27,1.7,7)),o,0,1.7/2,0),[[1.55,1.9,2],[1.22,1.7,3],[.88,1.5,3.9]].forEach(([h,u,f],g)=>{const x=Gn(3107642,s*.8+g*.07,.1);de(e,Ae(`cone${h}`,()=>new fi(h,u,8)),ke(x),0,f,0).rotation.y=g*.6}),{root:t,ready:e,always:n,top:5.2,chips:[7031339,3107642,13214314]};de(e,Ae("oakTrunk",()=>new ae(.2,.32,2.1,7)),o,0,1.05,0);const a=Gn(5805631,s,.1);return[[0,2.9,0,1.35],[.8,2.5,.3,.95],[-.7,2.6,-.4,1],[.1,3.5,.2,.85]].forEach(([l,d,h,u],f)=>de(e,Ae(`blob${u}`,()=>new rr(u,1)),ke(Gn(a,s+f*.09,.06)),l,d,h)),{root:t,ready:e,always:n,top:4.9,chips:[7031339,5805631,13214314]}}function Bw(i){const t=new _t,e=new _t,n=new _t;t.add(n,e);const s=i.variant,o=Math.floor(s*1e3),r=Gn(9277590,s,.08);for(let a=0;a<3;a++){const c=a*2.1+s*6,l=.45+a%2*.15;de(n,Vr(.28+a*.05,o+a,.3,.7),ke(Gn(7830144,s+a*.1)),Math.cos(c)*l,.12,Math.sin(c)*l)}return de(e,Vr(1.1,o),ke(r),0,.62,0),de(e,Vr(.65,o+7),ke(Gn(r,s+.2,.08)),.85,.3,.35),s>.45&&de(e,Ae("moss",()=>new Dn(.5,8,5)),ke(6061370),-.15,1.08,.1).scale.set(1,.28,.9),{root:t,ready:e,always:n,top:2.3,chips:[10132899,8224903,12172482]}}function Hw(i){const t=new _t,e=new _t,n=new _t;t.add(n,e);const s=i.variant,o=Math.floor(s*1e3)+33;for(let c=0;c<3;c++){const l=c*2.3+s*5;de(n,Vr(.26+c*.04,o+c,.3,.7),ke(4540495),Math.cos(l)*.5,.11,Math.sin(l)*.5)}de(e,Vr(1.05,o),ke(Gn(4935255,s,.05)),0,.58,0);for(let c=0;c<3;c++){const l=c*2.1+s*3;de(e,Ae("rust",()=>new Lt(.5,.14,.32)),ke(10115626),Math.cos(l)*.82,.55+c*.12,Math.sin(l)*.82).rotation.set(.2*c,-l,.4)}const r=ke(10467535,{emissive:1911866}),a=[[.15,1.15,.1,.9,.12],[-.45,.95,.35,.65,-.3],[.5,.95,-.3,.7,.35],[-.2,.85,-.55,.55,-.15]];for(const[c,l,d,h,u]of a){const f=de(e,Ae(`crys${h}`,()=>new Ln(.2,0)),r,c,l,d);f.scale.set(1,h*3.2,1),f.rotation.z=u,f.rotation.x=u*.6}return{root:t,ready:e,always:n,top:2.4,chips:[4935255,12043472,12743482]}}function Gw(i){const t=new _t,e=new _t,n=new _t;t.add(n,e);const s=i.variant;for(let c=0;c<4;c++){const l=c*1.6+s*6;de(n,Ae("sprout",()=>new fi(.06,.28,5)),ke(8303450),Math.cos(l)*.22,.14,Math.sin(l)*.22)}const o=Gn(5216838,s,.08);[[0,.42,0,.55],[.38,.3,.12,.38],[-.34,.3,-.1,.4],[.05,.3,-.38,.36],[-.1,.32,.4,.35]].forEach(([c,l,d,h],u)=>de(e,Ae(`puff${h}`,()=>new rr(h,1)),ke(Gn(o,s+u*.12,.07)),c,l,d));const a=s>.5?[16765670,16777215,16752327]:[16773258,16777215,16761677];for(let c=0;c<7;c++){const l=c*.9+s*4,d=.35+c%3*.12;de(e,Ae("flower",()=>new Dn(.075,6,4)),ke(a[c%3],{flat:!1}),Math.cos(l)*.46,d+.18,Math.sin(l)*.46)}return{root:t,ready:e,always:n,top:1.5,chips:[5216838,9359466,16765670]}}function Vw(i){const t=new _t,e=new _t,n=new _t;t.add(n,e);const s=i.variant,o=ke(Gn([9062966,6254458,8022586,7031386][Math.floor(s*4)%4],s,.06)),r=ke(2303531),a=ke(6965802);n.rotation.z=.05,de(n,Ae("chassis",()=>new Lt(3.1,.62,1.45)),o,0,.62,0),de(n,Ae("cabin",()=>new Lt(1.6,.62,1.3)),o,-.2,1.22,0),de(n,Ae("glass",()=>new Lt(1.5,.4,1.34)),r,-.2,1.24,0),de(n,Ae("roof",()=>new Lt(1.45,.08,1.2)),o,-.2,1.57,0),de(n,Ae("rustPatch",()=>new Lt(.9,.05,.6)),a,.8,.96,.2),de(n,Ae("axle",()=>new Lt(2.2,.12,.2)),r,0,.3,0);const c=Ae("wheel",()=>new ae(.38,.38,.28,10)),l=ke(1710878);de(n,c,l,-1,.38,.78).rotation.x=Math.PI/2;for(const[h,u]of[[1,.78],[1,-.78],[-1,-.78]])de(e,c,l,h,.38,u).rotation.x=Math.PI/2;const d=de(e,Ae("hood",()=>new Lt(1.1,.07,1.3)),ke(Gn(8028037,s,.05)),1,1.1,0);return d.rotation.z=-.5,d.position.x=1.25,de(e,Ae("door",()=>new Lt(.9,.55,.07)),o,-.2,.9,.8).rotation.x=-.4,de(e,Ae("engine",()=>new Lt(.7,.4,.7)),ke(4869975),1,.98,0),de(e,Ae("pipe",()=>new ae(.07,.07,.9,6)),ke(10134187),.55,1,-.4).rotation.z=1.3,de(e,Ae("gear",()=>new ae(.22,.22,.08,8)),ke(12034634,{flat:!1}),1.35,1.06,.35),{root:t,ready:e,always:n,top:2.6,chips:[6965802,9080726,2829617]}}const Ww={tree:Ow,rock:Bw,iron:Hw,herb:Gw,wreck:Vw};function $w(i){const t=Ww[i.kind](i);return t.root.position.set(i.x,0,i.z),t.root.rotation.y=i.yaw,t.root.scale.setScalar(i.scale),t}const Xw={wood:"#e0b070",stone:"#c9ccd2",iron:"#9fc4e6",herb:"#8fe07a",parts:"#f0c050"},kp=i=>1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2),$l=i=>i*i;function qw(i,t,e){const n=new Map,s=new _t;i.add(s);for(const T of t.nodes){const A=$w(T);A.root.position.y=e(T.x,T.z),s.add(A.root);const C={node:T,model:A,anim:{kind:"none"},shake:0,seed:T.variant*100};T.state==="depleted"&&(A.ready.visible=!1),n.set(T.id,C)}const o=new ot(new mi(.92,1,40),new kt({color:16774064,transparent:!0,opacity:.8,side:be,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.visible=!1,s.add(o);const r=new _t,a=new ot(new wn(1.4,.2),new kt({color:724240,transparent:!0,opacity:.7,depthTest:!1})),c=new kt({color:16765530,depthTest:!1}),l=new ot(new wn(1.32,.12),c);l.geometry.translate(.66,0,0),l.position.set(-.66,0,.001),a.renderOrder=998,l.renderOrder=999,r.add(a,l),r.visible=!1,s.add(r);const d=new Lt(.13,.13,.13),h=[],u=[];for(let T=0;T<80;T++){const A=new ot(d,new $e({color:16777215}));A.visible=!1,A.castShadow=!0,s.add(A),u.push({mesh:A,vx:0,vy:0,vz:0,life:0,max:1,spin:0})}function f(T,A,C,y,M,R){for(let z=0;z<M;z++){const D=u.pop();if(!D)return;const V=Math.random()*Math.PI*2,K=(.4+Math.random())*R;D.vx=Math.cos(V)*K,D.vz=Math.sin(V)*K,D.vy=(1.2+Math.random()*2.2)*(R/3),D.life=D.max=.5+Math.random()*.4,D.spin=(Math.random()-.5)*14,D.mesh.material.color.setHex(y[Math.random()*y.length|0]),D.mesh.position.set(T,A,C),D.mesh.scale.setScalar(.6+Math.random()*.9),D.mesh.visible=!0,h.push(D)}}const g=new Map;function x(T,A){const C=T+A;let y=g.get(C);if(y)return y;const M=document.createElement("canvas");M.width=384,M.height=96;const R=M.getContext("2d");return R.font='800 54px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',R.textAlign="center",R.textBaseline="middle",R.lineWidth=10,R.strokeStyle="rgba(10,12,16,0.85)",R.lineJoin="round",R.strokeText(T,192,50),R.fillStyle=A,R.fillText(T,192,50),y=new or(M),y.colorSpace=mn,g.set(C,y),y}const p=[];function m(T,A,C,y,M){const R=new tu({map:x(y,M),transparent:!0,depthTest:!1}),z=new rm(R);z.scale.set(3,.75,1),z.position.set(T,A,C),z.renderOrder=1e3,s.add(z),p.push({sprite:z,life:1.2,max:1.2,y0:A})}let _=0;function b(T){const A=n.get(T.id);if(!A)return;const C=A.node,y=A.model,M=e(C.x,C.z);T.t==="hit"?(A.shake=.22,f(C.x,M+y.top*C.scale*.35,C.z,y.chips,3,2.6)):T.t==="done"?(A.anim={kind:"fall",t:0,dir:Math.random()*Math.PI*2},f(C.x,M+y.top*C.scale*.4,C.z,y.chips,16,4.2),m(C.x,M+y.top*C.scale+.6,C.z,`+${T.amount} ${dn[T.res]}${T.extra?" 보너스":""}`,Xw[T.res])):T.t==="respawn"&&(A.anim={kind:"grow",t:0},y.ready.visible=!0,y.ready.scale.setScalar(.001))}function v(T,A,C){const y=T.model.ready,M=T.node,R=T.anim;if(T.shake=Math.max(0,T.shake-A),R.kind==="fall"){R.t+=A;const z=M.kind==="tree"?.7:.28,D=.22;if(M.kind==="tree"){const V=Math.min(1,R.t/z);y.rotation.set(Math.cos(R.dir)*$l(V)*1.45,0,Math.sin(R.dir)*$l(V)*1.45),y.rotation.order="YXZ"}else{const V=Math.min(1,R.t/z);y.scale.setScalar(1-$l(V)),y.position.y=Math.sin(V*Math.PI)*.25}R.t>z+(M.kind==="tree"?D:0)?(y.visible=!1,y.rotation.set(0,0,0),y.position.y=0,y.scale.setScalar(1),T.anim={kind:"none"}):M.kind==="tree"&&R.t>z&&y.scale.setScalar(Math.max(.001,1-(R.t-z)/D));return}if(R.kind==="grow"){R.t+=A;const z=Math.min(1,R.t/.9);y.scale.setScalar(Math.max(.001,kp(z))),z>=1&&(y.scale.setScalar(1),T.anim={kind:"none"});return}if(y.visible)if(T.shake>0){const z=T.shake/.22,D=Math.sin(_*70+T.seed)*.05*z;y.rotation.z=D,y.rotation.x=Math.cos(_*63+T.seed)*.03*z,y.scale.set(1+.04*z,1-.06*z,1+.04*z)}else{const z=M.kind==="tree"||M.kind==="herb"?Math.sin(_*.9+T.seed)*(M.kind==="tree"?.012:.02):0;y.rotation.set(0,0,z),y.scale.setScalar(1)}}const I=new L;return{floatText:m,reset(){for(const T of n.values()){const A=T.model.ready;T.anim={kind:"none"},T.shake=0,A.visible=!0,A.scale.setScalar(1),A.rotation.set(0,0,0),A.position.y=0}},update(T,A,C,y,M){_+=T;for(const z of M)b(z);for(const z of n.values()){const D=z.node,V=(D.x-C.x)**2+(D.z-C.z)**2>Jf*Jf;z.model.root.visible=!V,!(V&&z.anim.kind==="none")&&v(z,T,z===(y?n.get(y.id):void 0))}const R=y?n.get(y.id):void 0;if(y&&R&&y.state==="ready"){const z=e(y.x,y.z);o.visible=!0,o.position.set(y.x,z+.06,y.z);const D=y.r+.55+Math.sin(_*4)*.05;if(o.scale.set(D,D,1),o.material.color.set(y.progress>0?16765530:16774064),y.progress>.005){r.visible=!0,r.position.set(y.x,z+R.model.top*y.scale+.5,y.z),A.getWorldPosition(I),r.quaternion.copy(A.quaternion),l.scale.x=Math.max(.001,Math.min(1,y.progress)),c.color.setHSL(.12+y.progress*.2,.9,.58);const V=Math.max(1,I.distanceTo(r.position)/9);r.scale.setScalar(V)}else r.visible=!1}else o.visible=!1,r.visible=!1;for(let z=h.length-1;z>=0;z--){const D=h[z];if(D.life-=T,D.life<=0){D.mesh.visible=!1,h.splice(z,1),u.push(D);continue}D.vy-=12*T,D.mesh.position.x+=D.vx*T,D.mesh.position.z+=D.vz*T,D.mesh.position.y+=D.vy*T,D.mesh.position.y<.07&&(D.mesh.position.y=.07,D.vy*=-.3,D.vx*=.6,D.vz*=.6),D.mesh.rotation.x+=D.spin*T,D.mesh.rotation.z+=D.spin*.7*T,D.mesh.scale.multiplyScalar(1-.5*T/D.max)}for(let z=p.length-1;z>=0;z--){const D=p[z];D.life-=T;const V=1-D.life/D.max;D.sprite.position.y=D.y0+kp(Math.min(1,V*1.6))*.9+V*.5,D.sprite.material.opacity=V<.7?1:1-(V-.7)/.3,D.life<=0&&(s.remove(D.sprite),D.sprite.material.dispose(),p.splice(z,1))}},dispose(){i.remove(s),g.forEach(T=>T.dispose())}}}let On,Sr,So;const Xl=[],ql=[];let Xa=!1;const Yl=new Map,jl=Math.random;function Yw(i,t){km(i,t),H.emit("resource:gathered",{res:i,amount:t})}const jw={init(i){Xa=!0,On=Iw(Pw(vm.seed),st),Yl.clear(),On.nodes.forEach(t=>Yl.set(t.id,t)),Sr=qw(i.scene,On,hn),So=new Map;for(const t of On.nodes){const e=jr[t.kind],n={x:t.x,z:t.z,r:Ap(t)};Ue.push(n),So.set(t.id,n);const s={x:t.x,z:t.z,range:t.r+Qf,label:()=>t.state==="ready"&&w.mode==="play"&&w.phase!=="ended"?`E 길게 눌러 ${e.verb}`:null,hold:r=>{const a=Tp(On,t,r,w.stats.gatherSpeed,w.stats.gatherExtra,jl);a&&Yw(a.res,a.amount)}};Jr(s),Xl.push(s);const o={id:t.id,kind:t.kind,res:t.res,x:t.x,z:t.z,radius:t.r,get ready(){return t.state==="ready"},harvest:(r,a)=>{const c=Tp(On,t,r,a,w.stats.gatherExtra,jl);return c?{res:c.res,amount:c.amount}:null}};ql.push(o)}H.on("run:start",()=>{Xa&&(Nw(On),Sr.reset())}),H.on("enemy:killed",t=>{if(!Xa)return;const e=Uw(t.type,jl);e&&(e.special?w.samplesSp+=e.amount:w.samples+=e.amount,ie(),H.emit("resource:gathered",{res:e.special?"samplesSp":"samples",amount:e.amount}),Sr.floatText(t.x,1.9,t.z,`+${e.amount} ${e.special?"특수 샘플":"샘플"}`,e.special?"#e58cff":"#8fe8d0"))})},update(i,t){var o;zw(On,i);const e=So.get(((o=On.nodes[0])==null?void 0:o.id)??-1);if(e&&!Ue.includes(e))for(const r of So.values())Ue.push(r);for(const r of On.nodes){const a=So.get(r.id),c=Ap(r);a.r!==c&&(a.r=c)}let n=null;if(w.mode==="play"){let r=1/0;const{x:a,z:c}=t.player;for(const l of On.nodes){if(l.state!=="ready")continue;const d=Math.hypot(l.x-a,l.z-c);d<=l.r+Qf&&d<r&&(r=d,n=l)}}const s=On.events;for(const r of s)if(r.t==="hit"){const a=Yl.get(r.id);a&&H.emit("gather:hit",{kind:a.kind})}Sr.update(i,t.camera,t.player,n,s),s.length=0},dispose(){for(const i of Xl)fu(i);for(const i of So.values()){const t=Ue.indexOf(i);t>=0&&Ue.splice(t,1)}for(const i of ql);Xl.length=0,ql.length=0,Xa=!1,Sr.dispose()}},Kl=1.07;class Kw{constructor(t,e,n,s,o,r,a=!1){var h,u,f;this.sink=t,this.id=Zr(),this.yaw=0,this.hitY=0,this.provoked=!1,this.dead=!1,this.stunned=!1,this.state="spawn",this.stateT=.8,this.atkT=0,this.stunT=0,this.rage=!1,this.hitFlash=0,this.wp=0,this.retargetT=0,this.target=null,this.moveSpeed=0,this.move="none",this.phase=0,this.abilityCd=2,this.frenzy=0,this.fuseT=0,this.exploded=!1,this.elite=!1,this.armor=0,this.sx=0,this.sz=0,this.tx=0,this.tz=0,this.aimX=0,this.aimZ=0,this.moveT=0,this.moveCd=3,this.chargeDx=0,this.chargeDz=0,this.summonCd=12,this.converted=!1,this.waveZombie=!0,this.offset=0,this.wanderX=0,this.wanderZ=0,this.hitOnce=!1;const c=Mm(n,e),l=ei[e];this.type=e,this.wave=n,this.x=s,this.z=o,this.lane=r,this.elite=a;const d=a?Is:{hp:1,dmg:1,scale:1};this.hp=this.maxHp=Math.round(c.hp*d.hp),this.speed=c.speed,this.dmg=c.dmg*d.dmg,this.scale=c.scale*d.scale,this.radius=l.radius*d.scale,this.height=l.height*d.scale,this.baseHitR=(((h=l.hit)==null?void 0:h.r)??l.radius)*d.scale,this.baseHitH=(((u=l.hit)==null?void 0:u.h)??l.height)*d.scale,this.baseHeadFrac=((f=l.hit)==null?void 0:f.headFrac)??.78,this.atkCd=l.atkCd,this.armor=l.armor??0}get hitH(){const t=this.pose();return t?t.h*this.scale*Kl:(this.stunned?this.baseHitH*.72:this.baseHitH)*Kl}get headFrac(){return this.stunned?.7:this.baseHeadFrac}pose(){const t=ei[this.type].prone;return t?this.stunned?t.stun:t:null}fwd(t){return{x:this.x-Math.sin(this.yaw)*t*this.scale,z:this.z-Math.cos(this.yaw)*t*this.scale}}get hitR(){const t=this.pose();return(t?t.r*this.scale:this.baseHitR)*Kl}get hitX(){const t=this.pose();return t?this.fwd(t.fwd).x:this.x}get hitZ(){const t=this.pose();return t?this.fwd(t.fwd).z:this.z}get headAt(){const t=this.pose();if(!t)return;const e=this.fwd(t.head.f);return{x:e.x,y:this.hitY+t.head.y*this.scale,z:e.z,r:t.head.r*this.scale}}get isBoss(){return UM(this.type)}hit(t,e){this.dead||this.sink.damaged(this,t,e)}}const Er=Math.PI*2,Ki=(i,t)=>Math.atan2(-i,-t);class Zw{constructor(t){this.deps=t,this.fx=[],this.gases=[],this.projs=[],this.list=[],this.roamTimer=0;const e=t.player;this.playerT={get x(){return e.x},get z(){return e.z},radius:.4,get dead(){return e.hp<=0},hit(n,s=e.x,o=e.z){e.iframes<=0&&H.emit("player:hit",{dmg:n,x:s,z:o})}},this.coreFallback={x:st.core.x,z:st.core.z,radius:2.5,dead:!1,hit(n){w.coreHp<=0||(w.coreHp=Math.max(0,w.coreHp-n),H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),ie(),w.coreHp<=0&&H.emit("core:destroyed",void 0))}},H.on("zombie:converted",({id:n})=>this.onConverted(n)),H.on("zombie:inject-failed",({id:n})=>{const s=this.list.find(o=>o.id===n);s&&s.stunned&&this.wake(s)})}hasRealCore(){return!!this.core}spawn(t,e,n,s,o,r,a=!1){const c=new Kw(this,t,e,n,s,o,a);return c.yaw=Ki(st.core.x-n,st.core.z-s),c.moveCd=2.5+this.deps.rng()*2,c.abilityCd=1+this.deps.rng()*2,c.waveZombie=!r,c.offset=this.deps.rng()*2-1,r&&(c.home=r,c.state="chase",c.stateT=0),ki.push(c),this.list.push(c),this.fx.push({k:"spawn",z:c}),c}spawnOnLane(t,e,n,s=!1){const r=st.lanes[n%st.lanes.length].waypoints[0],a=this.deps.rng()*Er,c=this.deps.rng()*3;return this.spawn(t,e,r.x+Math.cos(a)*c,r.z+Math.sin(a)*c,n%st.lanes.length,void 0,s)}waveAlive(){let t=0;for(const e of this.list)e.waveZombie&&!e.dead&&t++;return t}clearAll(){for(const t of this.list)t.dead=!0,t.state="dying",this.fx.push({k:"die",z:t,byAlly:!1,silent:!0});ki.length=0,this.list.length=0,this.gases.length=0,this.projs.length=0}onConverted(t){const e=this.list.find(n=>n.id===t);e&&(this.removeFromLists(e),e.converted=!0,e.stunned=!1,this.fx.push({k:"converted",z:e}))}damaged(t,e,n){if(t.dead||t.converted)return;!n&&!t.provoked&&(t.provoked=!0,t.target=null),t.armor>0&&!t.stunned&&(e*=1-t.armor);const s=t.hp-e;if(t.hitFlash=.14,!n&&!t.isBoss&&!t.stunned&&t.state!=="spawn"&&t.move!=="fuse"&&s<=t.maxHp*Ee.stunHpRatio&&this.deps.rng()<Ee.stunBase+w.stats.stunBonus){t.hp=Math.max(1,s),this.fx.push({k:"hit",z:t,dmg:e}),this.stun(t);return}t.hp=s,this.fx.push({k:"hit",z:t,dmg:e}),t.hp<=0&&this.kill(t,n)}removeFromLists(t){let e=ki.indexOf(t);e>=0&&ki.splice(e,1),e=this.list.indexOf(t),e>=0&&this.list.splice(e,1)}stun(t){t.stunned=!0,t.state="stunned",t.stunT=Ee.stunTime,t.target=null,t.move="none",this.fx.push({k:"stun",z:t}),H.emit("zombie:stunned",{id:t.id})}wake(t){t.stunned=!1,t.state="chase",t.rage=!0,t.atkT=.6,this.fx.push({k:"wake",z:t})}kill(t,e){t.dead=!0,t.stunned=!1,t.state="dying",this.removeFromLists(t),this.fx.push({k:"die",z:t,byAlly:e}),H.emit("enemy:killed",{x:t.x,z:t.z,type:t.type,byAlly:e});const n=FM[t.type],s=t.elite?Is.reward:1;w.gold+=n.gold*s,H.emit("xp:gain",{amount:n.xp*s,reason:"kill"}),ie(),t.type==="fatty"&&(this.gases.push({x:t.x,z:t.z,r:Ee.gasRadius,t:Ee.gasTime,tick:0,dps:Ee.gasDps,kind:"gas"}),this.fx.push({k:"gas",x:t.x,z:t.z,r:Ee.gasRadius,t:Ee.gasTime,kind:"gas"}));const o=ei[t.type].bomb;o&&!t.exploded&&this.explode(t.x,t.z,o.deathRadius,t.dmg*o.deathMul,"bomb"),t.isBoss&&(H.emit("boss:dead",{wave:t.wave,type:t.type}),t.type==="king"&&(H.emit("toast",{text:"좀비 왕을 쓰러뜨렸다! 무한 모드로 계속할 수 있다"}),H.emit("game:end",{victory:!0})))}update(t){this.core=bn.find(n=>n.kind==="core"&&!n.dead);const e=this.list.slice();for(const n of e)if(!n.dead){if(!n.waveZombie&&this.farFromPlayer(n)){n.moveSpeed=0;continue}this.updateZombie(n,t,e)}this.updateProjs(t),this.updateGas(t)}farFromPlayer(t){return Math.hypot(t.x-this.deps.player.x,t.z-this.deps.player.z)>90}coreTarget(){return this.core??this.coreFallback}ring(t,e,n,s,o){this.fx.push({k:"ring",x:t,z:e,r:n,t:s,color:o})}updateZombie(t,e,n){switch(t.hitFlash=Math.max(0,t.hitFlash-e),t.atkT-=e,t.abilityCd-=e,t.frenzy=Math.max(0,t.frenzy-e),t.moveSpeed*=.8,t.state){case"spawn":t.stateT-=e,t.stateT<=0&&(t.state="chase");return;case"stunned":if(!t.stunned){this.wake(t);return}t.stunT-=e,t.stunT<=0&&this.wake(t);return;case"windup":t.stateT-=e,t.target&&(t.yaw=Ki(t.target.x-t.x,t.target.z-t.z)),t.stateT<=0&&(this.strike(t),t.state="chase",t.atkT=t.atkCd*(t.rage?.8:1));return}if(t.move!=="none"){this.runAct(t,e);return}if(t.retargetT-=e,(t.retargetT<=0||t.target&&t.target.dead)&&(t.retargetT=.25+this.deps.rng()*.15,this.pickTarget(t)),t.isBoss&&this.bossThink(t,e)||!t.isBoss&&this.abilityThink(t))return;const s=t.target;let o,r;s?(o=s.x,r=s.z):t.waveZombie?[o,r]=this.laneGoal(t):[o,r]=this.wanderGoal(t,e);let a=o-t.x,c=r-t.z;const l=Math.hypot(a,c)||1e-6;a/=l,c/=l;const d=ei[t.type];let h=1;if(s){t.yaw=Ki(a,c);const f=l-s.radius-t.radius;if(d.keep){if(l<d.keep[0])h=-.8;else if(l<=d.keep[1])return}else{const g=Ee.reach+d.reach;if(f<=g){t.atkT<=0&&(t.state="windup",t.stateT=Ee.windup,this.fx.push({k:"swing",z:t}));return}}}else if(l<1.2)return;const u=t.speed*(t.rage?Ee.rageSpeed:1)*(t.provoked&&t.target===this.playerT?Ee.provokedSpeed:1)*(t.frenzy>0?1.4:1)*(!s&&!t.waveZombie?.45:1)*Math.abs(h);t.moveSpeed=Math.max(t.moveSpeed,u),t.x+=a*h*u*e,t.z+=c*h*u*e,h>0&&(t.yaw=Ki(a,c)),this.separate(t,n),this.blockByStructures(t,a,c),this.deps.collide(t,t.radius)}pickTarget(t){const e=t.isBoss?1.6:1;if(t.provoked&&!this.playerT.dead){t.target=this.playerT;return}if(t.waveZombie&&!t.isBoss){const a=t.target,c=!!a&&!a.dead&&bn.includes(a)&&Math.hypot(a.x-t.x,a.z-t.z)-a.radius-t.radius<1.5;t.target=c?a:t.wp>=this.laneLen(t)?this.coreTarget():null;return}const n=(t.waveZombie?Ee.aggroPlayer:Ee.roamAggro)*e;let s=null,o=1/0;const r=(a,c,l=1)=>{if(!a||a.dead)return;const d=Math.hypot(a.x-t.x,a.z-t.z)*l;d<=c&&d<o&&(o=d,s=a)};if(r(this.playerT,n,.9),r(du(Ne,t.x,t.z,Ee.aggroAlly*e),Ee.aggroAlly*e),t.waveZombie){let a,c=Ee.aggroStructure;for(const l of bn){if(l.dead||l.kind==="core")continue;const d=Math.hypot(l.x-t.x,l.z-t.z)-l.radius;d<c&&(c=d,a=l)}r(a,Ee.aggroStructure+((a==null?void 0:a.radius)??0)),!s&&t.wp>=this.laneLen(t)&&(s=this.coreTarget())}t.target=s}laneLen(t){return st.lanes[t.lane%st.lanes.length].waypoints.length}laneGoal(t){const e=st.lanes[t.lane%st.lanes.length];for(;t.wp<e.waypoints.length;){const s=e.waypoints[t.wp],o=t.offset*Ee.laneSpread,r=s.x+o,a=s.z+o*.7;if(Math.hypot(r-t.x,a-t.z)>2.5)return[r,a];t.wp++}const n=this.coreTarget();return[n.x,n.z]}wanderGoal(t,e){const n=t.home;if(!n)return[t.x,t.z];if(t.moveT-=e,t.moveT<=0||Math.hypot(t.wanderX-t.x,t.wanderZ-t.z)<1.2){t.moveT=3+this.deps.rng()*5;const s=this.deps.rng()*Er,o=Math.sqrt(this.deps.rng())*n.r;t.wanderX=n.x+Math.cos(s)*o,t.wanderZ=n.z+Math.sin(s)*o}return[t.wanderX,t.wanderZ]}separate(t,e){for(const n of e){if(n===t||n.dead)continue;const s=t.x-n.x,o=t.z-n.z,r=(t.radius+n.radius)*.85,a=s*s+o*o;if(a<r*r&&a>1e-6){const c=Math.sqrt(a),l=(r-c)*.5;t.x+=s/c*l,t.z+=o/c*l}}}blockByStructures(t,e,n){for(const s of bn){if(s.dead)continue;const o=t.x-s.x,r=t.z-s.z,a=s.radius+t.radius,c=o*o+r*r;if(c<a*a&&c>1e-6){const l=Math.sqrt(c);t.x=s.x+o/l*a,t.z=s.z+r/l*a,s.kind!=="core"&&t.waveZombie&&-(o/l)*e-r/l*n>.25&&(t.target=s)}}}strike(t){const e=t.target;!e||e.dead||Math.hypot(e.x-t.x,e.z-t.z)-e.radius-t.radius>Ee.reach*1.6+ei[t.type].reach||(e.hit(t.dmg,t.x,t.z),t.isBoss&&this.aoe(t.x,t.z,t.radius+2.2,t.dmg*.5,e))}aoe(t,e,n,s,o){const r=[this.playerT,...Ne,...bn];this.core||r.push(this.coreFallback);for(const a of r)a===o||a.dead||Math.hypot(a.x-t,a.z-e)<=n+a.radius&&a.hit(s,t,e)}explode(t,e,n,s,o){this.aoe(t,e,n,s),this.fx.push({k:"blast",x:t,z:e,r:n,kind:o})}updateGas(t){for(let e=this.gases.length-1;e>=0;e--){const n=this.gases[e];if(n.t-=t,n.tick-=t,n.tick<=0){n.tick=.5;const s=[this.playerT,...Ne];for(const o of s)!o.dead&&Math.hypot(o.x-n.x,o.z-n.z)<=n.r&&o.hit(n.dps*.5,n.x,n.z)}n.t<=0&&this.gases.splice(e,1)}}updateProjs(t){for(let e=this.projs.length-1;e>=0;e--){const n=this.projs[e];n.t-=t,!(n.t>0)&&(this.projs.splice(e,1),n.kind==="acid"?(this.explode(n.tx,n.tz,n.r,n.dmg,"acid"),n.pool>0&&(this.gases.push({x:n.tx,z:n.tz,r:n.r,t:n.pool,tick:.3,dps:n.dps,kind:"acid"}),this.fx.push({k:"gas",x:n.tx,z:n.tz,r:n.r,t:n.pool,kind:"acid"}))):this.explode(n.tx,n.tz,n.r,n.dmg,"bomb"))}}fire(t,e,n,s,o,r,a,c){this.projs.push({tx:e,tz:n,t:s,dmg:r,r:o,fly:!0,pool:a,dps:c,kind:"acid"}),this.fx.push({k:"proj",x:t.x,z:t.z,tx:e,tz:n,t:s,kind:"acid"})}abilityThink(t){const e=ei[t.type],n=t.target;if(!n)return!1;const s=Math.hypot(n.x-t.x,n.z-t.z);if(e.bomb){if(s-n.radius-t.radius<=e.bomb.range)return t.move="fuse",t.fuseT=e.bomb.fuse,t.yaw=Ki(n.x-t.x,n.z-t.z),this.ring(t.x,t.z,e.bomb.radius,e.bomb.fuse,"warn"),!0}else if(e.leap){if(t.abilityCd<=0&&s>=4&&s<=e.leap.range)return t.move="leap",t.phase=0,t.moveT=e.leap.windup,t.tx=n.x,t.tz=n.z,t.yaw=Ki(n.x-t.x,n.z-t.z),this.ring(n.x,n.z,e.leap.radius,e.leap.windup+e.leap.time,"warn"),!0}else if(e.spit&&e.keep){if(t.abilityCd<=0&&s<=e.keep[1]+1.5)return t.move="spit",t.moveT=e.spit.windup,t.aimX=n.x,t.aimZ=n.z,t.yaw=Ki(n.x-t.x,n.z-t.z),!0}else if(e.scream&&t.abilityCd<=0&&s<=30)return t.move="scream",t.moveT=e.scream.windup,this.fx.push({k:"roar",z:t}),!0;return!1}runAct(t,e){const n=ei[t.type];switch(t.moveT-=e,t.moveSpeed*=.8,t.move){case"fuse":{const s=n.bomb;t.fuseT-=e,t.fuseT<=0&&(t.exploded=!0,this.explode(t.x,t.z,s.radius,t.dmg*s.dmgMul,"bomb"),this.kill(t,!1));break}case"leap":{const s=n.leap;if(t.phase===0)t.moveT<=0&&(t.phase=1,t.moveT=s.time,t.sx=t.x,t.sz=t.z);else{const o=1-Math.max(0,t.moveT)/s.time;t.x=t.sx+(t.tx-t.sx)*o,t.z=t.sz+(t.tz-t.sz)*o,t.moveSpeed=8,t.moveT<=0&&(this.deps.collide(t,t.radius),this.explode(t.x,t.z,s.radius,t.dmg*s.dmgMul,"slam"),t.move="none",t.abilityCd=s.cd,t.atkT=.4)}break}case"spit":{const s=n.spit;t.moveT<=0&&(this.fire(t,t.aimX,t.aimZ,s.time,s.radius,t.dmg*s.dmgMul,s.pool,s.dps),t.move="none",t.abilityCd=s.cd);break}case"scream":{const s=n.scream;t.moveT<=0&&(this.doScream(t,s.radius,s.buff,s.time),this.summon(t,s.summon,s.count),t.move="none",t.abilityCd=s.cd);break}default:this.runBossAct(t,e)}}doScream(t,e,n,s){this.ring(t.x,t.z,Math.min(e,14),.7,"scream");for(const o of this.list)!o.dead&&Math.hypot(o.x-t.x,o.z-t.z)<=e&&(o.frenzy=s);this.fx.push({k:"roar",z:t})}summon(t,e,n){if(!(this.waveAlive()>=au+10))for(let s=0;s<n;s++){const o=s/n*Er+this.deps.rng(),r=this.spawn(e,Math.max(1,w.wave),t.x+Math.cos(o)*(t.radius+2.5),t.z+Math.sin(o)*(t.radius+2.5),t.lane);r.wp=this.laneLen(r),r.waveZombie=t.waveZombie}}bossThink(t,e){const n=Ll[t.type],s=t.hp<t.maxHp*.5;t.moveCd-=e,t.summonCd-=e;const o=t.target;if(t.moveCd>0||!o)return!1;const r=Math.hypot(o.x-t.x,o.z-t.z),a=h=>{switch(h){case"slam":return r<=n.slamRadius+3;case"charge":return r>=6&&r<=26;case"volley":return r>=5;case"summon":case"scream":return t.summonCd<=0;default:return!0}},c=n.moves.filter(h=>a(h.kind));if(c.length===0)return!1;let l=this.deps.rng()*c.reduce((h,u)=>h+u.w,0),d=c[0].kind;for(const h of c)if((l-=h.w)<=0){d=h.kind;break}switch(t.moveCd=n.cd[s?1:0],t.phase=0,t.yaw=Ki(o.x-t.x,o.z-t.z),t.aimX=o.x,t.aimZ=o.z,d){case"slam":t.move="slam",t.moveT=Un.slam.windup,this.ring(t.x,t.z,n.slamRadius,Un.slam.windup,"warn");break;case"charge":{t.move="charge",t.moveT=Un.charge.windup,t.chargeDx=(o.x-t.x)/r,t.chargeDz=(o.z-t.z)/r,this.fx.push({k:"roar",z:t});break}case"volley":t.move="volley",t.moveT=Un.volley.windup;break;case"bombRain":{t.move="bombRain",t.moveT=Un.bombRain.windup;const h=Un.bombRain;for(let u=0;u<h.count;u++){const f=this.deps.rng()*Er,g=u===0?0:Math.sqrt(this.deps.rng())*h.scatter,x=o.x+Math.cos(f)*g,p=o.z+Math.sin(f)*g;this.projs.push({tx:x,tz:p,t:h.windup,dmg:t.dmg*h.dmgMul,r:h.radius,fly:!1,pool:0,dps:0,kind:"bomb"}),this.ring(x,p,h.radius,h.windup,"warn")}break}case"summon":t.move="summon",t.moveT=Un.summon.windup,this.fx.push({k:"roar",z:t}),t.summonCd=n.summonCd[s?1:0];break;case"scream":t.move="scream",t.moveT=Un.scream.windup,this.fx.push({k:"roar",z:t}),t.summonCd=n.summonCd[s?1:0];break;default:return t.move="none",!1}return!0}runBossAct(t,e){const n=Ll[t.type];switch(t.move){case"slam":t.moveT<=0&&(this.explode(t.x,t.z,n.slamRadius,t.dmg*Un.slam.dmgMul,"slam"),t.move="none");break;case"charge":{const s=Un.charge;if(t.phase===0)t.moveT<=0&&(t.phase=1,t.moveT=s.time,t.hitOnce=!1);else{if(t.x+=t.chargeDx*s.speed*e,t.z+=t.chargeDz*s.speed*e,t.moveSpeed=s.speed,this.deps.collide(t,t.radius),!t.hitOnce){const o=[this.playerT,...Ne,...bn];for(const r of o)r.dead||r.kind==="core"||Math.hypot(r.x-t.x,r.z-t.z)<=t.radius+r.radius+.8&&(r.hit(t.dmg*s.dmgMul,t.x,t.z),t.hitOnce=!0)}t.moveT<=0&&(t.move="none",t.atkT=.7)}break}case"volley":if(t.moveT<=0){const s=Un.volley,o=Math.atan2(t.aimZ-t.z,t.aimX-t.x),r=Math.max(8,Math.hypot(t.aimX-t.x,t.aimZ-t.z));for(let a=0;a<s.count;a++){const c=o+(a-(s.count-1)/2)*(s.spread/(s.count-1));this.fire(t,t.x+Math.cos(c)*r,t.z+Math.sin(c)*r,s.time,s.radius,t.dmg*s.dmgMul,s.pool,s.dps)}t.move="none"}break;case"bombRain":t.moveT<=0&&(t.move="none");break;case"summon":if(t.moveT<=0){for(const s of n.summon??[])this.summon(t,s.type,s.count);t.move="none"}break;case"scream":if(t.moveT<=0){const s=Un.scream;this.doScream(t,s.radius,s.buff,s.time),t.move="none"}break;default:t.move="none"}}slamRadius(t){var e;return((e=Ll[t.type])==null?void 0:e.slamRadius)??5}updateRoamers(t){var n;if(this.roamTimer-=t,this.roamTimer>0)return;this.roamTimer=2;const e=this.deps.player;for(const s of st.zones){if(s.kind==="base"||s.danger<2)continue;const o=Ee.roamPerDanger*s.danger;let r=0;for(const f of this.list)((n=f.home)==null?void 0:n.zone)===s.id&&!f.dead&&r++;if(r>=o)continue;const a=this.deps.rng()*Er,c=Math.sqrt(this.deps.rng())*s.r,l=s.x+Math.cos(a)*c,d=s.z+Math.sin(a)*c;if(Math.hypot(l-e.x,d-e.z)<35)continue;const h=this.deps.rng(),u=s.danger>=4&&h<.3?"tank":s.danger>=4&&h<.5?"fatty":s.danger>=3&&h<.35?"leaper":s.danger>=3&&h<.6?"runner":h<.8?"crawler":"normal";this.spawn(u,Math.max(1,w.wave)+s.danger,l,d,0,{x:s.x,z:s.z,r:s.r*.8,zone:s.id})}}}class Jw{constructor(t){this.sim=t,this.queue=[],this.spawnT=0,this.spawnGap=.5,this.bossAt=0,this.resetting=!1,this.kingDown=!1,this.restartT=-1,this.kills=0,this.run=0,this.lastReason="player",this.bossPending=null,this.titleHold=!1,this.announced=new Set,H.on("player:dead",()=>this.defeat("player")),H.on("core:destroyed",()=>this.defeat("core")),H.on("boss:dead",e=>{e.type==="king"&&(this.kingDown=!0)}),H.on("run:start",e=>this.startRun(e.startWave)),H.on("title:hold",e=>{this.titleHold=e.open}),H.on("enemy:killed",()=>{this.kills++})}start(){w.wave=Math.max(1,w.start.startWave),w.checkpoint=0,this.enterPrep()}callNext(){w.phase==="prep"&&this.startCombat()}enterPrep(){w.phase="prep",w.prepLeft=OM(w.wave,w.start.prepBonus),w.waveRemaining=0,this.queue.length=0,ie(),H.emit("wave:prep",{wave:w.wave,time:w.prepLeft})}roll(t,e){const n=Dl(t);let s=e(),o=n[0];for(const r of n)if((s-=r.weight)<=0){o=r;break}return o}startCombat(){const t=this.sim.deps.rng,e=w.wave;w.phase="combat",w.prepLeft=0,this.resetting=!1;const n=st.lanes.length;let s=_m(e);const o=wm(e);o&&(s=Math.ceil(s*.6));const r=[];let a=Math.floor(t()*n),c=0;const l=NM(e);for(;r.length<s;){c--<=0&&(a=Math.floor(t()*n),c=2+Math.floor(t()*3));const u=this.roll(e,t);if(u.pack>1){for(let f=0;f<u.pack&&r.length<s;f++)r.push({type:u.type,lane:a});c=0;continue}r.push({type:u.type,lane:a,elite:l>0&&u.type!=="swarmer"&&t()<l})}this.queue=r;const d=18+Math.min(30,e*.5);if(this.spawnGap=d/s,this.spawnT=1.5,this.bossAt=-1,o){const u=ap(e);this.bossAt=3,this.bossPending={type:u,lane:Math.floor(t()*n)}}else this.bossPending=null;w.waveRemaining=r.length+(o?1:0),ie(),H.emit("wave:start",{wave:e}),o&&H.emit("toast",{text:e===na?"좀비 왕이 깨어났다!":`${e}웨이브 보스 ${ei[ap(e)].name} 출현!`});const h=Dl(e).filter(u=>u.type!=="normal"&&!Dl(e-1).some(f=>f.type===u.type));for(const u of h)H.emit("toast",{text:`새 적 등장: ${ei[u.type].name}`})}update(t){if(w.phase==="prep"){if(this.titleHold)return;w.prepLeft=Math.max(0,w.prepLeft-t),w.prepLeft<=0&&this.startCombat();return}if(w.phase==="ended"){this.restartT>=0&&w.mode!=="modal"&&(this.restartT-=t)<0&&H.emit("run:start",{run:++this.run,startWave:w.start.startWave});return}if(w.phase!=="combat")return;if(this.spawnT-=t,this.bossPending&&(this.bossAt-=t,this.bossAt<=0)){const s=this.bossPending;this.bossPending=null,this.sim.spawnOnLane(s.type,w.wave,s.lane),H.emit("boss:spawn",{wave:w.wave,type:s.type})}for(;this.spawnT<=0&&this.queue.length>0&&this.sim.waveAlive()<au;){const s=this.queue.shift();this.sim.spawnOnLane(s.type,w.wave,s.lane,s.elite),!this.announced.has(s.type)&&Sm.some(o=>o.type===s.type)&&(this.announced.add(s.type),H.emit("enemy:newType",{name:ei[s.type].name,type:s.type,wave:w.wave})),this.spawnT+=this.spawnGap*(.6+this.sim.deps.rng()*.8)}this.spawnT<0&&(this.spawnT=0);const n=this.sim.waveAlive()+this.queue.length+(this.bossPending?1:0);n!==w.waveRemaining&&(w.waveRemaining=n,ie()),n===0&&this.clear()}clear(){const t=w.wave;H.emit("wave:clear",{wave:t}),w.gold+=Ee.waveClearGold+t*2,t%zM===0&&(w.checkpoint=t,H.emit("toast",{text:`체크포인트 도달! (${t}웨이브)`})),w.wave=t+1,this.enterPrep()}defeat(t){this.resetting||w.phase==="ended"||(this.resetting=!0,this.sim.clearAll(),this.bossPending=null,this.queue.length=0,w.phase="ended",w.waveRemaining=0,this.lastReason=t,this.restartT=Ee.fallbackRestart,ie(),H.emit("run:over",{wave:w.wave,checkpoint:w.checkpoint,kills:this.kills,gold:w.gold,reason:t}))}startRun(t){this.resetting=!1,this.sim.clearAll(),this.bossPending=null,this.kills=0,this.kingDown=!1,this.announced.clear(),this.restartT=-1;const e=this.sim.deps.player;e.hp<=0&&(e.hp=e.maxHp,e.x=st.playerStart.x,e.z=st.playerStart.z,e.iframes=2,H.emit("player:respawn",{x:e.x,z:e.z})),w.wave=Math.max(1,t),w.checkpoint=0,this.enterPrep()}get king(){return this.kingDown}}function Qw(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}const Pp=[5917242,4016732,6969914,4865372,5595199,7094336],tr=(i,t=0)=>new $e({color:i,emissive:t});function Ye(i,t,e,n,s,o,r,a,c=0){const l=new ot(new Lt(i,t,e),tr(n,c));return l.position.set(s,o,r),l.castShadow=!0,a.add(l),l}function qa(i,t,e,n,s,o,r,a=0){const c=new ot(new fi(i,t,6),tr(e,a));return c.position.set(n,s,o),c.castShadow=!0,r.add(c),c}function Ya(i,t,e,n,s,o,r=0){const a=new ot(new Dn(i,10,8),tr(t,r));return a.position.set(e,n,s),a.castShadow=!0,o.add(a),a}function Tr(i,t,e,n,s,o,r,a,c=0){const l=new ot(new ae(i,t,e,10),tr(n,c));return l.position.set(s,o,r),l.castShadow=!0,a.add(l),l}function tS(i,t,e,n=!1){const s=Pp[t%Pp.length],o={},a=i==="boss"||i==="bossBomb"||i==="bossAcid"||i==="bossLord"||i==="king"?{boss:16724770,bossBomb:16752672,bossAcid:11992890,bossLord:16726783,king:16724770}[i]:i==="spitter"?11992890:i==="bomber"?16742954:i==="screamer"?16777215:i==="tank"?16734778:16769126,c=new kt({color:a}),l=(h,u,f,g=1)=>{for(const x of[-1,1]){const p=new ot(new Lt(.09*g,.06*g,.04),c);p.position.set(x*.1,u,f),h.add(p)}};let d;switch(i){case"runner":d=je(10205290,8007471,.95),d.group.scale.x=.88,l(d.group,1.72,-.215);break;case"fatty":d=je(9416314,s,1.5),d.group.scale.set(1.5*1.35,1.5,1.5*1.25),Ye(.78,.5,.5,7310430,0,.92,-.06,d.group),l(d.group,1.72,-.215);break;case"crawler":d=je(9087082,4866102,.9),l(d.group,1.72,-.215),Ye(.3,.12,.1,3813160,.1,1.32,-.2,d.group);break;case"swarmer":d=je(12044666,11550762,.6),l(d.group,1.72,-.215,1.5);break;case"leaper":{d=je(7315594,2306092,1.05),d.group.scale.y=1.12,l(d.group,1.72,-.215,1.2);for(let h=0;h<4;h++)qa(.07,.3,2837056,0,1.45-h*.2,.2,d.group).rotation.x=.9;for(const h of d.arms)Ye(.06,.28,.06,14673880,0,-.72,-.05,h);break}case"spitter":{d=je(10145866,4020778,1),l(d.group,1.72,-.215),o.sac=Ya(.2,10223418,0,1.38,-.08,d.group,2779658),Ye(.16,.08,.05,1718794,0,1.6,-.22,d.group);break}case"bomber":{d=je(11045466,8006178,1.15),d.group.scale.x=1.12,l(d.group,1.72,-.215);for(let h=0;h<4;h++)Tr(.045,.045,.3,13777450,-.27+h*.18,1.05,-.2,d.group);Ye(.7,.07,.4,2761760,0,1,0,d.group),o.fuse=Ya(.07,16756784,0,2.02,0,d.group,16742928);break}case"screamer":{d=je(13227712,5913210,1.05),d.group.scale.y=1.1,l(d.group,1.74,-.215,1.3),o.mouth=Ye(.24,.2,.05,1312266,0,1.6,-.215,d.group);break}case"tank":{d=je(8359791,4869973,1.45),d.group.scale.set(1.45*1.15,1.45,1.45*1.1),l(d.group,1.72,-.215);const h=9080983;Ye(.7,.55,.42,h,0,1.12,-.03,d.group),Ye(.28,.14,.34,h,-.42,1.46,0,d.group),Ye(.28,.14,.34,h,.42,1.46,0,d.group),Ye(.5,.2,.5,h,0,1.92,0,d.group);break}case"boss":{const h=Math.max(0,Math.min(3,Math.floor(e/10)-1));d=je(6983516,[8003359,2051962,5906298,8018463][h],2.2),l(d.group,1.72,-.215,1.4);for(const u of[-1,1])qa(.14,.55,13616808,u*.46,1.62,0,d.group).rotation.z=-u*.7;Ye(.7,.18,.4,2761760,0,.78,0,d.group);break}case"bossBomb":{d=je(9075290,14254635,2.3),l(d.group,1.72,-.215,1.4);for(let h=0;h<6;h++)Tr(.07,.07,.55,13777450,-.28+h*.11,1.15,.26,d.group);Tr(.26,.26,.5,8014370,-.5,1.7,0,d.group,1706496),o.fuse=Ya(.1,16756784,.28,1.5,.28,d.group,16742928),Ye(.7,.18,.4,2761760,0,.78,0,d.group);break}case"bossAcid":{d=je(9424970,3099178,2.4),d.group.scale.x=2.4*1.15,l(d.group,1.72,-.215,1.4),Tr(.16,.16,.8,10223418,-.18,1.2,.3,d.group,3115530),Tr(.16,.16,.8,10223418,.18,1.2,.3,d.group,3115530);for(const[h,u,f]of[[-.42,1.6,-.05],[.4,1.45,.1],[.05,1.9,.15]])Ya(.13,11992890,h,u,f,d.group,4168208);o.tanks=d.group;break}case"bossLord":{d=je(8359802,3817290,2.6),l(d.group,1.72,-.215,1.5);const h=6975608;Ye(.72,.6,.42,h,0,1.1,-.03,d.group);for(const f of[-1,1])Ye(.34,.2,.4,h,f*.46,1.5,0,d.group),qa(.1,.4,13616808,f*.24,2.05,0,d.group).rotation.z=-f*.45;Ye(.52,.22,.52,h,0,1.92,0,d.group);const u=Ye(.8,1.3,.06,5905002,0,1,.26,d.group);u.rotation.x=.12;break}case"king":{d=je(5930837,3805232,3.2),l(d.group,1.72,-.215,1.6);const h=tr(15909424,6965760),u=new ot(new ae(.25,.25,.1,10),h);u.position.y=1.96,d.group.add(u);for(let f=0;f<6;f++){const g=f/6*Math.PI*2,x=new ot(new fi(.06,.22,4),h);x.position.set(Math.cos(g)*.23,2.1,Math.sin(g)*.23),d.group.add(x)}Ye(.8,1.3,.06,7999522,0,1,.26,d.group).rotation.x=.12;for(const f of[-1,1])qa(.16,.7,13616808,f*.5,1.7,0,d.group).rotation.z=-f*.8;break}default:d=je(8364906,s,1),l(d.group,1.72,-.215)}if(n){for(const h of[-1,1])Ye(.32,.1,.4,15909424,h*.42,1.5,0,d.group,5913088);o.gem=new ot(new Ln(.14,0),tr(16767050,9067008)),o.gem.position.set(0,2.35,0),d.group.add(o.gem)}return d.group.rotation.order="YXZ",{h:d,eyes:c,parts:o}}function ja(i){i.traverse(t=>{const e=t;e.geometry&&e.geometry.dispose();const n=e.material;Array.isArray(n)?n.forEach(s=>s.dispose()):n==null||n.dispose()})}const eS=2.2,nS={warn:16726570,impact:16773328,scream:11758591,acid:10223418},Zl=new us(1,40),Lp=new mi(.92,1,48),iS=new wn(1,1),sS=new Ln(.1,0),oS=new kt({color:16769354}),Dp=new Dn(1,12,10);let Rh=null;function rS(i){Rh=i}const _s=(i,t)=>Rh?Rh(i,t):0;class aS{constructor(t,e,n){this.scene=t,this.camera=e,this.sim=n,this.views=new Map,this.rings=[],this.gases=[],this.floats=[],this.projs=[],this.flashes=[],this.portals=[],this.time=0,this.tmp=new L,this.floatLayer=document.createElement("div"),Object.assign(this.floatLayer.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"3",overflow:"hidden"}),document.body.appendChild(this.floatLayer),this.buildPortals(),this.buildFakeCore()}buildPortals(){for(const t of st.lanes){const e=t.waypoints[0],n=new _t;n.position.set(e.x,_s(e.x,e.z)+.06,e.z);const s=new kt({color:16726570,transparent:!0,opacity:.4,side:be,depthWrite:!1}),o=new ot(Lp,s);o.rotation.x=-Math.PI/2,o.scale.setScalar(4);const r=new ot(Zl,new kt({color:2754054,transparent:!0,opacity:.55,depthWrite:!1}));r.rotation.x=-Math.PI/2,r.scale.setScalar(3.6);const a=new kt({color:16734778,transparent:!0,opacity:.18,depthWrite:!1,side:be}),c=new ot(new ae(3.2,3.8,26,20,1,!0),a);c.position.y=13,n.add(r,o,c),this.scene.add(n),this.portals.push({group:n,ring:o,beam:c,mat:s,beamMat:a})}}buildFakeCore(){const t=new _t;t.position.set(st.core.x,_s(st.core.x,st.core.z),st.core.z);const e=new ot(new ae(1.8,2.2,.5,12),new $e({color:4870232}));e.position.y=.25,e.castShadow=!0;const n=new ot(new Ln(1.1,0),new $e({color:3528447,emissive:682632}));n.position.y=2,n.scale.y=1.5,n.castShadow=!0,t.add(e,n),t.userData.crystal=n,this.scene.add(t),this.fakeCore=t}makeView(t){const e=tS(t.type,t.id,t.wave,t.elite);t.view=e.h,this.scene.add(e.h.group),t.elite&&e.h.group.scale.multiplyScalar(1.15);const n=new _t,s=Math.max(.9,t.radius*2.2),o=(l,d)=>{const h=new ot(iS,new kt({color:l,depthTest:!1,transparent:!0}));return h.renderOrder=d,h},r=o(1182218,20);r.scale.set(s+.06,.16,1);const a=o(14694954,21);a.scale.set(s,.1,1),a.position.z=.001,n.add(r,a),n.visible=!1,this.scene.add(n);const c=new _t;for(let l=0;l<3;l++){const d=new ot(sS,oS);c.add(d)}return c.visible=!1,this.scene.add(c),{z:t,m:e,bar:n,barFill:a,barW:s,stars:c,dying:-1,spin:Math.random()*6,fallDir:Math.random()<.5?1:-1}}removeView(t,e=!1){this.scene.remove(t.bar,t.stars),ja(t.bar),e||(this.scene.remove(t.m.h.group),ja(t.m.h.group),t.m.eyes.dispose()),this.views.delete(t.z)}update(t){this.time+=t,this.drainFx();for(const e of Array.from(this.views.values()))this.syncZombie(e,t);this.updateRings(t),this.updateGas(t),this.updateProjs(t),this.updateFlashes(t),this.updateFloats(t),this.updatePortals(),this.updateFakeCore()}drainFx(){for(const t of this.sim.fx)switch(t.k){case"spawn":this.views.set(t.z,this.makeView(t.z)),this.dust(t.z.x,t.z.z,Math.min(1.5,.6+t.z.scale*.5));break;case"hit":{const e=t.z.armor>0&&!t.z.stunned;this.addFloat(t.z.x,t.z.height,t.z.z,String(Math.round(t.dmg)),e?"#9fb4c4":t.dmg>=t.z.maxHp*.25?"#ffd24a":"#fff");break}case"stun":this.addFloat(t.z.x,t.z.height+.5,t.z.z,"기절!","#ffe14a");break;case"wake":this.addFloat(t.z.x,t.z.height+.5,t.z.z,"분노!","#ff5a3a");break;case"die":{const e=this.views.get(t.z);if(!e)break;t.silent?this.removeView(e):(e.dying=0,e.bar.visible=!1,e.stars.visible=!1,this.dust(t.z.x,t.z.z,t.z.scale));break}case"converted":{const e=this.views.get(t.z);e&&this.removeView(e,!0);break}case"ring":this.addRing(t.x,t.z,t.r,t.t,t.color);break;case"gas":this.addGas(t.x,t.z,t.r,t.t,t.kind);break;case"proj":this.addProj(t.x,t.z,t.tx,t.tz,t.t);break;case"blast":this.addBlast(t.x,t.z,t.r,t.kind);break;case"roar":this.addRing(t.z.x,t.z.z,t.z.radius*3,.6,t.z.type==="screamer"||t.z.type==="bossLord"?"scream":"impact");break}this.sim.fx.length=0}syncZombie(t,e){const n=t.z,s=t.m.h,o=s.group,r=_s(n.x,n.z);o.position.set(n.x,r,n.z),o.rotation.y=n.yaw;const a=this.time*3+t.spin;let c=0,l=0,d=1.35+Math.sin(a)*.1,h=0;if(t.dying>=0){t.dying+=e;const v=Math.min(1,t.dying/.55),I=1-(1-v)*(1-v);o.rotation.x=I*(Math.PI/2)*.96,o.rotation.z=t.fallDir*.15*I,o.position.y=r-Math.max(0,t.dying-1.2)*.45,s.arms.forEach((A,C)=>A.rotation.x=1.2-I*1.6+C*.3),s.legs.forEach(A=>A.rotation.x=0);const T=Math.min(1,Math.max(0,(t.dying-1.3)/.9));if(T>0)for(const A of s.mats)A.transparent=!0,A.opacity=1-T;t.dying>=eS&&this.removeView(t);return}if(n.state==="spawn"){const v=1-Math.max(0,n.stateT)/.8;h=-n.height*(1-v),d=2.4-v}switch(Hc(s,e,n.moveSpeed*(n.type==="runner"||n.type==="swarmer"?.8:1)),n.type){case"runner":c=-.3,d=.9+Math.sin(a*2)*.5;break;case"swarmer":c=-.35,d=1+Math.sin(a*3)*.5;break;case"fatty":l=Math.sin(s.walk)*.07;break;case"tank":l=Math.sin(s.walk*.7)*.04,d=1.1;break;case"crawler":{c=-1.3,h=.18,d=2.7+Math.sin(s.walk*1.4)*.5,s.legs.forEach(v=>v.rotation.x=.2);break}case"leaper":c=-.18,d=.8;break;case"spitter":c=.1+Math.sin(a)*.03,d=1.1;break;case"bomber":d=.6,l=Math.sin(s.walk)*.05;break;case"screamer":c=.1,d=.3+Math.sin(a*.7)*.1;break}switch(n.state){case"windup":{const v=1-n.stateT/Ee.windup;d=1.4+v*1.5,c=Math.min(c,0)-v*.25;break}case"stunned":c=-.55,h=-.4,d=.25,o.rotation.z=Math.sin(this.time*5+t.spin)*.07,s.legs.forEach(v=>v.rotation.x=-.9);break}let u=0;switch(n.move){case"slam":d=2.9,c=.15;break;case"charge":c=-.5,d=n.phase===1?.2:1.4;break;case"summon":case"bombRain":d=2.7,c=.1;break;case"volley":case"spit":d=2.8,c=.35+Math.sin(this.time*18)*.04;break;case"scream":d=2.4,c=.45+Math.sin(this.time*30)*.05;break;case"leap":{if(n.phase===0)h=-.35,c=-.5,d=.2;else{const v=1-Math.max(0,n.moveT)/ei.leaper.leap.time;h=Math.sin(Math.PI*v)*3.6,c=-.9,d=2.9}break}case"fuse":u=Math.sin(this.time*45)>0?1:0;break}n.state!=="stunned"&&(o.rotation.z=l),o.rotation.x=c,o.position.y=r+h,s.arms.forEach(v=>v.rotation.x=d);const f=t.m.parts;f.gem&&(f.gem.rotation.y=this.time*2.5,f.gem.position.y=2.35+Math.sin(this.time*3)*.06),f.sac&&f.sac.scale.setScalar(1+Math.sin(this.time*4)*.08+(n.move==="spit"?.5:0)),f.mouth&&(f.mouth.scale.y=n.move==="scream"?2.4:1+Math.sin(this.time*3)*.1),f.fuse&&f.fuse.scale.setScalar(.8+Math.abs(Math.sin(this.time*14))*.7);const g=n.hitFlash>0?n.hitFlash/.14:0,p=n.rage||n.isBoss&&n.hp<n.maxHp*.5?.25+Math.sin(this.time*8)*.12:0,m=n.frenzy>0?.2+Math.sin(this.time*12)*.1:0,_=n.elite?.14+Math.sin(this.time*3)*.06:0;for(const v of s.mats)v.emissive.setRGB(g*.9+p+_+u*.9+m*.7,g*.35+_*.75+u*.3,g*.3+m+u*.05);const b=n.hp<n.maxHp||n.isBoss||n.elite;if(t.bar.visible=b&&n.state!=="spawn",t.bar.visible){const v=Math.max(.001,n.hp/n.maxHp);t.barFill.scale.x=t.barW*v,t.barFill.position.x=-(t.barW*(1-v))/2,t.barFill.material.color.setHex(n.stunned?16765514:n.elite?15909424:v>.5?7328330:v>.25?14721066:14694954),t.bar.position.set(n.x,r+n.height+.45,n.z),t.bar.quaternion.copy(this.camera.quaternion)}t.stars.visible=n.stunned,n.stunned&&(t.stars.position.set(n.x,r+n.height*.8,n.z),t.stars.children.forEach((v,I)=>{const T=this.time*4+I/3*Math.PI*2;v.position.set(Math.cos(T)*.5,Math.sin(T*2)*.05,Math.sin(T)*.5),v.rotation.y=T*2}))}addRing(t,e,n,s,o){const r=o==="warn",a=new _t;a.position.set(t,_s(t,e)+.08,e);const c=new ot(Lp,new kt({color:nS[o],transparent:!0,opacity:r?.9:.8,side:be,depthWrite:!1}));c.rotation.x=-Math.PI/2,c.scale.setScalar(n),a.add(c);let l;if(r){const d=new ot(Zl,new kt({color:16722458,transparent:!0,opacity:.18,depthWrite:!1}));d.rotation.x=-Math.PI/2,d.scale.setScalar(n),l=new ot(Zl,new kt({color:16730666,transparent:!0,opacity:.35,depthWrite:!1})),l.rotation.x=-Math.PI/2,l.position.y=.01,l.scale.setScalar(.01),a.add(d,l)}this.scene.add(a),this.rings.push({mesh:a,inner:l,t:0,dur:s,r:n,warn:r})}updateRings(t){for(let e=this.rings.length-1;e>=0;e--){const n=this.rings[e];n.t+=t;const s=Math.min(1,n.t/n.dur);if(n.warn)n.inner.scale.setScalar(Math.max(.01,n.r*s));else{const o=n.mesh.children[0];o.scale.setScalar(n.r*(.3+s*.9)),o.material.opacity=.8*(1-s)}n.t>=n.dur&&(this.scene.remove(n.mesh),ja(n.mesh),this.rings.splice(e,1))}}addGas(t,e,n,s,o){const r=new _t;r.position.set(t,_s(t,e),e);const a=[],c=o==="acid";for(let l=0;l<(c?5:7);l++){const d=new ot(new Dn(1,10,8),new kt({color:c?7143210:9425482,transparent:!0,opacity:.22,depthWrite:!1})),h=l/7*Math.PI*2,u=n*.5*(l%2?1:.4);d.position.set(Math.cos(h)*u,c?.12:.7+l%3*.3,Math.sin(h)*u),c&&(d.scale.y=.25),d.userData.ph=Math.random()*6,r.add(d),a.push(d)}this.scene.add(r),this.gases.push({group:r,t:0,dur:s,r:n,puffs:a,base:c?.5:.22})}updateGas(t){for(let e=this.gases.length-1;e>=0;e--){const n=this.gases[e];n.t+=t;const s=n.t/n.dur,o=s>.7?1-(s-.7)/.3:Math.min(1,s/.15);for(const r of n.puffs){const a=n.r*(.45+.1*Math.sin(this.time*2+r.userData.ph))*(.5+.5*Math.min(1,s*4)),c=n.base>.4?.2:1;r.scale.set(a,a*c,a),r.material.opacity=n.base*o}n.t>=n.dur&&(this.scene.remove(n.group),ja(n.group),this.gases.splice(e,1))}}addProj(t,e,n,s,o){const r=new ot(Dp,new kt({color:10223418}));r.scale.setScalar(.28),this.scene.add(r),this.projs.push({mesh:r,sx:t,sz:e,tx:n,tz:s,t:0,dur:o})}updateProjs(t){for(let e=this.projs.length-1;e>=0;e--){const n=this.projs[e];n.t+=t;const s=Math.min(1,n.t/n.dur),o=n.sx+(n.tx-n.sx)*s,r=n.sz+(n.tz-n.sz)*s;n.mesh.position.set(o,_s(o,r)+1.6*(1-s)+Math.sin(Math.PI*s)*3,r),n.mesh.scale.setScalar(.28+Math.sin(this.time*30)*.03),n.t>=n.dur&&(this.scene.remove(n.mesh),n.mesh.material.dispose(),this.projs.splice(e,1))}}addBlast(t,e,n,s){const o=s==="bomb"?16752688:s==="acid"?10223418:14207136,r=new ot(Dp,new kt({color:o,transparent:!0,opacity:.85,depthWrite:!1}));r.position.set(t,_s(t,e)+(s==="slam"?.3:.8),e),this.scene.add(r),this.flashes.push({mesh:r,t:0,dur:s==="bomb"?.45:.3,r:n}),this.addRing(t,e,n,.45,s==="acid"?"acid":"impact")}updateFlashes(t){for(let e=this.flashes.length-1;e>=0;e--){const n=this.flashes[e];n.t+=t;const s=Math.min(1,n.t/n.dur);n.mesh.scale.setScalar(Math.max(.01,n.r*(.25+s*.65))),n.mesh.material.opacity=.85*(1-s),n.t>=n.dur&&(this.scene.remove(n.mesh),n.mesh.material.dispose(),this.flashes.splice(e,1))}}dust(t,e,n){this.addRing(t,e,1.4*n,.5,"impact")}addFloat(t,e,n,s,o){this.floats.length>30&&this.floats.shift().el.remove();const r=document.createElement("div");r.textContent=s,Object.assign(r.style,{position:"absolute",left:"0",top:"0",color:o,fontWeight:"800",fontSize:s.length>3?"18px":"16px",textShadow:"0 2px 3px #000, 0 0 6px #000",willChange:"transform",fontFamily:"inherit"}),this.floatLayer.appendChild(r),this.floats.push({el:r,x:t+(Math.random()-.5)*.6,y:e,z:n,t:0})}updateFloats(t){for(let e=this.floats.length-1;e>=0;e--){const n=this.floats[e];if(n.t+=t,n.t>.9){n.el.remove(),this.floats.splice(e,1);continue}if(this.tmp.set(n.x,n.y+n.t*1.6,n.z).project(this.camera),this.tmp.z>1){n.el.style.opacity="0";continue}const s=(this.tmp.x*.5+.5)*innerWidth,o=(-this.tmp.y*.5+.5)*innerHeight,r=n.t<.12?1+(.12-n.t)*6:1;n.el.style.transform=`translate(${s}px, ${o}px) translate(-50%, -50%) scale(${r})`,n.el.style.opacity=String(Math.min(1,(.9-n.t)/.3))}}updatePortals(){const t=w.phase==="combat",e=t?1:.35,n=.5+.5*Math.sin(this.time*(t?4:1.5));for(const s of this.portals)s.mat.opacity=(.25+n*.4)*e,s.beamMat.opacity=t?.12+n*.1:.04,s.ring.scale.setScalar(4+n*.4)}updateFakeCore(){if(!this.fakeCore)return;const t=this.sim.hasRealCore();if(this.fakeCore.visible=!t,t)return;const e=this.fakeCore.userData.crystal;e.rotation.y=this.time*.8,e.position.y=2+Math.sin(this.time*1.5)*.15;const n=w.coreHp/w.coreMaxHp;e.material.emissive.setRGB(.04+(1-n)*.6,.4*n,.53*n)}dispose(){this.floatLayer.remove()}}let Jl=null,Ar,Ka,Ql;const cS={init(i){const t=hn;rS(t??null),Jl=t??null,Ar=new Zw({rng:Qw((Date.now()^24301)>>>0),player:i.player,collide:cu}),Ka=new Jw(Ar),Ql=new aS(i.scene,i.camera,Ar),Ka.start()},update(i,t){if(w.mode!=="modal"&&(it.pressed.has("KeyN")&&Ka.callNext(),Ka.update(i),w.phase!=="ended"&&(Ar.updateRoamers(i),Ar.update(i))),Jl)for(const e of ki)e.hitY=Jl(e.x,e.z);Ql.update(w.mode==="modal"?0:i)},dispose(){Ql.dispose()}},Hm=8,Gm=12,Vm=6,Eo={wood:20,stone:10},td=5,Zs={turret:{name:"포탑",cost:{wood:10,stone:8},hp:160,r:.8},barricade:{name:"바리케이드",cost:{wood:4},hp:220,r:1.1}},kh=8,lS=17,dS=10,hS=.7,Ip=500,uS=32,fS=1.2,pS=60,ss=60,mS={tree:{res:"wood",min:3,max:5,r:.5},rock:{res:"stone",min:2,max:4,r:.9},iron:{res:"iron",min:1,max:3,r:.9},herb:{res:"herb",min:2,max:3,r:0},car:{res:"parts",min:1,max:2,r:1.4}};function zp(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}const Wm=i=>({x:-Math.sin(i),z:-Math.cos(i)}),$m=i=>Math.floor((i-1)/5)*5+1;function Up(i,t=0,e=!1){const n={rng:i,nextId:1,phase:"prep",phaseT:Hm,wave:1,best:t,deaths:0,kills:0,externalChests:e,kingKilled:!1,facing:0,core:{hp:Ip,maxHp:Ip,r:1.3},structs:[],player:{x:0,z:4,hp:100,maxHp:100,iframes:0},weapon:"pistol",ammo:{pistol:Vn.pistol.mag,shotgun:Vn.shotgun.mag,smg:Vn.smg.mag},reloadT:0,fireCd:0,dmgLevel:0,res:{wood:14,stone:8,iron:0,herb:2,parts:0},gold:0,pity:[0,0,0],zombies:[],queue:[],spawnT:0,nodes:[],chests:[],gatherId:0,gatherProg:0,events:[]};if(gS(n),!e)for(let s=0;s<6;s++)Xm(n);return n}function gS(i){const t=[];for(const[e,n]of t)for(let s=0,o=0;s<n&&o<400;o++){const r=(i.rng()*2-1)*56,a=(i.rng()*2-1)*56;if(Math.hypot(r,a)<12||i.nodes.some(l=>Math.hypot(l.x-r,l.z-a)<3.5))continue;const c=mS[e];i.nodes.push({id:i.nextId++,kind:e,x:r,z:a,r:c.r,res:c.res,min:c.min,max:c.max,cooldown:0}),s++}}function Xm(i){for(let t=0;t<50;t++){const e=(i.rng()*2-1)*54,n=(i.rng()*2-1)*54;if(!(Math.hypot(e,n)<14)&&!i.nodes.some(s=>Math.hypot(s.x-e,s.z-n)<3)){i.chests.push({id:i.nextId++,x:e,z:n,tier:i.rng()<.25?1:0,opened:!1});return}}}const xS=i=>[{x:0,z:0,r:i.core.r},...i.nodes.filter(t=>t.r>0).map(t=>({x:t.x,z:t.z,r:t.r})),...i.structs.map(t=>({x:t.x,z:t.z,r:Zs[t.kind].r}))];function vS(i,t,e){for(const n of e){const s=i.x-n.x,o=i.z-n.z,r=n.r+t,a=s*s+o*o;if(a<r*r&&a>1e-6){const c=Math.sqrt(a);i.x=n.x+s/c*r,i.z=n.z+o/c*r}}i.x=Math.max(-ss,Math.min(ss,i.x)),i.z=Math.max(-ss,Math.min(ss,i.z))}const re=(i,t)=>i.events.push(t);function yS(i){const t=i.wave;i.phase="combat",i.queue=[];const e=t===na&&!i.kingKilled,n=!e&&wm(t);e?i.queue.push("king"):n&&i.queue.push("boss");let s=_m(t);(e||n)&&(s=Math.floor(s/2));for(let o=0;o<s;o++){const r=i.rng(),a=t>=4?Math.min(.5,(t-3)*.06):0,c=t>=8?Math.min(.3,(t-7)*.04):0;i.queue.push(r<c?"fatty":r<c+a?"runner":"normal")}i.spawnT=0,re(i,{t:"wave",start:!0,wave:t}),re(i,{t:"banner",text:e?"최종 보스 — 좀비 왕!":n?`웨이브 ${t} — 중간 보스`:`웨이브 ${t}`})}function bS(i,t){const e=Mm(i.wave,t),n=i.rng()*Math.PI*2,s=30+i.rng()*8;i.zombies.push({id:i.nextId++,type:t,x:Math.max(-ss,Math.min(ss,Math.cos(n)*s)),z:Math.max(-ss,Math.min(ss,Math.sin(n)*s)),yaw:0,hp:e.hp,maxHp:e.hp,speed:e.speed*(.9+i.rng()*.2),dmg:e.dmg,scale:e.scale,atkCd:.5,boss:t==="boss"||t==="king"})}function MS(i){const t=i.wave;i.wave=t+1,i.best=Math.max(i.best,t),i.gold+=20+5*t,i.player.hp=Math.min(i.player.maxHp,i.player.hp+i.player.maxHp*.4),Object.keys(i.ammo).forEach(e=>i.ammo[e]=Vn[e].mag),re(i,{t:"wave",start:!1,wave:t});for(let e=0;e<2&&!i.externalChests&&i.chests.filter(n=>!n.opened).length<8;e++)Xm(i);i.core.hp=Math.min(i.core.maxHp,i.core.hp+i.core.maxHp*.3);for(const e of i.structs)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.5);i.phase="prep",i.phaseT=Gm,re(i,{t:"toast",text:`웨이브 ${t} 클리어! 골드 +${20+5*t}`})}function Np(i,t,e,n){const s=i.x-e.x,o=i.y-e.y,r=i.z-e.z,a=s*t.x+o*t.y+r*t.z,c=a*a-(s*s+o*o+r*r-n*n);if(c<0)return-1;const l=-a-Math.sqrt(c);return l>=0?l:-1}function _S(i,t,e){let n=i.z,s=-i.x;const o=Math.hypot(n,s)||1;n/=o,s/=o;const r=-i.y*s,a=i.z*n-i.x*s,c=i.y*n,l=(e()-.5)*2*t,d=(e()-.5)*2*t,h={x:i.x+n*l+r*d,y:i.y+a*d,z:i.z+s*l+c*d},u=Math.hypot(h.x,h.y,h.z)||1;return{x:h.x/u,y:h.y/u,z:h.z/u}}function wS(i,t,e){const n=Vn[i.weapon];i.fireCd=n.rate,i.ammo[i.weapon]--;const s=[];for(let o=0;o<n.pellets;o++){const r=n.spread>0?_S(e,n.spread,i.rng):e;let a=n.range,c=null,l=!1;for(const d of i.zombies){const h=Np(t,r,{x:d.x,y:1.68*d.scale,z:d.z},.3*d.scale);h>=0&&h<a&&(a=h,c=d,l=!0);const u=Np(t,r,{x:d.x,y:1*d.scale,z:d.z},.68*d.scale);u>=0&&u<a&&(a=u,c=d,l=!1)}s.push({x:t.x+r.x*a,y:t.y+r.y*a,z:t.z+r.z*a}),c&&qm(i,c,n.dmg*(1+.15*i.dmgLevel)*(l?2:1),l,s[s.length-1])}re(i,{t:"shot",weapon:i.weapon,ends:s})}function qm(i,t,e,n,s){t.hp-=e;const o=t.hp<=0;re(i,{t:"hit",id:t.id,head:n,killed:o,x:s.x,y:s.y,z:s.z}),o&&SS(i,t)}function SS(i,t){i.zombies=i.zombies.filter(e=>e!==t),i.kills++,i.gold+=2+Math.floor(i.wave/2),re(i,{t:"kill",id:t.id,x:t.x,z:t.z,type:t.type,boss:t.boss}),t.boss&&!i.externalChests?(i.chests.push({id:i.nextId++,x:t.x,z:t.z,tier:2,opened:!1}),re(i,{t:"toast",text:t.type==="king"?"좀비 왕을 쓰러뜨렸다!":"보스 처치! 황금 상자 출현"})):!i.externalChests&&i.rng()<.06&&i.chests.push({id:i.nextId++,x:t.x,z:t.z,tier:i.rng()<.2?1:0,opened:!1}),t.type==="king"&&(i.kingKilled=!0,i.best=Math.max(i.best,i.wave),i.phase="ended",re(i,{t:"end"}))}function ES(i,t){const e=ru[t];if(t>=1&&i.pity[t]>=Or-1){const s=e[2]+e[3]||1;return i.rng()*s<e[2]||!e[3]?2:3}let n=i.rng()*100;for(let s=0;s<4;s++){if(n<e[s])return s;n-=e[s]}return 0}function TS(i,t){t.opened=!0;const e=ES(i,t.tier);t.tier>=1&&(i.pity[t.tier]=e>=2?0:i.pity[t.tier]+1);const n=(o,r)=>(i.res[o]+=r,`${dn[o]} +${r}`),s=[];e===0?s.push(n("wood",6),n("stone",4)):e===1?(s.push(n("herb",4),n("iron",2),n("wood",10)),i.player.hp=Math.min(i.player.maxHp,i.player.hp+30),s.push("체력 +30")):e===2?(i.gold+=80,s.push("골드 +80",n("iron",5),n("parts",3))):(i.gold+=250,i.player.maxHp+=20,i.player.hp=i.player.maxHp,s.push("골드 +250","최대 체력 +20",n("parts",6))),re(i,{t:"chest",id:t.id,tier:t.tier,reward:e,text:`${Kr[t.tier]} → [${Ec[e]}] ${s.join(", ")}`})}function Ym(i){let t=null,e=1e9;for(const n of i.nodes){if(n.cooldown>0)continue;const s=Math.hypot(n.x-i.player.x,n.z-i.player.z)-n.r;s<2.4&&s<e&&(e=s,t={kind:"node",node:n})}for(const n of i.chests){if(n.opened)continue;const s=Math.hypot(n.x-i.player.x,n.z-i.player.z);s<2.6&&s<e&&(e=s,t={kind:"chest",chest:n})}return t}function AS(i){const t=$m(i.wave);i.wave=t,i.deaths++;for(const e of ln)i.res[e]=Math.floor(i.res[e]*.7);i.zombies=[],i.queue=[],i.player.hp=i.player.maxHp,i.core.hp=i.core.maxHp;for(const e of i.structs)e.hp=e.maxHp;Object.keys(i.ammo).forEach(e=>i.ammo[e]=Vn[e].mag),i.phase="prep",i.phaseT=Hm,re(i,{t:"respawn"})}function CS(i){i.wave=na+1,i.phase="prep",i.phaseT=Gm,i.zombies=[],i.queue=[]}function ed(i,t,e){const n=i.player;if(n.x=e.px,n.z=e.pz,n.iframes=e.iframes,i.facing=e.yaw,i.phase==="dead"){e.restart&&AS(i);return}if(i.phase==="ended")return;e.weaponSlot>=0&&e.weaponSlot<dc.length&&dc[e.weaponSlot]!==i.weapon&&(i.weapon=dc[e.weaponSlot],i.reloadT=0);const s=Vn[i.weapon];i.fireCd=Math.max(0,i.fireCd-t),i.reloadT>0?(i.reloadT-=t,i.reloadT<=0&&(i.ammo[i.weapon]=s.mag)):e.reload&&i.ammo[i.weapon]<s.mag||i.ammo[i.weapon]<=0?(i.reloadT=s.reload,re(i,{t:"reload"})):e.fire&&i.fireCd<=0&&wS(i,e.origin,e.dir),e.upgrade&&(i.dmgLevel>=Vm?re(i,{t:"toast",text:"공격력 강화는 최대입니다"}):i.res.wood>=Eo.wood&&i.res.stone>=Eo.stone?(i.res.wood-=Eo.wood,i.res.stone-=Eo.stone,i.dmgLevel++,re(i,{t:"toast",text:`공격력 강화 Lv${i.dmgLevel} (+15%씩)`})):re(i,{t:"toast",text:`재료 부족: 나무 ${Eo.wood}, 돌 ${Eo.stone}`})),e.heal&&(n.hp>=n.maxHp?re(i,{t:"toast",text:"체력이 가득 찼습니다"}):i.res.herb>=td?(i.res.herb-=td,n.hp=n.maxHp,re(i,{t:"toast",text:"약초로 체력 회복"})):re(i,{t:"toast",text:`약초 ${td}개 필요`}));const o=Ym(i);if(o&&o.kind==="node"&&e.eHeld){if(i.gatherId!==o.node.id&&(i.gatherId=o.node.id,i.gatherProg=0),i.gatherProg+=t/fS,i.gatherProg>=1){const a=o.node,c=a.min+Math.floor(i.rng()*(a.max-a.min+1));i.res[a.res]+=c,a.cooldown=pS,i.gatherProg=0,i.gatherId=0,re(i,{t:"gather",id:a.id}),re(i,{t:"toast",text:`${dn[a.res]} +${c}`})}}else i.gatherId=0,i.gatherProg=0;o&&o.kind==="chest"&&e.ePressed&&TS(i,o.chest);for(const a of i.nodes)a.cooldown>0&&(a.cooldown=Math.max(0,a.cooldown-t));i.phase==="prep"?(i.phaseT-=t,(e.skip||i.phaseT<=0)&&yS(i)):i.phase==="combat"&&(i.spawnT-=t,i.queue.length>0&&i.spawnT<=0&&i.zombies.length<au&&(bS(i,i.queue.shift()),i.spawnT=.5),i.queue.length===0&&i.zombies.length===0&&MS(i)),e.place>0&&RS(i,e.place===1?"turret":"barricade");for(const a of i.structs){if(a.kind!=="turret"||(a.cd-=t,a.cd>0))continue;let c=null,l=lS;for(const d of i.zombies){const h=Math.hypot(d.x-a.x,d.z-a.z);h<l&&(l=h,c=d)}c&&(a.cd=hS,re(i,{t:"turretShot",sx:a.x,sz:a.z,ex:c.x,ey:1.1*c.scale,ez:c.z}),qm(i,c,dS,!1,{x:c.x,y:1.1*c.scale,z:c.z}))}const r=xS(i);for(const a of i.zombies){let c=0,l=0,d=i.core.r,h="core",u=null,f=Math.hypot(a.x,a.z)-i.core.r;for(const b of i.structs){const v=Math.hypot(a.x-b.x,a.z-b.z)-Zs[b.kind].r;v<3.5&&v<f&&(f=v,c=b.x,l=b.z,d=Zs[b.kind].r,h="struct",u=b)}const g=Math.hypot(n.x-a.x,n.z-a.z);g<12&&g-.4<f+4&&(c=n.x,l=n.z,d=.4,h="player",u=null);const x=c-a.x,p=l-a.z,m=Math.hypot(x,p)||1e-6;a.yaw=Math.atan2(-x,-p);const _=.5*a.scale+.5+d;if(m>_){let b=x/m,v=p/m;for(const T of i.zombies){if(T===a)continue;const A=a.x-T.x,C=a.z-T.z,y=Math.hypot(A,C);y<1*a.scale&&y>1e-4&&(b+=A/y*.6,v+=C/y*.6)}const I=Math.hypot(b,v)||1;a.x+=b/I*a.speed*t,a.z+=v/I*a.speed*t,vS(a,.4*a.scale,r)}else a.atkCd-=t,a.atkCd<=0&&(a.atkCd=1,h==="player"?n.iframes<=0&&(n.hp-=a.dmg,re(i,{t:"hurt"})):h==="core"?(i.core.hp-=a.dmg,re(i,{t:"hurt"})):u&&(u.hp-=a.dmg,u.hp<=0&&(i.structs=i.structs.filter(b=>b!==u),re(i,{t:"destroyed",id:u.id}))))}if(n.hp<=0||i.core.hp<=0){const a=i.core.hp<=0;n.hp=Math.max(0,n.hp),i.core.hp=Math.max(0,i.core.hp),i.phase="dead",re(i,{t:"dead",from:i.wave,to:$m(i.wave),core:a})}}function RS(i,t){const e=Zs[t];if(t==="turret"&&i.structs.filter(a=>a.kind==="turret").length>=kh){re(i,{t:"toast",text:`포탑은 최대 ${kh}개입니다`});return}const n=Wm(i.facing),s=Math.round(i.player.x+n.x*2.8),o=Math.round(i.player.z+n.z*2.8);if(Math.hypot(s,o)>uS){re(i,{t:"toast",text:"기지에서 너무 멉니다"});return}if(Math.hypot(s,o)<i.core.r+e.r+.8){re(i,{t:"toast",text:"코어에 너무 가깝습니다"});return}if(i.structs.some(a=>Math.hypot(a.x-s,a.z-o)<Zs[a.kind].r+e.r)||i.nodes.some(a=>Math.hypot(a.x-s,a.z-o)<a.r+e.r)){re(i,{t:"toast",text:"여기에는 지을 수 없습니다"});return}const r=Object.keys(e.cost).filter(a=>i.res[a]<(e.cost[a]??0));if(r.length){re(i,{t:"toast",text:`재료 부족: ${r.map(a=>`${dn[a]} ${e.cost[a]}`).join(", ")}`});return}for(const a of Object.keys(e.cost))i.res[a]-=e.cost[a]??0;i.structs.push({id:i.nextId++,kind:t,x:s,z:o,hp:e.hp,maxHp:e.hp,cd:0}),re(i,{t:"built",kind:t})}let ws=null;function wi(i,t,e,n,s=i){try{ws??(ws=new AudioContext),ws.state==="suspended"&&ws.resume();const o=ws.currentTime,r=ws.createOscillator(),a=ws.createGain();r.type=e,r.frequency.setValueAtTime(i,o),r.frequency.exponentialRampToValueAtTime(Math.max(20,s),o+t),a.gain.setValueAtTime(n,o),a.gain.exponentialRampToValueAtTime(1e-4,o+t),r.connect(a).connect(ws.destination),r.start(o),r.stop(o+t)}catch{}}const Si={shot:i=>wi(i?120:260,i?.16:.09,"sawtooth",.06,50),hit:()=>wi(160,.07,"square",.05,90),kill:()=>wi(90,.22,"triangle",.09,40),hurt:()=>wi(110,.25,"sawtooth",.08,55),gather:()=>wi(520,.12,"triangle",.06,760),reload:()=>wi(300,.1,"square",.04,200),chest:i=>{wi(440,.15,"triangle",.07,660),setTimeout(()=>wi(660+i*150,.3,"triangle",.07,990),120)},wave:()=>wi(70,.6,"sawtooth",.08,55)},Oe=i=>document.getElementById(i),Fp="zt3d-best",kS=location.search.includes("debug"),Op={normal:[7048782,5593699],runner:[10135612,9056047],fatty:[8361064,7031338],boss:[10506320,3811908],king:[12623920,5247072]};function Ei(i){i.traverse(t=>{const e=t;e.geometry&&e.geometry.dispose();const n=e.material;Array.isArray(n)?n.forEach(s=>s.dispose()):n==null||n.dispose()})}const PS=i=>new $e({color:i});function Be(i,t,e=0,n=0,s=0){const o=new ot(i,PS(t));return o.position.set(e,n,s),o.castShadow=!0,o.receiveShadow=!0,o}function LS(i){const t=new _t;if(i.kind==="tree")t.add(Be(new ae(.22,.3,1.6,6),7031338,0,.8,0)),t.add(Be(new fi(1.5,2.4,7),3107636,0,2.5,0)),t.add(Be(new fi(1.1,1.8,7),3833151,0,3.5,0));else if(i.kind==="rock")t.add(Be(new Jo(.95,0),9080210,0,.6,0));else if(i.kind==="iron"){t.add(Be(new Jo(.95,0),5917252,0,.6,0));for(let e=0;e<4;e++)t.add(Be(new Lt(.22,.22,.22),14255162,Math.cos(e*1.6)*.7,.7+e%2*.3,Math.sin(e*1.6)*.7))}else if(i.kind==="herb")for(let e=0;e<4;e++)t.add(Be(new rr(.32,0),e===0?12607696:5816922,Math.cos(e*1.7)*.35,.3,Math.sin(e*1.7)*.35));else{t.add(Be(new Lt(1.5,.7,3.2),9062959,0,.6,0)),t.add(Be(new Lt(1.4,.6,1.6),6976640,0,1.2,-.2));for(const e of[-.8,.8])for(const n of[-1,1])t.add(Be(new ae(.35,.35,.2,10),2236962,e,.35,n*1)).rotation.z=Math.PI/2;t.rotation.y=i.id*1.3}return t.position.set(i.x,0,i.z),t}const DS=[10119994,10135220,15777840];function IS(i){const t=new _t,e=DS[i.tier];t.add(Be(new Lt(1.1,.6,.75),e,0,.3,0));const n=Be(new Lt(1.1,.25,.75),e,0,.72,0);t.add(n),t.add(Be(new Lt(.16,.9,.8),2763306,0,.45,0));const s=new ar(e,1.2,5);return s.position.y=1.2,t.add(s),t.position.set(i.x,0,i.z),{g:t,lid:n}}function zS(i){const t=new _t;if(i.kind==="turret"){t.add(Be(new ae(.7,.85,.5,8),4870748,0,.25,0)),t.add(Be(new Lt(.7,.5,.7),3829413,0,.75,0));const e=Be(new Lt(.16,.16,1),1908514,0,.8,-.6);e.name="barrel",t.add(e)}else t.add(Be(new Lt(2,1.1,.35),9071162,0,.55,0)),t.add(Be(new Lt(2.1,.12,.4),5914656,0,.9,0)),t.add(Be(new Lt(2.1,.12,.4),5914656,0,.3,0));return t.position.set(i.x,0,i.z),t}class US{constructor(){this.nodeViews=new Map,this.chestViews=new Map,this.zViews=new Map,this.structViews=new Map,this.dying=[],this.tracers=[],this.seed=Math.floor(Math.random()*1e9),this.day=new Dt(10466500),this.night=new Dt(2304568),this.mix=0,this.wasPrep=!0,this.overlayOpen=!1,this.coreMesh=null,this.extPrompt=null,this.extModal=!1,this.bannerT=0;let t=0;try{t=Number(localStorage.getItem(Fp))||0}catch{}this.sim=Up(zp(this.seed),t,!0),this.flashEl=document.createElement("div"),this.flashEl.style.cssText="position:fixed;inset:0;pointer-events:none;background:radial-gradient(transparent 40%,#c00a);opacity:0;transition:opacity .25s;z-index:3",document.body.appendChild(this.flashEl)}init(t){this.ctx=t,this.buildWorld(),Oe("help").innerHTML="WASD 이동 · Shift 대시 · 클릭 사격 · R 재장전 · 1/2/3 무기<br>E 길게: 채집 / E: 상자 열기 · U 공격력 강화(나무20 돌10) · H 치료(약초5) · N 웨이브 바로 시작<br>T 포탑 설치(나무10 돌8) · Y 바리케이드 설치(나무4) — 기지 코어를 지켜라!",Oe("xpFill").parentElement.style.display="none";const e=document.createElement("div");e.style.cssText="margin-top:6px;width:360px;font-size:12px",e.innerHTML='기지 코어<div style="height:10px;background:#0008;border:1px solid #fff4"><div id="coreFill" style="height:100%;background:#4cf0ff;width:100%"></div></div>',Oe("top").appendChild(e),this.coreFill=Oe("coreFill"),H.on("interact:prompt",n=>{this.extPrompt=n.text}),H.on("ui:modal",n=>{this.extModal=n.open,it.modalOpen=n.open||this.overlayOpen}),kS&&(window.__zt={view:this,ctx:t})}buildWorld(){Ue.length=0,this.nodeViews.forEach(s=>{this.ctx.scene.remove(s),Ei(s)}),this.nodeViews.clear();for(const s of this.sim.nodes){const o=LS(s);this.ctx.scene.add(o),this.nodeViews.set(s.id,o),s.r>0&&Ue.push({x:s.x,z:s.z,r:s.r})}const t=new _t;t.add(Be(new ae(1.3,1.5,.5,10),4870748,0,.25,0));const e=new ot(new Ln(.8,0),new kt({color:5042431}));e.position.y=1.5,t.add(e);const n=new ar(5042431,2.5,18);n.position.y=2,t.add(n),this.ctx.scene.add(t),this.coreMesh=t,Ue.push({x:0,z:0,r:this.sim.core.r})}newGame(){this.seed=Math.floor(Math.random()*1e9);const t=this.sim.best;this.sim=Up(zp(this.seed),t,!0),this.chestViews.forEach(e=>{this.ctx.scene.remove(e.g),Ei(e.g)}),this.chestViews.clear(),this.structViews.forEach(e=>{this.ctx.scene.remove(e.g),Ei(e.g)}),this.structViews.clear(),this.coreMesh&&(this.ctx.scene.remove(this.coreMesh),Ei(this.coreMesh)),this.zViews.forEach(e=>{this.ctx.scene.remove(e.h.group),Ei(e.h.group)}),this.zViews.clear(),this.buildWorld(),this.ctx.player.x=0,this.ctx.player.z=4}update(t,e){const n=this.sim,s=e.player,o=!this.overlayOpen&&!this.extModal;let r=it.pressed.has("Digit1")?0:it.pressed.has("Digit2")?1:it.pressed.has("Digit3")?2:-1;r>=0&&!w.weapons.includes(dc[r])&&(r=-1,o&&this.toast("아직 없는 무기입니다 (상자에서 획득)"));const a=e.camera.position,c=e.aimDir,l={px:s.x,pz:s.z,iframes:s.iframes,yaw:s.yaw,place:o?it.pressed.has("KeyT")?1:it.pressed.has("KeyY")?2:0:0,fire:o&&it.mouseDown,origin:{x:a.x+c.x*4.6,y:a.y+c.y*4.6,z:a.z+c.z*4.6},dir:{x:c.x,y:c.y,z:c.z},reload:o&&it.pressed.has("KeyR"),weaponSlot:o?r:-1,eHeld:o&&it.keys.has("KeyE"),ePressed:o&&it.pressed.has("KeyE"),upgrade:o&&it.pressed.has("KeyU"),heal:o&&it.pressed.has("KeyH"),skip:o&&it.pressed.has("KeyN"),restart:it.pressed.has("KeyR")||it.pressed.has("Enter")};for(const d of ln)n.res[d]=w.res[d];n.gold=w.gold,this.overlayOpen?n.phase==="dead"&&l.restart&&ed(n,t,l):ed(n,t,l);for(const d of ln)w.res[d]=n.res[d];w.gold=n.gold,w.wave=n.wave,w.phase=n.phase==="combat"?"combat":n.phase==="ended"?"ended":"prep",s.hp=n.player.hp,s.maxHp=n.player.maxHp,this.syncEntities(t),this.drainEvents(),this.updateFx(t),this.updateHud()}syncEntities(t){const e=this.sim,n=this.ctx.scene;for(const o of e.chests){let r=this.chestViews.get(o.id);if(!r){const a=IS(o);n.add(a.g),r={...a,open:0},this.chestViews.set(o.id,r)}o.opened&&(r.open=Math.min(1,r.open+t*3),r.lid.rotation.x=-r.open*1.8,r.lid.position.y=.72+r.open*.1)}for(const[o,r]of this.chestViews)e.chests.some(a=>a.id===o)||(n.remove(r.g),Ei(r.g),this.chestViews.delete(o));for(const o of e.nodes){const r=this.nodeViews.get(o.id);r&&r.scale.setScalar(o.cooldown>0?.35:1)}for(const o of e.structs){let r=this.structViews.get(o.id);if(!r){const c=zS(o);n.add(c);const l={x:o.x,z:o.z,r:Zs[o.kind].r};Ue.push(l),r={g:c,ob:l},this.structViews.set(o.id,r)}const a=.55+.45*(o.hp/o.maxHp);if(r.g.scale.y=o.kind==="barricade"?a:1,o.kind==="turret"){let c=null,l=17;for(const d of e.zombies){const h=Math.hypot(d.x-o.x,d.z-o.z);h<l&&(l=h,c=d)}c&&(r.g.rotation.y=Math.atan2(-(c.x-o.x),-(c.z-o.z)))}}for(const[o,r]of this.structViews)if(!e.structs.some(a=>a.id===o)){n.remove(r.g),Ei(r.g);const a=Ue.indexOf(r.ob);a>=0&&Ue.splice(a,1),this.structViews.delete(o)}this.coreMesh&&(this.coreMesh.children[1].rotation.y+=t);const s=new Set;for(const o of e.zombies){s.add(o.id);let r=this.zViews.get(o.id);r||(r=this.makeZ(o));const a=r.h.group;a.position.set(o.x,0,o.z),a.rotation.y=o.yaw,Hc(r.h,t,o.speed),r.flash=Math.max(0,r.flash-t*5);for(const c of r.h.mats)c.emissive.setRGB(r.flash,r.flash*.3,r.flash*.3)}for(const[o,r]of this.zViews)s.has(o)||(this.dying.push({g:r.h.group,t:0}),this.zViews.delete(o))}makeZ(t){const[e,n]=Op[t.type]??Op.normal,s=je(e,n,t.scale);s.arms.forEach(r=>r.rotation.x=1.4),this.ctx.scene.add(s.group);const o={h:s,flash:0};return this.zViews.set(t.id,o),o}drainEvents(){const t=this.sim,e=t.events;t.events=[];for(const n of e)switch(n.t){case"toast":this.toast(n.text);break;case"wave":H.emit(n.start?"wave:start":"wave:clear",{wave:n.wave});break;case"banner":this.banner(n.text),Si.wave();break;case"shot":{const s=this.ctx.player,o=Wm(s.yaw),r={x:Math.cos(s.yaw),z:-Math.sin(s.yaw)},a=new L(s.x+o.x*.8+r.x*.4,1.4,s.z+o.z*.8+r.z*.4);for(const c of n.ends){const l=new Le().setFromPoints([a,new L(c.x,c.y,c.z)]),d=new fh(l,new _c({color:16769162,transparent:!0}));this.ctx.scene.add(d),this.tracers.push({line:d,t:0})}Si.shot(n.weapon==="shotgun");break}case"kill":H.emit("enemy:killed",{x:n.x,z:n.z,type:n.type,byAlly:!1}),n.boss&&H.emit("boss:dead",{wave:this.sim.wave,type:n.type});break;case"hit":{const s=this.zViews.get(n.id);s&&(s.flash=1);const o=Oe("cross");o.classList.add("hit"),setTimeout(()=>o.classList.remove("hit"),90),n.killed?Si.kill():Si.hit();break}case"hurt":this.flashEl.style.opacity="0.9",setTimeout(()=>this.flashEl.style.opacity="0",120),Si.hurt();break;case"reload":Si.reload();break;case"gather":Si.gather();break;case"chest":this.toast(n.text,6e3),this.banner(`[${Ec[n.reward]}]`),Si.chest(n.reward);break;case"turretShot":{const s=new Le().setFromPoints([new L(n.sx,.85,n.sz),new L(n.ex,n.ey,n.ez)]),o=new fh(s,new _c({color:8380671,transparent:!0}));this.ctx.scene.add(o),this.tracers.push({line:o,t:0});break}case"built":this.toast(`${Zs[n.kind].name} 설치`),Si.gather();break;case"destroyed":this.toast("구조물이 파괴되었다");break;case"dead":this.showDead(n.from,n.to,n.core);break;case"respawn":this.ctx.player.x=0,this.ctx.player.z=4,this.hideOverlay();break;case"end":this.showEnding();break}}updateFx(t){for(let s=this.dying.length-1;s>=0;s--){const o=this.dying[s];o.t+=t,o.g.rotation.x=-Math.min(1,o.t*3)*(Math.PI/2),o.g.position.y=Math.min(1,o.t*3)*.2,o.t>.9&&(this.ctx.scene.remove(o.g),Ei(o.g),this.dying.splice(s,1))}for(let s=this.tracers.length-1;s>=0;s--){const o=this.tracers[s];o.t+=t,o.line.material.opacity=Math.max(0,1-o.t/.07),o.t>.07&&(this.ctx.scene.remove(o.line),Ei(o.line),this.tracers.splice(s,1))}const e=this.sim.phase==="combat"?1:0;this.mix+=(e-this.mix)*Math.min(1,t*1.5);const n=this.day.clone().lerp(this.night,this.mix);this.ctx.scene.background.copy(n),this.ctx.scene.fog.color.copy(n)}updateHud(){const t=this.sim;this.coreFill.style.width=`${Math.max(0,t.core.hp/t.core.maxHp*100)}%`,Oe("hpFill").style.width=`${Math.max(0,t.player.hp/t.player.maxHp*100)}%`,Oe("hpText").textContent=`HP ${Math.ceil(t.player.hp)} / ${t.player.maxHp}`;const e=Vn[t.weapon];Oe("ammo").innerHTML=`<b>${t.reloadT>0?"재장전…":t.ammo[t.weapon]}</b> / ${e.mag}<br>${e.name} (1~3)`,Oe("wave").textContent=`웨이브 ${t.wave} / ${na}`;const n=t.zombies.length+t.queue.length;Oe("sub").textContent=t.phase==="prep"?`준비 ${Math.ceil(t.phaseT)}초 (N: 바로 시작) · 최고 ${t.best}`:t.phase==="combat"?`남은 좀비 ${n}`:"",Oe("res").innerHTML=ln.map(l=>`${dn[l]} ${t.res[l]}`).join(" · ")+`<br>골드 ${t.gold} · 열쇠 ${w.keys}/${w.goldKeys} · 포탑 ${t.structs.filter(l=>l.kind==="turret").length}/${kh} · 공격력 강화 Lv${t.dmgLevel}/${Vm} · 처치 ${t.kills}`;const s=t.zombies.find(l=>l.boss),o=Oe("boss");o.style.display=s?"block":"none",s&&(Oe("bossFill").style.width=`${s.hp/s.maxHp*100}%`);const r=Oe("prompt"),a=Oe("prog"),c=Ym(t);if(!c&&this.extPrompt&&this.sim.phase!=="dead"?(r.style.display="block",r.textContent=this.extPrompt):c&&this.sim.phase!=="dead"?(r.style.display="block",r.textContent=c.kind==="node"?`[E 길게] ${dn[c.node.res]} 채집`:`[E] ${["나무","철","황금"][c.chest.tier]} 상자 열기`):r.style.display="none",a.style.display=t.gatherProg>0?"block":"none",a.firstElementChild.style.width=`${t.gatherProg*100}%`,t.phase==="prep"!==this.wasPrep){this.wasPrep=t.phase==="prep",t.wave>t.best;try{localStorage.setItem(Fp,String(t.best))}catch{}}}toast(t,e=3500){const n=Oe("toasts"),s=document.createElement("div");for(s.textContent=t,n.appendChild(s);n.children.length>5;)n.removeChild(n.firstChild);setTimeout(()=>s.remove(),e)}banner(t){const e=Oe("banner");e.textContent=t,e.style.opacity="1",clearTimeout(this.bannerT),this.bannerT=window.setTimeout(()=>e.style.opacity="0",1800)}overlay(t,e){var s;this.overlayOpen=!0,it.modalOpen=!0,(s=document.exitPointerLock)==null||s.call(document);const n=Oe("box");n.innerHTML=t;for(const[o,r]of e){const a=document.createElement("button");a.textContent=o,a.onclick=()=>r(),n.appendChild(a)}Oe("modal").style.display="flex"}hideOverlay(){this.overlayOpen=!1,it.modalOpen=!1,Oe("modal").style.display="none"}showDead(t,e,n){this.overlay(`<h2>${n?"기지 코어가 파괴되었다…":"쓰러졌다…"}</h2><p>웨이브 ${t}에서 실패했습니다. 체크포인트(웨이브 ${e})로 돌아갑니다.<br>자원 30%를 잃지만 골드, 강화, 포탑과 바리케이드는 유지됩니다.</p><p><small>R 또는 Enter</small></p>`,[["다시 도전",()=>{this.hideOverlay(),this.requestRestart()}]])}requestRestart(){ed(this.sim,0,this.emptyInput(!0))}emptyInput(t){const e=this.ctx.player;return{px:e.x,pz:e.z,iframes:0,yaw:e.yaw,place:0,fire:!1,origin:{x:0,y:0,z:0},dir:{x:0,y:0,z:-1},reload:!1,weaponSlot:-1,eHeld:!1,ePressed:!1,upgrade:!1,heal:!1,skip:!1,restart:t}}showEnding(){this.overlay(`<h2>🎉 엔딩 — 좀비 왕을 쓰러뜨렸다!</h2><p>도시에 평화가 돌아왔습니다. (테스트 버전 엔딩)<br>사망 ${this.sim.deaths}회 · 처치 ${this.sim.kills}마리</p>`,[["계속하기 (무한 웨이브)",()=>{this.hideOverlay(),CS(this.sim)}],["새로 시작",()=>{this.hideOverlay(),this.newGame()}]])}}let nd;const NS={init(i){nd=new US,nd.init(i)},update(i,t){nd.update(i,t)}};function Ph(i,t,e=.8){const n=t()*Math.PI*2,s=Math.sqrt(t())*i.r*e;return{x:i.x+Math.cos(n)*s,z:i.z+Math.sin(n)*s}}function FS(i,t=st){if(t.chests.length)return t.chests.map(o=>({x:o.x,z:o.z,tier:o.tier}));const e=[];for(const o of t.zones){if(o.kind==="base")continue;const r=PM[Math.max(1,Math.min(5,o.danger))];for(let a=0;a<r.wood;a++)e.push({...Ph(o,i),tier:0});for(let a=0;a<r.iron;a++)e.push({...Ph(o,i),tier:1})}const n=t.half*2,s=Math.min(ip.max,Math.floor(n*n/ip.areaPer));for(let o=0,r=0;o<s&&r<s*20;r++){const a=(i()*2-1)*t.half*.92,c=(i()*2-1)*t.half*.92;Math.hypot(a-t.core.x,c-t.core.z)<t.buildRadius+6||(e.push({x:a,z:c,tier:0}),o++)}return e}function OS(i,t,e=st){const n=e.zones.filter(r=>r.kind!=="base"&&r.danger>=t),s=n.length?n:e.zones.filter(r=>r.kind!=="base"),o=(s.length?s:e.zones).slice().sort((r,a)=>Math.hypot(a.x-e.core.x,a.z-e.core.z)-Math.hypot(r.x-e.core.x,r.z-e.core.z))[n.length?Math.floor(i()*n.length):0];return Ph(o,i,.6)}function BS(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}const HS=(i,t,e)=>t+Math.floor(i()*(e-t+1)),jm=i=>i>=1,GS=i=>i>=Or;function Lh(i,t){const e=i.reduce((s,o)=>s+o,0);let n=t()*e;for(let s=0;s<i.length;s++)if(n-=i[s],n<0)return s;return i.length-1}function VS(i,t,e){const n=ru[i],s=jm(i)&&GS(t);if(s){const o=n.slice(2);return{rarity:2+(o.reduce((a,c)=>a+c,0)>0?Lh(o,e):0),forced:s}}return{rarity:Lh(n,e),forced:s}}function WS(i,t){const e=IM[i],n=e[Lh(e.map(o=>o.w),t)],s=o=>HS(t,o.min,o.max);switch(n.kind){case"res":{const o=s(n);return{def:n,amount:o,text:`${dn[n.res]} ${o}개`}}case"gold":{const o=s(n);return{def:n,amount:o,text:`골드 ${o}`}}case"sample":{const o=s(n);return{def:n,amount:o,text:`좀비 샘플 ${o}개`}}case"sampleSp":{const o=s(n);return{def:n,amount:o,text:`특수 샘플 ${o}개`}}case"key":return{def:n,amount:n.n,text:`철 열쇠 ${n.n}개`};case"goldKey":return{def:n,amount:n.n,text:`황금 열쇠 ${n.n}개`};case"vaccine":return{def:n,amount:n.n,text:`${["초급","중급","고급"][n.tier]} 백신 ${n.n}개`};case"skillPoint":return{def:n,amount:n.n,text:`스킬 포인트 +${n.n}`};case"weapon":return{def:n,amount:1,text:`${he[n.id].name} 획득!`};case"costume":{const o=sp[Math.floor(t()*sp.length)];return{def:n,amount:1,text:`아군 코스튬 「${o}」`,costume:o}}}}function $S(i,t,e){const{rarity:n,forced:s}=VS(i,t,e),o=WS(n,e),r=jm(i)?n>=2?0:t+1:t;return{rarity:n,reward:o,pity:r,forced:s}}function XS(i){const t=i.def;let e=i.text;switch(t.kind){case"res":w.res[t.res]+=i.amount;break;case"gold":w.gold+=i.amount;break;case"sample":w.samples+=i.amount;break;case"sampleSp":w.samplesSp+=i.amount;break;case"key":w.keys+=i.amount;break;case"goldKey":w.goldKeys+=i.amount;break;case"vaccine":w.vaccines[t.tier]+=i.amount;break;case"skillPoint":w.skillPoints+=i.amount;break;case"weapon":w.weapons.includes(t.id)?(w.gold+=op,e=`${he[t.id].name} (이미 보유) → 골드 ${op}`):H.emit("weapon:unlock",{weapon:t.id});break;case"costume":i.costume&&w.costumes.includes(i.costume)?(w.gold+=rp,e=`「${i.costume}」 (중복) → 골드 ${rp}`):i.costume&&w.costumes.push(i.costume);break}return ie(),H.emit("toast",{text:`상자 보상: ${e}`}),e}class qS{constructor(t){this.rng=t,this.chests=[],this.spots=[],this.respawn=[],this.goldTimer=_r.interval}initMap(){this.spots=FS(this.rng),this.spots.forEach((t,e)=>this.spawnAtSpot(e))}reset(){this.chests=[],this.respawn=[],this.goldTimer=_r.interval,this.initMap()}spawnAtSpot(t){const e=this.spots[t];this.spawn(e.tier,e.x,e.z,"map",null,t)}spawn(t,e,n,s,o=null,r=null){const a={id:Zr(),x:e,z:n,tier:t,source:s,phase:"closed",t:0,burst:!1,rarity:0,reward:null,text:"",ttl:o,spot:r,yaw:Math.atan2(st.core.x-e,st.core.z-n)+(this.rng()-.5)*.6};return this.chests.push(a),this.trim(),a}spawnNearBase(t,e,n=null){const{core:s,buildRadius:o}=st;let r=s.x+o*.6,a=s.z;for(let c=0;c<10;c++){const l=this.rng()*Math.PI*2,d=o*(hc.ringMinK+this.rng()*(hc.ringMaxK-hc.ringMinK));if(r=s.x+Math.cos(l)*d,a=s.z+Math.sin(l)*d,this.chests.every(h=>Math.hypot(h.x-r,h.z-a)>3))break}return this.spawn(t,r,a,e,n)}trim(){for(;this.chests.length>LM;){const t=this.chests.findIndex(e=>e.phase==="closed"&&(e.source==="drop"||e.source==="wave"));if(t<0)break;this.chests.splice(t,1)}}label(t){if(t.phase!=="closed")return null;const e=Kr[t.tier],n=np[t.tier];if(!n)return`E ${e} 열기`;const s=w[n]??0,o=t.tier===1?"철 열쇠":"황금 열쇠";return s>0?`E ${e} 열기 (${o} 1개 사용)`:`${e} — ${o}가 필요합니다`}tryOpen(t){if(t.phase!=="closed")return"busy";const e=np[t.tier];if(e){if(w[e]<=0)return"nokey";w[e]-=1}const n=$S(t.tier,w.pity,this.rng);return w.pity=n.pity,t.rarity=n.rarity,t.reward=n.reward,t.phase="opening",t.t=0,t.ttl=null,ie(),"ok"}update(t){for(let e=this.chests.length-1;e>=0;e--){const n=this.chests[e];if(n.phase==="closed"){n.ttl!==null&&(n.ttl-=t)<=0&&this.chests.splice(e,1);continue}n.t+=t,!n.burst&&n.t>=Br.burst&&(n.burst=!0,n.text=XS(n.reward),H.emit("chest:opened",{tier:n.tier,rarity:n.rarity,text:n.text})),n.t>=Br.total&&(n.phase="opened",n.spot!==null&&this.respawn.push({spot:n.spot,t:kM[n.tier]}),this.chests.splice(e,1))}for(let e=this.respawn.length-1;e>=0;e--)(this.respawn[e].t-=t)<=0&&(this.spawnAtSpot(this.respawn[e].spot),this.respawn.splice(e,1));if((this.goldTimer-=t)<=0&&(this.goldTimer=_r.interval,!this.chests.some(e=>e.tier===2))){const e=OS(this.rng,_r.minDanger);this.spawn(2,e.x,e.z,"gold",_r.ttl),H.emit("toast",{text:"황금 상자가 어딘가에 나타났다!"})}}save(){return{spots:this.spots.map(t=>({...t})),chests:this.chests.filter(t=>t.phase==="closed").map(t=>({x:t.x,z:t.z,tier:t.tier,source:t.source,ttl:t.ttl,spot:t.spot})),respawn:this.respawn.map(t=>({...t})),goldTimer:this.goldTimer}}load(t){this.chests=[],this.spots=t.spots.map(e=>({...e})),t.chests.forEach(e=>this.spawn(e.tier,e.x,e.z,e.source,e.ttl,e.spot)),this.respawn=t.respawn.map(e=>({...e})),this.goldTimer=t.goldTimer}}function YS(i,t){let e=null;H.on("enemy:killed",({x:n,z:s,type:o})=>{if(o==="boss"||o==="king"){e={x:n,z:s};return}t()<Pl.woodChance?i.spawn(0,n,s,"drop",Pl.ttl):t()<Pl.keyChance&&(w.keys+=1,ie(),H.emit("toast",{text:"철 열쇠를 주웠다!"}))}),H.on("wave:clear",({wave:n})=>{i.spawnNearBase(0,"wave"),n%hc.ironEvery===0&&i.spawnNearBase(1,"wave"),H.emit("toast",{text:`웨이브 ${n} 보상 상자가 기지 근처에 나타났다`})}),H.on("run:start",()=>{i.reset(),e=null,w.pity=0,w.keys=0,w.goldKeys=0,ie()}),H.on("boss:dead",({wave:n})=>{w.goldKeys+=DM,ie(),e?i.spawn(2,e.x,e.z,"boss"):i.spawnNearBase(2,"boss"),e=null,H.emit("toast",{text:`보스(웨이브 ${n}) 처치! 황금 열쇠와 황금 상자 획득`})})}const jS=[{body:9067051,band:3877404,lock:14267466,emissive:0,ring:12618314},{body:8095121,band:3817801,lock:14936300,emissive:658964,ring:11450820},{body:14723354,band:9067008,lock:16733542,emissive:7030016,ring:16765773}],pu=new Lt(1,1,1),Km=(()=>{const i=new ae(.45,.45,1.3,20,1,!1,0,Math.PI);return i.rotateZ(Math.PI/2),i})(),Zm=new ae(.28,.6,16,20,1,!0),Jm=new mi(.95,1.15,40),Qm=new Ln(.07);function To(i,t,e,n,s=0,o=0,r=0){const a=new ot(pu,n);return a.scale.set(i,t,e),a.position.set(s,o,r),a.castShadow=!0,a.receiveShadow=!0,a}function KS(i){const t=jS[i.tier],e=i.tier===0,n=new Ri({color:t.body,roughness:e?.85:.4,metalness:e?0:i.tier===2?.85:.6,emissive:t.emissive,emissiveIntensity:1}),s=new Ri({color:t.band,roughness:.5,metalness:e?.4:.7}),o=new Ri({color:t.lock,roughness:.3,metalness:.9,emissive:i.tier===2?6689058:0}),r=new _t,a=new _t;r.add(a),a.add(To(1.3,.62,.9,n,0,.31,0));for(const x of[-.45,.45])a.add(To(.12,.66,.96,s,x,.31,0));if(a.add(To(1.34,.08,.94,s,0,.04,0)),e)for(const x of[.17,.4])a.add(To(1.32,.012,.92,s,0,x,0));a.add(To(.2,.22,.06,o,0,.58,.47)),a.add(To(.07,.07,.07,s,0,.58,.51));const c=new kt({color:Tc[0],transparent:!0,opacity:0,depthWrite:!1}),l=new ot(pu,c);l.scale.set(1.14,.04,.74),l.position.set(0,.62,0),a.add(l);const d=new _t;d.position.set(0,.62,-.45);const h=new ot(Km,n);h.scale.set(1,.9,1),h.position.set(0,0,.45),h.castShadow=!0,d.add(h);for(const x of[-.45,.45]){const p=new ot(new ae(.46,.46,.12,20,1,!1,0,Math.PI),s);p.geometry.rotateZ(Math.PI/2),p.scale.set(1,.9,1.02),p.position.set(x,0,.45),d.add(p)}if(i.tier===2){const x=new ot(new Ln(.12),new Ri({color:16724821,emissive:11145523,roughness:.2,metalness:.3}));x.position.set(0,.43,.9),d.add(x)}a.add(d);const u=new ot(Zm,new kt({color:t.ring,transparent:!0,opacity:0,blending:ui,depthWrite:!1,side:be}));u.position.y=8,u.visible=!1,r.add(u);const f=new ot(Jm,new kt({color:t.ring,transparent:!0,opacity:.55,side:be,depthWrite:!1}));f.rotation.x=-Math.PI/2,f.position.y=.04,r.add(f);const g=[];if(i.tier===2)for(let x=0;x<6;x++){const p=new ot(Qm,new kt({color:16773544}));r.add(p),g.push(p)}return r.position.set(i.x,hn(i.x,i.z),i.z),r.rotation.y=i.yaw,{id:i.id,group:r,body:a,lid:d,glow:l,beam:u,ring:f,sparks:g,burstDone:!1,tier:i.tier,lastRarity:-1}}const ZS=i=>1+2.9*Math.pow(i-1,3)+1.9*Math.pow(i-1,2),Ao=i=>Math.max(0,Math.min(1,i));function JS(i,t,e,n){const s=t.phase==="closed",o=.5+.5*Math.sin(e*3+t.id);if(i.ring.material.opacity=s?n?.9:.35+o*.25:Math.max(0,.5-t.t*.3),i.ring.scale.setScalar(n&&s?1.15+o*.1:1),i.tier===2&&s&&(i.beam.visible=!0,i.beam.scale.set(.35,1,.35),i.beam.material.opacity=.16+o*.08),i.sparks.forEach((m,_)=>{const b=e*1.6+_/i.sparks.length*Math.PI*2;m.position.set(Math.cos(b)*.95,.5+.5*Math.sin(e*2.3+_*1.7)+.2,Math.sin(b)*.95),m.rotation.set(e*2+_,e*3,0),m.visible=s}),s){i.body.position.set(0,0,0),i.body.rotation.set(0,0,0),i.body.scale.set(1,1,1),i.lid.rotation.x=n?-.08-.05*Math.sin(e*6):0;return}const r=t.t,a=Br.burst;if(r<a){const m=r/a,_=.015+m*m*.1;i.body.rotation.z=Math.sin(r*46)*_,i.body.rotation.x=Math.cos(r*39)*_*.6,i.body.position.set(Math.sin(r*61)*_*.25,0,Math.cos(r*53)*_*.25);const b=m>.8?1+Math.sin((m-.8)/.2*Math.PI)*.1:1;i.body.scale.set(1/Math.sqrt(b),b,1/Math.sqrt(b)),i.lid.rotation.x=-Math.abs(Math.sin(r*28))*.12*m;return}const c=r-a;i.body.rotation.set(0,0,0),i.body.position.set(0,0,0);const l=Ao(c/.3);i.body.scale.set(1,1+(1-l)*.12,1),i.lid.rotation.x=-1.95*ZS(Ao(c/.4));const d=new Dt(Tc[t.rarity]),h=i.glow.material;h.color.copy(d),h.opacity=1,i.glow.position.y=.62+Ao(c/.5)*.06;const u=.7+t.rarity*.25,f=Ao(c/.25),g=1-Ao((c-1.4)/(Br.total-a-1.4));i.beam.visible=!0;const x=i.beam.material;x.color.copy(d),x.opacity=.6*f*g,i.beam.scale.set(u*(1+.08*Math.sin(e*18)),f,u*(1+.08*Math.sin(e*18)));const p=Ao((c-1.9)/(Br.total-a-1.9));i.body.scale.multiplyScalar(1-p*.9),i.body.position.y=-p*.5,i.ring.visible=p<.9}function QS(i){i.group.traverse(t=>{var s;const e=t;e.material&&!(e.geometry===pu||e.geometry===Km||e.geometry===Zm||e.geometry===Jm||e.geometry===Qm)&&((s=e.geometry)==null||s.dispose());const n=e.material;n==null||n.dispose()}),i.group.removeFromParent()}const tE=new Lt(.12,.12,.04),eE=new mi(.9,1,48);class nE{constructor(t){this.scene=t,this.bits=[],this.waves=[],this.mats=Tc.map(e=>new kt({color:e,side:be})),this.white=new kt({color:16777215,side:be})}spawn(t,e,n,s){const o=[16,28,46,80][s];for(let a=0;a<o;a++){const c=new ot(tE,Math.random()<.25?this.white:this.mats[s]);c.position.set(t,e,n),this.scene.add(c);const l=Math.random()*Math.PI*2,d=1.5+Math.random()*(3+s);this.bits.push({mesh:c,vx:Math.cos(l)*d,vy:4+Math.random()*(4+s*1.5),vz:Math.sin(l)*d,vr:(Math.random()-.5)*14,life:0,max:1.1+Math.random()*.8})}const r=new ot(eE,new kt({color:Tc[s],transparent:!0,opacity:.9,side:be,depthWrite:!1,blending:ui}));r.rotation.x=-Math.PI/2,r.position.set(t,.08,n),this.scene.add(r),this.waves.push({mesh:r,t:0})}update(t){for(let e=this.bits.length-1;e>=0;e--){const n=this.bits[e];n.life+=t,n.vy-=14*t,n.mesh.position.x+=n.vx*t,n.mesh.position.y+=n.vy*t,n.mesh.position.z+=n.vz*t,n.mesh.rotation.x+=n.vr*t,n.mesh.rotation.y+=n.vr*.7*t,n.mesh.position.y<.05&&(n.mesh.position.y=.05,n.vy=0,n.vx*=.8,n.vz*=.8),n.mesh.scale.setScalar(Math.max(.01,1-Math.max(0,n.life-n.max+.4)/.4)),n.life>=n.max&&(n.mesh.removeFromParent(),this.bits.splice(e,1))}for(let e=this.waves.length-1;e>=0;e--){const n=this.waves[e];n.t+=t,n.mesh.scale.setScalar(1+n.t*9),n.mesh.material.opacity=Math.max(0,.9-n.t*1.8),n.t>.5&&(n.mesh.removeFromParent(),n.mesh.material.dispose(),this.waves.splice(e,1))}}}const id=["#cfd3d8","#66cc66","#66aaff","#ffcc33"],iE=`
.lt-odds{position:fixed;right:18px;top:50%;transform:translateY(-50%) translateX(12px);width:228px;padding:12px 14px;border-radius:10px;background:linear-gradient(#1b212bee,#12161dee);border:1px solid #fff3;box-shadow:0 8px 28px #000a;color:#eee;font-size:13px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:4}
.lt-odds.on{opacity:1;transform:translateY(-50%)}
.lt-odds h3{margin:0 0 8px;font-size:15px;display:flex;justify-content:space-between;align-items:baseline}
.lt-odds h3 small{font-size:11px;opacity:.7;font-weight:normal}
.lt-odds .r{display:grid;grid-template-columns:34px 1fr 40px;align-items:center;gap:6px;margin:5px 0}
.lt-odds .lt-bar{height:8px;border-radius:4px;background:#ffffff14;overflow:hidden}
.lt-odds .lt-bar i{display:block;height:100%;border-radius:4px}
.lt-odds .pct{text-align:right;font-variant-numeric:tabular-nums}
.lt-odds .pity{margin-top:9px;padding-top:8px;border-top:1px solid #fff2;font-size:12px;opacity:.9}
.lt-odds .pity .pb{margin-top:4px;display:flex;gap:2px}
.lt-odds .pity .pb i{flex:1;height:5px;border-radius:2px;background:#ffffff1c}
.lt-odds .pity .pb i.f{background:#fc3}
.lt-odds .hot{color:#fc3;font-weight:bold}
.lt-card{position:fixed;left:50%;top:26%;transform:translate(-50%,24px) scale(.9);min-width:260px;padding:14px 26px 16px;text-align:center;border-radius:12px;background:#10141aee;border:2px solid var(--c);box-shadow:0 0 36px var(--c),0 10px 30px #000;color:#fff;opacity:0;pointer-events:none;z-index:6}
.lt-card.on{animation:ltpop 3.1s ease forwards}
.lt-card .rk{font-size:13px;letter-spacing:.2em;color:var(--c);font-weight:bold}
.lt-card .tx{font-size:24px;font-weight:bold;margin-top:4px;text-shadow:0 0 12px var(--c)}
.lt-card .sb{font-size:12px;opacity:.7;margin-top:4px}
@keyframes ltpop{0%{opacity:0;transform:translate(-50%,24px) scale(.85)}9%{opacity:1;transform:translate(-50%,0) scale(1.06)}16%{transform:translate(-50%,0) scale(1)}84%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-10px) scale(.98)}}
.lt-flash{position:fixed;inset:0;pointer-events:none;opacity:0;z-index:5;background:radial-gradient(circle at 50% 55%,var(--c) 0%,transparent 62%)}
.lt-flash.on{animation:ltflash .9s ease-out}
@keyframes ltflash{0%{opacity:.55}100%{opacity:0}}
`;class sE{constructor(){this.oddsKey="",this.cardTimer=0;const t=document.createElement("style");t.textContent=iE,document.head.appendChild(t),this.odds=sd("div","lt-odds"),this.card=sd("div","lt-card"),this.flash=sd("div","lt-flash"),document.body.append(this.odds,this.card,this.flash)}showOdds(t,e,n){if(t<0){this.odds.classList.remove("on");return}const s=`${t}|${e}|${n}`;if(s!==this.oddsKey){this.oddsKey=s;const o=t>=1&&e>=Or,r=ru[t].map((l,d)=>`<div class="r"><span style="color:${id[d]}">${Ec[d]}</span><span class="lt-bar"><i style="width:${l}%;background:${id[d]}"></i></span><span class="pct">${l}%</span></div>`).join(""),a=t===0?"무료":t===1?`철 열쇠 ${n}개 보유`:`황금 열쇠 ${n}개 보유`,c=t>=1?`<div class="pity">${o?'<span class="hot">다음 상자는 희귀 이상 확정!</span>':`천장 ${e}/${Or} <span style="opacity:.7">(희귀 이상 연속 미출현)</span>`}<div class="pb">${Array.from({length:Or},(l,d)=>`<i class="${d<e?"f":""}"></i>`).join("")}</div></div>`:'<div class="pity" style="opacity:.7">나무 상자는 천장과 상관없이 무료</div>';this.odds.innerHTML=`<h3>${Kr[t]}<small>${a}</small></h3>${r}${c}`}this.odds.classList.add("on")}clear(){this.oddsKey="",this.odds.classList.remove("on"),this.card.classList.remove("on"),this.flash.classList.remove("on")}reveal(t,e,n){const s=id[e];this.card.style.setProperty("--c",s),this.card.innerHTML=`<div class="rk">${Ec[e]}</div><div class="tx">${n}</div><div class="sb">${Kr[t]}</div>`,Bp(this.card),e>=2&&(this.flash.style.setProperty("--c",s+(e===3?"cc":"88")),Bp(this.flash))}}function Bp(i){i.classList.remove("on"),i.offsetWidth,i.classList.add("on")}function sd(i,t){const e=document.createElement(i);return e.className=t,e}let Jn,Za,od,Hp=0;const $o=new Map;function oE(i,t){const e=Jn.chests.find(r=>r.id===t),n=KS(e);i.scene.add(n.group);const s={x:e.x,z:e.z,r:.75};Ue.push(s);const o={x:e.x,z:e.z,range:bm,label:()=>Jn.label(e),press:()=>{Jn.tryOpen(e)==="nokey"&&H.emit("toast",{text:`${Kr[e.tier]}을 열려면 ${e.tier===1?"철":"황금"} 열쇠가 필요합니다`})}};Jr(o),$o.set(t,{view:n,act:o,obs:s})}function rE(i){const t=$o.get(i);fu(t.act);const e=Ue.indexOf(t.obs);e>=0&&Ue.splice(e,1),QS(t.view),$o.delete(i)}const Gp={init(i){const t=BS((Date.now()^2654435769)>>>0);Jn=new qS(t),Jn.initMap(),YS(Jn,t),Za=new sE,od=new nE(i.scene),H.on("run:start",()=>Za.clear()),H.on("chest:opened",({tier:e,rarity:n,text:s})=>Za.reveal(e,n,s))},update(i,t){Hp+=i,Jn.update(i);const e=new Set(Jn.chests.map(o=>o.id));for(const o of[...$o.keys()])e.has(o)||rE(o);for(const o of Jn.chests)$o.has(o.id)||oE(t,o.id);let n=null,s=RM;for(const o of Jn.chests){if(o.phase!=="closed")continue;const r=Math.hypot(o.x-t.player.x,o.z-t.player.z);r<s&&(s=r,n=o)}Za.showOdds(n?n.tier:-1,w.pity,n?n.tier===1?w.keys:w.goldKeys:0);for(const o of Jn.chests){const r=$o.get(o.id);JS(r.view,o,Hp,o===n&&s<=bm),o.burst&&!r.view.burstDone&&(r.view.burstDone=!0,od.spawn(o.x,.9,o.z,o.rarity))}od.update(i)}},Vp=(i,t=0)=>Math.round((i-t)/Fr)*Fr+t;function aE(i,t,e,n,s,o,r,a=70){if(s>=-.02)return null;let c=0;for(let l=0;l<160&&c<a;l++){const d=i+n*c,h=t+s*c,u=e+o*c,f=h-r(d,u);if(f<=.05)return{x:d,z:u};c+=Math.max(.25,f*.6)}return null}const mu=(i,t)=>Math.atan2(-i,-t);function cE(i,t,e){let n=(t-i)%(Math.PI*2);return n>Math.PI&&(n-=Math.PI*2),n<-Math.PI&&(n+=Math.PI*2),Math.abs(n)<=e?t:i+Math.sign(n)*e}function Wp(i,t,e,n,s){const o=Qt[i],r=Math.hypot(t-st.core.x,e-st.core.z);if(r+o.radius>st.buildRadius)return{ok:!1,reason:"기지 구역 밖이에요"};if(r<Rn.radius+o.radius+.8)return{ok:!1,reason:"핵에 너무 가까워요"};for(const a of n)if(Math.hypot(t-a.x,e-a.z)<a.r+o.radius-.05)return{ok:!1,reason:"다른 물체와 겹쳐요"};return s&&i!=="trap"&&Math.hypot(t-s.x,e-s.z)<o.radius+.6?{ok:!1,reason:"내가 서 있는 자리예요"}:{ok:!0}}function lE(i,t){if(t.length<2)return null;const e=st.buildRadius,n=r=>Math.hypot(r.x-st.core.x,r.z-st.core.z);for(let r=0;r<t.length-1;r++){const a=t[r],c=t[r+1],l=n(a),d=n(c);if(l>e&&d<=e){const h=(l-e)/(l-d),u=a.x+(c.x-a.x)*h,f=a.z+(c.z-a.z)*h,g=Math.hypot(c.x-a.x,c.z-a.z)||1;return{id:i,x:u,z:f,dx:(c.x-a.x)/g,dz:(c.z-a.z)/g}}}const s=t[t.length-1],o=n(s)||1;return{id:i,x:s.x,z:s.z,dx:(st.core.x-s.x)/o,dz:(st.core.z-s.z)/o}}const dE=()=>st.lanes.map(i=>lE(i.id,i.waypoints)).filter(i=>!!i),es=(i,t=0)=>{const e=ln.filter(n=>(i[n]??0)>0).map(n=>`${dn[n]} ${i[n]}`);return t>0&&e.push(`골드 ${t}`),e.join(" ")||"무료"},tg=(i,t=0)=>w.gold>=t&&ln.every(e=>(i[e]??0)<=w.res[e]),hE=(i,t,e=1)=>{const n={};let s=!1;for(const o of ln)(i[o]??0)>0&&(n[o]=Math.max(1,Math.ceil(i[o]*t)),s=!0);return s||(n.wood=e),n};function uE(i){const{obstacles:t,rng:e}=i,n=[],s=[],o=new Set;let r=-1,a=0,c=0,l=P=>H.emit("toast",{text:P});const d={id:Zr(),kind:"core",x:st.core.x,z:st.core.z,radius:Rn.radius,hp:Rn.hp[0],maxHp:Rn.hp[0],height:Rn.height,dead:!1,level:0,hitFlash:0,hit(P){d.dead||w.phase==="ended"||P<=0||(w.coreHp=Math.max(0,w.coreHp-P),d.hp=w.coreHp,d.hitFlash=1,H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),ie(),w.coreHp<=0&&(d.dead=!0,r=0,s.push({t:"boom",x:d.x,z:d.z,r:6}),H.emit("core:destroyed",void 0)))}};w.coreMaxHp=Rn.hp[0],w.coreHp=Rn.hp[0],bn.push(d);function h(P,U){d.level=P;const J=w.coreMaxHp;w.coreMaxHp=d.maxHp=Rn.hp[P]+c,U&&(w.coreHp=Math.min(w.coreMaxHp,w.coreHp+(w.coreMaxHp-J))),d.hp=w.coreHp}const u=()=>[...t],f=()=>{const P=n.filter(U=>U.kind==="barracks").length;w.allyCapBonus=P*TM,ie()};function g(P,U,J,X=1){var Ut;const ct=Qt[P],vt={id:Zr(),kind:P,x:U,z:J,radius:ct.radius,hp:ct.hp,maxHp:ct.hp,height:ct.height,dead:!1,level:X,ammo:((Ut=ct.turret)==null?void 0:Ut.ammo)??0,cooldown:0,aimYaw:e()*Math.PI*2,tracking:!1,pulse:0,hitFlash:0,hit(jt){vt.dead||jt<=0||(vt.hp=Math.max(0,vt.hp-jt),vt.hitFlash=1,vt.hp<=0&&x(vt,!0))}};return vt}function x(P,U){P.dead=!0;const J=n.indexOf(P);J>=0&&n.splice(J,1);const X=bn.indexOf(P);X>=0&&bn.splice(X,1);const ct=t.findIndex(vt=>vt.owner===P.id);ct>=0&&t.splice(ct,1),s.push({t:"boom",x:P.x,z:P.z,r:P.radius*1.4}),H.emit("building:destroyed",{id:P.id,kind:P.kind}),f(),U&&l(`${Qt[P.kind].name}이(가) 파괴됐어요!`)}function p(P,U,J,X){if(w.phase!=="prep")return{ok:!1,reason:"준비 단계에만 건설할 수 있어요"};const ct=Wp(P,U,J,u(),X);return ct.ok?tg(Qt[P].cost)?{ok:!0}:{ok:!1,reason:"자원이 부족해요"}:ct}function m(P,U,J,X){const ct=p(P,U,J,X);if(!ct.ok)return ct;if(!Ac(Qt[P].cost))return{ok:!1,reason:"자원이 부족해요"};const vt=g(P,U,J);return n.push(vt),bn.push(vt),P!=="trap"&&t.push({x:U,z:J,r:Qt[P].radius*.95,owner:vt.id}),s.push({t:"placed",x:U,z:J,r:Qt[P].radius}),H.emit("building:placed",{id:vt.id,kind:P}),f(),{ok:!0}}function _(P,U,J){if(!Qt[P]||!Wp(P,U,J,u()).ok)return!1;const X=g(P,U,J);return n.push(X),bn.push(X),P!=="trap"&&t.push({x:U,z:J,r:Qt[P].radius*.95,owner:X.id}),s.push({t:"placed",x:U,z:J,r:Qt[P].radius}),H.emit("building:placed",{id:X.id,kind:P}),f(),!0}function b(P){if(w.phase!=="prep")return l("준비 단계에만 철거할 수 있어요"),!1;const U=Qt[P.kind],J=ym*(P.hp/P.maxHp);for(const X of ln){const ct=Math.floor((U.cost[X]??0)*J);ct>0&&(w.res[X]+=ct)}return x(P,!1),ie(),!0}const v=P=>hE(Qt[P.kind].cost,.5*(1-P.hp/P.maxHp)),I=P=>{var U;return((U=Qt[P.kind].turret)==null?void 0:U.refill)??{}},T=P=>{var U;return((U=Qt[P.kind].turret)==null?void 0:U.levels)??[]},A=P=>T(P).length,C=P=>{const U=T(P)[P.level];return U?{cost:U.upCost,gold:U.upGold}:null};function y(P,U=0){return Ac(P,U)?!0:(l(`재료가 부족해요: ${es(P,U)}`),!1)}function M(P){return P.hp>=P.maxHp||!y(v(P))?!1:(P.hp=P.maxHp,P.hitFlash=0,!0)}function R(P){const U=Qt[P.kind].turret;return!U||P.ammo>=U.ammo||!y(U.refill)?!1:(P.ammo=U.ammo,!0)}function z(P){if(w.phase!=="prep")return l("강화는 준비 단계에만 할 수 있어요"),!1;const U=C(P);return!U||!y(U.cost,U.gold)?!1:(P.level++,P.maxHp=Math.round(Qt[P.kind].hp*(1+.25*(P.level-1))),P.hp=P.maxHp,s.push({t:"placed",x:P.x,z:P.z,r:P.radius}),!0)}const D=()=>Mr.cost;function V(){return d.dead||w.coreHp>=w.coreMaxHp||!y(Mr.cost)?!1:(w.coreHp=Math.min(w.coreMaxHp,w.coreHp+w.coreMaxHp*Mr.pct),d.hp=w.coreHp,H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),ie(),!0)}const K=()=>AM[d.level]??null;function j(){if(w.phase!=="prep")return l("핵 강화는 준비 단계에만 할 수 있어요"),!1;const P=K();return!P||!y(P.cost,P.gold)?!1:(h(d.level+1,!0),H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),s.push({t:"placed",x:d.x,z:d.z,r:d.radius}),ie(),!0)}function et(P){const U=Qt[P.kind];if(P.kind==="lab")return{kind:"open-lab",label:`${U.name}: 백신 제작`};if(P.kind==="shop")return{kind:"open-shop",label:`${U.name}: 판매/열쇠`};if(P.hp<P.maxHp-.5){const X=v(P);return{kind:"repair",label:`${U.name} 수리 (${es(X)})`,cost:X}}if(U.turret&&P.ammo<U.turret.ammo*.85)return{kind:"refill",label:`${U.name} 탄약 보충 ${P.ammo}/${U.turret.ammo} (${es(U.turret.refill)})`,cost:U.turret.refill};const J=w.phase==="prep"?C(P):null;return J?{kind:"upgrade",label:`${U.name} 강화 Lv${P.level+1} (${es(J.cost,J.gold)})`,cost:J.cost,gold:J.gold}:null}function q(){if(d.dead)return null;if(w.coreHp<w.coreMaxHp-.5)return{kind:"repair",label:`핵 수리 (${es(Mr.cost)})`,cost:Mr.cost};const P=w.phase==="prep"?K():null;return P?{kind:"upgrade",label:`핵 강화 Lv${d.level+2} (${es(P.cost,P.gold)})`,cost:P.cost,gold:P.gold}:null}function lt(P,U){switch(U.kind){case"repair":return M(P);case"refill":return R(P);case"upgrade":return z(P);case"open-lab":return H.emit("interact:lab",void 0),!0;case"open-shop":return H.emit("interact:shop",void 0),!0}}function gt(P,U){d.hitFlash=Math.max(0,d.hitFlash-P*3),d.hp=w.coreHp,d.dead?(r+=P,r>1.2&&w.phase!=="ended"&&(d.dead=!1,r=-1,w.coreHp=Math.max(w.coreHp,w.coreMaxHp*CM),d.hp=w.coreHp,H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),l("핵이 체크포인트에서 복구됐어요"),ie())):w.phase==="prep"&&w.coreHp<w.coreMaxHp&&(a+=P,a>=.5&&(a=0,w.coreHp=Math.min(w.coreMaxHp,w.coreHp+w.coreMaxHp*.006),d.hp=w.coreHp,H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),ie()));const J=new Map;for(const X of n){X.hitFlash=Math.max(0,X.hitFlash-P*3);const ct=Qt[X.kind];if(X.cooldown=Math.max(0,X.cooldown-P),ct.trap){X.pulse-=P;const Ze=X.pulse<=0;Ze&&(X.pulse=.5,s.push({t:"pulse",x:X.x,z:X.z,r:ct.trap.radius}));for(const Ht of U)Ht.dead||Math.hypot(Ht.x-X.x,Ht.z-X.z)>ct.trap.radius+Ht.radius*.5||(J.set(Ht,Math.min(J.get(Ht)??1,ct.trap.slow)),Ze&&Ht.hit(ct.trap.dps*.5,!0));continue}const vt=ct.turret;if(!vt)continue;const Ut=vt.levels[X.level-1],jt=du(U,X.x,X.z,Ut.range);if(X.tracking=!!jt,!jt)continue;const Bt=mu(jt.x-X.x,jt.z-X.z);if(X.aimYaw=cE(X.aimYaw,Bt,P*9),X.cooldown>0||X.ammo<=0||Math.abs(X.aimYaw-Bt)>.12)continue;const ue=e()<.1;jt.hit(Ut.dmg*(1+w.start.turretDmgMul)*(ue?2:1),!0),X.ammo--,X.cooldown=Ut.rate;const F=ct.height*.82;s.push({t:"shot",id:X.id,kind:X.kind,fx:X.x-Math.sin(X.aimYaw)*.7,fy:F,fz:X.z-Math.cos(X.aimYaw)*.7,tx:jt.x+(e()-.5)*.4,ty:jt.height*(.45+e()*.3),tz:jt.z+(e()-.5)*.4,crit:ue})}for(const X of o)J.has(X)||(delete X.slowMul,o.delete(X));for(const[X,ct]of J)X.slowMul=ct,o.add(X)}function At(){for(const P of[...n])x(P,!1);s.length=0;for(const P of o)delete P.slowMul;o.clear(),c=w.start.coreHp,d.dead=!1,r=-1,d.hitFlash=0,h(0,!1),w.coreHp=w.coreMaxHp,d.hp=w.coreHp,w.allyCapBonus=0,H.emit("core:damaged",{hp:w.coreHp,maxHp:w.coreMaxHp}),ie()}const Vt=()=>({coreLevel:d.level,coreHp:w.coreHp,buildings:n.map(P=>({kind:P.kind,x:P.x,z:P.z,level:P.level,hp:P.hp,ammo:P.ammo}))});function oe(P){for(const U of[...n])x(U,!1);h(Math.min(P.coreLevel,Rn.hp.length-1),!1),w.coreHp=Math.min(P.coreHp,w.coreMaxHp),d.hp=w.coreHp;for(const U of P.buildings){if(!Qt[U.kind])continue;const J=g(U.kind,U.x,U.z,U.level);J.maxHp=Math.round(Qt[U.kind].hp*(1+.25*(U.level-1))),J.hp=Math.min(U.hp,J.maxHp),J.ammo=U.ammo,n.push(J),bn.push(J),U.kind!=="trap"&&t.push({x:U.x,z:U.z,r:Qt[U.kind].radius*.95,owner:J.id}),H.emit("building:placed",{id:J.id,kind:U.kind})}f(),ie()}return{core:d,buildings:n,fx:s,checkPlace:p,place:m,placeFree:_,demolish:b,repair:M,refill:R,upgrade:z,repairCore:V,upgradeCore:j,repairCost:v,refillCost:I,upgradeInfo:C,maxLevel:A,coreRepairCost:D,coreUpgradeInfo:K,actionFor:et,coreAction:q,perform:lt,update:gt,save:Vt,load:oe,reset:At,setToast(P){l=P}}}const fE=a_,Qe=(i,t)=>{const e=fE.getGroundY;return e?e(i,t):0};class pE{constructor(t){this.group=new _t,this.gateMats=[],this.building=!1;const e=st.buildRadius,n=st.core.x,s=st.core.z,o=[],r=(p,m,_,b)=>{Math.hypot(p-n,m-s)>e||Math.hypot(_-n,b-s)>e||o.push(p,Qe(p,m)+.07,m,_,Qe(_,b)+.07,b)},a=Math.ceil(e/Fr)*Fr;for(let p=-a;p<=a;p+=Fr)for(let m=-a;m<a;m+=1)r(n+p,s+m,n+p,s+m+1),r(n+m,s+p,n+m+1,s+p);const c=new Le;c.setAttribute("position",new se(o,3)),this.grid=new O2(c,new _c({color:8381439,transparent:!0,opacity:.2,depthWrite:!1})),this.group.add(this.grid);const l=120,d=[],h=[];for(let p=0;p<=l;p++){const m=p/l*Math.PI*2,_=Math.cos(m),b=Math.sin(m);for(const v of[e-.18,e+.18]){const I=n+_*v,T=s+b*v;d.push(I,Qe(I,T)+.1,T)}p<l&&h.push(p*2,p*2+1,p*2+2,p*2+1,p*2+3,p*2+2)}const u=new Le;u.setAttribute("position",new se(d,3)),u.setIndex(h),this.ring=new ot(u,new kt({color:8381439,transparent:!0,opacity:.7,side:be,depthWrite:!1})),this.group.add(this.ring),this.gates=dE();const f=new um;f.moveTo(0,-.9),f.lineTo(1.2,.5),f.lineTo(.55,.5),f.lineTo(0,-.25),f.lineTo(-.55,.5),f.lineTo(-1.2,.5),f.closePath();const g=new iu(f);g.rotateX(-Math.PI/2);const x=new Lt(.35,2.2,.35);for(const p of this.gates){const m=Math.atan2(-p.dx,-p.dz),_=new kt({color:16757575,transparent:!0,opacity:.8,depthWrite:!1,side:be});this.gateMats.push(_);const b=new _t;b.position.set(p.x,Qe(p.x,p.z),p.z),b.rotation.y=m;for(let v=0;v<3;v++){const I=new ot(g,_);I.position.set(0,.12,1.6-v*1.5+2.5),b.add(I)}for(const v of[-1,1]){const I=new ot(x,new $e({color:4870748}));I.position.set(v*6,1.1,0),I.castShadow=!1;const T=new ot(new Dn(.28,10,8),new kt({color:16747050}));T.position.set(v*6,2.35,0),b.add(I,T)}this.group.add(b)}t.add(this.group),this.setBuilding(!1)}setBuilding(t){this.building=t,this.grid.visible=t,this.ring.visible=t}update(t){const e=this.building?.55+.35*Math.sin(t*4):.22;for(const n of this.gateMats)n.opacity=e;this.ring.material.opacity=.45+.25*Math.sin(t*2)}nearGate(t,e){let n=null,s=9;for(const o of this.gates){const r=Math.hypot(o.x-t,o.z-e);r<s&&(s=r,n=o)}return n}}const $p=new Map,cs=(i,t)=>{let e=$p.get(i);return e||(e=t(),$p.set(i,e)),e},wt=(i,t,e)=>cs(`b${i},${t},${e}`,()=>new Lt(i,t,e)),en=(i,t,e,n=12)=>cs(`c${i},${t},${e},${n}`,()=>new ae(i,t,e,n)),er=(i,t,e=8)=>cs(`n${i},${t},${e}`,()=>new fi(i,t,e)),os=(i,t=14,e=10)=>cs(`s${i},${t},${e}`,()=>new Dn(i,t,e)),kc=(i,t,e=8,n=24)=>cs(`t${i},${t},${e},${n}`,()=>new su(i,t,e,n)),Gt={wood:9136709,darkWood:5914920,metal:4870748,steel:10134702,stone:9277329,darkStone:6251110,olive:6122302,sand:13220234,white:14673640,teal:3120531,green:6487962,amber:16757575,red:14234682,blue:4901119,gold:15909198,cloth1:13191228,cloth2:15392712};class fs{constructor(){this.group=new _t,this.mats=[],this.glows=[]}mk(t,e=0,n=0,s={}){const o=new $e({color:t,emissive:e,emissiveIntensity:n});return s.opacity!==void 0&&(o.transparent=!0,o.opacity=s.opacity),o.userData.baseEmissive=e,o.userData.baseEi=n,this.mats.push(o),o}glow(t,e=1,n=.4,s=3){const o=this.mk(t,t,e);return this.glows.push({mat:o,base:e,amp:n,speed:s}),o}add(t,e,n=0,s=0,o=0,r=this.group,a=[0,0,0],c=!0){const l=new ot(t,e);return l.position.set(n,s,o),l.rotation.set(a[0],a[1],a[2]),l.castShadow=c,l.receiveShadow=!0,r.add(l),l}done(t={}){return{group:this.group,mats:this.mats,glows:this.glows,...t}}}function Xp(i,t,e,n=.2,s=Gt.sand){const o=i.mk(s);for(let r=0;r<t;r++){const a=r/t*Math.PI*2;i.add(wt(.62,.34,.36),o,Math.cos(a)*e,n,Math.sin(a)*e,i.group,[0,-a+Math.PI/2,0])}}function mE(i){const t=new fs,e=t.mk(Gt.wood),n=t.mk(Gt.darkWood),s=t.mk(Gt.metal),o=t.mk(Gt.steel),r=i>=3?Gt.gold:i===2?Gt.blue:Gt.red,a=t.mk(r);for(const h of[-1,1])for(const u of[-1,1])t.add(wt(.2,3.5,.2),n,h*.72,1.75,u*.72);for(let h=0;h<4;h++){const u=h*Math.PI/2,f=Math.cos(u),g=Math.sin(u);for(const x of[.9,2.3])t.add(wt(1.5,.12,.12),e,f*.72,x,g*.72,t.group,[0,-u+Math.PI/2+Math.PI/2,0]);t.add(wt(.1,1.9,.1),e,f*.72,1.6,g*.72,t.group,u%Math.PI===0?[0,0,.78*(f>0?1:-1)*0]:[0,0,0])}t.add(wt(2.05,.18,2.05),e,0,3.5,0),t.add(wt(2.15,.08,2.15),n,0,3.4,0);for(const h of[-1,1])t.add(wt(2.05,.1,.08),n,0,4.05,h*1),t.add(wt(.08,.1,2.05),n,h*1,4.05,0),t.add(wt(2.05,.55,.06),e,0,3.8,h*1),t.add(wt(.06,.55,2.05),e,h*1,3.8,0);t.add(wt(.08,3.4,.08),n,-.25,1.7,.82,t.group,[-.14,0,0]),t.add(wt(.08,3.4,.08),n,.25,1.7,.82,t.group,[-.14,0,0]);for(let h=0;h<7;h++)t.add(wt(.5,.05,.05),n,0,.35+h*.47,.85-h*.065);for(const h of[-1,1])for(const u of[-1,1])t.add(wt(.1,.9,.1),n,h*.98,4.5,u*.98);t.add(er(1.75,.7,4),a,0,5.3,0,t.group,[0,Math.PI/4,0]).scale.set(1,1,1),i>=2&&(t.add(en(.02,.02,.9,6),o,0,5.85,0),t.add(wt(.5,.3,.02),a,.26,6.15,0)),i>=3&&t.add(os(.16),t.glow(Gt.gold,1.2,.5,4),0,4.45,0);const l=new _t;l.position.set(0,3.6,0),t.group.add(l),t.add(en(.42,.5,.2,12),s,0,.1,0,l),t.add(wt(.62,.38,.8),s,0,.42,.05,l),t.add(wt(.16,.16,1.1+i*.12),o,0,.45,-.75,l),t.add(wt(.22,.22,.14),n,0,.45,-1.35-i*.06,l),t.add(os(.09),t.glow(Gt.red,1.4,.6,5),0,.68,-.15,l);const d=new Re;return d.position.set(0,.45,-1.5-i*.06),l.add(d),t.done({head:l,muzzle:d})}function gE(i){const t=new fs,e=t.mk(Gt.metal),n=t.mk(3159355),s=t.mk(Gt.steel),o=t.mk(14256683);Xp(t,9,1,.18),Xp(t,9,.9,.5),t.add(en(.85,1,.35,10),n,0,.18,0),t.add(kc(.86,.04,6,20),t.glow(Gt.red,.9,.4,3),0,.4,0,t.group,[Math.PI/2,0,0],!1),t.add(en(.38,.5,.8,8),e,0,.75,0);const r=new _t;r.position.set(0,1.25,0),t.group.add(r),t.add(wt(.85,.5,.95),e,0,.2,.05,r),t.add(wt(1.1,.55,.1),n,0,.3,-.5,r);const a=i+1;for(let l=0;l<a;l++){const d=l/a*Math.PI*2+Math.PI/4,h=a===2?l?.13:-.13:Math.cos(d)*.14,u=a===2?.25:Math.sin(d)*.14+.28;t.add(en(.065,.065,1.25,8),s,h,u,-.95,r,[Math.PI/2,0,0]),t.add(en(.09,.09,.14,8),n,h,u,-1.55,r,[Math.PI/2,0,0])}t.add(wt(.34,.3,.4),o,.62,.15,.1,r),t.add(os(.08),t.glow(Gt.red,1.5,.7,7),0,.52,.1,r);const c=new Re;return c.position.set(0,.28,-1.65),r.add(c),t.done({head:r,muzzle:c})}function xE(){const i=new fs,t=i.mk(Gt.wood),e=i.mk(Gt.darkWood),n=i.mk(3817285),s=i.mk(Gt.steel);for(const o of[-1,1])i.add(wt(.2,1.55,.2),e,o*.82,.77,0),i.add(er(.12,.3,6),e,o*.82,1.68,0);[.32,.72,1.12].forEach((o,r)=>i.add(wt(1.95,.24,.1),r%2?t:e,0,o,r%2?.08:-.08)),i.add(wt(.1,1.9,.07),t,0,.75,.15,i.group,[0,0,.78]),i.add(wt(.1,1.9,.07),t,0,.75,.15,i.group,[0,0,-.78]);for(let o=0;o<5;o++)i.add(er(.06,.24,5),s,-.8+o*.4,1.38,-.08);return i.add(wt(1.9,.04,.04),n,0,1.5,.16),i.done()}function vE(){const i=new fs,t=i.mk(2830132),e=i.mk(Gt.steel),n=i.glow(Gt.amber,.9,.5,3);i.add(en(.95,1,.12,20),t,0,.06,0),i.add(kc(.82,.05,6,28),n,0,.14,0,i.group,[Math.PI/2,0,0],!1);const s=new _t;i.group.add(s);for(let o=0;o<10;o++){const r=o/10*Math.PI*2;i.add(er(.07,.4,5),e,Math.cos(r)*.55,.3,Math.sin(r)*.55,s)}return i.add(er(.1,.5,5),e,0,.36,0,s),i.add(en(.15,.15,.06,10),i.glow(Gt.amber,1.2,.6,5),0,.14,0,i.group,[0,0,0],!1),i.done({anim:o=>{s.rotation.y=Math.sin(o*.8)*.2}})}function yE(){const i=new fs,t=i.mk(Gt.white),e=i.mk(Gt.teal),n=i.mk(Gt.darkStone),s=i.mk(Gt.metal),o=i.mk(Gt.steel),r=i.mk(9431254,4186304,.5,{opacity:.45}),a=i.glow(Gt.green,1,.35,2.4);i.add(wt(3.4,.25,3.4),n,0,.12,0),i.add(wt(3.1,1.7,3.1),t,0,1.1,0),i.add(wt(3.2,.14,3.2),e,0,1.97,0),i.add(wt(3.15,.14,3.15),e,0,.55,0),i.add(wt(.9,1.3,.08),s,0,.9,-1.58),i.add(wt(.7,.4,.04),i.glow(Gt.green,.6,.2,1.6),0,1.2,-1.63);for(const d of[-1,1])i.add(wt(.06,.75,1.1),i.glow(8384724,.8,.15,2),d*1.57,1.2,0);i.add(en(.95,1.05,.25,16),s,0,2.15,0),i.add(os(.9,18,10),r,0,2.3,0);const c=new _t;c.position.set(0,2.45,0),i.group.add(c),i.add(en(.2,.34,.8,12),a,0,0,0,c),i.add(os(.22),a,0,.5,0,c),i.add(en(.07,.07,.35,8),o,0,.8,0,c),i.add(en(.04,.04,1.4,6),o,1.2,3,1.1),i.add(os(.08),i.glow(Gt.red,1.4,.9,6),1.2,3.7,1.1),i.add(wt(.5,.9,.5),n,-1.1,2.55,1);const l=new _t;i.group.add(l);for(let d=0;d<3;d++)i.add(os(.12),r,0,0,0,l);return i.done({anim:d=>{c.rotation.y=d*.9,c.position.y=2.45+Math.sin(d*2)*.05,l.children.forEach((h,u)=>h.position.set(-1.1+Math.sin(d*.8+u*2)*.12,3.1+(d*.6+u*.35)%1*.8,1))}})}function bE(){const i=new fs,t=i.mk(Gt.olive),e=i.mk(Gt.wood),n=i.mk(Gt.darkWood),s=i.mk(7028526),o=i.mk(Gt.darkStone),r=i.mk(Gt.cloth1);i.add(wt(3.5,.3,3.1),o,0,.15,0),i.add(wt(3.2,1.6,2.8),t,0,1.1,0);for(let c=-1;c<=1;c++)i.add(wt(.12,1.65,2.9),n,c*1.6*.95,1.1,0);for(const c of[-1,1])i.add(wt(3.7,.14,1.9),s,0,2.3,c*.88,i.group,[c*.55,0,0]);i.add(wt(3.7,.12,.2),n,0,2.75,0),i.add(wt(3.2,.9,.06),t,0,2.15,-1.38),i.add(wt(.85,1.25,.08),n,-.7,.9,-1.45),i.add(wt(.6,.5,.06),i.glow(16765562,.9,.12,2),.75,1.35,-1.45),i.add(wt(.7,.06,.1),n,.75,1.1,-1.46);for(const c of[-1,1])i.add(wt(.06,.5,.6),i.glow(16765562,.8,.12,2.2),c*1.62,1.35,0);i.add(en(.035,.035,1.5,6),i.mk(Gt.steel),1.55,3.3,-1.3);const a=i.add(wt(.7,.45,.03),r,1.9,3.8,-1.3);return i.add(wt(.5,.45,.5),e,1.25,.5,-1.7),i.add(wt(.4,.35,.4),n,.75,.47,-1.78),i.done({anim:c=>{a.rotation.y=Math.sin(c*3)*.2,a.position.x=1.9+Math.sin(c*3)*.04}})}function ME(){const i=new fs,t=i.mk(Gt.wood),e=i.mk(Gt.darkWood),n=i.mk(Gt.darkStone),s=i.mk(Gt.cloth1),o=i.mk(Gt.cloth2),r=i.glow(Gt.gold,.9,.3,2.5);i.add(wt(3.5,.22,3.1),n,0,.11,0),i.add(wt(3.1,1.2,1.1),e,0,.8,.8),i.add(wt(3.2,.12,1.3),t,0,1.45,.8),i.add(wt(2.7,.9,.7),t,0,.65,-.55),i.add(wt(2.9,.1,.9),e,0,1.12,-.55);for(const a of[-1,1])i.add(wt(.14,2.3,.14),e,a*1.45,1.25,-1.2);for(let a=0;a<7;a++)i.add(wt(.43,.08,1.7),a%2?o:s,-1.29+a*.43,2.28-.01*a*0,-.7,i.group,[.28,0,0]);i.add(en(.45,.45,.08,20),r,0,2.95,-1.2,i.group,[Math.PI/2,0,0]),i.add(wt(.06,.55,.06),e,0,2.55,-1.2);for(let a=0;a<3;a++)i.add(wt(.5,.45,.5),a%2?t:e,-1.1+a*.35,1.5+a%2*0,1,i.group,[0,a*.4,0]);return i.add(wt(.55,.5,.55),t,1.1,.5,1.1,i.group,[0,.3,0]),i.add(os(.12),i.glow(16765562,1.2,.3,4),-1.45,2.45,-1.2),i.done()}function Dh(i,t=1){switch(i){case"tower":return mE(t);case"mgtower":return gE(t);case"barricade":return xE();case"trap":return vE();case"lab":return yE();case"barracks":return bE();case"shop":return ME()}}function qp(i){const t=new fs,e=t.mk(Gt.stone),n=t.mk(Gt.darkStone),s=t.mk(3159355),o=t.mk(6742271,3390463,1.3);t.add(en(3,3.3,.35,8),n,0,.17,0),t.add(en(2.5,2.8,.35,8),e,0,.5,0),t.add(en(1.5,1.8,.4,8),s,0,.88,0);const r=t.glow(6742271,.9,.35,2);t.add(kc(2.55,.05,6,40),r,0,.7,0,t.group,[Math.PI/2,0,0],!1);for(let f=0;f<4;f++){const g=f/4*Math.PI*2+Math.PI/4,x=Math.cos(g)*2.25,p=Math.sin(g)*2.25;t.add(wt(.45,1.8,.45),e,x,1.4,p,t.group,[0,-g,0]),t.add(wt(.55,.2,.55),n,x,2.35,p,t.group,[0,-g,0]),t.add(er(.22,.45,4),t.glow(6742271,1.2,.5,3+f*.4),x,2.7,p,t.group,[0,Math.PI/4,0])}const a=t.add(cs("oct",()=>new Ln(1,0)),o,0,2.9,0);a.scale.set(.85,1.4,.85),t.add(cs("oct",()=>new Ln(1,0)),t.mk(16777215,16777215,.9),0,2.9,0,t.group,[0,0,0],!1).scale.set(.35,.6,.35);const l=[];for(let f=0;f<=i;f++){const g=t.add(kc(1.35+f*.3,.035,6,36),t.glow(f%2?11071743:6742271,1.1,.4,2+f),0,2.9,0,t.group,[Math.PI/2+f*.5,f*.7,0],!1);l.push(g)}const d=new kt({color:6742271,transparent:!0,opacity:.08,side:be,depthWrite:!1,blending:ui}),h=new ot(cs("shield",()=>new Dn(3.4,24,14,0,Math.PI*2,0,Math.PI/2)),d);h.position.y=.4,t.group.add(h);const u=new ar(6737151,2.2,22,1.6);return u.position.set(0,3.2,0),t.group.add(u),t.group.userData.light=u,Object.assign(t.done(),{crystal:a,shield:h,rings:l,crystalMat:o})}class Cr{constructor(t,e,n,s){this.items=[];for(let o=0;o<n;o++){const r=new kt({transparent:!0,depthWrite:!1,blending:s?ui:Hs}),a=new ot(e,r);a.visible=!1,t.add(a),this.items.push({mesh:a,mat:r,life:0,max:1,vx:0,vy:0,vz:0,g:0,s0:1,s1:1,a0:1,active:!1,stretch:!1})}}get(){for(const t of this.items)if(!t.active)return t.active=!0,t.mesh.visible=!0,t.stretch=!1,t.vx=t.vy=t.vz=t.g=0,t.mesh.rotation.set(0,0,0),t;return null}update(t){for(const e of this.items){if(!e.active)continue;if(e.life-=t,e.life<=0){e.active=!1,e.mesh.visible=!1;continue}const n=1-e.life/e.max;e.vy-=e.g*t,e.mesh.position.x+=e.vx*t,e.mesh.position.y+=e.vy*t,e.mesh.position.z+=e.vz*t,e.stretch||e.mesh.scale.setScalar(e.s0+(e.s1-e.s0)*n),e.mat.opacity=e.a0*(1-n*n)}}}let _E=class{constructor(t,e){this.groundY=e,this.sparks=new Cr(t,new Dn(.5,8,6),120,!0),this.debris=new Cr(t,new Lt(.3,.3,.3),90,!1),this.smoke=new Cr(t,new Dn(.5,8,6),90,!1);const n=new mi(.88,1,40);n.rotateX(-Math.PI/2),this.rings=new Cr(t,n,40,!0);const s=new Lt(1,1,1);s.translate(0,0,-.5),this.tracers=new Cr(t,s,90,!0)}tracer(t,e,n,s,o,r,a,c){const l=this.tracers.get();if(!l)return;const d=Math.hypot(s-t,o-e,r-n);l.mesh.position.set(t,e,n),l.mesh.lookAt(s,o,r),l.mesh.scale.set(c,c,d),l.stretch=!0,l.mat.color.setHex(a),l.life=l.max=.09,l.a0=.95}flash(t,e,n,s,o,r=.07){const a=this.sparks.get();a&&(a.mesh.position.set(t,e,n),a.mat.color.setHex(s),a.s0=o,a.s1=o*.4,a.life=a.max=r,a.a0=1)}ring(t,e,n,s,o=.55,r=.25){const a=this.rings.get();a&&(a.mesh.position.set(t,this.groundY(t,e)+.14,e),a.mat.color.setHex(s),a.s0=Math.max(.2,n*r),a.s1=n,a.life=a.max=o,a.a0=.85)}burst(t,e,n,s,o,r=4,a=!0){for(let c=0;c<s;c++){const l=Math.random()*Math.PI*2,d=.5+Math.random(),h=this.debris.get();if(!h)break;h.mesh.position.set(t,e,n),h.mat.color.setHex(o),h.vx=Math.cos(l)*r*Math.random(),h.vz=Math.sin(l)*r*Math.random(),h.vy=r*d,h.g=14,h.s0=.35+Math.random()*.5,h.s1=.1,h.life=h.max=.7+Math.random()*.5,h.a0=1,h.mesh.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3)}if(a)for(let c=0;c<s*.4;c++)this.flash(t+(Math.random()-.5),e+Math.random(),n+(Math.random()-.5),16760928,.5+Math.random()*.5,.3)}puff(t,e,n,s=5593696,o=.5,r=1.2,a=1.2){const c=this.smoke.get();c&&(c.mesh.position.set(t+(Math.random()-.5)*.4,e,n+(Math.random()-.5)*.4),c.mat.color.setHex(s),c.vy=a,c.vx=(Math.random()-.5)*.4,c.vz=(Math.random()-.5)*.4,c.s0=o,c.s1=o*2.6,c.life=c.max=r,c.a0=.55)}update(t){this.sparks.update(t),this.debris.update(t),this.smoke.update(t),this.rings.update(t),this.tracers.update(t)}};const wE=i=>1+(1.9+1)*Math.pow(i-1,3)+1.9*Math.pow(i-1,2),eg=(i,t,e)=>new Dt(i).lerp(new Dt(t),e);class Yp{constructor(t){this.w=t,this.group=new _t;const e=(s,o,r,a)=>{const c=new ot(new wn(1,o),new kt({color:s,depthTest:!1,transparent:!0,opacity:.92}));return c.position.set(0,r,a),c.renderOrder=20+a*100,this.group.add(c),c},n=e(724498,.2,0,0);n.scale.x=t+.08,this.fill=e(5690212,.14,0,.01),this.fill.scale.x=t,this.ammoBg=e(724498,.1,-.18,0),this.ammoBg.scale.x=t+.08,this.ammo=e(16761415,.06,-.18,.01),this.ammo.scale.x=t,this.group.visible=!1}set(t,e){this.fill.scale.x=Math.max(.001,this.w*t),this.fill.position.x=-this.w*(1-t)/2,this.fill.material.color.copy(eg(15026253,5690212,t)),this.ammoBg.visible=this.ammo.visible=e!==null,e!==null&&(this.ammo.scale.x=Math.max(.001,this.w*e),this.ammo.position.x=-this.w*(1-e)/2)}}const Su=class Su{constructor(t,e,n){this.scene=t,this.camera=e,this.model=n,this.recs=new Map,this.coreRoot=new _t,this.coreBar=new Yp(2.6),this.t=0,this.coreFlash=0,this.coreSmoke=0,this.fx=new _E(t,Qe),this.core=qp(0),this.coreRoot.add(this.core.group);const s=Qe(st.core.x,st.core.z);this.coreRoot.position.set(st.core.x,s,st.core.z),t.add(this.coreRoot),this.coreBar.group.position.set(st.core.x,s+Rn.height+1.8,st.core.z),t.add(this.coreBar.group),n.core.view=this.coreRoot}spawn(t){const e=Dh(t.kind,t.level),n=new _t;n.add(e.group);const s=mu(st.core.x-t.x,st.core.z-t.z);n.rotation.y=s,n.position.set(t.x,Qe(t.x,t.z),t.z),n.scale.setScalar(.01),this.scene.add(n);const o=new Yp(Math.max(1.3,t.radius*1.3));this.scene.add(o.group);const r={b:t,model:e,root:n,bar:o,level:t.level,born:this.t,kick:0,smokeT:0,flashing:!1,yaw:s};this.recs.set(t.id,r),t.view=n}dispose(t){this.scene.remove(t.root,t.bar.group);for(const e of t.model.mats)e.dispose();this.recs.delete(t.b.id)}handleFx(t){for(const e of t)if(e.t==="shot"){const n=e.kind==="mgtower",s=Qe(e.fx,e.fz);this.fx.tracer(e.fx,s+e.fy,e.fz,e.tx,Qe(e.tx,e.tz)+e.ty,e.tz,e.crit?16742976:n?16761968:16774072,n?.05:.07),this.fx.flash(e.fx,s+e.fy,e.fz,16771488,n?.28:.4),this.fx.flash(e.tx,Qe(e.tx,e.tz)+e.ty,e.tz,e.crit?16738864:16767392,e.crit?.5:.28,.1);const o=this.recs.get(e.id);o&&(o.kick=1)}else if(e.t==="pulse")this.fx.ring(e.x,e.z,e.r,16757575,.5,.4);else if(e.t==="placed"){const n=Qe(e.x,e.z);this.fx.ring(e.x,e.z,e.r*2.2,8381439,.6,.3),this.fx.burst(e.x,n+.3,e.z,8,10129274,2.2,!1)}else if(e.t==="boom"){const n=Qe(e.x,e.z);this.fx.burst(e.x,n+.8,e.z,16,8022613,6),this.fx.ring(e.x,e.z,e.r*2,16751178,.7,.2);for(let s=0;s<6;s++)this.fx.puff(e.x,n+.5,e.z,3948356,.8,1.6,1.8)}t.length=0}update(t){var s;this.t+=t;const e=this.t,n=new Set;for(const o of this.model.buildings)n.add(o.id),this.recs.has(o.id)||this.spawn(o);for(const o of[...this.recs.values()])n.has(o.b.id)||this.dispose(o);this.handleFx(this.model.fx);for(const o of this.recs.values()){const{b:r,model:a,root:c}=o;if(r.level!==o.level){c.remove(a.group);for(const p of a.mats)p.dispose();o.model=Dh(r.kind,r.level),c.add(o.model.group),o.level=r.level,o.flashing=!1}const l=o.model,d=e-o.born,h=d<.38?Math.max(.01,wE(d/.38)):1;if(c.scale.set(h,h,h),l.head){const p=r.tracking?0:Math.sin(e*.7+r.id)*.5;l.head.rotation.y=r.aimYaw-o.yaw+p,o.kick=Math.max(0,o.kick-t*9),l.head.position.z=o.kick*.14}(s=l.anim)==null||s.call(l,e,t);for(const p of l.glows)p.mat.emissiveIntensity=p.base+Math.sin(e*p.speed+r.id)*p.amp;if(r.hitFlash>0){o.flashing=!0;for(const p of l.mats)p.emissive.setHex(16724770),p.emissiveIntensity=Math.max(p.userData.baseEi,r.hitFlash*.9)}else if(o.flashing){o.flashing=!1;for(const p of l.mats)p.emissive.setHex(p.userData.baseEmissive),p.emissiveIntensity=p.userData.baseEi}const u=r.hp/r.maxHp,f=Qt[r.kind].turret,g=f?r.ammo/f.ammo:1,x=u<.999||f!==void 0&&g<.6;if(o.bar.group.visible=x,x&&(o.bar.set(u,f&&g<.999?g:null),o.bar.group.position.set(r.x,Qe(r.x,r.z)+Qt[r.kind].height+.7,r.z),o.bar.group.quaternion.copy(this.camera.quaternion)),u<.45&&(o.smokeT-=t,o.smokeT<=0)){o.smokeT=u<.2?.12:.28;const p=Qe(r.x,r.z)+Qt[r.kind].height*.6;this.fx.puff(r.x,p,r.z,u<.2?3026739:7106677,.45,1.3,1.5),u<.2&&this.fx.flash(r.x+(Math.random()-.5)*r.radius,p,r.z+(Math.random()-.5)*r.radius,16742954,.5,.2)}}this.updateCore(t,e),this.fx.update(t)}updateCore(t,e){const n=this.model.core,s=this.core,o=Math.max(0,n.hp/n.maxHp);s.rings.length!==n.level+1&&(this.coreRoot.remove(s.group),this.core=qp(n.level),this.coreRoot.add(this.core.group),this.fx.ring(n.x,n.z,7,8381439,.9,.2));const r=this.core;n.hitFlash>this.coreFlash&&(this.coreFlash=n.hitFlash),this.coreFlash=Math.max(0,this.coreFlash-t*3);const a=n.dead,c=eg(16730682,6742271,Math.min(1,o*1.3));r.crystalMat.color.copy(c),r.crystalMat.emissive.copy(c);const l=o<.3?.55+.45*Math.sin(e*22):1;r.crystalMat.emissiveIntensity=a?.1:(1.1+Math.sin(e*2.4)*.3+this.coreFlash*1.5)*l,r.crystal.rotation.y=e*.8,r.crystal.position.y=2.9+Math.sin(e*1.3)*.18;const d=a?.4:1+this.coreFlash*.12;r.crystal.scale.set(.85*d,1.4*d,.85*d),r.rings.forEach((f,g)=>{f.rotation.z=e*(.6+g*.25)*(g%2?-1:1),f.rotation.x=Math.PI/2+Math.sin(e*.5+g)*.5,f.position.y=r.crystal.position.y});for(const f of r.glows)f.mat.emissiveIntensity=f.base+Math.sin(e*f.speed)*f.amp;r.shield.material.opacity=a?0:.05+.07*o+this.coreFlash*.25,r.shield.material.color.copy(c);const h=r.group.userData.light;h.color.copy(c),h.intensity=a?.2:(1.6+o*1.4+this.coreFlash*3)*l;const u=o<.999;this.coreBar.group.visible=u,u&&(this.coreBar.set(o,null),this.coreBar.group.quaternion.copy(this.camera.quaternion)),o<.4&&!a&&(this.coreSmoke-=t,this.coreSmoke<=0&&(this.coreSmoke=o<.2?.1:.25,this.fx.puff(n.x+(Math.random()-.5)*2,Qe(n.x,n.z)+2.5,n.z+(Math.random()-.5)*2,4869458,.6,1.5,1.6)))}};Su.kinds=["tower","mgtower","barricade","trap","lab","barracks","shop"];let Ih=Su;function jp(i,t){const e=Math.max(0,Math.min(t,w.res[i]));return e<=0?0:(w.res[i]-=e,w.gold+=e*Oc[i],ie(),e)}function SE(){let i=0;for(const t of Object.keys(w.res)){const e=w.res[t];i+=e*Oc[t],w.res[t]=0}return w.gold+=i,ie(),i}const Kp=()=>Object.keys(w.res).reduce((i,t)=>i+w.res[t]*Oc[t],0);function EE(i){const t=xh[i];return w.gold<t?!1:(w.gold-=t,i==="iron"?w.keys++:w.goldKeys++,ie(),!0)}const Zp={wood:'<path d="M4 15l12-8a3 3 0 0 1 4 4L8 19a3 3 0 0 1-4-4z"/><circle cx="18" cy="9" r="1"/>',stone:'<path d="M4 17l3-8 6-3 6 5 1 6z"/><path d="M9 11l3 2 4-2"/>',chain:'<rect x="3" y="9" width="9" height="6" rx="3"/><rect x="12" y="9" width="9" height="6" rx="3"/>',herb:'<path d="M5 19C5 10 11 5 19 5c0 8-5 14-14 14z"/><path d="M5 19l8-8"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',flask:'<path d="M9 3h6M10 3v6l-5 10h14l-5-10V3"/><path d="M7.5 14h9"/>',bio:'<circle cx="12" cy="12" r="2"/><path d="M12 10V4M10.3 13 5 16M13.7 13l5.3 3"/><circle cx="12" cy="12" r="8"/>',watch:'<circle cx="12" cy="13" r="7"/><path d="M12 13V9M10 3h4"/>',pick:'<path d="M4 8c4-4 12-4 16 0"/><path d="M12 6v15"/>',heart:'<path d="M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z"/>',bag:'<rect x="5" y="8" width="14" height="13" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2M5 13h14"/>',book:'<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/>',scope:'<circle cx="12" cy="12" r="7"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',flag:'<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',shield:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',wrench:'<path d="M14 4a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9"/>',rifle:'<path d="M2 10h14l2-2h4v3h-3l-1 2h-5l-1 4h-3l1-4H2z"/><path d="M6 10V8"/>',turret:'<path d="M8 21h8l3-4-3-4H8l-3 4z"/><circle cx="12" cy="11" r="3"/><path d="M14 9l6-5"/>',ally:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><circle cx="12" cy="10" r="2"/><path d="M8.5 16c1-2 2-2.5 3.5-2.5s2.5.5 3.5 2.5"/>',up:'<path d="M6 12l6-6 6 6"/><path d="M6 18l6-6 6 6"/>',coin:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10h5"/>',res:'<path d="M12 3l8 5v8l-8 5-8-5V8z"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',skull:'<path d="M5 11a7 7 0 0 1 14 0v4h-3v4H8v-4H5z"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/>',trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',wall:'<rect x="3" y="6" width="18" height="12"/><path d="M3 12h18M9 6v6M15 12v6"/>',tree:'<path d="M12 3l6 9h-4l4 6H6l4-6H6z"/><path d="M12 18v3"/>',zombie:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',syringe:'<path d="M17 3l4 4M19 5l-11 11-4 1 1-4L16 2"/><path d="M11 8l2 2"/>',target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',shop:'<path d="M4 10v10h16V10"/><path d="M3 10l2-6h14l2 6zM10 20v-5h4v5"/>',home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10M10 20v-5h4v5"/>',barrier:'<path d="M3 9h18v6H3z"/><path d="M7 9l-3 6M13 9l-3 6M19 9l-3 6M6 15v5M18 15v5"/>',hammer:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M12 8L4 16l4 4 8-8"/>',sword:'<path d="M14 4h6v6L9 21l-3-3z"/><path d="M5 15l4 4M3 21l3-3"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',pin:'<path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>'},tn=i=>`<svg class="ic18" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Zp[i]??Zp.res}</svg>`,Jp={"🔫":"rifle","🗼":"turret","⚙️":"gear","🧱":"wall","🕸️":"target","💉":"syringe","⬆️":"up","🪙":"coin","💰":"coin","⭐":"star","🔒":"lock","💀":"skull","🏆":"trophy","⏰":"clock","🌳":"tree","🧟":"zombie","🎯":"target","🛠️":"wrench","🏰":"wall","📦":"box","⚔️":"","🪵":"wood","🪨":"stone","⛓️":"chain","🌿":"herb","☣️":"bio","⏱️":"watch","⛏️":"pick","❤️":"heart","🎒":"bag","🏠":"home","📘":"book","🔭":"scope","🚩":"flag","🛡️":"shield","✕":"x","🧪":"flask"},TE=new RegExp("(?:\\p{Extended_Pictographic}|\\p{Regional_Indicator})(?:\\uFE0F|\\u200D(?:\\p{Extended_Pictographic}))*","gu"),Uo=i=>i.replace(TE,t=>{const e=Jp[t]??Jp[t.replace(/\uFE0F/g,"")];return e===""?"":tn(e??"res")}),AE=`
.bz-root{position:fixed;inset:0;pointer-events:none;font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#eef3f6;z-index:4}
.bz-banner{position:absolute;top:56px;left:50%;transform:translateX(-50%);padding:6px 16px;border-radius:999px;background:linear-gradient(90deg,#0e2a36e6,#12384ae6);border:1px solid #7fe3ff66;font-size:13px;letter-spacing:.2px;text-shadow:0 1px 2px #000;white-space:nowrap;display:none}
.bz-banner b{color:#7fe3ff}
.bz-pal{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:none;gap:8px;padding:10px;border-radius:14px;background:#0b141bd9;border:1px solid #ffffff22;backdrop-filter:blur(6px);box-shadow:0 8px 30px #000a}
.bz-slot{position:relative;width:96px;padding:8px 6px 7px;border-radius:10px;background:#16222c;border:1px solid #ffffff1a;text-align:center;transition:transform .12s,border-color .12s}
.bz-slot.sel{border-color:#7fe3ff;background:#1b3340;transform:translateY(-6px);box-shadow:0 6px 18px #7fe3ff33}
.bz-slot.off{opacity:.55}
.bz-key{position:absolute;top:4px;left:6px;font-size:10px;color:#9fb3c0;font-weight:700}
.bz-ico{font-size:26px;line-height:32px}
.bz-nm{font-size:12px;font-weight:700;margin:2px 0 3px}
.bz-cost{font-size:10.5px;line-height:1.35;color:#c5d3dc}
.bz-cost i{font-style:normal;color:#ff7b72}
.bz-info{position:absolute;left:50%;bottom:166px;transform:translateX(-50%);min-width:320px;max-width:520px;padding:8px 14px;border-radius:10px;background:#0b141bd9;border:1px solid #ffffff22;font-size:12.5px;line-height:1.5;text-align:center;display:none}
.bz-info em{font-style:normal;color:#ffb347}
.bz-tip{position:absolute;left:50%;top:56%;transform:translateX(-50%);padding:3px 10px;border-radius:6px;background:#000a;font-size:13px;display:none;white-space:nowrap}
.bz-tip.bad{color:#ff8a80}.bz-tip.good{color:#9be9a8}
.bz-hover{position:absolute;left:50%;top:38%;transform:translateX(-50%);padding:8px 14px;border-radius:10px;background:#0b141be6;border:1px solid #ffb34766;font-size:12.5px;line-height:1.55;text-align:center;display:none}
.bz-hover b{font-size:14px}
.bz-hover kbd{background:#ffffff1c;border-radius:4px;padding:0 5px;font-family:inherit;font-size:11px}
.bz-ov{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#000b;pointer-events:auto;z-index:6}
.bz-card{width:min(640px,94vw);max-height:88vh;overflow:auto;background:linear-gradient(160deg,#1b2530,#141b23);border:1px solid #ffffff26;border-radius:16px;padding:20px 24px 18px;box-shadow:0 20px 60px #000c}
.bz-card h2{margin:0 0 2px;font-size:22px}
.bz-sub{color:#9fb3c0;font-size:12.5px;margin-bottom:12px}
.bz-gold{float:right;font-size:18px;font-weight:700;color:#f2c14e}
.bz-cols{display:grid;grid-template-columns:1.35fr 1fr;gap:18px}
@media(max-width:620px){.bz-cols{grid-template-columns:1fr}}
.bz-h{font-size:12px;color:#7fe3ff;font-weight:700;letter-spacing:.5px;margin:2px 0 6px}
.bz-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #ffffff12;font-size:13.5px}
.bz-row .n{flex:1}.bz-row small{color:#9fb3c0}
.bz-btn{background:#2f6f4e;color:#fff;border:0;border-radius:7px;padding:5px 10px;font:inherit;font-size:12.5px;cursor:pointer}
.bz-btn:hover:not(:disabled){filter:brightness(1.2)}
.bz-btn:disabled{background:#37404a;color:#8a96a0;cursor:default}
.bz-btn.gold{background:#8a6a1b}.bz-btn.sec{background:#44505f}
.bz-keybox{padding:10px;border-radius:10px;background:#101820;border:1px solid #ffffff14;margin-bottom:10px}
.bz-keybox .t{font-weight:700}.bz-keybox .d{font-size:12px;color:#9fb3c0;margin:2px 0 8px}
.bz-foot{display:flex;justify-content:space-between;align-items:center;margin-top:14px}
`,CE=".bz-ico .ic18{width:22px;height:22px;color:#2EE6D6}.ic18{width:18px;height:18px;vertical-align:-3px;color:#8FA3AD;flex:none}",RE={tower:tn("turret"),mgtower:tn("rifle"),barricade:tn("barrier"),trap:tn("target"),lab:tn("syringe"),barracks:tn("home"),shop:tn("shop")},Se=(i,t,e,n="")=>{const s=document.createElement(i);return s.className=t,n&&(s.innerHTML=n),e==null||e.appendChild(s),s};class kE{constructor(){this.slots=[],this.last=new Map,this.shopOpen=!1,this.onShopClose=()=>{};const t=document.createElement("style");t.textContent=AE+CE,document.head.appendChild(t),this.root=Se("div","bz-root",document.body),this.banner=Se("div","bz-banner",this.root),this.pal=Se("div","bz-pal",this.root),this.info=Se("div","bz-info",this.root),this.tip=Se("div","bz-tip",this.root),this.hover=Se("div","bz-hover",this.root),Nr.forEach((e,n)=>{const s=Qt[e],o=Se("div","bz-slot",this.pal,`<div class="bz-key">${n+1}</div><div class="bz-ico">${RE[e]}</div><div class="bz-nm">${s.name}</div><div class="bz-cost"></div>`);this.slots.push(o)}),this.ov=Se("div","bz-ov",document.body),this.card=Se("div","bz-card",this.ov),addEventListener("keydown",e=>{this.shopOpen&&(e.code==="Escape"||e.code==="KeyE")&&this.closeShop()}),this.ov.addEventListener("mousedown",e=>{e.target===this.ov&&this.closeShop()})}set(t,e){this.last.get(t)!==e&&(this.last.set(t,e),t.innerHTML=e)}show(t,e,n="block"){t.style.display=e?n:"none"}buildHud(t,e,n,s,o,r,a){if(this.show(this.banner,t,"block"),this.show(this.pal,t,"flex"),this.show(this.info,t,"block"),this.show(this.tip,t&&!!s&&!o,"block"),this.show(this.hover,t&&!!o,"block"),!t)return;this.set(this.banner,n==="prep"?`${tn("hammer")} <b>건설 모드</b> · 클릭 배치 · 우클릭/<b>X</b> 철거 · <b>F</b> 수리 · <b>U</b> 강화 · <b>B</b> 종료`:`${tn("sword")} 전투 중에는 건설할 수 없어요 (수리·보충은 E)`),Nr.forEach((d,h)=>{const u=Qt[d],f=tg(u.cost),g=ln.filter(x=>(u.cost[x]??0)>0).map(x=>w.res[x]<u.cost[x]?`<i>${dn[x]} ${u.cost[x]}</i>`:`${dn[x]} ${u.cost[x]}`);this.slots[h].className="bz-slot"+(h===e?" sel":"")+(f?"":" off"),this.set(this.slots[h].querySelector(".bz-cost"),g.join("<br>"))});const c=Qt[Nr[e]];let l="";if(c.turret){const d=c.turret.levels[0];l=` · 피해 ${d.dmg} · 연사 ${(1/d.rate).toFixed(1)}/s · 사거리 ${d.range}m · 탄약 ${c.turret.ammo}`}c.trap&&(l=` · 반경 ${c.trap.radius}m · 감속 ${Math.round((1-c.trap.slow)*100)}% · 초당 ${c.trap.dps}`),this.set(this.info,`<b>${c.name}</b> — ${c.desc}<br><span style="color:#9fb3c0">체력 ${c.hp}${l}</span>`+(a?`<br><em>${a}</em>`:"")),s&&(this.set(this.tip,s.text),this.tip.className="bz-tip "+(s.ok?"good":"bad")),o&&this.set(this.hover,r)}openShop(){var t;this.shopOpen=!0,this.ov.style.display="flex",(t=document.exitPointerLock)==null||t.call(document),this.renderShop()}closeShop(){this.shopOpen&&(this.shopOpen=!1,this.ov.style.display="none",this.onShopClose())}refreshShop(){this.shopOpen&&this.renderShop()}renderShop(){const t=this.card;t.innerHTML="",Se("div","bz-gold",t,`${tn("coin")} ${w.gold}`),Se("h2","",t,`${tn("shop")} 상점`),Se("div","bz-sub",t,"자원을 팔아 골드를 벌고, 골드로 상자 열쇠를 사요. (E / Esc 로 닫기)");const e=Se("div","bz-cols",t),n=Se("div","",e),s=Se("div","",e);Se("div","bz-h",n,"자원 판매");for(const l of ln){const d=Se("div","bz-row",n,`<span class="n">${dn[l]} <small>×${w.res[l]} · 개당 ${Oc[l]}G</small></span>`),h=Se("button","bz-btn",d,"1개");h.disabled=w.res[l]<1;const u=Se("button","bz-btn",d,"전부");u.disabled=w.res[l]<1,h.onclick=()=>jp(l,1),u.onclick=()=>jp(l,w.res[l])}Se("div","bz-h",s,"열쇠 구매");const o=[{kind:"iron",name:`${tn("key")} 철 열쇠`,desc:"철 상자를 열어요",have:w.keys},{kind:"gold",name:`${tn("key")} 황금 열쇠`,desc:"황금 상자를 열어요",have:w.goldKeys}];for(const l of o){const d=Se("div","bz-keybox",s,`<div class="t">${l.name} <small style="color:#9fb3c0">보유 ${l.have}</small></div><div class="d">${l.desc}</div>`),h=Se("button","bz-btn gold",d,`구매 ${xh[l.kind]}G`);h.disabled=w.gold<xh[l.kind],h.onclick=()=>EE(l.kind)}const r=Se("div","bz-foot",t),a=Se("button","bz-btn",r,`전부 팔기 +${Kp()}G`);a.disabled=Kp()<=0,a.onclick=()=>SE();const c=Se("button","bz-btn sec",r,"닫기");c.onclick=()=>this.closeShop()}}const PE=(i,t,e,n)=>{const s=Qt[i.kind],o=[`<b>${s.name}</b>${s.turret?` Lv${i.level}`:""} · 체력 ${Math.ceil(i.hp)}/${i.maxHp}`];s.turret&&o.push(`탄약 ${i.ammo}/${s.turret.ammo}`);const r=[];return t&&r.push(`<kbd>F</kbd> 수리 (${es(t)})`),e&&r.push(`<kbd>U</kbd> 강화 (${es(e.cost,e.gold)})`),r.push(`<kbd>우클릭/X</kbd> 철거 (${n})`),o.push(r.join("<br>")),o.join("<br>")},LE=["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7"];class DE{constructor(t,e,n,s){this.scene=t,this.model=e,this.panels=n,this.overlay=s,this.active=!1,this.sel=0,this.ghost=null,this.ghostKind=null,this.ghostRoot=new _t,this.ghostMats={ok:new kt({color:6750105,transparent:!0,opacity:.5,depthWrite:!1}),bad:new kt({color:16734799,transparent:!0,opacity:.5,depthWrite:!1})},this.rangeMat=new kt({color:8381439,transparent:!0,opacity:.18,side:be,depthWrite:!1}),this.prevLeft=!1,this.prevRight=!1,this.lastCell="",this.tipText=null,this.tipT=0,this.t=0,this.lockedByOther=!1,this.lastTint=null,this.lastTintKind=null,this.ghostRoot.visible=!1,t.add(this.ghostRoot);const o=new mi(.97,1,64);o.rotateX(-Math.PI/2);const r=new us(1,48);r.rotateX(-Math.PI/2),this.range=new ot(r,this.rangeMat),this.range.add(new ot(o,new kt({color:8381439,transparent:!0,opacity:.8,depthWrite:!1}))),this.range.visible=!1,t.add(this.range),H.on("wave:start",()=>{this.active&&this.exit("전투가 시작돼 건설 모드를 종료했어요")}),H.on("ui:modal",({open:a})=>{a&&this.active&&this.exit()})}toast(t){H.emit("toast",{text:t})}enter(){if(w.mode==="play"){if(w.phase!=="prep"){this.toast("전투 중에는 건설할 수 없어요 (수리·보충은 E)");return}this.active=!0,w.mode="build",this.overlay.setBuilding(!0)}}exit(t){this.active&&(this.active=!1,w.mode==="build"&&(w.mode="play"),this.overlay.setBuilding(!1),this.ghostRoot.visible=!1,this.range.visible=!1,t&&this.toast(t))}setGhost(t){this.ghostKind===t&&this.ghost||(this.ghost&&this.ghostRoot.remove(this.ghost.group),this.ghost=Dh(t,1),this.ghost.group.traverse(e=>{e.isMesh&&(e.castShadow=!1)}),this.ghostRoot.add(this.ghost.group),this.ghostKind=t)}tintGhost(t){var n;const e=t?this.ghostMats.ok:this.ghostMats.bad;(n=this.ghost)==null||n.group.traverse(s=>{s.isMesh&&(s.material=e)})}update(t,e){if(this.t+=t,it.pressed.has("KeyB")&&!this.panels.shopOpen&&(this.active?this.exit():this.enter()),this.active&&w.mode!=="build"&&this.exit(),!this.active){this.panels.buildHud(!1,0,w.phase,null,null,"",null),this.prevLeft=it.mouseDown,this.prevRight=!1;return}LE.forEach((b,v)=>{it.pressed.has(b)&&v<Nr.length&&(this.sel=v)});const n=Nr[this.sel],s=Qt[n],o=e.camera.position,r=e.aimDir,a=aE(o.x,o.y,o.z,r.x,r.y,r.z,Qe);let c=null,l={ok:!1,reason:""},d=0,h=0;if(a){let b=1/0;for(const v of this.model.buildings){const I=Math.hypot(v.x-a.x,v.z-a.z);I<v.radius+.5&&I<b&&(b=I,c=v)}d=Vp(a.x,st.core.x),h=Vp(a.z,st.core.z),l=this.model.checkPlace(n,d,h,e.player)}const u=!!a&&!c&&w.phase==="prep";if(this.ghostRoot.visible=u,this.range.visible=u&&!!(s.turret||s.trap),u){this.setGhost(n),(this.lastTint!==l.ok||this.lastTintKind!==n)&&(this.tintGhost(l.ok),this.lastTint=l.ok,this.lastTintKind=n);const b=Qe(d,h);this.ghostRoot.position.set(d,b,h),this.ghostRoot.rotation.y=mu(st.core.x-d,st.core.z-h);const v=s.turret?s.turret.levels[0].range:s.trap?s.trap.radius:0;this.range.position.set(d,b+.1,h),this.range.scale.set(v||1,1,v||1),this.rangeMat.color.setHex(l.ok?8381439:16734799)}const f=it.mouseDown,g=it.mouseRightDown&&!it.fallback||it.pressed.has("KeyX"),x=`${n}:${d},${h}`;if(a&&!c&&f&&(!this.prevLeft||n==="barricade"&&x!==this.lastCell)){this.lastCell=x;const b=this.model.place(n,d,h,e.player);b.ok||this.flashTip(b.reason,!1)}if(g&&!this.prevRight&&c){const b=this.refundText(c),v=Qt[c.kind].name;this.model.demolish(c)&&this.toast(`${v} 철거 (환급 ${b})`)}c&&(it.pressed.has("KeyF")&&this.model.repair(c),it.pressed.has("KeyU")&&this.model.upgrade(c)),this.prevLeft=f,this.prevRight=g,this.tipT-=t,this.tipT<=0&&(this.tipText=a&&!c?l.ok?{text:"클릭해서 배치",ok:!0}:{text:l.reason,ok:!1}:null);let p="";if(c){const b=c.hp<c.maxHp-.5;p=PE(c,b?this.model.repairCost(c):null,w.phase==="prep"?this.model.upgradeInfo(c):null,this.refundText(c))}const _=(a?this.overlay.nearGate(d,h):null)&&(s.turret||s.trap||n==="barricade")?"📍 레인 입구 근처 — 좀비가 몰리는 길목이에요":null;this.panels.buildHud(!0,this.sel,w.phase,this.tipText,c,p,_)}flashTip(t,e){this.tipText={text:t,ok:e},this.tipT=1.2}refundText(t){const e=Qt[t.kind],n=ym*(t.hp/t.maxHp);return ln.map(o=>({k:o,n:Math.floor((e.cost[o]??0)*n)})).filter(o=>o.n>0).map(o=>`${dn[o.k]} ${o.n}`).join(" ")||"없음"}}let yn,Qp,rd,Co,ad;const Ja=new Map;let Ro=null;const ng=i=>i?`E ${i.label}`:null,ig=()=>w.mode==="play"&&w.phase!=="ended";function IE(i){return{x:i.x,z:i.z,range:i.radius+2.4,label:()=>ig()?ng(yn.actionFor(i)):null,press:()=>{const t=yn.actionFor(i);t&&yn.perform(i,t)}}}const zE={init(i){yn=uE({obstacles:Ue,rng:Math.random}),Ro=document.getElementById("c"),ad=new pE(i.scene),Qp=new Ih(i.scene,i.camera,yn),Co=new kE,rd=new DE(i.scene,yn,Co,ad),Jr({x:st.core.x,z:st.core.z,range:Rn.radius+3,label:()=>ig()?ng(yn.coreAction()):null,press:()=>{const t=yn.coreAction();t&&(t.kind==="repair"?yn.repairCore():yn.upgradeCore())}}),H.on("interact:shop",()=>{w.mode==="play"&&(Co.openShop(),w.mode="modal",H.emit("ui:modal",{open:!0}))}),Co.onShopClose=()=>{var t;w.mode==="modal"&&(w.mode="play"),H.emit("ui:modal",{open:!1}),(t=Ro==null?void 0:Ro.requestPointerLock)==null||t.call(Ro)},H.on("run:start",()=>{rd.exit(),Co.closeShop(),yn.reset()}),H.on("loadout:apply",({turrets:t})=>{for(const e of t)yn.placeFree(e.kind,e.x,e.z)}),H.on("state:changed",()=>Co.refreshShop()),H.on("building:placed",({kind:t})=>{t==="barracks"&&H.emit("toast",{text:"숙소 완공! 아군 상한 +3"})})},update(i,t){yn.update(i,ki);for(const e of yn.buildings)if(!Ja.has(e)){const n=IE(e);Ja.set(e,n),Jr(n)}for(const[e,n]of Ja)e.dead&&(fu(n),Ja.delete(e));rd.update(i,t),Qp.update(i),ad.update(performance.now()/1e3)}},Gc=(i,t)=>Math.atan2(-i,-t),sg=(i,t,e,n)=>Math.hypot(i-e,t-n),zh=(i,t,e)=>Math.max(t,Math.min(e,i));function Vc(i,t,e){let n=((t-i+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return n=zh(n,-e,e),i+n}const Wc=()=>{const i=bn.find(t=>t.kind==="core"&&!t.dead);return i?{x:i.x,z:i.z}:{x:0,z:0}},UE=()=>{const i=bn.find(t=>t.kind==="lab"&&!t.dead);return i?{x:i.x,z:i.z}:null},di=i=>Ne.filter(t=>!t.dead&&t.role===i).length,Uh=()=>Math.min(30,w.stats.allyCap+w.allyCapBonus),gu=()=>{w.allyCount=Ne.filter(i=>!i.dead).length};function NE(){const i=[["fighter",2],["guard",1],["gatherer",2],["researcher",1],["guard",3],["gatherer",4]];for(const[t,e]of i)if(di(t)<e)return t;return Fs.filter(t=>di(t)<ze[t].max).sort((t,e)=>di(t)-di(e))[0]??"guard"}function xu(i,t){return i.role===t||di(t)<ze[t].max}function t0(i,t){return xu(i,t)?(i.role=t,i.carry=null,i.nodeId=0,i.act="idle",i.actT=0,!0):!1}function og(i,t,e,n,s=NE()){const o=Math.round(Ke.hp*w.stats.allyHp),r={id:Zr(),x:i,z:t,radius:Ke.radius,height:Ke.height,hp:o,maxHp:o,view:n,dead:!1,role:s,yaw:0,speed:0,act:"idle",actT:0,atkCd:0,swing:0,hurtT:0,sinceHit:99,slot:Ne.length,patrol:Math.random()*Math.PI*2,zType:e,born:0,carry:null,nodeId:0,deadT:0,hit(a){r.dead||a<=0||(r.hp-=a,r.hurtT=.25,r.sinceHit=0,r.hp<=0&&(r.hp=0,r.dead=!0,r.deadT=0))}};return Ne.push(r),gu(),H.emit("ally:spawned",{id:r.id,role:s}),r}function FE(){const i=[];for(let t=Ne.length-1;t>=0;t--)if(Ne[t].dead){const e=Ne.splice(t,1)[0];i.push(e),H.emit("ally:dead",{id:e.id})}return i.length&&gu(),i}function Ws(i,t,e,n,s,o,r){const a=t-i.x,c=e-i.z,l=Math.hypot(a,c);if(l>o){const d=Math.min(n,(l-o)/Math.max(s,1e-4));i.x+=a/l*d*s,i.z+=c/l*d*s,i.yaw=Vc(i.yaw,Gc(a,c),s*12),i.speed=d,i.act!=="attack"&&(i.act="move"),r.collide(i,i.radius)}return l}function vu(i,t,e){let n,s=e*e;for(const o of ki){if(o.dead||o.stunned)continue;const r=(o.x-i)**2+(o.z-t)**2;r<s&&(s=r,n=o)}return n}function rg(i,t,e,n){const s=Ke.atkRange+t.radius,o=Ws(i,t.x,t.z,Ke.speed,e,s*.8,n);return i.yaw=Vc(i.yaw,Gc(t.x-i.x,t.z-i.z),e*14),o<=s&&i.atkCd<=0?(i.atkCd=Ke.atkRate,i.swing=1,i.act="attack",i.actT=0,t.hit(Ke.dmg*w.stats.allyDmg*(.9+n.rng()*.2),!0),!0):!1}function OE(i,t,e){const n=e.player(),s=vu(i.x,i.z,Ke.aggro);if(s&&sg(s.x,s.z,n.x,n.z)<Ke.leash){rg(i,s,t,e);return}const o=Math.max(1,di("fighter")),r=i.slot/o*Math.PI*2+.6,a=n.x+Math.cos(r)*3,c=n.z+Math.sin(r)*3;Ws(i,a,c,Ke.speed*1.15,t,.6,e)<.8&&(i.act="idle")}function BE(i,t,e){const n=Wc(),s=vu(n.x,n.z,Ke.leash);if(s){rg(i,s,t,e);return}i.patrol+=t*.18;const o=i.patrol+i.slot*1.3,r=6.5+i.slot%3;Ws(i,n.x+Math.cos(o)*r,n.z+Math.sin(o)*r,Ke.speed*.45,t,.4,e)<.5&&(i.act="idle")}function HE(i,t,e){const n=UE()??Wc(),s=i.slot*2.1,o=n.x+Math.cos(s)*2.8,r=n.z+Math.sin(s)*2.8;Ws(i,o,r,Ke.speed*.7,t,.3,e)<=.6&&(i.act="work",i.yaw=Vc(i.yaw,Gc(n.x-i.x,n.z-i.z),t*6))}const e0=["wood","stone","herb","iron"];function ag(){const i=Wc();return e0.map((t,e)=>{const n=e/e0.length*Math.PI*2+.8;return{id:-(e+1),x:i.x+Math.cos(n)*20,z:i.z+Math.sin(n)*20,res:t,available:()=>!0,take:()=>1}})}function GE(i,t,e){const n=Wc();if(vu(i.x,i.z,7)){i.act="flee",Ws(i,n.x,n.z,Ke.speed*1.3,t,2,e),i.act="flee";return}if(i.carry){Ws(i,n.x,n.z,Ke.speed*.9,t,kl.carryRange,e)<=kl.carryRange+.3&&(km(i.carry.res,i.carry.amount),H.emit("resource:gathered",{res:i.carry.res,amount:i.carry.amount}),i.carry=null,i.nodeId=0,i.act="idle");return}const o=e.gatherNodes(),r=o.length?o:ag(),a=new Set(Ne.filter(l=>l!==i&&!l.dead&&l.role==="gatherer").map(l=>l.nodeId));let c=r.find(l=>l.id===i.nodeId&&l.available());if(!c){let l=1/0;for(const d of r){if(!d.available()||a.has(d.id))continue;const h=sg(d.x,d.z,n.x,n.z);h<l&&(l=h,c=d)}i.nodeId=c?c.id:0,i.actT=0}if(!c){i.act="idle";return}if(Ws(i,c.x,c.z,Ke.speed*.9,t,1.2,e)<=1.5&&(i.act="work",i.speed=0,i.yaw=Vc(i.yaw,Gc(c.x-i.x,c.z-i.z),t*8),i.actT+=t*w.stats.gatherSpeed,i.actT>=kl.time)){i.actT=0;let l=c.take();l>0&&e.rng()<w.stats.gatherExtra&&(l+=1),l>0&&(i.carry={res:c.res,amount:l})}}const VE={fighter:OE,guard:BE,gatherer:GE,researcher:HE};function WE(i,t,e){if(i.dead){i.deadT+=t;return}if(i.born+=t,i.atkCd=Math.max(0,i.atkCd-t),i.swing=Math.max(0,i.swing-t*4),i.hurtT=Math.max(0,i.hurtT-t),i.sinceHit+=t,i.sinceHit>Ke.regenDelay&&i.hp<i.maxHp&&(i.hp=Math.min(i.maxHp,i.hp+Ke.regen*t)),i.speed=0,i.act==="attack"&&i.swing<=0&&(i.act="idle"),i.born<.6){i.act="idle";return}i.act!=="attack"&&(i.act="idle"),VE[i.role](i,t,e);for(const n of Ne){if(n===i||n.dead)continue;const s=i.x-n.x,o=i.z-n.z,r=Math.hypot(s,o),a=i.radius+n.radius;if(r<a&&r>1e-4){const c=(a-r)*.5;i.x+=s/r*c,i.z+=o/r*c}}i.x=zh(i.x,-70,70),i.z=zh(i.z,-70,70)}function cg(i){const t=Mn[i],e=w.stats.vacCostMul,n=s=>s>0?Math.max(1,Math.round(s*e)):0;return{herb:n(t.herb),parts:n(t.parts),iron:n(t.iron),sample:n(t.sample),sampleSp:n(t.sampleSp)}}function lg(i){return w.res.herb>=i.herb&&w.res.parts>=i.parts&&w.res.iron>=i.iron&&w.samples>=i.sample&&w.samplesSp>=i.sampleSp}function $E(i){const t=cg(i);if(!lg(t))return!1;const e={herb:t.herb,parts:t.parts,iron:t.iron};return Ac(e)?(w.samples-=t.sample,w.samplesSp-=t.sampleSp,ie(),!0):!1}const XE=i=>i==="boss"||i==="king";function qE(i,t,e,n){const s=e>0?Math.min(1,Math.max(0,t/e)):1;let o=Mn[i].rate+(1-s)*is.lowHpBonus+w.stats.vacBonus;return XE(n)&&(o-=is.bossPenalty),Math.min(is.maxRate,Math.max(is.minRate,o))}function YE(){for(let i=Mn.length-1;i>=0;i--)if((w.vaccines[i]??0)>0)return i;return-1}function jE(i){for(let t=1;t<=Mn.length;t++){const e=(i+t+Mn.length)%Mn.length;if((w.vaccines[e]??0)>0)return e}return-1}const ti=[],Nh=i=>ep.time/(1+ep.perResearcher*i);function KE(i){return ti.length>=9||!$E(i)?!1:(ti.push({tier:i,t:0}),!0)}function ZE(i,t){const e=[],n=ti[0];return n&&(n.t+=i,n.t>=Nh(t)&&(ti.shift(),w.vaccines[n.tier]=(w.vaccines[n.tier]??0)+1,ie(),e.push(n.tier))),e}const Ce={progress:0,targetId:-1,tier:-1,heldThisFrame:!1};function JE(i,t,e=is.range){return du(ki.filter(n=>n.stunned&&!n.dead),i,t,e)}function gc(){Ce.progress=0,Ce.targetId=-1}function sa(){return(Ce.tier<0||(w.vaccines[Ce.tier]??0)<=0)&&(Ce.tier=YE()),Ce.tier}function cd(){return sa()<0?"nostock":w.allyCount>=Uh()?"cap":"none"}function yu(i){const t=sa();return t<0?0:qE(t,i.hp,i.maxHp,i.type)}function QE(i,t,e){if(Ce.targetId!==t.id&&(Ce.targetId=t.id,Ce.progress=0),Ce.progress=Math.min(1,Ce.progress+i/is.time),Ce.heldThisFrame=!0,Ce.progress<1)return{kind:"progress"};const n=sa(),s=yu(t);return w.vaccines[n]-=1,ie(),gc(),{kind:e<s?"success":"fail",tier:n,chance:s}}const tT=i=>!!i&&typeof i=="object"&&"group"in i&&"legs"in i&&"arms"in i,n0=(i,t,e,n,s,o,r,a)=>{const c=new ot(new Lt(i,t,e),new $e({color:n}));return c.position.set(s,o,r),c.castShadow=!0,a.add(c),c},ld=8837226;class eT{constructor(t,e){this.m=t,this.scene=e,this.props=new _t,this.hpBar=new _t,this.shownRole=null,this.t=Math.random()*10,this.held=[];const n=t.view;tT(n)?this.hum=n:n instanceof Re?this.hum={group:n,mats:[],legs:[],arms:[],walk:0}:(this.hum=je(ld,8947848),e.add(this.hum.group)),t.view=this.hum,this.hum.group.position.set(t.x,0,t.z),this.tint();const s=new _t,o=ze[t.role].color;this.hatMat=new $e({color:o});const r=new ot(new ae(.25,.28,.16,12),this.hatMat);r.position.y=1.96;const a=new ot(new ae(.36,.36,.03,12),this.hatMat);a.position.set(0,1.89,-.04),s.add(r,a),s.traverse(l=>l.castShadow=!0),this.hum.group.add(s,this.props),this.marker=new ot(new Ln(.13),new kt({color:o})),this.marker.position.y=2.55,this.hum.group.add(this.marker),this.crate=n0(.4,.3,.4,12159826,0,1,-.5,this.hum.group),this.crate.visible=!1;const c=new ot(new wn(1.1,.12),new kt({color:0,transparent:!0,opacity:.6,depthTest:!1}));this.hpFill=new ot(new wn(1.04,.07),new kt({color:6750088,depthTest:!1})),this.hpFill.position.z=.001,c.renderOrder=10,this.hpFill.renderOrder=11,this.hpBar.add(c,this.hpFill),this.hpBar.visible=!1,e.add(this.hpBar)}tint(){const{mats:t,group:e}=this.hum;t.length>=2?(t[0].color.setHex(4877128),t[1].color.setHex(ld)):e.traverse(n=>{const s=n;s.isMesh&&(s.material=s.material.clone(),s.material.color.lerp(new Dt(ld),.55))})}dress(t){this.shownRole=t;const e=ze[t].color;this.hatMat.color.setHex(e),this.marker.material.color.setHex(e),this.props.clear(),this.held.forEach(o=>o.removeFromParent()),this.held=[];const{arms:n}=this.hum,s=(...o)=>{const r=n0(...o);return this.held.push(r),r};n.length&&(t==="fighter"&&s(.1,.1,.9,9067051,0,-.62,-.35,n[1]),t==="guard"&&(s(.5,.6,.06,e,-.08,-.4,-.18,n[0]),s(.14,.14,.08,16777215,-.08,-.4,-.22,n[0])),t==="gatherer"&&(s(.08,.08,.9,9067051,0,-.62,-.3,n[1]),s(.5,.1,.12,10134445,0,-.62,-.75,n[1])),t==="researcher"&&(s(.34,.42,.04,15921906,0,-.62,-.18,n[0]),s(.46,.1,.04,2764600,0,1.72,-.23,this.props),s(.1,.1,.1,6737151,0,1.72,-.27,this.props)))}update(t,e){const n=this.m,s=this.hum.group,o=this.hum;this.t+=t,this.shownRole!==n.role&&this.dress(n.role);const r=o.mats;if(s.position.set(n.x,0,n.z),s.rotation.y=n.yaw,n.dead)return s.rotation.x=-Math.min(1,n.deadT/.4)*Math.PI/2,s.position.y=Math.min(1,n.deadT/.4)*.25-Math.max(0,n.deadT-1.2)*.6,this.hpBar.visible=this.marker.visible=!1,n.deadT>2?(this.dispose(),!0):!1;const a=Math.min(1,n.born/.6),c=a<1?.8+.2*(1+2.7*Math.pow(a-1,3)+1.7*Math.pow(a-1,2)):1;s.scale.setScalar(c);const l=o.arms;Hc(o,t,n.speed);let d=Math.abs(Math.sin(o.walk))*.05*(n.speed>.5?1:0);if(l.length){const f=o.legs[0].rotation.x;l[0].rotation.x=-f*.9,l[1].rotation.x=f*.9,l[0].rotation.z=l[1].rotation.z=0,a<1?l[0].rotation.x=l[1].rotation.x=-2.8+Math.sin(this.t*14)*.25:n.act==="attack"?l[1].rotation.x=-Math.sin(n.swing*Math.PI)*2.7:n.act==="flee"?l[0].rotation.x=l[1].rotation.x=-2.6+Math.sin(this.t*20)*.35:n.act==="work"?n.role==="gatherer"?l[1].rotation.x=-1.4+Math.sin(this.t*9)*.9:(l[0].rotation.x=-1.1,l[1].rotation.x=-1.2+Math.sin(this.t*6)*.25,d+=Math.abs(Math.sin(this.t*4))*.03):n.carry&&(l[0].rotation.x=l[1].rotation.x=-1.2)}s.position.y=d,this.crate.visible=!!n.carry,n.carry&&this.crate.material.color.setHex({wood:12159826,stone:10133672,iron:7175052,herb:6270542,parts:13672496}[n.carry.res]),n.act==="attack"&&s.position.addScaledVector(new L(-Math.sin(n.yaw),0,-Math.cos(n.yaw)),Math.sin(n.swing*Math.PI)*.25);const h=n.hurtT>0?.8:0;for(const f of r)f.emissive.setRGB(h,h*.1,h*.1);this.marker.position.y=2.5+Math.sin(this.t*3)*.06,this.marker.rotation.y=this.t*2;const u=n.hp<n.maxHp-.5;if(this.hpBar.visible=u,u){this.hpBar.position.set(n.x,2.9,n.z),this.hpBar.quaternion.copy(e.quaternion);const f=Math.max(.02,n.hp/n.maxHp);this.hpFill.scale.x=f,this.hpFill.position.x=-.52*(1-f),this.hpFill.material.color.setHex(f>.5?6750088:f>.25?16765514:16733525)}return!1}dispose(){this.scene.remove(this.hum.group,this.hpBar)}}class nT{constructor(t){this.scene=t,this.sparks=[],this.geo=new Lt(.12,.12,.12),this.ringMat=new kt({color:6750088,transparent:!0,opacity:.8,side:be,depthWrite:!1}),this.colMat=new kt({color:6750088,transparent:!0,opacity:.18,side:be,depthWrite:!1});for(let e=0;e<80;e++){const n=new ot(this.geo,new kt({color:6750088,transparent:!0}));n.visible=!1,t.add(n),this.sparks.push({m:n,vx:0,vy:0,vz:0,life:0,max:1,active:!1})}this.ring=new ot(new mi(.85,1,40),this.ringMat),this.ring.rotation.x=-Math.PI/2,this.column=new ot(new ae(1,1,2.6,32,1,!0),this.colMat),this.ring.visible=this.column.visible=!1,t.add(this.ring,this.column)}burst(t,e,n,s,o,r=4){for(const a of this.sparks){if(o<=0)break;if(a.active)continue;o--,a.active=!0,a.life=a.max=.5+Math.random()*.6;const c=Math.random()*Math.PI*2,l=Math.random()*r*.6;a.vx=Math.cos(c)*l,a.vz=Math.sin(c)*l,a.vy=2+Math.random()*r,a.m.position.set(t,e,n),a.m.material.color.setHex(s),a.m.visible=!0}}beam(t,e,n,s){const o=1.6-n*.9;this.ring.visible=this.column.visible=!0,this.ring.position.set(t,.06,e),this.ring.scale.setScalar(o),this.ring.rotation.z=s*3,this.column.position.set(t,1.3,e),this.column.scale.set(o*.9,1,o*.9),this.colMat.opacity=.05+n*.12,this.ringMat.opacity=.5+n*.5}hideBeam(){this.ring.visible=this.column.visible=!1}update(t){for(const e of this.sparks){if(!e.active)continue;if(e.life-=t,e.life<=0){e.active=!1,e.m.visible=!1;continue}e.vy-=9*t,e.m.position.x+=e.vx*t,e.m.position.y=Math.max(.05,e.m.position.y+e.vy*t),e.m.position.z+=e.vz*t;const n=e.life/e.max;e.m.scale.setScalar(.4+n),e.m.material.opacity=Math.min(1,n*1.5)}}}const iT={wood:10185274,stone:10133672,iron:7175052,herb:5221957,parts:13672496};class sT{constructor(t){this.scene=t,this.g=new _t,this.built=!1,this.g.visible=!1,t.add(this.g)}sync(t){if(t&&!this.built){this.built=!0;for(const e of ag()){const n=new ot(new Lt(1.4,.7,1.4),new $e({color:8022608}));n.position.set(e.x,.35,e.z),n.castShadow=n.receiveShadow=!0;const s=new ot(new Lt(1,.5,1),new $e({color:iT[e.res]}));s.position.set(e.x,.95,e.z),s.rotation.y=.4,s.castShadow=!0,this.g.add(n,s)}}this.g.visible=t}}const oT=`
.al-inj{position:fixed;left:50%;top:58%;transform:translateX(-50%);z-index:4;pointer-events:none;display:none;text-align:center;font-family:inherit;color:#eaffee;text-shadow:0 2px 4px #000}
.al-inj .l{font-size:15px;font-weight:700;margin-bottom:6px}.al-inj .l b{color:#7dffa0}
.al-inj .t{width:240px;height:12px;border-radius:8px;background:#0009;border:1px solid #7dffa066;overflow:hidden;box-shadow:0 0 18px #3f6}
.al-inj .f{height:100%;width:0;background:linear-gradient(90deg,#2fd06b,#b6ff6a)}
.al-banner{position:fixed;left:50%;top:30%;transform:translate(-50%,0) scale(.6);z-index:6;pointer-events:none;font-size:46px;font-weight:900;letter-spacing:1px;opacity:0;text-shadow:0 4px 0 #000a,0 0 24px currentColor;white-space:nowrap;font-family:inherit}
.al-banner.go{animation:alpop 1.6s ease-out forwards}
.al-banner small{display:block;font-size:17px;font-weight:600;letter-spacing:0;opacity:.9;text-align:center}
@keyframes alpop{0%{opacity:0;transform:translate(-50%,10px) scale(.5)}15%{opacity:1;transform:translate(-50%,0) scale(1.12)}28%{transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-30px) scale(1)}}
`;let i0=!1;function dg(i,t){if(document.getElementById(i))return;const e=document.createElement("style");e.id=i,e.textContent=t,document.head.appendChild(e)}class rT{constructor(){this.box=document.createElement("div"),this.label=document.createElement("div"),this.fill=document.createElement("div"),this.banner=document.createElement("div"),i0||(dg("al-inject-css",oT),i0=!0),this.box.className="al-inj",this.label.className="l";const t=document.createElement("div");t.className="t",this.fill.className="f",t.appendChild(this.fill),this.box.append(this.label,t),this.banner.className="al-banner",document.body.append(this.box,this.banner)}show(t,e){this.box.style.display="block",this.label.innerHTML=t,this.fill.style.width=`${Math.round(e*100)}%`}hide(){this.box.style.display="none"}flash(t,e,n){this.banner.style.color=n,this.banner.innerHTML=`${t}<small>${e}</small>`,this.banner.classList.remove("go"),this.banner.offsetWidth,this.banner.classList.add("go")}}const aT=`
.al-ov{position:fixed;inset:0;z-index:8;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,#0a1410cc,#000d);backdrop-filter:blur(3px);font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#e8f2ec;user-select:none}
.al-ov.on{display:flex;animation:alfade .18s ease-out}
@keyframes alfade{from{opacity:0}to{opacity:1}}
.al-card{width:min(960px,94vw);max-height:90vh;display:flex;flex-direction:column;background:linear-gradient(160deg,#16211d,#0f1614);border:1px solid #5fe39a33;border-radius:16px;box-shadow:0 20px 70px #000,0 0 0 1px #000,inset 0 1px 0 #ffffff12;overflow:hidden}
.al-card header{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;background:linear-gradient(90deg,#1e3a2c,#16211d);border-bottom:1px solid #5fe39a2a}
.al-card h2{margin:0;font-size:21px;letter-spacing:.5px}.al-card header p{margin:2px 0 0;font-size:12.5px;opacity:.65}
.al-tt{display:flex;gap:14px;align-items:center}.al-ico .ic18{width:24px;height:24px;color:#07130c}.al-ico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:radial-gradient(circle at 30% 25%,#7dffa0,#1f8a4c);box-shadow:0 0 18px #3fd57a66}
.al-x{display:grid;place-items:center;background:#ffffff10;border:1px solid #ffffff20;color:#fff;width:34px;height:34px;border-radius:10px;font-size:16px;cursor:pointer}.al-x:hover{background:#ffffff22}
.al-body{display:grid;grid-template-columns:1.05fr 1fr;gap:0;overflow:auto;min-height:0}
.al-col{padding:18px 22px;min-width:0}.al-col+.al-col{border-left:1px solid #ffffff10;background:#0000002a}
.al-col h3{margin:0 0 12px;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#8fe8b3;display:flex;justify-content:space-between;align-items:baseline}
.al-col h3 span{font-size:15px;color:#fff;letter-spacing:0}
.al-vc{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:12px;margin-bottom:10px;border-radius:12px;background:#ffffff08;border:1px solid #ffffff12;transition:.15s}
.al-vc:hover{background:#ffffff0f;border-color:#5fe39a40}
.al-bd{width:46px;height:58px;border-radius:9px 9px 14px 14px;position:relative;display:grid;place-items:end center;padding-bottom:6px;font-weight:900;font-size:12px;color:#00000099;box-shadow:inset 0 -10px 16px #0004,0 4px 10px #0006}
.al-bd::before{content:'';position:absolute;top:-7px;left:15px;width:16px;height:9px;border-radius:3px 3px 0 0;background:#c9d2cf}
.al-bd.t0{background:linear-gradient(#bfe6c8,#6fbf86)}.al-bd.t1{background:linear-gradient(#a8d4ff,#5a95e0)}.al-bd.t2{background:linear-gradient(#ffe99a,#e0a82a)}
.al-vn{font-weight:800;font-size:15px}.al-vn small{margin-left:6px;font-weight:600;color:#8fe8b3;font-size:12px}
.al-ch{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.al-ch i{font-style:normal;font-size:11.5px;padding:2px 7px;border-radius:20px;background:#ffffff10;border:1px solid #ffffff14}
.al-ch i.no{background:#5a1f1f;border-color:#ff6b6b66;color:#ffb0b0}
.al-own{margin-top:5px;font-size:12px;opacity:.7}.al-own b{color:#fff;font-size:14px}
.al-btn{background:linear-gradient(#35c477,#1f9a55);color:#04210f;border:0;border-radius:10px;padding:9px 14px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #0f5a30,0 6px 14px #0006;transition:.08s}
.al-btn:hover:not(:disabled){filter:brightness(1.12)}.al-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 #0f5a30}
.al-btn:disabled{background:#3a423e;color:#8a948f;box-shadow:none;cursor:not-allowed}
.al-q{margin-top:14px;padding:12px;border-radius:12px;background:#0006;border:1px dashed #5fe39a44}
.al-q .h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:7px;opacity:.85}
.al-pb{height:10px;border-radius:6px;background:#000a;overflow:hidden;border:1px solid #ffffff14}.al-pb div{height:100%;width:0;background:linear-gradient(90deg,#35c477,#c6ff7a)}
.al-qs{display:flex;gap:5px;margin-top:8px;min-height:20px}.al-qs i{width:20px;height:20px;border-radius:5px;opacity:.9}
.al-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
.al-sum div{text-align:center;padding:7px 2px;border-radius:10px;background:#ffffff08;border:1px solid #ffffff10;font-size:11.5px}.al-sum b{display:block;font-size:19px;margin-top:1px}
.al-list{display:flex;flex-direction:column;gap:7px}
.al-ar{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;padding:9px 10px;border-radius:11px;background:#ffffff08;border:1px solid #ffffff10}
.al-face{width:34px;height:34px;border-radius:9px;background:#7ed860;position:relative;box-shadow:inset 0 -6px 0 #0002}
.al-face::before{content:'';position:absolute;left:0;right:0;top:-5px;height:11px;border-radius:7px 7px 2px 2px;background:var(--c)}
.al-face::after{content:'';position:absolute;left:8px;top:14px;width:5px;height:5px;background:#142;border-radius:50%;box-shadow:12px 0 0 #142}
.al-an{font-weight:700;font-size:13.5px;display:flex;justify-content:space-between}.al-an small{font-weight:600;opacity:.65}
.al-hp{height:5px;border-radius:4px;background:#000a;margin-top:4px;overflow:hidden}.al-hp div{height:100%;background:#5fe39a}
.al-rs{grid-column:1/3;display:flex;gap:5px}
.al-rb{flex:1;border:1px solid #ffffff18;background:#ffffff0a;color:#dfe9e3;border-radius:8px;padding:5px 0;font-size:12px;cursor:pointer;font-family:inherit;font-weight:700}
.al-rb:hover:not(:disabled){background:#ffffff1c}.al-rb.on{background:var(--c);color:#111;border-color:transparent}.al-rb:disabled{opacity:.3;cursor:not-allowed}
.al-empty{padding:28px 12px;text-align:center;opacity:.65;font-size:13.5px;line-height:1.7;border:1px dashed #ffffff22;border-radius:12px}
.al-card footer{padding:10px 22px;font-size:12px;opacity:.6;border-top:1px solid #ffffff10;background:#0004}
@media (max-width:760px){.al-body{grid-template-columns:1fr}.al-col+.al-col{border-left:0;border-top:1px solid #ffffff10}}
`,dd=i=>"#"+i.toString(16).padStart(6,"0"),cT=["초","중","고"],lT=["herb","parts","iron"];class dT{constructor(t){this.ov=document.createElement("div"),this.sig="",this.open=!1,this.closedAt=-99,this.actions=t,dg("al-lab-css",aT),this.ov.className="al-ov",document.body.appendChild(this.ov),this.ov.addEventListener("click",e=>{const n=e.target.closest("[data-act]");if(e.target===this.ov)return t.close();if(!n||n.disabled)return;const s=n.dataset.act;s==="close"?t.close():s==="craft"?(t.craft(+n.dataset.tier),this.render(!0)):s==="role"&&(t.setRole(+n.dataset.id,n.dataset.role),this.render(!0))})}show(){this.open=!0,this.ov.classList.add("on"),this.render(!0)}hide(){this.open=!1,this.ov.classList.remove("on")}tick(t){if(!this.open)return;this.render(!1);const e=ti[0],n=this.ov.querySelector(".al-pb div");n&&(n.style.width=e?`${Math.min(100,e.t/Nh(t)*100)}%`:"0%");const s=Ne;this.ov.querySelectorAll("[data-hp]").forEach(o=>{const r=s.find(a=>a.id===+o.dataset.hp);r&&(o.style.width=`${r.hp/r.maxHp*100}%`)})}render(t){var r;const e=Ne.filter(a=>!a.dead),n=JSON.stringify([w.vaccines,w.res,w.samples,w.samplesSp,w.stats.vacCostMul,ti.map(a=>a.tier),e.map(a=>[a.id,a.role]),Uh()]);if(!t&&n===this.sig)return;this.sig=n;const s=((r=this.ov.querySelector(".al-body"))==null?void 0:r.scrollTop)??0;this.ov.innerHTML=`
    <div class="al-card" role="dialog" aria-label="연구소">
      <header>
        <div class="al-tt"><div class="al-ico">${tn("syringe")}</div><div><h2>연구소</h2><p>백신을 만들어 기절한 좀비를 우리 편으로</p></div></div>
        <button class="al-x" data-act="close" aria-label="닫기">${tn("x")}</button>
      </header>
      <div class="al-body">
        <section class="al-col">
          <h3>백신 제작</h3>
          ${Mn.map((a,c)=>this.vaccineCard(c)).join("")}
          ${this.queueBox()}
        </section>
        <section class="al-col">
          <h3>아군 명단 <span>${e.length} / ${Uh()}</span></h3>
          <div class="al-sum">${Fs.map(a=>`<div style="color:${dd(ze[a].color)}">${ze[a].name}<b>${di(a)}</b></div>`).join("")}</div>
          ${e.length?`<div class="al-list">${e.map(a=>this.allyRow(a)).join("")}</div>`:'<div class="al-empty">아직 아군이 없다.<br>좀비를 쏴서 <b>기절</b>시킨 뒤<br>가까이 가서 <b>E</b>를 길게 눌러 백신을 놓자!</div>'}
        </section>
      </div>
      <footer>Esc 닫기 · 필드에서 C = 백신 바꾸기 · Q = 가까운 아군 역할 바꾸기 · 연구 보조가 있으면 제작이 빨라진다</footer>
    </div>`;const o=this.ov.querySelector(".al-body");o&&(o.scrollTop=s)}vaccineCard(t){const e=Mn[t],n=cg(t),s=[],o=(a,c,l)=>c>0?s.push(`<i class="${l>=c?"":"no"}">${a} ${l}/${c}</i>`):0;for(const a of lT)o(dn[a],n[a],w.res[a]);o("일반 샘플",n.sample,w.samples),o("특수 샘플",n.sampleSp,w.samplesSp);const r=lg(n)&&ti.length<9;return`<div class="al-vc">
      <div class="al-bd t${t}">${cT[t]}</div>
      <div><div class="al-vn">${e.name}<small>기본 성공률 ${Math.round(e.rate*100)}%</small></div>
        <div class="al-ch">${s.join("")}</div>
        <div class="al-own">보유 <b>${w.vaccines[t]??0}</b>개</div></div>
      <button class="al-btn" data-act="craft" data-tier="${t}" ${r?"":"disabled"}>제작</button>
    </div>`}queueBox(){const t=di("researcher"),e=Nh(t).toFixed(1);return`<div class="al-q">
      <div class="al-h h"><span>제작 대기열 ${ti.length?`(${ti.length})`:""}</span><span>1개당 ${e}초${t?` · 연구 보조 ${t}명`:""}</span></div>
      <div class="al-pb"><div></div></div>
      <div class="al-qs">${ti.map((n,s)=>`<i class="t${n.tier}" style="background:${["#7fcf95","#6aa5ee","#eab43c"][n.tier]};${s===0?"outline:2px solid #fff8":""}"></i>`).join("")||'<span style="font-size:12px;opacity:.5">비어 있음</span>'}</div>
    </div>`}allyRow(t){const e=ze[t.role];return`<div class="al-ar" style="--c:${dd(e.color)}">
      <div class="al-face"></div>
      <div><div class="al-an"><span>좀비 #${t.id} <small>(${e.name})</small></span><small>${Math.ceil(t.hp)}/${t.maxHp}</small></div>
        <div class="al-hp"><div data-hp="${t.id}" style="width:${t.hp/t.maxHp*100}%"></div></div></div>
      <div class="al-rs">${Fs.map(n=>`<button class="al-rb ${t.role===n?"on":""}" style="--c:${dd(ze[n].color)}" data-act="role" data-id="${t.id}" data-role="${n}" title="${ze[n].desc}" ${xu(t,n)?"":"disabled"}>${ze[n].name}</button>`).join("")}</div>
    </div>`}}let hg=()=>[];const An=i=>H.emit("toast",{text:i}),hT={rng:Math.random,collide:(i,t)=>lu(i,t),player:()=>ug.player,gatherNodes:()=>hg()};let ug,Ge,Pc=0,Ai,Wr,s0,Di;const Ss=new Map,ko=[],o0=()=>di("researcher");function hd(){Di.open&&(Di.hide(),Di.closedAt=Pc,H.emit("ui:modal",{open:!1}))}function uT(){var i;Di.open||Pc-Di.closedAt<.3||(Di.show(),(i=document.exitPointerLock)==null||i.call(document),H.emit("ui:modal",{open:!0}))}function fT(i,t,e){H.emit("zombie:converted",{id:i.id,type:i.type});const n=og(i.x,i.z,i.type,i.view);Ai.burst(i.x,1,i.z,6750088,40,6),Ai.burst(i.x,2,i.z,15335290,14,4),Wr.flash("아군 영입!",`${Mn[t].name} 성공 (${Math.round(e*100)}%) · ${ze[n.role].name} 배치`,"#7dffa0"),An(`좀비가 우리 편이 됐다! (${ze[n.role].name})`)}function pT(i,t,e){H.emit("zombie:inject-failed",{id:i.id}),Ai.burst(i.x,1,i.z,16733525,24,5),Wr.flash("주사 실패…",`${Mn[t].name} 소모 (성공률 ${Math.round(e*100)}%) · 좀비가 깨어난다!`,"#ff7a7a"),An("백신이 듣지 않았다! 좀비가 분노한다")}const mT={get x(){return(Ge==null?void 0:Ge.x)??1e6},get z(){return(Ge==null?void 0:Ge.z)??1e6},range:is.range,label(){if(!Ge||Ge.dead||!Ge.stunned)return null;const i=cd();return i==="nostock"?"백신이 없다 — 연구소에서 제작하자":i==="cap"?`아군 상한에 도달 (${w.allyCount}) — 숙소·스킬로 늘리자`:`E 길게 눌러 ${Mn[sa()].name} 주사 · 성공률 ${Math.round(yu(Ge)*100)}% · C 백신 변경`},press(){const i=cd();i==="nostock"?An("백신이 없다. 연구소에서 만들어 오자"):i==="cap"&&An("아군이 가득 찼다")},hold(i){if(!Ge||Ge.dead||!Ge.stunned||cd()!=="none")return;const t=Ge,e=QE(i,t,Math.random());e.kind==="success"?fT(t,e.tier,e.chance):e.kind==="fail"&&pT(t,e.tier,e.chance)}},gT={init(i){ug=i,Ai=new nT(i.scene),s0=new sT(i.scene),Wr=new rT,Di=new dT({craft:t=>{KE(t)||An("재료가 부족하다")},setRole:(t,e)=>{const n=Ne.find(s=>s.id===t);n&&!t0(n,e)&&An(`${ze[e].name}은(는) 더 배치할 수 없다`)},close:hd}),Jr(mT),H.on("interact:lab",uT),H.on("player:hit",()=>{Ce.progress>.05&&An("주사가 취소됐다!"),gc()}),H.on("run:start",()=>{hd(),gc(),Ce.tier=-1,ti.length=0;for(const t of Ne)t.dead=!0;Ne.length=0;for(const t of Ss.values())t.dispose();Ss.clear();for(const t of ko)t.v.dispose();ko.length=0,w.allyCount=0,w.vaccines=[0,0,0],w.samples=0,w.samplesSp=0,ie()}),H.on("loadout:apply",({allies:t})=>{t.forEach((e,n)=>{if(!(e.role in ze))return;const s=n/Math.max(1,t.length)*Math.PI*2;og(st.core.x+Math.cos(s)*5,st.core.z+Math.sin(s)*5,"normal",null,e.role)}),ie()}),addEventListener("keydown",t=>{t.code==="Escape"&&hd()})},update(i,t){if(Pc+=i,Ge=JE(t.player.x,t.player.z,is.range+.8),!Ce.heldThisFrame&&Ce.progress>0&&gc(),Ce.heldThisFrame=!1,w.mode!=="modal"&&!Di.open){if(it.pressed.has("KeyC")){const e=jE(Ce.tier<0?-1:Ce.tier);e<0?An("보유한 백신이 없다"):(Ce.tier=e,An(`${Mn[e].name} 선택 (보유 ${w.vaccines[e]})`))}if(it.pressed.has("KeyQ")){let e,n=36;for(const s of Ne){const o=(s.x-t.player.x)**2+(s.z-t.player.z)**2;!s.dead&&o<n&&(n=o,e=s)}if(!e)An("가까운 아군이 없다");else{const s=Fs.indexOf(e.role);for(let o=1;o<=Fs.length;o++){const r=Fs[(s+o)%Fs.length];if(xu(e,r)){t0(e,r),An(`좀비 #${e.id} → ${ze[r].name}`);break}}}}}for(const e of ZE(i,o0()))An(`${Mn[e].name} 제작 완료!`),Ai.burst(t.player.x,2,t.player.z,10354613,10,3);for(const e of Ne)WE(e,i,hT);for(const e of FE()){const n=Ss.get(e.id);n&&(Ss.delete(e.id),ko.push({v:n,m:e})),An("아군이 쓰러졌다…"),Ai.burst(e.x,1,e.z,10134944,12,3)}gu();for(const e of Ne)Ss.has(e.id)||Ss.set(e.id,new eT(e,t.scene));for(const e of Ss.values())e.update(i,t.camera);for(let e=ko.length-1;e>=0;e--)ko[e].v.update(i,t.camera)&&ko.splice(e,1);s0.sync(hg().length===0&&di("gatherer")>0),Ce.progress>0&&Ge?(Ai.beam(Ge.x,Ge.z,Ce.progress,Pc),Wr.show(`<b>${Mn[sa()].name}</b> 주사 중… 성공률 ${Math.round(yu(Ge)*100)}%`,Ce.progress)):(Ai.hideBeam(),Wr.hide()),Ai.update(i),Di.tick(o0())}};let Es,ud,fd,pd,md=0;const xT={init(){Es=document.getElementById("wave"),ud=document.getElementById("sub"),fd=document.getElementById("res"),pd=document.getElementById("help"),pd&&(pd.style.display="none")},update(i){if(md+=i,!(md<.2)){if(md=0,Es){const t=w.phase==="ended"?w.wave>=50?"클리어!":"런 종료":`웨이브 ${w.wave}`;Es.textContent!==t&&(Es.textContent=t,Es.classList.remove("pop"),Es.offsetWidth,Es.classList.add("pop"))}ud&&(ud.textContent=w.phase==="prep"?`준비 ${Math.ceil(w.prepLeft)}초 · N 으로 바로 시작`:`남은 좀비 ${w.waveRemaining} · 핵 ${Math.ceil(w.coreHp)}/${w.coreMaxHp}`),fd&&(fd.textContent=ln.map(t=>`${dn[t]} ${w.res[t]}`).join("  ")+`  · 골드 ${w.gold}`)}}},fg="zt3d.meta.v1",Pt={currency:0,totalRuns:0,bestWave:0,bestCheckpoint:0,upgrades:{},facilities:{},lastSeen:0,wallet:{},skills:{},totalKills:0,turrets:[],allies:[],equipped:[]};function vT(){try{const i=localStorage.getItem(fg);if(!i)return;const t=JSON.parse(i);for(const e of["currency","totalRuns","bestWave","bestCheckpoint","lastSeen","totalKills"])typeof t[e]=="number"&&isFinite(t[e])&&(Pt[e]=t[e]);for(const e of["upgrades","facilities","wallet","skills"]){const n=t[e];if(n&&typeof n=="object"){const s={};for(const[o,r]of Object.entries(n))typeof r=="number"&&isFinite(r)&&r>=0&&(s[o]=r);Pt[e]=s}}Array.isArray(t.turrets)&&(Pt.turrets=t.turrets.filter(e=>e&&typeof e.kind=="string"&&isFinite(e.x)&&isFinite(e.z)).map(e=>({kind:e.kind,x:+e.x,z:+e.z}))),Array.isArray(t.allies)&&(Pt.allies=t.allies.filter(e=>e&&typeof e.role=="string").map(e=>({role:e.role}))),Array.isArray(t.equipped)&&(Pt.equipped=t.equipped.filter((e,n,s)=>typeof e=="string"&&s.indexOf(e)===n).slice(0,3))}catch{}}function $s(){try{localStorage.setItem(fg,JSON.stringify(Pt))}catch{}}function yT(){Object.assign(Pt,{currency:0,totalRuns:0,bestWave:0,bestCheckpoint:0,upgrades:{},facilities:{},lastSeen:0,wallet:{},skills:{},totalKills:0,turrets:[],allies:[],equipped:[]}),$s()}const bT=["gold","wood","stone","iron","herb","parts","samples","samplesSp","skillPoints"],gd={gold:"골드",wood:"나무",stone:"돌",iron:"철",herb:"약초",parts:"부품",samples:"샘플",samplesSp:"특수 샘플",skillPoints:"스킬 포인트"},xd={gold:"🪙",wood:"🪵",stone:"🪨",iron:"⛓️",herb:"🌿",parts:"⚙️",samples:"🧪",samplesSp:"☣️",skillPoints:"⭐"},vd={wood:14,stone:8,herb:2},Xs=[{id:"w_pistol",cat:"weapon",name:"권총 품질",desc:"권총 강화 +1단계",icon:"🔫",max:8,cost:{gold:50,iron:1},costGrowth:1.55,effect:{kind:"weaponLv",weapon:"pistol",per:1}},{id:"w_shotgun_q",cat:"weapon",name:"샷건 품질",desc:"샷건 강화 +1단계",icon:"🔫",max:8,cost:{gold:180,iron:4},costGrowth:1.6,effect:{kind:"weaponLv",weapon:"shotgun",per:1},requires:{id:"w_shotgun",lv:1}},{id:"w_smg_q",cat:"weapon",name:"기관총 품질",desc:"기관총 강화 +1단계",icon:"🔫",max:8,cost:{gold:420,parts:3},costGrowth:1.65,effect:{kind:"weaponLv",weapon:"smg",per:1},requires:{id:"w_smg",lv:1}},{id:"w_all",cat:"weapon",name:"병기 정비",desc:"모든 총기 강화 +1단계",icon:"🛠️",max:5,cost:{gold:300,parts:4},costGrowth:1.8,effect:{kind:"weaponLv",weapon:"*",per:1}},{id:"w_mul",cat:"weapon",name:"총열 정밀 가공",desc:"모든 무기 공격력 +6%",icon:"🎯",max:10,cost:{gold:90,parts:1},costGrowth:1.5,effect:{kind:"dmgMul",per:.06}},{id:"w_shotgun",cat:"weapon",name:"샷건 시작 보유",desc:"매 런 샷건을 들고 시작",icon:"🔫",max:1,cost:{gold:400,iron:12,parts:2},costGrowth:1,effect:{kind:"weapon",id:"shotgun"}},{id:"w_smg",cat:"weapon",name:"기관총 시작 보유",desc:"매 런 기관총을 들고 시작",icon:"🔫",max:1,cost:{gold:1200,parts:8,samples:6},costGrowth:1,effect:{kind:"weapon",id:"smg"},requires:{id:"w_shotgun",lv:1}},{id:"w_magnum",cat:"weapon",name:"매그넘 해금",desc:"매그넘을 보유(로드아웃에 장착 가능)",icon:"🔫",max:1,cost:{gold:900,iron:10,parts:4},costGrowth:1,effect:{kind:"weapon",id:"magnum"},requires:{id:"w_shotgun",lv:1}},{id:"w_rifle",cat:"weapon",name:"라이플 해금",desc:"라이플을 보유(로드아웃에 장착 가능)",icon:"🔫",max:1,cost:{gold:2200,iron:14,parts:10,samples:6},costGrowth:1,effect:{kind:"weapon",id:"rifle"},requires:{id:"w_smg",lv:1}},{id:"w_sniper",cat:"weapon",name:"저격총 해금",desc:"저격총을 보유(로드아웃에 장착 가능)",icon:"🔭",max:1,cost:{gold:4500,iron:20,parts:16,samples:12},costGrowth:1,effect:{kind:"weapon",id:"sniper"},requires:{id:"w_rifle",lv:1}},{id:"w_magnum_q",cat:"weapon",name:"매그넘 품질",desc:"매그넘 강화 +1단계",icon:"🔫",max:8,cost:{gold:320,iron:5},costGrowth:1.62,effect:{kind:"weaponLv",weapon:"magnum",per:1},requires:{id:"w_magnum",lv:1}},{id:"w_rifle_q",cat:"weapon",name:"라이플 품질",desc:"라이플 강화 +1단계",icon:"🔫",max:8,cost:{gold:600,parts:4},costGrowth:1.66,effect:{kind:"weaponLv",weapon:"rifle",per:1},requires:{id:"w_rifle",lv:1}},{id:"w_sniper_q",cat:"weapon",name:"저격총 품질",desc:"저격총 강화 +1단계",icon:"🔭",max:8,cost:{gold:900,parts:6},costGrowth:1.7,effect:{kind:"weaponLv",weapon:"sniper",per:1},requires:{id:"w_sniper",lv:1}},{id:"w_recoil",cat:"weapon",name:"반동 제어",desc:"모든 총기 반동 -8%",icon:"🎯",max:5,cost:{gold:120,iron:2},costGrowth:1.6,effect:{kind:"recoilMul",per:-.08}},{id:"b_core",cat:"base",name:"핵 장갑 보강",desc:"핵 최대 체력 +80",icon:"🛡️",max:10,cost:{gold:70,stone:8},costGrowth:1.45,effect:{kind:"coreHp",per:80}},{id:"b_hp",cat:"base",name:"단련",desc:"플레이어 최대 체력 +15",icon:"❤️",max:8,cost:{gold:80,herb:6},costGrowth:1.5,effect:{kind:"maxHp",per:15}},{id:"b_wood",cat:"base",name:"목재 비축",desc:"런 시작 나무 +10",icon:"🪵",max:8,cost:{gold:40,wood:15},costGrowth:1.4,effect:{kind:"startRes",res:"wood",per:10}},{id:"b_stone",cat:"base",name:"석재 비축",desc:"런 시작 돌 +8",icon:"🪨",max:8,cost:{gold:45,stone:12},costGrowth:1.4,effect:{kind:"startRes",res:"stone",per:8}},{id:"t_dmg",cat:"turret",name:"포탑 탄두 강화",desc:"포탑 피해 +20%",icon:"🗼",max:10,cost:{gold:100,iron:4},costGrowth:1.5,effect:{kind:"turretDmgMul",per:.2}},{id:"t_iron",cat:"turret",name:"철 보급",desc:"런 시작 철 +3",icon:"⛓️",max:6,cost:{gold:70,iron:5},costGrowth:1.45,effect:{kind:"startRes",res:"iron",per:3},requires:{id:"t_dmg",lv:1}},{id:"t_parts",cat:"turret",name:"부품 재활용",desc:"런 시작 부품 +2",icon:"⚙️",max:5,cost:{gold:160,parts:3},costGrowth:1.6,effect:{kind:"startRes",res:"parts",per:2},requires:{id:"t_dmg",lv:2}},{id:"a_cap",cat:"ally",name:"숙소 확장",desc:"아군 상한 +1",icon:"🏠",max:6,cost:{gold:150,wood:20,samples:2},costGrowth:1.7,effect:{kind:"allyCap",per:1}},{id:"a_sample",cat:"ally",name:"샘플 냉동고",desc:"런 시작 샘플 +2",icon:"🧪",max:6,cost:{gold:90,herb:8},costGrowth:1.45,effect:{kind:"startSamples",per:2}},{id:"a_herb",cat:"ally",name:"약초 상비",desc:"런 시작 약초 +4",icon:"🌿",max:6,cost:{gold:50,herb:8},costGrowth:1.4,effect:{kind:"startRes",res:"herb",per:4}},{id:"e_gold",cat:"econ",name:"출격 지원금",desc:"런 시작 골드 +25",icon:"🪙",max:10,cost:{gold:60},costGrowth:1.5,effect:{kind:"startGold",per:25}},{id:"e_keep",cat:"econ",name:"철수 보급",desc:"사망 시 남은 자원 회수율 +6%",icon:"🎒",max:8,cost:{gold:120,wood:20},costGrowth:1.5,effect:{kind:"keepRatio",per:.06}},{id:"e_gather",cat:"econ",name:"채집 효율",desc:"채집 속도 +10%",icon:"⛏️",max:8,cost:{gold:80,wood:15},costGrowth:1.45,effect:{kind:"gatherSpeed",per:.1}},{id:"e_prep",cat:"base",name:"준비 시간 연장",desc:"웨이브 준비 시간 +3초",icon:"⏱️",max:8,cost:{gold:90,wood:10},costGrowth:1.5,effect:{kind:"prepBonus",per:3}},{id:"e_wave",cat:"base",name:"전진 기지",desc:"시작 웨이브 +1 (달성한 체크포인트까지)",icon:"🚩",max:10,cost:{gold:250,iron:5},costGrowth:1.7,effect:{kind:"startWave",per:1}},{id:"e_sp",cat:"econ",name:"교범 학습",desc:"런 시작 스킬 포인트 +1",icon:"📘",max:5,cost:{gold:300,samples:4},costGrowth:1.9,effect:{kind:"startSkillPoints",per:1}}],MT=.7,_T=25,wT=1,pg={skillCostBase:1},Fh=3,ds={turretKinds:["tower","mgtower","barricade","trap"],turretCostMul:3,minGap:3,maxTurrets:12,vaccineCost:{gold:150,herb:6,samples:3},refund:.5},mg=i=>Xs.find(t=>t.id===i),Wn=(i,t)=>i.wallet[t]??0;function ST(i,t,e){const n={};for(const s of Object.keys(i))n[s]=Math.ceil((i[s]??0)*Math.pow(t,e));return n}const Dr=(i,t)=>Object.keys(t).every(e=>Wn(i,e)+1e-9>=(t[e]??0));function ET(i,t){for(const e of Object.keys(t))i.wallet[e]=Math.max(0,Wn(i,e)-(t[e]??0))}function TT(i,t){for(const e of Object.keys(t))i.wallet[e]=Wn(i,e)+(t[e]??0)}const Ii=(i,t)=>i.upgrades[t]??0,Oh=(i,t)=>ST(t.cost,t.costGrowth,Ii(i,t.id));function gg(i,t){if(!t.requires)return null;const e=mg(t.requires.id);return Ii(i,t.requires.id)>=t.requires.lv?null:`${(e==null?void 0:e.name)??t.requires.id} Lv${t.requires.lv} 필요`}function r0(i,t){const e=mg(t);if(!e)return"unknown";if(Ii(i,t)>=e.max)return"max";if(gg(i,e))return"locked";const n=Oh(i,e);return Dr(i,n)?(ET(i,n),i.upgrades[t]=Ii(i,t)+1,"ok"):"poor"}const xg=(i,t)=>pg.skillCostBase+(i.skills[t]??0);function AT(i,t){const e=vh.find(o=>o.id===t);if(!e)return"unknown";const n=i.skills[t]??0;if(n>=e.max)return"max";const s=xg(i,t);return Wn(i,"skillPoints")<s?"poor":(i.wallet.skillPoints=Wn(i,"skillPoints")-s,i.skills[t]=n+1,"ok")}function CT(i){let t=0;for(const[e,n]of Object.entries(i.skills))for(let s=0;s<n;s++)t+=pg.skillCostBase+s;return i.skills={},i.wallet.skillPoints=Wn(i,"skillPoints")+t,t}function Js(i){const t={startGold:0,startRes:{wood:vd.wood,stone:vd.stone,iron:0,herb:vd.herb,parts:0},startSamples:0,startSkillPoints:0,coreHp:0,maxHp:0,dmgMul:0,recoilMul:0,gatherSpeed:0,allyCap:0,turretDmgMul:0,weaponLv:{},weapons:["pistol"],prepBonus:0,startWave:1,keepRatio:MT,skillLv:{...i.skills}};let e=0;for(const n of Xs){const s=Ii(i,n.id);if(s<=0)continue;const o=n.effect;switch(o.kind){case"startGold":t.startGold+=o.per*s;break;case"startRes":t.startRes[o.res]+=o.per*s;break;case"startSamples":t.startSamples+=o.per*s;break;case"startSkillPoints":t.startSkillPoints+=o.per*s;break;case"coreHp":t.coreHp+=o.per*s;break;case"maxHp":t.maxHp+=o.per*s;break;case"dmgMul":t.dmgMul+=o.per*s;break;case"recoilMul":t.recoilMul+=o.per*s;break;case"gatherSpeed":t.gatherSpeed+=o.per*s;break;case"turretDmgMul":t.turretDmgMul+=o.per*s;break;case"allyCap":t.allyCap+=o.per*s;break;case"weaponLv":t.weaponLv[o.weapon]=(t.weaponLv[o.weapon]??0)+o.per*s;break;case"weapon":t.weapons.includes(o.id)||t.weapons.push(o.id);break;case"prepBonus":t.prepBonus+=o.per*s;break;case"startWave":e+=o.per*s;break;case"keepRatio":t.keepRatio=Math.min(1,t.keepRatio+o.per*s);break}}return t.startWave=1+Math.min(e,Math.max(0,i.bestCheckpoint)),t}function RT(i,t){const e=Js(i).keepRatio,n={gold:Math.floor(t.gold*e),samples:Math.floor(t.samples*e),samplesSp:Math.floor(t.samplesSp*e),skillPoints:t.skillPoints};for(const a of Object.keys(t.res))n[a]=Math.floor(t.res[a]*e);const s=Math.floor(Math.max(0,t.wave-1)*_T+t.kills*wT),o={...n};o.gold=(o.gold??0)+s,TT(i,o),i.currency+=o.gold??0;const r=t.wave>i.bestWave;return i.bestWave=Math.max(i.bestWave,t.wave),i.bestCheckpoint=Math.max(i.bestCheckpoint,t.checkpoint),i.totalRuns+=1,i.totalKills+=t.kills,{wave:t.wave,kills:t.kills,kept:n,waveBonus:s,keepRatio:e,newBest:r,total:o}}const vg=(i,t)=>Object.keys(t).every(e=>Wn(i,e)>=(t[e]??0)),yg=(i,t)=>{for(const e of Object.keys(t))i.wallet[e]=Math.max(0,Wn(i,e)-(t[e]??0))},kT=(i,t,e)=>{for(const n of Object.keys(t))i.wallet[n]=Wn(i,n)+Math.floor((t[n]??0)*e)};function bu(i){const t=Qt[i],e={};if(!t)return e;for(const[n,s]of Object.entries(t.cost))e[n]=Math.ceil((s??0)*ds.turretCostMul);return e}function Mu(i,t,e,n,s=-1){const o=Qt[t];if(!o||!ds.turretKinds.includes(t))return{ok:!1,reason:"kind"};if(!Number.isFinite(e)||!Number.isFinite(n))return{ok:!1,reason:"range"};const r=Math.hypot(e-st.core.x,n-st.core.z);if(r+o.radius>st.buildRadius)return{ok:!1,reason:"range"};if(r<Rn.radius+o.radius+.8)return{ok:!1,reason:"core"};for(let a=0;a<i.turrets.length;a++){if(a===s)continue;const c=i.turrets[a];if(Math.hypot(e-c.x,n-c.z)<ds.minGap)return{ok:!1,reason:"overlap"}}return{ok:!0}}function PT(i,t,e,n){if(i.turrets.length>=ds.maxTurrets)return{ok:!1,reason:"max"};const s=Mu(i,t,e,n);if(!s.ok)return s;const o=bu(t);return vg(i,o)?(yg(i,o),i.turrets.push({kind:t,x:e,z:n}),{ok:!0}):{ok:!1,reason:"poor"}}function LT(i,t,e,n){const s=i.turrets[t];if(!s)return{ok:!1,reason:"index"};const o=Mu(i,s.kind,e,n,t);return o.ok?(s.x=e,s.z=n,{ok:!0}):o}function DT(i,t){const e=i.turrets[t];return e?(kT(i,bu(e.kind),ds.refund),i.turrets.splice(t,1),{ok:!0}):{ok:!1,reason:"index"}}const bg=i=>ou(Js(i).skillLv).allyCap+Js(i).allyCap,Mg=()=>({...ds.vaccineCost});function IT(i,t){if(!(t in ze))return{ok:!1,reason:"role"};if(i.allies.length>=bg(i))return{ok:!1,reason:"cap"};const e=ze[t].max;if(i.allies.filter(s=>s.role===t).length>=e)return{ok:!1,reason:"cap"};const n=Mg();return vg(i,n)?(yg(i,n),i.allies.push({role:t}),{ok:!0}):{ok:!1,reason:"poor"}}function zT(i,t){return i.allies[t]?(i.allies.splice(t,1),{ok:!0}):{ok:!1,reason:"index"}}const UT=i=>({turrets:i.turrets.map(t=>({...t})),allies:i.allies.map(t=>({...t}))});function _u(i){const t=Js(i).weapons;return Ni.filter(e=>t.includes(e))}function $c(i){const t=_u(i),e=(i.equipped??[]).filter((n,s,o)=>n in he&&t.includes(n)&&o.indexOf(n)===s).slice(0,Fh);return e.length?e:t.length?t.slice(0,Fh):["pistol"]}function NT(i,t,e){if(!Number.isInteger(e)||e<0||e>=Fh)return{ok:!1,reason:"slot"};if(!(t in he)||!_u(i).includes(t))return{ok:!1,reason:"weapon"};const n=$c(i),s=n.indexOf(t);return s>=0?e<n.length&&(n[s]=n[e],n[e]=t):e<n.length?n[e]=t:n.push(t),i.equipped=n,{ok:!0}}function FT(i,t){const e=$c(i);return!Number.isInteger(t)||t<0||t>=e.length?{ok:!1,reason:"slot"}:e.length<=1?{ok:!1,reason:"last"}:(e.splice(t,1),i.equipped=e,{ok:!0})}const OT=`
#t2d{position:fixed;inset:0;z-index:60;display:none;flex-direction:column;color:#e9eef5;font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;
  background:radial-gradient(1200px 700px at 20% -10%,#24344a 0,#121923 55%,#0b0f15 100%);overflow:hidden;user-select:none}
#t2d.open{display:flex;animation:t2dIn .35s ease-out}
@keyframes t2dIn{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:none}}
#t2d .bgfx{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:44px 44px;animation:t2dGrid 24s linear infinite;pointer-events:none}
@keyframes t2dGrid{to{background-position:44px 44px}}
#t2d header{position:relative;padding:14px 22px 10px;display:flex;gap:18px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #ffffff14;background:#0b0f1599;backdrop-filter:blur(4px)}
#t2d h1{margin:0;font-size:22px;letter-spacing:.5px}
#t2d h1 small{display:block;font-size:12px;font-weight:400;opacity:.65;margin-top:2px}
#t2d .report{flex:1;min-width:260px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
#t2d .rchip{background:#1d2a3b;border:1px solid #ffffff1f;border-radius:20px;padding:4px 12px;font-size:13px;animation:t2dPop .5s both}
#t2d .rchip.best{background:#4a3a12;border-color:#ffd24d88;color:#ffe08a}
@keyframes t2dPop{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}
#t2d .wallet{position:relative;display:flex;gap:8px;flex-wrap:wrap;padding:10px 22px;background:#0a0e14aa;border-bottom:1px solid #ffffff10}
#t2d .coin{display:flex;align-items:center;gap:6px;background:#17202d;border:1px solid #ffffff17;border-radius:10px;padding:5px 10px;min-width:104px}
#t2d .coin .ic{font-size:18px}
#t2d .coin .v{font-weight:700;font-variant-numeric:tabular-nums;font-size:15px}
#t2d .coin .r{font-size:11px;color:#7ee0a0;min-height:13px}
#t2d .coin.pulse{animation:t2dCoin .35s}
@keyframes t2dCoin{50%{transform:scale(1.08);background:#25405a}}
#t2d main{position:relative;flex:1;display:flex;min-height:0}
#t2d nav{width:150px;padding:12px 8px;display:flex;flex-direction:column;gap:6px;border-right:1px solid #ffffff10;background:#0a0e1477;overflow:auto}
#t2d nav button{background:#18222f;color:#cfd8e3;border:1px solid transparent;border-radius:10px;padding:10px 8px;text-align:left;cursor:pointer;font:inherit;font-size:14px;transition:.15s}
#t2d nav button:hover{background:#223245;transform:translateX(2px)}
#t2d nav button.on{background:linear-gradient(90deg,#2f6f4e,#245a40);color:#fff;border-color:#6fe0a055;box-shadow:0 0 14px #2f6f4e66}
#t2d .content{flex:1;overflow:auto;padding:16px 18px;min-width:0}
#t2d .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
#t2d .card{position:relative;background:linear-gradient(160deg,#1a2535,#131b27);border:1px solid #ffffff17;border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:7px;transition:transform .15s,box-shadow .2s,border-color .2s;animation:t2dPop .4s both}
#t2d .card:hover{transform:translateY(-2px);box-shadow:0 8px 22px #0008}
#t2d .card.can{border-color:#6fe0a066}
#t2d .card.maxed{border-color:#ffd24d66;background:linear-gradient(160deg,#2a2515,#1a1810)}
#t2d .card.lock{opacity:.5}
#t2d .card.flash{animation:t2dFlash .6s}
@keyframes t2dFlash{0%{box-shadow:0 0 0 0 #6fe0a0cc;transform:scale(1.03)}100%{box-shadow:0 0 0 18px #6fe0a000;transform:none}}
#t2d .card .top{display:flex;gap:10px;align-items:center}
#t2d .card .ico{font-size:28px;width:44px;height:44px;border-radius:10px;background:#0c121a;display:flex;align-items:center;justify-content:center;flex:none}
#t2d .card .nm{font-weight:700;font-size:15px}
#t2d .card .lv{font-size:12px;opacity:.75}
#t2d .card .ds{font-size:12.5px;opacity:.8;min-height:32px}
#t2d .card .eff{font-size:12px;color:#8fd4ff}
#t2d .pips{display:flex;gap:3px;flex-wrap:wrap}
#t2d .pip{width:9px;height:9px;border-radius:3px;background:#2a3646}
#t2d .pip.f{background:linear-gradient(#7ef0b0,#2fb070);box-shadow:0 0 6px #4fe09a88}
#t2d .costs{display:flex;gap:5px;flex-wrap:wrap}
#t2d .cost{background:#0c121a;border-radius:8px;padding:2px 8px;font-size:12px;font-variant-numeric:tabular-nums}
#t2d .cost.bad{color:#ff8e8e;background:#2a1414}
#t2d .buy{background:#121a20;color:#2ee6d6;border:0;border-radius:10px;padding:8px 10px;font:inherit;font-weight:700;cursor:pointer;transition:.1s;box-shadow:none}
#t2d .buy:hover:not(:disabled){filter:brightness(1.12)}
#t2d .buy:active:not(:disabled){transform:translateY(3px);box-shadow:none}
#t2d .buy:disabled{background:#2b3440;color:#8b96a5;box-shadow:0 3px 0 #1b222b;cursor:not-allowed}
#t2d aside{width:270px;padding:14px;border-left:1px solid #ffffff10;background:#0a0e1477;display:flex;flex-direction:column;gap:12px;overflow:auto}
#t2d .panelbox{background:#131b27;border:1px solid #ffffff14;border-radius:12px;padding:10px 12px;font-size:12.5px;line-height:1.7}
#t2d .panelbox h3{margin:0 0 4px;font-size:13px;color:#9cc8ff}
#t2d .panelbox div{display:flex;justify-content:space-between;gap:8px}
#t2d footer{position:relative;padding:12px 22px;display:flex;gap:12px;align-items:center;justify-content:space-between;border-top:1px solid #ffffff14;background:#0b0f15cc}
#t2d .launch{background:linear-gradient(#e4513d,#b52a1c);color:#fff;border:0;border-radius:14px;padding:14px 38px;font:inherit;font-size:20px;font-weight:800;letter-spacing:1px;cursor:pointer;box-shadow:0 5px 0 #6b1409,0 0 26px #e4513d66;animation:t2dBeat 1.8s infinite}
#t2d .launch:hover{filter:brightness(1.1)}
#t2d .launch:active{transform:translateY(4px);box-shadow:0 1px 0 #6b1409}
@keyframes t2dBeat{50%{box-shadow:0 5px 0 #6b1409,0 0 42px #ff6a52aa}}
#t2d .ghost{background:#1b2431;color:#9aa8ba;border:1px solid #ffffff1a;border-radius:8px;padding:6px 10px;font:inherit;font-size:12px;cursor:pointer}
#t2d .ghost:hover{background:#26334a;color:#fff}
#t2d .float{position:fixed;pointer-events:none;font-weight:800;color:#ffe08a;text-shadow:0 2px 4px #000;animation:t2dFloat .9s ease-out forwards;z-index:70}
@keyframes t2dFloat{to{transform:translateY(-60px);opacity:0}}
#t2d .toast2{position:absolute;left:50%;bottom:84px;transform:translateX(-50%);background:#000c;border:1px solid #ffffff2a;padding:8px 18px;border-radius:20px;font-size:14px;animation:t2dToast 2s forwards;pointer-events:none}
@keyframes t2dToast{0%{opacity:0;transform:translate(-50%,10px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
#t2d .sect{margin:6px 2px 10px;font-size:13px;color:#9cc8ff}
@media(max-width:900px){#t2d aside{display:none}#t2d nav{width:96px}}

/* ── First 비주얼 폴리시 (스타일 가이드 v1: 바탕 #0B1014, 패널 #121A20 85%, 청록 #2EE6D6, 주황 #FF8A2A) ── */
#t2d{background:#0b1014;color:#e6f1f2;font-family:Pretendard,'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}
#t2d.open{animation:t2dFade .4s ease-out}
@keyframes t2dFade{from{opacity:0}to{opacity:1}}
#t2d .bgfx{inset:-30px;background:radial-gradient(ellipse at center,transparent 55%,#2EE6D60A 100%),linear-gradient(180deg,#0B1014,#121A20);animation:t2dDrift 30s ease-in-out infinite alternate}
#t2d .bgfx::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,#2ee6d60a 0 1px,transparent 1px 4px);animation:t2dScanBg 8s linear infinite}
@keyframes t2dDrift{to{transform:scale(1.06) translate(-14px,-8px)}}
@keyframes t2dScanBg{to{background-position:0 120px}}
#t2d header,#t2d .wallet,#t2d main,#t2d footer{animation:t2dRise .4s ease-out both}
#t2d .wallet{animation-delay:.05s}#t2d main{animation-delay:.1s}#t2d footer{animation-delay:.15s}
@keyframes t2dRise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
#t2d header,#t2d footer,#t2d .wallet,#t2d nav,#t2d aside{background:#121a20d9;border-color:#2ee6d622;backdrop-filter:blur(6px)}
#t2d h1{text-shadow:0 0 12px #2ee6d655}
#t2d h1 small,#t2d .card .lv,#t2d .card .ds{color:#7f9aa3;opacity:1}
#t2d .coin{background:#121a20d9;border-color:#2ee6d62a}
#t2d .coin .v,#t2d .cost{font-variant-numeric:tabular-nums}
#t2d nav button{background:#121a20}
#t2d nav button:hover{background:#17262c;box-shadow:inset 2px 0 0 #2ee6d6}
#t2d nav button.on{background:linear-gradient(90deg,#2ee6d633,#2ee6d60d);color:#e6f1f2;border-color:#2ee6d6aa;box-shadow:0 0 14px #2ee6d644,inset 3px 0 0 #2ee6d6}
/* 9-slice 느낌 패널: 모서리 브래킷 + 얇은 외곽선 */
#t2d .card{background:linear-gradient(160deg,#121a20f0,#0e151af0);border:1px solid #2ee6d622;border-radius:6px;overflow:hidden;animation:t2dCardIn .4s ease-out both;
  background-image:linear-gradient(#2ee6d6,#2ee6d6),linear-gradient(#2ee6d6,#2ee6d6),linear-gradient(#2ee6d6,#2ee6d6),linear-gradient(#2ee6d6,#2ee6d6),linear-gradient(160deg,#121a20f0,#0e151af0);
  background-size:14px 2px,2px 14px,14px 2px,2px 14px,100% 100%;background-position:0 0,0 0,100% 100%,100% 100%,0 0;background-repeat:no-repeat}
@keyframes t2dCardIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
#t2d .card::before{content:'';position:absolute;left:0;right:0;top:-40%;height:40%;background:linear-gradient(180deg,transparent,#2ee6d633,transparent);opacity:0;pointer-events:none}
#t2d .card:hover{transform:translateY(-2px);border-color:#2ee6d6;box-shadow:0 0 0 1px #2ee6d6,0 0 18px #2ee6d655,0 8px 22px #0008}
#t2d .card:hover::before{animation:t2dScan .6s ease-out 1}
@keyframes t2dScan{0%{top:-40%;opacity:1}100%{top:100%;opacity:1}}
#t2d .card.can{border-color:#2ee6d666}
#t2d .card.maxed{border-color:#ff8a2a88;background-color:#1a150f}
#t2d .card .ico{background:#0b1014;border:1px solid #2ee6d633;border-radius:6px}
#t2d .card .eff{color:#2ee6d6}
#t2d .pip.f{background:linear-gradient(#7ff5ea,#2ee6d6);box-shadow:0 0 6px #2ee6d688}
#t2d .card.flash{animation:t2dBuy .15s ease-out}
@keyframes t2dBuy{50%{transform:scale(1.04);box-shadow:0 0 22px #ff8a2a88}}
#t2d .card.deny{animation:t2dDeny .4s ease-in-out}
#t2d .card.deny .cost{color:#e0303a!important;transition:none}
@keyframes t2dDeny{12.5%{transform:translateX(-6px)}37.5%{transform:translateX(6px)}62.5%{transform:translateX(-6px)}87.5%{transform:translateX(6px)}100%{transform:none}}
#t2d .buy{background:#2ee6d6;color:#0b1014;border:1px solid #2ee6d6;box-shadow:0 0 12px #2ee6d644;border-radius:6px;transition:transform .08s,filter .15s}
#t2d .buy:hover:not(:disabled){filter:brightness(1.15);transform:translateY(-1px)}
#t2d .buy:active:not(:disabled){transform:translateY(3px);box-shadow:0 0 0 #0f5f58}
#t2d .buy:disabled{background:#1a242b;color:#7f9aa3;box-shadow:0 3px 0 #0d1418}
#t2d .launch{background:linear-gradient(#ff8a2a,#d4600f);box-shadow:0 5px 0 #7a3405,0 0 26px #ff8a2a66;border-radius:8px}
@keyframes t2dBeat{50%{box-shadow:0 5px 0 #7a3405,0 0 44px #ff8a2aaa}}
#t2d .launch:active{box-shadow:0 1px 0 #7a3405}
#t2d .panelbox{background:#121a20d9;border-color:#2ee6d622;border-radius:6px}
#t2d .panelbox h3{color:#2ee6d6}
#t2d .rchip{background:#121a20d9;border-color:#2ee6d633}
#t2d .rchip.best{background:#2a1a0c;border-color:#ff8a2a88;color:#ffb070}
#t2d .ember{position:fixed;width:5px;height:5px;border-radius:50%;background:#ff8a2a;box-shadow:0 0 8px #ff8a2a;pointer-events:none;z-index:71;animation:t2dEmber .6s ease-out forwards}
@keyframes t2dEmber{to{transform:translate(var(--dx),var(--dy)) scale(.3);opacity:0}}

/* ── v1.2 레이아웃: 상단 탭 4개, 좌 30% 무기 미리보기, 우 70% 카드 3열 ── */
#t2d nav.tabs{position:relative;display:flex;gap:4px;padding:0 22px;width:auto;flex-direction:row;border:0;border-bottom:1px solid #2ee6d622;background:#121a20d9;overflow:visible}
#t2d nav.tabs button{background:none;border:0;border-radius:0;padding:12px 18px 10px;font-size:15px;color:#7f9aa3;position:relative}
#t2d nav.tabs button:hover{background:#2ee6d60f;color:#e6f1f2;transform:none;box-shadow:none}
#t2d nav.tabs button.on{background:none;color:#e6f1f2;box-shadow:none;border:0}
#t2d nav.tabs button::after{content:'';position:absolute;left:10px;right:10px;bottom:-1px;height:2px;background:#2EE6D6;transform:scaleX(0);transition:transform .2s}
#t2d nav.tabs button.on::after{transform:scaleX(1)}
#t2d aside{order:-1;width:30%;max-width:none;border-left:0;border-right:1px solid #2ee6d61a}
#t2d .content{width:70%}
#t2d .content.quiet .card{animation:none}
#t2d .grid{grid-template-columns:repeat(3,minmax(0,1fr))}
#t2d .sect{margin:16px 0 8px;color:#7f9aa3;font-size:13px}#t2d .sect b{color:#e6f1f2;font-size:15px;margin-right:4px}
#t2d .card .nm{font-size:18px}
#t2d .card{clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);border-radius:0}
#t2d .card.lock{filter:saturate(0);opacity:.6}
#t2d .card.lock .nm{opacity:.7}
#t2d .eff .next,#t2d .price{color:#ff8a2a;font-weight:700;font-variant-numeric:tabular-nums}
#t2d .badge{position:absolute;top:8px;right:10px;font-size:11px;font-weight:800;color:#0b1014;background:#2ee6d6;padding:2px 8px;border-radius:3px;box-shadow:0 0 10px #2ee6d688}
#t2d footer{padding:10px 32px 32px 22px}
/* 출격 장비 줄 */
#t2d .loadbar{display:flex;gap:8px;margin-bottom:12px}
#t2d .lslot{flex:1;padding:10px;border:1px dashed #2ee6d655;color:#7f9aa3;text-align:center;font-size:14px}
#t2d .lslot.f{border:1px solid #2ee6d6;color:#e6f1f2;background:#2ee6d614;box-shadow:inset 0 0 12px #2ee6d633}
/* 포탑 미니맵 */
#t2d .tmap-row{display:flex;gap:16px;align-items:flex-start;margin-bottom:8px}
#t2d .tmap{width:360px;height:360px;flex:none;background:radial-gradient(circle,#2ee6d60d,transparent 70%),#0b1014;border:1px solid #2ee6d633}
#t2d .tmap .ring{fill:none;stroke:#2ee6d6;stroke-width:1.5;opacity:.7}#t2d .tmap .ring.thin{stroke-width:.8;opacity:.35;stroke-dasharray:3 4}
#t2d .tmap .lane{stroke:#2ee6d6;stroke-width:6;opacity:.08}
#t2d .tmap .core{fill:#2ee6d633;stroke:#2ee6d6}
#t2d .tmap .slot{cursor:pointer}
#t2d .tmap .empty{fill:#2ee6d608;stroke:#2ee6d6;stroke-dasharray:4 3;transition:fill .15s}
#t2d .tmap .slot:hover .empty{fill:#2ee6d633}
#t2d .tmap .range{fill:#2ee6d6;fill-opacity:.15;stroke:#2ee6d6;stroke-opacity:.4}
#t2d .tmap .tur{fill:#ff8a2a;stroke:#ffb070}
#t2d .tmap text{font-size:15px;pointer-events:none}
#t2d .tmap .just .drop{animation:t2dDrop .2s ease-in both;transform-box:fill-box;transform-origin:center}
@keyframes t2dDrop{from{transform:translateY(-40px) scale(1.3);opacity:0}to{transform:none;opacity:1}}
#t2d .tmap .just .range{animation:t2dDust .5s ease-out both;transform-box:fill-box;transform-origin:center}
@keyframes t2dDust{from{transform:scale(.3);fill-opacity:.5}to{transform:none}}
#t2d .kinds{display:flex;flex-direction:column;gap:8px;flex:1}
#t2d .kind{display:flex;align-items:center;gap:8px;background:#121a20d9;border:1px solid #2ee6d622;color:#e6f1f2;padding:10px 12px;font:inherit;cursor:pointer;text-align:left;transition:.15s}
#t2d .kind>span{font-size:22px}#t2d .kind small{margin-left:auto}
#t2d .kind:hover{border-color:#2ee6d688}
#t2d .kind.on{border-color:#2ee6d6;box-shadow:0 0 12px #2ee6d655,inset 3px 0 0 #2ee6d6}
/* 동료 카드: 감염 = 좀비 녹색, 백신 후 청록 */
#t2d .card.ally{border-color:#9bff4a;box-shadow:inset 0 0 14px #9bff4a22;transition:border-color .6s,box-shadow .6s}
#t2d .card.ally.curing,#t2d .card.ally.cured{border-color:#2ee6d6;box-shadow:inset 0 0 14px #2ee6d633}
#t2d .card.ally.curing .ico{animation:t2dCure .6s ease-out both}
@keyframes t2dCure{from{background:#9bff4a55}to{background:#2ee6d633}}
#t2d .stamp{position:absolute;right:12px;top:40px;transform:rotate(-12deg);border:2px solid #2ee6d6;color:#2ee6d6;font-weight:900;padding:2px 8px;letter-spacing:2px;opacity:.85;animation:t2dStamp .3s ease-out both}
@keyframes t2dStamp{from{transform:rotate(-12deg) scale(2.2);opacity:0}}
/* 반동 감소 */
#t2d .recoil-card{max-width:460px}
#t2d .ricon{width:36px;height:36px}#t2d .ricon .gun{fill:#2ee6d6}#t2d .ricon .arr{fill:none;stroke:#ff8a2a;stroke-width:2.5;stroke-linecap:round}
#t2d .rsteps{display:flex;gap:6px}#t2d .rstep{opacity:.3;filter:saturate(0)}#t2d .rstep.f{opacity:1;filter:none}#t2d .rstep .ricon{width:30px;height:30px}
#t2d .rtrail{position:relative;height:70px;background:#0b1014;border:1px solid #2ee6d622}
#t2d .rtrail i{position:absolute;left:50%;bottom:12px;width:5px;height:5px;margin-left:-2px;border-radius:50%;background:#ff8a2a;box-shadow:0 0 6px #ff8a2a;animation:t2dTrail 1.6s ease-in-out infinite}
#t2d .rtrail b{position:absolute;left:50%;bottom:10px;width:9px;height:9px;margin-left:-4px;border:1px solid #2ee6d6;border-radius:50%}
@keyframes t2dTrail{0%,15%{transform:translate(var(--x),var(--y));opacity:1}70%,100%{transform:none;opacity:.2}}
/* 좌측 무기 미리보기 */
#t2d .wpreview{height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;perspective:600px;border:1px solid #2ee6d622;background:radial-gradient(circle,#2ee6d614,transparent 70%)}
#t2d .wpreview .spin{width:80%;animation:t2dSpin 6s linear infinite;transform-style:preserve-3d}
#t2d .wpreview svg{width:100%;fill:none;stroke:#2ee6d6;stroke-width:1.5;filter:drop-shadow(0 0 4px #2ee6d6)}
#t2d .wname{color:#2ee6d6;font-weight:700;margin-top:6px;letter-spacing:1px}
@keyframes t2dSpin{to{transform:rotateY(360deg)}}

#t2d .tmap{cursor:crosshair}
#t2d .tmap .ghost{fill:#2ee6d633;stroke:#2ee6d6;stroke-dasharray:4 3;pointer-events:none}
#t2d .tmap .ghost.bad{fill:#e0303a33;stroke:#e0303a}
#t2d .tmap .sel .tur{stroke:#2ee6d6;stroke-width:3}
#t2d .tmap .sel .range{fill-opacity:.25}
#t2d .selbox,#t2d .hint{background:#121a20d9;border:1px solid #2ee6d633;padding:10px 12px;font-size:13px;color:#7f9aa3;line-height:1.7}
#t2d .selbox b{color:#ff8a2a}
#t2d .kind .costs{margin-top:4px}
#t2d .roster{display:flex;gap:6px;flex-wrap:wrap}
#t2d .roster .x{background:none;border:0;color:#7f9aa3;cursor:pointer;font:inherit}#t2d .roster .x:hover{color:#e0303a}

/* ── 마감 폴리시: 등장 40ms 간격, 호버 리프트, 탭 전환, 배경 흐름, 미니맵 ── */
#t2d .bgfx::before{content:'';position:absolute;inset:-20%;background:radial-gradient(40% 30% at 30% 40%,#2ee6d614,transparent 70%),radial-gradient(35% 25% at 70% 70%,#ff8a2a0f,transparent 70%);animation:t2dGlow 18s ease-in-out infinite alternate}
@keyframes t2dGlow{to{transform:translate(6%,-4%) rotate(8deg)}}
#t2d .card{transition:transform .18s ease-out,box-shadow .18s,border-color .18s}
#t2d .card:hover{transform:translateY(-4px);border-color:#2ee6d6;box-shadow:0 0 0 1px #2ee6d6,0 0 22px #2ee6d655,0 10px 24px #0009}
#t2d .card.lock:hover{transform:none;box-shadow:none;border-color:#ffffff17}
#t2d .content{animation:t2dTab .25s ease-out}
#t2d .content.quiet{animation:none}
@keyframes t2dTab{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
#t2d .card.lock{filter:saturate(0) brightness(.75)}
#t2d .card.lock .ico{opacity:.5}
#t2d .coin.up .v{color:#2ee6d6}#t2d .coin.down .v{color:#ff8a2a}
#t2d .tmap .zone{opacity:.9}#t2d .tmap .zone.edge{opacity:.75}
#t2d .tmap .gridl{fill:none;stroke:#2ee6d6;stroke-opacity:.08;stroke-width:1}
#t2d .tmap .ghost.bad{fill:#e0303a33;stroke:#e0303a}
#t2d .tmap .pulse{fill:none;stroke:#ff8a2a;stroke-width:2;transform-box:fill-box;transform-origin:center;animation:t2dPulse 1s ease-out 2 both}
#t2d .tmap .pulse.p2{animation-delay:.3s}
@keyframes t2dPulse{from{transform:scale(.6);opacity:1}to{transform:scale(2.6);opacity:0}}
@media (prefers-reduced-motion: reduce){
  #t2d *,#t2d *::before,#t2d *::after,#t2d{animation-duration:.001s!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.001s!important}
  #t2d .card:hover{transform:none}
}

#t2d .lslot{cursor:pointer;position:relative;transition:.15s}
#t2d .lslot small{color:#7f9aa3;margin-right:4px}
#t2d .lslot.sel{border-color:#ff8a2a;box-shadow:0 0 0 1px #ff8a2a,0 0 14px #ff8a2a44}
#t2d .lslot .x{background:none;border:0;color:#7f9aa3;cursor:pointer;font:inherit;margin-left:6px}#t2d .lslot .x:hover{color:#e0303a}
#t2d .card.pick{cursor:pointer}
#t2d .card.equipped{border-color:#2ee6d6;box-shadow:inset 0 0 16px #2ee6d633}

/* 좌측 열: 미리보기 목록이 잘리지 않게 압축 + 자체 스크롤 */
#t2d aside{min-height:0;overflow:hidden;gap:10px}
#t2d aside>*{flex:none}
#t2d .wpreview{height:auto;flex:1 1 200px;min-height:150px}
#t2d aside .panelbox[data-preview]{flex:1 1 auto;min-height:0;overflow:auto;line-height:1.45;font-size:12px;scrollbar-width:thin;scrollbar-color:#2ee6d655 transparent}

/* 하단 바(출격 버튼 줄)가 마지막 카드 줄·섹션 제목을 덮지 않게 바 높이만큼 스크롤 여백을 둔다 */
#t2d{--t2d-bar:96px}
#t2d main{min-height:0;overflow:hidden}
#t2d .content{min-height:0;overflow-y:auto;padding-bottom:calc(var(--t2d-bar) + 16px);scroll-padding-bottom:calc(var(--t2d-bar) + 16px)}
#t2d aside{padding-bottom:calc(var(--t2d-bar) * .25)}
#t2d footer{z-index:2;min-height:var(--t2d-bar);box-sizing:border-box}
#t2d .ic18{width:18px;height:18px;flex:none;vertical-align:-3px}
#t2d nav.tabs button{display:inline-flex;align-items:center;gap:6px;color:#8FA3AD}
#t2d nav.tabs button.on{color:#2EE6D6;font-weight:600}
#t2d .card .ico{color:#2EE6D6}#t2d .card .ico .ic18{width:24px;height:24px}
#t2d .coin .ic,#t2d .rchip,#t2d .cost{color:#e6f1f2}#t2d .coin .ic{color:#2EE6D6;display:inline-flex}
#t2d .tic{color:#2EE6D6}
#t2d .nm,#t2d .ds,#t2d .lv,#t2d .rchip,#t2d button{white-space:normal;overflow-wrap:anywhere;text-overflow:clip}
#t2d .nm,#t2d .ds{overflow:visible}
#t2d .coin .nmk{font-size:11px;color:#8FA3AD;line-height:1.2}
#t2d .rchip.best{background:#0f2a2a;border-color:#2EE6D688;color:#2EE6D6}
#t2d .lslot.sel{border-color:#2EE6D6;box-shadow:0 0 0 1px #2EE6D6,0 0 14px #2EE6D644}
#t2d .grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
/* 작은 화면: 헤더·지갑을 줄여 본문이 하단 바 위에서 스스로 스크롤되게 */
#t2d main{flex:1 1 0;min-height:0}#t2d .content,#t2d aside{padding-bottom:16px;scroll-padding-bottom:16px}#t2d aside{overflow-y:auto}
#t2d footer{flex:none}
@media (max-height:800px){#t2d header{padding-top:8px;padding-bottom:8px}#t2d .wallet{padding-top:6px;padding-bottom:6px;gap:6px}#t2d .coin{padding:4px 10px}#t2d footer{padding:8px 22px;min-height:0}#t2d .launch{padding:10px 32px;font-size:18px}#t2d .wpreview{min-height:110px}}
#t2d .sect.wup{margin:24px 0 12px}
#t2d .lo{display:block}
#t2d .lo .grid,#t2d .lo+.grid,#t2d .content>.grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-content:start}
#t2d .wallet{display:grid;grid-template-columns:repeat(9,minmax(0,1fr))}
#t2d .wallet .coin{min-width:0;width:auto}
#t2d .eqpill{display:block;text-align:center;border:1px solid #2EE6D6;color:#2EE6D6;border-radius:6px;padding:7px 10px;font-weight:600;font-size:14px}
#t2d aside{display:flex;flex-direction:column;overflow:hidden;min-height:0}
#t2d aside .panelbox[data-preview]{flex:1 1 0;min-height:0;overflow-y:auto}
@media (max-height:640px){#t2d .wpreview{flex:0 0 120px;min-height:0;height:120px}#t2d .wpreview svg,#t2d .wpreview canvas{max-height:90px}#t2d aside .panelbox[data-preview]{line-height:1.3;padding:8px 10px}#t2d aside .panelbox[data-preview] h3{margin-bottom:2px}#t2d aside{gap:8px;padding-bottom:10px}}
/* 탭: 활성 표시는 .on 하나만. hover/focus 는 배경만 */
#t2d nav.tabs button,#t2d nav.tabs button:hover,#t2d nav.tabs button:focus{color:#8FA3AD;font-weight:400;transition:background .15s}
#t2d nav.tabs button:hover{background:#2ee6d60f}
#t2d nav.tabs button.on,#t2d nav.tabs button.on:hover,#t2d nav.tabs button.on:focus{color:#2EE6D6;font-weight:600}
#t2d nav.tabs button:focus-visible{outline:1px solid #2ee6d688;outline-offset:-3px}
/* 포탑 종류 목록: 맵 높이에 맞춰 자체 스크롤 */
#t2d .tmap-row{display:flex;align-items:stretch;height:min(360px,calc(100dvh - 312px));min-height:200px}
#t2d .tmap-row .tmap{height:100%;width:auto;aspect-ratio:1}
#t2d .tmap-row .kinds{flex:1;min-height:0;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2ee6d655 transparent}
#t2d .tmap-row .kinds>*{flex:none}
`,BT={kind:"놓을 수 없는 종류예요",range:"건설 반경 밖이에요",core:"핵에 너무 가까워요",overlap:"다른 포탑과 너무 붙어 있어요",max:"더 놓을 수 없어요 (최대치)",poor:"재화가 부족해요",role:"알 수 없는 역할이에요",cap:"동료 상한에 도달했어요",index:"대상을 찾을 수 없어요",weapon:"보유하지 않은 총이에요",slot:"잘못된 칸이에요",last:"마지막 한 자루는 뺄 수 없어요"},qs=i=>i.ok?"":BT[i.reason]??i.reason,HT={tower:"🗼",mgtower:"⚙️",barricade:"🧱",trap:"🕸️"},Ts=i=>(i.ok&&$s(),i);function GT(){return{turretKinds:()=>ds.turretKinds.map(i=>{var e,n;const t=Qt[i];return{id:i,name:t.name,icon:HT[i]??"🗼",cost:bu(i),range:((e=t.turret)==null?void 0:e.levels[0].range)??((n=t.trap)==null?void 0:n.radius)??t.radius,radius:t.radius}}),turrets:()=>Pt.turrets,maxTurrets:()=>ds.maxTurrets,core:()=>st.core,buildRadius:()=>st.buildRadius,zones:()=>st.zones,check:(i,t,e,n=-1)=>Mu(Pt,i,t,e,n),place:(i,t,e)=>Ts(PT(Pt,i,t,e)),move:(i,t,e)=>Ts(LT(Pt,i,t,e)),remove:i=>Ts(DT(Pt,i)),roles:()=>Object.keys(ze).map(i=>({id:i,name:ze[i].name,desc:ze[i].desc,max:ze[i].max,count:Pt.allies.filter(t=>t.role===i).length})),allies:()=>Pt.allies,allyCap:()=>bg(Pt),vaccineCost:()=>Mg(),vaccinate:i=>Ts(IT(Pt,i)),dismiss:i=>Ts(zT(Pt,i)),guns:()=>{const i=_u(Pt);return Object.keys(he).map(t=>{const e=Xs.find(n=>n.effect.kind==="weapon"&&n.effect.id===t);return{id:t,name:he[t].name,desc:he[t].desc,owned:i.includes(t),unlockUpgrade:(e==null?void 0:e.id)??null}})},equipped:()=>$c(Pt),equip:(i,t)=>Ts(NT(Pt,i,t)),unequip:i=>Ts(FT(Pt,i)),recoil:()=>{const i=Xs.find(s=>s.id==="w_recoil"),t=i&&i.effect.kind==="recoilMul"?i.effect.per:-.08,e=(i==null?void 0:i.max)??5,n=Ii(Pt,"w_recoil");return{upgradeId:"w_recoil",level:n,max:e,mul:1+t*n,nextMul:n<e?1+t*(n+1):null}}}}let VT=GT();const oa=()=>VT;function hi(i,t,e){dispatchEvent(new CustomEvent("tycoon:purchase",{detail:e==null?{kind:i,id:t}:{kind:i,id:t,level:e}}))}const He=(i,t,e="")=>{const n=document.createElement(i);return n.className=t,n.innerHTML=Uo(e),n},Qr=(i,t="")=>He("div","sect",`<b>${i}</b>${t?` · ${t}`:""}`);function WT(i,t,e,n){return e.ok?(i.ok(t),i.changed(),n&&i.toast(n),!0):(e.reason==="poor"&&i.denied(t),i.toast(qs(e)),!1)}let Po=0;function $T(i){const t=oa(),e=He("div","lo"),n=t.guns(),s=t.equipped(),o=3;Po>=o&&(Po=0);const r=l=>{var d;return((d=n.find(h=>h.id===l))==null?void 0:d.name)??l};e.appendChild(Qr("출격 장비",`${s.length}/${o}칸 · 칸을 고른 뒤 보유한 총을 누르세요`));const a=He("div","loadbar");for(let l=0;l<o;l++){const d=s[l],h=He("div","lslot"+(d?" f":"")+(l===Po?" sel":""),`<small>${l+1}</small> ${d?`🔫 ${r(d)} <button class="x" title="빼기">✕</button>`:"빈 칸"}`);h.onclick=()=>{Po=l,i.rerender()};const u=h.querySelector(".x");u&&(u.onclick=f=>{f.stopPropagation();const g=t.unequip(l);g.ok?(hi("gun",d),i.changed(),i.rerender()):(i.denied(h),i.toast(qs(g)))}),a.appendChild(h)}e.appendChild(a);const c=He("div","grid");return n.forEach((l,d)=>{const h=s.indexOf(l.id),u=He("div","card own-card"+(l.owned?" owned pick":l.unlockUpgrade?"":" lock")+(h>=0?" equipped":""),`${l.owned?'<span class="badge">보유</span>':""}
      <div class="top"><div class="ico">🔫</div><div><div class="nm">${l.name}</div><div class="lv">${h>=0?`${h+1}번 칸 장착`:l.owned?"눌러서 장착":"미보유"}</div></div></div>
      <div class="ds">${l.desc}</div><div class="costs"></div>${h>=0?'<div class="eqpill">장착 중</div>':l.owned?"":`<button class="buy" ${l.unlockUpgrade?"":"disabled"}>영구 구매</button>`}`);u.style.animationDelay=`${.12+d*.04}s`,l.owned?u.onclick=()=>{const f=t.equip(l.id,Po);f.ok?(hi("gun",l.id),i.ok(u),i.changed(),i.toast(`${l.name} → ${Po+1}번 칸`),setTimeout(()=>i.rerender(),160)):i.toast(qs(f))}:l.unlockUpgrade&&(i.costChips(i.upgradeCost(l.unlockUpgrade),u.querySelector(".costs")),u.querySelector(".buy").onclick=f=>{f.stopPropagation(),i.buyUpgrade(l.unlockUpgrade,u,"gun")&&setTimeout(()=>i.rerender(),160)}),c.appendChild(u)}),e.appendChild(c),e}const XT={base:"#1B2328",forest:"#24331E",quarry:"#3A3A36",field:"#3B3222",boss:"#2E1A1C",mine:"#2A2B2E",ruins:"#302D2A",wasteland:"#35302B"};let Zi="",Ie=-1,Rr=-1;function qT(i){var T,A;const t=oa(),e=He("div","lo"),n=t.turretKinds(),s=t.turrets();n.find(C=>C.id===Zi)||(Zi=((T=n[0])==null?void 0:T.id)??""),Ie>=s.length&&(Ie=-1),e.appendChild(Qr("포탑 배치",`${s.length}/${t.maxTurrets()} · 설치한 포탑은 매 출격마다 그 자리에 서 있어요`));const o=He("div","tmap-row"),r=t.buildRadius()+2,a=360,c=(a/2-12)/r,l=a/2,d=t.core(),h=(C,y)=>({x:Math.round((d.x+(C-l)/c)*2)/2,z:Math.round((d.z+(y-l)/c)*2)/2}),u=(C,y)=>({x:l+(C-d.x)*c,y:l+(y-d.z)*c}),f="http://www.w3.org/2000/svg",g=document.createElementNS(f,"svg");g.setAttribute("viewBox",`0 0 ${a} ${a}`),g.setAttribute("class","tmap");let x=`<circle cx="${l}" cy="${l}" r="${t.buildRadius()*c}" class="ring"/><circle cx="${l}" cy="${l}" r="${t.buildRadius()*c*.5}" class="ring thin"/>`;for(let C=0;C<4;C++){const y=Math.cos(C*Math.PI/2+Math.PI/4),M=Math.sin(C*Math.PI/2+Math.PI/4);x+=`<line x1="${l+y*30}" y1="${l+M*30}" x2="${l+y*a}" y2="${l+M*a}" class="lane"/>`}x+=`<rect x="${l-9}" y="${l-9}" width="18" height="18" transform="rotate(45 ${l} ${l})" class="core"/>`;let p=`<defs><pattern id="tgrid" width="${2*c}" height="${2*c}" patternUnits="userSpaceOnUse" x="${l}" y="${l}"><path d="M ${2*c} 0 L 0 0 0 ${2*c}" class="gridl"/></pattern>
    <clipPath id="tclip"><rect width="${a}" height="${a}"/></clipPath></defs><g clip-path="url(#tclip)">`;for(const C of t.zones()){const y=XT[C.kind]??"#20262a",M=u(C.x,C.z);if(Math.hypot(C.x-d.x,C.z-d.z)-C.r<r*1.5)p+=`<circle cx="${M.x}" cy="${M.y}" r="${C.r*c}" fill="${y}" class="zone"/>`;else{const z=Math.atan2(C.z-d.z,C.x-d.x),D=l+Math.cos(z)*(a/2-4),V=l+Math.sin(z)*(a/2-4);p+=`<circle cx="${D}" cy="${V}" r="${28+C.r}" fill="${y}" class="zone edge"><title>${C.label}</title></circle>`}}p+=`<rect width="${a}" height="${a}" fill="url(#tgrid)"/></g>`,g.innerHTML=p+x;const m=C=>n.find(y=>y.id===C);s.forEach((C,y)=>{const M=m(C.kind),R=u(C.x,C.z),z=document.createElementNS(f,"g");z.setAttribute("class","slot full"+(y===Ie?" sel":"")+(y===Rr?" just":"")),z.innerHTML=`<circle cx="${R.x}" cy="${R.y}" r="${((M==null?void 0:M.range)??3)*c}" class="range"/>${y===Rr?`<circle cx="${R.x}" cy="${R.y}" r="14" class="pulse"/><circle cx="${R.x}" cy="${R.y}" r="14" class="pulse p2"/>`:""}<g class="drop"><rect x="${R.x-11}" y="${R.y-11}" width="22" height="22" rx="3" class="tur"/><g transform="translate(${R.x-9} ${R.y-9})" class="tic">${Uo((M==null?void 0:M.icon)??"🗼").replace('class="ic18"','class="ic18" x="0" y="0"')}</g></g>`,z.addEventListener("click",D=>{D.stopPropagation(),Ie=Ie===y?-1:y,i.rerender()}),g.appendChild(z)}),Rr=-1;const _=document.createElementNS(f,"rect");_.setAttribute("class","ghost"),_.setAttribute("width","22"),_.setAttribute("height","22"),_.style.display="none",g.appendChild(_);const b=C=>{const y=g.getBoundingClientRect();return{px:(C.clientX-y.left)*a/y.width,py:(C.clientY-y.top)*a/y.height}},v=()=>Ie>=0?s[Ie].kind:Zi;g.addEventListener("mousemove",C=>{const{px:y,py:M}=b(C),R=h(y,M),z=u(R.x,R.z),D=t.check(v(),R.x,R.z,Ie).ok;_.style.display="",_.setAttribute("x",String(z.x-11)),_.setAttribute("y",String(z.y-11)),_.classList.toggle("bad",!D)}),g.addEventListener("mouseleave",()=>{_.style.display="none"}),g.addEventListener("click",C=>{var D;const{px:y,py:M}=b(C),R=h(y,M);if(Ie>=0){const V=t.move(Ie,R.x,R.z);V.ok?(hi("turret",s[Ie].kind),Rr=Ie,Ie=-1,i.changed(),i.rerender(),i.toast("포탑을 옮겼어요")):i.toast(qs(V));return}const z=t.place(Zi,R.x,R.z);z.ok?(hi("turret",Zi),Rr=t.turrets().length-1,i.changed(),i.rerender(),i.toast(`${(D=m(Zi))==null?void 0:D.name} 영구 설치`)):(z.reason==="poor"&&i.denied(g),i.toast(qs(z)))});const I=He("div","kinds");for(const C of n){const y=He("button","kind"+(C.id===Zi&&Ie<0?" on":""),`<span>${C.icon}</span><div>${C.name}<div class="costs"></div></div>`);i.costChips(C.cost,y.querySelector(".costs")),y.onclick=()=>{Zi=C.id,Ie=-1,i.rerender()},I.appendChild(y)}if(Ie>=0){const C=s[Ie],y=He("div","selbox",`<b>${(A=m(C.kind))==null?void 0:A.name}</b> 선택됨 · 지도를 눌러 무료 이동<br><button class="ghost" data-rm>철거 (비용 50% 환불)</button> <button class="ghost" data-cancel>선택 해제</button>`);y.querySelector("[data-rm]").onclick=()=>{const M=s[Ie].kind,R=t.remove(Ie);Ie=-1,R.ok?(hi("refund",M),i.changed(),i.toast("철거하고 절반을 돌려받았어요")):i.toast(qs(R)),i.rerender()},y.querySelector("[data-cancel]").onclick=()=>{Ie=-1,i.rerender()},I.appendChild(y)}else I.appendChild(He("div","hint","종류를 고르고 지도 안 빈 곳을 누르세요. 놓인 포탑을 누르면 옮기거나 철거할 수 있어요."));return o.append(g,I),e.appendChild(o),e}let yd="";function YT(i){const t=oa(),e=He("div","lo"),n=t.allies(),s=t.allyCap();e.appendChild(Qr("동료 (백신)",`${n.length}/${s}명 · 정제된 V-0 투여`));const o=He("div","grid");if(t.roles().forEach((r,a)=>{const c=r.count>0,l=He("div","card ally"+(c?" cured":"")+(r.id===yd?" curing":""),`${c?`<span class="badge">보유 ${r.count}</span><span class="stamp">영구 합류</span>`:""}
      <div class="top"><div class="ico">🧟</div><div><div class="nm">${r.name}</div><div class="lv">${r.count} / ${r.max>=99?"∞":r.max}</div></div></div>
      <div class="ds">${r.desc}</div><div class="costs"></div><button class="buy">💉 백신 투여</button>`);l.style.animationDelay=`${.12+a*.04}s`,i.costChips(t.vaccineCost(),l.querySelector(".costs")),l.querySelector(".buy").onclick=()=>{WT(i,l,t.vaccinate(r.id),`${r.name} 영구 합류!`)&&(hi("ally",r.id),yd=r.id,l.classList.add("curing"),setTimeout(()=>i.rerender(),650),setTimeout(()=>{yd=""},1400))},o.appendChild(l)}),e.appendChild(o),n.length){const r=He("div","roster"),a=t.roles();n.forEach((c,l)=>{var h;const d=He("span","rchip",`${((h=a.find(u=>u.id===c.role))==null?void 0:h.name)??c.role} <button class="x" title="해고">✕</button>`);d.querySelector("button").onclick=()=>{if(confirm("이 동료를 내보낼까요? (백신 비용은 돌아오지 않아요)")){const u=t.dismiss(l);u.ok?(hi("ally",c.role),i.changed()):i.toast(qs(u)),i.rerender()}},r.appendChild(d)}),e.appendChild(Qr("합류한 동료")),e.appendChild(r)}return e}function a0(i){const t=22-i*3.6,e=30,n=e-t;return`<svg viewBox="0 0 48 48" class="ricon"><path d="M6 36h26l4-4h6v6h-8l-2 4h-6l-1-2H6z" class="gun"/>
    <path d="M14 ${e} L14 ${n+4} Q14 ${n} 18 ${n}" class="arr"/><path d="M15 ${n-3} L19 ${n} L15 ${n+3}" class="arr"/></svg>`}function jT(i){const t=oa().recoil(),e=He("div","lo");e.appendChild(Qr("반동 제어","모든 총의 반동이 줄어듭니다"));const n=He("div","card recoil-card"),s=Array.from({length:10},(r,a)=>{const c=26*t.mul,l=Math.sin(a*2.3)*c*.5,d=-a*c*.25;return`<i style="--x:${l.toFixed(1)}px;--y:${d.toFixed(1)}px;animation-delay:${a*.05}s"></i>`}).join(""),o=Array.from({length:t.max},(r,a)=>`<span class="rstep${a<t.level?" f":""}">${a0(a+1)}</span>`).join("");return n.innerHTML=`<div class="top"><div class="ico">${a0(t.level)}</div><div><div class="nm">반동 제어</div><div class="lv">Lv ${t.level} / ${t.max}</div></div></div>
    <div class="rsteps">${o}</div>
    <div class="eff">반동 ${Math.round(t.mul*100)}%${t.nextMul!=null?` → <span class="next">${Math.round(t.nextMul*100)}%</span>`:" (최대)"}</div>
    <div class="rtrail">${s}<b></b></div>
    <button class="buy" ${t.nextMul==null?"disabled":""}>${t.nextMul==null?"최대":"강화"}</button>`,n.querySelector(".buy").onclick=()=>{i.buyUpgrade(t.upgradeId,n)&&setTimeout(()=>i.rerender(),160)},e.appendChild(n),e}function c0(){const i=oa(),t=i.equipped()[0],e=i.guns().find(n=>n.id===t);return He("div","wpreview",`<div class="spin"><svg viewBox="0 0 200 90"><path d="M10 40h120l10-10h40v20h-30l-6 8h-30l-8 30h-24l6-30H10z"/><path d="M60 40v-12h40v12M140 30v-8"/><circle cx="150" cy="40" r="4"/></svg></div><div class="wname">${e?e.name:""}</div>`)}const KT=()=>matchMedia("(prefers-reduced-motion: reduce)").matches,As=i=>i>=1e6?(i/1e6).toFixed(2)+"M":i>=1e4?(i/1e3).toFixed(1)+"k":String(Math.floor(i+1e-9)),l0={ok:"구매 완료!",max:"이미 최대 레벨입니다",poor:"재화가 부족합니다",locked:"아직 잠겨 있습니다",unknown:""};class ZT{constructor(t){if(this.host=t,this.walletEl=new Map,this.cards=[],this.tab="guns",this.host2={toast:o=>this.toast(o),ok:o=>this.okFx(o),denied:o=>this.denied(o),rerender:()=>this.setTab(this.tab,!0),upgradeCost:o=>Oh(Pt,Xs.find(r=>r.id===o)),changed:()=>this.changed(),costChips:(o,r)=>this.costChips(o,r),buyUpgrade:(o,r,a="upgrade")=>{const c=r0(Pt,o);return this.toast(l0[c]),c==="ok"?(hi(a,o,Ii(Pt,o)),this.okFx(r),this.changed(),!0):(c==="poor"&&this.denied(r),!1)}},this.navBtns=new Map,this.acc=0,this.isOpen=!1,!document.getElementById("t2d-style")){const o=document.createElement("style");o.id="t2d-style",o.textContent=OT,document.head.appendChild(o)}this.root=document.createElement("div"),this.root.id="t2d",this.root.innerHTML=`
      <div class="bgfx"></div>
      <header><h1><img src="/logo.svg" alt="3D-GUN" style="height:34px;vertical-align:middle;margin-right:10px" />생존자 작전 본부<small>쓰러진 뒤에도 남는 것: 영구 업그레이드</small></h1><div class="report"></div></header>
      <div class="wallet"></div>
      <nav class="tabs"></nav>
      <main><aside></aside><div class="content"></div></main>
      <footer><div><button class="ghost" data-act="refund">스킬 초기화(포인트 환급)</button> <button class="ghost" data-act="reset">진행 초기화</button></div><button class="launch" data-act="launch">출격</button></footer>`,document.body.appendChild(this.root),this.reportEl=this.root.querySelector(".report"),this.content=this.root.querySelector(".content"),this.side=this.root.querySelector("aside");const e=this.root.querySelector(".wallet");for(const o of bT){const r=document.createElement("div");r.className="coin",r.title=gd[o],r.innerHTML=`<span class="ic">${Uo(xd[o])}</span><div><div class="v">0</div><div class="nmk">${gd[o]}</div><div class="r"></div></div>`,e.appendChild(r),this.walletEl.set(o,{box:r,v:r.querySelector(".v"),r:r.querySelector(".r"),shown:0})}const n=this.root.querySelector("nav"),s=[["guns","rifle","무기"],["turrets","turret","포탑"],["allies","ally","동료"],["upg","up","강화"]];for(const[o,r,a]of s){const c=document.createElement("button");c.innerHTML=`${tn(r)}<span>${a}</span>`,c.onclick=()=>this.setTab(o),n.appendChild(c),this.navBtns.set(o,c)}this.root.addEventListener("click",o=>{var a;const r=(a=o.target.closest("[data-act]"))==null?void 0:a.getAttribute("data-act");if(r==="launch")this.host.onLaunch();else if(r==="refund"){const c=CT(Pt);c>0&&hi("refund","skills",c),this.toast(c>0?`스킬 포인트 ${c} 환급`:"환급할 스킬이 없습니다"),this.changed(),this.setTab(this.tab)}else r==="reset"&&confirm("영구 진행을 모두 지우고 처음부터 시작할까요?")&&(this.host.onReset(),this.setTab(this.tab))}),this.buildSide()}open(t,e){this.isOpen=!0,this.root.classList.add("open"),this.reportEl.innerHTML="";const n=(s,o="",r=0)=>{const a=document.createElement("span");a.className="rchip "+o,a.innerHTML=Uo(s),a.style.animationDelay=`${r*.08}s`,this.reportEl.appendChild(a)};if(t){let s=0;n(`💀 웨이브 ${t.wave}에서 쓰러짐`,"",s++),t.newBest&&n("🏆 최고 기록!","best",s++),n(`처치 ${t.kills}`,"",s++),n(`🪙 +${As(t.total.gold??0)} (웨이브 보너스 ${As(t.waveBonus)})`,"",s++);const o=Object.keys(t.total).filter(r=>r!=="gold"&&(t.total[r]??0)>0);o.length&&n(o.map(r=>`${xd[r]}${As(t.total[r]??0)}`).join(" "),"",s++),n(`회수율 ${Math.round(t.keepRatio*100)}%`,"",s++)}else n("업그레이드를 고르고 출격하세요");e&&e.secs>0&&n(`⏰ 부재 중 ${Math.floor(e.secs/60)}분 수익 🪙+${As(e.gold)}`,"best");for(const[s,o]of this.walletEl)o.shown=Wn(Pt,s);this.setTab(this.tab),this.refreshWallet(0)}close(){this.isOpen=!1,this.root.classList.remove("open")}changed(){this.host.onChanged(),this.refreshAll()}setTab(t,e=!1){var c;const n=this.content.scrollTop;this.tab=t,this.navBtns.forEach((l,d)=>{const h=d===t;l.classList.toggle("on",h),l.setAttribute("aria-selected",String(h)),h||l.blur()}),this.content.innerHTML="",this.cards=[],requestAnimationFrame(()=>{e&&(this.content.scrollTop=n)});const s=l=>{const d=document.createElement("div");d.className="sect",d.innerHTML=`<b>${l}</b>`,this.content.appendChild(d)};let o=0;const r=l=>{const d=document.createElement("div");d.className="grid",Xs.filter(h=>l.includes(h.cat)&&h.effect.kind!=="weapon"&&h.id!=="w_recoil").forEach(h=>d.appendChild(this.upgradeCard(h.id,o++))),this.content.appendChild(d)};if(t==="guns"){const l=$T(this.host2);this.content.appendChild(l),s("무기 업그레이드");const d=this.content.lastElementChild;d.classList.add("wup"),(c=l.querySelector(".loadbar"))==null||c.after(d),r(["weapon"])}else if(t==="turrets")this.content.appendChild(qT(this.host2)),s("포탑 업그레이드"),r(["turret"]);else if(t==="allies")this.content.appendChild(YT(this.host2)),s("동료 업그레이드"),r(["ally"]);else{this.content.appendChild(jT(this.host2)),s("기지·보급"),r(["base","econ"]),s("스킬 트리 (스킬 포인트)");{const l=document.createElement("div");l.className="grid",vh.forEach(d=>l.appendChild(this.skillCard(d.id,o++))),this.content.appendChild(l)}}this.content.classList.toggle("quiet",!!e);const a=this.side.querySelector(".wpreview");a==null||a.replaceWith(c0()),a||this.side.prepend(c0()),this.refreshAll()}costChips(t,e){e.innerHTML="";for(const n of Object.keys(t)){const s=document.createElement("span");s.className="cost"+(Wn(Pt,n)+1e-9<(t[n]??0)?" bad":""),s.innerHTML=`${Uo(xd[n])} ${As(t[n]??0)}`,s.title=gd[n],e.appendChild(s)}}pips(t,e,n){n.innerHTML="";const s=Math.min(e,12),o=e<=12?t:Math.round(t/e*12);for(let r=0;r<s;r++){const a=document.createElement("span");a.className="pip"+(r<o?" f":""),n.appendChild(a)}}makeCard(t,e,n,s){const o=document.createElement("div");return o.className="card",o.style.animationDelay=`${.12+t*.04}s`,o.addEventListener("click",r=>{r.target.closest(".buy:not(:disabled)")||!o.classList.contains("can")&&!o.classList.contains("maxed")&&!o.classList.contains("lock")&&this.denied(o)}),o.innerHTML=`<div class="top"><div class="ico">${Uo(e)}</div><div><div class="nm">${n}</div><div class="lv"></div></div></div>
      <div class="ds">${s}</div><div class="eff"></div><div class="pips"></div><div class="costs"></div><button class="buy"></button>`,{el:o,lv:o.querySelector(".lv"),eff:o.querySelector(".eff"),pips:o.querySelector(".pips"),costs:o.querySelector(".costs"),btn:o.querySelector(".buy")}}afterBuy(t,e,n,s="",o){e==="ok"&&hi("upgrade",s,o==null?void 0:o()),this.toast(l0[e]),e==="ok"?(t.classList.remove("flash"),t.offsetWidth,t.classList.add("flash"),this.floatText("▲ LEVEL UP",n.clientX,n.clientY),this.sparks(t),this.changed()):e==="poor"&&this.denied(t)}okFx(t){t.classList.remove("flash"),t.offsetWidth,t.classList.add("flash"),this.sparks(t)}denied(t){t.classList.remove("deny"),t.offsetWidth,t.classList.add("deny")}sparks(t){const e=t.getBoundingClientRect();for(let n=0;n<12;n++){const s=document.createElement("i");s.className="ember";const o=Math.random()*Math.PI*2,r=40+Math.random()*60;s.style.left=`${e.left+e.width/2}px`,s.style.top=`${e.top+e.height/2}px`,s.style.setProperty("--dx",`${Math.cos(o)*r}px`),s.style.setProperty("--dy",`${Math.sin(o)*r-30}px`),this.root.appendChild(s),setTimeout(()=>s.remove(),700)}}upgradeCard(t,e){const n=Xs.find(o=>o.id===t),s=this.makeCard(e,n.icon,n.name,n.desc);return s.btn.onclick=o=>this.afterBuy(s.el,r0(Pt,t),o,t,()=>Ii(Pt,t)),this.cards.push({el:s.el,refresh:()=>{const o=Ii(Pt,t),r=gg(Pt,n);s.lv.textContent=`Lv ${o} / ${n.max}`,this.pips(o,n.max,s.pips);const a=o>=n.max,c=Oh(Pt,n);s.costs.style.display=a?"none":"",a||this.costChips(c,s.costs),s.eff.textContent=r??"",s.btn.textContent=a?"MAX":r?"잠김":"강화",s.btn.disabled=a||!!r||!Dr(Pt,c),s.el.classList.toggle("maxed",a),s.el.classList.toggle("lock",!!r),s.el.classList.toggle("can",!a&&!r&&Dr(Pt,c))}}),s.el}skillCard(t,e){const n=vh.find(o=>o.id===t),s=this.makeCard(e,"🌳",n.name,`${n.desc}  <small>(${n.branch})</small>`);return s.btn.onclick=o=>this.afterBuy(s.el,AT(Pt,t),o,t,()=>Pt.skills[t]??0),this.cards.push({el:s.el,refresh:()=>{const o=Pt.skills[t]??0,r=o>=n.max,a={skillPoints:xg(Pt,t)};s.lv.textContent=`Lv ${o} / ${n.max}`,this.pips(o,n.max,s.pips),s.costs.style.display=r?"none":"",r||this.costChips(a,s.costs),s.btn.textContent=r?"MAX":"습득",s.btn.disabled=r||!Dr(Pt,a),s.el.classList.toggle("maxed",r),s.el.classList.toggle("can",!r&&Dr(Pt,a))}}),s.el}buildSide(){this.side.innerHTML='<div class="panelbox" data-preview></div>'}refreshSide(){const t=Js(Pt),e=(o,r)=>`<div><span>${o}</span><b>${r}</b></div>`,n=o=>{var r;return((r=Vn[o])==null?void 0:r.name)??o},s=Object.entries(t.weaponLv).filter(([,o])=>o>0).map(([o,r])=>`${n(o)} +${r}`).join(", ")||"-";this.side.querySelector("[data-preview]").innerHTML="<h3>다음 출격 미리보기</h3>"+e("시작 웨이브",String(t.startWave))+e("시작 골드",As(t.startGold))+e("코어 체력",`+${t.coreHp}`)+e("최대 체력",`+${t.maxHp}`)+e("공격력",`+${Math.round(t.dmgMul*100)}%`)+e("준비 시간",`30 +${t.prepBonus}초`)+e("아군 상한",`+${t.allyCap}`)+e("시작 무기",t.weapons.map(n).join(", "))+e("총 품질",s)+e("시작 스킬",String(Object.values(t.skillLv).reduce((o,r)=>o+r,0)))+e("기록",`웨이브 ${Pt.bestWave} · ${Pt.totalRuns}회`)}refreshAll(){this.cards.forEach(t=>t.refresh()),this.refreshSide()}refreshWallet(t){for(const[e,n]of this.walletEl){const s=Wn(Pt,e),o=n;if(o.to!==s&&(Math.abs(s-(o.to??s))>=1&&!KT()?(o.from=n.shown,o.t=0,n.box.classList.toggle("up",s>n.shown),n.box.classList.toggle("down",s<n.shown)):(o.t=1,n.shown=s),o.to=s),(o.t??1)<1){o.t=Math.min(1,(o.t??0)+t/.3);const a=1-(1-o.t)**3;n.shown=(o.from??s)+(s-(o.from??s))*a,o.t>=1&&(n.shown=s,n.box.classList.remove("up","down"))}else n.shown=s;const r=As(n.shown);n.v.textContent!==r&&(n.v.textContent=r),n.r.textContent=""}}update(t){this.isOpen&&(this.refreshWallet(t),this.acc+=t,this.acc>.25&&(this.acc=0,this.refreshAll()))}floatText(t,e,n){const s=document.createElement("div");s.className="float",s.textContent=t,s.style.left=`${e-20}px`,s.style.top=`${n-20}px`,this.root.appendChild(s),setTimeout(()=>s.remove(),900)}toast(t){if(!t)return;this.root.querySelectorAll(".toast2").forEach(n=>n.remove());const e=document.createElement("div");e.className="toast2",e.textContent=t,this.root.appendChild(e),setTimeout(()=>e.remove(),2e3)}get el(){return this.root}}const JT=500;let Os,wu=!1,ts=null,bd=0,d0=!0;const _g=()=>H.emit("loadout:apply",UT(Pt));function h0(i,t,e,n){return{wave:i,checkpoint:t,kills:e,gold:n,res:{...w.res},samples:w.samples,samplesSp:w.samplesSp,skillPoints:w.skillPoints}}function xc(){const i=Js(Pt);w.statMods=[t=>{t.maxHp+=i.maxHp,t.dmgMul+=i.dmgMul,t.gatherSpeed+=i.gatherSpeed,t.allyCap+=i.allyCap,t.recoilMul=Math.max(.2,t.recoilMul+i.recoilMul)}],Object.assign(w.start,{gold:i.startGold,startWave:i.startWave,res:{...i.startRes},coreHp:i.coreHp,prepBonus:i.prepBonus,samples:i.startSamples,skillPoints:i.startSkillPoints,weapons:$c(Pt),weaponLv:{...i.weaponLv},turretDmgMul:i.turretDmgMul});for(const t of Object.keys(w.weaponLvBonus))delete w.weaponLvBonus[t];Object.assign(w.weaponLvBonus,i.weaponLv)}function wg(){const i=w.start;w.gold=i.gold;for(const t of ln)w.res[t]=i.res[t]??0;w.samples=i.samples,w.samplesSp=0,w.skillPoints=i.skillPoints,w.skillLv={...Js(Pt).skillLv},w.weapons=[...i.weapons],w.coreMaxHp=JT+i.coreHp,w.coreHp=w.coreMaxHp,p_()}function QT(i,t){var e;w.mode="modal",it.modalOpen=!0,(e=document.exitPointerLock)==null||e.call(document),H.emit("ui:modal",{open:!0}),Os.open(i,t)}function u0(i){if(Os.isOpen)return;wu=!0,ts=null;const t=RT(Pt,i);Pt.lastSeen=Date.now(),$s(),w.gold=0,QT(t)}function t3(){xc();const i=w.start.startWave;Os.close(),w.mode="play",it.modalOpen=!1,wu=!1,H.emit("ui:modal",{open:!1}),H.emit("run:start",{run:Pt.totalRuns+1,startWave:i}),wg(),_g(),Pt.lastSeen=Date.now(),$s()}const e3={init(){vT(),xc(),wg(),Os=new ZT({onLaunch:t3,onChanged:()=>{xc(),$s()},onReset:()=>{yT(),xc()}}),H.on("run:over",t=>u0(h0(t.wave??w.wave,t.checkpoint??w.checkpoint,t.kills??0,t.gold??w.gold)));const i=()=>{!ts&&!Os.isOpen&&(ts={snap:h0(w.wave,w.checkpoint,0,w.gold),t:.1})};H.on("player:dead",i),H.on("core:destroyed",i),addEventListener("beforeunload",()=>{Pt.lastSeen=Date.now(),$s()})},update(i){if(d0&&(d0=!1,_g()),ts&&(ts.t-=i,ts.t<=0)){const t=ts;ts=null,wu||u0(t.snap)}if(Os.isOpen){Os.update(i);return}bd+=i,bd>5&&(bd=0,Pt.lastSeen=Date.now(),$s())}},Md={prep:{top:729638,horizon:16747050,fog:9062954,fogNear:40,fogFar:140,sun:1.5,sunColor:16747050,hemi:1,hemiSky:3073750,hemiGround:3814188,ember:.4},combat:{top:1181196,horizon:12664133,fog:5185316,fogNear:28,fogFar:100,sun:1.05,sunColor:16747050,hemi:.75,hemiSky:3073750,hemiGround:3811878,ember:1},ended:{top:529430,horizon:3039068,fog:1980984,fogNear:22,fogFar:90,sun:.55,sunColor:12107980,hemi:.6,hemiSky:1722952,hemiGround:1843750,ember:.15}},n3=["top","horizon","fog","sunColor","hemiSky","hemiGround"],i3=["fogNear","fogFar","sun","hemi","ember"];function s3(i,t,e,n,s,o){for(const r of n3)s.set(i[r]),o.set(t[r]),s.lerp(o,e),n[r]=s.getHex();for(const r of i3)n[r]=i[r]+(t[r]-i[r])*e}const o3="varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",Qa=1.08,r3=`uniform vec3 top; uniform vec3 hor; uniform vec3 sunDir; uniform vec3 sunCol; uniform float t; uniform vec3 fogC; varying vec3 vP;
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y); }
void main(){
  float y = max(vP.y, 0.);
  vec3 c = mix(hor, top, pow(y, .55));
  float s = max(dot(vP, sunDir), 0.);
  c += sunCol * (pow(s, 600.) * 1.2 + pow(s, 12.) * .25);           // 태양 원반 + 번짐
  vec2 uv = vP.xz / (vP.y + .25) * 1.6 + vec2(t * .012, t * .004);  // 흐르는 구름층
  float cl = smoothstep(.55, .85, n(uv) * .65 + n(uv * 2.3) * .35) * smoothstep(0., .25, vP.y);
  c = mix(c, hor * .35, cl * .55);
  c = mix(fogC, c, smoothstep(-.02, .18, vP.y)); // 지평선 띠 제거: 바닥 안개와 이어지게
  gl_FragColor = vec4(c, 1.);
}`,tc=i=>new Dt(i),Lc=class Lc{constructor(t,e){this.scene=t,this.sun=e,this.skyline=new _t,this.cur={...Md.prep},this.from={...Md.prep},this.phase="prep",this.prog=1,this.beacons=[],this.t=0,this.N=500,this.seeds=new Float32Array(this.N),this.ca=new Dt,this.cb=new Dt,t.background=null,t.traverse(n=>{n instanceof gm&&(this.hemi=n)}),this.sky=new ot(new Dn(280,32,16),new Ui({vertexShader:o3,fragmentShader:r3,side:gn,depthWrite:!1,fog:!1,uniforms:{top:{value:tc(this.cur.top)},hor:{value:tc(this.cur.horizon)},sunDir:{value:new L},sunCol:{value:tc(this.cur.sunColor)},t:{value:0},fogC:{value:tc(this.cur.fog)}}})),this.sky.renderOrder=-10,t.add(this.sky),this.buildSkyline(),this.embers=this.buildEmbers(),this.buildBeacons(),t.add(this.skyline,this.embers)}buildBeacons(){for(let t=0;t<8;t++){const e=t/8*Math.PI*2,n=205,s=new ar(16747050,0,16,2);s.position.set(Math.cos(e)*n,8,Math.sin(e)*n),this.skyline.add(s),this.beacons.push(s)}}buildSkyline(){let t=7;const e=()=>(t=t*16807%2147483647)/2147483647,n=[[150,1709080,70],[205,1183250,90]];for(const[s,o,r]of n){const a=new kt({color:o,fog:!1}),c=new Lt(1,1,1),l=new Gs(c,a,r),d=new Kt,h=new $n,u=new L,f=new L;for(let g=0;g<r;g++){const x=g/r*Math.PI*2+e()*.05,p=8+Math.pow(e(),2)*(s>160?55:38),m=5+e()*12;u.set(Math.cos(x)*s,p/2-2,Math.sin(x)*s),h.setFromEuler(new _n(0,-x+(e()-.5)*.3,(e()-.5)*(e()<.2?.25:.04))),f.set(m,p,4+e()*6),l.setMatrixAt(g,d.compose(u,h,f))}l.frustumCulled=!1,this.skyline.add(l)}}buildEmbers(){const t=new Float32Array(this.N*3);for(let c=0;c<this.N;c++)t[c*3]=(Math.random()-.5)*80,t[c*3+1]=Math.random()*30,t[c*3+2]=(Math.random()-.5)*80,this.seeds[c]=Math.random()*100;const e=new Le;e.setAttribute("position",new xn(t,3));const n=document.createElement("canvas");n.width=n.height=32;const s=n.getContext("2d"),o=s.createRadialGradient(16,16,0,16,16,16);o.addColorStop(0,"#fff"),o.addColorStop(.35,"#ffffffaa"),o.addColorStop(1,"#fff0"),s.fillStyle=o,s.fillRect(0,0,32,32);const r=new am({size:.35,map:new or(n),color:16747050,transparent:!0,opacity:.4,depthWrite:!1,blending:ui}),a=new B2(e,r);return a.frustumCulled=!1,a}update(t,e,n){if(this.t+=t,e!==this.phase&&(this.phase=e,Object.assign(this.from,this.cur),this.prog=0),this.prog<1){this.prog=Math.min(1,this.prog+t/Lc.FADE);const g=this.prog,x=g*g*(3-2*g);s3(this.from,Md[e],x,this.cur,this.ca,this.cb)}const s=this.cur,o=this.sky.material.uniforms;o.top.value.setHex(s.top),o.hor.value.setHex(s.horizon),o.sunCol.value.setHex(s.sunColor),o.t.value=this.t,o.fogC.value.setHex(s.fog).multiplyScalar(Qa);const r=this.sunOffset??(this.sunOffset=this.sun.position.clone().sub(this.sun.target.position));this.sun.target.position.set(n.position.x,0,n.position.z),this.sun.position.copy(this.sun.target.position).add(r),o.sunDir.value.copy(r).normalize(),this.sky.position.copy(n.position),this.skyline.position.set(n.position.x*.85,0,n.position.z*.85);const a=this.scene.fog;a instanceof Uc&&(a.color.setHex(s.fog).multiplyScalar(Qa),a.near=s.fogNear,a.far=s.fogFar),this.sun.intensity=s.sun*Qa,this.sun.color.setHex(s.sunColor),this.hemi&&(this.hemi.intensity=s.hemi*Qa,this.hemi.color.setHex(s.hemiSky),this.hemi.groundColor.setHex(s.hemiGround));const c=this.embers.geometry.attributes.position.array,l=n.position.x,d=n.position.z;for(let g=0;g<this.N;g++){const x=this.seeds[g],p=g*3;c[p]+=Math.sin(this.t*.7+x)*t*.6+t*.4,c[p+1]+=t*(.6+x%1*.9),c[p+2]+=Math.cos(this.t*.5+x)*t*.6,c[p+1]>30&&(c[p+1]=0),c[p]-l>40?c[p]-=80:c[p]-l<-40&&(c[p]+=80),c[p+2]-d>40?c[p+2]-=80:c[p+2]-d<-40&&(c[p+2]+=80)}this.embers.geometry.attributes.position.needsUpdate=!0;const h=this.embers.material;h.opacity=.15+s.ember*.55*(.85+Math.sin(this.t*3)*.15),h.size=.25+s.ember*.2;const f=.25+(Math.sin(this.t*(Math.PI*2/2.4))+1)*.5*.75;for(const g of this.beacons)g.intensity=f}dispose(){var t;this.scene.remove(this.sky,this.skyline,this.embers),this.sky.geometry.dispose(),this.sky.material.dispose(),this.embers.geometry.dispose(),(t=this.embers.material.map)==null||t.dispose(),this.embers.material.dispose(),this.skyline.traverse(e=>{e instanceof Gs?(e.geometry.dispose(),e.material.dispose(),e.dispose()):e instanceof Fc&&e.dispose()}),this.skyline.clear(),this.beacons.length=0}};Lc.FADE=2.5;let Bh=Lc;const f0=8,p0=.4,_d=3,m0=.6,g0=24;class a3{constructor(t){this.scene=t,this.bursts=[],this.stains=[],this.pGeo=new Ln(.09,0),this.pMat=new kt({color:3073750,transparent:!0}),this.sGeo=new us(1,18)}spawn(t,e){const n=hn(t,e);this.bursts.length>=g0&&this.drop(this.bursts.shift());const s=[],o=[];for(let c=0;c<f0;c++){const l=new ot(this.pGeo,this.pMat);l.position.set(t,n+1,e),this.scene.add(l),s.push(l);const d=c/f0*Math.PI*2+Math.random()*.5;o.push(new L(Math.cos(d)*3,1.5+Math.random()*2,Math.sin(d)*3))}this.bursts.push({pts:s,vel:o,t:0}),this.stains.length>=g0&&this.dropStain(this.stains.shift());const r=new kt({color:725012,transparent:!0,opacity:.55,depthWrite:!1}),a=new ot(this.sGeo,r);a.rotation.set(-Math.PI/2,0,Math.random()*6),a.scale.set(.9+Math.random()*.4,.6+Math.random()*.3,1),a.position.set(t,n+.06,e),a.renderOrder=1,this.scene.add(a),this.stains.push({m:a,mat:r,t:0})}update(t){this.pMat.opacity=1;for(let e=this.bursts.length-1;e>=0;e--){const n=this.bursts[e];if(n.t+=t,n.t>=p0){this.drop(n),this.bursts.splice(e,1);continue}const s=1-n.t/p0;n.pts.forEach((o,r)=>{const a=n.vel[r];a.y-=9*t,o.position.addScaledVector(a,t),o.scale.setScalar(s)})}for(let e=this.stains.length-1;e>=0;e--){const n=this.stains[e];if(n.t+=t,n.t>=_d+m0){this.dropStain(n),this.stains.splice(e,1);continue}n.t>_d&&(n.mat.opacity=.55*(1-(n.t-_d)/m0))}}drop(t){t.pts.forEach(e=>this.scene.remove(e))}dropStain(t){this.scene.remove(t.m),t.mat.dispose()}dispose(){this.bursts.forEach(t=>this.drop(t)),this.stains.forEach(t=>this.dropStain(t)),this.bursts=[],this.stains=[],this.pGeo.dispose(),this.pMat.dispose(),this.sGeo.dispose()}}let Ji,Zn,x0=!1;const c3={init(i){Ji=new Bh(i.scene,i.world.sun),Zn=new a3(i.scene),x0||(x0=!0,H.on("enemy:killed",({x:t,z:e})=>Zn==null?void 0:Zn.spawn(t,e)))},update(i,t){Ji==null||Ji.update(i,w.phase,t.camera),r_(i,w.phase==="combat"),Zn==null||Zn.update(i),Am(i)},dispose(){Ji==null||Ji.dispose(),Ji=void 0,Zn==null||Zn.dispose(),Zn=void 0}},Cs="#2EE6D6",Qi="#FF8A2A",v0="#E0303A",l3=`
body.titleOn>:not(#c):not(#titleBg):not(script):not(style){opacity:0!important;visibility:hidden!important}
body.hudIn>:not(#c):not(#titleBg):not(script):not(style){transition:opacity .45s ease-out,visibility 0s}
#titleBg{position:fixed;inset:0;z-index:4;overflow:hidden;background:linear-gradient(#0000 55%,#0a0306aa),linear-gradient(#ff8a2a14,#0000 40%);transition:opacity 1.2s cubic-bezier(.4,0,.2,1)}
#titleBg.hide{opacity:0;pointer-events:none}
#titleBg.hide .ui,#titleBg.hide .go{transition:opacity .5s ease-out,transform .9s cubic-bezier(.4,0,.2,1);opacity:0}
#titleBg.hide .ui{transform:translateY(-8px)}#titleBg.hide .go{transform:translate(-50%,10px)}
#titleBg svg{position:absolute;inset:-4%;width:108%;height:108%}
#titleBg .lyr{transition:transform .25s ease-out}
#titleBg .core{animation:tbPulse 2.4s ease-in-out infinite;transform-origin:800px 610px}
#titleBg .beam{animation:tbBeam 3s ease-in-out infinite}
#titleBg .fog{animation:tbFog 26s linear infinite}
#titleBg .fog2{animation:tbFog 40s linear infinite reverse}
#titleBg .shamble{animation:tbShamble 1.6s ease-in-out infinite alternate}
#titleBg .ember{position:absolute;bottom:-10px;width:3px;height:3px;border-radius:50%;background:${Qi};box-shadow:0 0 6px ${Qi},0 0 12px ${v0};animation:tbEmber linear infinite}
#titleBg .scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 2px,#0004 2px 3px);mix-blend-mode:multiply}
#titleBg .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,#0000 55%,#0000004d 100%)}
#titleBg .ui{position:absolute;left:32px;top:24px}#titleBg .go{position:absolute;left:50%;bottom:9%;transform:translateX(-50%);text-align:center}
#titleBg .ui img{width:min(380px,50vw);filter:drop-shadow(0 0 18px ${Cs}88);animation:tbGlow 3.2s ease-in-out infinite}
#titleBg .ui .sub{margin-top:6px;font-size:20px;letter-spacing:6px;color:${Qi};text-shadow:0 0 10px ${v0}}
#titleBg .go button{padding:12px 44px;font-family:inherit;font-weight:800;font-size:20px;color:#07090d;background:${Qi};border:0;border-radius:6px;cursor:pointer;box-shadow:0 0 24px ${Qi}aa;animation:tbPulseBtn 1.8s ease-in-out infinite;outline:none;transition:background .18s ease-out,transform .18s ease-out,box-shadow .18s ease-out,color .18s}
#titleBg .go button:hover{background:#ffa557;transform:translateY(-2px);box-shadow:0 0 0 2px ${Cs},0 0 30px ${Qi}cc;animation:none}
#titleBg .go button:focus-visible{box-shadow:0 0 0 3px #07090d,0 0 0 5px ${Cs},0 0 28px ${Cs}88;animation:none}
#titleBg .go button:active{background:#e8761c;transform:translateY(1px) scale(.97);box-shadow:0 0 0 2px ${Cs},0 0 12px ${Qi}88;transition-duration:.06s}
#titleBg .go button:disabled{cursor:default}
#titleBg .go .hint{margin-top:10px;font-size:13px;opacity:.6}
@keyframes tbPulse{50%{transform:scale(1.08);opacity:.85}}
@keyframes tbBeam{50%{opacity:.35}}
@keyframes tbFog{from{transform:translateX(0)}to{transform:translateX(-800px)}}
@keyframes tbShamble{to{transform:translateX(14px)}}
@keyframes tbEmber{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(60px,-105vh);opacity:0}}
@keyframes tbGlow{50%{filter:drop-shadow(0 0 26px ${Cs}bb) drop-shadow(0 0 6px ${Cs}55)}}
@keyframes tbPulseBtn{50%{box-shadow:0 0 8px ${Qi}66}}
@media (prefers-reduced-motion:reduce){
#titleBg *,#titleBg{animation:none!important}#titleBg .ember{display:none}
#titleBg .go button,#titleBg.hide .ui,#titleBg.hide .go{transition:background .1s,opacity .4s!important;transform:translateX(0)}
#titleBg .go{transform:translateX(-50%)!important}#titleBg.hide .ui{transform:none!important}
#titleBg{transition:opacity .4s}
}
`;class d3{constructor(t){const e=document.createElement("style");e.textContent=l3,document.head.appendChild(e),this.root=document.createElement("div"),this.root.id="titleBg";const n=Array.from({length:28},(c,l)=>`<i class="ember" style="left:${l*37%100}%;animation-duration:${6+l%7}s;animation-delay:-${l*1.3%9}s;opacity:.8"></i>`).join("");this.root.innerHTML=`${n}<div class="vig"></div><div class="scan"></div>
<div class="ui"><img src="/logo.svg" alt="3D-GUN"/><div class="sub" style="color:rgba(46,230,214,0.6)">좀비 타이쿤 3D</div></div><div class="go"><button>출격</button><div class="hint">Enter 또는 클릭</div></div>`;let s=!1;const o=this.root.querySelector("button"),r=()=>{s||(s=!0,o.disabled=!0,removeEventListener("keydown",a),t())},a=c=>{c.repeat||(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),r())};o.onclick=r,addEventListener("keydown",a),document.body.appendChild(this.root),document.body.classList.add("titleOn")}hide(){this.root.classList.add("hide"),setTimeout(()=>this.root.remove(),1300)}}const h3=[{keys:"W A S D",action:"이동",group:"이동"},{keys:"Shift",action:"대시",group:"이동"},{keys:"마우스 / 방향키",action:"시점 회전",group:"이동"},{keys:"좌클릭 / Space",action:"사격 (화면 클릭 시 시점 고정)",group:"전투"},{keys:"우클릭",action:"조준",group:"전투"},{keys:"R",action:"재장전",group:"전투"},{keys:"1 ~ 6",action:"무기 바꾸기",group:"전투"},{keys:"C",action:"백신 종류 고르기",group:"전투"},{keys:"Q",action:"가까운 아군에게 백신 투여",group:"전투"},{keys:"E",action:"상호작용 · 상점",group:"기지"},{keys:"B",action:"건설 모드",group:"기지"},{keys:"F / U / X",action:"건물 수리 / 강화 / 철거",group:"기지"},{keys:"N",action:"다음 웨이브 바로 부르기",group:"기지"},{keys:"V",action:"업그레이드 창",group:"시스템"},{keys:"F3",action:"1인칭 / 3인칭 전환",group:"시스템"},{keys:"P / Esc",action:"일시정지 · 창 닫기",group:"시스템"}],Sg="3dgun.storySeen.v1",u3=`
#titleBg .tmenu{position:absolute;right:28px;bottom:28px;display:flex;gap:10px;z-index:2}
#titleBg .tmenu button,#titleBg .tpanel .x{padding:8px 18px;font:600 15px Pretendard,system-ui,sans-serif;color:#2EE6D6;background:#121A20b3;border:1px solid #2EE6D6;border-radius:6px;cursor:pointer;transition:background .25s ease-out,box-shadow .25s ease-out}
#titleBg .tmenu button:hover,#titleBg .tmenu button[aria-expanded=true],#titleBg .tpanel .x:hover{background:#2EE6D61f;box-shadow:0 0 12px #2EE6D655}
#titleBg .tmenu button:focus-visible,#titleBg .tpanel .x:focus-visible{outline:2px solid #2EE6D6;outline-offset:2px}
#titleBg .tpanel{position:absolute;right:24px;top:24px;width:min(360px,calc(100vw - 48px));max-height:min(70vh,calc(91vh - 24px - 96px - 16px));overscroll-behavior:contain;overflow:auto;box-sizing:border-box;padding:16px 18px;background:#121A20b3;border:1px solid #2EE6D6;border-radius:8px;color:#e6f2f1;font:14px/1.5 Pretendard,system-ui,sans-serif;backdrop-filter:blur(6px);transform:translateY(-16px);opacity:0;visibility:hidden;transition:transform .25s ease-out,opacity .25s ease-out,visibility 0s .25s;z-index:2;scrollbar-width:thin;scrollbar-color:#2EE6D655 transparent}
#titleBg .tpanel.open{transform:none;opacity:1;visibility:visible;transition:transform .25s ease-out,opacity .25s ease-out}
#titleBg .tpanel h3{margin:0 0 10px;font-size:16px;color:#2EE6D6;display:flex;justify-content:space-between;align-items:center}
#titleBg .tpanel .x{padding:2px 10px;font-size:13px}
#titleBg .tpanel .g{margin:10px 0 4px;font-size:12px;color:#2EE6D6aa;letter-spacing:1px}
#titleBg .tpanel .r{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:4px 0;border-bottom:1px solid #2EE6D614}
#titleBg .tpanel kbd{font:600 12px ui-monospace,monospace;color:#FF8A2A;white-space:nowrap}
#titleBg .tpanel .r.off{opacity:.45}
#titleBg .tpanel .cols{column-count:1}#titleBg .tpanel .cols>*{break-inside:avoid}#titleBg .tpanel .cols .g:first-child{margin-top:0}
#titleBg .tpanel .cols .r{font-size:13px;padding:3px 0}
#titleBg .tpanel .r small{color:#9fb3b8}
#titleBg .tpanel .seg{display:flex;gap:4px}
#titleBg .tpanel .seg button{padding:2px 10px;font:inherit;font-size:13px;color:#2EE6D6;background:transparent;border:1px solid #2EE6D688;border-radius:4px;cursor:pointer}
#titleBg .tpanel .seg button.on{background:#2EE6D6;color:#0B1014;border-color:#2EE6D6}
#titleBg .tpanel input[type=range]{width:120px;accent-color:#2EE6D6}
@media (prefers-reduced-motion:reduce){#titleBg .tpanel,#titleBg .tpanel.open{transform:none;transition:opacity .1s,visibility 0s}}
`;function f3(){let i="",t='<h3>조작키<button class="x" data-close>닫기</button></h3><div class="cols">';for(const e of h3)e.group!==i&&(i=e.group,t+=`<div class="g">${i}</div>`),t+=`<div class="r"><span>${e.action}</span><kbd>${e.keys}</kbd></div>`;return t+"</div>"}function y0(i){const t=(n,s,o,r,a)=>`<div class="r"><span>${n}</span><input type="range" data-k="${s}" min="${o}" max="${r}" step="${a}" value="${i[s]}" aria-label="${n}"></div>`,e=(n,s,o,r)=>`<div class="r"><span>${n}</span><div class="seg" data-b="${s}"><button data-v="0">${o}</button><button data-v="1">${r}</button></div></div>`;return'<h3>설정<button class="x" data-close>닫기</button></h3>'+e("시점","thirdPerson","1인칭","3인칭")+t("마우스 감도","sensitivity",.2,3,.05)+t("시야각(FOV)","fov",60,100,1)+t("음악 볼륨","bgmVolume",0,1,.05)+t("효과음 볼륨","sfxVolume",0,1,.05)+e("움직임 줄이기","reducedMotion","끔","켬")+'<div class="r" style="border:0;justify-content:flex-end;padding-top:10px"><button class="x" data-reset>초기화</button></div>'}function p3(i){const t=document.createElement("style");t.textContent=u3,document.head.appendChild(t);const e=document.createElement("div");e.className="tmenu",e.innerHTML='<button data-p="settings" aria-expanded="false">설정</button><button data-p="controls" aria-expanded="false">조작키</button>';const n=document.createElement("div");n.className="tpanel",n.setAttribute("role","dialog"),i.append(n,e);let s="";const o=()=>{s="",n.classList.remove("open"),e.querySelectorAll("button").forEach(l=>l.setAttribute("aria-expanded","false"))};let r=Im();const a=()=>n.querySelectorAll("[data-b] button").forEach(l=>l.classList.toggle("on",l.dataset.v==="1"===r[l.parentElement.dataset.b])),c=l=>{if(s===l){o();return}s=l,n.innerHTML=l==="controls"?f3():y0(r),a(),e.querySelectorAll("button").forEach(d=>d.setAttribute("aria-expanded",String(d.dataset.p===l))),n.classList.add("open")};e.addEventListener("click",l=>{const d=l.target.closest("button");d&&c(d.dataset.p)}),n.addEventListener("click",l=>{const d=l.target;if(d.closest("[data-close]")){o();return}if(d.closest("[data-reset]")){r=g_(),n.innerHTML=y0(r),a();return}const h=d.closest("[data-b] button");h&&(r=Cc({[h.parentElement.dataset.b]:h.dataset.v==="1"}),a())}),n.addEventListener("input",l=>{const d=l.target.closest("input[data-k]");d&&(r=Cc({[d.dataset.k]:Number(d.value)}))}),n.addEventListener("keydown",l=>{l.key==="Escape"&&o(),l.stopPropagation()}),addEventListener("keydown",l=>{s&&l.key==="Escape"&&(l.stopPropagation(),o())},!0),i.addEventListener("pointerdown",l=>{s&&!n.contains(l.target)&&!e.contains(l.target)&&o()})}const b0=[{text:"2031년, 제약사 헬릭스는 불사 백신 V-0을 발표한다."},{text:"임상 47일째, 투여자 전원의 심장이 멈춘다."},{text:"그리고 다시 일어난다."},{text:"72시간 만에 도시가 함락된다."},{text:"남은 건 백신 원액을 지키는 마지막 코어뿐."},{text:"코어가 꺼지면, 치료제도 끝난다.",emphasis:!0},{text:"생존자, 출격하라."}],M0=2.4,Eg=.4,m3=`
#ztIntro{position:fixed;inset:0;z-index:20;background:#000;display:flex;align-items:center;justify-content:center;transition:opacity .6s ease-out;cursor:default}
#ztIntro.out{opacity:0;pointer-events:none}
#ztIntro p{margin:0;padding:0 6vw;max-width:1100px;text-align:center;font:600 clamp(18px,2.4vw,32px)/1.5 Pretendard,system-ui,sans-serif;letter-spacing:.5px;color:#e6f2f1;text-shadow:0 0 18px #2EE6D633;transition:opacity ${Eg}s ease-out;word-break:keep-all}
#ztIntro p.fade{opacity:0}
#ztIntro p.wait{font-size:15px;font-weight:500;color:#2EE6D6;opacity:.7}
#ztIntro p.em{color:#FF8A2A;text-shadow:0 0 22px #FF8A2A66}
#ztIntro p .cur{display:inline-block;width:.5em;border-bottom:2px solid #2EE6D6;margin-left:2px;animation:ztCur .8s steps(1) infinite}
#ztIntro .skip{position:absolute;right:24px;bottom:20px;font:13px system-ui,sans-serif;color:#2EE6D6;opacity:.55}
@keyframes ztCur{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){#ztIntro p .cur{animation:none}#ztIntro p{transition:none}}
`;function g3(){try{return localStorage.getItem(Sg)==="1"}catch{return!0}}function x3(i,t){const e=ii.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches,n=document.createElement("style");n.textContent=m3,document.head.appendChild(n);const s=document.createElement("div");s.id="ztIntro",s.innerHTML='<p class="wait">클릭하거나 아무 키나 누르세요</p><div class="skip" hidden>아무 키나 눌러 건너뛰기</div>',i.appendChild(s);const o=s.querySelector("p"),r=[],a=(x,p)=>r.push(window.setTimeout(p,x));let c=!1;const l=()=>{if(!c){c=!0,r.forEach(clearTimeout),removeEventListener("keydown",u,!0),s.removeEventListener("pointerdown",f);try{localStorage.setItem(Sg,"1")}catch{}H.emit("story:end",void 0),s.classList.add("out"),setTimeout(()=>{s.remove(),n.remove()},650)}};let d=!1;const h=()=>{if(!d){d=!0,o.className="",o.textContent="",s.querySelector(".skip").hidden=!1,a(400,()=>g(0));return}l()},u=x=>{x.preventDefault(),x.stopImmediatePropagation(),x.repeat||h()},f=x=>{x.stopPropagation(),h()};addEventListener("keydown",u,!0),s.addEventListener("pointerdown",f);const g=x=>{if(c)return;if(x>=b0.length){l();return}const p=b0[x];H.emit("story:scene",{index:x}),o.className=p.emphasis?"em":"";const m=[...p.text],_=e?0:55;_===0?o.textContent=p.text:m.forEach((v,I)=>a(I*_,()=>{o.innerHTML="",o.append(m.slice(0,I+1).join(""));const T=document.createElement("span");T.className="cur",o.appendChild(T)}));const b=m.length*_;a(b+M0*1e3,()=>o.classList.add("fade")),a(b+(M0+Eg)*1e3,()=>g(x+1))}}const ec=[{text:"WASD로 이동한다",until:"move"},{text:"우클릭으로 조준, 좌클릭으로 사격",until:"fire"},{text:"좀비는 코어를 노린다. 레인을 막아라",until:"timer"},{text:"웨이브가 끝나면 작전 본부에서 영구 업그레이드",until:"wave"}],v3=6,y3=6,b3=`
#ztTut{position:fixed;left:50%;top:108px;transform:translate(-50%,-6px);z-index:5;pointer-events:none;padding:6px 16px;border:1px solid #2EE6D6;border-radius:6px;background:#121A20b3;color:#e6f2f1;font:600 15px Pretendard,system-ui,sans-serif;white-space:nowrap;opacity:0;transition:opacity .3s ease-out,transform .3s ease-out}
#ztTut.on{opacity:1;transform:translate(-50%,0)}
#ztTut b{color:#2EE6D6;margin-right:8px;font-weight:700}
@media (prefers-reduced-motion:reduce){#ztTut{transition:opacity .1s;transform:translate(-50%,0)}}
`,M3=["KeyW","KeyA","KeyS","KeyD"];class _3{constructor(){this.i=-1,this.t=0,this.active=!1,this.wired=!1}start(){var t;this.stop(),(t=this.el)==null||t.remove(),this.i=-1,this.wired||(this.wired=!0,this.wire(),H.on("run:start",()=>{this.active||this.start()})),this.el=document.createElement("div"),this.el.id="ztTut",document.body.appendChild(this.el),this.active=!0,this.next()}wire(){const t=document.createElement("style");t.textContent=b3,document.head.appendChild(t),H.on("weapon:fired",()=>{var e;((e=this.cur())==null?void 0:e.until)==="fire"&&this.next()}),H.on("wave:clear",()=>{this.active&&this.i<3&&(this.i=2,this.next())}),H.on("run:over",()=>this.stop())}cur(){return this.active?ec[this.i]:void 0}next(){if(!this.el)return;if(this.i++,this.t=0,this.i>=ec.length){this.stop();return}this.el.classList.remove("on");const t=ec[this.i];setTimeout(()=>{!this.el||!this.active||(this.el.innerHTML=`<b>${this.i+1}/${ec.length}</b>${t.text}`,this.el.classList.add("on"))},this.i===0?0:320)}stop(){if(!this.active)return;this.active=!1;const t=this.el;this.el=void 0,t==null||t.classList.remove("on"),setTimeout(()=>t==null?void 0:t.remove(),400)}update(t){var n;const e=this.cur();!e||it.paused||it.modalOpen||(this.t+=t,e.until==="move"&&M3.some(s=>it.keys.has(s))?this.next():e.until==="timer"&&this.t>=v3&&((n=this.el)!=null&&n.classList.contains("on"))?this.el.classList.remove("on"):e.until==="wave"&&this.t>=y3&&this.stop())}}const w3=40,_0=16,S3=4.5,Tg=1.2;let Rs,No="off",Bs,Ag=0,wd=0;const w0=new L,S0=new $n,E0=new L,T0=new $n,E3=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;let nc=Tg,Sd=7;const T3=new L(st.core.x,2,st.core.z);function A3(i){const e=Math.atan2(-(st.playerStart.x-st.core.x),-(st.playerStart.z-st.core.z))+Ag/w3*Math.PI*2;i.position.set(st.core.x+Math.sin(e)*_0,S3,st.core.z+Math.cos(e)*_0),i.lookAt(T3)}function C3(){const i=document.body;i.classList.contains("titleOn")&&(i.classList.add("hudIn"),i.classList.remove("titleOn"),setTimeout(()=>i.classList.remove("hudIn"),600))}function A0(){No==="fly"&&(No="off",it.modalOpen=!1,Bs==null||Bs.start()),C3()}const R3={init(i){new URLSearchParams(location.search).has("notitle")||(No="orbit",it.modalOpen=!0,H.emit("ui:modal",{open:!0}),H.emit("title:hold",{open:!0}),Rs=new d3(()=>{var t,e;Rs==null||Rs.hide(),Rs=void 0,w0.copy(i.camera.position),S0.copy(i.camera.quaternion),No="fly",wd=0,E3()?(nc=.4,Sd=0):(nc=Tg,Sd=7),setTimeout(A0,(nc+1.8)*1e3),H.emit("ui:modal",{open:!1}),it.modalOpen=!0,H.emit("title:hold",{open:!1}),(e=(t=document.getElementById("c"))==null?void 0:t.requestPointerLock)==null||e.call(t)}),p3(Rs.root),Bs=new _3,g3()||x3(Rs.root))},update(i,t){const e=t.camera;if(Bs==null||Bs.update(i),No==="orbit")it.modalOpen=!0,Ag+=i,A3(e);else if(No==="fly"){it.modalOpen=!0,wd+=i;const n=Math.min(1,wd/nc),s=n*n*(3-2*n);if(n>=1){A0();return}E0.copy(e.position),T0.copy(e.quaternion),e.position.lerpVectors(w0,E0,s),e.position.y+=Math.sin(Math.PI*s)*Sd,e.quaternion.slerpQuaternions(S0,T0,s)}}},pe="#2EE6D6",Fo="#FF8A2A",Cg="#E0303A",Oo="#121A20b3",vc="Pretendard,'Pretendard Variable','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif",k3="#0B1014d9",Rg=()=>ii.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches;function P3(i,t,e,n=.6){if(Rg()||t<=0){i.textContent=e(t);return}const s=performance.now(),o=r=>{const a=Math.min(1,(r-s)/(n*1e3)),c=1-(1-a)**3;i.textContent=e(a>=1?t:t*c),a<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}class L3{constructor(){this.s={kills:0,hits:0,headshots:0,time:0,wave:1},H.on("run:start",({startWave:t})=>Object.assign(this.s,{kills:0,hits:0,headshots:0,time:0,wave:t})),H.on("wave:start",({wave:t})=>{this.s.wave=t}),H.on("enemy:killed",({byAlly:t})=>{t||this.s.kills++}),H.on("weapon:sound",({kind:t})=>{(t==="hit"||t==="kill"||t==="headshot")&&this.s.hits++,t==="headshot"&&this.s.headshots++})}tick(t){it.modalOpen||(this.s.time+=t)}headshotPct(){return this.s.hits?Math.round(this.s.headshots/this.s.hits*100):0}}const C0=i=>`${Math.floor(i/60)}:${String(Math.floor(i%60)).padStart(2,"0")}`,D3=`
#ovResult{position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;background:${k3};backdrop-filter:blur(6px);font-family:${vc};color:#e6f2f1}
#ovResult.on{display:flex;animation:ovFade .25s ease-out}
#ovResult.out{opacity:0;transition:opacity .3s ease-out;pointer-events:none}
#ovResult .card{background:${Oo};border:1px solid ${pe}55;border-radius:12px;padding:28px 32px;width:min(560px,90vw);text-align:center;animation:ovSlide .25s ease-out}
#ovResult h2{margin:0;font-size:48px;font-weight:800;color:${pe};letter-spacing:1px}
#ovResult.lose h2{color:${Cg}}
#ovResult .sub{margin:6px 0 20px;color:${pe}b3;font-size:15px}
#ovResult .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}
#ovResult .cell{background:#121A20b3;border:1px solid ${pe}33;border-radius:8px;padding:10px 4px}
#ovResult .num{font-size:26px;font-weight:800;color:#e6f2f1;font-variant-numeric:tabular-nums}
#ovResult .lab{font-size:12px;color:${pe}b3;margin-top:2px}
#ovResult .acts{display:grid;grid-template-columns:repeat(3,132px);gap:16px;justify-content:center}
#ovResult button{font:700 15px ${vc};border-radius:6px;padding:9px 20px;cursor:pointer;transition:transform .2s ease-out}
#ovResult .primary{background:${Fo};color:#07090d;border:1px solid ${Fo}}
#ovResult .ghost{background:transparent;color:${pe};border:1px solid ${pe}}
#ovResult .ghost.gray{color:#8FA3AD;border-color:#8FA3AD}
#ovResult .acts button{width:100%;height:42px;padding:0 12px}
#ovResult button:hover{transform:translateY(-1px)}
#ovResult button:focus-visible{outline:none;box-shadow:0 0 0 2px #07090d,0 0 0 4px ${pe}}
#ovWave{position:fixed;left:50%;top:18%;z-index:40;transform:translateX(-50%);display:none;background:${Oo};border:1px solid ${pe}66;border-radius:10px;padding:12px 26px;text-align:center;font-family:${vc};pointer-events:none}
#ovWave.on{display:block;animation:ovDrop .25s ease-out}
#ovWave b{display:block;font-size:28px;color:${pe};font-weight:800}
#ovWave span{font-size:13px;color:#e6f2f1cc}
@keyframes ovSlide{from{opacity:0;transform:translateY(12px)}}
@keyframes ovDrop{from{opacity:0;transform:translate(-50%,-10px)}}
.ovRM #ovResult,.ovRM #ovResult .card,.ovRM #ovWave{animation:none!important}
@media (prefers-reduced-motion:reduce){#ovResult,#ovResult .card,#ovWave{animation:none!important}}`,I3=[["kills","처치"],["hs","헤드샷"],["wave","도달 웨이브"],["time","생존 시간"]];class z3{constructor(){this.stats=new L3,this.root=document.createElement("div"),this.wave=document.createElement("div"),this.waveTimer=0,this.timers=[],this.root.id="ovResult",this.root.innerHTML=`<div class="card" role="dialog" aria-modal="true"><h2>게임 오버</h2><div class="sub"></div>
      <div class="grid">${I3.map(([t,e])=>`<div class="cell"><div class="num" data-k="${t}">0</div><div class="lab">${e}</div></div>`).join("")}</div>
      <div class="acts"><button class="primary" data-act="again">다시 출격</button><button class="ghost" data-act="upgrade">업그레이드</button><button class="ghost gray" data-act="title">타이틀로</button></div></div>`,this.wave.id="ovWave",document.body.append(this.root,this.wave),this.root.addEventListener("click",t=>{var e;return this.onAct((e=t.target.closest("button"))==null?void 0:e.dataset.act)}),addEventListener("keydown",t=>{t.key==="Escape"&&this.root.classList.contains("on")&&this.hide()}),H.on("run:over",({wave:t,reason:e})=>this.showGameOver(t,e)),H.on("wave:clear",({wave:t})=>this.showWaveClear(t)),H.on("run:start",()=>this.hide())}update(t){this.stats.tick(t),this.waveTimer>0&&(this.waveTimer-=t)<=0&&this.wave.classList.remove("on")}motionClass(){document.body.classList.toggle("ovRM",Rg())}showGameOver(t,e){var r,a;this.motionClass();const n=this.stats.s;this.root.classList.remove("out"),this.root.classList.add("on","lose"),this.clearTimers(),e==="player"&&this.timers.push(window.setTimeout(()=>{this.root.classList.add("out"),R0(),this.timers.push(window.setTimeout(()=>this.hide(),300))},1500)),this.root.querySelector(".sub").textContent=e==="core"?"코어가 함락됐다.":"생존자가 쓰러졌다.";const s={kills:[n.kills,c=>String(Math.round(c))],hs:[this.stats.headshotPct(),c=>`${Math.round(c)}%`],wave:[Math.max(t,n.wave),c=>String(Math.round(c))],time:[n.time,C0]},o=n.kills===0||n.hits===0;this.root.querySelectorAll(".num").forEach(c=>{if(c.dataset.k==="hs"&&o){c.textContent="—";return}const[l,d]=s[c.dataset.k];P3(c,l,d)}),e==="core"?this.root.querySelector(".primary").focus():(a=(r=document.activeElement)==null?void 0:r.blur)==null||a.call(r)}showWaveClear(t){this.motionClass(),this.wave.innerHTML=`<b>웨이브 ${t} 클리어</b><span>처치 ${this.stats.s.kills} · ${C0(this.stats.s.time)}</span>`,this.wave.classList.remove("on"),this.wave.offsetWidth,this.wave.classList.add("on"),this.waveTimer=2.4}hide(){this.root.classList.remove("on","out"),this.clearTimers()}clearTimers(){for(const t of this.timers)clearTimeout(t);this.timers.length=0}onAct(t){var e,n;t==="again"?(this.hide(),(e=document.querySelector('#t2d [data-act="launch"]'))==null||e.click()):t==="upgrade"?(this.hide(),(n=document.querySelector("#t2d nav button"))==null||n.click(),R0()):t==="title"&&location.reload()}}function R0(){var i;(i=document.querySelector('#t2d [data-act="launch"]'))==null||i.focus({preventScroll:!0})}let ic;const U3=`
html,body{font-family:${vc}}
#modal{background:#05080bcc;backdrop-filter:blur(3px)}
#modal[style*="flex"]{animation:ovFade .25s ease-out}
#modal[style*="flex"] #box{animation:ovRise .3s ease-out}
#box{background:${Oo};border:1px solid ${pe}66;border-radius:10px;padding:22px 28px;box-shadow:0 12px 40px #000a,inset 0 0 0 1px #ffffff08;font-size:15px;line-height:1.5}
#box h2{font-size:24px;font-weight:800;letter-spacing:.5px;color:${pe};margin:0 0 14px}
#box .br{color:${Fo}}
#box .row{border-bottom:1px solid ${pe}1f;padding:7px 4px;border-radius:6px;transition:background .2s ease-out,transform .2s ease-out,box-shadow .25s ease-out}
#box .row:hover{background:#ffffff08;transform:scale(1.03);box-shadow:inset 0 0 0 1px ${Fo}}
#box button{background:${Fo};color:#07090d;font-weight:700;border-radius:6px;padding:7px 14px;transition:background .2s ease-out,transform .2s ease-out,box-shadow .25s ease-out}
#box button:hover:not(:disabled){background:#ffa557;transform:translateY(-1px);box-shadow:0 0 0 1px ${pe}}
#box button:active:not(:disabled){transform:scale(.97);transition-duration:.06s}
#box button:focus-visible{outline:none;box-shadow:0 0 0 2px #07090d,0 0 0 4px ${pe}}
#box button.sec{background:#26323b;color:#e6f2f1}
#box button:disabled{background:#2a3037;color:#7d868e}
#box .ovBought{animation:ovBought .25s ease-out}
#pauseBanner{background:${Oo};border:1px solid ${pe}66;color:#e6f2f1;animation:ovFade .25s ease-out}
#pauseBanner[style*="none"]{animation:none}
#lockHint{background:${Oo};border:1px solid ${pe}33}
/* 업그레이드(2D 타이쿤) 카드: 외형만 덧입힘. 동작·수치는 tycoon2d 그대로 */
body #t2d .card,body #t2d .panelbox,body #t2d .coin{background:${Oo};border:1px solid ${pe}55}
body #t2d .card{transition:transform .2s ease-out,box-shadow .25s ease-out,border-color .2s ease-out;animation-fill-mode:backwards}
body #t2d .card:hover{transform:scale(1.03);border-color:${Fo};box-shadow:0 8px 22px #0008}
body #t2d .card.can{border-color:${pe}88}
body #t2d .card.flash{animation:ovBought .25s ease-out}
body #t2d .buy{background:${pe};color:#07090d;border:1px solid ${pe};box-shadow:none;transition:background .2s ease-out,transform .2s ease-out}
body #t2d .buy:hover:not(:disabled){filter:none;background:#5ff0e3}
body #t2d .buy:active:not(:disabled){transform:scale(.97);box-shadow:none}
/* 비용이 모자라면(빨간 비용 칩) 채우지 않고 외곽선만 */
body #t2d .card:has(.cost.bad) .buy:not(:disabled){background:#121A20;color:${pe};border:1px solid ${pe}}
body #t2d .card:has(.cost.bad) .buy:not(:disabled):hover{background:${pe}1f}
body #t2d .buy:disabled{background:#121A20;color:${pe}aa;border:1px solid ${pe};box-shadow:none;cursor:not-allowed}
body #t2d .panelbox h3,body #t2d .sect{color:${pe}}
@keyframes ovFade{from{opacity:0}}
@keyframes ovRise{from{opacity:0;transform:translateY(10px) scale(.98)}}
@keyframes ovBought{from{box-shadow:0 0 0 0 ${pe}cc}to{box-shadow:0 0 0 10px ${pe}00}}
#box .danger,#box .lose{color:${Cg}}
@media (prefers-reduced-motion:reduce){
#modal *,#modal,#pauseBanner{animation-duration:.01s!important}
#box .row:hover,#box button:hover:not(:disabled),body #t2d .card:hover{transform:none}
body #t2d .card.flash{animation:none}
}`,N3={init(){var t;const i=document.createElement("style");i.textContent=U3+D3,ic=new z3,document.head.appendChild(i),(t=document.getElementById("box"))==null||t.addEventListener("click",e=>{const n=e.target.closest("button");if(!n||n.disabled)return;const s=n.closest(".row")??n;s.classList.remove("ovBought"),s.offsetWidth,s.classList.add("ovBought")})},update(i){ic==null||ic.update(i)}},kg=new URLSearchParams(location.search).has("playtest");uc.combat=!kg;kw(document.getElementById("c"),kg?[wp,Ep,NS,Gp]:[e3,jw,zE,wp,cS,gT,Ep,Gp,xT,c3,N3,R3]);
