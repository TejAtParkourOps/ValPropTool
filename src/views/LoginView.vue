<template>
    <div>
        <b-alert style="max-width: 500px;" variant="danger" class="mx-auto mt-5 text-center" :show="alertMsg.length > 0">
            {{ alertMsg }}
        </b-alert>
        <b-alert style="max-width: 500px;" variant="info" class="mx-auto mt-5 text-center" :show="infoMsg.length > 0">
            {{ infoMsg }}
        </b-alert>
        <b-card style="max-width: 500px;" class="shadow mx-auto mt-5" title="Login With Email" :hidden="infoMsg.length > 0">
            <b-card-text>
                Type your email address below to get a sign in link.
            </b-card-text>
            <b-form-input type="text" size="lg" class="mb-2" v-model="email" :disabled="busy"/>
            <b-button size="lg" variant="primary" block @click="loginWithEmail" :disabled="busy">Get Link</b-button>
        </b-card>

        <b-card style="max-width: 500px;" class="shadow mx-auto mt-5" title="Login Using Other Methods" :hidden="infoMsg.length > 0">
            <b-card-text>
                You can use other services to sign into Value Proposition Tool.
            </b-card-text>
            <b-button size="lg" variant="primary" block @click="loginWithGoogle" :disabled="busy">Google</b-button>
            <!-- <b-button size="lg" block>GitHub</b-button> -->
        </b-card>
    </div>
</template>

<script>
import {useUserInfo} from "@/plugins/userInfo"
import {auth, emailLinkSignIn, federatedSignIn} from "@/plugins/firebase"
const actionCodeSettings = {
    url: `${window.location.origin}/user`,
    handleCodeInApp: true
};
export default {
    name: "LoginView",
    setup() {
        const userInfoStore = useUserInfo();
        return {
            userInfoStore
        }
    },
    data() {
        return {
            email: "",
            alertMsg: "",
            infoMsg: "",
            busy: false
        }
    },
    methods: {
        loginWithEmail() {     
            if (this.email.length < 1) {
                this.alertMsg = "You must provide your email address.";
                return;
            }       
            this.busy = true;
            // send request
            emailLinkSignIn.sendSignInLinkToEmail(auth, this.email, actionCodeSettings)
                .then(()=>{
                    // reset alerts
                    this.alertMsg = "";
                    // store email for late sign in-link validation
                    window.localStorage.setItem("email", this.email);
                    this.infoMsg = "Please check your inbox for a sign in link."
                })
                .catch((err)=>{
                    console.debug(JSON.stringify(err));
                    const errCode = err?.code;
                    switch (errCode) {
                        case 'auth/missing-email':
                            this.alertMsg = "You must provide your email address."
                            break;
                        default:
                            this.alertMsg = "An unknown error occurred while trying to sign you in."
                    }
                })
                .finally(()=>{
                    this.busy = false;
                })
        },
        loginWithGoogle() {
            this.busy = true;
            federatedSignIn.signInWithPopup(auth, new federatedSignIn.GoogleAuthProvider)
                .then((response)=>{
                    this.userInfoStore.set(response.user);
                    this.$router.push({name:"home"});
                })
                .catch((err)=>{
                    console.debug(JSON.stringify(err));
                    const errCode = err?.code;
                })
                .finally(()=>{
                    this.busy = false;
                })
        },
        loginWithGitHub() {

        }
    }
}
</script>
