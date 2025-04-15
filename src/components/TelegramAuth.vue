<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.ts";
import { UserService } from "@/services/user-service.ts";
import { useRouter } from "vue-router";

const authKey = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isAuthenticated = ref(false);
const requestCount = ref(0);
const lastRequestStatus = ref<string>("Pending...");
let intervalId: number | null = null;

const router = useRouter();
const authStore = useAuthStore();
const handleTelegramLogin = () => {
  isLoading.value = true;
  error.value = null;
  axios
    .post(`/auth/telegram/get_auth_key`)
    .then((response) => {
      const key = response.data.auth_key;
      authKey.value = key;
      const telegramDeepLink = `tg://resolve?domain=FilmHubAuthBot&start=auth_${key}`;
      const link = document.createElement("a");
      link.href = telegramDeepLink;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      startCheckingAuth(key);
      isLoading.value = false;
    })
    .catch((err) => {
      error.value = "Failed to get authentication key";
      isLoading.value = false;
      console.error("Login error:", err);
    });
};

const checkAuthStatus = (key: string) => {
  requestCount.value++;
  lastRequestStatus.value = "Checking...";
  axios
    .post("/auth/telegram/check_auth_key", { tg_code: key })
    .then((response) => {
      lastRequestStatus.value = "Success";
      if (response.data.is_confirmed) {
        activateAuthKey(key);
      }
    })
    .catch((err) => {
      console.log(err);
      lastRequestStatus.value = "Failed";
      console.error("Check auth error:", err);
    });
};

const activateAuthKey = (key: string) => {
  axios
    .post("/auth/telegram/login", { tg_code: key })
    .then((response) => {
      authStore.setToken(response.data.token);
      authStore.setUser({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        telegram_id: response.data.telegram_id,
        hashed_password: "",
      });
      if (intervalId) {
        clearInterval(intervalId);
      }
      isAuthenticated.value = true;
      lastRequestStatus.value = "Аутентификация прошла успешно";
      router.push("/");
    })
    .catch((err) => {
      error.value = "Ошибка аутентификации";
      isLoading.value = false;
      console.error("Activate error:", err);
    });
};

const startCheckingAuth = (key: string) => {
  intervalId = setInterval(() => {
    checkAuthStatus(key);
  }, 1000);
};

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="login-container">
    <div class="!m-0">
      <div
        class="telegram-button !m-0 flex items-center justify-between"
        @click="handleTelegramLogin"
      >
        <button :disabled="isLoading">
          {{ isLoading ? "Loading..." : "Войти через telegram" }}
        </button>
        <i class="pi pi-telegram" style="font-size: 1.5rem !important"></i>
      </div>
    </div>

    <div>
      <!-- <p>Please confirm authorization in Telegram</p>
      <p>Auth Key: {{ authKey }}</p>
      <p>Waiting for confirmation...</p>
      <p>Request count: {{ requestCount }}</p>
      <p>Last request status: {{ lastRequestStatus }}</p> -->
    </div>

    <div v-if="isAuthenticated">
      <p class="success-message">Авторизация прошла!</p>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<style scoped>
.login-container {
  /* max-width: 400px; */
  /* margin: 50px auto; */
  text-align: center;
}

.telegram-button {
  background-color: #0088cc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0px !important;
}

.telegram-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}
</style>
