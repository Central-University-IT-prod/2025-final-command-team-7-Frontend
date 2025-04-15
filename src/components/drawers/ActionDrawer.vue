<script setup lang="ts">
import { FilmsService } from "@/services/films-service";
import { WatchlistsService } from "@/services/watchlist-service";
import { onBeforeMount, ref } from "vue";

const props = defineProps<{
  visibility: boolean;
  poster?: string;
  description?: string;
  title?: string;
  imagePath?: string;
  releaseYear?: number | null;
  extendedClassCardContainer?: string;
  extendedClassCard?: string;
  filmId: string;
  isLiked: boolean;
  isWatched: boolean;
  isWish: boolean;
  posterUrl?: string;
}>();

const emit = defineEmits<{
  (e: "updateVisibility", value: boolean): void;
  (e: "onFilmDeleteFromWatchlist", filmId: string): void;
  (e: "onLikeFilm", event: Event): void;
  (e: "onWishFilm", event: Event): void;
  (e: "onWatchedFilm", event: Event): void;
}>();

const deleteFilm = async () => {
  FilmsService.getFilmById(props.filmId);
};

const closeDrawer = () => {
  emit("updateVisibility", false);
};

const op = ref();
const selectedMember = ref(null);
const collections = ref([]);

const toggle = (event) => {
  op.value.toggle(event);
};

const selectCollection = (collection) => {
  selectedMember.value = collection;
  console.log(props.filmId);
  WatchlistsService.addItemToWatchlist(collection.id, props.filmId);
  console.log(selectedMember.value);
  op.value.hide();
};

onBeforeMount(async () => {
  collections.value = await WatchlistsService.getAllWatchlists();
});
</script>
<template>
  <Drawer
    :visible="$props.visibility"
    id="drawer_actions"
    position="bottom"
    pt:mask:class="backdrop-blur-xs"
    class="h-1/2 bg-[#191919] text-white border-none rounded-2xl -mb-4 shadow-2xl"
  >
    <template #header>
      <div class="flex justify-start items-center space-x-4">
        <img :src="$props.posterUrl" alt="" class="w-16" />
        <span class="text-xl">{{ $props.title }}</span>
      </div>
    </template>
    <div class="flex flex-col">
      <span
        class="w-full py-4 text-lg md:text-xl cursor-pointer"
        @click="$emit('onLikeFilm', $props.filmId)"
        ><i
          class="pi mr-4"
          :class="{
            'pi-heart': $props.isLiked,
            'pi-heart-filled': $props.isLiked,
          }"
        ></i
        >Добавить в любимые</span
      >
      <span
        class="w-full py-4 text-lg md:text-xl cursor-pointer"
        @click="$emit('onWishFilm', $props.filmId)"
        ><i class="pi pi-bookmark mr-4"></i>Хочу посмотреть</span
      >

      <Button
        class="w-full py-4 px-0 bg-white/0 text-start border-none flex justify-start text-lg md:text-xl cursor-pointer"
        type="button"
        @click="toggle"
      >
        <i class="pi pi-plus mr-2"></i>Добавить в коллекцию</Button
      >
      <span
        class="w-full py-4 text-lg md:text-xl cursor-pointer"
        @click="$emit('onWatchedFilm', $props.filmId)"
        ><i class="pi pi-eye mr-4"></i>Добавить в просмотренные</span
      >
    </div>

    <Button class="w-full bg-white/40 border-none mt-10" @click="closeDrawer"
      >Закрыть</Button
    >
  </Drawer>
  <Popover ref="op" class="bg-gray-300 border-none w-[20rem] h-max-[20rem]">
    <div class="flex flex-col gap-4">
      <div>
        <ul class="list-none p-0 m-0 flex flex-col">
          <li
            v-for="collection in collections"
            :key="collection.title"
            @click="selectCollection(collection)"
            class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border"
          >
            <span class="font-medium">{{ collection.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </Popover>
</template>
