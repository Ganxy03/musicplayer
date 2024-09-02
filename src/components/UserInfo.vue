<template>
    <div>
        <img width="100" height="100" :src="userInfos.profile.avatarUrl" alt="">

        <br><br>
        <!-- {{ userProfile }} -->
        <!-- userId: {{ currentUserId }} <br><br> -->

        <span v-if="this.userInfos != null">
            userId: {{ userInfos.profile.userId }} <br><br>

            level: {{ userInfos.level }} <br><br>

            nickname: {{ userInfos.profile.nickname }} <br><br>

            city: {{ userInfos.profile.city }} <br><br>

            followeds: {{ userInfos.profile.followeds }} <br><br>

            follows: {{ userInfos.profile.follows }} <br><br>

            province: {{ userInfos.profile.province }} <br><br>

            playlistCount: {{ userInfos.profile.playlistCount }} <br><br>

        </span>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        
        return {
            userInfos: {},
        }
    },
    mounted() {
        this.getInfos()
    },
    computed: {
        userProfile() {
            return this.$store.getters.getProfile;
        }
    },
    methods: {
        getInfos() {
            axios({
                url: `http://localhost:3000/user/detail?uid=${this.userProfile.userId}`,
                method: 'get',
            })
            .then(res => {
                this.userInfos = res.data
                // console.log(this.userInfos.profile.avatarUrl)
                
            this.$store.dispatch('updateProfile', res.data);
            })
            // this.$set(this.userInfos, res.data.profile)
            // this.userInfos = JSON.stringify(res.data.profile)
        }
    }
}
</script>