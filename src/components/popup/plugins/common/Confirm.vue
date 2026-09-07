<script setup lang="ts">
import Popup from "@/components/popup/core/Popup.vue";
import { onMounted, ref } from "vue";
import { usePopupStore } from "@/stores/popup.ts";

const title = ref<string>();
const message = ref<string>();
const button = ref<string>();
const type = ref<'default' | 'danger'>();

onMounted(() => {
  usePopupStore().registerInitHook('confirm', ({ clone }) => {
    title.value = clone.title;
    message.value = clone.message;
    button.value = clone.button;
    type.value = clone.type ?? 'default';
  });
})
</script>

<template>
  <Popup popup-key="confirm" :title="title" :confirm-text="button" :confirm-type="type" :confirm-handler="async () => { return true; }">
    {{ message }}
  </Popup>
</template>

<style scoped>

</style>