function openBilingual () {
  // 开启双语字幕
  let tracks = document.getElementsByTagName('track')
  let enTrack
  let zhcnTrack
  if (tracks.length > 0) {
    // 1. 遍历字幕节点，找到中英文字幕
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].srclang === 'en') {
        enTrack = tracks[i]
      } else if (tracks[i].srclang === 'zh-CN') {
        zhcnTrack = tracks[i]
      }
    }
    // 2. 如果英文字幕存在，打开
    if (enTrack) {
      enTrack.track.mode = 'showing'
      // 3. 判定中文字幕是否存在
      // 如果存在，直接打开
      if (zhcnTrack) {
        zhcnTrack.track.mode = 'showing'
      } else {
        // 4. 如果不存在，开启翻译
        // 遍历出英文字幕的所有文本内容，然后逐句翻译
        // 这样会大量调用翻译 API，不大优雅，不过暂时先这样
        cues = enTrack.track.cues
        for (let i = 0; i < cues.length; i++) {
          getTranslation(cues[i].text, responseText => {
            cues[i].text = cues[i].text + '\n' + responseText
          })
          // break
        }
      }
    }
  }
}

function getTranslation (sentence, callback) {
  const xhr = new XMLHttpRequest()
  let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh&dt=t&q=${sentence}`
  xhr.open('GET', url, true)
  xhr.responseType = 'text'
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 || xhr.status === 304) {
        // 返回大概是
        // [[["你好。","hello.",null,null,1],["你好","hello",null,null,1]],null,"en"]
        // 这样的字符串
        // 需要将结果拼接成完整的整段字符串
        const translatedArray = JSON.parse(xhr.responseText)[0]
        let translatedText = ''
        for (let i = 0; i < translatedArray.length; i++) {
          translatedText += translatedArray[i][0]
        }
        callback(translatedText)
      }
    }
  }
  xhr.send()
}

// 设置监听，如果接收到请求，执行开启双语字幕函数
chrome.runtime.onMessage.addListener(
  function (request, sender) {
    openBilingual()
  }
)
