<template>
    <div>
        <div class="p-5">
            <p class="text-center mb-4">
                You are logged in as:<br/> <strong>{{ userInfoStore?.userInfo?.email }}</strong>
            </p>
            <b-button size="lg" class="d-block mx-auto" @click="logOut">Log Out</b-button>
        </div>
    </div>
</template>

<script>
import { useUserInfo } from '@/plugins/userInfo';
import { signOut, auth } from '@/plugins/firebase';

    export default {
        name: "AccountView",
        setup() {
            const userInfoStore = useUserInfo();
            return {
                userInfoStore
            }
        },
        methods: {
            logOut() {
                this.userInfoStore.reset();
                signOut(auth);
                this.$router.push({name:"login"});
            }
        }
    }
</script>