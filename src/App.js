import React from 'react';
import styled from 'styled-components';

const RangeHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledRange = styled.div`
  border-radius: 3px;
  background: #dddddd;
  margin: 5px;
  height: 15px;
`;

const StyledThumb = styled.div`
  width: 10px;
  height: 25px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.5;
  background: #823eb7;
  cursor: pointer;
`;

const getPercentage = (current, max) => (100 * current) / max;

const getValue = (percentage, max) => (max / 100) * percentage;

const getLeft = percentage => `calc(${percentage}% - 5px)`;

const Range = ({
  initial,
  max,
  formatFn = number => number.toFixed(0),
  onChange,
}) => {
  const initialPercentage = getPercentage(initial, max);

  const rangeRef = React.useRef();
  const thumbRef = React.useRef();
  const currentRef = React.useRef();

  const diff = React.useRef();

  const handleMouseMove = event => {
    let newX =
      event.clientX -
      diff.current -
      rangeRef.current.getBoundingClientRect().left;

    const end =
      rangeRef.current.offsetWidth - thumbRef.current.offsetWidth;

    const start = 0;

    if (newX < start) {
      newX = 0;
    }

    if (newX > end) {
      newX = end;
    }

    const newPercentage = getPercentage(newX, end);
    const newValue = getValue(newPercentage, max);

    thumbRef.current.style.left = getLeft(newPercentage);
    currentRef.current.textContent = formatFn(newValue);

    onChange(newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const handleMouseDown = event => {
    diff.current =
      event.clientX - thumbRef.current.getBoundingClientRect().left;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <RangeHeader>
        <strong ref={currentRef}>{formatFn(initial)}</strong>
        &nbsp;/&nbsp;
        {max}
      </RangeHeader>
      <StyledRange ref={rangeRef}>
        <StyledThumb
          style={{ left: getLeft(initialPercentage) }}
          ref={thumbRef}
          onMouseDown={handleMouseDown}
        />
      </StyledRange>
    </>
  );
};

const App = () => (
  <div>
    <Range
      initial={10}
      max={25}
      formatFn={number => number.toFixed(2)}
      onChange={value => console.log(value)}
    />
  </div>
);

export default App;
