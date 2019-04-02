function openBilingual () {
  // 开启双语字幕
  // 由于 Coursera 使用的是 video tag，所以直接找到节点打开对应的字幕
  // 添加一行判定，避免非 video 页面报错
  if (document.getElementById('c-video_html5_api')) {
    const languages = new Set(['zh-CN', 'en'])
    let video = document.getElementById('c-video_html5_api')
    for (let i = 0; i < video.textTracks.length; i++) {
      if (languages.has(video.textTracks[i].language)) {
        video.textTracks[i].mode = 'showing'
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
