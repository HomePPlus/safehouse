const DropDown = ({ options, placeholder, onSelect, renderOption }) => {
  // ... 기존 코드 유지 ...

  return (
    <div className="dropdown">
      {/* ... 기존 코드 유지 ... */}
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option.value)}
              className="dropdown-item"
            >
              {renderOption ? renderOption(option) : option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 