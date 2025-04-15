<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  posterClass?: string;
  poster?: string;
  title?: string;
  watchlistId?: string;
  isLiked?: boolean;
  isWish?: boolean;
  isWatched?: boolean;
  mixId?: string;
  gradient1?: string;
  gradient2?: string;
  gradient3?: string;
}>();

const router = useRouter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getImageUrl = (name: string | undefined): string | undefined => {
  try {
    return new URL(`../../assets/images/posters/${name}.png`, import.meta.url)
      .href;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const openWatchlist = () => {
  router.push({ name: "watchlists", params: { id: props.watchlistId } });
};

const openMix = () => {
  router.push({ name: "mixes", params: { id: props.mixId } });
};

const openListFunction = computed(() => {
  if (props.watchlistId) {
    return openWatchlist;
  } else {
    return openMix;
  }
});

const gradientStyle = computed(() => {
  return {
    background: `linear-gradient(to bottom right, ${props.gradient1}, ${props.gradient2}, ${props.gradient3})`,
  };
});
// const gradients = [
//   "bg-gradient-to-br from-primary/50 via-blue-950 to-black",
//   "bg-gradient-to-bl from-violet-500/50 via-pink-600/30 to-black",
//   "bg-gradient-to-tl from-gray-300/20 via-cyan-950 to-black",
//   "bg-gradient-to-br from-green-100/20 via-green-600/20 to-black",
// ];

// function getRandomGradient() {
//   return gradients[Math.floor(Math.random() * gradients.length)];
// }
// console.log(gradientFull.value);
</script>
<template>
  <div class="rounded-xl w-44" @click="openListFunction">
    <div class="flex flex-col space-y-2">
      <div
        class="w-28 h-28 lg:w-44 lg:h-44 flex bg-gradient-to-br from-cyan-700 via-blue-100 to-black cursor-pointer"
        :style="gradientStyle"
        :class="{
          'bg-gradient-to-br from-violet-300 via-pink-500 to-black':
            $props.title == 'Мои любимые',
          'bg-gradient-to-bl from-blue-700/50 via-primary/80 to-black':
            $props.title == 'Просмотренные',
          'bg-gradient-to-br from-blue-600 via-blue-300 to-violet-400':
            $props.title == 'Хочу посмотреть',
        }"
      ></div>
      <slot name="title">
        <div>
          <h3 class="text-sm text-white/80 px-1">
            {{ $props?.title ? $props?.title : "Название" }}
          </h3>
        </div></slot
      >
    </div>
  </div>
</template>
<style scoped></style>
