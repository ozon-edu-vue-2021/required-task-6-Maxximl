<script lang="jsx">
export default {
  name: "table-row",
  props: {
    row_data: {
      type: Object,
      default: () => {},
    },
  },
  render() {
    const {row_data, $style} = this;
    return (
      <div class={$style.table__row}>
        <div class={[$style.row, $style.row__id]}>{ row_data.id }</div>
        <div class={[$style.row, $style.row__name]}>{ row_data.postId }</div>
        <div class={[$style.row, $style.row__email]}>{row_data.email }</div>
        <div class={[$style.row, $style.row__body]}>{row_data.name.substring(0, 20)}</div>
      </div>
    )
  }
}; 
</script>

<style module>
.table__row {
  display: flex;
  justify-content: space-around;
}
.row {
  text-align: left;
  flex-basis: 25%;
  padding: 8px 16px;
}
</style>