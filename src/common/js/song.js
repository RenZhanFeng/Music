//设置成类的好处
//1.类的扩展性比对象好
//2.把一些代码集中在一个地方维护
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url, media_mid}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    //this.media_mid = media_mid
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval,
    // media_mid:musicData.file.media_mid,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url:`https://isure.stream.qqmusic.qq.com/`
   
  })
}

export function createSong2(musicData) {  //搜索结果列表用的
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url:`https://isure.stream.qqmusic.qq.com/`
   
  })
}


function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
