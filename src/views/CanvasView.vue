<template>
  <div>
    <!-- Canvas Header -->
    <div class="d-flex flex-row p-4 justify-content-between">
      <div class="d-flex flex-row align-items-start" style="gap: 0.25rem">
        <b-button
          variant="primary"
          @click="
            () => {
              $refs.addIdealCustomerProfileModal.showForAdd();
            }
          "
          :disabled="!!routePropositionId && !isOwner"
          >Add ICP</b-button
        >
        <b-button
          variant="primary"
          @click="() => $refs.addProductModal.showForAdd()"
          :disabled="!!routePropositionId && !isOwner"
          >Add Product</b-button
        >
        <b-button
          variant="primary"
          @click="() => $refs.addServiceModal.showForAdd()"
          :disabled="!!routePropositionId && !isOwner"
          >Add Service</b-button
        >

        <b-button
          @click="save"
          :disabled="nodes.length < 1 || !!routePropositionId"
          >{{ routePropositionId && isOwner ? 'Auto-saving' : 'Save' }}</b-button
        >
        <b-button @click="reset" :disabled="nodes.length < 1 || (!!routePropositionId && !isOwner)">Reset</b-button>
      </div>
      <div>
        <h2
          class="mr-1 mb-2 cursor-pointer text-secondary project-name"
          @click="changeName"
        >
          {{ Name }}
        </h2>
        <div class="d-flex flex-row justify-content-end">
          <b-badge variant="secondary" href="#" @click="publish">{{
            Published ? "Published" : "Unpublished"
          }}</b-badge>
        </div>
      </div>
    </div>
    <!-- Canvas -->
    <div id="canvas-wrapper">
      <svg id="canvas"></svg>
    </div>
    <!-- Context Menu -->
    <div id="context-menu" ref="context-menu">
      <b-card class="shadow" no-body :header="this?.selectedItem?.type">
        <b-list-group flush style="pointer-events: auto">
          <!-- Edit Options -->
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addIdealCustomerProfileModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Ideal Customer Profile'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addProductModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Product'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addServiceModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Service'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addCustomerJobModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Customer Job'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addCustomerPainModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Customer Pain'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addCustomerGainModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Customer Gain'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addPainRelieverModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Pain Reliever'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addGainCreatorModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Gain Creator'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addPainRelieverMessageModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Pain Reliever Message'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addGainCreatorMessageModal.showForEdit(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Gain Creator Message'"
            :disabled="routePropositionId && !isOwner"
            >Edit</b-list-group-item
          >
          <!-- Add Options -->
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addCustomerJobModal.showForAdd(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Ideal Customer Profile'"
            :disabled="routePropositionId && !isOwner"
            >Add Customer Job</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addCustomerPainModal.showForAdd(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Customer Job'"
            :disabled="routePropositionId && !isOwner"
            >Add Pain</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addCustomerGainModal.showForAdd(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Customer Job'"
            :disabled="routePropositionId && !isOwner"
            >Add Gain</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addPainRelieverModal.showForAdd(selectedItem);
              }
            "
            v-if="
              this?.selectedItem?.type === 'Product' ||
              this?.selectedItem?.type === 'Service'
            "
            :disabled="routePropositionId && !isOwner"
            >Add Pain Reliever</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addGainCreatorModal.showForAdd(selectedItem);
              }
            "
            v-if="
              this?.selectedItem?.type === 'Product' ||
              this?.selectedItem?.type === 'Service'
            "
            :disabled="routePropositionId && !isOwner"
            >Add Gain Creator</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addPainRelieverMessageModal.showForAdd(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Pain Reliever'"
            :disabled="routePropositionId && !isOwner"
            >Add Message</b-list-group-item
          >
          <b-list-group-item
            href="#"
            @click="
              () => {
                $refs.addGainCreatorMessageModal.showForAdd(selectedItem);
              }
            "
            v-if="this?.selectedItem?.type === 'Gain Creator'"
            :disabled="routePropositionId && !isOwner"
            >Add Message</b-list-group-item
          >
          <!-- Delete Option -->
          <b-list-group-item
            href="#"
            @click="
              () => {
                deleteNode(selectedItem);
              }
            "
            :disabled="routePropositionId && !isOwner"
            >Delete</b-list-group-item
          >
        </b-list-group>
      </b-card>
    </div>
    <!-- Context Menu -->
    <div id="hover-menu" ref="hover-menu">
      <b-card
        class="shadow"
        :header="this?.hoveredItem?.type"
        :border-variant="
          this?.hoveredItem?.type === 'Message' ? 'primary' : undefined
        "
        :header-bg-variant="
          this?.hoveredItem?.type === 'Message' ? 'primary' : undefined
        "
        :header-text-variant="
          this?.hoveredItem?.type === 'Message' ? 'white' : undefined
        "
      >
        <p class="m-0" style="font-size: 0.7rem; max-width: 500px">
          {{ this?.hoveredItem?.description }}
        </p>
      </b-card>
    </div>
    <!-- Modal: add/edit ICP -->
    <TextboxPromptModal ref="TextboxPromptModal" />
    <AddNodeModal
      ref="addIdealCustomerProfileModal"
      type="Ideal Customer Profile"
      @itemDescribed="(n) => newNode('IdealCustomerProfiles', n)"
      @itemRedescribed="(n) => updateNode('IdealCustomerProfiles', n)"
    >
      <template v-slot:label-description>
        <p>Who is your ideal customer?</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Customer Job -->
    <AddNodeModal
      ref="addCustomerJobModal"
      type="Customer Job"
      is-child
      :parent-options="IdealCustomerProfiles"
      @itemDescribed="(n) => newNode('CustomerJobs', n)"
      @itemRedescribed="(n) => updateNode('CustomerJobs', n)"
    >
      <template v-slot:label-parents>
        <p>Which type of customers perform this job?</p>
      </template>
      <template v-slot:label-description>
        <p>Briefly describe the job:</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Customer Pain -->
    <AddNodeModal
      ref="addCustomerPainModal"
      type="Customer Pain"
      is-child
      :parent-options="CustomerJobs"
      @itemDescribed="(n) => newNode('Pains', n)"
      @itemRedescribed="(n) => updateNode('Pains', n)"
    >
      <template v-slot:label-parents>
        <p>Which jobs produce this pain?</p>
      </template>
      <template v-slot:label-description>
        <p>Briefly describe the pain?</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Customer Pain -->
    <AddNodeModal
      ref="addCustomerGainModal"
      type="Customer Gain"
      is-child
      :parent-options="CustomerJobs"
      @itemDescribed="(n) => newNode('Gains', n)"
      @itemRedescribed="(n) => updateNode('Gains', n)"
    >
      <template v-slot:label-parents>
        <p>Which jobs produce this gain?</p>
      </template>
      <template v-slot:label-description>
        <p>Briefly describe the gain?</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Product -->
    <AddNodeModal
      ref="addProductModal"
      type="Product"
      @itemDescribed="(n) => newNode('ProductsAndServices', n)"
      @itemRedescribed="(n) => updateNode('ProductsAndServices', n)"
    >
      <template v-slot:label-description>
        <p>What is this product called?</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Service -->
    <AddNodeModal
      ref="addServiceModal"
      type="Service"
      @itemDescribed="(n) => newNode('ProductsAndServices', n)"
      @itemRedescribed="(n) => updateNode('ProductsAndServices', n)"
    >
      <template v-slot:label-description>
        <p>What is this service called?</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Pain Reliever -->
    <AddNodeModal
      ref="addPainRelieverModal"
      type="Pain Reliever"
      is-child
      :parent-options="ProductsAndServices"
      is-relation
      :relation-options="Pains"
      @itemDescribed="(n) => newNode('PainRelievers', n)"
      @itemRedescribed="(n) => updateNode('PainRelievers', n)"
    >
      <template v-slot:label-parents>
        <p>Which products or services provide this relief?</p>
      </template>
      <template v-slot:label-relations>
        <p>Which pains does this feature relieve?</p>
      </template>
      <template v-slot:label-description>
        <p>Briefly describe the pain-relieving feature:</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Gain Creators -->
    <AddNodeModal
      ref="addGainCreatorModal"
      type="Gain Creator"
      is-child
      :parent-options="ProductsAndServices"
      is-relation
      :relation-options="Gains"
      @itemDescribed="(n) => newNode('GainCreators', n)"
      @itemRedescribed="(n) => updateNode('GainCreators', n)"
    >
      <template v-slot:label-parents>
        <p>Which products or services provide this gain?</p>
      </template>
      <template v-slot:label-relations>
        <p>Which gains does this feature produce?</p>
      </template>
      <template v-slot:label-description>
        <p>Briefly describe the gain-creating feature:</p>
      </template>
    </AddNodeModal>
    <!-- Modal: add/edit Message -->
    <AddNodeModal
      ref="addPainRelieverMessageModal"
      type="Pain Reliever Message"
      is-child
      :parent-options="PainRelievers"
      :allow-change-parents="false"
      @itemDescribed="(n) => newNode('Messages', n)"
      @itemRedescribed="(n) => updateNode('Messages', n)"
    >
      <template v-slot:label-description>
        <!-- <p></p> -->
      </template>
    </AddNodeModal>
    <AddNodeModal
      ref="addGainCreatorMessageModal"
      type="Gain Creator Message"
      is-child
      :parent-options="GainCreators"
      :allow-change-parents="false"
      @itemDescribed="(n) => newNode('Messages', n)"
      @itemRedescribed="(n) => updateNode('Messages', n)"
    >
      <template v-slot:label-description>
        <!-- <p></p> -->
      </template>
    </AddNodeModal>
  </div>
</template>

<script>
import { useUserInfo } from "@/plugins/userInfo";
import { writeItem, readItem } from "@/plugins/firebase";
import AddNodeModal from "@/modals/AddNodeModal.vue";
import * as d3 from "d3";
import { uuidv4 } from "@firebase/util";
import TextboxPromptModal from "@/modals/TextboxPromptModal.vue";

const objCopy = (toCopy) => JSON.parse(JSON.stringify(toCopy));
function monitorEvents(element) {
  var log = function (e) {
    console.debug(e);
  };
  var events = [];

  for (var i in element) {
    if (i.startsWith("on")) events.push(i.substr(2));
  }
  events.forEach(function (eventName) {
    element.addEventListener(eventName, log);
  });
}

export default {
  name: "CanvasView",
  components: {
    AddNodeModal,
    TextboxPromptModal,
  },
  setup() {
    const userInfoStore = useUserInfo();
    return {
      userInfoStore,
    };
  },
  data() {
    return {
      Name: "Untitled Project",
      Published: false,
      IdealCustomerProfiles: [],
      CustomerJobs: [],
      Pains: [],
      Gains: [],
      ProductsAndServices: [],
      GainCreators: [],
      PainRelievers: [],
      Messages: [],
      Owner: undefined,
      CreatedDT: new Date().toISOString(),
      _graphContent: null,
      _simulation: null,
      _linkElements: null,
      _circleElements: null,
      _iconElements: null,
      selectedItem: null,
      hoveredItem: null,
      isLoading: true,
    };
  },
  methods: {
    newNode(collection, item, verbose = true) {
      this[collection].push(item);
      this.selectedItem = null;
      if (verbose) console.debug(`New ${item.type} added: ${item.id}`);
    },
    async deleteNode(item, verbose = true) {
      const _deleteNode = (item, verbose) => {
        this.innerDeleteNode(item);
        this.selectedItem = null;
        if (verbose) console.debug(`${item.type} deleted: ${item.id}`);
      };
      if (verbose) {
        const userConfirmation = await this.$bvModal.msgBoxConfirm(
          "Are you sure you want to delete this item?",
          {
            okTitle: "Yes",
            cancelTitle: "No",
          }
        );
        if (userConfirmation) {
          _deleteNode(item, verbose);
        }
      } else {
        _deleteNode(item, verbose);
      }
    },
    forEachNodeArray(funct) {
      [
          "IdealCustomerProfiles",
          "CustomerJobs",
          "Gains",
          "Pains",
          "ProductsAndServices",
          "GainCreators",
          "PainRelievers",
          "Messages",
        ].forEach((arrKey) => {
          funct(arrKey);
        });
    },        
    innerDeleteNode(item) {

      
      // delete all exclusive child elements
      const exclusiveChildElements = this.nodes.filter(
        (n) => n?.parentIds?.length === 1 && n?.parentIds?.includes(item.id)
      );
      exclusiveChildElements.forEach((n) => this.innerDeleteNode(n));

      // delete all links to this item
      this.forEachNodeArray((arrKey) =>
        this.$set(
          this,
          arrKey,
          this[arrKey].map((i) => {
            // child nodes
            if (i?.parentIds?.includes(item.id)) {
              i.parentIds = i.parentIds.filter((j) => j !== item.id);
            }
            // relations
            if (i?.relationIds?.includes(item.id)) {
              i.relationIds = i.relationIds.filter((j) => j !== item.id);
            }
            return i;
          })
        )
      );
      // delete this node from whichever array is belongs to
      this.forEachNodeArray((arrKey) =>
        this.$set(
          this,
          arrKey,
          this[arrKey].filter((i) => i.id !== item.id)
        )
      );
    },
    updateNode(collection, updatedItem, verbose = true) {
      this.$set(this, collection, this[collection].filter((i) => i.id !== updatedItem.id));
      this.newNode(collection, updatedItem, false);
      this.selectedItem = null;
      if (verbose)
        console.debug(`${updatedItem.type} updated: ${updatedItem.id}`);
    },
    changeName() {
      if (this.routePropositionId && !this.isOwner) return;

      this.$refs.TextboxPromptModal.show(
        "Rename Proposition",
        undefined,
        "My Awesome Value Prop",
        this.Name
      )
        .then((newName) => {
          this.Name = newName;
        })
        .catch(() => {});
    },
    draw() {
      if (this.isLoading) return;

      if (this._circleElements || this._iconElements || this._linkElements) {
        const s = d3.selectAll("svg#canvas g");
        s.remove();
      }

      const links = objCopy(this.links);
      // const nodes = objCopy(this.nodes);

      this._linkElements = this._graphContent
        .append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("pointer-events", "none")
        .attr("stroke-width", "7px")
        .attr("stroke", "#D4E9FF")
        .classed("pain-line", (l) => {
        const source = this.nodes.find((n) => n.id === l.source);
        const target = this.nodes.find((n) => n.id === l.target);
        const sourceIsPainReliever = source.type === "Pain Reliever";
        const sourceIsMsg = source.type === "Pain Reliever Message";
        const targetIsCustomerPain = target.type === "Customer Pain";
        const targetIsPainReliever = target.type === "Pain Reliever";
        return (
          (sourceIsPainReliever && targetIsCustomerPain) ||
          (sourceIsMsg && targetIsPainReliever)
        );
      })
      .classed("gain-line", (l) => {
        const source = this.nodes.find((n) => n.id === l.source);
        const target = this.nodes.find((n) => n.id === l.target);
        const sourceIsGainCreator = source.type === "Gain Creator";
        const sourceIsMsg = source.type === "Gain Creator Message";
        const targetIsCustomerGain = target.type === "Customer Gain";
        const targetIsGainCreator = target.type === "Gain Creator";
        return (
          (sourceIsGainCreator && targetIsCustomerGain) ||
          (sourceIsMsg && targetIsGainCreator)
        );
      });

      const _wrapperElements = this._graphContent
        .append("g")
        .selectAll("g")
        .data(this.nodes)
        .join("g")
        .classed("node-wrapper", true)
        .classed("icp", (n) => n.type === "Ideal Customer Profile")
        .classed("cj", (n) => n.type === "Customer Job")
        .classed("cg", (n) => n.type === "Customer Gain")
        .classed("cp", (n) => n.type === "Customer Pain")
        .classed("product", (n) => n.type === "Product")
        .classed("service", (n) => n.type === "Service")
        .classed("msg-pain", (n) => n.type === "Pain Reliever Message")
        .classed("msg-gain", (n) => n.type === "Gain Creator Message")
        .classed("pr", (n) => n.type === "Pain Reliever")
        .classed("gc", (n) => n.type === "Gain Creator");
      this._circleElements = _wrapperElements
        .append("circle")
        .attr("r", 60)
        .on("pointermove", (ev, n) => {
          if (this.selectedItem) return;
          this.hoveredItem = n;
          // set position
          const hvrMenu = this.$refs["hover-menu"];
          hvrMenu.style.top = `${ev.y + window.scrollY}px`;
          hvrMenu.style.left = `${ev.x}px`;
        })
        .on("pointerleave", (ev, n) => {
          this.hoveredItem = null;
        })
        .on("click", (ev, n) => {
          this.selectedItem = n;
          // hide hover
          this.hoveredItem = null;
          // set position
          const ctxMenu = this.$refs["context-menu"];
          ctxMenu.style.top = `${ev.y + window.scrollY}px`;
          ctxMenu.style.left = `${ev.x}px`;
        });

      this._graphContent.on("click", (e) => {
        if (e?.srcElement?.id === "canvas") this.selectedItem = null;
      });

      const a = this._graphContent
        .selectAll("g.icp")
        .append("image")
        .attr("href", "/icons/customer-profile.svg");

      const b = this._graphContent
        .selectAll("g.cj")
        .append("image")
        .attr("href", "/icons/customer-job.svg");

      const c = this._graphContent
        .selectAll("g.cg")
        .append("image")
        .attr("href", "/icons/customer-gain.svg");

      const d = this._graphContent
        .selectAll("g.cp")
        .append("image")
        .attr("href", "/icons/customer-pain.svg");

      const e = this._graphContent
        .selectAll("g.product")
        .append("image")
        .attr("href", "/icons/product.svg");

      const f = this._graphContent
        .selectAll("g.service")
        .append("image")
        .attr("href", "/icons/service.svg");

      const g = this._graphContent
        .selectAll("g.msg-pain,g.msg-gain")
        .append("image")
        .attr("href", "/icons/message.svg");

      const h = this._graphContent
        .selectAll("g.pr")
        .append("image")
        .attr("href", "/icons/pain-reliever.svg");

      const i = this._graphContent
        .selectAll("g.gc")
        .append("image")
        .attr("href", "/icons/gain-creator.svg");

      this._iconElements = d3.selectAll([
        ...a,
        ...b,
        ...c,
        ...d,
        ...e,
        ...f,
        ...g,
        ...h,
        ...i,
      ]);
      this._iconElements
        .attr("height", "60px")
        .attr("width", "60px")
        .attr("pointer-events", "none");

      // this._graphContent.on("click", () => {
      //     this.selectedItem = null;
      //     const ctxMenu = this.$refs["context-menu"];
      //     ctxMenu.classList.remove("show");
      // });

      // https://www.d3indepth.com/force-layout/
      this._simulation = d3
        .forceSimulation(this.nodes)
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d.id)
            .distance(150)
            .links(links)
        )
        .force("charge", d3.forceManyBody().strength(100))
        .force(
          "center",
          d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
        )
        .force("collision", d3.forceCollide().radius(70))
        .on("tick", (d) => {
          this._circleElements.attr("cx", (n) => n.x).attr("cy", (n) => n.y);
          this._iconElements
            .attr("x", (n) => n.x - 30)
            .attr("y", (n) => n.y - 30);
          this._linkElements
            .attr("x1", (l) => l.source.x)
            .attr("y1", (l) => l.source.y)
            .attr("x2", (l) => l.target.x)
            .attr("y2", (l) => l.target.y);
        });
    },
    async save() {
      // if user is not logged in, save their work to local storage and redirect them to login
      if (!this.userInfoStore.isLoggedIn) {
        // ignore if no nodes
        if (this.nodes.length < 1) return;
        const res = await this.$bvModal.msgBoxConfirm(
          "Please sign in to save your work."
        );
        if (res) {
          this.saveToTmp();
          this.$router.push({ name: "login" });
        }
        // if user is signed in, either auto-update (if already saved) or create
      } else {
        console.debug("Saving...");
        const id = this.routePropositionId ?? uuidv4();
        const userId = this.userInfoStore.userInfo.uid;
        await writeItem(`users/${userId}/propositions/${id}`, {
          id,
          name: this.Name,
          owner: userId,
          published: this.Published,
          created: this.CreatedDT,
          lastModified: (new Date()).toISOString(),
          data: {
            IdealCustomerProfiles: this.IdealCustomerProfiles,
            CustomerJobs: this.CustomerJobs,
            Pains: this.Pains,
            Gains: this.Gains,
            ProductsAndServices: this.ProductsAndServices,
            GainCreators: this.GainCreators,
            PainRelievers: this.PainRelievers,
            Messages: this.Messages,
          },
          schemaVersion: "0.0.0"
        });
        // inform user
        if (!this.routePropositionId) {
          this.$bvToast.toast("Proposition saved.");
          await new Promise((r) => setTimeout(r, 500));
        }
        // (just incase if this was a previously not logged-in user) remove tmp data from local storage and redirect to doc link
        localStorage.removeItem("tmpSaved");
        this.$router
          .push({
            name: "proposition",
            params: { propositionId: id, ownerId: userId },
          })
          .catch(() => {});
        // set saved to true
        this.saved = true;
      }
    },
    async load() {
      const propositionId = this.routePropositionId;
      const ownerId = this.userInfoStore?.userInfo?.uid ?? this.routeOwnerId;
      if (ownerId && propositionId) {
        // proposition has been requested from database
        const snapshot = await readItem(
          `users/${ownerId}/propositions/${propositionId}`
        );
        if (!snapshot.exists()) {
          this.$bvModal.msgBoxOk("Request proposition could not be found.");
          this.$router.push({ name: "create" });
        } else {
          const val = snapshot.val();
          console.debug(val);
          this.Name = val?.name ?? "Untitled Project";
          this.CreatedDT = val?.created;
          this.Published = val?.published ?? false;
          this.IdealCustomerProfiles = val?.data?.IdealCustomerProfiles ?? [];
          this.CustomerJobs = val?.data?.CustomerJobs ?? [];
          this.Pains = val?.data?.Pains ?? [];
          this.Gains = val?.data?.Gains ?? [];
          this.ProductsAndServices = val?.data?.ProductsAndServices ?? [];
          this.GainCreators = val?.data?.GainCreators ?? [];
          this.PainRelievers = val?.data?.PainRelievers ?? [];
          this.Messages = val?.data?.Messages ?? [];
        }
      } else {
        // proposition data may or may not be in tmp storage
        this.loadFromTmp();
      }
      this.isLoading = false;
    },
    saveToTmp() {
      console.debug("Saving to tmp...");
      const data = {
        Name: this.Name,
        IdealCustomerProfiles: this.IdealCustomerProfiles,
        CustomerJobs: this.CustomerJobs,
        Pains: this.Pains,
        Gains: this.Gains,
        ProductsAndServices: this.ProductsAndServices,
        GainCreators: this.GainCreators,
        PainRelievers: this.PainRelievers,
        Messages: this.Messages,
      };
      const encodedData = btoa(JSON.stringify(data));
      localStorage.setItem("tmpSaved", encodedData);
      return JSON.stringify(encodedData);
    },
    loadFromTmp() {
      const encodedData = localStorage.getItem("tmpSaved");
      if (!encodedData) {
        console.debug("Nothing to load from tmp.");
        return;
      }
      console.debug("Loading from tmp...");
      const data = JSON.parse(atob(encodedData));
      //
      this.Name = data.Name;
      this.IdealCustomerProfiles = data.IdealCustomerProfiles;
      this.CustomerJobs = data.CustomerJobs;
      this.Pains = data.Pains;
      this.Gains = data.Gains;
      this.ProductsAndServices = data.ProductsAndServices;
      this.GainCreators = data.GainCreators;
      this.PainRelievers = data.PainRelievers;
      this.Messages = data.Messages;
    },
    reset() {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to clear this canvas?", {
          okTitle: "Yes",
          cancelTitle: "No",
        })
        .then((val) => {
          if (val === true) {
            localStorage.removeItem("tmpSaved");
            this.Published = false;
            this.IdealCustomerProfiles = [];
            this.CustomerJobs = [];
            this.Pains = [];
            this.Gains = [];
            this.ProductsAndServices = [];
            this.GainCreators = [];
            this.PainRelievers = [];
            this.Messages = [];
          }
        });
    },
    async publish() {
      if (this.nodes.length < 1) return;
      if (!this.routePropositionId) {
        await this.$bvModal.msgBoxOk(
          "You must save your proposition before publishing."
        );
        return;
      }
      if (!this.isOwner) {
        return;
      }
      if (!this.Published) {
        const res = await this.$bvModal.msgBoxConfirm(
          "Are you sure you want to make this proposition public?",
          { okTitle: "Yes", cancelTitle: "No" }
        );
        if (res === false) return;
        this.Published = true;
      } else {
        const res = await this.$bvModal.msgBoxConfirm(
          "Are you sure you want to make this proposition private?",
          { okTitle: "Yes", cancelTitle: "No" }
        );
        if (res === false) return;
        this.Published = false;
      }
    },
  },
  computed: {
    isOwner() {
      const userId = this.userInfoStore?.userInfo?.uid;
      return this.routeOwnerId === userId;
    },
    nodes() {
      return [
        ...this.IdealCustomerProfiles,
        ...this.CustomerJobs,
        ...this.Pains,
        ...this.Gains,
        ...this.ProductsAndServices,
        ...this.GainCreators,
        ...this.PainRelievers,
        ...this.Messages,
      ];
    },
    links() {
      const links = [];
      this.nodes.forEach((node) => {
        if (node.parentIds) {
          for (let parentId of node.parentIds) {
            links.push({
              source: node.id,
              target: parentId,
            });
          }
        }
        if (node.relationIds && Array.isArray(node.relationIds)) {
          for (let relationId of node.relationIds) {
            links.push({
              source: node.id,
              target: relationId,
            });
          }
        }
      });
      return links;
    },
    routePropositionId() {
      return this.$route.params?.propositionId;
    },
    routeOwnerId() {
      return this.$route.params?.ownerId;
    },
  },
  watch: {
    nodes() {
      this.draw();
      // if this is a saved item, then auto-save changes
      if (this.routePropositionId && this.isOwner) {
        this.save();
      }
    },
    Name() {
      // if this is a saved item, then auto-save changes
      if (this.routePropositionId && this.isOwner) {
        this.save();
      }
    },
    Published(val) {
      // if this is a saved item, then auto-save changes
      if (this.routePropositionId && this.isOwner) {
        this.save();
      }
    },
    selectedItem(val) {
      const ctxMenu = this.$refs["context-menu"];
      if (val) {
        ctxMenu.classList.add("show");
      } else {
        ctxMenu.classList.remove("show");
      }
    },
    hoveredItem(val) {
      const hvrMenu = this.$refs["hover-menu"];
      if (val) {
        hvrMenu.classList.add("show");
      } else {
        hvrMenu.classList.remove("show");
      }
    },
  },
  mounted() {
    // load saved info if any
    this.load();
    // initialize graph
    this._graphContent = d3.select("#canvas");
    // TODO: apply zoom/pan here
    // draw
    this.draw();
    //
  },
  beforeRouteLeave(to, from, next) {
    // TODO: Fix this notification!
    // if (this.nodes.length > 0 && !this.routePropositionId) {
    //   this.$bvModal.msgBoxConfirm("Are you sure you want to leave without saving your work?", {okTitle: "Yes", cancelTitle: "No"})
    //     .then((val) => {
    //       if (val === true) {
    //         next();
    //       }
    //     })
    // } else {
    next();
    // }
  },
};
</script>

<style lang="scss">
#canvas-wrapper {
  height: 100vh;
  width: 100%;
  #canvas {
    height: 100%;
    width: 100%;
  }
}

$fillColour: #d4e9ff;
$highlightedFillColour: #8cc4ff;
$fillColourPain: #ff9494;
$highlightedFillColourPain: #ff6161;
$fillColourGain: #f6a5fa;
$highlightedFillColourGain: #f482fa;

.gain-line {
  stroke: $fillColourGain;
  stroke-width: 14px;
}

.pain-line {
  stroke: $fillColourPain;
  stroke-width: 14px;
}

.line {
  stroke: $fillColour;
}

.icp {
  cursor: pointer;
  fill: $fillColour;
  &:hover {
    fill: $highlightedFillColour;
  }
}

.cj {
  cursor: pointer;
  fill: $fillColour;
  &:hover {
    fill: $highlightedFillColour;
  }
}

.cg,
.msg-gain {
  cursor: pointer;
  fill: $fillColourGain;
  &:hover {
    fill: $highlightedFillColourGain;
  }
}

.cp,
.msg-pain {
  cursor: pointer;
  fill: $fillColourPain;
  &:hover {
    fill: $highlightedFillColourPain;
  }
}

.product {
  cursor: pointer;
  fill: $fillColour;
  &:hover {
    fill: $highlightedFillColour;
  }
}

.service {
  cursor: pointer;
  fill: $fillColour;
  &:hover {
    fill: $highlightedFillColour;
  }
}

.pr {
  cursor: pointer;
  fill: $fillColourPain;
  &:hover {
    fill: $highlightedFillColourPain;
  }
}

.gc {
  cursor: pointer;
  fill: $fillColourGain;
  &:hover {
    fill: $highlightedFillColourGain;
  }
}

#context-menu,
#hover-menu {
  position: absolute;
  display: none;
  // padding: 0.5rem;
  // background-color: gray;
  &.show {
    display: block;
  }
  user-select: none;
  -webkit-user-drag: none;
  * {
    user-select: none;
    -webkit-user-drag: none;
  }
  pointer-events: none; // this is important to stop context-menu from intervening in svg element pointer events
}

.project-name {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
