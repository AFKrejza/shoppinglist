import i18n from "i18next";
import { initReactI18next} from "react-i18next";

const resources = {
	en: {
		translation: {
			login: "Login",
			logout: "Log out",
			signup: "Sign up",
			name: "Name",
			addItem: "Add item",
			itemName: "Item name",
			remove: "Remove",
			quantity: "Quantity",
			unit: "Unit",
			status: "Status",
			items: "Items",
			noItems: "No items yet",
			members: "Members",
			addMember: "Add member",
			noMembers: "No members",
			listProgress: "List Progress",
			solved: "Solved",
			unsolved: "Unsolved",
			toggleArchived: "Toggle Archived",
			newList: "New List",
			create: "Create",
			cancel: "Cancel",
			dark: "Dark",
			light: "Light",
			listName: "List name"
		}
	},
	cs: {
		translation: {
			login: "Prihlasit",
			logout: "Odhlasit",
			signup: "Nova registrace",
			name: "Jmeno",
			addItem: "Pridat polozku",
			itemName: "Jmeno polozky",
			remove: "Odstranit",
			quantity: "Mnozstvi",
			unit: "Jednotka",
			status: "Stav",
			items: "Polozky",
			noItems: "Zadne polozky",
			members: "Clenove",
			addMember: "Pridat clena",
			noMembers: "Zadni clenove",
			listProgress: "Prubeh seznamu",
			solved: "Hotovy",
			unsolved: "Nehotovy",
			toggleArchived: "Zobrazit archiv",
			newList: "Novy seznam",
			create: "Vytvorit",
			cancel: "Zrusit",
			dark: "Tmavy",
			light: "Svetly",
			listName: "Jmeno seznamu"
		}
	}
};

i18n.use(initReactI18next).init({resources,
	lng: localStorage.getItem("lang") || "en",
	fallbackLng: "en",
	interpolation: {
		esapeValue: false
	}
});

export default i18n;