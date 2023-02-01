<template>
  <div class="container" style="padding-top: 1.5rem">
    <div class="d-flex flex-row justify-content-center my-5" v-if="!loaded">
      <Loading :message="userId ? 'Loading your content...' : ''" />
    </div>
    <div v-else-if="propositions.length < 1" class="my-3">
      <h5 class="text-secondary text-center mb-3">
        You have no saved propositions.
      </h5>
      <b-card
        class="proposition-item mx-auto shadow"
        bg-variant="dark"
        text-variant="white"
      >
        <h2 class="text-white user-select-none">
          Create a New Value Proposition
        </h2>
        <template #footer>
          <div class="d-flex flex-row justify-content-end">
            <b-button variant="light" @click="createProp" class="text-dark"
              >Create</b-button
            >
          </div>
        </template>
      </b-card>
    </div>
    <div v-else class="my-3 d-flex flex-row" style="gap: 1rem">
      <b-card class="proposition-item" bg-variant="dark" text-variant="white">
        <h2 class="text-white user-select-none">
          Create a New Value Proposition
        </h2>
        <template #footer>
          <div class="d-flex flex-row justify-content-end">
            <b-button variant="light" @click="createProp" class="text-dark"
              >Create</b-button
            >
          </div>
        </template>
      </b-card>
      <b-card
        v-for="prop in propositions"
        class="proposition-item shadow"
        :title="prop.name"
        border-variant="light"
        footer-bg-variant="dark"
        text-variant="dark"
      >
        <b-badge v-if="prop.published" variant="dark">Published</b-badge>
        <template #footer>
          <div class="d-flex flex-row justify-content-end">
            <b-dropdown
              split
              text="View"
              variant="light"
              @click="() => viewProp(prop)"
            >
              <!-- <b-dropdown-item>View</b-dropdown-item> -->
              <b-dropdown-item @click="() => renameProp(prop)"
                >Rename</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item @click="() => deleteProp(prop)"
                >Delete</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </template>
      </b-card>
    </div>
    <TextboxPromptModal ref="textboxPromptModal" />
  </div>
</template>

<script>
import { useUserInfo } from "@/plugins/userInfo";
import {
  addedToList,
  removedFromList,
  changedInList,
  deleteItem,
  unsubscribe,
  updateItem,
} from "@/plugins/firebase";
import TextboxPromptModal from "@/modals/TextboxPromptModal.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "PropositionsView",
  setup() {
    const userInfoStore = useUserInfo();
    return {
      userInfoStore,
    };
  },
  data() {
    return {
      propositions: [],
      path: null,
      loaded: false,
    };
  },
  computed: {
    userId() {
      return this.userInfoStore.getUserInfo?.uid;
    },
  },
  beforeMount() {
    // if not signed in, redirect user to login
    if (!this.userInfoStore.isLoggedIn) {
      this.$bvModal.msgBoxOk("Please sign in first.").then(() => {
        this.$router.push({ name: "login" });
      });
    }
    // subscribe to propositions items for this user
    const userId = this.userId;
    if (!userId) return;
    this.path = `users/${userId}/propositions`;
    addedToList(
      this.path,
      (snapshot) => {
        const item = snapshot.val();
        console.debug(item);
        this.propositions.push(item);
      },
      (error) => {
        console.debug(error);
        this.$bvToast.toast("Failed to fetch propositions.");
      }
    );
    // subscribe to removal of propositions items for this user
    removedFromList(
      this.path,
      (snapshot) => {
        const item = snapshot.val();
        this.$set(
          this,
          "propositions",
          this.propositions.filter((prop) => prop.id !== item.id)
        );
      },
      (error) => {
        console.debug(error);
        this.$bvToast.toast("Failed to sync propositions.");
      }
    );
    // subscribe to changes of propositions items for this user
    changedInList(
      this.path,
      (snapshot) => {
        const item = snapshot.val();
        this.$set(
          this.propositions,
          this.propositions.findIndex((i) => i.id === item.id),
          item
        );
      },
      (error) => {
        console.debug(error);
        this.$bvToast.toast("Failed to sync propositions.");
      }
    );
    // set loaded to true
    setTimeout(() => {
      this.loaded = true;
    }, 1500);
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
      this.$router.push({
        name: "proposition",
        params: { propositionId: prop.id, ownerId: userId },
      });
    },
    async deleteProp(prop) {
      const userConfirmation = await this.$bvModal.msgBoxConfirm(
        "Are you sure you want to delete this proposition?",
        {
          okTitle: "Yes",
          cancelTitle: "No",
        }
      );
      if (!userConfirmation) return;
      const userId = this.userInfoStore.getUserInfo?.uid;
      deleteItem(`users/${userId}/propositions/${prop.id}`)
        .then(() => {
          // this.$bvToast.toast("Proposition deleted.");
        })
        .catch((error) => {
          console.debug(error);
          this.$bvToast.toast("Failed to delete proposition.");
        });
    },
    renameProp(prop) {
      const userId = this.userInfoStore.getUserInfo?.uid;
      this.$refs.textboxPromptModal
        .show(
          "Rename Proposition",
          undefined,
          "My Awesome Value Prop",
          prop.name
        )
        .then((newName) => {
          return updateItem(
            `users/${userId}/propositions/${prop.id}/name`,
            newName
          );
        })
        .then(() => {
          // this.$bvToast.toast("Proposition renamed.");
        })
        .catch((error) => {
          if (error) {
            console.debug(error);
            this.$bvToast.toast("Failed to rename proposition.");
          }
        });
    },
  },
  components: { TextboxPromptModal, Loading },
};
</script>

<style lang="scss" scoped>
.proposition-item {
  width: 300px;
  height: 300px;
  flex-shrink: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
</style>
