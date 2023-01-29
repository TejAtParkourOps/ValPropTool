<template>
    <div class="container" style="padding-top: 1.5rem">
        <div v-if="propositions.length < 1">
            <p class="text-center h5 text-secondary mt-4 mb-3">
                You have no saved propositions.
            </p>
            <b-card class="proposition-item mx-auto" bg-variant="primary" text-variant="white">
                    <h2 class="text-white user-select-none">Create a New Value Proposition</h2>
                    <template #footer>
                        <div class="d-flex flex-row justify-content-end">
                            <b-button variant="light" @click="createProp" class="text-primary">Create</b-button>
                        </div>
                    </template>
                </b-card>
        </div>
        <div v-else>
            <div class="d-flex flex-row p-4 flex-wrap mx-auto justify-content-center" style="gap: 1rem;">
                <b-card class="proposition-item" bg-variant="primary" text-variant="white">
                    <h2 class="text-white user-select-none">Create a New Value Proposition</h2>
                    <template #footer>
                        <div class="d-flex flex-row justify-content-end">
                            <b-button variant="light" @click="createProp" class="text-primary">Create</b-button>
                        </div>
                    </template>
                </b-card>
                <b-card v-for="prop in propositions" class="proposition-item" :title="prop.name">
                    <template #footer>
                        <div class="d-flex flex-row justify-content-end">
                            <b-dropdown split text="View" variant="primary" @click="() => viewProp(prop)">
                                <!-- <b-dropdown-item>View</b-dropdown-item> -->
                                <b-dropdown-item @click="() => renameProp(prop)">Rename</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item @click="() => deleteProp(prop)">Delete</b-dropdown-item>
                            </b-dropdown>    
                        </div>
                    </template>
                </b-card>
            </div>
            <TextboxPromptModal ref="TextboxPromptModal" />
        </div>
    </div>
</template>

<script>
import { useUserInfo } from '@/plugins/userInfo';
import { addedToList, removedFromList, changedInList, deleteItem, unsubscribe, updateItem } from '@/plugins/firebase';
import TextboxPromptModal from '@/modals/TextboxPromptModal.vue';

    export default {
    name: "PropositionsView",
    setup() {
        const userInfoStore = useUserInfo();
        return {
            userInfoStore
        };
    },
    data() {
        return {
            propositions: [],
            path: null,
        };
    },
    beforeMount() {
        if (!this.userInfoStore.isLoggedIn) {
            this.$bvModal.msgBoxOk("Please sign in.")
                .then(() => {
                this.$router.push({ name: "login" });
            });
        }
        const userId = this.userInfoStore.getUserInfo?.uid;
        if (!userId)
            return;
        this.path = `users/${userId}/propositions`;
        //
        addedToList(this.path, (snapshot) => {
            const item = snapshot.val();
            console.debug(item);
            this.propositions.push(item);
        }, (error) => {
            console.debug(error);
            this.$bvToast.toast("Failed to fetch propositions.");
        });
        //
        removedFromList(this.path, (snapshot) => {
            const item = snapshot.val();
            this.$set(this, "propositions", this.propositions.filter(prop => prop.id !== item.id));
        }, (error) => {
            console.debug(error);
            this.$bvToast.toast("Failed to sync propositions.");
        });
        //
        changedInList(this.path, (snapshot) => {
            const item = snapshot.val();
            this.$set(this.propositions, this.propositions.findIndex(i => i.id === item.id), item);
        }, (error) => {
            console.debug(error);
            this.$bvToast.toast("Failed to sync propositions.");
        })
    },
    beforeRouteLeave(to, from, next) {
        if (this.path) {
            unsubscribe(this.path);
            console.debug("Unsubscribed to propositions.");
        }
        next();
    },
    methods: {
        createProp() {
            this.$router.push({ name: "create" });
        },
        viewProp(prop) {
            const userId = this.userInfoStore.getUserInfo?.uid;
            this.$router.push({name: "proposition", params: {propositionId: prop.id, ownerId: userId}});
        },
        deleteProp(prop) {
            const userId = this.userInfoStore.getUserInfo?.uid;
            deleteItem(`users/${userId}/propositions/${prop.id}`)
                .then(() => {
                this.$bvToast.toast("Proposition deleted.");
            })
                .catch((error) => {
                console.debug(error);
                this.$bvToast.toast("Failed to delete proposition.");
            });
        },
        renameProp(prop) {
            const userId = this.userInfoStore.getUserInfo?.uid;
            this.$refs.TextboxPromptModal.show("Rename Proposition", undefined, "My Awesome Value Prop", prop.name)
          .then((newName) => {
            return updateItem(`users/${userId}/propositions/${prop.id}/name`, newName)
          })
          .then(()=>{
            this.$bvToast.toast("Proposition renamed.");
          })
          .catch((error)=>{
                if (error) {
                    console.debug(error);
                    this.$bvToast.toast("Failed to rename proposition.");
                }
          })
          
        }
    },
    components: { TextboxPromptModal }
}
</script>

<style lang="scss" scoped>
    .proposition-item {
        width: 300px;
        height: 300px;
        
        flex-shrink: 0;
    }

    h1, h2, h3, h4, h5, h6, p {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
</style>