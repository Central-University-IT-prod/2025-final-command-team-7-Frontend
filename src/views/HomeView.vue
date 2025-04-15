<script setup lang="ts">
import FilmCard from "@/components/cards/FilmCard.vue";
import MainPageCollectionsContainer from "@/components/containers/MainPageCollectionsContainer.vue";
import CollectionCard from "@/components/cards/CollectionCard.vue";
import MainPageFilmsContainer from "@/components/containers/MainPageFilmsContainer.vue";
import { computed, onMounted, ref, type Ref, watch } from "vue";
import { MixesService, type IMix } from "@/services/mixes-service";
import { onBeforeMount } from "vue";
import { FilmsService, type IFilm } from "@/services/films-service";
import { GenresService, type IGenre } from "@/services/genres-service";
import {
  WatchlistsService,
  type IWatchlist,
} from "@/services/watchlist-service";
import CollectionList from "@/components/CollectionList.vue";
import { MoodService, type IMood } from "@/services/mood-service";

enum FilmSearchState {
  Mood = "mood",
  Genre = "genre",
  Result = "result",
}

const _wish_watchlist_films: Ref<IFilm[]> = ref([]);
const _mixes_list: Ref<IMix[]> = ref([]);
const _all_watchlists: Ref<IWatchlist[]> = ref([]);
const _liked_watchlist: Ref<IWatchlist | null> = ref(null);
const _watched_watchlist: Ref<IWatchlist | null> = ref(null);
// const _wish_watchlist_items: Ref<IFilm[]> = ref(null);
const _wish_watchlist: Ref<IWatchlist | null> = ref(null);
const _all_genres: Ref<IGenre[]> = ref([]);
const _all_moods: Ref<IMood[]> = ref([]);
const _is_get_movie_visible = ref<boolean>(false);
const _moods_list_selected_1: Ref<IMood[]> = ref([]);
const _moods_list_selected_2: Ref<IMood[]> = ref([]);
const _moods_list_selected_3: Ref<IMood[]> = ref([]);
const _film_search_results: Ref<IFilm> = ref(null);
const _film_search_state: Ref<FilmSearchState> = ref(FilmSearchState.Mood);

onBeforeMount(async () => {
  _wish_watchlist_films.value = await WatchlistsService.getWishWatchlistItems();
  _liked_watchlist.value = await WatchlistsService.getLikedWatchlist();
  _watched_watchlist.value = await WatchlistsService.getWatchedWatchlist();
  _wish_watchlist.value = await WatchlistsService.getWishWatchlist();
  _all_watchlists.value = await WatchlistsService.getAllWatchlists();
  _mixes_list.value = await MixesService.getMixesList();
  _all_moods.value = await MoodService.getMoodsList();
  console.log(_all_watchlists.value);
});

const showDrawer = (): void => {
  _is_get_movie_visible.value = true;
};
const getFilm = (): void => {
  _show_genres.value = false;
};

const getGenresByMoods = async () => {
  const moods = [
    ..._moods_list_selected_1.value,
    ..._moods_list_selected_2.value,
    ..._moods_list_selected_3.value,
  ];
  _all_genres.value = await GenresService.getGenresList(
    moods.map((el) => el.id)
  );
  _film_search_state.value = FilmSearchState.Genre;
};

const getSearchResults = async () => {
  const moods = [
    ..._moods_list_selected_1.value,
    ..._moods_list_selected_2.value,
    ..._moods_list_selected_3.value,
  ];
  const response: IFilm = await FilmsService.recommendFilm(
    _selected_genres_list.value.map((el) => el.id)
  );
  _film_search_results.value = response;
  _film_search_state.value = FilmSearchState.Result;
};

const searchComeBack = () => {
  if (_film_search_state.value == FilmSearchState.Result) {
    _film_search_results.value = null;
    _film_search_state.value = FilmSearchState.Genre;
  } else if (_film_search_state.value == FilmSearchState.Genre) {
    _film_search_state.value = FilmSearchState.Mood;
    _selected_genres_list.value = [];
  }
};

const handleDrawerClose = (event: boolean): void => {
  if (!event) {
    _show_genres.value = false;
  }
};

const _selected_genres_list: Ref<IGenre[]> = ref([]);

const _genre_chunks = computed(() => {
  const result = [];
  for (let i = 0; i < _all_genres.value.length; i += 3) {
    result.push(_all_genres.value.slice(i, i + 3));
  }
  return result;
});

const _show_genres = ref(false);

watch(_is_get_movie_visible, (newVal) => {
  if (!newVal) {
    _show_genres.value = false;
  }
});
</script>

<template>
  <div :class="{ 'pointer-events-none': _is_get_movie_visible }">
    <main class="flex h-[110vh] md:h-[110vh] overflow-y-clip overflow-x-hidden">
      <CollectionList
        class="hidden w-1/5 h-[110vh] xl:flex md:flex-col md:overflow-scroll !px-4"
      />
      <Drawer
        v-model:visible="_is_get_movie_visible"
        id="drawer_actions"
        position="bottom"
        :closable="false"
        pt:mask:class="backdrop-blur-xs"
        class="h-2/3 bg-gradient-to-b to-[#020630] via-black/90 from-black text-white border-none rounded-2xl -mb-4 shadow-2xl"
        @close="handleDrawerClose"
      >
        <div class="flex flex-col justify-between h-full pb-10">
          <Button
            @click="searchComeBack"
            label="Назад"
            icon="pi pi-arrow-left"
            size="small"
            class="w-24 bg-transparent"
            v-if="_film_search_state != FilmSearchState.Mood"
          />
          <div
            v-if="_film_search_state == FilmSearchState.Mood"
            class="flex flex-col space-y-8"
          >
            <h2 class="text-white/80 text-xl">Выберите настроение фильма</h2>
            <SelectButton
              v-model="_moods_list_selected_1"
              :options="_all_moods.slice(0, 3)"
              optionLabel="name"
              multiple
              pt:root:class="w-full text-white"
              aria-labelledby="multiple"
            />
            <SelectButton
              v-model="_moods_list_selected_2"
              :options="_all_moods.slice(3, 6)"
              optionLabel="name"
              multiple
              aria-labelledby="multiple"
            />
            <SelectButton
              v-model="_moods_list_selected_3"
              :options="_all_moods.slice(6, 9)"
              optionLabel="name"
              multiple
              aria-labelledby="multiple"
            />
          </div>
          <div
            class="space-y-6"
            v-else-if="_film_search_state == FilmSearchState.Genre"
          >
            <h2 class="text-white/80 text-xl">Выберите жанр фильма</h2>
            <div class="h-[25rem] overflow-x-scroll flex flex-col space-y-4">
              <div v-for="(chunk, index) in _genre_chunks" :key="index">
                <SelectButton
                  v-model="_selected_genres_list"
                  :options="chunk"
                  optionLabel="name"
                  multiple
                  pt:root:class="w-full"
                  aria-labelledby="multiple"
                />
              </div>
            </div>
          </div>
          <div
            class="flex flex-col items-center space-y-6 my-18"
            v-else-if="_film_search_state == FilmSearchState.Result"
          >
            <!-- <div>
              <img
                :src="_film_search_results.poster_url"
                alt=""
                class="w-64 h-76"
              />
              <div class="flex flex-col items-center">
                <span class="text-center text-2xl">{{
                  _film_search_results.title
                }}</span>
                <span class="text-white/50 text-xs">{{
                  _film_search_results.country
                }}</span>
              </div>
            </div>

            <span
              class="w-[16rem] text-center text-xs text-white/40 p-4 bg-primary/10 rounded-xl"
              >{{ _film_search_results.description }}</span
            > -->
            <FilmCard
              :film-id="_film_search_results.id"
              :is-liked="_film_search_results.is_liked"
              :is-watched="_film_search_results.is_watched"
              :is-wish="_film_search_results.is_wish"
              extended-class-card-container="!bg-gray-500 bg-white/0 !w-[26rem] !md:w-[40rem] h-[14rem]"
              extended-class-card="!w-[60rem]"
              card-info-container="flex-col !justify-center"
              image-container="!w-[10rem] !h-[12rem]"
              description-container="w-[12rem] h-[4rem] md:h-[6rem]"
              :title="_film_search_results.title"
              :description="_film_search_results.description"
              :poster-url="_film_search_results.poster_url"
              :release-year="_film_search_results.release_year"
              :show-options="true"
            />
            <Button
              icon="pi pi-refresh"
              label="Другой фильм"
              class="p-4 w-[16rem] rounded-2xl border border-red-800 bg-red-800/20 text-white/90"
              @click="getSearchResults"
            ></Button>
          </div>
          <Button
            v-if="_film_search_state == FilmSearchState.Mood"
            @click="getGenresByMoods"
            class="w-full p-4 bg-primary/0"
            >Далее >></Button
          >
          <Button
            v-else-if="_film_search_state == FilmSearchState.Genre"
            @click="getSearchResults"
            class="w-full p-4 bg-primary/0"
            >Получить фильм</Button
          >
          <!-- <Button
            class="w-full p-4 bg-primary/0"
            v-else-if="_film_search_state == FilmSearchState.Result"
            @click="getFilm"
            >Получить фильм</Button
          > -->
        </div>
      </Drawer>
      <div
        class="bg-surface-800 h-[112vh] pt-10 !overflow-x-hidden w-full flex bg-gradient-to-b from-primary-500/30 to-black/50 pb-6"
      >
        <div class="flex px-4 pt-4 flex-col">
          <div
            @click="showDrawer"
            class="bg-[url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjk5dHBpYjkzYWxkc2w3ODY1amFiaWIxMnFscTB2b3c3YWJncGJueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3q3SUqPnxZGQpMNcjc/giphy.gif')] bg-no-repeat bg-center bg-cover rounded-xl p-5 w-[90vw] lg:w-[78vw] mb-6 ml-[8px] md:mx-10 h-80 flex justify-center items-center text-center relative cursor-pointer"
          >
            <div class="w-full h-full absolute blur-md top-0"></div>
            <h1
              class="text-4xl md:text-5xl flex items-center font-extrabold text-white/80 text-center z-10"
            >
              <i
                class="pi pi-play text-white/80 font-extrabold text-3xl md:text-4xl text-center z-10"
              ></i>
              Хочу фильм
            </h1>
          </div>
          <MainPageFilmsContainer v-if="_wish_watchlist_films?.length"
            ><template #content
              ><FilmCard
                v-for="film in _wish_watchlist_films"
                :key="film.id"
                :film-id="film.id"
                :is-liked="film.is_liked"
                :title="film.title"
                :is-wish="film.is_wish"
                :is-watched="film.is_watched"
                :poster-url="film.poster_url"
                :release-year="film?.release_year"
                :description="film.description"
                :show-options="false"
                poster="colorful_3" /></template
          ></MainPageFilmsContainer>
          <MainPageCollectionsContainer>
            <template #content>
              <CollectionCard
                :key="_liked_watchlist?.id"
                :title="_liked_watchlist?.title"
                :watchlist-id="_liked_watchlist?.id"
                poster="colorful_3"
              />
              <CollectionCard
                :key="_wish_watchlist?.id"
                :title="_wish_watchlist?.title"
                :watchlist-id="_wish_watchlist?.id"
                poster="colorful_3"
              />
              <CollectionCard
                :key="_watched_watchlist?.id"
                :title="_watched_watchlist?.title"
                :watchlist-id="_watched_watchlist?.id"
                poster="colorful_3"
              />
              <CollectionCard
                v-for="watchlist in _all_watchlists"
                :key="watchlist.id"
                :title="watchlist.title"
                :gradient1="watchlist?.color1"
                :gradient2="watchlist?.color2"
                :gradient3="watchlist?.color3"
                :watchlist-id="watchlist.id"
                poster="colorful_3"
              /> </template
          ></MainPageCollectionsContainer>
          <MainPageCollectionsContainer
            container-header="Миксы по жанрам"
            v-if="_mixes_list?.length"
          >
            <template #content>
              <CollectionCard
                v-for="mix in _mixes_list"
                :key="mix.id"
                :title="mix.title"
                :gradient1="mix?.color1"
                :gradient2="mix?.color2"
                :gradient3="mix?.color3"
                :mix-id="mix.id"
                poster="colorful_2" /></template
          ></MainPageCollectionsContainer>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.p-togglebutton {
  width: 100%;
  background-color: black;
  border: 1px rgba(255, 255, 255, 0.345) solid;
  font-size: 0.9rem !important;
  color: rgba(255, 255, 255, 0.587);
  padding: 1rem !important;
}
.p-togglebutton-checked {
  color: var(--p-primary-500);
  font-size: 0.9rem !important;
  background-color: rgba(0, 50, 23, 0.341);
}
.p-drawer-close-button {
  display: none;
}
</style>
