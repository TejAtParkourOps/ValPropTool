import { defineStore } from "pinia"

export const useUserInfo = defineStore("userInfo", {
    state: () => ({
        userInfo: null
    }),
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        isLoggedIn(state) {
            return !!state.userInfo;
        }
    },
    actions: {
        set(user) {
            const userInfo = {
                displayName: user?.displayName,
                email: user?.email,
                emailVerified: user?.emailVerified,
                // providerId: user?.providerId,
                uid: user?.uid,
                phone: user?.phoneNumber,
                photo: user?.photoURL
            };
            this.userInfo = userInfo;
        },
        reset() {
            this.userInfo = null;
        }
    }
})