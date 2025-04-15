<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from "vue";
import {
  FilmsService,
  type IFilm,
  type IFilmBody,
} from "@/services/films-service";
import { GenresService, type IGenre } from "@/services/genres-service";
import type { FileUploadSelectEvent } from "primevue";
import { WatchlistsService } from "@/services/watchlist-service";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

interface IFilmBodyLocal extends IFilmBody {
  genres: IGenre[];
}

const _poster_file = ref<string | null | undefined>(null);
const isFileUploaded = ref(false);
const _genres: Ref<IGenre[]> = ref([]);
const newFilm: Ref<IFilmBodyLocal> = ref({
  title: "",
  description: "",
  release_year: null,
  country: "",
  genres: [],
});

function onFileSelect(event: FileUploadSelectEvent) {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    _poster_file.value = e.target?.result;
    isFileUploaded.value = true;
  };

  reader.readAsDataURL(file);
}

const addNewFilm = async () => {
  const response: IFilm = await FilmsService.createFilm(
    newFilm.value.title,
    newFilm.value.description,
    newFilm.value.genres.map((el) => el.id),
    newFilm.value.country,
    newFilm.value.release_year
  );
  console.log(response);
  WatchlistsService.addItemToWatchlist(route.params.id, response.id);
  if (_poster_file.value) {
    FilmsService.uploadFilmPoster(response.id, _poster_file.value);
  }
  router.push({ name: "watchlists", params: { id: route.params.id } });
  console.log(response);
};

onBeforeMount(async () => {
  _genres.value = await GenresService.getGenresList();
  console.log(_genres.value);
});
</script>

<template>
  <main
    class="h-[100vh] overflow-x-hidden bg-gradient-to-b from-black/90 via-black/85 to-primary-800 py-28"
  >
    <form class="w-5/6 mx-auto space-y-4">
      <div class="flex justify-between gap-10">
        <div class="card flex flex-col items-center">
          <FileUpload
            v-if="!isFileUploaded"
            mode="basic"
            @select="onFileSelect"
            customUpload
            auto
            chooseLabel=" "
            pt:pcChooseButton:class=""
            severity="secondary"
            class="w-32 h-32 pr-2 bg-black border-none"
          />
          <img
            v-if="_poster_file"
            :src="_poster_file"
            alt="Image"
            class="shadow-md rounded-xl w-32"
          />
          <p class="text-primary/40 text-xs" v-if="!isFileUploaded">
            Загрузите постер
          </p>
        </div>
        <div class="flex-col space-y-6 w-5/6 justify-between">
          <FloatLabel variant="on">
            <InputText
              inputId="title"
              v-model="newFilm.title"
              class="w-full bg-black/80 !active:outline-black border border-black text-white"
            ></InputText>
            <label for="title" class="bg-black text-white/80"
              >Название фильма</label
            >
          </FloatLabel>

          <FloatLabel variant="on" class="!">
            <InputText
              type="number"
              inputId="year"
              :v-model="newFilm.release_year"
              :useGrouping="false"
              pt:InputNumber:class="!bg-black"
              pt:root:class=""
              class="w-full !bg-black border border-black text-white"
            ></InputText>
            <label for="year" class="bg-black text-white/80"
              >Год создания фильма</label
            >
          </FloatLabel>
        </div>
      </div>

      <FloatLabel variant="on">
        <InputText
          inputId="country"
          v-model="newFilm.country"
          class="w-full bg-black border border-black text-white"
        ></InputText>
        <label for="country" class="bg-black text-white/80"
          >Страна производства</label
        >
      </FloatLabel>
      <FloatLabel variant="on">
        <Textarea
          rows="5"
          inputId="description"
          v-model="newFilm.description"
          class="w-full bg-black border border-black text-white"
        ></Textarea>
        <label for="description" class="bg-black text-white/80"
          >Описание фильма</label
        >
      </FloatLabel>
      <FloatLabel variant="on">
        <MultiSelect
          pt:overlay:class="bg-gray-950/80 !text-white border-none"
          pt:optionLabel:class="text-white/80"
          optionLabel="name"
          :options="_genres"
          pt:option:class="!bg-white/0"
          pt:label:class="!text-white"
          filter
          pt:pcFilter:class=""
          placeholder="Выберите жанр"
          empty-message="Жанров не найдено"
          v-model="newFilm.genres"
          class="w-full bg-black border border-black !text-white"
        />
      </FloatLabel>
      <Button class="w-full bg-white/0 rounded-2xl" @click="addNewFilm"
        >Добавить</Button
      >
    </form>
  </main>
</template>
<style scoped>
.p-button-label {
  font-size: 0rem !important;
}

input:hover,
textarea:hover,
select:hover {
  border-color: white !important;
}
.p-inputnumber-input {
  background: black !important;
}
.p-inputtext {
  background: black !important;
}
</style>
