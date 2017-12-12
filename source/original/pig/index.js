import PubSub from 'pubsub-js';
import Mtop from '../../mtop'
import goldlog from '../../common/utils/goldlog'
import config from './config'
import Bridge from "../../common/bridge";
//主函数
var pig_ten ={
    self_node:"",
    now:"",
    init(){
        this.self_node = document.getElementById("pig_ten");
        this.now = new Date("2017/7/25");
        this.videoPlay();
        var data={
          ten:[
              {
                  "banner":[
                      {"item":"https://gw.alicdn.com/tfs/TB1iicNRVXXXXcfaXXXXXXXXXXX-750-354.jpg"},
                      {"item":"https://gw.alicdn.com/tfs/TB1ib3NRVXXXXbHaXXXXXXXXXXX-750-353.jpg"}
                  ],
                  "video_main":"res/let_basic.mp4",
                  "mid_guang":"https://gw.alicdn.com/tfs/TB1yJs7RVXXXXcbXFXXXXXXXXXX-715-246.jpg",
                  "bottom_title":"https://gw.alicdn.com/tfs/TB1vswSRVXXXXb3aXXXXXXXXXXX-415-89.png",
                  "bottom_pro_ul":[
                      {
                          "title":"底部四个广告图",
                          "item":[
                              {
                                  "img":"https://gw.alicdn.com/tfs/TB1UppwSXXXXXXgXpXXXXXXXXXX-351-197.jpg",
                                  "link":"http://www.youku.com"
                              },
                              {
                                  "img":"https://gw.alicdn.com/tfs/TB1UppwSXXXXXXgXpXXXXXXXXXX-351-197.jpg",
                                  "link":"http://www.youku.com"
                              },
                              {
                                  "img":"https://gw.alicdn.com/tfs/TB1UppwSXXXXXXgXpXXXXXXXXXX-351-197.jpg",
                                  "link":"http://www.youku.com"
                              },
                              {
                                  "img":"https://gw.alicdn.com/tfs/TB1UppwSXXXXXXgXpXXXXXXXXXX-351-197.jpg",
                                  "link":"http://www.youku.com"
                              }
                          ]
                      }
                  ],
                  "bottom_long_ul":[
                      {
                          "title":"最底部两个横条广告",
                          "item":[
                              {
                                  "img":"https://gw.alicdn.com/tfs/TB1BnBCSXXXXXaqXXXXXXXXXXXX-715-140.jpg",
                                  "link":"http://www.youku.com"
                              },
                              {
                                  "img":"https://gw.alicdn.com/tfs/TB1BnBCSXXXXXaqXXXXXXXXXXXX-715-140.jpg",
                                  "link":"http://www.youku.com"
                              }
                          ]
                      }
                  ],
                  "time_line":[
                      {
                          "title":"活动开始时间",
                          "item":"2017/7/7"
                      },
                      {
                          "title":"活动1结束时间",
                          "item":"2017/7/10"
                      },
                      {
                          "title":"活动2结束时间",
                          "item":"2017/7/12"
                      },
                      {
                          "title":"活动3结束时间",
                          "item":"2017/7/14"
                      },
                      {
                          "title":"活动4结束时间",
                          "item":"2017/7/17"
                      },
                      {
                          "title":"活动5结束时间",
                          "item":"2017/7/19"
                      },
                      {
                          "title":"活动6结束时间",
                          "item":"2017/7/21"
                      },
                      {
                          "title":"活动7结束时间",
                          "item":"2017/7/24"
                      },
                      {
                          "title":"活动8结束时间",
                          "item":"2017/7/26"
                      },
                      {
                          "title":"活动9结束时间",
                          "item":"2017/7/28"
                      },
                      {
                          "title":"活动10结束时间",
                          "item":"2017/7/31"
                      }
                  ]
              },
              {
                "country":[
                    {
                        "title":"国家1",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1.iRmSXXXXXXpXVXXXXXXXXXX-445-392.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1XsJwSXXXXXbqXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11_pWSXXXXXX3XXXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1nydqSXXXXXcSXFXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1AzRhSXXXXXX.XVXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1o9BsSXXXXXb8XFXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1ZYFYSXXXXXXJXXXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家2",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB12WhGSXXXXXa5XpXXXXXXXXXX-434-412.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11_pWSXXXXXX3XXXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1nydqSXXXXXcSXFXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1AzRhSXXXXXX.XVXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1o9BsSXXXXXb8XFXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1ZYFYSXXXXXXJXXXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家3",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1lVBhSXXXXXbrXVXXXXXXXXXX-434-403.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1nydqSXXXXXcSXFXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1AzRhSXXXXXX.XVXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1o9BsSXXXXXb8XFXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1ZYFYSXXXXXXJXXXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家4",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB16i..RVXXXXadaXXXXXXXXXXX-434-374.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1AzRhSXXXXXX.XVXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1o9BsSXXXXXb8XFXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1ZYFYSXXXXXXJXXXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家5",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1z2xpSXXXXXXIXVXXXXXXXXXX-434-415.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1oAdnSXXXXXaaXVXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1o9BsSXXXXXb8XFXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1ZYFYSXXXXXXJXXXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家6",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1tvpwSXXXXXbcXFXXXXXXXXXX-434-411.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1oAdnSXXXXXaaXVXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1k9xSSXXXXXaFXXXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1ZYFYSXXXXXXJXXXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家7",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1YTtKSXXXXXasXpXXXXXXXXXX-434-397.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1oAdnSXXXXXaaXVXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1k9xSSXXXXXaFXXXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1JBBBSXXXXXcbXpXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB11v0nSXXXXXc3XFXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家8",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1uyRlSXXXXXXEXVXXXXXXXXXX-434-406.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1oAdnSXXXXXaaXVXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1k9xSSXXXXXaFXXXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1JBBBSXXXXXcbXpXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB15.k_RVXXXXbSXVXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1a7BkSXXXXXaCXVXXXXXXXXXX-213-251.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家9",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1488mSXXXXXcKXFXXXXXXXXXX-434-410.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1oAdnSXXXXXaaXVXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1k9xSSXXXXXaFXXXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1JBBBSXXXXXcbXpXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB15.k_RVXXXXbSXVXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1C4RJSXXXXXbtXpXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1lIA7RVXXXXXcapXXXXXXXXXX-224-242.png"}
                        ]
                    },
                    {
                        "title":"国家10",
                        "item":[
                            {"img":"https://gw.alicdn.com/tfs/TB1oJJDSXXXXXb_XpXXXXXXXXXX-465-423.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1FxBGSXXXXXXVXpXXXXXXXXXX-213-188.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1NfVwSXXXXXaGXFXXXXXXXXXX-208-294.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1WyBxSXXXXXaGXFXXXXXXXXXX-208-233.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1oAdnSXXXXXaaXVXXXXXXXXXX-208-219.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1k9xSSXXXXXaFXXXXXXXXXXXX-208-246.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1JBBBSXXXXXcbXpXXXXXXXXXX-213-256.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB15.k_RVXXXXbSXVXXXXXXXXXX-208-223.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1C4RJSXXXXXbtXpXXXXXXXXXX-208-262.png"},
                            {"img":"https://gw.alicdn.com/tfs/TB1SB4ZSXXXXXXqXXXXXXXXXXXX-213-251.png"}
                        ]
                    }
                ]
              }
          ]
        };
        //banner
        var banner_html = "";
        data.ten[0].banner.forEach(function(v,k){
            banner_html += `
                 <img src="${v.item}" alt="" class="banner"/>
            `;
        });
        this.self_node.querySelector("#banner").innerHTML = banner_html;
        //video_main
        //this.self_node.querySelector("#video_main").innerHTML = `<source src="${data.ten[0].video_main}">`;
        //mid_guang
        this.self_node.querySelector("#mid_guang").innerHTML = `<img src="${data.ten[0].mid_guang}" class="w100"/>`;
        //bottom_title
        this.self_node.querySelector(".bottom_title").innerHTML = `<img src="${data.ten[0].bottom_title}"/>`;
        //bottom_pro_ul
        var ul_html = "";
        data.ten[0].bottom_pro_ul[0].item.forEach(function(v,k){
            ul_html += `
                     <li>
                        <a href="${v.link}">
                            <img src="${v.img}" alt=""/>
                        </a>
                    </li>
            `;
        });
        this.self_node.querySelector("#bottom_pro_ul").innerHTML = ul_html;
        //bottom_long_ul
        var bottom_long_html = "";
        data.ten[0].bottom_long_ul[0].item.forEach(function(v,k){
            bottom_long_html += `
                     <li>
                        <a href="${v.link}">
                            <img src="${v.img}" alt=""/>
                        </a>
                    </li>
            `;
        });
        this.self_node.querySelector("#bottom_long_ul").innerHTML = bottom_long_html;
        //time_line
        this.timeLine(data);

        //recordAddress
        this.recordAddress();



    },
    renderTpl(data,index){
        //渲染10个国家的图片
        var contry_html = "";
        var className = "";
        console.log(index);
        data.forEach(function(v,k){
            className = "";
            if(k!=0){className = "item_sm"};
            if(k <= index){className += " chou_btn"};
            contry_html += `
                    <div class="${className} city${k}">
                        <img src="${v.img}" alt=""/>
                    </div>
            `;
        });
        this.self_node.querySelector("#contry_list").innerHTML = contry_html;
    },
    recordAddress(){
        const _self = this;
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
        let params = {
            mtopDomain:config.mtopDomain,
            appKey:config.appKey,
            api: interfaces.weakGet,
            ecode:0,
            bizType: "childSummer.getAwardInfo",
            bizParam:""
        };
        Mtop.getMtopinfo(params).then((res) => {
            let result;
            console.log(res)
            if (res.data && res.data.success) {
                if(res.data.result){
                    result =  res.data.result;
                }
            }

        }, function(resJson) {

        });

    },
    timeLine(data){
        var self = this;
        var index = 0;//判断活动进行到了第几个国家
        var dataDo = data.ten[0].time_line;//时间线配置
        var country = data.ten[1].country;//图片轮换配置
        if(self.now > new Date(dataDo[0].item)){
            if(self.now < new Date(dataDo[1].item)){
                console.log("7.10");
                index = 0;
            }else if(self.now < new Date(dataDo[2].item)){
                console.log("7.12")
                index = 1;
            }else if(self.now < new Date(dataDo[3].item)){
                console.log("7.14");
                index = 2;
            }else if(self.now < new Date(dataDo[4].item)){
                console.log("7.17")
                index = 3;
            }else if(self.now < new Date(dataDo[5].item)){
                console.log("7.19")
                index = 4;
            }else if(self.now < new Date(dataDo[6].item)){
                console.log("7.21")
                index = 5;
            }else if(self.now < new Date(dataDo[7].item)){
                console.log("7.24")
                index = 6;
            }else if(self.now < new Date(dataDo[8].item)){
                console.log("7.26")
                index = 7;
            }else if(self.now < new Date(dataDo[9].item)){
                console.log("7.28")
                index = 8;
            }else if(self.now < new Date(dataDo[10].item)){
                console.log("7.31")
                index = 9;
            }else{
                console.log("活动已结束")
            }
        }else{
            console.log("活动未开始")
        }
        //模块渲染
        self.renderTpl(country[index].item,index);

    },
    videoPlay(){
        var me = this;
        let  config = {
            videoId:"XMjg2MzQ2MTM1Ng",//视频id
            ccode:"0501",                                                                                                                              client_id:"6b0cc88390551a80",//优酷视频云创建应用的client_id
            control:{
                laguange:"",//默认使用的语言类型
                hd:"mp4hd",//默认使用的码率
                autoplay:false
            },
            events:{
                'onPlayerReady': null,
                'onPlayStart':null,
                'onAdPlayStart':null,
                'onPlayEnd': "",
                'onPause': "",
                'onPlay':"",
                /*'onSwitchFullScreen': this.onSwitchFullScreen,*/
                'onMediaSrcOK': null
            }
        };
        me.player = YKPlayer.Player("video_cof",config);
        var video = this.player;

        var videoPoster = me.self_node.querySelector(".x-video-poster");
        var videoTag = me.self_node.querySelector("video");
        var play_bt = me.self_node.querySelector("#play");
        //模拟trigger
        var trigger = function(element, method) {
            var func = element[method];
            return func();
        };
        var isPlay = true;
        videoPoster.onclick=function(){
            if(isPlay){
                me.player.play();
                play_bt.style.display = "none";
            }else if(!isPlay){
                me.player.pause();
                play_bt.style.display = "block";
            }
            isPlay = !isPlay;
        };
        play_bt.onclick=function(){
            trigger(videoPoster,"onclick");
        };
        videoTag.onclick=function(){
            trigger(videoPoster,"onclick");
        }
    }

};
pig_ten.init();





