<template>
    <div class="playList-container">
        <input type="text" v-model="searchKey"><button @click="searchSongs">搜索</button>
        <!-- <ul class="listMenu">
            <span>播放列表</span>
            <span>收藏列表</span>
            <span>搜索列表</span>
        </ul> -->
        <ul class="listSong">
            <li @click="playSong(item.id)" class="songItem" v-for="(item, index) in resulr" :key="item.id">
                <div>
                    <span>{{ index + 1 }}  </span>
                    <!-- 使用v-html避免解析HTML标签，使用title属性来设置鼠标悬浮时显示完整内容 -->
                    <span class="name" v-html="getTruncatedName(item.name)" :title="item.name"></span>
                </div>
                <div>{{ item.artists[0].name }}</div>
            </li>
        </ul>

        <!-- <pre>{{ songLrc }}</pre> -->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            resulr: '',
            songUrl: '',
            songLrc: '',
            searchKey: '喜欢你' //思念是种病
        }
    },
    mounted() {
        this.searchSongs()
    },
    methods: {
        playSong(id) {
            // console.log(id)
            axios.get(`http://localhost:3000/song/url/v1?id=${id}&level=exhigh`)
            .then(res => {
                if(res.data.code == '-460') {
                    // window.alert('网络繁忙 稍后再试')
                    this.rePlaySong(id)
                } else {
                    // console.log(res.data.data[0].url)
                    this.songUrl = res.data.data[0].url;
                    this.$store.dispatch('updateSongUrl', res.data.data[0].url);

                    this.getSongLrc(id)
                }
            })
            
        },
        rePlaySong(id) {
            axios.get(`http://167.88.185.44:3000/song/url/v1?id=${id}&level=exhigh`)
            .then(res => {
                if(res.data.code == '-460') {
                    window.alert('网络繁忙 +1 稍后再试 ')
                } else {
                    this.songUrl = res.data.data[0].url;
                    this.$store.dispatch('updateSongUrl', res.data.data[0].url);
                    this.getSongLrc(id)
                }
            })
        },
        getTruncatedName(name) {
            // 如果name长度不超过6，直接返回
            if (name.length <= 6) {
                return name;
            }
            // 截取前6个字符，然后加上省略号
            return name.substring(0, 6) + '...';
        },
        searchSongs() {
            axios.get(`http://localhost:3000/search?keywords=${this.searchKey}&limit=30`) 
            .then(res => {
                // console.log(res.data.result.songs);
                this.resulr = res.data.result.songs;
            })
        },
        getSongLrc(id) {
            axios.get(`http://localhost:3000/lyric/new?id=${id}`) 
            .then(res => {
                // console.log(res.data.lrc.lyric);
                this.songLrc = res.data.lrc.lyric
                // this.songLrc = this.filterData(res.data.lrc.lyric)
                this.songLrc = this.filterData()
                // console.log('22')
                // console.log(this.songLrc)
                this.$store.dispatch('updateSongLrc', this.songLrc);


                

                // console.log('11')
                // console.log(this.songLrc)

                this.$emit('play-song', this.songLrc)

            })
        },
        filterData() {
            // return this.songLrc.replace(/\{[^}]*\}/gm, '').replace(/,\]\},?/gm, '').replace(/\](?!\s)/gm, '] ').trim();

            return this.songLrc.replace(/\{[^}]*\}/gm, '')
                   .replace(/,\]\},?/gm, '')
                   .replace(/\](?!\s)/gm, '] ')
                   .replace(/,/gm, '') // 添加这一行来去除所有的逗号
                   .replace(/\] \}\}/gm, '')
                   .trim();
            

        }
    }
}
</script>

<style>
.playList-container {
    text-align: center;
    padding: 0 6px;
}

.listMenu {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}
.listMenu span {
    padding: 6px;
}
.listMenu span:hover {
    color: #fff;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
}
.listSong {
    width: 100%;
}
.songItem {
    color: rgba(0, 0, 0, 0.7);
    font-size: 13px;
    display: flex;
    justify-content: space-between;
}
.songItem .name {
    display: inline-block;
}
.songItem:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
}

@media screen and (max-width: 768px) {
    .playList-container {
        background-color: #fff;
        height: 100vh;
        width: 80%;
    }
}
</style>