<script lang="ts" setup>
import { useAccount, useCoState } from "community-jazz-vue";
import { MyStuff, UserAccount } from "~/jazz/schema";

const { me, agent, logOut } = useAccount(UserAccount);

function increment() {
  console.log("increment", me.value, me.value?.root?.toJSON());
  if (!me.value?.root) return;
  console.log(me.value?.root);
  me.value.root.$jazz.set("counter", (me.value.root.counter || 0) + 1);
}

function debug() {
  console.log("me", me.value?.toJSON());
  console.log("profile", me.value?.profile?.toJSON());
  console.log("mystuff", me.value?.root?.toJSON());
  console.log("agent", agent);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; max-width: 200px; margin: auto; gap: 12px">
    <h1>Hello {{ me?.profile?.name }}</h1>
    <button @click="increment">Count: {{ me?.root?.counter || 0 }}</button>
    <input
      @change="me?.profile?.$jazz.set('name', $event.target?.value)"
      :value="me?.profile?.name || ''"
      placeholder="Name"
    />
    <button @click="logOut">Logout</button>
    <button @click="debug">Debug</button>
  </div>
</template>
