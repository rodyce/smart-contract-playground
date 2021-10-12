import React, { useState } from "react";

const SimpleCounter = () => {
  // Component State.
  const [counter, setCounter] = useState(0);

  // Event handlers. You may also use arrow functions.
  function handleIncrementCounter(event: React.MouseEvent<HTMLButtonElement>) {
    // This won't work: counter += 1
    setCounter(counter + 1);
  }

  return (
    <>
      <div>COUNTER VALUE</div>
      <div>
        <label>Value</label>
        <input readOnly={true} value={counter} />
      </div>
      <br />
      <div>
        <button type="button" onClick={handleIncrementCounter}>
          Increment Value
        </button>
      </div>
    </>
  );
};

export default SimpleCounter;
