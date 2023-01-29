<template>
    <div>
        <RouterView />
    </div>
</template>

<script>
import { RouterView } from 'vue-router';
    import {auth, emailLinkSignIn} from "@/plugins/firebase"
    import {useUserInfo} from "@/plugins/userInfo"
    

    export default {
    name: "UserView",
    setup() {
        const userInfoStore = useUserInfo();
        return {
            userInfoStore
        }
    },
    beforeMount() {
        // if already signed in and no redirect specified, goto account profile
        if (this.userInfoStore.userInfo) {
            this.$router.push({name: "account"});
            return;
        }
        // if sign in link, then sign in
        if (emailLinkSignIn.isSignInWithEmailLink(auth, window.location.href)) {
            console.debug("IS SIGN IN LINK!");
            emailLinkSignIn.signInWithEmailLink(auth, localStorage.getItem("email"), window.location.href)
                .then((response)=>{
                    console.debug(response.user);
                    this.userInfoStore.set(response.user);
                    this.$router.push({name: "propositions"});
                })
                .catch((err)=>{
                    console.debug(JSON.stringify(err));
                    const errCode = err?.code;
                })
            return;
        }

        // otherwise, go to login
        this.$router.push({ name: "login" });
    },
    components: { RouterView }
}
</script>