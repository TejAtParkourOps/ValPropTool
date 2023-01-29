<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: "AddMessageModal",
        methods: {
            show(parentId) {
                this.description = "";
                this.parentId = parentId;
                this.$refs.modal.show();
            },
            hide() {
                this.$refs.modal.hide();
            },
            emit() {
                this.$emit("newMessageDescribed", {
                    id: uuidv4(),
                    parentId: this.parentId,
                    type: "Message",
                    description: this.description
                });
            }
        },
        data() {
            return {
                description: "",
                parentId: ""
            }
        }
    }
</script>

<template>
    <b-modal ref="modal" no-close-on-backdrop title="Message" @ok="emit" :ok-disabled="description.length < 1">
      <b-form-textarea
      placeholder="..."
      v-model="description"
      ></b-form-textarea>
    </b-modal>
</template>