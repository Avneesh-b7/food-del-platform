import img1 from "./1-img.jpg";
import img2 from "./2-img.jpg";
import img3 from "./3-img.jpg";
import img4 from "./4-img.jpg";
import img5 from "./5-img.jpg";
import img6 from "./6-men.jpg";
import img7 from "./7-img.jpg";
import img8 from "./8-img.jpg";
import img9 from "./9-img.jpg";
import img10 from "./10-img.jpg";

const menu_list = [
  {
    name: "Desserts",
    img: img1,
  },
  {
    name: "Appetizers",
    img: img2,
  },
  {
    name: "Cocktails",
    img: img3,
  },
  {
    name: "Main Course",
    img: img4,
  },
  {
    name: "Mocktails",
    img: img5,
  },
  {
    name: "Salads",
    img: img6,
  },
];

const fooditems_list = [
  // Salads
  {
    _id: "1",
    name: "Greek Salad",
    image: img1,
    price: 120,
    description: "Fresh lettuce, olives, feta cheese, and vinaigrette.",
    category: "Salads",
  },
  {
    _id: "2",
    name: "Caesar Salad",
    image: img5,
    price: 130,
    description:
      "Crisp romaine, parmesan, croutons, and creamy Caesar dressing.",
    category: "Salads",
  },
  {
    _id: "3",
    name: "Green Detox Bowl",
    image: img3,
    price: 140,
    description: "Spinach, kale, cucumbers, and avocado for pure goodness.",
    category: "Salads",
  },

  // Appetizers
  {
    _id: "4",
    name: "Garlic Bread",
    image: img2,
    price: 90,
    description: "Freshly toasted baguette with garlic butter.",
    category: "Appetizers",
  },
  {
    _id: "5",
    name: "Stuffed Mushrooms",
    image: img8,
    price: 150,
    description: "Cream cheese stuffed mushrooms topped with herbs.",
    category: "Appetizers",
  },
  {
    _id: "6",
    name: "Cheese Nachos",
    image: img9,
    price: 160,
    description: "Corn nachos with melted cheese and salsa.",
    category: "Appetizers",
  },

  // Desserts
  {
    _id: "7",
    name: "Chocolate Brownie",
    image: img4,
    price: 180,
    description: "Warm gooey brownie topped with cocoa drizzle.",
    category: "Desserts",
  },
  {
    _id: "8",
    name: "Strawberry Cheesecake",
    image: img7,
    price: 200,
    description: "Creamy cheesecake with strawberry puree.",
    category: "Desserts",
  },
  {
    _id: "9",
    name: "Vanilla Ice Cream Scoop",
    image: img10,
    price: 140,
    description: "Classic vanilla served chilled.",
    category: "Desserts",
  },

  // Main Course
  {
    _id: "10",
    name: "Paneer Butter Masala",
    image: img9,
    price: 260,
    description: "Creamy tomato-based gravy served with soft paneer.",
    category: "Main Course",
  },
  {
    _id: "11",
    name: "Veg Alfredo Pasta",
    image: img3,
    price: 240,
    description: "Creamy pasta topped with fresh herbs and veggies.",
    category: "Main Course",
  },
  {
    _id: "12",
    name: "Cheese Margherita Pizza",
    image: img4,
    price: 280,
    description: "Thin crust pizza topped with cheese & basil.",
    category: "Main Course",
  },

  // Cocktails
  {
    _id: "13",
    name: "Classic Mojito Cocktail",
    image: img6,
    price: 300,
    description: "Mint, lemon, sugar and white rum shaken to perfection.",
    category: "Cocktails",
  },
  {
    _id: "14",
    name: "Margarita Cocktail",
    image: img8,
    price: 320,
    description: "Refreshing blend of tequila, lime and salt rim.",
    category: "Cocktails",
  },
  {
    _id: "15",
    name: "Orange Punch Cocktail",
    image: img2,
    price: 310,
    description: "Tangy orange blend with ice and a citrus twist.",
    category: "Cocktails",
  },

  // Mocktails
  {
    _id: "16",
    name: "Virgin Mojito",
    image: img1,
    price: 180,
    description: "Mint, lime, sugar syrup topped with soda.",
    category: "Mocktails",
  },
  {
    _id: "17",
    name: "Blue Lagoon Mocktail",
    image: img3,
    price: 200,
    description: "Blue curacao syrup mixed with sweet soda.",
    category: "Mocktails",
  },
  {
    _id: "18",
    name: "Fruit Punch Mocktail",
    image: img9,
    price: 220,
    description: "Mixed fruity flavors served chilled.",
    category: "Mocktails",
  },
];

export { menu_list, fooditems_list };
