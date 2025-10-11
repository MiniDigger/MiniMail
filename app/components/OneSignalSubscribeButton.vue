<template>
  <ClientOnly>
    <UButton label="Open" color="neutral" variant="subtle" @click.prevent="onClickBellButton" />
    <!--    <v-tooltip location="bottom">-->
    <!--      <template #activator="{ props }">-->
    <!--        <v-btn variant="text" icon class="me-2" v-bind="props" @click.prevent="onClickBellButton">-->
    <!--          <v-icon :color="bellOption.color" :icon="bellOption.icon" />-->
    <!--        </v-btn>-->
    <!--      </template>-->
    <!--      <span>{{ bellOption.tooltipText }}</span>-->
    <!--    </v-tooltip>-->
  </ClientOnly>
</template>

<script lang="ts" setup>
import { useAuth } from "@clerk/vue";

const BELL_STATE = {
  DISABLED: "disabled",
  SUBSCRIBE: "subscribe",
  SUBSCRIBED: "subscribed",
} as const;

type BellState = (typeof BELL_STATE)[keyof typeof BELL_STATE];

const { $OneSignal } = useNuxtApp();
const auth = useAuth();

const bellState = ref<BellState>(BELL_STATE.DISABLED);

const bellOption = computed(() => {
  switch (bellState.value) {
    case BELL_STATE.SUBSCRIBE:
      return {
        color: "info",
        icon: "mdi-bell",
        tooltipText: i18n.t("onesignal.attributes.bell.subscribe"),
      };
    case BELL_STATE.SUBSCRIBED:
      return {
        color: "success",
        icon: "mdi-bell-check",
        tooltipText: i18n.t("onesignal.attributes.bell.subscribed"),
      };
    case BELL_STATE.DISABLED:
    default:
      return {
        color: "info",
        icon: "mdi-bell-off",
        tooltipText: i18n.t("onesignal.attributes.bell.disabled"),
      };
  }
});

watch(auth.isSignedIn, (status) => {
  if (status) {
    $OneSignal.login(String(auth.userId.value));
  }
});

onBeforeMount(() => {
  updateBellState();

  $OneSignal.Notifications.addEventListener("permissionChange", onPermissionChange);
  $OneSignal.User.PushSubscription.addEventListener("change", onSubscriptionChange);
});

onBeforeUnmount(() => {
  $OneSignal.Notifications.removeEventListener("permissionChange", onPermissionChange);
  $OneSignal.User.PushSubscription.removeEventListener("change", onSubscriptionChange);
});

async function onClickBellButton() {
  switch (bellState.value) {
    case BELL_STATE.SUBSCRIBED:
      await $OneSignal.User.PushSubscription.optOut();
      break;
    case BELL_STATE.SUBSCRIBE:
      await $OneSignal.User.PushSubscription.optIn();
      break;
    case BELL_STATE.DISABLED:
      // $OneSignal.Slidedown.promptPush({ force: true });
      await $OneSignal.Notifications.requestPermission();
      break;
  }
}

function onSubscriptionChange() {
  updateBellState();
}

function onPermissionChange(isAllowed: boolean) {
  if (isAllowed) {
    $OneSignal.User.PushSubscription.optIn();
  }
}

function getSubscriptionState() {
  return {
    isPushNotificationsEnabled: $OneSignal.Notifications.permission,
    isOptedIn: $OneSignal.User.PushSubscription.optedIn,
  };
}

function updateBellState() {
  const state = getSubscriptionState();

  if (!state.isPushNotificationsEnabled) {
    bellState.value = BELL_STATE.DISABLED;

    return;
  }

  if (!state.isOptedIn) {
    bellState.value = BELL_STATE.SUBSCRIBE;

    return;
  }

  bellState.value = BELL_STATE.SUBSCRIBED;
}
</script>
