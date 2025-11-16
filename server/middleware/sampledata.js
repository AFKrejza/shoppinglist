const JohnDoe = new User({
	name: "John Doe",
	email: "john.doe@gmail.com"
});

const List1 = new ShoppingList({
	ownerId: 1,
	name: "List 1",
	memberList: [],
	itemList: [
		new Item({
			name: "apples",
			quantity: 6,
			unit: "",
			ticked: false,
		}),
		new Item({
			name: "milk",
			quantity: 2,
			unit: "l",
			ticked: false,
		}),
	],
	isArchived: false
});