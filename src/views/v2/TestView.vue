<!-- <template>
    <div>
        <div class="home-bac">
            <div class="container">
                <span>站点歌单内有 {{ currentList.trackCount ? currentList.trackCount: 0 }} 首歌曲</span>

                <br><br>

                <select @change="selectedValue">
                    <option v-for="item in list" :key="item.id">{{ item.name }}</option>
                </select>

                <br><br>


                播放 {{ currentList.playCount }} 次

                <button>
                    <router-link to="/v1">v1版本</router-link>
                </button>


                <br><br>

                <div>
                    本歌单id {{ currentList.id }}
                    <button @click="isShow = !isShow">json</button>
                </div>

                歌词
                <pre style="height: 160px;overflow-y: scroll;">{{ lrc }}</pre>

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
            lrc: '',
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
            
            // console.log(this.palyList[this.ap.list.index])


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
                this.getLrc()

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
        },

        // 获取歌词
        getLrc() {
            const id = this.palyList[this.ap.list.index].id
            // console.log(id)
            axios.get(`http://localhost:3000/lyric?id=${id}`).then(res => {
                // console.log(res.data.lrc.lyric)

                this.lrc = res.data.lrc.lyric
            })
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
</style> -->

<template>
    <div style="width:100vw;height:100vh;background-color: #000000;overflow: auto;text-align: center;color:#666;">
        <audio style="margin:30px auto;width:420px" controls src="http://m802.music.126.net/20240820021606/dfc947ac24ccd4b6135cfb6cf7ffc2c2/jd-musicrep-ts/7441/dbcf/6c3c/6cb40dd8428ee320b6b44a230b5ee6f7.mp3"></audio>
        <div class="container">
            <ul ></ul>
        </div>
    </div>
  </template>
  
  <script>
      export default {
          data() {
              return {
                  indexPars:null,
                  clientHeight:null,
                  maxOffset:null,
                  liHeight:null,
                  dome:{},
                  result:[],
                  lrc: `[00:01.06]难念的经
  [00:03.95]演唱：周华健
  [00:06.78]
  [00:30.96]笑你我枉花光心计
  [00:34.15]爱竞逐镜花那美丽
  [00:36.75]怕幸运会转眼远逝
  [00:39.32]为贪嗔喜恶怒着迷
  [00:41.99]责你我太贪功恋势
  [00:44.48]怪大地众生太美丽
  [00:47.00]悔旧日太执信约誓
  [00:49.66]为悲欢哀怨妒着迷
  [00:52.56]啊 舍不得璀灿俗世
  [00:57.66]啊 躲不开痴恋的欣慰
  [01:02.86]啊 找不到色相代替
  [01:08.09]啊 参一生参不透这条难题
  [01:13.15]吞风吻雨葬落日未曾彷徨
  [01:15.73]欺山赶海践雪径也未绝望
  [01:18.23]拈花把酒偏折煞世人情狂
  [01:20.90]凭这两眼与百臂或千手不能防
  [01:23.76]天阔阔雪漫漫共谁同航
  [01:26.09]这沙滚滚水皱皱笑着浪荡
  [01:28.68]贪欢一刻偏教那女儿情长埋葬
  [01:32.38]
  [01:34.09]吞风吻雨葬落日未曾彷徨
  [01:36.50]欺山赶海践雪径也未绝望
  [01:39.07]拈花把酒偏折煞世人情狂
  [01:41.69]凭这两眼与百臂或千手不能防
  [01:44.68]天阔阔雪漫漫共谁同航
  [01:46.93]这沙滚滚水皱皱笑着浪荡
  [01:49.54]贪欢一刻偏教那女儿情长埋葬
  [01:53.41]
  [02:15.45]笑你我枉花光心计
  [02:18.53]爱竞逐镜花那美丽
  [02:21.14]怕幸运会转眼远逝
  [02:23.76]为贪嗔喜恶怒着迷
  [02:26.43]责你我太贪功恋势
  [02:28.98]怪大地众生太美丽
  [02:31.60]悔旧日太执信约誓
  [02:34.26]为悲欢哀怨妒着迷
  [02:36.90]啊 舍不得璀灿俗世
  [02:42.04]啊 躲不开痴恋的欣慰
  [02:47.34]啊 找不到色相代替
  [02:52.52]啊 参一生参不透这条难题
  [02:57.47]吞风吻雨葬落日未曾彷徨
  [03:00.05]欺山赶海践雪径也未绝望
  [03:02.64]拈花把酒偏折煞世人情狂
  [03:05.27]凭这两眼与百臂或千手不能防
  [03:08.22]天阔阔雪漫漫共谁同航
  [03:10.49]这沙滚滚水皱皱笑着浪荡
  [03:13.06]贪欢一刻偏教那女儿情长埋葬
  [03:18.45]吞风吻雨葬落日未曾彷徨
  [03:20.90]欺山赶海践雪径也未绝望
  [03:23.54]拈花把酒偏折煞世人情狂
  [03:26.21]凭这两眼与百臂或千手不能防
  [03:29.07]天阔阔雪漫漫共谁同航
  [03:31.32]这沙滚滚水皱皱笑着浪荡
  [03:33.92]贪欢一刻偏教那女儿情长埋葬
  [03:39.32]吞风吻雨葬落日未曾彷徨
  [03:41.84]欺山赶海践雪径也未绝望
  [03:44.38]拈花把酒偏折煞世人情狂
  [03:47.04]凭这两眼与百臂或千手不能防
  [03:49.99]天阔阔雪漫漫共谁同航
  [03:52.20]这沙滚滚水皱皱笑着浪荡
  [03:54.89]贪欢一刻偏教那女儿情长埋葬
  [04:00.28]吞风吻雨葬落日未曾彷徨
  [04:02.68]欺山赶海践雪径也未绝望
  [04:05.25]拈花把酒偏折煞世人情狂
  [04:07.90]凭这两眼与百臂或千手不能防
  [04:10.85]天阔阔雪漫漫共谁同航
  [04:13.08]这沙滚滚水皱皱笑着浪荡
  [04:15.75]贪欢一刻偏教那女儿情长埋葬
  [04:19.48]END`
          }
          },
          mounted() {
          //先处理歌词，变成数组形式，便于操作
              let listMusic = this.lrc.split('\n')
              // let result = []
              // for(let i=0;i<listMusic.length;i++){
              //     let str = res
              //     let parts = ste.split(']')
              //     let  timeStr = parts[0].substring(1);
              //     let obj={
              //         timef:partsTime(timeStr),
              //         words:parts(1)
              //     }
              //     result .push(obj)
              // }
              /**
               * 把时间变成秒
               * 数组形式
               * result[{time:'播放的时间',words:'歌词' }]
               */
              listMusic.map(res=>{
                  let str = res
                  let parts = str.split(']')
                  let  timeStr = parts[0].substring(1);
                  let obj={
                      time:this.partsTime(timeStr),
                      words:parts[1]
                  }
                  this.result.push(obj)
  
              })
              this.dome = {
                  audio:document.querySelector("audio"),
                  ul:document.querySelector(".container ul"),
                  contain:document.querySelector(".container")
  
              }
              this.createDataElements()
  
          this.dome.audio.addEventListener("timeupdate",this.setOffset)
          },
          methods:{
  
              /**
               * 创建歌词元素 li
               */
              createDataElements(){
  
                  let frag = document.createDocumentFragment();//文档片段
                  for(let i=0;i<this.result.length;i++){
                      let li = document.createElement("li")
                      //创建li标签
                      li.textContent = this.result[i].words
                      // //加入到我们页面里ul标签里面去 这里牵扯到效率问题（当然这里可以忽略不计）
                      // this.dome.ul.appendChild(li);
                      frag.appendChild(li);
                      this.dome.ul.appendChild(frag)
                  }
                  this.clientHeight = this.dome.contain.clientHeight;//获取contain的高度
                  this.liHeight = this.dome.ul.children[0].clientHeight//获取lio标签的高度
                  this.maxOffset = this.dome.ul.clientHeight - this.clientHeight //最大值的时候
  
              },
  
              /**
               * 将时间字符串解析成数字（秒）
               * @param timeStr
               * @returns {number}
               */
              partsTime(timeStr){
                  let parts = timeStr.split(':');
                  return +parts[0] * 60 + +parts[1];
              },
              /**
               * 计算出当前播放器播放到第几秒的情况下
               * 数组中歌词那一句应该高亮显示（取下标）
               *若没有任何依据歌词要显示则返回-1
               */
              findInde(){
                  let timfes = this.dome.audio.currentTime
                  for(let i=0;i<this.result.length;i++){
                      if(timfes<this.result[i].time){
                          return  i-1
                      }
                  }
                  //歌词到了最后所显示的下标
                  return   this.result.length-1
              },
              /**
               * 设置ul的的偏移量
               */
              setOffset(){
                  let index =  Number(this.findInde())
                  let offset =this.liHeight*index + this.liHeight/2 - this.clientHeight/2
                  //注意刚开始的时候相减为负和最大值的时候数所以要做边界判断
                  //刚开始播放的时候的边界
                  if(offset<0){
                      offset = 0
                  }
                  //播放完了之后的边界
                  if(offset>this.maxOffset){
                      offset = this.maxOffset
                  }
                  //偏移
                  this.dome.ul.style.transform = `translateY(-${offset}px)`
  
                  //重置li标签样式
                  let li = this.dome.ul.querySelector(".active")
                  if(li){
                      li.classList.remove('active')
                  }
                  //高亮显示
                  // this.dome.children[index].className="active" //第一种
                  // this.dome.children[index].classList.add("active")//第二种
                  //刚播放的时候计算出来的值为负数所以没有标签得判断一下
                   li = this.dome.ul.children[index];
                  if(li){
  
                      li.classList.add("active")
                  }
              },
          }
      }
  </script>
  
  <style >
    * {
      margin: 0;
      padding: 0;
    }
    .container {
      height: 420px;
      overflow: hidden;
       /*border: 2px solid #fff;*/
    }
    .container ul{
        transition: 0.2s;
        list-style: none
    }
  .container li{
      height: 30px;
      line-height: 30px;
      transition: 0.2s;
    }
  .container li.active{
       color: #fff;
       transform: scale(1.2);
  
    }
  </style>
  