import './FilterBar.css';

const FilterBar = ({ activeFilters, onFilterChange }) => {
  const tagFilters = [
    { value: null, label: 'All' },
    { value: 'wings', label: 'Wings' },
    { value: 'oysters', label: 'Oysters' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'meal_specials', label: 'Meal Specials' },
  ];

  const getDayFilters = () => {
    const filters = [];
    const today = new Date();

    // Today
    filters.push({
      value: today.getDay(),
      label: 'Today',
      date: null,
    });

    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    filters.push({
      value: tomorrow.getDay(),
      label: 'Tomorrow',
      date: null,
    });

    // Next 5 days
    for (let i = 2; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      filters.push({
        value: date.getDay(),
        label: dayName,
        date: null,
      });
    }

    return filters;
  };

  const dayFilters = getDayFilters();

  const handleTagClick = (tag) => {
    onFilterChange({ ...activeFilters, tag });
  };

  const handleDayClick = (day) => {
    onFilterChange({ ...activeFilters, day });
  };

  const clearFilters = () => {
    onFilterChange({ tag: null, day: undefined });
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <h3>Category</h3>
        <div className="filter-chips">
          {tagFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => handleTagClick(filter.value)}
              className={`filter-chip ${
                activeFilters.tag === filter.value ? 'active' : ''
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Day</h3>
        <div className="filter-chips">
          {dayFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(filter.value)}
              className={`filter-chip ${
                activeFilters.day === filter.value ? 'active' : ''
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {(activeFilters.tag || activeFilters.day !== undefined) && (
        <button onClick={clearFilters} className="clear-filters">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
