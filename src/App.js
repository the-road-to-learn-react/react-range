import React from 'react';
import styled from 'styled-components';

const RangeHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledRange = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 15px;
`;

const StyledRangeProgress = styled.div`
  border-radius: 3px;
  position: absolute;
  height: 100%;
  opacity: 0.5;
  background: #823eb7;
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

const getPercentage = (current, min, max) =>
  ((current - min) / (max - min)) * 100;

const getValue = (percentage, min, max) =>
  ((max - min) / 100) * percentage + min;

const getLeft = percentage => `calc(${percentage}% - 5px)`;

const getWidth = percentage => `${percentage}%`;

const Range = ({
  initial,
  min = 0,
  max,
  formatFn = number => number.toFixed(0),
  onChange,
}) => {
  const initialPercentage = getPercentage(initial, min, max);

  const rangeRef = React.useRef();
  const rangeProgressRef = React.useRef();
  const thumbRef = React.useRef();
  const currentRef = React.useRef();

  const diff = React.useRef();

  const handleUpdate = React.useCallback(
    (value, percentage) => {
      thumbRef.current.style.left = getLeft(percentage);
      rangeProgressRef.current.style.width = getWidth(percentage);
      currentRef.current.textContent = formatFn(value);
    },
    [formatFn]
  );

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

    const newPercentage = getPercentage(newX, start, end);
    const newValue = getValue(newPercentage, min, max);

    handleUpdate(newValue, newPercentage);

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

  React.useLayoutEffect(() => {
    handleUpdate(initial, initialPercentage);
  }, [initial, initialPercentage, handleUpdate]);

  return (
    <>
      <RangeHeader>
        <div>{formatFn(min)}</div>
        <div>
          <strong ref={currentRef} />
          &nbsp;/&nbsp;
          {formatFn(max)}
        </div>
      </RangeHeader>
      <StyledRange ref={rangeRef}>
        <StyledRangeProgress ref={rangeProgressRef} />
        <StyledThumb ref={thumbRef} onMouseDown={handleMouseDown} />
      </StyledRange>
    </>
  );
};

const App = () => (
  <div>
    <Range
      initial={10}
      min={5}
      max={25}
      formatFn={number => number.toFixed(2)}
      onChange={value => console.log(value)}
    />
  </div>
);

export default App;
