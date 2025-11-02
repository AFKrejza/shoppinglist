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
      memberList: [1,2,3],
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
      memberList: [2],
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
      memberList: [1,3],
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

  // apologies for not finishing everything, I forgot to scroll down to the Evaluation Rules

  const [activeUser, setActiveUser] = useState(null);
  const [activeShoppingList, setActiveShoppingList] = useState(null);
  const [activeShoppingListList, setShoppingListList] = useState(shoppingListList);

  function DisplayShoppingList({ shoppingList }) {
    const listItems = shoppingList.itemList.map((item) => (
      <li key={item.id}>
        {item.name} - {item.quantity} {item.unit} {item.ticked}
      </li>
    ));
	const listMemberIds = new Set(shoppingList.memberList);
	let listMembers = userList.filter(
		(user) => listMemberIds.has(user.id)
	);
	listMembers = listMembers.map((user) => (
		<li key={user.id}>
			<button onClick={() => {
				if (activeUser.id === activeShoppingList.ownerId || activeUser.id === user.id) {
					const updatedList = {
						...shoppingList,
						memberList: shoppingList.memberList.filter((id) => id !== user.id)
					};
					setActiveShoppingList(updatedList);

					const updatedListList = [...shoppingListList.filter((list) => list.id !== shoppingList.id), updatedList];
					setShoppingListList(updatedListList);
				}
			}}>Remove</button>
			{user.name}
		</li>
	));
    return [listItems, listMembers];
  }

  function DisplayUserShoppingLists({ user }) {
    let shoppingLists = activeShoppingListList.filter(
      (shoppingList) => shoppingList.ownerId === user.id
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
      <div>{!activeUser && listUsers}</div>
      <div>
        {activeUser && (
          <button onClick={() => setActiveUser(null)}>Log out</button>
        )}
      </div>
      <div>{activeUser && <DisplayUserShoppingLists user={activeUser} />}</div>
      <div>
        {activeShoppingList && activeUser && (
          <DisplayShoppingList shoppingList={activeShoppingList} />
        )}
      </div>
    </div>
  );
}

export default App;
