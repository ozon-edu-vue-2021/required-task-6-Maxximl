<template>
  <div id="app"><my-table :rows="rows" :columns="columns" /></div>
</template>

<script>
import MyTable from "./components/with-render-func/my-table.vue";
// import MyTable from "./components/with-template/my-table.vue";
export default {
  name: "App",
  components: {
    MyTable,
  },
  async created() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    this.rows = await res.json();
  },
  data() {
    return {
      rows: [],
      columns: [
        { prop: "id", title: "ID" },
        { prop: "postId", title: "Post ID" },
        { prop: "email", title: "Email" },
        { prop: "name", title: "Name" },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
