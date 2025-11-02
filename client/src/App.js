import "./App.css";
import { useState } from "react";

function App() {
  // sample data
  const userList = [
    {
      id: 1,
      name: "John",
      email: "john@gmail.com",
    },
    {
      id: 2,
      name: "Sam",
      email: "sam@gmail.com",
    },
    {
      id: 3,
      name: "Matthew",
      email: "matthew@gmail.com",
    },
  ];

  const shoppingListList = [
    {
      id: 1,
      ownerId: 1,
      name: "Groceries",
      isArchived: false,
      memberList: [1],
      itemList: [
        {
          id: 1,
          name: "apples",
          quantity: "2",
          unit: "kg",
          ticked: false,
        },
        {
          id: 2,
          name: "milk",
          quantity: "1",
          unit: "l",
          ticked: false,
        },
        {
          id: 3,
          name: "cheese",
          quantity: "5",
          unit: "", // empty string if no unit is specified
          ticked: false,
        },
        {
          id: 4,
          name: "beer",
          quantity: "30",
          unit: "",
          ticked: false,
        },
      ],
    },
    {
      id: 2,
      ownerId: 2,
      name: "Plants",
      isArchived: false,
      memberList: [1],
      itemList: [
        {
          id: 1,
          name: "Cactus",
          quantity: "1",
          unit: "",
          ticked: false,
        },
        {
          id: 2,
          name: "Orchid",
          quantity: "3",
          unit: "",
          ticked: false,
        },
        {
          id: 3,
          name: "Rose",
          quantity: "1",
          unit: "",
          ticked: false,
        },
      ],
    },
    {
      id: 3,
      ownerId: 1,
      name: "Plants",
      isArchived: false,
      memberList: [1],
      itemList: [
        {
          id: 1,
          name: "Cactus",
          quantity: "1",
          unit: "",
          ticked: false,
        },
        {
          id: 2,
          name: "Orchid",
          quantity: "3",
          unit: "",
          ticked: false,
        },
        {
          id: 3,
          name: "Rose",
          quantity: "1",
          unit: "",
          ticked: false,
        },
      ],
    },
  ];

  const [activeUser, setActiveUser] = useState(null);
  const [activeShoppingList, setActiveShoppingList] = useState(null);

  function DisplayShoppingList({ shoppingList }) {
    const listItems = shoppingList.itemList.map((item) => (
      <li key={item.id}>
        {item.name} - {item.quantity} {item.unit} {item.ticked}
      </li>
    ));
    return listItems;
  }

  function DisplayUserShoppingLists({ user }) {
    let shoppingLists = shoppingListList.filter(
      (shoppingList) => shoppingList.ownerId == user.id
    );
    shoppingLists = shoppingLists.map((shoppingList) => (
      <li key={shoppingList.id}>
        <button
          onClick={() => {
            setActiveShoppingList(shoppingList);
            console.log(`shopping list id: ${shoppingList.id}`);
          }}
        >
          {shoppingList.name}
        </button>
      </li>
    ));
    return shoppingLists;
  }

  const listUsers = userList.map((user) => (
    <li key={user.id}>
      <button
        onClick={() => {
          setActiveUser(user);
		  setActiveShoppingList(null);
          console.log(user.id);
        }}
      >
        Log in
      </button>
      {user.name} | {user.email}
    </li>
  ));

  return (
    <div className="App">
      <ul>{listUsers}</ul>
      <div>{activeUser && <DisplayUserShoppingLists user={activeUser} />}</div>
      <div>
        {activeShoppingList && (
          <DisplayShoppingList shoppingList={activeShoppingList} />
        )}
      </div>
    </div>
  );
}

export default App;
