//处理关于mini播放器占用底部位置的问题
import { mapGetters } from 'vuex'
export const playlistMixin = {
    computed: {
        ...mapGetters(['playlist'])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() { },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}