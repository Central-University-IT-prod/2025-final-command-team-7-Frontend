<script setup lang="ts">
import {
  WatchlistsService,
  type IWatchlist,
} from "@/services/watchlist-service";
import type { Ref } from "vue";
import { computed, onBeforeMount } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// const props = defineProps<{
//   gradient1: string;
//   gradient2: string;
//   gradient3: string;
// }>();
// console.log(props);

const _liked_watchlist: Ref<IWatchlist | null> = ref(null);
const _watched_watchlist: Ref<IWatchlist | null> = ref(null);
const _wish_watchlist: Ref<IWatchlist | null> = ref(null);
const _all_watchlists: Ref<IWatchlist[] | null> = ref([]);

const _watchlist_title = ref<string>("");

const emit = defineEmits<{
  createWatchlist: [title: string];
}>();

const addWatchlist = async () => {
  const response: IWatchlist = await WatchlistsService.createWatchlist(
    _watchlist_title.value
  );
  console.log(response);
  _all_watchlists.value?.unshift(response);
  _visible_add_watch_list.value = false;
  _watchlist_title.value = "";
};

const showDialog = () => {
  _visible_add_watch_list.value = true;
};

const openWatchlist = (watchlistId: string | null | undefined) => {
  console.log(watchlistId);
  router.push({ name: "watchlists", params: { id: watchlistId } });
};

const gradients = [
  "bg-gradient-to-br from-primary/50 via-blue-950 to-black",
  "bg-gradient-to-bl from-violet-500/50 via-pink-600/30 to-black",
  "bg-gradient-to-tl from-gray-300/20 via-cyan-950 to-black",
  "bg-gradient-to-br from-green-100/20 via-green-600/20 to-black",
];

function getRandomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)];
}
const _visible_add_watch_list = ref<boolean>(false);

const gradientStyle = (
  gradient1?: string,
  gradient2?: string,
  gradient3?: string
) => {
  if (gradient1 && gradient2 && gradient3) {
    return {
      background: `linear-gradient(to bottom right, ${gradient1}, ${gradient2}, ${gradient3})`,
    };
  } else {
    return {
      background: getRandomGradient(),
    };
  }
};

onBeforeMount(async () => {
  _liked_watchlist.value = await WatchlistsService.getLikedWatchlist();
  _watched_watchlist.value = await WatchlistsService.getWatchedWatchlist();
  _wish_watchlist.value = await WatchlistsService.getWishWatchlist();
  _all_watchlists.value = await WatchlistsService.getAllWatchlists();

  console.log(_all_watchlists.value);
});
</script>

<template>
  <div
    class="bg-black/85 py-10 space-y-8 flex flex-col h-[100vh] px-10 xl:px-40 !overflow-scroll"
  >
    <!-- <RouterLink to="/">
      <Button
        class="absolute bg-white/0 border-none top-2 left-0"
        icon="pi pi-arrow-left"
      >
      </Button>
    </RouterLink> -->

    <p class="text-white text-3xl font-bold">Коллекции</p>
    <Dialog
      v-model:visible="_visible_add_watch_list"
      modal
      pt:header:closebutton:class="!outline-none !ring-0 !border-none hover:!bg-transparent"
      pt:header:closebuttonicon:class="text-white/70"
      class=""
      pt:root:class="bg-gray-900 w-full md:w-1/3 border-black rounded-xl"
      pt:mask:class="backdrop-blur-sm"
    >
      <template #header
        ><span class="text-white">Добавление подборки</span></template
      >
      <div class="py-6 space-y-4">
        <FloatLabel>
          <InputText
            type="text"
            inputId="watchlist_title"
            v-model="_watchlist_title"
            class="w-full bg-black text-white border-none"
          >
          </InputText>
          <label for="watchlist_title">Название подборки</label>
        </FloatLabel>
        <Button class="py-4 w-full bg-primary/20" @click="addWatchlist"
          >Добавить подборку</Button
        >
      </div>
    </Dialog>
    <div class="space-y-4">
      <div
        @click="showDialog"
        class="h-20 px-6 flex justify-between w-full border border-black/80 text-white bg-black/20 rounded-lg items-center cursor-pointer"
      >
        <span><i class="pi pi-plus text-white/70 !text-2xl"></i></span>
        <span class="text-xs">Добавить</span>
      </div>

      <div
        @click="openWatchlist(_liked_watchlist?.id)"
        class="h-20 px-6 flex justify-between w-full border border-black/80 text-white bg-gradient-to-br from-violet-300 via-pink-500 to-black rounded-lg items-center cursor-pointer"
      >
        <span><i class="pi pi-heart-fill text-white !text-2xl"></i></span>
        <span class="text-xs font-light">Мои любимые</span>
      </div>
      <div
        @click="openWatchlist(_wish_watchlist?.id)"
        class="h-20 px-6 flex justify-between w-full border border-black/80 text-white bg-gradient-to-br from-blue-600 via-blue-300 to-violet-400 rounded-lg items-center cursor-pointer"
      >
        <span><i class="pi pi-bookmark-fill text-white/70 !text-2xl"></i></span>
        <span class="text-xs font-light">Хочу посмотреть</span>
      </div>
      <div
        @click="openWatchlist(_watched_watchlist?.id)"
        class="h-20 px-6 flex justify-between w-full border border-black/80 text-white bg-gradient-to-bl from-blue-700/50 via-primary/80 to-black rounded-lg items-center cursor-pointer"
      >
        <span><i class="pi pi-check text-white/70 !text-2xl"></i></span>
        <span class="text-xs">Просмотренные</span>
      </div>
      <div
        v-for="watchlist in _all_watchlists"
        :key="watchlist.id"
        @click="openWatchlist(watchlist.id)"
        :class="`h-20 px-6  w-full flex space-x-4 justify-end border border-black/60 text-white ${getRandomGradient()} rounded-lg items-center cursor-pointer`"
      >
        <span class="text-xs">{{ watchlist.title }}</span>
        <!-- <Button
          icon="pi pi-trash"
          class="border-none bg-white/0 w-[1rem] h-[1rem] text-xs"
          style="font-size: 0.3rem"
        ></Button> -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-close-button {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.custom-close-button:hover {
  background: rgba(255, 0, 0, 0.1);
}

.custom-close-icon {
  font-size: 1rem;
  color: #555;
}

.custom-close-button:hover .custom-close-icon {
  color: red !important;
}
.p-button-secondary-focus-ring-color {
  color: #55555500;
}
</style>
