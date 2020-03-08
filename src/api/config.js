import jsonp from '../common/js/jsonp'
import axios from 'axios'
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

export const options = {
  param: 'jsonpCallback'
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

export const DiscList = Object.assign({}, commonParams, {
  type: 1,
  json: 1,
  utf8: 1,
  onlysong: 0,
  new_format: 1,
  g_tk: 2066613704,
})

export const rankTopList = Object.assign({}, commonParams, {
  '-': 'recom12324576759370354',
  g_tk: 2066613704,
  data: '{"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"newsong.NewSongServer","method":"get_new_song_info","param":{"type":5}},"new_album":{"module":"newalbum.NewAlbumServer","method":"get_new_album_info","param":{"area":1,"sin":0,"num":10}},"new_album_tag":{"module":"newalbum.NewAlbumServer","method":"get_new_album_area","param":{}},"toplist":{"module":"musicToplist.ToplistInfoServer","method":"GetAll","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}}'
})

export function rankDetailList(topId, period) {
  return Object.assign({}, commonParams, {
    '-': 'getUCGI7985988913019706',
    g_tk: 2066613704,
    data: `{"detail":{"module":"musicToplist.ToplistInfoServer","method":"GetDetail","param":{"topId":${topId},"offset":0,"num":20,"period":"${period}"}},"comm":{"ct":24,"cv":0}}`
  })
}

export const searchHotKye = {
  'cgiKey': 'GetHomePage',
  '_': 1583563381935,
  data: '{"comm":{"g_tk":2066613704,"uin":947625259,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}'
}

export function searchResult(query, page, zhida) {
  return {
    '_': 1583570067187,
    g_tk: 2066613704,
    uin: 947625259,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query, //输入框输入的内容
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0, //1代表搜索歌手
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 30,  //控制一页多少条数据
    n: 30,  //控制一页多少条数据
    p: page,  //索取结果的分页
    remoteplace: 'txt.mqq.all'
  }
}
