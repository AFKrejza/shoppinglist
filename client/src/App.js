import "./App.css";
import { useState } from "react";
import { Card, Row, Col, Modal, Button, Form, Navbar, Container } from "react-bootstrap";

// TODO: comment out either one for real or mock data.
// import { api } from "./api";
import { api } from "./mockApi";

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

  function DisplayShoppingList({ shoppingList, allLists, activeUser }) {
    const listItems = shoppingList.itemList.map((item) => (
      <li key={item.id}>
        {item.name} - {item.quantity} {item.unit} {item.ticked} <button onClick={() => {
			item.ticked = true;
			const updatedShoppingList = {
				...shoppingList,
				itemList: shoppingList.itemList.filter((items) => items !== item)
			};

			setActiveShoppingList(updatedShoppingList);
			const updatedListList = [...activeAllLists.filter((list) => list.id !== shoppingList.id), updatedShoppingList];
			setAllLists(updatedListList);
			}}>Remove</button>
      </li>
    ));
	const listMemberIds = new Set(shoppingList.memberList);
	let listMembers = activeShoppingList.memberList.filter(
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

					const updatedListList = [...activeAllLists.filter((list) => list.id !== shoppingList.id), updatedList];
					setAllLists(updatedListList);
				}
			}}>Remove</button>
			{user.name}
		</li>
	));
    return [listItems, listMembers];
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
		console.log(`JWT: ${jwt}`);
		await loadUserProfile(jwt);
		await loadShoppingLists(jwt);
		setShowAuthModal(false);
	} catch (error) {
		alert("Login failed");
	}
  }

	async function loadShoppingLists(jwt) {
		const lists = await api.lists.getPage(jwt, 1, 10);
		console.log(lists[0]);
		setAllLists(lists);
  }

  async function loadUserProfile(jwt) {
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
				<Button variant="danger" onClick={() => setActiveUser(null)}>
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
		.filter(shoppingList => showArchived ? true : !shoppingList.isArchived)	
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
			onClick={() => {
				if (!newListName.trim()) return;
				const newList = {
					id: Math.max(...activeAllLists.map(l => l.id)) + 1,
					ownerId: activeUser.id,
					name: newListName,
					isArchived: false,
					memberList: [activeUser.id],
					itemList: []
				};
				setAllLists([...activeAllLists, newList]);
				setNewListName("");
				setShowCreateModal(false);
			}}
			>Create</Button>
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
    </div>
  );
}

export default App;
