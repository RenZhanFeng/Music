// Vuex状态管理
import { playMode } from '../common/js/config'

const state = {
    //歌手数据
    singer: {},

    //播放器数据
    playing: true,//播放暂停
    fullScreen: false,//播放器展开和收起
    playlist: [],//播放列表
    sequenceList: [],//顺序列表，在不同的播放模式下调整不同的列表顺序
    mode: playMode.sequence,//播放模式，默认按序播放
    currentIndex: -1//当前播放歌曲的索引
}

export default state