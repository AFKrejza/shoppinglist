import "./App.css";
import { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Button, Form, Navbar, Table } from "react-bootstrap";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import "./i18n.js";
import {useTranslation} from "react-i18next";

import { api } from "./api";

function App() {

	const {t, i18n} = useTranslation();

	const [activeUser, setActiveUser] = useState(null);
	const [activeShoppingList, setActiveShoppingList] = useState();
	const [activeAllLists, setAllLists] = useState([]); // should only contain lists the user is allowed to view (backend: getPage)
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [showArchived, setShowArchived] = useState(false);
	// const [userList, setUserList] = useState([]); // for displaying member names
	const [members, setMembers] = useState([]);

	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authMode, setAuthMode] = useState("login");
	const [jwt, setJwt] = useState(null);

	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [newItemName, setNewItemName] = useState("");
	const [newItemQty, setNewItemQty] = useState(1);
	const [newItemUnit, setNewItemUnit] = useState("");

	const [showAddMemberModal, setShowAddMemberModal] = useState(false);
	const [newMemberId, setNewMemberId] = useState("");

	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || "light"
	);
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);


	useEffect(() => {
	const storedJwt = localStorage.getItem("jwt");
	if (storedJwt) {
		setJwt(storedJwt);
		loadUserProfile(storedJwt).catch(() => {});
		loadShoppingLists(storedJwt).catch(() => {});
	}
	}, []);

	useEffect(() => {
		if (!activeShoppingList || !jwt)
		{
			setMembers([]);
			return;
		}
		console.log("Fetching members for:", activeShoppingList.memberList);


		const fetchMembers = async () => {
			try {
				const membersData = await Promise.all(
					// activeShoppingList.memberList.forEach(id => console.log("Fetching user ID:", id)),
					activeShoppingList.memberList.map(async (id) => {
						console.log("Member ID: "+ id);
						try {
							return await api.users.findById(jwt, id);
						} catch (error) {
							console.warn(`Failed to get user ${id}`);
							return null;
						}
					}
				));
				setMembers(membersData.filter(Boolean));
				console.log("Members: ")
				console.log(membersData);
			} catch (err) {
				console.error("Failed to load members", err);
			}
		};

		fetchMembers();
	}, [activeShoppingList, jwt]);



  

  function ShoppingListTiles({ shoppingLists, onSelect, onCreate, onDelete, onArchiveToggle }) {
	return (
		<Row xs={1} sm={2} md={3} lg={4} className="g-4 p-3">
			<CreateList onClick={onCreate} />
			{shoppingLists.map(list => (
				<Col key={list._id}>
					<Card
						onClick={() => onSelect(list)}
						style={{ cursor: "pointer" }}
						className="h-100 shadow-sm"
						>
							{activeUser._id === list.ownerId && (
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
							<Card.Subtitle className="text-center">
								{list.itemList.length} {t("items")}
							</Card.Subtitle>
							<div>
								<strong>{t("members")}:</strong> {list.memberList.length}
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
					<h4>+ {t("newList")}</h4>
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
				<Form.Label>{t("email")}</Form.Label>
				<Form.Control type="email" placeholder="Enter email" />
			</Form.Group>
			<Form.Group className="mb-3"
			controlId="formBasicPassword">
				<Form.Label>{t("password")}</Form.Label>
				<Form.Control type="password" placeholder="Password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				{t("login")}
			</Button>
		</Form>
	)
}

function RegisterForm({ onSubmit }) {
	return (
		<Form onSubmit={onSubmit}>
			<Form.Group className= "mb-3" controlId="formBasicEmail">
				<Form.Label>{t("email")}</Form.Label>
				<Form.Control type="email" placeholder="Enter email" />
			</Form.Group>
			<Form.Group className= "mb-3" controlId="formBasicName">
				<Form.Label>{t("name")}</Form.Label>
				<Form.Control type="name" placeholder="Enter user name" />
			</Form.Group>
			<Form.Group className="mb-3"
			controlId="formBasicPassword">
				<Form.Label>{t("password")}</Form.Label>
				<Form.Control type="password" placeholder="Password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				{t("login")}
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
		<Navbar className="justify-content-end px-3">
			<Button
				variant="outline-secondary"
				className="me-2"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				>
				{theme === "light" ? "dark" : "light"}
			</Button>
				<Button
					variant="outline-secondary"
					className="me-2"
					onClick={() => {
						const next = i18n.language === "en" ? "cs" : "en";
						i18n.changeLanguage(next);
						localStorage.setItem("lang", next);
					}}
					>
					{i18n.language === "en" ? "🇨🇿 Česky" : "🇬🇧 English"}
				</Button>
  			{!activeUser && (
				<>
					<Button variant="outline-primary" onClick={openLogin} className="me-2">
						{t("login")}
					</Button>
					<Button variant="primary" onClick={openRegister}>
						{t("register")}
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
				{t("logout")}
				</Button>
			)}
		</Navbar>
      <div>{!activeUser }</div>
      <div>
        {activeUser && (
			<div>
			<button onClick={() => setShowArchived(!showArchived)}>{t("toggleArchived")}</button>
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
			console.log("shopping list id:", list._id);
		}}
		onCreate={() => setShowCreateModal(true)}
		onDelete={(list) => {
			const updated = activeAllLists.filter(
				(l) => l._id !== list._id
			);
			setAllLists(updated);
			if (activeShoppingList?._id === list._id) {
				setActiveShoppingList(null);
			}}
		}
			onArchiveToggle={(list) => {
				const updated = activeAllLists.map((l) => 
					l._id === list._id ? {...l, isArchived: !l.isArchived } : l
				);
				setAllLists(updated);
				if (activeShoppingList?._id === list._id) {
					setActiveShoppingList({...list, isArchived: !list.isArchived});
				}
			}}
	  />}</div>
      <div>
        {activeShoppingList && activeUser && (
          <DisplayShoppingList 
			shoppingList={activeShoppingList} 
			activeUser={activeUser} 
			jwt={jwt}
			setActiveShoppingList={setActiveShoppingList}
			setAllLists={setAllLists}
			setShowAddItemModal={setShowAddItemModal}
			members={members}
			setShowAddMemberModal={setShowAddMemberModal}
		  />
        )}
      </div>

	<Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
		<Modal.Header closeButton>
			<Modal.Title>{t("newList")}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form>
				<Form.Group>
					<Form.Label>{t("listName")}</Form.Label>
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
				{t("cancel")}
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
				{t("create")}
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
    <Modal.Title>{t("addItem")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>{t("itemName")}</Form.Label>
        <Form.Control
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Enter item name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t("quantity")}</Form.Label>
        <Form.Control
          type="number"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          min="1"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t("unit")}</Form.Label>
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
      {t("cancel")}
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
      {t("addItem")}
    </Button>
  </Modal.Footer>
</Modal>
	  {/* <Button variant="primary" size="sm" onClick={() => setShowAddMemberModal(true)}>
  + {t("addMember")}
</Button> */}

<Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>{t("addMember")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group>
      <Form.Label>{t("memberId")}</Form.Label>
      <Form.Control
        type="text"
        value={newMemberId}
        onChange={(e) => setNewMemberId(e.target.value)}
        placeholder="Paste member ID"
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>
      {t("cancel")}
    </Button>
    <Button
      variant="primary"
      onClick={async () => {
        if (!newMemberId.trim()) return;

        try {
        	const updatedList = await api.lists.updateShoppingList(jwt, activeShoppingList._id, {
        		memberList: [...activeShoppingList.memberList, newMemberId.trim()]
        	});

        	setActiveShoppingList(updatedList);
			setAllLists(prev =>
				prev.map(list => list._id === updatedList._id ? updatedList : list)
			);

        // refreshed members, i think it breaks stuff
        //   const membersData = await Promise.all(
        //     updatedList.memberList.map(id => api.users.findById(id))
        //   );
        //   setMembers(membersData);

          setNewMemberId("");
          setShowAddMemberModal(false);
        } catch (err) {
          console.error(err);
          alert("Failed to add member");
        }
      }}
    >
      {t("addMember")}
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

function DisplayShoppingList({ shoppingList, activeUser, jwt, setActiveShoppingList, setAllLists, setShowAddItemModal, members, setShowAddMemberModal }) {

	const {t, i18n} = useTranslation();

	// const [members, setMembers] = useState([]);
	console.log("memberList:", shoppingList.memberList);


	// useEffect(() => {
	// 	if (!shoppingList?.memberList?.length || !jwt)
	// 	{
	// 		setMembers([]);
	// 		return;
	// 	}

	// 	const fetchMembers = async () => {
	// 	try {
	// 		const membersData = await Promise.all(
	// 		shoppingList.memberList.map(async (id) => {
	// 			try {
	// 				return await api.users.findById(jwt, id);
	// 			} catch (error) {
	// 				console.warn(`Failed to fetch user ${id}`, error);
	// 			}
	// 		})
	// 		);
	// 		setMembers(membersData.filter(Boolean));
	// 	} catch (err) {
	// 		console.error("Failed to load members", err);
	// 	}
    // };

	// fetchMembers();
	// }, [shoppingList, jwt]);


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
		if (activeUser._id !== shoppingList.ownerId && activeUser._id !== memberId) return;

		try {
			const updatedList = await api.lists.removeMember(jwt, shoppingList._id, memberId);

			setActiveShoppingList(updatedList);
			setAllLists(prev =>
			prev.map(list => list._id === shoppingList._id ? updatedList : list)
			);
		} catch (err) {
			console.error(err);
			alert("Failed to remove member");
		}
	};

  // id to user objects for the bottom table
//   const members = shoppingList.memberList
//     .map(id => userList.find(u => u._id === id))
//     .filter(Boolean);

	const solvedCount = shoppingList.itemList.filter(item => item.ticked).length;
	const unsolvedCount = shoppingList.itemList.length - solvedCount;

	const pieData = [
		{ name: "Solved", value: solvedCount },
		{name: "Unsolved", value: unsolvedCount}
	];
	const COLORS = [
		"var(--chart-solved)",
		"var(--chart-unsolved)"
	];

	

  return (
    <>
      <h4>{shoppingList.name}</h4>
	<Button variant="primary" size="sm" onClick={() => setShowAddItemModal(true)}>
	+ {t("addItem")}
	</Button>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>{t("item")}</th>
            <th>{t("quantity")}</th>
            <th>{t("unit")}</th>
            <th>{t("status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.itemList.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                {t("noItems")}
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
                  {t("remove")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
		{shoppingList.itemList.length > 0 && (
	<Card className="mb-3 p-3">
		<h6 className="text-center">{t("listProgress")}</h6>
		<ResponsiveContainer width="100%" height={250}>
		<PieChart>
			<Pie
			data={pieData}
			cx="50%"
			cy="50%"
			innerRadius={60}
			outerRadius={90}
			paddingAngle={5}
			dataKey="value"
			label
			>
			{pieData.map((entry, index) => (
				<Cell
				key={`cell-${index}`}
				fill={COLORS[index % COLORS.length]}
				/>
			))}
			</Pie>
			<Tooltip
				contentStyle={{
					backgroundColor: "var(--bg-card)",
					borderColor: "var(--border)",
					color: "var(--text)"
				}}
			/>

			<Legend />
		</PieChart>
		</ResponsiveContainer>

		<div className="text-center mt-2">
		<strong>{solvedCount}</strong> {t("solved")} /{" "}
		<strong>{unsolvedCount}</strong> {t("unsolved")}
		</div>
	</Card>
	)}


		<h5>{t("members")}</h5>
		<Button variant="primary" size="sm" onClick={() => setShowAddMemberModal(true)}>
			+ {t("addMember")}
		</Button>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
			<th>{t("id")}</th>
            <th>{t("email")}</th>
            <th>{t("remove")}</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                {t("noMembers")}
              </td>
            </tr>
          )}
          {members.map(member => (
            <tr key={member._id}>
				<td>{member._id}</td>
              <td>{member.email}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={activeUser._id !== shoppingList.ownerId && activeUser._id !== member._id}
                >
                  {t("remove")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </>
  );
}

export default App;
