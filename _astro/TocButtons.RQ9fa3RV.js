import{d as T,c as N,g as i,a as d,i as l,b as m,e as _,r as P,s as b,t as o}from"./web.T9m9vBJE.js";var B=o('<div class="table-of-contents-btns fixed z-20"><div hstack justify-end pt-18 pb-2 bg-c><!$><!/><!$><!/><!$><!/><button flex-center hover:opacity-60><span i-ic:round-keyboard-arrow-up text-xl></span></button><button class="flex-center hover:opacity-60 ml-1.5"><span i-mi:print text-sm>'),C=o('<span text="sm c-light"italic mr-3>'),I=o('<a class="flex-center !text-c hover:opacity-60"><span i-ic:round-keyboard-arrow-left text-xl>'),M=o('<a class="flex-center !text-c hover:opacity-60"><span i-ic:round-keyboard-arrow-right text-xl>');const z=r=>{const f=["Last Post","Next Post","Back to Top","Print"],[$,t]=N(0),g=()=>window.scrollTo({top:0,behavior:"smooth"}),h=()=>window.print();return(()=>{var v=i(B),s=v.firstChild,E=s.firstChild,[x,k]=d(E.nextSibling),y=x.nextSibling,[p,L]=d(y.nextSibling),S=p.nextSibling,[u,w]=d(S.nextSibling),a=u.nextSibling,c=a.nextSibling;return l(s,$&&(()=>{var n=i(C);return l(n,()=>f[$()-1]),n})(),x,k),l(s,(()=>{var n=m(()=>!!r.prev);return()=>n()&&(()=>{var e=i(I);return e.addEventListener("mouseleave",()=>t(0)),e.addEventListener("mouseenter",()=>t(1)),_(()=>b(e,"href",`/posts/${r.prev}`)),e})()})(),p,L),l(s,(()=>{var n=m(()=>!!r.next);return()=>n()&&(()=>{var e=i(M);return e.addEventListener("mouseleave",()=>t(0)),e.addEventListener("mouseenter",()=>t(2)),_(()=>b(e,"href",`/posts/${r.next}`)),e})()})(),u,w),a.addEventListener("mouseleave",()=>t(0)),a.addEventListener("mouseenter",()=>t(3)),a.$$click=g,c.addEventListener("mouseleave",()=>t(0)),c.addEventListener("mouseenter",()=>t(4)),c.$$click=h,P(),v})()};T(["click"]);export{z as default};
