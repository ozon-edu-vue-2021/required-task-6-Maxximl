<template>
  <div class="table">
    <div class="settings">
      <a-checkbox :checked="isPagination" @change="onChangePagination">
        Включить пагинацию
      </a-checkbox>
      <a-checkbox :checked="infScroll" @change="onChangeInfScroll">
        Включить бесконечный скролл
      </a-checkbox>
    </div>
    <div class="table__header">
      <p v-for="column in columns" :key="column.prop">
        {{ column.title }}
        <span class="sorting">
          <a-icon
            v-if="sortProps[column.prop] && sortProps[column.prop] === 'asc'"
            type="sort-ascending"
            @click="handleSortingClick({ [column.prop]: '' })"
          />
          <a-icon
            v-else-if="
              sortProps[column.prop] && sortProps[column.prop] === 'desc'
            "
            type="sort-descending"
            @click="handleSortingClick({ [column.prop]: '' })"
          />
          <span v-else class="sorting_unsorted">
            <a-icon
              type="caret-up"
              @click="handleSortingClick({ [column.prop]: 'asc' })"
            />
            <a-icon
              type="caret-down"
              @click="handleSortingClick({ [column.prop]: 'desc' })"
            />
          </span>
        </span>
        <span class="filtering">
          <a-input
            :placeholder="`Введите ${column.title}`"
            @input="(e) => handleFilterInput(column.prop, e)"
          />
        </span>
      </p>
    </div>
    <div class="table__body">
      <RecycleScroller
        v-if="infScroll && !isPagination"
        class="scroller"
        :items="paginatedRows"
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
      <table-row
        v-else
        v-for="row in paginatedRows"
        :key="row.id"
        :row_data="row"
      />
    </div>
    <div
      v-if="isPagination && sortedRows.length > usersPerPage"
      class="table__pagination"
    >
      <div
        :class="{ page, page_selected: currentPage === page }"
        v-for="page in pages"
        :key="page"
        @click="handlePageClick(page)"
      >
        {{ page }}
      </div>
    </div>
  </div>
</template>

<script>
import TableRow from "./table-row.vue";
import { orderBy } from "lodash/collection";

export default {
  name: "my-table",
  components: {
    TableRow,
  },
  data: function () {
    return {
      usersPerPage: 10,
      currentPage: 1,
      sortProps: {},
      filterProps: {},
      filterText: "",
      isPagination: true,
      infScroll: false,
    };
  },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    pages() {
      return Math.ceil(this.sortedRows.length / 10);
    },
    paginatedRows() {
      if (!this.isPagination || this.sortedRows.length < this.usersPerPage) {
        return this.sortedRows;
      }
      let from = this.usersPerPage * (this.currentPage - 1);
      let to = from + this.usersPerPage;
      return this.sortedRows.slice(from, to);
    },
    sortedRows() {
      const sortProps = Object.keys(this.sortProps).filter(
        (prop) => this.sortProps[prop]
      );

      if (!sortProps.length) {
        return this.filteredRows;
      }

      return orderBy(
        this.filteredRows,
        sortProps,
        Object.values(this.sortProps)
      );
    },
    filteredRows() {
      if (!Object.values(this.filterProps).length) {
        return this.rows;
      }

      return this.rows.filter((row) => {
        let matched = true;
        for (const prop in this.filterProps) {
          const propText = this.filterProps[prop];
          if (
            propText &&
            !row[prop]
              .toString()
              .toLowerCase()
              .startsWith(propText.toLowerCase())
          ) {
            matched = false;
          }
        }
        return matched;
      });
    },
  },
  methods: {
    handlePageClick(page) {
      this.currentPage = page;
    },
    handleSortingClick(newProp) {
      this.sortProps = Object.assign({}, this.sortProps, newProp);
      this.currentPage = 1;
    },
    onChangePagination(e) {
      const newValue = e.target.checked;
      if (newValue) {
        this.infScroll = false;
      }
      this.isPagination = newValue;
    },
    onChangeInfScroll(e) {
      const newValue = e.target.checked;
      if (newValue) {
        this.isPagination = false;
      }
      this.infScroll = newValue;
    },
    handleFilterInput(prop, e) {
      this.filterProps = Object.assign({}, this.filterProps, {
        [prop]: e.target.value,
      });
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
.table {
  max-width: 1200px;
  margin: 0 auto;
}
.table__header {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #e7e7e7;
}

.table__header p {
  flex-basis: 25%;
  text-align: left;
  font-weight: bold;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.table__pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.page {
  padding: 8px;
  border: solid 1px #e7e7e7;
  cursor: pointer;
}

.page:hover {
  background-color: #b8b3b3;
}
.page_selected {
  background-color: #777171;
}

.sorting {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.settings {
  margin-bottom: 10px;
}

.sorting i {
  cursor: pointer;
  font-size: 18px;
}
.filtering {
  margin-left: 10px;
}

.sorting_unsorted {
  display: flex;
  flex-direction: column;
}

.sorting_unsorted i {
  font-size: 14px;
}
</style>