import "./App.css";
import { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Button, Form, Navbar, Container, Table } from "react-bootstrap";

// TODO: comment out either one for real or mock data.
// import { api } from "./api";
import { api } from "./api";

function App() {

  const [activeUser, setActiveUser] = useState(null);
  const [activeShoppingList, setActiveShoppingList] = useState();
  const [activeAllLists, setAllLists] = useState([]); // should only contain lists the user is allowed to view (backend: getPage)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [userList, setUserList] = useState([]); // for displaying member names

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [jwt, setJwt] = useState(null);

	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [newItemName, setNewItemName] = useState("");
	const [newItemQty, setNewItemQty] = useState(1);
	const [newItemUnit, setNewItemUnit] = useState("");


useEffect(() => {
  const storedJwt = localStorage.getItem("jwt");
  if (storedJwt) {
    setJwt(storedJwt);
    loadUserProfile(storedJwt).catch(() => {});
    loadShoppingLists(storedJwt).catch(() => {});
  }
}, []);

  function DisplayShoppingList({ shoppingList, activeUser }) {

	const handleRemoveItem = async (itemId) => {
		try {
			const res = await api.lists.removeItem(jwt, shoppingList._id, itemId)
			console.log(itemId);
			const updatedList = res || {
				...shoppingList,
				itemList: shoppingList.itemList.filter(item => item._id !== itemId)
			}
			setActiveShoppingList(updatedList);
			setAllLists(prev =>
			prev.map(list => list._id === shoppingList._id ? updatedList : list)
			);
		} catch (err) {
			console.error(err);
			alert("Failed to remove item");
		}
	};

	const handleToggleItem = async (itemId) => {
  try {
    const updatedList = await api.lists.updateItem(jwt, shoppingList._id, {
      itemList: shoppingList.itemList.map(item =>
        item._id === itemId ? { ...item, ticked: !item.ticked } : item
      )
    });

    setActiveShoppingList(updatedList);
    setAllLists(prev =>
      prev.map(list => list._id === shoppingList._id ? updatedList : list)
    );
  } catch (err) {
    console.error(err);
    alert("Failed to update item status");
  }
};
  

  	// owner or member themselves
	const handleRemoveMember = async (memberId) => {
		if (activeUser.id !== shoppingList.ownerId && activeUser.id !== memberId) return;

		try {
			const updatedList = await api.lists.removeMember(jwt, shoppingList.id, memberId);

			setActiveShoppingList(updatedList);
			setAllLists(prev =>
			prev.map(list => list.id === shoppingList.id ? updatedList : list)
			);
		} catch (err) {
			console.error(err);
			alert("Failed to remove member");
		}
	};

  // id to user objects for the bottom table
  const members = shoppingList.memberList
    .map(id => userList.find(u => u._id === id))
    .filter(Boolean);

  return (
    <>
      <h4>{shoppingList.name}</h4>
<Button variant="primary" size="sm" onClick={() => setShowAddItemModal(true)}>
  + Add Item
</Button>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.itemList.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No items yet
              </td>
            </tr>
          )}

          {shoppingList.itemList.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td className="text-center">
				<Form.Check
					type="checkbox"
					checked={item.ticked}
					onChange={() => handleToggleItem(item._id)}
				/>
				</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

		  <h5>Members</h5>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No members
              </td>
            </tr>
          )}
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={activeUser._id !== shoppingList.ownerId && activeUser._id !== member._id}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </>
  );
}

  // issue here with the member list
//   const listUsers = activeShoppingList.userList.map((user) => (
//     <li key={user.id}>
//       <button
//         onClick={() => {
//           setActiveUser(user);
//           setActiveShoppingList(null);
//           console.log(user.id);
//         }}
//       >
//         Log in
//       </button>
//       {user.name} | {user.email}
//     </li>
//   ));

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

function LoginForm({ onSubmit }) {
	return (
		<Form onSubmit={(e) => {
			e.preventDefault();
			const email = e.target.formBasicEmail.value;
			const password = e.target.formBasicPassword.value;
			onSubmit(e, email, password);
		}}>
			<Form.Group className= "mb-3" controlId="formBasicEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" />
			</Form.Group>
			<Form.Group className="mb-3"
			controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				Log in
			</Button>
		</Form>
	)
}

function RegisterForm({ onSubmit }) {
	return (
		<Form onSubmit={onSubmit}>
			<Form.Group className= "mb-3" controlId="formBasicEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" />
			</Form.Group>
			<Form.Group className= "mb-3" controlId="formBasicName">
				<Form.Label>User Name</Form.Label>
				<Form.Control type="name" placeholder="Enter user name" />
			</Form.Group>
			<Form.Group className="mb-3"
			controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				Log in
			</Button>
		</Form>
	)
}

  function openLogin() {
	setAuthMode("login");
	setShowAuthModal(true);
  }

  function openRegister() {
	setAuthMode("register");
	setShowAuthModal(true);
  }

  async function handleLogin(event, email, password) {
	event.preventDefault();

	try {
		const res = await api.auth.login(email, password);
		const jwt = res.token;
		setJwt(jwt);
		localStorage.setItem("jwt", jwt);
		console.log(`JWT: ${jwt}`);
		await loadUserProfile(jwt);
		await loadShoppingLists(jwt);
		setShowAuthModal(false);
	} catch (error) {
		alert("Login failed");
	}
  }

	async function loadShoppingLists(jwt) {
		if (!jwt) return;
		const lists = await api.lists.getPage(jwt, 1, 10);
		console.log(lists[0]);
		setAllLists(lists);
  }

  async function loadUserProfile(jwt) {
	if (!jwt) return;
	const profile = await api.auth.profile(jwt);
	setActiveUser(profile);
  }

  function handleRegister(event) {
	event.preventDefault();

	// TODO: call server here
	console.log("Register submit");

	// TODO: mock this server call properly
	// const user = userList[0];
	// setActiveUser(user);
	setShowAuthModal(false);
  }


  return (
    <div className="App">
		<Navbar bg="light" className="justify-content-end px-3">
  			{!activeUser && (
				<>
					<Button variant="outline-primary" onClick={openLogin} className="me-2">
						Login
					</Button>
					<Button variant="primary" onClick={openRegister}>
						Sign Up
					</Button>
				</>
  			)}
			{activeUser && (
				<Button variant="danger" onClick={() => {
					setActiveUser(null);
					setJwt(null);
					setAllLists([]);
					setActiveShoppingList(null);
					localStorage.removeItem("jwt");
				}}>
				Log Out
				</Button>
			)}
		</Navbar>
      <div>{!activeUser }</div>
      <div>
        {activeUser && (
			<div>
			<button onClick={() => setShowArchived(!showArchived)}>Toggle Archived</button>
        	<button onClick={() => setActiveUser(null)}>Log out</button>
		  </div>
        )}
      </div>
      <div>{activeUser && <ShoppingListTiles
	  // activeAllLists is already filtered to
	  // what the user is allowed to see
	 	shoppingLists={activeAllLists
		.filter(shoppingList => shoppingList && (showArchived ? true : !shoppingList.isArchived))
	}
		onSelect={(list) => {
			setActiveShoppingList(list);
			console.log("shopping list id:", list.id);
		}}
		onCreate={() => setShowCreateModal(true)}
		onDelete={(list) => {
			const updated = activeAllLists.filter(
				(l) => l.id !== list.id
			);
			setAllLists(updated);
			if (activeShoppingList?.id === list.id) {
				setActiveShoppingList(null);
			}}
		}
			onArchiveToggle={(list) => {
				const updated = activeAllLists.map((l) => 
					l.id === list.id ? {...l, isArchived: !l.isArchived } : l
				);
				setAllLists(updated);
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
				onClick={async () => {
					if (!newListName.trim()) return;

					try {
					// Call backend to create new shopping list
					const savedList = await api.lists.addShoppingList(jwt, newListName);

					// Update frontend state
					setAllLists(prev => [...prev, savedList]);
					setActiveShoppingList(savedList);

					// Clear input & close modal
					setNewListName("");
					setShowCreateModal(false);
					} catch (err) {
					console.error(err);
					alert("Failed to create shopping list. Please try again.");
					}
				}}
				>
				Create
			</Button>
		</Modal.Footer>
	</Modal>

	<Modal show={showAuthModal} onHide={() => setShowAuthModal(false)}>
  		<Modal.Header closeButton>
    		<Modal.Title>
    			{authMode === "login" ? "Log In" : "Sign Up"}
    		</Modal.Title>
  		</Modal.Header>
  <Modal.Body>
    {authMode === "login" ? (
      <LoginForm onSubmit={handleLogin} />
    ) : (
      <RegisterForm onSubmit={handleRegister} />
    )}
  </Modal.Body>
</Modal>
<Modal show={showAddItemModal} onHide={() => setShowAddItemModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add Item</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Item Name</Form.Label>
        <Form.Control
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Enter item name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          min="1"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Unit</Form.Label>
        <Form.Control
          type="text"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
          placeholder="e.g. pcs, kg, liters"
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddItemModal(false)}>
      Cancel
    </Button>
    <Button
      variant="primary"
      onClick={async () => {
        if (!newItemName.trim()) return;

        try {
          // send new item to backend
          const updatedList = await api.lists.updateItem(jwt, activeShoppingList._id, {
            itemList: [
              ...activeShoppingList.itemList,
              { name: newItemName, quantity: newItemQty, unit: newItemUnit, ticked: false }
            ]
          });

          setActiveShoppingList(updatedList);
          setAllLists(prev =>
            prev.map(list => list._id === activeShoppingList._id ? updatedList : list)
          );

          // clear input & close modal
          setNewItemName("");
          setNewItemQty(1);
          setNewItemUnit("");
          setShowAddItemModal(false);
        } catch (err) {
          console.error(err);
          alert("Failed to add item");
        }
      }}
    >
      Add Item
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}

export default App;
