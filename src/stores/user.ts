import { computed, ref } from "vue";
import { defineStore } from 'pinia';
import { Base64 } from "js-base64";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth.ts";
import { useRouter } from "vue-router";
import api from "@/api";
import type { User } from "@/types";

/**
 * <h3>User Store</h3>
 *
 * <ul>
 *   <li>管理用户信息</li>
 *   <li>提供用户信息更新接口</li>
 * </ul>
 */
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
  let user_avatar_timestamp = ref(0) // 用于强制刷新头像
  let user_avatar = computed(() => {
    return `/avatars/${user_id.value}.png?timestamp=${user_avatar_timestamp.value}`
  })

  /////////////////////////////////////////////
  // 方法
  /////////////////////////////////////////////

  function updateUserInfo(token: string) {
    if (token) {
      const encodePayload = token.split('.')[1] as string;
      const decodePayload = Base64.decode(encodePayload);
      const payload = JSON.parse(decodePayload);
      const user = JSON.parse(payload.user) as User;
      user_id.value = user.id
      user_email.value = user.email
      user_role.value = user.role
      user_username.value = user.username
      user_bio.value = user.bio
    } else {
      user_id.value = -1;
      user_email.value = '';
      user_role.value = '';
      user_username.value = '';
      user_bio.value = '';
    }
  }

  function updateAvatar(newFile: File) {
    // 构造 FileReader
    const reader = new FileReader()
    reader.onload = async function () {
      const data = await api.post('/api/user/avatar', reader.result, {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      if (data.status === 'OK') {
        ElMessage.success('头像上传成功')
        // 延迟更新头像时间戳，确保头像刷新
        setTimeout(() => {
          user_avatar_timestamp.value = Date.now();
        }, 500);
      } else {
        ElMessage.error('头像上传失败: ' + data.message)
      }
    }
    // 读取上传文件，读取完成后触发 onload 事件，进行上传处理
    reader.readAsArrayBuffer(newFile)
  }

  async function updateUsername(newUsername: string) {
    const data = await api.post('/api/user/username', null, {
      params: {
        newUsername: newUsername
      },
    });
    if (data.status === 'OK') {
      ElMessage.success('用户名更新成功');
    } else {
      ElMessage.error('用户名更新失败: ' + data.message);
    }
  }

  const router = useRouter();

  async function modifyPassword(params: any) {
    const data = await api.post('/api/user/password', null, {
      params: params,
    });
    if (data.status === 'OK') {
      ElMessage.success(data.message);
      // 清除用户信息，强制用户重新登录
      setTimeout(() => {
        useAuthStore().logout();
        router.push({ name: 'login' })
      }, 500);
    } else {
      ElMessage.error(data.message);
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
    user_avatar,
    updateUserInfo,
    updateAvatar,
    updateUsername,
    modifyPassword,
  };
});