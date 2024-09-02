<template>
  <div class="about">
    
    <nav>
      <router-link to="/v1">Home</router-link> |
      <router-link to="/v1/about">About</router-link> | 
      <router-link to="/">V2版本</router-link>
    </nav>
    
    <audio :src="currentUrl" controls autoplay></audio>

    <audio src="http://m701.music.126.net/20240817235537/c1bf1d967ef72965a5e37b4d3b93828a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/34825790377/2716/354c/9ba2/50d2d8322c2c9ea864a39619a35bad2e.mp3" controls autoplay></audio>

    {{ currentUrl }}

    <br><br>
    <!-- {{ playlist }} -->
    <h3>歌单</h3>
    <ul v-for="item in playlist" :key="item.id">
      <li>
        歌单： {{ item.name }} 
        id: {{ item.id }} 
        <button @click="getSongsList(item.id)">获取</button>
      </li>
    </ul>
    
    <h3>歌曲</h3>
    <!-- {{ songList }} -->
    <ul v-for="item in songList" :key="item.id">
      <li v-if="songList">
        歌曲id: {{ item.id }} <button @click="play(item.id)">播放</button>
      </li>
    </ul>

    <!-- {{ currentUserId.profile.userId }} -->

    <!-- {{ songUrls }} -->
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      playlist: [],
      songList: [],
      songUrls: [],
      currentUrl: ''
    }
  },
  computed: {
    userProfile() {
        return this.$store.getters.getProfile;
    }
  },
  mounted() {
    this.getPlayLists()
  },
  methods: {
    play(id) {
      // console.log(id)

      axios({
        url: `http://localhost:3000/song/url/v1?id=${id}&level=exhigh`,
        method: 'get',
      })
      .then(res => {
        // console.log(res.data.data[0].url)
        this.currentUrl = res.data.data[0].url
      })
    },
    // /user/playlist
    getPlayLists() {
      axios({
        url: `http://localhost:3000/user/playlist?uid=${this.userProfile.profile.userId}`,
        method: 'get',
      })
      .then(res => {
        // console.log(res.data.playlist)
        this.playlist = res.data.playlist
        // console.log(this.playlist)
      })
    },
    getSongsList(id) {
      axios({
        url: `http://localhost:3000/playlist/detail?id=${id}`,
        method: 'get',
      })
      .then(res => {
        this.songList = res.data.playlist.trackIds

        console.log(this.songList)
      });
    },
    // getSongsUrl(data) {
      
    //   data.forEach(item => {
    //     axios({
    //       url: `http://localhost:3000/song/url/v1?id=${item.id}&level=exhigh`,
    //       method: 'get',
    //     })
    //     .then(res => {
    //       console.log(res.data)
    //       this.songUrls = res.data
    //     })
    //   })

      
    // }
  }
}

</script>