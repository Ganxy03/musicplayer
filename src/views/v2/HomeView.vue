<template>
    <div>
        <div class="home-bac">
            <div class="container">
                <span>站点歌单内有 {{ currentList.trackCount ? currentList.trackCount: 0 }} 首歌曲</span>
                <select @change="selectedValue">
                    <option v-for="item in list" :key="item.id">{{ item.name }}</option>
                </select>
                播放 {{ currentList.playCount }} 次

                <button>
                    <router-link to="/v1">v1版本</router-link>
                </button>
                <br><br>

                <div>
                    本歌单id {{ currentList.id }}
                    <button @click="isShow = !isShow">json</button>
                </div>

                <!-- <pre>{{ currentList }}</pre> -->

                <!-- <pre>{{ palyList }}</pre>

                <pre>{{ songUrls }}</pre>

                <pre>{{ audio }}</pre> -->
                <div class="palyaudio" id="aplayer"></div>

                <pre style="width: 100%;overflow-x: auto;" v-show="isShow">{{ audio }}</pre>
            </div>
            
        </div>
    </div>
</template>
<script>
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import axios from 'axios';

export default {
    data() {
        return {
            ap: null,
            currentIndex: '',
            isShow: false,
            // 所有歌单
            list: [],
            // 当前歌单
            currentList: [],
            palyList: [],
            songUrls: [],
            audio: [],
            apOption: {
                mini: false,
                autoplay: false,
                theme: '#FADFA3',
                loop: 'all',
                order: 'random',
                preload: 'auto',
                volume: 0.7,
                mutex: true,
                listFolded: false,
                listMaxHeight: 90,
            },
        }
    },
    mounted() {
        this.getList()
        this.initPlayer().then(() => {
            this.currentIndex = this.ap.list.index
        });
        // this.getList().then(() => {
        //     this.getSongs()
        // });
    },
    computed: {
    },
    methods: {
        async initPlayer() {
            const ap = new APlayer({
                container: document.getElementById("aplayer"),
                ...this.apOption,
                audio: this.audio
            });

            this.ap = ap



            ap.notice('哈喽，喜欢赞一个叭', 2000, 0.8);

            // // 当前url
            // console.log(this.ap.audio.src);

            // // 播放列表
            // console.log(this.ap.list.audios)
            // console.log(this.ap.list.index)
            


            ap.on('listchange', function () {
                console.log('切歌了，当前播放的是第 ' + this.ap.list.index + ' 首歌曲');
                // 这里可以执行你的自定义逻辑
            });
        },

        // 获取歌单id
        async getList() {
            try {
                const res = await axios.get(`http://localhost:3000/user/playlist?uid=12318082694`);
                this.list = res.data.playlist.map(item => ({
                    id: item.id,
                    name: item.name,
                    cover: item.coverImgUrl,
                    description: item.description,
                    playCount: item.playCount,
                    trackCount: item.trackCount
                }));
                this.currentList = this.list[0];
                // console.log(this.list)
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        },

        // 获取歌单歌曲
        async getSongs() {

            // console.log('开始获取歌单歌曲' )
            // console.log(this.currentList.id)
            try {
                const res = await axios.get(`http://localhost:3000/playlist/detail?id=${this.currentList.id}`);

                // console.log(res.data.playlist.tracks)
                this.palyList = res.data.playlist.tracks;

                const temp = [];
                this.palyList.forEach(item => {
                    const formattedItem = {
                        id: item.id || '',
                        name: item.name || '',
                        artist: item.ar && item.ar.length > 0 ? item.ar[0].name : '',
                        url: item.url || '',
                        cover: item.al && item.al.picUrl ? item.al.picUrl : '',
                        // lrc: item.lrc && item.lrc.lyric ? item.lrc.lyric : '',
                    };
                    // console.log(formattedItem)
                    temp.push(formattedItem)
                });

                // 格式化
                this.palyList = temp.map(item => ({
                    id: item.id,
                    name: item.name,
                    artist: item.artist,
                    // url: item.url,
                    cover: item.cover,
                }))

                this.getSongUrl()

            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        },


        // 获取歌曲url
        async getSongUrl() {
            const songIds =  this.palyList.map(item => ({
                id: item.id,
            }))

            // console.log(songIds)

            if(songIds.length != this.palyList.length) {
                console.log('网络拥挤 请稍后再试')

                return
            }
            const promises = songIds.map(item => {
                return axios({
                    url: `http://localhost:3000/song/url/v1?id=${item.id}&level=exhigh`,
                    method: 'get',
                }).then(res => {
                    if(res.data.code === -460) {
                        console.log('网络拥挤 请稍后再试')

                        return
                    }

                    // console.log(res.data)
                    this.songUrls.push(res.data.data[0]);
                });
            });

            await Promise.all(promises);

            const temp = this.songUrls.map(item => ({
                id: item.id,
                url: item.url,
                size: item.size,
                type: item.type,
                level: item.level
            }));
            this.songUrls = temp;

            this.combine();
        },

        // 合并数据
        async combine() {
            this.audio = this.palyList.map(item => {
                const temp = this.songUrls.find(song => song.id === item.id)

                return Object.assign({}, item, temp);
            })

            this.audio = this.audio.map(item => ({
                name: item.name,
                artist: item.artist,
                url: item.url,
                cover: item.cover
            }))

            this.initPlayer()
        },


        // 
        selectedValue(event) {
            // console.log(event.target.value)
            const temp = this.list.map(item => {
                return item;
            })
            const matchedItem = temp.find(item => item.name === event.target.value);
            // console.log(matchedItem)

            this.currentList = matchedItem;
        }
    },
    watch: {
        currentList(val) {
            // console.log(val.id);
            this.getSongs(val.id)
        },
        currentIndex(val) {
            console.log('监听成功')
            console.log(val)
            this.currentIndex = val
            // this.ap.audio.src = 'http://m701.music.126.net/20240819224338/8425a077972cc58481a6440647f1ea34/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28481775490/45d7/825f/269f/3ba4df61d01d24cad1a068dae655db44.mp3'
        }
    }
}

</script>

<style>
.home-bac {
    background: url(./img/bg.svg) 50% no-repeat;
    background-size: cover;
    height: 100vh;
    width: 100%;
    /* display: flex; */
}

.home-bac .container {
    width: 60%;
    margin: 20px auto;
}

.home-bac .palyaudio {
    width: 100%;
    align-items: center;
    justify-content: center;

}

@media screen and (max-width: 768px) {
    .home-bac .container {
        width: 96%;
        margin: 0;
    }
}
</style>