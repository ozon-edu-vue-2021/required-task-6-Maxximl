<template>
  <div class="table-row">
    <div class="row row__id">{{ row_data.id }}</div>
    <div class="row row__name">{{ row_data.postId }}</div>
    <div class="row row__email">{{ row_data.email }}</div>
    <div class="row row__body">{{ row_data.name.substring(0, 20) }}</div>
  </div>
</template>

<script>
export default {
  name: "table-row",
  props: {
    row_data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.table-row {
  display: flex;
  justify-content: space-around;
}
.row {
  text-align: left;
  flex-basis: 25%;
  padding: 8px 16px;
}
</style>