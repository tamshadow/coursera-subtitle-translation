function bilingualSubtitles() {
  // 开启双语字幕
  // 由于 Coursera 使用的是 video tag，所以直接找到节点打开对应的字幕
  // 添加一行判定，避免非 video 页面报错
  if (document.getElementById('c-video_html5_api')) {
    const languages = new Set(['zh-CN', 'en']);
    let video = document.getElementById('c-video_html5_api');
    for (let i = 0; i < video.textTracks.length; i++) {
      if (languages.has(video.textTracks[i].language)) {
        video.textTracks[i].mode = 'showing';
      }
    }
  }
}

// video 节点是动态加载，先简单粗暴的延迟几秒钟
setTimeout('bilingualSubtitles()', 10000);
