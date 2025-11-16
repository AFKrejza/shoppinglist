import "./App.css";
import { useState } from "react";
import { Card, Row, Col, Modal, Button, Form } from "react-bootstrap";

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
      memberList: [3],
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
	{
      id: 4,
      ownerId: 1,
      name: "testarchived",
      isArchived: true,
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
    }
  ];

  const [activeUser, setActiveUser] = useState(null);
  const [activeShoppingList, setActiveShoppingList] = useState(null);
  const [activeShoppingListList, setShoppingListList] = useState(shoppingListList);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  function DisplayShoppingList({ shoppingList }) {
    const listItems = shoppingList.itemList.map((item) => (
      <li key={item.id}>
        {item.name} - {item.quantity} {item.unit} {item.ticked} <button onClick={() => {
			item.ticked = true;
			const updatedShoppingList = {
				...shoppingList,
				itemList: shoppingList.itemList.filter((items) => items !== item)
			};

			setActiveShoppingList(updatedShoppingList);
			const updatedListList = [...shoppingListList.filter((list) => list.id !== shoppingList.id), updatedShoppingList];
			setShoppingListList(updatedListList);
			}}>Remove</button>
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

  function ShoppingListTiles({ shoppingLists, onSelect, onCreate, onDelete, onArchiveToggle }) {
	return (
		<Row xs={1} sm={2} md={3} lg={4} className="g-4 p-3">
			<CreateList onClick={onCreate} />
			{shoppingLists.map(list => (
				<Col key={list.id}>
					<Card
						onClick={() => onSelect(list)}
						style={{ cursor: "pointer" }}
						className="h-100 shadow-sm"
						>
							{activeUser.id === list.ownerId && (
								<div className="position-absolute bottom-0 end-0 m-2 d-flex gap-2">
								<Button
									variant="danger"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										onDelete(list);
									}}>Delete</Button>
								<Button
									variant={list.isArchived ? "success" : "warning"}
									size="sm"
									onClick={() => {
										onArchiveToggle(list)
									}}>
										{list.isArchived ? "Unarchive" : "Archive"}
										</Button>
								</div>
							)}
						<Card.Body>
							<Card.Title>{list.name}</Card.Title>
							<Card.Subtitle className="text-muted mb-2">
								{list.itemList.length} items
							</Card.Subtitle>
							<div>
								<strong>Members:</strong> {list.memberList.length}
							</div>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	);
}

function CreateList({ onClick }) {
	return (
		<Col>
		<Card
			className="h-11 shadow-sm d-flex justify-content-center align-items-center text-center"
			style={{ cursor: "pointer", minHeight: "150px"}}
			onClick={onClick}
			>
				<Card.Body>
					<h4>+ New List</h4>
				</Card.Body>
			</Card>
		</Col>
	);
}

  return (
    <div className="App">
      <div>{!activeUser && listUsers}</div>
      <div>
        {activeUser && (
			<div>
			<button onClick={() => setShowArchived(!showArchived)}>Toggle Archived</button>
        	<button onClick={() => setActiveUser(null)}>Log out</button>
		  </div>
        )}
      </div>
      <div>{activeUser && <ShoppingListTiles
	 	shoppingLists={activeShoppingListList
		.filter(
			(shoppingList) =>
				shoppingList.ownerId === activeUser.id ||
			shoppingList.memberList.includes(activeUser.id)
		)
		.filter(shoppingList => showArchived ? true : !shoppingList.isArchived)	
	}
		onSelect={(list) => {
			setActiveShoppingList(list);
			console.log("shopping list id:", list.id);
		}}
		onCreate={() => setShowCreateModal(true)}
		onDelete={(list) => {
			const updated = activeShoppingListList.filter(
				(l) => l.id !== list.id
			);
			setShoppingListList(updated);
			if (activeShoppingList?.id === list.id) {
				setActiveShoppingList(null);
			}}
		}
			onArchiveToggle={(list) => {
				const updated = activeShoppingListList.map((l) => 
					l.id === list.id ? {...l, isArchived: !l.isArchived } : l
				);
				setShoppingListList(updated);
				if (activeShoppingList?.id === list.id) {
					setActiveShoppingList({...list, isArchived: !list.isArchived});
				}
			}}
	  />}</div>
      <div>
        {activeShoppingList && activeUser && (
          <DisplayShoppingList shoppingList={activeShoppingList} />
        )}
      </div>

	<Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
		<Modal.Header closeButton>
			<Modal.Title>Create New Shopping List</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form>
				<Form.Group>
					<Form.Label>List Name</Form.Label>
					<Form.Control
					type="text"
					placeholder="Enter list name"
					value={newListName}
					onChange={(e) => setNewListName(e.target.value)}
					/>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="secondary" onClick={() => setShowCreateModal(false)}>
				Cancel
			</Button>
			<Button
			variant="primary"
			onClick={() => {
				if (!newListName.trim()) return;
				const newList = {
					id: Math.max(...activeShoppingListList.map(l => l.id)) + 1,
					ownerId: activeUser.id,
					name: newListName,
					isArchived: false,
					memberList: [activeUser.id],
					itemList: []
				};
				setShoppingListList([...activeShoppingListList, newList]);
				setNewListName("");
				setShowCreateModal(false);
			}}
			>Create</Button>
		</Modal.Footer>
	</Modal>
    </div>
  );
}

export default App;
