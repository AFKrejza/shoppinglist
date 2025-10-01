import './App.css';
import { list } from './sampledata';

function App() {
  return (
    <div className="App">
		<h className="header">Shopping List</h>
      <header className="List">
		<ListItems list={list}></ListItems>
      </header>
    </div>
  );
}

export default App;

function ListItems({ list }) {
	// const list2 = [1,2,3,4,5];
	const items = list.map(item => <li key={item}>{item.name}</li>);
	return (
		<div>{items}</div>
	);
}

/*
item schema:
name string
unit string
quantity int
purchased boolean
list = arr
*/

