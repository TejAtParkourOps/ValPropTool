<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: "AddIdealCustomerProfileModal",
        methods: {
            show() {
                this.description = "";
                this.$refs.modal.show();
            },
            hide() {
                this.$refs.modal.hide();
            },
            emit() {
                this.$emit("newIdealCustomerProfileDescribed", {
                    id: uuidv4(),
                    type: "Ideal Customer Profile",
                    description: this.description
                });
            }
        },
        data() {
            return {
                description: ""
            }
        }
    }
</script>

<template>
    <b-modal ref="modal" no-close-on-backdrop title="Add Ideal Customer Profile" @ok="emit" :ok-disabled="description.length < 1">
      <p>
        <strong>Who</strong> is your ideal customer? <strong>Where</strong> can they be found?
      </p>
      <b-form-textarea
        placeholder=""
        v-model="description"
      ></b-form-textarea>
    </b-modal>
</template>