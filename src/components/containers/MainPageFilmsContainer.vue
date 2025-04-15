<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ containerHeader?: string }>();
</script>
<template>
  <slot name="header">
    <div>
      <h2
        class="w-full md:px-10 text-xl lg:text-3xl font-extrabold text-white/60 py-3"
      >
        {{
          $props?.containerHeader ? $props?.containerHeader : "Хочу посмотреть:"
        }}
      </h2>
    </div></slot
  >
  <div
    class="overflow-x-scroll md:px-10 overflow-y-hidden w-[100vw] xl:w-[82vw]"
  >
    <div class="flex space-x-4 lg:space-x-12 w-max">
      <slot name="content"></slot>
    </div>
  </div>
</template>
