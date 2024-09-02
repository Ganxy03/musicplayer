<template>
    <div class="container">
        <div class="contain">
            <!-- 播放列表 -->
            <PlayList @play-song="handlePlaySong" class="playList"/>
            <!-- 歌词 -->
            <div class="box" ref="box">
                <ul ref="ul">
                    <!-- 歌词动态生成 -->

                    <!-- {{ this.lrc }} -->

                    
                    <!-- {{ this.songLrc }} -->
                </ul>
            </div>
            <!-- <audio ref="audio" src="./audio/obj_wo3DlMOGwrbDjj7DisKw_14096444297_c5a0_2580_a9e4_999a4f077c17e140ff120c643b5deb74.mp3" controls></audio> -->
        </div>

        <div ref="bottomWindow" class="bottom-window" v-show="isBottomWindowVisible">
            <!-- 在这里放置你的组件内容 -->
            <PlayList @play-song="handlePlaySong" class="playList"/>
        </div>
        <svg @click="moreBtn" class="moreMenu" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
            <path d="M25.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM6.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM25.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z" fill="#FFFFFF88"></path>
        </svg>
            <span class="play-time-inner">
                <span id="currentTime">00:00</span>
                <span id="totalTime">00:00</span>
            </span>
        <div class="player-controller">
            <div class="play-control-btn">
                <span class="playPause">
                    <!-- 上一首 -->
                    <svg id="previous-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z" fill="#FFFFFF88"></path>
                    </svg>
                    <!-- 播放/暂停 -->
                    <svg @click="playMusic" id="play-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M25.468 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z" fill="#FFFFFF88"></path>
                    </svg>
                    
                    <svg @click="pauseMusic" id="pause-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M21.468 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM10.28 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z" fill="#FFFFFF88"></path>
                    </svg>

                    <!-- 下一首 -->
                    <svg id="next-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z" fill="#FFFFFF88"></path>
                    </svg>
                </span>
                
                <div @click="handClickBar" class="play-bar-wrap">
                    <div class="progress-bar" id="progressBar"></div>
                    <div class="progress-handle"
                    ref="progressHandle"
                    @mousedown="onMouseDownHandle"
                    :style="{ left: handleLeft + '%' }"></div>
                </div>
                <span class="playModeBtn">
                    <!-- 音量 -->
                    <svg class="voiceBtn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M18.468 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM26.334 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528z" fill="#FFFFFF88"/>
                    </svg>
                    <!-- 播放模式 -->
                    <svg @click="togglePalyMode" id="ramdom-play-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M22.667 4l7 6-7 6 7 6-7 6v-4h-3.653l-3.76-3.76 2.827-2.827 2.587 2.587h2v-8h-2l-12 12h-6v-4h4.347l12-12h3.653v-4zM2.667 8h6l3.76 3.76-2.827 2.827-2.587-2.587h-4.347v-4z" fill="#FFFFFF88"></path>
                    </svg>
                    <svg @click="togglePalyMode" id="list-play-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M0.622 18.334h19.54v7.55l11.052-9.412-11.052-9.413v7.549h-19.54v3.725z" fill="#808080"></path>
                    </svg>

                    <!-- 循环模式 -->
                    <svg @click="toggleListMode" ref="listMode" id="always-list-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M9.333 9.333h13.333v4l5.333-5.333-5.333-5.333v4h-16v8h2.667v-5.333zM22.667 22.667h-13.333v-4l-5.333 5.333 5.333 5.333v-4h16v-8h-2.667v5.333z" fill="#FFFFFF88"></path>
                    </svg>
                    
                    <svg @click="toggleListMode" ref="listMode" id="one-list-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M9.333 9.333h13.333v4l5.333-5.333-5.333-5.333v4h-16v8h2.667v-5.333zM22.667 22.667h-13.333v-4l-5.333 5.333 5.333 5.333v-4h16v-8h-2.667v5.333zM17.333 20v-8h-1.333l-2.667 1.333v1.333h2v5.333h2z" fill="#FFFFFF88"></path>
                    </svg>
                    
                    <svg @click="toggleListMode" ref="listMode" id="never-list-btn" xmlns="http://www.w3.org/2000/svg" width="40px" version="1.1" viewBox="0 0 32 32">
                        <path d="M2.667 7.027l1.707-1.693 22.293 22.293-1.693 1.707-4-4h-11.64v4l-5.333-5.333 5.333-5.333v4h8.973l-8.973-8.973v0.973h-2.667v-3.64l-4-4zM22.667 17.333h2.667v5.573l-2.667-2.667v-2.907zM22.667 6.667v-4l5.333 5.333-5.333 5.333v-4h-10.907l-2.667-2.667h13.573z" fill="#FFFFFF88"></path>
                    </svg>
                </span>
            </div>
        </div>

        <audio id="audioPlayer" :src="songUrl"></audio>
    </div>
</template>

<script>
// eslint-disable-next-line
import defaultLrc from "./js/data";
import './css/main.css';
import PlayList from './components/PlayList.vue'

export default {
    components: {
        PlayList
    },
    data() {
        return {
            // 歌词部分
            resulr: [],
            lrcData: [],
            audio: null,
            box: null,
            ul: null,

            // 控制器部分
            playBtn: null,
            pauseBtn: null,
            ramdomBtn: null,
            listBtn: null,
            currentListBtn: null,
            currentListModeBtn: 'always-list-btn',
            alwatsBtn: null,
            oneBtn: null,
            neverBtn: null,

            audioPlayer: null,
            progressBar: null,
            progressHandle: null,
            playBarWrap: null,
            currentTimeSpan: null,
            totalTimeSpan: null,


            handleLeft: 0,   // 滑块初始位置
            isDragging: false, // 是否正在拖动

            isBottomWindowVisible: false
        }
    },
    computed: {
        songUrl() {
            return this.$store.getters.getSongUrl;
        },
        
        songLrc() {
            return this.$store.getters.getSongLrc;
        }
    },
    mounted() {
        // 控制器部分
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.ramdomBtn = document.getElementById('ramdom-play-btn');
        this.listBtn = document.getElementById('list-play-btn');
        this.alwatsBtn = document.getElementById('always-list-btn');
        this.oneBtn = document.getElementById('one-list-btn');
        this.neverBtn = document.getElementById('never-list-btn');

        this.audioPlayer = document.getElementById('audioPlayer');
        this.audioPlayer.addEventListener('timeupdate', this.updateTimeAndProgress);
        this.playBarWrap = document.querySelector('.play-bar-wrap');
        this.progressBar = document.getElementById('progressBar');
        this.progressHandle = document.getElementById('progress-handle');
        this.currentTimeSpan = document.getElementById('currentTime');
        this.totalTimeSpan = document.getElementById('totalTime');
        this.initAllControlsBtn()
        // console.log(this.progressHandle)

        
        // this.resulr = this.parseLrc(defaultLrc)
        // this.drawPage();
        // this.handlePlaySong(defaultLrc)
        // this.audio.addEventListener('timeupdate', () => this.setOffset());


        // 歌词部分
        this.audio = this.audioPlayer;
        this.box = this.$refs.box;
        this.ul = this.$refs.ul;
        // console.log(this.curTime)
        this.resulr = this.parseLrc();
        this.drawPage();
        this.setOffset();
        this.audio.addEventListener('timeupdate', () => this.setOffset());



        this.$refs.bottomWindow.classList.add('visible');
    },
    beforeDestroy() {
        this.audioPlayer.removeEventListener('timeupdate', this.updateTimeAndProgress);
    },
    methods: {
        // 菜单
        moreBtn() {
            // console.log('moreBtn')
            // window.alert('moreBtn')
            this.isBottomWindowVisible = !this.isBottomWindowVisible;
        },

        // 控制器部分
        togglePlayPause() {
            if (this.playBtn.style.display === 'inline-block') {
                // 如果播放按钮是可见的，则隐藏它并显示暂停按钮
                this.playBtn.style.display = 'none';
                this.pauseBtn.style.display = 'inline-block';
            } else {
                // 否则，隐藏暂停按钮并显示播放按钮
                this.pauseBtn.style.display = 'none';
                this.playBtn.style.display = 'inline-block';
            }
        },
        // 列表直接播放
        togglePlay() {
            this.playBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
        },
        togglePalyMode() {
            if (this.ramdomBtn.style.display === 'inline-block') {
                // 如果播放按钮是可见的，则隐藏它并显示暂停按钮
                this.ramdomBtn.style.display = 'none';
                this.listBtn.style.display = 'inline-block';
            } else {
                // 否则，隐藏暂停按钮并显示播放按钮
                this.listBtn.style.display = 'none';
                this.ramdomBtn.style.display = 'inline-block';
            }
        },
        toggleListMode() {
            // 根据 currentListModeBtn 的值找到当前显示的按钮
            this.currentListBtn = document.getElementById(this.currentListModeBtn);

            // 隐藏当前显示的按钮
            this.currentListBtn.style.display = 'none';

            // 根据 currentListModeBtn 的值切换到下一个按钮
            switch (this.currentListModeBtn) {
                case 'always-list-btn':
                this.currentListModeBtn = 'one-list-btn';
                    break;
                case 'one-list-btn':
                this.currentListModeBtn = 'never-list-btn';
                    break;
                case 'never-list-btn':
                this.currentListModeBtn = 'always-list-btn';
                    break;
            }
            // console.log(this.currentListModeBtn)
            // 显示下一个按钮
            var nextBtn = document.getElementById(this.currentListModeBtn);
            nextBtn.style.display = 'inline-block';
        },
        initAllControlsBtn() {
            // 默认显示播放按钮
            this.playBtn.style.display = 'inline-block';
            this.pauseBtn.style.display = 'none';

            this.ramdomBtn.style.display = 'inline-block';
            this.listBtn.style.display = 'none';

            
            this.alwatsBtn.style.display = 'inline-block';
            this.oneBtn.style.display = 'none';
            this.neverBtn.style.display = 'none';
        },
        formatTime(seconds) {
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
        },
        updateTimeAndProgress() {
            this.currentTimeSpan.textContent = this.formatTime(this.audioPlayer.currentTime);
            var percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progressBar.style.width = percentage + '%';
            this.totalTimeSpan.textContent = this.formatTime(this.audioPlayer.duration);


            // this.progressWidth = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            console.log('00:' + percentage + '%')

            
            this.handleLeft = percentage;
            console.log('11:'+this.handleLeft)
        },

        playMusic() {
            this.togglePlayPause()
            var isPlaying = this.audioPlayer.paused;
            if (isPlaying) {
                this.audioPlayer.play();
            } else {
                this.audioPlayer.pause();
            }
        },
        pauseMusic() {
            this.togglePlayPause()
            this.audioPlayer.pause();
        },

        // 进度条点击进度
        handClickBar(e) {
            // this.playBarWrap = document.querySelector('.play-bar-wrap');
            // console.log(e)
            // console.log(this.playBarWrap)
            var playBarWrapRect = this.playBarWrap.getBoundingClientRect();
            // console.log(playBarWrapRect)
            var clickX = e.clientX - playBarWrapRect.left;
            console.log('22:'+clickX)
            var width = playBarWrapRect.width;
            this.audioPlayer.currentTime = (clickX / width) * this.audioPlayer.duration;

            // const percentage = (clickX / width) * 100;

            // console.log(percentage+ '%')

            console.log('33:'+this.audioPlayer.currentTime)
            this.handleLeft = clickX;


            // const progressBarContainer = document.querySelector('.play-bar-wrap');
            // const clickX = e.offsetX - progressBarContainer.offsetLeft;
            // const width = progressBarContainer.offsetWidth;
            // const percentage = (clickX / width) * 100;
            // this.audioPlayer.currentTime = (percentage / 100) * this.audioPlayer.duration;
        },

        // 鼠标按下滑块开始拖动
        onMouseDownHandle(e) {
            this.isDragging = true;
            // 计算小球距离容器左边的距离
            this.handleLeft = e.offsetX - this.progressHandle.offsetLeft;

            window.addEventListener('mousemove', this.onMouseMoveHandle);
            window.addEventListener('mouseup', this.onMouseUpHandle);
        },

        // 鼠标移动更新进度和播放时间
        onMouseMoveHandle(e) {
            if (this.isDragging) {
                const deltaX = e.offsetX - this.handleLeft;
                const newLeft = Math.min(Math.max(0, deltaX), this.$refs.playBarWrap.offsetWidth - 10);
                // this.progressHandle.style.left = newLeft + 'px';
                const progressBarWidth = this.$refs.playBarWrap.offsetWidth;
                const percentage = (newLeft / progressBarWidth) * 100;
                this.audioPlayer.currentTime = (percentage / 100) * this.audioPlayer.duration;
            }
        },

        // 鼠标释放结束拖动
        onMouseUpHandle() {
            this.isDragging = false;
            window.removeEventListener('mousemove', this.onMouseMoveHandle);
            window.removeEventListener('mouseup', this.onMouseUpHandle);
        },


        // 歌词部分

        handlePlaySong(lrc) {
            // console.log(lrc)
            // console.log('ok')
            // console.log('ok')
            this.resulr = '';
            this.resulr = this.parseLrc(lrc)
            console.log(this.resulr)
            this.drawPage();
            this.audio.addEventListener('timeupdate', () => this.setOffset());


            this.togglePlay()
            this.audioPlayer.pause();
            this.audioPlayer.play();
        },
        parseLrc(lrc) {
            // console.log(lrc)
            const lines = lrc.split('\n');
            // const lines = this.songLrc.split(/\[/);

            // console.log(lines)
            this.lrcData = [];
            for (let i = 0; i < lines.length; i++) {
                const item = lines[i].split(']');
                const time = item[0].substring(1);
                const words = item[1].substring(1);
                const obj = {
                    time: this.parseTime(time),
                    words
                };
                this.lrcData.push(obj);
            }
            return this.lrcData;
        },
        parseTime(timeStr) {
            const parts = timeStr.split(':');
            return Number(parts[0]) * 60 + Number(parts[1]);
        },
        drawPage() {
            // 清空ul元素中的所有子元素
            while (this.ul.firstChild) {
                this.ul.removeChild(this.ul.firstChild);
            }
            const frag = document.createDocumentFragment();
            for (let i = 0; i < this.resulr.length; i++) {
                const li = document.createElement('li');
                li.textContent = this.resulr[i].words;
                frag.appendChild(li);
            }
            this.ul.appendChild(frag);
        },
        findIndex() {
            const curTime = this.audio.currentTime;
            console.log('44:'+curTime)
            for (let i = 0; i < this.resulr.length; i++) {
                if (curTime < this.resulr[i].time) { // 每10个字符对应1秒
                return i - 1;
                }
            }
            return this.resulr.length - 1;
        },
        setOffset() {
            const boxclientHeight = this.box.clientHeight;
            const liHeight = this.ul.children[0].clientHeight;
            const maxOffset = this.ul.clientHeight - boxclientHeight;

            let index = this.findIndex();
            console.log('55:'+index);
            let offset = liHeight * index + liHeight / 2 - 210;
            console.log('66:'+offset);

            if (offset < 0) {
                offset = 0;
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }

            this.ul.style.transform = `translateY(-${offset}px)`;

            const activeLi = this.ul.querySelector('.active');
            
            // 如果存在激活的li元素，先移除之前的样式
            if (activeLi) {
                activeLi.style.color = ''; // 重置color属性
                activeLi.style.transform = ''; // 重置transform属性
                activeLi.classList.remove('active');
            }

            // 然后，获取需要添加样式的li元素
            const li = this.ul.children[index];
            if (li) {
                // 添加新的样式
                li.style.color = 'rgb(255, 150, 4)';
                li.style.transform = 'scale(1.6)';

                // 将当前li设置为激活状态
                li.classList.add('active');
            }
        }
    }
}
</script>
<style>

</style>