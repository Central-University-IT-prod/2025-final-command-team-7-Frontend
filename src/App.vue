<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from "vue-router";
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useToast } from "primevue/usetoast";
// Используем useRoute для получения текущего маршрута
const route = useRoute();
const authStore = useAuthStore();
// Создаем computed свойство для проверки, находимся ли мы на странице авторизации
const isAuthPage = computed(() => {
  return route.path.includes("/auth");
});

const toast = useToast();
// const _visible_menu = ref<boolean>(false);
const toggle = (event) => {
  menu.value.toggle(event);
};

interface ISeverity {
  Info: "info";
  Warn: "warn";
  Success: "success";
  Error: "error";
  Secondary: "secondary";
  Contrast: "contrast";
}

const showToast = (severity: ISeverity, summary: string, detail: string) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 5000,
  });
};

const menu = ref();

const items = ref([
  {
    label: "Главная",
    route: "/",
  },
  {
    label: "Коллекции",
    route: "/collections",
  },
]);
</script>

<template>
  <header
    v-if="!isAuthPage"
    class="w-full flex justify-end absolute top-2 space-x-2 right-2"
  >
    <Button
      type="button"
      icon="pi pi-bars"
      class="bg-black w-[2rem] h-[2rem] border-none xl:hidden"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />

    <Menu
      :model="items"
      ref="menu"
      id="overlay_menu"
      :popup="true"
      pt:item:class="hover:bg-black"
      class="bg-black border-none !text-white"
    >
      <template #item="{ item, props }">
        <div></div>
        <RouterLink
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2 !text-white">{{ item.label }}</span>
          </a>
        </RouterLink>

        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span class="ml-2 !text-white">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
    <div class="flex space-x-8">
      <RouterLink
        to="/"
        class="pt-1 bg-white/70 text-center not-only w-[6rem] h-[2rem] hidden xl:block rounded-md"
      >
        Глaвная
      </RouterLink>
      <!-- <Button @click="authStore.logout()" class="bg-red-500/30 border-red-800"
        >Выйти <i class="pi pi-sign-out"></i
      ></Button> -->
    </div>
    <Button
      @click="authStore.logout()"
      class="bg-red-500/40 border-red-800 border-none w-[2rem] !h-[2.1rem] xl:w-[6rem] xl:h-[2rem]"
      ><span class="hidden xl:block">Выйти</span> <i class="pi pi-sign-out"></i
    ></Button>
  </header>
  <RouterView />
</template>

<style scoped>
.p-menu-item-content {
  color: white;
}
</style>
