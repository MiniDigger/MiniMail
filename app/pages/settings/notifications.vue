<script lang="ts" setup>
import { experimental_useInboxSender, useAccount } from "community-jazz-vue";
import { type DeviceType, Device, UserAccount, UserStatusMessage } from "#shared/schema";
import { getLoadedOrUndefined } from "jazz-tools";

const me = useAccount(UserAccount, { resolve: { root: { devices: { $each: true } } } });
const pwa = usePWA();
const deviceName = ref("New Device");
const toast = useToast();

async function registerForPushNotifications() {
  if (
    deviceName.value === "" ||
    getLoadedOrUndefined(me.value)?.root?.devices?.find((d) => d?.name === deviceName.value)
  ) {
    toast.add({
      title: "Error",
      description: "Device name is empty or already exists",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
    return;
  }

  const result = await Notification.requestPermission();
  if (result === "granted") {
    if (!("serviceWorker" in navigator)) {
      toast.add({
        title: "Error",
        description: "Service Worker not found!",
        icon: "i-lucide-alert-circle",
        color: "error",
      });
      return;
    }
    console.log("wait for service worker to be ready");
    const sw = await navigator.serviceWorker.ready;
    const sub = await sw.pushManager.getSubscription();
    let device: DeviceType;
    if (sub == null) {
      console.log("No subscription found");
      const {
        public: { webPushPublicKey },
      } = useRuntimeConfig();
      const newSub = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: webPushPublicKey,
      });
      console.log("New subscription:", newSub);
      device = Device.create({
        name: deviceName.value,
        pushRegistration: newSub.toJSON() as DeviceType["pushRegistration"],
      });
      getLoadedOrUndefined(me.value)?.root?.devices?.$jazz?.push(device);
    } else {
      console.log("Existing subscription:", sub);
      console.log(JSON.stringify(sub));
      const newDevice = getLoadedOrUndefined(me.value)?.root?.devices?.find(
        (d) => d?.pushRegistration?.endpoint === sub.endpoint
      );
      if (newDevice) {
        device = newDevice;
        device?.$jazz?.set("name", deviceName.value);
      } else {
        device = Device.create({
          name: deviceName.value,
          pushRegistration: sub.toJSON() as DeviceType["pushRegistration"],
        });
        getLoadedOrUndefined(me.value)?.root?.devices?.$jazz?.push(device);
      }
    }
    await test(device);
  } else {
    toast.add({
      title: "Error",
      description: "Permission for notifications not granted",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  }
}

async function remove(device: DeviceType) {
  if (confirm(`Are you sure you want to delete the device ${device?.name}? It will no longer recieve notifications.`)) {
    getLoadedOrUndefined(me.value)?.root?.devices?.$jazz?.remove((f) => f?.name === device?.name);
  }
}

async function test(device: DeviceType) {
  await fetch("/api/send-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registration: device?.pushRegistration,
      payload: { title: "Test Notification", content: "This is a test" },
    }),
  });
}

const {
  public: { workerAccountID },
} = useRuntimeConfig();
const sendInboxMessage = experimental_useInboxSender(workerAccountID);
async function changeUserStatus() {
  const result = await sendInboxMessage(
    UserStatusMessage.create({ status: !getLoadedOrUndefined(me.value)?.root?.enabled })
  );
  console.log("result", result);
}
</script>

<template>
  <UDashboardPanel id="notifications">
    <UDashboardNavbar title="Notifications">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>
    <div class="border-b border-default p-4 sm:px-6">
      <div class="space-y-4">
        <div>
          PWA Installed: {{ pwa?.isPWAInstalled }}
          <UButton v-if="!pwa?.isPWAInstalled" @click="pwa?.install()">Install</UButton>
        </div>
        <div class="space-x-4">
          <UInput v-model="deviceName" />
          <UButton @click="registerForPushNotifications">Register for push notifications</UButton>
        </div>
        <div v-if="me?.$isLoaded">
          Server worker enabled: {{ me?.root?.enabled }}
          <UButton @click="changeUserStatus">Toggle</UButton>
        </div>
      </div>
    </div>
    <div class="border-b border-default p-4 sm:px-6">
      <div v-if="me?.$isLoaded" class="space-y-4">
        <div v-for="device in me?.root?.devices" :key="device.$jazz.id" class="grid grid-cols-[1fr_55px_70px] gap-4">
          <template v-if="device?.$isLoaded">
            <div>{{ device.name }} - {{ device.pushRegistration?.endpoint?.substring(0, 40) + "..." }}</div>
            <UButton @click="test(device)">Test</UButton>
            <UButton @click="remove(device)">Remove</UButton>
          </template>
        </div>
      </div>
    </div>
  </UDashboardPanel>
</template>
