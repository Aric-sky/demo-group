/**
* 处理 外站h5 native 跳转
**/
import PubSub from 'pubsub-js';
import Mtop from '../../mtop';
import mobile from './mobile';
import config from '../../original/military/config';
import getParams from './getParams';
import UA from './browser';
import callApp from './callApp';

const urlParam = getParams();
const baseUrl = 'https://hudong.vip.youku.com/act/mili/index.html';
let url = '';
//获取页面上的全局配置configData
let dataconfig  = null;
try{
  dataconfig = configData;
}catch(e){
  dataconfig = null;
}
//configData 是页面上的全局对象
/**
 * 获取配置信息 configData是全局配置，在页面中引用
 * @param  {[type]} urlParam [description]
 * @return {[type]}          [description]
 */
function getDownLoad(urlParam){
    let _type = urlParam.type||"youku";
    if(dataconfig){
        let _list = dataconfig.channelList;
        for(let obj in _list){
            if(obj.type === _type){
                return obj;
            }
        }
    }
    return {
       iosUrl: "https://itunes.apple.com/app/apple-store/id336141475?pt=278534&ct=junshilianmengSCOTT&mt=8",
       androidUrl: "http://down2.uc.cn/youku/down.php?pub=824212819d9c8ea5"
    };
}

function goPage(url){
  let downloadData = getDownLoad(urlParam);
	let ykconfig = {
        isNeedDownload: true, //是否需要下载页
        downloadUrl: (dataconfig && dataconfig.downUrl)? dataconfig.downUrl : (UA.iOS ? downloadData.iosUrl : downloadData.androidUrl), //下载页地址，不传默认走download.html
        uri: '', //是否跳转h5页面
        replace: false, //是否替换当前页面,只支持跳转uri的时候
        params: {
            "action": "http", //必须传（支持play,download,http,splash）
            "vid": '', //唤起播放页必须传
            "source": urlParam.type ? ("social_"+urlParam.type) : "social_youku", //可不传
            "url": url,
            "universalLinkState":true
        },
        pathname: "http", //必须传 与 params.action一致
        exdParams: { //透传到下载页的参数
<<<<<<< HEAD
            from : urlParam.type||"youku",
            uriDownload: "",
            download: UA.iOS ? downloadData.iosUrl : downloadData.androidUrl
=======
          from : urlParam.type||"youku",
          uriDownload: "",
          download: UA.iOS ? downloadData.iosUrl : downloadData.androidUrl
>>>>>>> 906fa39045d3b8b9941156f8f6e646fe87974d3b
        }
    };
  if(UA.isYouku){
  	location.replace(url);
  }else{
  	callApp.gotoPage(ykconfig);
  }
}

let subscribeParams = false;


const h5CallApp =  {
  setToken(params, callback) {
      const defaultParams = {
        mtopDomain: config.mtopDomain,
        appKey: config.appKey,
        api: 'com.youku.aplatform.weakGet',
        ecode: 0,
        bizType: 'aacc.socialPageInfo',
        bizParam: {
            token: urlParam.token,
            cid: urlParam.cid
        },
      };

      const newOpts = Object.assign(defaultParams, params);
      Mtop.getMtopinfo(newOpts).then((res) => {
        if (res.data.success) {
            const token = res.data.result.token;
            this.token = token || '';
            if (!this.token) {
              // this.__btn.style.display = 'none';
            }
            let type = urlParam.type || 'social_youku';
            if (newOpts.bizParam.channel) {
              type = newOpts.bizParam.channel;
            }
            url = baseUrl + '?type=' + type + '&token=' + this.token;
            if (Array.isArray(res.data.result.cards)) {
              PubSub.publish('PLAYER_DIGIT', res.data.result.cards.length);
            } 
            url += '&isWindVane=1';
            if (typeof callback === 'function') {
                callback(token);
            }
        }
    });  },

  linkBtn(domSelector, needToken = true, params, clickHandle) {
    const $btn = document.querySelector(domSelector);
    this.__btn = $btn;
    this.needToken = needToken;
    if (!this.token && typeof needToken !== 'string') {
      this.setToken(params);
    }
    
    const self = this;
    if ($btn) {
      if (needToken === 'api') {
        subscribeParams = params;  
      }
      $btn.addEventListener('click',(e) => {
        e.preventDefault();
        if (typeof clickHandle === 'function') {
          clickHandle();
        }
        if(needToken && !this.token) {
          return false;
        }
        this.__goUrl();
      }, false);
    }
  },
  
  __goUrl() {
    if (this.needToken === 'api') {
      if(window.WindVane) {
        if (UA.iOS) {
          window.WindVane.call('DYKBaseJSBridge', 'nativeOpen', {
            'url': 'youku://openWVH5?url=' + encodeURI(url)
          });
        } else if(UA.android) {
          window.WindVane.call("WVPopLayer", "navToUrl", {
            url: url
          });
        }
      } else {
        mobile.openUrl({
          url,
        });  
      }
      
    } else {
      goPage(url);
    }
  },
  dataconfig:dataconfig
};

// this is a PubSub subscribe bug 
PubSub.subscribe('PLAYER_DURATION_DONE', (ev, res) => {
  if(res && subscribeParams) {
    h5CallApp.setToken(subscribeParams);  
  }
});

export default h5CallApp;

