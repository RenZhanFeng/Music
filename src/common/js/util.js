//洗牌函数，调整在随机播放模式下的歌曲列表
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = arr[i]
        arr[i] = arr[j]
        arr[j] = t
    }
    return arr
}

