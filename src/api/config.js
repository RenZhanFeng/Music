export const commonParams = {
  loginUin: 947625259,
  hostUin: 0,
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'yqq.json',
  needNewCode: 0,
}

export const ERR_OK = 0

export const recommendData = Object.assign({}, commonParams, {
  "-": 'recom0779514687313334',
  g_tk: 1815953146,
  data: '{ "comm": { "ct": 24 }, "category": { "method": "get_hot_category", "param": { "qq": "" }, "module": "music.web_category_svr" }, "recomPlaylist": { "method": "get_hot_recommend", "param": { "async": 1, "cmd": 2 }, "module": "playlist.HotRecommendServer" }, "playlist": { "method": "get_playlist_by_category", "param": { "id": 8, "curPage": 1, "size": 40, "order": 5, "titleid": 8 }, "module": "playlist.PlayListPlazaServer" }, "new_song": { "module": "newsong.NewSongServer", "method": "get_new_song_info", "param": { "type": 5 } }, "new_album": { "module": "newalbum.NewAlbumServer", "method": "get_new_album_info", "param": { "area": 1, "sin": 0, "num": 10 } }, "new_album_tag": { "module": "newalbum.NewAlbumServer", "method": "get_new_album_area", "param": {} }, "toplist": { "module": "musicToplist.ToplistInfoServer", "method": "GetAll", "param": {} }, "focus": { "module": "QQMusic.MusichallServer", "method": "GetFocus", "param": {} } }'
})

export const singerData = Object.assign({}, commonParams, {
  g_tk: 1928093487,
  channel: "singer",
  page: "list",
  key: "all_all_all",
  pagesize: 100,
  pagenum: 1
})

export const singerDetails = Object.assign({}, commonParams, {
  "-": "getSingerSong12347230769274442",
  g_tk: 632036867
})

export const songLyric = Object.assign({}, commonParams, {
  "-": "MusicJsonCallback_lrc",
  pcachetime: +new Date(),
  g_tk: 2066613704,
})

