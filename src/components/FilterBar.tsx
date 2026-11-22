type FilterBarProps = {
  search: string;
  onSearchChange: (next: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  upcomingOnly: boolean;
  onUpcomingOnlyChange: (next: boolean) => void;
};

export const FilterBar = ({
  search,
  onSearchChange,
  tags,
  selectedTags,
  onTagToggle,
  onClearTags,
  upcomingOnly,
  onUpcomingOnlyChange,
}: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Otsi sündmust"
      />

      <label className="toggle">
        <input
          type="checkbox"
          checked={upcomingOnly}
          onChange={(e) => onUpcomingOnlyChange(e.target.checked)}
        />
        Ainult tulevased
      </label>

      <div className="tags">
        <button
          className={selectedTags.length === 0 ? "is-selected" : ""}
          onClick={onClearTags}
        >
          Kõik
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            className={selectedTags.includes(tag) ? "is-selected" : ""}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};