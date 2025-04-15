<script setup lang="ts">
import { type IFilm } from "@/services/films-service";
import { FilmsService } from "@/services/films-service";
import type { Ref } from "vue";
import { onBeforeMount, ref } from "vue";
import { RouterLink } from "vue-router";
import FilmCard from "@/components/cards/FilmCard.vue";
import ActionDrawer from "@/components/drawers/ActionDrawer.vue";
import {
  WatchlistsService,
  type IWatchlist,
} from "@/services/watchlist-service";
import { useRoute } from "vue-router";
import { MixesService, type IMix } from "@/services/mixes-service";
// import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const route = useRoute();

const _is_drawer_add_film_show = ref<boolean>(false);
const _is_drawer_actions_show = ref<boolean>(false);
const _ai_search_results: Ref<IFilm[]> = ref([]);
const _ai_search_field = ref<string>("");
const _current_watchlist: Ref<IWatchlist | IMix> = ref();
const _watchlist_items: Ref<IFilm[]> = ref([]);
let timer = null;

console.log(route);

const fillReceivedFilms = async () => {
  _ai_search_results.value = await FilmsService.getFilmsByDescription(
    _ai_search_field.value
  );
  console.log(_ai_search_results.value);
};

const findFilmsWithAI = async () => {
  isLoading.value = true;
  await fillReceivedFilms();
  timer = setTimeout(() => {
    isLoading.value = false;
  });
};
const isLoading = ref(false);

const removeItemFromWatchlistEvent = async (filmId: string) => {
  _watchlist_items.value = _watchlist_items.value.filter(
    (el) => el.id != filmId
  );
  WatchlistsService.removeItemFromWatchlist(
    _current_watchlist.value.id,
    filmId
  );
};

const addItemToWatchlist = async (filmId) => {
  const response = await FilmsService.getFilmById(filmId);
  _watchlist_items.value = WatchlistsService.getWatchlistById(
    _current_watchlist.value.id
  );
};

const deleteWatchlist = async () => {
  return;
};

onBeforeMount(async () => {
  if (route.name == "watchlists") {
    _watchlist_items.value = await WatchlistsService.getWatchlistItemsForUserId(
      route.params.id
    );
    _current_watchlist.value = await WatchlistsService.getWatchlistById(
      route.params.id
    );
  } else if (route.name == "mixes") {
    _current_watchlist.value = await MixesService.getMixById(route.params.id);
    _watchlist_items.value = await MixesService.getMixItems(route.params.id);
  }
  console.log(_watchlist_items.value);
});
</script>
<template>
  <div
    class="h-full !overflow-scroll bg-gradient-to-br from-violet-300 via-pink-500 to-black"
  >
    <!-- <Button class="bg-white/0 border-none" icon="pi pi-"></Button> -->
    <RouterLink to="/collections">
      <Button
        class="absolute bg-white/0 border-none top-2 left-0 md:hidden"
        icon=""
      >
        <i class="pi pi-arrow-left" size="large" style="font-size: 2.5rem"></i>
      </Button>
    </RouterLink>
    <div class="h-[110vh]">
      <div
        class="pt-16 flex fledx-col md:flex-row items-center justify-between p-10"
      >
        <!-- <img src="" alt="" /> -->
        <span class="font-bold text-white/70 text-7xl md:text-9xl px-4"
          >{{ _current_watchlist?.title }}
        </span>
        <!-- <Button
          icon="pi pi-trash"
          class="border-none bg-white/0 w-[8rem] h-[4rem] !text-3xl"
          style="font-size: 20px !important"
          @click="deleteWatchlist"
        ></Button> -->
      </div>
      <div class="text-white pt-2 md:px-10">
        <button
          @click="_is_drawer_add_film_show = true"
          :disabled="!_current_watchlist?.id"
          v-if="route.name !== 'mixes'"
          class="p-3 w-[90%] justify-start cursor-pointer bg-black/40 lg:space-x-[33rem] items-center mx-auto h-28 rounded-lg flex space-x-4 mb-2"
        >
          <div
            class="bg-gray-600/50 flex justify-center items-center w-[4rem] h-[4rem]"
          >
            <i class="pi pi-plus" style="font-size: 1.5rem"></i>
          </div>
          <div class="">
            <h3 class="text-xl md:text-2xl text-white/50 font-light text-start">
              Добавить фильм
            </h3>
          </div>
        </button>
        <div class="space-y-2">
          <div v-for="film in _watchlist_items" :key="film.id">
            <FilmCard
              extended-class-card-container="!w-[90%] bg-black/10 mx-auto"
              extended-class-card="justify-between mx-auto"
              card-info-container="flex-col lg:flex-row"
              :film-id="film.id"
              :is-liked="film.is_liked"
              :is-watched="film.is_watched"
              :is-wish="film.is_wish"
              :title="film.title"
              :description="film.description"
              :poster-url="film.poster_url"
              description-container="w-[20rem] !md:w-[40rem]"
              :release-year="film.release_year"
              :show-options="true"
              @on-remove-item-from-watchlist="removeItemFromWatchlistEvent"
            >
            </FilmCard>
            <!-- {{ film.poster_url }} -->
            <ActionDrawer
              :is-watched="film.is_watched"
              :is-wish="film.is_wish"
              :film-id="film.id"
              :is-liked="film.is_liked"
              :poster-url="film.poster_url"
              :description="film.description"
              :title="film.title"
              :visibility="_is_drawer_actions_show"
            ></ActionDrawer>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Drawer
    pt:mask:class="backdrop-blur-xs"
    modal
    id="drawer_add_film"
    position="bottom"
    v-model:visible="_is_drawer_add_film_show"
    class="bg-[#191919] border-none h-2/3 rounded-2xl"
  >
    <template #header>
      <span class="text-white/80 text-xl">Добавление фильма в плейлист</span>
    </template>
    <div class="py-6 space-y-4">
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-wrapper">
          <div class="spinner spinner-1"></div>
          <div class="spinner spinner-2"></div>
        </div>
        <div class="loading-text">Загрузка</div>
      </div>
      <!-- <img
        alt=""
        class="bg-[url(https://app.lottiefiles.com/animation/6f4373ce-163c-4876-874f-f92e3e0587aa)] bg-cover bg-no-repeat bg-center absolute w-[20rem] h-[20rem]"
        v-if="isLoading"
      />
      <DotLottieVue
        style="height: 500px; width: 500px"
        autoplay
        loop
        src="https://path-to-lottie.lottie"
      /> -->

      <FloatLabel variant="on">
        <Textarea
          id="in_label"
          autocomplete="off"
          v-model="_ai_search_field"
          fluid
          rows="5"
          class="bg-[#191919] text-white"
        />
        <label for="in_label" class="bg-[#191919]"
          >Расскажите все, что знаете о фильме</label
        >
      </FloatLabel>
      <Button
        class="w-full p-4 bg-primary-800"
        @click="findFilmsWithAI"
        icon="pi pi-search"
        label="Найти фильм"
      />
    </div>
    <div class="flex overflow-scroll space-x-2">
      <FilmCard
        v-for="result in _ai_search_results"
        :film-id="result.id"
        :is-liked="result.is_liked"
        :title="result.title"
        card-info-container=""
        :description="result.description"
        :release-year="result.release_year"
        :key="result.id"
        :poster-url="result.poster_url"
        :is-watched="result.is_watched"
        :is-wish="result.is_wish"
        extended-class-card-container="!w-full h-[10rem]"
        extended-class-card="!w-[80%]"
        image-container="!w-[5rem] !h-[8rem]"
        description-container="w-[30rem] h-[10rem]"
        @on-add-item-to-watchlist="addItemToWatchlist"
      >
      </FilmCard>
    </div>
    <div class="p-2 space-y-4">
      <p class="text-sm !text-center text-amber-300/40">
        Если вы не нашли свой фильм, попробуйте дополнить описание, либо
        добавьте свой фильм
      </p>
      <RouterLink
        :to="{ name: 'create-film', params: { id: _current_watchlist.id } }"
        ><Button class="w-full p-4 bg-white/0 text-primary"
          ><i class="pi pi-plus"></i>Добавить фильм
        </Button></RouterLink
      >
    </div>
  </Drawer>
</template>
<style scoped>
/* Фон для загрузочного экрана */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  flex-direction: column;
  text-align: center;
}

/* Блок с двумя вращающимися кругами */
.spinner-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 120px;
  height: 120px;
}

/* Стиль первого круга */
.spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: absolute;
  animation: rotate 2s linear infinite;
}

/* Первый круг с красным цветом */
.spinner-1 {
  border: 8px solid rgba(255, 0, 0, 0.5);
  border-top: 8px solid red;
  z-index: 1;
}

/* Второй круг с синим цветом */
.spinner-2 {
  border: 8px solid rgba(0, 0, 255, 0.5);
  border-top: 8px solid blue;
  animation: rotate 2s linear infinite reverse; /* вращается в другую сторону */
  z-index: 0;
}

/* Анимация вращения */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Стиль текста "Загрузка" */
.loading-text {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
}
</style>
