const URLListModel = require("../models").URLList
let config = require('../config/config');

let commonUrl="116.211.201.85,162.216.17.178,1e100.net,71edge.com,abc.xyz,accountkit.com,acgvideo.com,admob.com,ads-twitter.com,adsense.com,adsrvr.org,agoogleaday.com,akamai.net,akamaihd.net,akamaistream.net,alexa.com,ampproject.org,android.com,androidify.com,api.ai,api.dropboxapi.com,apkpure.com,appspot.com,archive.fo,archive.is,archive.org,archives.gov,atdmt.com,bbc.co.uk,bbc.com,bbcchinese.com,beeg.com,behance.net,bit.ly,blog.google,blogspot.co.jp,blogspot.co.kr,blogspot.com,blogspot.hk,blogspot.sg,bloombergview.com,btrll.com,c-spanvideo.org,cdninstagram.com,certificate-transparency.org,chinadigitaltimes.net,chrome.com,chromecast.com,chromeexperiments.com,chromercise.com,chromestatus.com,chromium.org,cibntv.net,cnn.com,com.google,contentabc.com,creativelab5.com,crwdcntrl.net,data-vocabulary.org,debug.com,deepmind.com,deja.com,design.google,digisfera.com,disqus.com,dm530.net,dmm.co.jp,dmm.com,domains.google,douyu.com,douyucdn.cn,dropbox.com,dropboxusercontent.com,duckduckgo.com,dw-world.com,dw-world.de,dw.com,dw.de,dynupdate.no-ip.com,economist.com,environment.google,facebook.com,facebook.design,facebook.net,fanqianghou.com,fb.com,fb.me,fbsbx.com,fc2.com,feedburner.com,flipboard.com,forum.tvb.com,g.co,g.doubleclick.net,gcr.io,get.how,getmdl.io,gettyimages.com,ggpht.com,git.io,githubassets.com,gmail.com,gmodules.com,godoc.org,golang.org,goo.gl,google-analytics.com,google.co.jp,google.co.kr,google.co.uk,google.com,google.com.hk,google.com.ph,google.com.sg,google.com.tw,google.de,google.fr,google.io,google.it,google.ru,googleapis.cn,googleapis.com,googleapps.com,googleartproject.com,googleblog.com,googlebot.com,googlecapital.com,googlecode.com,googlecommerce.com,googledomains.com,googledrive.com,googleearth.com,googlegroups.com,googlehosted.com,googleideas.com,googleinsidesearch.com,googlelabs.com,googlemail.com,googleplay.com,googleplus.com,googlesource.com,googlesyndication.com,googletagmanager.com,googletagservices.com,googleusercontent.com,googlevideo.com,googleweblight.com,googlezip.net,gov.tw,groups.google.cn,gstatic.com,gtimg.cn,gvt0.com,gvt1.com,gvt3.com,gwtproject.org,hls.ttvnw.net,html5rocks.com,hulu.com,huluim.com,huya.com,iam.soy,idv.tw,ifanqiang.com,igoogle.com,imglnkd.com,imgur.com,instagram.com,iqiyi.com,itasoftware.com,j.mp,kakao.com,kik.com,like.com,line-apps.com,line-scdn.net,line.me,line.naver.jp,m.me,madewithcode.com,material.io,medium.com,messenger.com,mobile01.com,netflix.com,news.tvb.com,news.tvbs.com.tw,nextmedia.com,nflxext.com,nflximg.com,nflximg.net,nflxso.net,nflxvideo.net,nic.google,nyaa.si,nyt.com,nytchina.com,nytcn.me,nytco.com,nyti.ms,nytimes.com,nytimg.com,nytlog.com,nytstyle.com,oculus.com,oculuscdn.com,on.cc,on2.com,onedrive.live.com,panoramio.com,pastebin.com,phncdn.com,picasaweb.com,pin-cong.com,pinimg.com,pinterest.com,pinterest.ru,pixiv.net,pixiv.org,polymer-project.org,pornhub.com,quantserve.com,questvisual.com,quora.com,recaptcha.net,redhotlabs.com,registry.google,reuters.com,rfi.fr,rocksdb.org,s3.amazonaws.com,savethedate.foo,schema.org,scmp.com,shadowsocks.org,share.dmhy.org,shattered.io,shutterstock.com,sipml5.org,sjc02.hls.ttvnw.net,smtcdns.com,snapchat.com,spotify.com,static-economist.com,stories.google,synergyse.com,t.co,t.me,t66y.com,teachparentstech.org,telegram.dog,telegram.me,telegram.org,telegramdownload.com,tensorflow.org,theinitium.com,thinkwithgoogle.com,tiltbrush.com,ttvnw.net,tumblr.com,twimg.com,twitch.tv,twitter.com,updates.tdesktop.com,v.smtcdns.com,v.smtcdns.net,vid.me,video.ap.org,video.pbs.org,videocdn.qq.com,vimeo.com,w3schools.com,waveprotocol.org,waymo.com,webmproject.org,webrtc.org,wenxuecheng.com,whatbrowser.org,whatsapp.net,widevine.com,wikileaks-forum.com,wikileaks.ch,wikileaks.com,wikileaks.de,wikileaks.eu,wikileaks.lu,wikileaks.org,wikileaks.pl,wikipedia.org,windmillvpn.com,windmillvpn.net,windmillvpn.space,withgoogle.com,wsj.com,www.nbc.com,x-art.com,xn--ngstr-lra8j.com,xvideos.com,xx.fbcdn.net,youku.com,youporn.com,youtu.be,youtube-nocookie.com,youtube.com,youtubeeducation.com,youtubegaming.com,ytimg.com,z.irs01.com,zh.wikinews.org,zynamics.com"


async  function _getURLByUser(name){

      // let urls=await URLListModel.find({userName:name})

     let urls= commonUrl.split(",")

      let t={}
      for (var i = 0; i < urls.length; i++) {
        t["commonUrl"+i]=urls[i]
      }

      urls=await URLListModel.find({userName:name})

      for (var i = 0; i < urls.length; i++) {
            t[urls[i].id]=urls[i].url
        }


// console.log(config.commonUser)
//   console.log(name)
//  // let r= await URLListModel.find()
//  // for (var i = 0; i < r.length; i++) {
//  //   console.log(r[i])
//  // }

//       if(config.commonUser!=name)
//       {
//         console.log(")))))))))))))")
//           let u1= await URLListModel.find({userName:config.commonUser})
//           console.log(u1)
//           for (var i = 0; i < u1.length; i++) {
//             console.log(u1[i].id)
//                         console.log(u1[i].url)

//             t[u1[i].id]=u1[i].url
//           }
//       }

              console.log("XXXXXXXX_____getURLByUser>")

              console.log(t)
      return t
}

class URLList {
    constructor() {
        // super()
    }
   async  getURLByUser(name){

      let t= await _getURLByUser(name)
      return t
   }


  async  deleteURL(msg,data,next){
      await URLListModel.remove({id:msg.serialId})
      data.data.serialId=msg.serialId

      data.data.urlList= await _getURLByUser(msg.lastUser)
      data.status=200;
      next(data)
   }

  async  updateURL(msg,data,next){
      await URLListModel.findOneAndUpdate({id:msg.serialId},{$set:{url:msg.url}})
      data.data.serialId=msg.serialId
      data.data.url=msg.url
      data.status=200;
      next(data)
   }

  async  addURLs(msg,data,next){


      let urls=msg.urls.split(',')

      for (var i = 0; i < urls.length; i++) {
          const url =  new URLListModel({userName:msg.lastUser,url:urls[i]})
          await url.save();
      }

      data.data.urlList=await _getURLByUser(msg.lastUser)
      data.data.tabId=msg.tabId;
      data.status=200;
      next(data)
  }

  async  addURL(msg,data,next){
        
      console.log("add........")
      console.log(msg.lastUser)
      console.log(msg.url)
      const url =  new URLListModel ({userName:msg.lastUser,url:msg.url})
      await url.save();
      data.data.url=msg.url;
      data.data.serialId=msg.serialId
      data.status=200;
      next(data)
   }

}

module.exports = new URLList();