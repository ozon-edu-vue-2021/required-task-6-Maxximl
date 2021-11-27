<template>
  <RecycleScroller
    class="scroller"
    :items="rows"
    :item-size="32"
    key-field="id"
    :buffer="2000"
    page-mode
    v-slot="{ item }"
  >
    <div class="user">
      <table-row :row_data="item" />
    </div>
  </RecycleScroller>
</template>

<script>
import TableRow from "./table-row.vue";

export default {
  name: "infinity-scroll",
  components: {
    TableRow,
  },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
</style>