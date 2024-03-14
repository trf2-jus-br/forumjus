import { useState, useEffect, useRef } from 'react';

const Autocomplete = ({ dataList, render, onclick }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);

    const handleChange = (e) => {
      setInputValue(e.target.value);

      if (inputValue === '') {
        setFilteredData([]);
        setActiveSuggestionIndex(-1);
      } else {
        const filtered = dataList.filter(item => {
          //render(item).toLowerCase().includes(inputValue.toLowerCase())
          return render(item).toLowerCase().includes(inputValue.toLowerCase())
        });
        setFilteredData(filtered);
        setActiveSuggestionIndex(-1);
      }
  };

  const handleKeyDown = (e) => {
    // Arrow down
    if (e.keyCode === 40) {
      if (activeSuggestionIndex + 1 < filteredData.length) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    }
    // Arrow up
    else if (e.keyCode === 38) {
      if (activeSuggestionIndex - 1 >= 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    }
    // Enter
    else if (e.keyCode === 13) {
      setInputValue(filteredData[activeSuggestionIndex]);
      setFilteredData([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleClick = (value) => {
    setInputValue(render(value));
    setFilteredData([]);
    setActiveSuggestionIndex(-1);
    inputRef.current.focus();
    onclick(value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder=""
      />
      <ul>
        {filteredData.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item)}
            style={{
              backgroundColor: index === activeSuggestionIndex ? '#bdc3c7' : 'transparent',
              cursor: 'pointer'
            }}
          >
            {render(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
