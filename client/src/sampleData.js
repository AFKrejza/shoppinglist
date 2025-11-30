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