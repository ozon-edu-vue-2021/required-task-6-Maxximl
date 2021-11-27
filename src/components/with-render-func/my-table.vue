<script lang="jsx">
import TableRow from "./table-row.vue";
import InfinityScroll from "./infinity-scroll";
import { orderBy } from "lodash/collection";

export default {
  name: "my-table",
  components: {
    TableRow,
    InfinityScroll
  },
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      usersPerPage: 10,
      currentPage: 1,
      sortProps: {},
      sortDirection: "",
      filterProps: {},
      filterText: "",
      isPagination: true,
      infScroll: false,
    };
  },
  computed: {
    pagesCount() {
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
    renderSettings() {
      return (
      <div class={this.$style.settings}>
        <a-checkbox checked={this.isPagination} on={{change: this.onChangePagination}}>
          Включить пагинацию
        </a-checkbox>
        <a-checkbox checked={this.infScroll} on={{change: this.onChangeInfScroll}}>
          Включить бесконечный скролл
        </a-checkbox>
      </div>
      )
    },
    renderSorting(h, prop){
      const {sortProps, $style} = this;
        if(sortProps[prop] && sortProps[prop] === 'asc') {
          return (
                <a-icon
                 type="sort-ascending"
                  on={{ click: () => this.handleSortingClick({ [prop]: '' })}} />)
        } else if(sortProps[prop] && sortProps[prop] === 'desc') {
          return (
              <a-icon
                type="sort-descending"
                on={{click: () => this.handleSortingClick({ [prop]: '' })}}
              />
          )
        } else {
          return (
                <span class={$style.sorting_unsorted}>
                  <a-icon
                      type="caret-up"
                      on={{click: () => this.handleSortingClick({ [prop]: 'asc' })}}
                      />
                  <a-icon
                      type="caret-down"
                      on={{click: () => this.handleSortingClick({ [prop]: 'desc' })}}
                    />
                 </span>
          )
        }
    },
    renderTableHeader(h) {
      const {$style} = this;
      const headerColumns = this.columns.map(({title, prop}) => {

        return (
          <p>
            {title}
            <span class={$style.sorting} >
            {this.renderSorting(h, prop)}
            </span>
            <span class={$style.filtering}>
              <a-input
                placeholder={`Введите ${title}`}
                on={{input: (e) => this.handleFilterInput(prop, e)}}
              />
            </span>
          </p>

      )
      })

      return (
        <div class={$style.table__header}>
           {...headerColumns}
        </div>
      )
      
    },
     renderTableBody() {
       if(this.infScroll && !this.isPagination) {
         return (
           <div class={this.$style.table__body}>
  <InfinityScroll rows={this.paginatedRows} />
           </div>
           
         )
       }
       const tableRows = this.paginatedRows.map(row => {
         return (
            <table-row
              key={row.id}
              row_data={row}
            />
         )
       })
       return(
         <div class={this.$style.table__body}>
            {...tableRows}
          </div>
       )
     },
     renderTablePagination() {
       const {$style, currentPage, isPagination, sortedRows, usersPerPage, pagesCount, handlePageClick } = this;
       const isVisible = isPagination && sortedRows.length > usersPerPage;
       if(!isVisible) {
         return null;
       }

       const paginationPages = [];
       for(let i = 1; i <= pagesCount; i++) {
         paginationPages.push(
            (
            <div
              class={[$style.page, currentPage === i ? $style.page_selected : ""] }
              key={i}
              on={{ click: () => handlePageClick(i) }}>
              { i }
            </div>
            ))
       }
       return (
         <div  class={$style.table__pagination} >
           {paginationPages}
         </div>
       )
     }
  },
  render(h) {
      return (
        <div class={this.$style.table}>
          {this.renderSettings(h)}
          {this.renderTableHeader(h)}
          {this.renderTableBody(h)}
          {this.renderTablePagination(h)}
        </div>
      )
    }
};
</script>

<style module>
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