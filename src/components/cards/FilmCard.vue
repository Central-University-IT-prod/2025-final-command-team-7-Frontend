<script setup lang="ts">
import { WatchlistsService } from "@/services/watchlist-service";
import { ref, computed } from "vue";
// import { type IFilmBody } from "@/services/films-service";
import ActionDrawer from "../drawers/ActionDrawer.vue";
import { type IFilm } from "@/services/films-service";
import { FilmsService } from "@/services/films-service";
import { type Ref } from "vue";

const props = defineProps<{
  poster?: string;
  description?: string;
  showOptions?: false;
  title?: string;
  imagePath?: string;
  releaseYear?: number | null;
  extendedClassCardContainer?: string;
  extendedClassCard?: string;
  filmId: string;
  isLiked?: boolean;
  isWish?: boolean;
  isWatched?: boolean;
  descriptionContainer?: string;
  imageContainer?: string;
  posterUrl?: string;
  cardInfoContainer?: string;
}>();

const emit = defineEmits<{
  (e: "onRemoveItemFromWatchlist", id: string): void;
  (e: "onAddItemToWatchlist", filmId: string): void;
}>();

const _is_liked = ref(props.isLiked);
const _is_wish = ref(props.isWish);
const _is_watched = ref(props.isWatched);

const getImageUrl = (name: string): string | undefined => {
  try {
    return new URL(
      `${props?.imagePath ? props?.imagePath : "../../assets/images/posters/"}${name}`,
      import.meta.url
    ).href;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const likeFilm = async (event: Event) => {
  // Останавливаем всплытие события, чтобы не сработал клик на карточке
  event.stopPropagation();

  const likedWatchlist = await WatchlistsService.getLikedWatchlist();
  if (!_is_liked.value) {
    _is_liked.value = true;
    await WatchlistsService.addItemToWatchlist(likedWatchlist.id, props.filmId);
    addItemToWatchlistEvent();
  } else if (_is_liked.value) {
    _is_liked.value = false;
    removeItemFromWatchlistEvent();
  }
};

const likeFilmEv = async (filmId) => {
  console.log(filmId);
  const likedWatchlist = await WatchlistsService.getLikedWatchlist();
  if (!_is_liked.value) {
    _is_liked.value = true;
    await WatchlistsService.addItemToWatchlist(likedWatchlist.id, filmId);
    addItemToWatchlistEvent();
  } else if (_is_liked.value) {
    _is_liked.value = false;
    removeItemFromWatchlistEvent();
  }
};

const addToWishFilmEv = async (filmId) => {
  console.log(filmId);
  const wishWatchlist = await WatchlistsService.getWishWatchlist();
  if (!_is_wish.value) {
    _is_wish.value = true;
    await WatchlistsService.addItemToWatchlist(wishWatchlist.id, filmId);
    addItemToWatchlistEvent();
  } else if (_is_wish.value) {
    _is_wish.value = false;
    removeItemFromWatchlistEvent();
  }
};

const addToWatchedFilmEv = async (filmId) => {
  const watchedWatchlist = await WatchlistsService.getWatchedWatchlist();
  if (!_is_watched.value) {
    _is_watched.value = true;
    await WatchlistsService.addItemToWatchlist(watchedWatchlist.id, filmId);
    addItemToWatchlistEvent();
  } else if (_is_watched.value) {
    _is_watched.value = false;
    removeItemFromWatchlistEvent();
  }
};

const removeItemFromWatchlistEvent = (filmId) => {
  emit("onRemoveItemFromWatchlist", filmId);
};

const addItemToWatchlistEvent = () => {
  emit("onAddItemToWatchlist", props.filmId);
};

const handleBookmarkClick = async (event: Event) => {
  // Останавливаем всплытие события
  event.stopPropagation();
  // Здесь можно добавить логику для закладки
  await addToWishList();
};

const addToWishList = async () => {
  const wishWatchlist = await WatchlistsService.getWishWatchlist();
  if (!_is_wish.value) {
    _is_wish.value = true;
    await WatchlistsService.addItemToWatchlist(wishWatchlist.id, props.filmId);
    addItemToWatchlistEvent();
  } else if (_is_wish.value) {
    _is_wish.value = false;
    removeItemFromWatchlistEvent();
  }
};

const handleActionsClick = (event: Event) => {
  // Останавливаем всплытие события
  event.stopPropagation();
  _is_drawer_actions_visible.value = true;
};

const _film_info: Ref<IFilm> = ref({
  title: "Название",
  description: "Тут должно быть описание",
  genres_ids: [],
  country: "Россия",
  release_year: 2023,
  poster_url: getImageUrl("colorful_3.png"),
  tmdb_id: 11,
  is_liked: false,
  is_wish: false,
  is_watched: false,
});

const changeDrawerVisibility = (state: boolean) => {
  _is_drawer_actions_visible.value = state;
};

const getFilmInfo = async (id: string) => {
  _visible_modal_film.value = true;
  _film_info.value = await FilmsService.getFilmById(id);
};

const _visible_modal_film = ref<boolean>(false);
const _is_drawer_actions_visible = ref<boolean>(false);

// Computed property to shorten the description
const DESCRIPTION_LIMIT = 40;
const shortenedDescription = computed(() => {
  if (props.description && props.description.length > DESCRIPTION_LIMIT) {
    return props.description.slice(0, DESCRIPTION_LIMIT) + "...";
  }
  return props.description;
});
const TITLE_LIMIT = 30;
const titleShort = computed(() => {
  if (props.title && props.title.length > TITLE_LIMIT) {
    return props.title.slice(0, TITLE_LIMIT) + "...";
  }
  return props.title;
});
</script>

<template>
  <Dialog
    modal
    pt:mask:class="backdrop-blur-xs"
    v-model:visible="_visible_modal_film"
    class=""
    pt:root:class="bg-gray-700/70 w-5/6  md:w-1/3 border-black"
    :pt="{
      mask: {
        onclick: () => (_visible_modal_film = false),
      },
    }"
  >
    <div class="flex flex-col items-center space-y-6">
      <img :src="$props.posterUrl" alt="" class="w-52 h-72" />
      <div class="flex flex-col items-center">
        <span class="text-center text-2xl text-white/50">{{
          _film_info.title
        }}</span>
        <span class="text-white/50 text-xs">{{
          $props.releaseYear ? $props.releaseYear : "XXXX"
        }}</span>
      </div>

      <span
        class="w-[16rem] text-center text-xs text-white p-4 bg-primary/40 rounded-xl"
      >
        {{
          $props.description ? $props.description : "Здесь должно быть описание"
        }}
      </span>
    </div>
  </Dialog>

  <ActionDrawer
    :film-id="_film_info.id"
    :is-liked="_film_info.is_liked"
    :is-watched="_film_info.is_watched"
    :is-wish="_film_info.is_wish"
    :poster-url="_film_info.poster_url"
    :visibility="_is_drawer_actions_visible"
    @update-visibility="changeDrawerVisibility"
    @on-film-delete-from-watchlist="removeItemFromWatchlistEvent"
    @on-like-film="likeFilmEv"
    @on-watched-film="addToWatchedFilmEv"
    @on-wish-film="addToWishFilmEv"
  ></ActionDrawer>

  <div
    :class="$props.extendedClassCardContainer"
    @click="getFilmInfo(filmId)"
    class="rounded-lg w-[24rem] cursor-pointer xl:w-[24rem] bg-black/40 z-0 py-4 pl-4"
  >
    <div :class="$props.extendedClassCard" class="flex space-x-4">
      <div
        class="w-36 h-24 lg:w-32 lg:h-20 flex"
        :class="$props.imageContainer"
      >
        <img
          v-if="$props.poster"
          :src="
            $props?.poster ? $props?.posterUrl : getImageUrl('colorful_3.png')
          "
          class="object-cover rounded-sm"
        />
        <img
          v-else-if="posterUrl"
          :src="$props.posterUrl"
          class="object-cover rounded-sm"
        />
      </div>
      <div class="flex" :class="$props.cardInfoContainer">
        <div>
          <div class="flex flex-col justify-start h-12">
            <slot name="title"
              ><h3
                class="text-xs flex flex-wrap -ml-8 font-semibold text-white/90"
              >
                {{ titleShort }}
              </h3></slot
            >
            <slot name="subtitle"
              ><p class="-ml-8 text-xs text-surface-400">
                {{ $props?.releaseYear ? $props?.releaseYear : "XXXX" }}
              </p></slot
            >
          </div>
          <p
            class="text-xs text-surface-300 -ml-8 w-[10rem] text-wrap"
            :class="$props.descriptionContainer"
          >
            {{ shortenedDescription }}
          </p>
        </div>
        <div
          class="flex items-center pl-6 space-x-4 relative right-4"
          v-show="$props.showOptions"
        >
          <span class="z-10" @click="likeFilm($event)"
            ><i
              class="pi text-md text-white cursor-pointer"
              :class="{ 'pi-heart': !_is_liked, 'pi-heart-fill': _is_liked }"
            ></i
          ></span>

          <span class="z-10" @click="handleBookmarkClick($event)"
            ><i
              class="pi text-md text-white cursor-pointer"
              :class="{
                'pi-bookmark': !_is_wish,
                'pi-bookmark-fill': _is_wish,
              }"
            ></i
          ></span>
          <span class="z-10 w-4" @click="handleActionsClick($event)"
            ><i class="pi pi-ellipsis-h text-md text-white cursor-pointer"></i
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>
