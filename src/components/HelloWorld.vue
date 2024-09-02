<template>
  <div>
    <img v-show="!isLogined" :src="qrImg" />
    <button @click="logout">退出登录</button>
    <button @click="isJson = !isJson">显示Json</button>
    <UserInfo v-if="isLogined" />
    <div v-show="isJson" class="info">{{ info }}</div>
  </div>
</template>

<script>
import axios from 'axios';

import UserInfo from './UserInfo.vue';
export default {
  components: {
    UserInfo
  },
  data() {
    return {
      qrImg: '',
      info: '',
      isLogined: false,
      isJson: false,
    }
  },
  async created() {
    this.login();
  },
  methods: {
    async checkStatus(key) {
      const res = await axios({
        url: `http://localhost:3000/login/qr/check?key=${key}&timestamp=${Date.now()}`,
      })
      return res.data
    },
    async getLoginStatus(cookie = '') {
      const res = await axios({
        url: `http://localhost:3000/login/status?timestamp=${Date.now()}`,
        method: 'post',
        data: {
          cookie,
        },
      })
      // console.log(res.data)
      if(res.data.data.profile != null) {
        this.isLogined = true
        this.$store.dispatch('updateProfile', res.data.data.profile);
      }
      this.info = JSON.stringify(res.data, null, 2)
      
    },
    async login() {
      if(this.isLogined) {
        return
      }
      let timer
      // let timestamp = Date.now()
      const cookie = localStorage.getItem('cookie')
      this.getLoginStatus(cookie)
      const res = await axios({
        url: `http://localhost:3000/login/qr/key?timestamp=${Date.now()}`,
      })
      const key = res.data.data.unikey
      const res2 = await axios({
        url: `http://localhost:3000/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
      })
      this.qrImg = res2.data.data.qrimg

      timer = setInterval(async () => {
        const statusRes = await this.checkStatus(key)
        if (statusRes.code === 800) {
          console.log('二维码已过期，请重新获取')
          alert('二维码已过期，请重新获取')
          clearInterval(timer)
        }
        if (statusRes.code === 803) {
          // 这一步会返回cookie
          clearInterval(timer)
          console.log('授权登录成功')
          alert('授权登录成功')
          this.isLogined = true
          await this.getLoginStatus(statusRes.cookie)
          localStorage.setItem('cookie', statusRes.cookie)
          location.reload()
        }
      }, 3000)
    },
    logout() {
      axios({
        url: `http://localhost:3000/logout`,
      })
      localStorage.clear()
      location.reload()
    },
  }
}

</script>

<style>
    .info {
      white-space: pre;
    }
  </style>