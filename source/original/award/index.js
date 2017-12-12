import PubSub from 'pubsub-js';
import Mtop from '../../mtop'
import goldlog from '../../common/utils/goldlog'
import config from './config'
import Bridge from "../../common/bridge";


const   interfaces = {
            bizType: {
                getLastUserAddress: 'awardCenter.getLastAddress',
                getList: 'awardCenter.getList',
                getAward: 'awardCenter.getAward',
                getAlipayInfo: 'awardCenter.getAlipayInfo',
                recordAddress: 'awardCenter.recordAddress'
            },
            weakGet:"com.youku.aplatform.weakGet",    //（无安全可以不登陆）
            securySet:"com.youku.aplatform.securySet",  //(无安全必须登录)
            get:"com.youku.aplatform.get"       //（有安全必须登录）
        }

class Award{
    constructor(){
        // this.awards = []; //当前所有奖品list
        localStorage['firstTx'] = true;
        this.today = '';
        this.tipStr = '';
        this.awardId = '';
        this.alipayID = '';
        this.realName = '';
        this.body = $('body');
        this.isLogin = false;
        this.isPartIn = false;
        this.onBindAlipay = false;
        this.ele = '';
        this.onRegAlipay = globalConfig.onRegAlipay;
        this.alipayRegUrl = globalConfig.alipayRegUrl;
        this.init();
    }
    init(){
        this.stopDoubleClick();
        this.getLists();
        this.addEvents();
        this.handleListData();
        this.handleStyle();
    }
    /* 阻止用户双击使屏幕上滑 */
    stopDoubleClick(){
      var iLastTouch = null;
        document.body.addEventListener('touchend', function(event){
            var iNow = new Date().getTime();
            iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
            var delta = iNow - iLastTouch;
            if (delta < 500 && delta > 0){
                event.preventDefault();
                return false;
            }
            iLastTouch = iNow;
        }, false);
    }
    handleStyle(){
        const _self = this;
        const desc = globalConfig.hdDesc;
        const hdItem = globalConfig.hdItem;
        const args = getUrlParam();
        $('.bottom').html(desc);
        if(args.from){
            switch (args.from) {
                case 'default':
                    $('.wrap').addClass('default');
                    break;
                case 'card':
                    $('.wrap').addClass('card-wrap').removeClass('default').removeClass('swordrain-wrap');
                    break;
                case 'swordrain':
                    $('.wrap').addClass('swordrain-wrap').removeClass('default').removeClass('card-wrap');
                    break;
            }
        }
        
    }
    handleListData(){
        const _self = this;
        PubSub.subscribe('award-lists', (evtName, res)=>{
            const $awardLists = [];
            const result = res.data && res.data.result;
            this.today = result && result.time
            this.today = this.today * 1000; 
            if (res.data && res.data.success) {
                if(result.e.code == "0"){
                    this.isLogin = true;
                    this.handleState(this.isLogin, this.tipStr, '');
                    if(typeof result.data == "string"){
                        const data = JSON.parse(result.data);
                        if(data && data.length > 0){
                            this.isPartIn = true;
                            this.renderLists(data);
                        }else{
                            this.isPartIn = false;
                            this.tipStr = `<p>积极参加活动，一定会有好运来临</p>`;
                            this.handleState(this.isLogin, this.isPartIn, this.tipStr);
                        }
                    }
                }else if(result.e.code == "-10"){
                    this.isLogin = false;
                    this.tipStr = `<p>登录优酷账号才能查看奖品哦</p><a href="javascript:;" class="btn login-btn" id="login-btn">登录</a>`;
                    this.handleState(this.isLogin, false, this.tipStr);
                }
            }
        });
        PubSub.subscribe('alipay-info',(evtName, res)=>{
            const result = res.data && res.data.result;
            let opts = {};
            if (res.data && res.data.success) {
                // _self.handleError(code);
                if(result.e.code == '0'){
                    _self.onBindAlipay = true;
                    if(typeof result.data == "string"){
                        const data = JSON.parse(result.data);
                        const firstTx = localStorage.getItem('firstTx');
                        _self.alipayID = data.alipayID;
                        _self.realName = data.realName;
                        opts = {
                            type: `normal`,
                            msg:`您将提取到${data.alipayID}支付宝账号`,
                            showBtn: true,
                            btnTxt: `确定`,
                            btnId: 'txBtn',
                            awardId: _self.awardId
                        }
                        if(firstTx == 'true'){
                            opts.changeBtn = true;
                            opts.btnTxt = `确定`;
                            opts.changeBtnTxt =  `更换支付宝`;
                            opts.changeBtnId = 'reBind';
                        }
                        _self.renderToast(opts);
                    }
                }else if(result.e.code == '-10'){
                    _self.isLogin = false;
                    _self.tipStr = `<p>登录优酷账号才能查看奖品哦</p><a href="javascript:;" class="btn login-btn" id="login-btn">登录</a>`;
                    _self.handleState(_self.isLogin, false, _self.tipStr);
                }else if(result.e.code == '-500'){
                    _self.onBindAlipay = false;
                    _self.showForm();
                }else if(result.e.code == '-501' || result.e.code == '-502'){
                    opts = {
                        type: `normal`,
                        msg:`您的支付宝账号已完成多次奖金提取  换个支付宝帐号试下吧`,
                        showBtn: true,
                        btnTxt: `更换支付宝`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }else if(result.e.code == '-510'){
                    opts = {
                        type: `normal`,
                        msg:`当前支付宝账号不能为空 请重新输入`,
                        showBtn: true,
                        btnTxt: `重新提取`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }else if(result.e.code == '-511'){
                    opts = {
                        type: `normal`,
                        msg:`当前支付宝账号过长 请重新输入`,
                        showBtn: true,
                        btnTxt: `重新提取`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }else if(result.e.code == '-512'){
                    opts = {
                        type: `normal`,
                        msg:`当前支付宝账号不合法 请重新输入`,
                        showBtn: true,
                        btnTxt: `重新提取`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }else if(result.e.code == '-513'){
                    opts = {
                        type: `normal`,
                        msg:`当前支付宝账号对应的真实姓名为空`,
                        showBtn: true,
                        btnTxt: `重新提取`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }else if(result.e.code == '-514'){
                    opts = {
                        type: `normal`,
                        msg:`当前支付宝账号对应的真实姓名过长 请重新输入`,
                        showBtn: true,
                        btnTxt: `重新提取`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }else if(result.e.code == '-515'){
                    opts = {
                        type: `normal`,
                        msg:`当前支付宝账号对应的真实姓名不合法 请重新输入`,
                        showBtn: true,
                        btnTxt: `重新提取`,
                        btnId: 'reBind'
                    }
                    _self.renderToast(opts);
                }
                
            }
        });

    }
    handleError(code){
        const _self = this;
        if(code == '-501' || code == '-502'){
            opts = {
                type: `normal`,
                msg:`您的支付宝账号已完成多次奖金提取  换个支付宝帐号试下吧`,
                showBtn: true,
                btnTxt: `更换支付宝`,
                btnId: 'reBind'
            }
            _self.renderToast(opts);
        }
    }

    handleAward(state, msg, data, ele){
        const _self = this;
        let opts = {};
        switch(state){
            case -20: 
                opts = {
                    type: `normal`,
                    msg:`param award_id lost`,
                    showBtn: true,
                    btnTxt: `去绑定`,
                    btnId: 'toBindBtnAli'
                }
                _self.renderToast(opts);
                break;
            case 400: 
                opts = {
                    type: `normal`,
                    msg:`您尚未绑定支付宝<br>请绑定之后再领取呐`,
                    showBtn: true,
                    btnTxt: `去绑定`,
                    btnId: 'toBindBtnAli'
                }
                _self.renderToast(opts);
                break;

            case 0:
                // todo 支付宝红包奖品 1  --- 您已成功存入到XXX支付宝账号
                // todo 会员 2  -  领奖成功
                if(data.awardType == 1){
                    // todo 唤起支付宝
                    opts = {
                        type: `normal`,
                        msg:`您成功存入到${data.alipayID}支付宝账号`,
                        showBtn: true,
                        btnTxt: `去支付宝查看`,
                        btnId: 'lunchAlipay'
                    }
                    ele.html('已提现').removeClass('unused');
                    localStorage['firstTx'] = true;
                    
                }else{
                    opts = {
                        type: `normal`,
                        msg:`领奖成功`,
                        showBtn: true,
                        btnTxt: `确定`,
                        btnId: 'hideMaskBtn'
                    }
                    ele.html('已领取').removeClass('unused');

                }
                _self.renderToast(opts);
                ele.data('state','3');
                break;
            case 401: 
                _self.bindMobile();
                break;
            case 402:
                opts = {
                    type: `normal`,
                    msg:`领奖成功`,
                    showBtn: true,
                    btnTxt: `确定`,
                    btnId: 'hideMaskBtn'
                }
                _self.renderToast(opts);
                ele.data('state','3');
                ele.html('已领取').removeClass('unused');
                break;
            case 403:
                opts = {
                    type: `normal`,
                    msg:`领奖成功`,
                    showBtn: true,
                    btnTxt: `确定`,
                    btnId: 'hideMaskBtn'
                }
                _self.renderToast(opts);
                ele.data('state','3');
                ele.html('已领取').removeClass('unused');
                break;
            case 404:
                opts = {
                    type: `normal`,
                    msg:``,
                    showBtn: false,
                    btnTxt: ``,
                    btnId: ''
                }
                if(data.awardType == 1){
                    // todo 扩展404 msg
                    switch (msg) {
                        case 'PAYEE_NOT_EXIST':
                            opts.msg = '很抱歉，您输出的支付宝帐号不存在，请重新输入';
                            opts.showBtn = true;
                            opts.btnTxt = '重新提取';
                            opts.btnId = 'reBind';
                            break;
                        case 'PAYEE_USER_INFO_ERROR':
                            opts.msg = '支付宝账号和姓名不匹配，请确认姓名是否正确';
                            opts.showBtn = true;
                            opts.btnTxt = '重新提取';
                            opts.btnId = 'reBind';
                            break;
                        default: 
                            opts = {
                                type: `normal`,
                                msg:`领奖失败<br>换个姿势 再来一次`,
                                showBtn: false,
                                btnTxt: ``,
                                btnId: ''
                            }
                            break;
                    }
                }

                _self.renderToast(opts);
                break;
            case 405: 
                opts = {
                    type: `normal`,
                    msg:`您尚未绑定淘宝账户<br>请绑定之后再领取呐`,
                    showBtn: true,
                    btnTxt: `去绑定`,
                    btnId: 'toBindBtnTB'
                }
                _self.renderToast(opts);
                break;
                
            case -501:
                opts = {
                    type: `normal`,
                    msg:`您的支付宝账号已完成多次奖金提取  换个支付宝帐号试下吧`,
                    showBtn: true,
                    btnTxt: `更换支付宝`,
                    btnId: 'reBind'
                }
                _self.renderToast(opts);
                break;
            case -502:
                opts = {
                    type: `normal`,
                    msg:`您的支付宝账号已完成多次奖金提取  换个支付宝帐号试下吧`,
                    showBtn: true,
                    btnTxt: `更换支付宝`,
                    btnId: 'reBind'
                }
                _self.renderToast(opts);
                break;       
            case -510:
                opts = {
                    type: `normal`,
                    msg:`领奖失败<br>换个姿势 再来一次`,
                    showBtn: true,
                    btnTxt: `hideMaskBtn`,
                    btnId: ''
                }
                _self.renderToast(opts);
                break;
            case -513:
                opts = {
                    type: `normal`,
                    msg:`领奖失败<br>换个姿势 再来一次`,
                    showBtn: false,
                    btnTxt: ``,
                    btnId: ''
                }
                _self.renderToast(opts);
                break;
            case -406:
                opts = {
                    type: `normal`,
                    msg:`领奖失败<br>换个姿势 再来一次`,
                    showBtn: false,
                    btnTxt: ``,
                    btnId: ''
                }
                
                // todo 扩展404 msg
                switch (msg) {
                    case 'PAYEE_NOT_EXIST':
                        opts.msg = '收款账户不存在';
                        break;
                    case 'PAYEE_USER_INFO_ERROR':
                        opts.msg = '支付宝账号和姓名不匹配，请确认姓名是否正确';
                        break;
                    case 'PAYEE_USER_INFO_ERROR':
                        opts.msg = '支付宝账号和姓名不匹配，请确认姓名是否正确';
                        break;
                }
                _self.renderToast(opts);
                break;
            default:
                opts = {
                    type: `normal`,
                    msg: `领奖失败<br>换个姿势 再来一次`,
                    showBtn: false,
                    btnTxt: ``,
                    btnId: ''
                }
                _self.renderToast(opts);
                break;
        }
    }

    addEvents(){
        let _self = this;
        if(!_self.isLogin){
            this.body.on('touchend', '#login-btn', $.proxy(this.login, this));
            this.body.on('touchend', '#reload-btn', function(){
                location.reload();
            });
        }
        this.body.on('touchend','#lunchAlipay', function(){
            location.href = _self.alipayRegUrl;
        });

        this.body.on('touchend', '.award-btn', function(e){
            e.preventDefault();
            e.stopPropagation();
            var id = $(this).attr('id');
            var $btn = $(`#${id}`);
            const $awardState = $(this).data('state');
            const $awardId = $(this).data('award-id');
            const $awardType = $(this).data('award-type');
            const $awardUrl = $(this).data('url');
            const $awardCDKey = $(this).data('award-cdkey');
            const $awardDetail = $(this).data('award-detail');
            _self.awardId = $awardId;//后面领奖的时候用到
            _self.awardDetail = $awardDetail;
            
            // 1 支付宝现金红包 --  提现
            // 2 优酷会员  --领取
            // 3 虚拟奖品 | 卡券--  查看
            // 4 实物   -- 填地址
            // 5 会员优惠券 --  去使用
            //  && $awardState == 1
            if($awardType == 3){
                if($awardCDKey || $awardDetail){
                    const data = {
                        awardType: $awardType,
                        awardUrl: $awardUrl,
                        awardCDKey: $awardCDKey,
                        awardDetail: $awardDetail,
                    }

                    let opts = {
                        type: `ck`,
                        data: {
                            cdKey: $awardCDKey,
                            detail: $awardDetail,
                            awardUrl: $awardUrl
                        },
                        awardId: $awardId
                    }
                    if($awardUrl != ''){
                        opts.showBtn = true;
                        opts.btnTxt = `去使用`;
                        opts.btnId = 'checkBtn';
                    }else {
                        opts.showBtn = false
                        
                    }
                    _self.renderToast(opts);
                    // _self.showCKToast(data); 
                    return;
                }
                if($awardUrl){
                    location.href = $awardUrl;
                }
                goldlog('award','ck','CLK');
            }else if($awardType == 4){
                if($awardState == 1){
                    _self.ele = $(this);
                    /*_self.ele = $(this);
                    let opts = {
                        type: `ck`,
                        data: {
                            
                            detail: $awardDetail,
                         
                        },
                        awardId: $awardId
                    }
                    opts.showBtn = true;
                    opts.btnTxt = `填地址`;
                    opts.btnId = 'goAddress';
                    _self.renderToast(opts);*/
                    _self.getLastUserAddress($awardId);
                }
                
            }else if($awardType == 5){
                if($awardUrl){
                    location.href = $awardUrl;
                }
            }else{
                if($awardState == 1){
                    if($awardType == 1){
                        const _data = {
                            awardType:$awardType,
                            awardId: $awardId
                        }
                        _self.getAlipayInfo(_data, $(this));
                    }else{
                        const data = {
                            awardType:$awardType,
                            awardId: $awardId
                        }
                        _self.getAward(data, $(this));
                        _self.handleListData();
                    }
                    
                }
            }
           
        });
        this.body.on('touchend','#reBind',function(){
             _self.onBindAlipay = false;
            _self.showForm();
        });
        
        this.body.on('touchend','#regAlipayBtn',function(){
             goldlog('award','bdzfb','CLK');
        });
        // 支付宝去提现
        this.body.on('touchend', '.txBtn', function(e){
            let awardId = $(this).parent('span').attr('data-award-id');
            let data = {};
            if(_self.onBindAlipay){
                data = {
                    awardId: awardId,
                    awardType: _self.awardType,
                    alipayID: _self.alipayID,
                    realName: _self.realName
                }
                _self.getAward(data, this.ele)
            }else{
                _self.alipayID = $('#alipayID').val();
                _self.realName = $('#realName').val();
                data = {
                    awardId: awardId,
                    awardType: _self.awardType,
                    alipayID: _self.alipayID,
                    realName: _self.realName
                }
                _self.validateForm(data);
            }
        });
        this.body.on('touchend', '#hideMaskBtn', function(){
            _self.hideMask();
        })
        this.body.on('touchend', '#toBindBtnAli', function(e){
            e.stopPropagation();
            _self.bindAli('alipay');
        });
        this.body.on('touchend', '#toBindBtnTB', function(e){
            e.stopPropagation();
            _self.bindAli('taobao');
        });
        this.body.on('touchend', '.clz', function(e){
            e.preventDefault();
            _self.hideMask();
        });
        /*this.body.on('touchend', '#goAddress', function(e){
            e.preventDefault();
            let awardId = $(this).attr('data-award-id');
            _self.getLastUserAddress(awardId);
        });*/

        this.body.on('touchend', '#checkBtn', function(e){
            const awardUrl = $(this).attr('url');
            // _self.checkAward(awardUrl);
            if(awardUrl){
                location.href = awardUrl;
            }else{
                _self.hideMask();
            }
        });
        this.body.on('touchend', '#saveAddress', function(e){
            let awardId = $(this).attr('data-award-id');
            let realName = $('#realName').val();
            let telPhone = $('#telPhone').val();
            let address = $('#address').val();
            if(realName=='' || telPhone=='' || address==''){
                return false;
            }
            let data = {};
            data = {
                awardId: awardId,
                realName: realName,
                telPhone: telPhone,
                address: address
            }
            _self.recordAddress(data)
            
        });
    }
    validateForm(data){
        const _self = this;

        if(data.awardId && data.alipayID && data.realName ){
            _self.getAward(data, $(this));
        }
    }
    recordAddress(data){
        const _self = this;
        const _data = {
           award_id: data.awardId,
           real_name: data.realName,
           tel_phone: data.telPhone,
           address: data.address 
        }
        let params = {
            mtopDomain:config.mtopDomain,
            appKey:config.appKey,
            api: interfaces.weakGet,
            ecode:0,
            bizType: interfaces.bizType.recordAddress,
            bizParam:_data
        };
        Mtop.getMtopinfo(params).then((res) => {
            let result;
            if (res.data && res.data.success) {
                if(res.data.result){
                    result =  res.data.result;
                }
            }
            if(result.e && result.e.code == 0){
                let opts = {
                    type: `normal`,
                    msg:`领奖成功`,
                    showBtn: true,
                    btnTxt: `确定`,
                    btnId: 'hideMaskBtn'
                }
                
                _self.renderToast(opts);
                _self.ele.data('state','3');
                _self.ele.html('待发货').addClass('used').removeClass('unused');
            }else{
                let opts = {
                    type: `normal`,
                    msg:`信息保存失败`,
                    showBtn: true,
                    btnTxt: `确定`,
                    btnId: 'hideMaskBtn'
                }        
                _self.renderToast(opts);
            }
        }, function(resJson) {
            
        });
        
    }
    getLastUserAddress(awardId){
        const _self = this;
        const _data = {
           //award_id: awardId 
        }
        let params = {
            mtopDomain:config.mtopDomain,
            appKey:config.appKey,
            api: interfaces.weakGet,
            ecode:0,
            bizType: interfaces.bizType.getLastUserAddress,
            bizParam:_data
        };
        Mtop.getMtopinfo(params).then((res) => {
            let result =res.data.result;
            if(result && result.data){              
                let data = JSON.parse(result.data);
                _self.showAdressForm(data);
            }else{
                _self.showAdressForm();
            }
        }, function(resJson) {
            _self.showAdressForm({});
        });
    }
    getLists(){
        const _data = {
            page_size: 100,
            // page: 1
            //user_id: 712669674
        }
        //获取奖品列表
        let params = {
            mtopDomain:config.mtopDomain,
            appKey:config.appKey,
            api: interfaces.weakGet,
            ecode:0,
            bizType: interfaces.bizType.getList,
            bizParam:_data
        };

        Mtop.getMtopinfo(params).then((res) => {
            PubSub.publish('award-lists', res);
        }, function(resJson) {
            // this.isLogin = false;
            // this.tipStr = `<p>今城门大开，不见兵将，城中必有埋伏。</p><a href="javascript:;" class="btn login-btn" id="reload-btn">点我攻城</a>`;
            // this.handleState(this.isLogin, false, this.tipStr);
        });
    }
    // 获取支付宝用户信息
    getAlipayInfo(data, ele){
        const _self = this;
        this.awardId = data.awardId;
        this.awardType = data.awardType;
        this.ele = ele;
        let _data = {
        }

        let params = {
            mtopDomain:config.mtopDomain,
            appKey:config.appKey,
            api: interfaces.get,
            ecode:0,
            bizType: interfaces.bizType.getAlipayInfo,
            bizParam: _data
        };

        Mtop.getMtopinfo(params).then((res) => {
            PubSub.publish('alipay-info', res);
        }, function(resJson) {
            // alert('getAlipayInfo: error === ' + JSON.stringify(resJson));

        });
    }

    getAward(data, ele){
        const _self = this;
        let _data = {
            // user_id: 469536758,
            award_id : data.awardId,
            alipay_account: data.alipayID,
            alipay_real_name: data.realName
        } 
        //获取奖品列表
        let params = {
            mtopDomain:config.mtopDomain,
            appKey:config.appKey,
            api: interfaces.weakGet,
            ecode:0,
            bizType: interfaces.bizType.getAward,
            bizParam: _data
        };
        // 3 虚拟奖品 | 卡券--  查看
        // 5 会员优惠券--  去使用   跳转
        switch (data.awardType) {
            case 1:
                goldlog('award','tx','CLK');
                break;
            case 2:
                goldlog('award','lq','CLK');
                break;
            case 3:
                goldlog('award','ck','CLK');
                break;
            case 4:
                goldlog('award','lqsw','CLK');
                break;
            case 5:
                goldlog('award','qsy','CLK');
                break;
        }

        Mtop.getMtopinfo(params).then((res) => {
            if (res.data && res.data.success) {
                if(res.data.result){
                    const result =  res.data.result;
                    if(data.awardType == 1){
                        _self.handleAward(result.e.code, result.e.desc, data, this.ele);
                    }else{
                        _self.handleAward(result.e.code, result.e.desc, data, ele);
                    }
                }
            }
        }, function(resJson) {
        });
    }


    showForm(){
        const _self = this;
        let opts = {
            type: `alipayForm`,
            msg:`请输入您的支付宝账号及对应姓名`,
            showBtn: true,
            btnTxt: `确定`,
            btnId: 'txBtn',
            awardId: _self.awardId
        }
        _self.renderToast(opts);
    }

    showAdressForm(data={}){
        let opts = {
            type: `userInfoForm`,
            data: {
                realName: this.xssFilter(data.real_name) || '',
                telPhone: this.xssFilter(data.tel_phone) || '',
                address: this.xssFilter(data.address) || '',
                detail: this.awardDetail || ''
            },
            awardId: this.awardId
        }
        opts.showBtn = true;
        opts.btnTxt = `保存`;
        opts.btnId = 'saveAddress';
        this.renderToast(opts);
    }
    
    xssFilter(str=''){
        str=str.replace('>','');
        str=str.replace('<','');
        return str;
    }
    renderToast(opts){
        const _self = this;
        let tpl = '';
        if(opts.msg){
            tpl  +=  `<span class='txt'>
                        <em class='title'>${opts.msg}</em>
                    </span>`;
        }
        $('.mask').find('.toast').eq(0).removeClass('b-alipay');
        if(opts.type == 'normal'){
            if(opts.showBtn){
                tpl +=  `<span class='note' data-award-id='${opts.awardId}'>
                            <em id='${opts.btnId}' class='active  ${opts.btnId}'>${opts.btnTxt}</em>
                        </span>`;
                if(opts.changeBtn){
                    tpl =  `<span class='txt'>
                                <em class='title'>${opts.msg}</em>
                            </span>
                            <span class='note' data-award-id='${opts.awardId}'>
                                <em id='${opts.btnId}' class='active ${opts.btnId}'>${opts.btnTxt}</em>
                                <em id='${opts.changeBtnId}' class='active'>${opts.changeBtnTxt}</em>
                            </span>`;
                }
            }

        }else if(opts.type == 'ck'){
            if(!opts.showBtn){
                tpl =  `<span class='txt desc'>
                            <em class='title'>${opts.data.detail}</em>
                        </span>
                        <span class="txt key">
                            <em class="title">兑换码：${opts.data.cdKey}</em>
                        </span>`;
            }else{
                if(opts.data.detail){
                    tpl = `<span class='txt desc'>
                                <em class='title'>${opts.data.detail}</em>
                            </span>`;
                }
                if(opts.data.cdKey){
                    tpl += `<span class='txt key' style='padding-top:1.2rem'>
                                <em class='title'>兑换码：${opts.data.cdKey}</em>
                            </span>`;
                }
                tpl +=  `<span class='note ${opts.btnId}' id='${opts.btnId}' data-award-id='${opts.awardId}' url='${opts.data.awardUrl}'>
                            <em class='active'>${opts.btnTxt}</em>  
                        </span>`;
            }

        }else if(opts.type == 'alipayForm'){
            tpl +=  `<div class='ku-form'>
                        <div class='ku-form-item'>
                            <div class='ku-sl-error hide'>
                            </div>  
                        </div>
                        <div class='ku-form-item'>
                            <label class='ku-ui-label'>账号</label>
                            <input class='ku-ui-input' id='alipayID' type='text' placeholder='邮箱/手机号/支付宝会员名'>
                        </div>
                        <div class='ku-form-item'>
                            <label class='ku-ui-label'>姓名</label>
                            <input class='ku-ui-input' id='realName' type='text' placeholder='支付宝对应的真实姓名'>
                        </div>
                    </div>
                    <span class='note' data-award-id='${opts.awardId}'>
                        <em class='active ${opts.btnId}'>${opts.btnTxt}</em>
                    </span>`;
            // 是否显示注册支付宝
            if(this.onRegAlipay){
                tpl += `<span class='tips'>
                            没有支付宝，<a id='regAlipayBtn' href='${_self.alipayRegUrl}'>立即注册</a>
                        </span>`
            }
            $('.mask').find('.toast').eq(0).addClass('b-alipay')
        }else if(opts.type == 'userInfoForm'){
            tpl +=  `<div class='ku-form'>
                        <div class='ku-form-item'>
                            <div class='ku-sl-error hide'>
                            </div>  
                        </div>
                        <div class='ku-form-item'>
                            <label class='ku-ui-label'><em style='color:red'>*</em>姓 名</label>
                            <input class='ku-ui-input' id='realName' type='text' value='${opts.data.realName}' placeholder='真实姓名'>
                        </div>
                        <div class='ku-form-item'>
                            <label class='ku-ui-label'><em style='color:red'>*</em>手 机</label>
                            <input class='ku-ui-input' id='telPhone' type='text' value='${opts.data.telPhone}' placeholder='手机号'>
                        </div>
                        <div class='ku-form-item'>
                            <label class='ku-ui-label'><em style='color:red'>*</em>邮寄地址</label>
                            <textarea class='ku-ui-textarea' id='address' placeholder='邮寄地址'>${opts.data.address}</textarea>
                        </div>
                    </div>`;
                if(opts.data.detail !== ''){
                    tpl += `<span class='tips'>
                            ${opts.data.detail}
                    </span>`;
                }
                tpl += `<span class='note' id='${opts.btnId}' data-award-id='${opts.awardId}'>
                        <em class='active '>${opts.btnTxt}</em>
                    </span>`;
            $('.mask').find('.toast').eq(0).addClass('b-alipay')
        }
        $('.toast').eq(0).find('.toast-content').html(tpl);
        $('.toast').eq(0).show();
        _self.showMask();
    }
    // 绑定支付宝
    bindAli(tlsite){
        let callbackUrl = location.href;
        // 支付宝 tlsite == alipay
        // 淘宝 tlsite == taobao
        location.href = `//id.youku.com/thirdparty/bindUser.htm?tlsite=${alipay}&callback=` + encodeURIComponent(callbackUrl) + "&pid=8fb8456183734a86bfc1c15a1c761cdf";

    }
    // todo delete
    bindAliPay(){
        var callbackUrl = location.href;
        location.href = "//id.youku.com/thirdparty/bindUser.htm?tlsite=alipay&callback=" + encodeURIComponent(callbackUrl) + "&pid=8fb8456183734a86bfc1c15a1c761cdf";
    }
    
    bindMobile(){
        var callbackUrl = location.href;
        location.href = "//id.youku.com/bindMobileView.htm?callback=" + encodeURIComponent(callbackUrl);
    }
    renderItem(){
        const _self = this;
        let stateStr =  `<p  id=awardBtn_${id}
                            class='award-btn ${date.className}' 
                            data-state='${data.state}' 
                            data-url='${data.award_url}'
                            data-award-id='${data.award_id}'
                            data-award-type='${data.award_type}'
                            data-award-cdkey='${data.award_cdkey}'
                            data-award-detail='${data.detail}'>
                            ${data.stateTxt}
                        </p>`;
        let itemStr =   `<div class='list-group-item award-item'>
                            <p>${data.award_name}</p>
                            <p>${data.award_time}</p>
                            ${stateStr}
                        </div>`;
    }
    renderLists(data){
        var itemStr = '',
            stateStr = '';
        const $awardLists =  document.querySelector('.award-lists');
       
        for(var i = 0, len = data.length; i < len; i++){
            // stateStr = (data[i].award_exp - this.today) > 0 ? '未过期' : '已过期';
            if( (data[i].award_exp - this.today) > 0 ){
                  if(data[i].state == 1){
                    // stateStr = '未过期';
                    switch (data[i].award_type) {
                    // 奖品类型
                    // 1 支付宝现金红包--  提现
                    // 2 优酷会员--  领取
                    // 3 虚拟奖品 | 卡券--  查看
                    // 4 实物 --  填地址
                    // 5 会员优惠券--  去使用
                    // 6 天猫券--  
                    case 1:
                        stateStr = `<p class='award-btn unused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>提现</p>`;
                        break;
                    case 2:
                        stateStr = `<p class='award-btn unused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>领取</p>`;
                        break;
                    case 3:
                        stateStr = `<p class='award-btn unused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>查看</p>`;
                        break;
                    case 4:
                        stateStr = `<p class='award-btn toused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>填地址</p>`;
                        break;
                    case 5:
                        stateStr = `<p class='award-btn toused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>去使用</p>`;
                        break;
                    case 6:
                        stateStr = `<p class='award-btn unused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>领取</p>`;
                        break;
                    default:
                        stateStr = `<p class='award-btn unused' data-state="${data[i].state}" id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>提现</p>`;
                        break;
                    }
                }else{
                    // state != 1 已领取;
                    switch (data[i].award_type) {
                    // 奖品类型
                    // 1 支付宝现金--  提现
                    // 2 会员--  领取
                    // 3 虚拟奖品 | 卡券--  查看
                    // 4 实物 --  已发货｜ 待发货
                    // 5 会员优惠券--  去使用
                    // 6 天猫券 -- 
                    case 1:
                        stateStr = `<p class='award-btn used' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>已提现</p>`;
                        break;
                    case 2:
                        stateStr = `<p class='award-btn used' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>已领取</p>`;
                        break;
                    case 3:
                        stateStr = `<p class='award-btn unused' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>查看</p>`;
                        break;
                    case 4:
                        if(data[i].state == 200){
                            stateStr = `<p class='award-btn used' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>已发货</p>`;
                        }else{
                            stateStr = `<p class='award-btn used' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>待发货</p>`;
                        }
                        break;
                    case 5:
                        if(data[i].state == 200){
                            stateStr = `<p class='award-btn used' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>已使用</p>`;
                        }else{
                            stateStr = `<p class='award-btn toused' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>去使用</p>`;
                        }
                        break;
                    case 6:
                        stateStr = `<p class='award-btn used' data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>已领取</p>`;
                        break;
                    default:
                        stateStr = `<p class="award-btn used" data-state='${data[i].state}' id=awardBtn_${data[i].award_id} data-award-id='${data[i].award_id}' data-award-type='${data[i].award_type}' data-url='${data[i].award_url}'  data-award-cdkey='${data[i].award_cdkey}' data-award-detail='${data[i].detail}'>已领取</p>`;
                        break;
                    }
                }
            }else{
                stateStr = `<p data-state="404">已过期</p>`;
            }
            const itemStr = `<div class="list-group-item award-item"><p>` + data[i].award_name + `</p><p>` + formateDate(data[i].award_time) + `</p>` + stateStr + `</div>`;
            $awardLists.innerHTML += itemStr;
        }
    }

    handleState(isLogin, isPartIn, tipStr ){
        if(!isLogin){
            this.showTip(tipStr);
        }else{
            if(!isPartIn){
            this.showTip(tipStr);
            }
        }
    }

    showTip(tipStr){
        const $container = $('.container');
        const $hdTip = $('.hd-tips');
        $hdTip.html("");
        if(tipStr){
            $hdTip.html(tipStr);
            $hdTip.show().siblings($container).hide();
        }else{
            $container.show().siblings($hdTip).hide();
        }
        $('.bottom').show();

    }
    showMask(content){
        $('.toast').html(content);
        $('.mask').show();
    }
    hideMask(){
        $('.toast').find('.toast-content').html('');
        $('.toast').hide();
        $('.mask').hide();
    }

    /**
     * 调用登录组件进行登录
     * @return {[type]} [description]
     */
    login(){
        let _self = this;
        goldlog('award','dllk','CLK');
        try{
            Bridge.showLogin({"weburl":location.href,
                callback:function(arg){
                    location.reload();
                }
            });
        }catch(e){
            // console.log("can`t get Bridge");
        }
    }
   
}
window.award = new Award();

function getUrlParam(){
    var ret = {},
        search = location.search;
        search = search.replace(/^\s*|\s*$/g, '').replace(/^(\?|#|&)/, '');
    search.split('&').forEach(function (param) {
        var parts = param.split('=');
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join('=') : undefined;
        key = decodeURIComponent(key);
        val = val === undefined ? null : decodeURIComponent(val);

        if (ret[key] === undefined) {
            ret[key] = val;
        } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
        } else {
            ret[key] = [ret[key], val];
        }
    });
    return ret;
} 
function formateDate(now){
    const d = new Date( now ),
        month = d.getMonth() + 1,
        date = (Array(2).join(0) + d.getDate()).slice(-2);
        return (month + '.' + date);
}
