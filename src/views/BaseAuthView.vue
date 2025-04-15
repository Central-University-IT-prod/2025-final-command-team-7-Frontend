<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import { AuthStatements } from "@/enums/auth-statements";
import TelegramAuth from "@/components/TelegramAuth.vue";
import { UserService } from "@/services/user-service.ts";
import type { IUser } from "@/services/user-service.ts";
import { useRouter } from "vue-router";
import type { AxiosError } from "axios";

const router = useRouter();

interface IUserAuth {
  email: string;
  password: string;
  username: string;
  repeat_password: string;
  remember: boolean;
}

const _user: Ref<IUserAuth> = ref({
  email: "",
  password: "",
  username: "",
  repeat_password: "",
  remember: false,
});

const _auth_statement = ref<AuthStatements>(AuthStatements.SignIn);
const errorMessage = ref<string>("");
const authStore = useAuthStore();

// Метод для входа
const login = async () => {
  try {
    const user = await UserService.login(
      _user.value.email,
      _user.value.password
    );
    authStore.setToken(user.token);
    authStore.setUser(user);
    console.log(authStore.user, authStore.token);
    console.log("User logged in:", user);
    // Перенаправление или другие действия после успешного входа
    router.push("/");
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Метод для регистрации
const register = async () => {
  try {
    const response = await UserService.register(
      _user.value.email,
      _user.value.password,
      _user.value.username
    );
    authStore.setToken(response.token);
    authStore.setUser(response.user);
    login();
    console.log("User registered:", response.user);
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Проверка токена при загрузке приложения
// onMounted(async () => {
//   if (authStore.token) {
//     try {
//       const user = await UserService.getMe();
//       authStore.setUser(user);
//       console.log("User is already logged in:", user);
//       // Перенаправление или другие действия, если пользователь уже авторизован
//     } catch (error) {
//       console.error("Failed to fetch user:", error.message);
//       authStore.logout();
//     }
//   }
// });
</script>

<template>
  <div
    class="bg-black w-full !m-0 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div
      class="flex flex-col items-center justify-center w-full"
      v-if="_auth_statement == AuthStatements.SignIn"
    >
      <div
        class="w-11/12 lg:w-1/2 mx-auto bg-gray-900 py-20 px-8 sm:px-20 rounded-xl"
      >
        <div class="text-center mb-8">
          <div class="text-white text-3xl font-medium mb-4">
            Добро пожаловать!
          </div>
          <span class="text-muted-color font-medium"
            >Войдите чтобы продолжить</span
          >
        </div>
        <TelegramAuth class="!my-6"></TelegramAuth>
        <div class="space-y-6">
          <FloatLabel>
            <label for="email1" class="text-xs">Email</label>
            <InputText
              id="email1"
              type="text"
              class="w-full bg-white/0 text-white border border-white/50"
              v-model="_user.email"
            />
          </FloatLabel>

          <FloatLabel>
            <label for="_password" class="!text-xs">Пароль</label>
            <InputText
              id="password1"
              v-model="_user.password"
              pt:root:class="bg-white/0"
              :toggleMask="true"
              class="w-full !bg-white/0 text-white border"
              fluid
              type="password"
              :feedback="false"
            ></InputText>
          </FloatLabel>

          <Button label="Войти" class="w-full" @click="login"></Button>
          <p
            class="font-medium no-underline text-sm ml-2 -mt-4 text-center cursor-pointer text-primary/70"
            @click="_auth_statement = AuthStatements.SignUp"
          >
            Зарегистрироваться?
          </p>
          <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col items-center justify-center w-11/12 lg:w-1/2 mx-auto"
      v-if="_auth_statement == AuthStatements.SignUp"
    >
      <div class="!w-full">
        <div class="w-full bg-gray-800 py-20 px-8 sm:px-20 rounded-xl">
          <div class="text-center mb-8">
            <div class="text-white text-3xl font-medium mb-4">
              Добро пожаловать!
            </div>
          </div>

          <div>
            <div class="space-y-8">
              <FloatLabel>
                <label for="email1" class="text-xs">Email</label>
                <InputText
                  id="email1"
                  type="text"
                  class="w-full bg-white/0 text-white border border-white/50"
                  v-model="_user.email"
                />
              </FloatLabel>

              <FloatLabel>
                <label for="username" class="text-xs">Имя пользователя</label>
                <InputText
                  id="username"
                  v-model="_user.username"
                  pt:root:class="bg-white/0"
                  :toggleMask="true"
                  class="w-full !bg-white/0 text-white border"
                  fluid
                  :feedback="false"
                ></InputText>
              </FloatLabel>

              <FloatLabel>
                <label for="password_sign_in" class="text-xs">Пароль</label>
                <InputText
                  id="password_sign_in"
                  v-model="_user.password"
                  pt:root:class="bg-white/0"
                  :toggleMask="true"
                  class="w-full !bg-white/0 text-white border"
                  fluid
                  type="password"
                  :feedback="false"
                ></InputText>
              </FloatLabel>
              <!-- <FloatLabel>
                <label for="repeatPassword" class="text-xs"
                  >Повторите пароль</label
                >
                <InputText
                  id="repeat_password"
                  v-model="_user.repeat_password"
                  pt:root:class="bg-white/0"
                  :toggleMask="true"
                  class="w-full !bg-white/0 text-white border"
                  fluid
                  type="password"
                  :feedback="false"
                ></InputText>
              </FloatLabel> -->

              <Button
                label="Зарегистрироваться"
                class="w-full"
                @click="register"
              ></Button>
              <p
                class="font-medium no-underline text-sm ml-2 -mt-4 text-center cursor-pointer text-primary/70"
                @click="_auth_statement = AuthStatements.SignIn"
              >
                Войти?
              </p>
              <p v-if="errorMessage" class="text-red-500 text-sm mt-4">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
