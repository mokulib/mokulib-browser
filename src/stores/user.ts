import { computed, ref } from "vue";
import { defineStore } from 'pinia';
import { Base64 } from "js-base64";
import type { JwtUser } from "@/types";

export const useUserStore = defineStore('user', () => {

  /////////////////////////////////////////////
  // 核心
  /////////////////////////////////////////////

  // 用户信息
  let user_id = ref<number>(-1);
  let user_email = ref<string>('');
  let user_role = ref<string>('');
  let user_username = ref<string>('');
  let user_bio = ref<string>('');
  let user_create_time = ref<string>('');
  // 常用状态
  let user_is_user = computed(() => user_role.value === 'USER');
  let user_is_admin = computed(() => user_role.value === 'ADMIN');
  let user_role_name = computed(() => {
    switch (user_role.value) {
      case 'USER':
        return '读者';
      case 'ADMIN':
        return '管理员';
      default:
        return '游客';
    }
  });
  // 头像
  let user_avatar_timestamp = ref(Date.now()) // 用于强制刷新头像
  let user_avatar = computed(() => {
    return `/avatars/${user_id.value}?timestamp=${user_avatar_timestamp.value}`
  })

  /////////////////////////////////////////////
  // 方法
  /////////////////////////////////////////////

  function updateUserInfo(token: string) {
    if (token) {
      const encodePayload = token.split('.')[1] as string;
      const decodePayload = Base64.decode(encodePayload);
      const payload = JSON.parse(decodePayload);
      const user = JSON.parse(payload.user) as JwtUser;
      user_id.value = user.id
      user_email.value = user.email
      user_role.value = user.role
      user_username.value = user.username
      user_bio.value = user.bio
      user_create_time.value = user.create_time
    } else {
      user_id.value = -1;
      user_email.value = '';
      user_role.value = '';
      user_username.value = '';
      user_bio.value = '';
      user_create_time.value = '';
    }
  }

  return {
    user_id,
    user_email,
    user_role,
    user_is_user,
    user_is_admin,
    user_role_name,
    user_username,
    user_bio,
    user_create_time,
    user_avatar_timestamp,
    user_avatar,
    updateUserInfo,
  };
});