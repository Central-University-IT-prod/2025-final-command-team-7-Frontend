<script lang="ts" setup>
const props = defineProps<{ containerHeader?: string }>();
// const gradients = [
//   "bg-gradient-to-br from-primary/50 via-blue-950 to-black",
//   "bg-gradient-to-bl from-violet-500/50 via-pink-600/30 to-black",
//   "bg-gradient-to-tl from-gray-300/20 via-cyan-950 to-black",
//   "bg-gradient-to-br from-green-100/20 via-green-600/20 to-black",
// ];

// function getRandomGradient() {
//   return gradients[Math.floor(Math.random() * gradients.length)];
// }
</script>
<template>
  <slot name="header">
    <div>
      <h2
        class="w-full text-xl md:px-10 lg:text-3xl font-extrabold text-white/60 py-3"
      >
        {{
          $props?.containerHeader ? $props?.containerHeader : "Ваши коллекции"
        }}
      </h2>
    </div></slot
  >
  <div
    class="overflow-x-scroll overflow-y-hidden md:px-10 w-[100vw] xl:w-[82vw]"
  >
    <div class="flex space-x-10 lg:space-x-10">
      <slot name="content"></slot>
    </div>
  </div>
</template>
