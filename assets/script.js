'use strict';

(function(){

const navContent={};

navContent.titles=[
  {
    'slug':'club-rules',
    'ja':'アイテム協力会 クラブ規則2',
    'en':'',
  },
  {
    'slug':'shadowban',
    'ja':'誤バンされて上級モードに強制隔離',
    'en':'',
    '':'',
  },
//   {
//     'slug':'',
//     'ja':'',
//     'en':'',
//     '':'',
//   },
];

navContent.links=`
<p>Links:</p>
<ul>
<<<<<<< Updated upstream
<li><a href="https://www.youtube.com/watch?v=m5QcKfOj-hM&list=PLRWvA5v5MAMm9yZ1uVbSdjn-kD8qQBbRP" target="_blank" rel="noopener">megacitytk - YouTube</a></li>
=======
<li><a href="https://www.youtube.com/watch?v=NIk8KkoJdFY&list=PLRWvA5v5MAMm9yZ1uVbSdjn-kD8qQBbRP" target="_blank" rel="noopener">megacitytk - YouTube</a></li>
>>>>>>> Stashed changes
<li><a href="https://x.com/megacitytk" target="_blank" rel="noopener">megacitytk - X</a></li>
</ul>
`;

const scriptList=[];
const url=location.href;
const web=isWebProtocol(url);
const path=url.split(generateHostname())[1];
const dir=generateDir();
const fileName=getFileName();
const lang=document.getElementsByTagName('html')[0].getAttribute('lang');
const article=document.getElementById('article');
const nav=document.getElementById('nav');
const langList={
  'en':'English',
  'ja':'Japanese',
//   '':'',
}

//**************
//表示される環境(client,server)に合わせる
//**************

function isWebProtocol(url){
  try{
    const protocol=new URL(url).protocol;// URLオブジェクトを作成し、プロトコル部分 ('https:', 'file:', など) を取得
    return protocol==='https:'||protocol==='http:';// 'https:' または 'http:' であるかを判定
  }catch(e){
    return false;// 無効なURL（例: 'about:blank'）の場合、ここではfalseを返す
  }
}

function generateHostname(){
  let hostname=location.hostname;
  if(!web){
    const siteId=document.body.dataset.siteId;
    hostname=url.split(siteId)[0];
    hostname+=siteId;
  }
  return hostname;
}

function generateDir(){
  let count=0;
  const ex=/\//g;
  const arr=path.match(ex);
  if(arr!==null){
    count=arr.length;
  }
  let dir='';
  if(count>1){
    dir='../';
  }
  return dir;
}

function getFileName(){
  let fileName=window.location.href.split('/').pop();
  if(!fileName){
    fileName='index.html';
  }
  return fileName;
}

//**************
//表示されるページのユーザビリティを上げる
//**************

function canonicalPath(){
  const canonical=document.getElementById('canonical');
  if(!canonical)return '';
  const url=canonical.getAttribute('href');
  const origin=location.origin;
  if(url.indexOf(origin)!==0)return '';
  return url.substring(origin.length);
}

function buildNav(){
  const titles=navContent.titles;
  let html='';
  if(navContent.titles.length>0){
    let count=0;
    html+=`<p>Pages:</p><ul>`;
    for(let i=0;i<titles.length;i++){
      const slug=titles[i].slug;
      if(titles[i][lang]!==''){
        html+=`<li><a href="/${lang}/${slug}">${titles[i][lang]}</a></li>\n`;
        count++;
      }
    }
    html+='</ul>';
    if(!count){
      html='';
    }
//     html+=`<p><a href="/${lang}/">Back to home</a></p>`;
  }
  html+=navContent.links;
  if(hashLength(langList)>1){
    html+=`<p>Languages:</p><ul>`;
    for(const key in langList){
      let dir=`/${key}/`;
      if(key=='en'){
        dir='/';
      }
      html+=`<li><a href="${dir}">${langList[key]}</a></li>`;
    }
    html+='</ul>';
  }
  return html;
}

function renderNav(){
  nav.innerHTML=buildNav();
  markCurrentPage();
}

function markCurrentPage(){
  const links=nav.getElementsByTagName('a');
  const currentPath=canonicalPath();
  for(let i=0;i<links.length;i++){
    const linkPath=links[i].getAttribute('href');
    if(linkPath===currentPath){
      links[i].classList.add('current');
    }
  }
}

function removeUrlParams(){
  const hasParams=location.search.length>0;
  const isHistorySupported=typeof history.replaceState==='function';
  if(hasParams&&isHistorySupported){
    const urlWithoutParams=location.origin+location.pathname;
    history.replaceState(null,'',urlWithoutParams);
  }
}

//**************
//JavaScriptファイルを新たに読み込む
//**************

function selectScript(){
  let script=dir+'../cms/assets/local.js';
  if(web){
    script='https://a.megacity.tk/a/s.js'
  }
  scriptList.push(script);
}

async function loadScriptsInOrder(urls,callback){
  let i=0;
  function loadNext(){
    if(i<urls.length){
      const s=document.createElement('script');
      s.src=urls[i];
      s.onload=function(){
        i++;
        loadNext();
      };
      document.body.appendChild(s);
    }else if(callback){
      callback();
    }
  }
  loadNext();
}

//**************
//utility
//**************

//連想配列（ハッシュ）の数を取得
function hashLength(obj) {
  if(typeof obj!=='object') return false;
  let count=0;
  for(let key in obj)count++;
  return count;
};

//summaryに連番を振る
function datasetNumber(el){//el=element
  const elList=main.querySelectorAll(el);
  if(elList){
    for(let i=0;i<elList.length;i++){
      const j=i+1;//elの順番を0からではなく1から始めるため
      elList[i].dataset.number=j;
      if(!elList[i].id){
        elList[i].id=el+'-'+j;
      }
    }
  }
}

function addClassJsEnabled(){
  document.body.classList.add('jsEnabled');
}

function removeTags(tag){
  const tags=document.getElementsByTagName(tag);
  for(let i=0;i<tags.length;i++){
    tags[i].remove();
  }
}

//**************
//初期化
//**************

async function init(){
  selectScript();
  await loadScriptsInOrder(scriptList);
  renderNav();
  datasetNumber('summary');
  addClassJsEnabled();
  window.addEventListener('load',function(){
    removeTags('noscript');
    setTimeout(removeUrlParams,1000);
  });
}

init();

})();
