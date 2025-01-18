<script lang="ts" setup>
const counter = ref(0);

const { data, status, refresh } = $useApi(
  async () => {
    const result = await api.base.get();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return result;
  },
  counter,
  { immediate: false },
);
</script>

<template>
  <div class="size-full flex flex-col justify-center items-center gap-4">
    <span>{{ data ?? "Click the button" }}</span>
    <span> status is: {{ status }}</span>
    <button
      class="bg-blue-400 rounded-xl cursor-pointer w-fit px-4 py-2"
      @click="counter++"
    >
      Refresh with a dependency: {{ counter }}
    </button>
    <button
      class="bg-blue-400 rounded-xl cursor-pointer w-fit px-4 py-2"
      @click="refresh"
    >
      Refresh with method
    </button>
  </div>
</template>

<style scoped></style>
