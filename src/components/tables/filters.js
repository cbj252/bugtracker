function GlobalFilter({ filter, setGlobalFilter }) {
  return (
    <span>
      Search:
      <input
        value={filter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
        }}
      />
    </span>
  );
}

function ColumnFilter({ column }) {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      />
    </span>
  );
}

export { GlobalFilter, ColumnFilter };
