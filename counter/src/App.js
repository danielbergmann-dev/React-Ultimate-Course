import "./styles.css";
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const date = new Date();
  date.setDate(date.getDate() + count);

  return (
    <div>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <span>Count: {count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>

      <p></p>
      <span>{date.toDateString()}</span>
    </div>
  );
}

export default App;
