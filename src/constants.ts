import { MenuItem, Cafeteria, Category } from './types';

export const CAFETERIAS: Cafeteria[] = [
  {
    id: "Mao",
    name: "Mao Café",
    logo: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
    hero: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400",
    description: "Traditional flavors meets modern comfort."
  },
  {
    id: "Mamas",
    name: "Mamas Kitchen",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    hero: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400",
    description: "Homemade quality with a touch of love."
  },
  {
    id: "Shemach",
    name: "Shemach Hub",
    logo: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    hero: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1400",
    description: "The fast, fresh choice for students."
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "c1",
    name: "Espresso",
    price: 120,
    description: "Rich and bold single shot",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600",
    category: "Coffee"
  },
  {
    id: "c2",
    name: "Cappuccino",
    price: 180,
    description: "Creamy foam with rich espresso",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600",
    category: "Coffee"
  },
  {
    id: "c3",
    name: "Ethiopian Latte",
    price: 200,
    description: "Spiced latte with mountain coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600",
    category: "Coffee"
  },
  {
    id: "b1",
    name: "Continental Breakfast",
    price: 220,
    description: "Eggs, toast, and fruit bowl",
    image: "https://images.unsplash.com/photo-1559622214-f8a9850965bb?q=80&w=600",
    category: "Breakfast"
  },
  {
    id: "l1",
    name: "Doro Wat",
    price: 350,
    description: "Traditional spicy chicken stew",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
    category: "Local"
  },
  {
    id: "l2",
    name: "Special Firfir",
    price: 280,
    description: "Shredded injera with spicy sauce",
    image: "https://images.unsplash.com/photo-1616644024221-396825228185?q=80&w=600",
    category: "Local"
  }
];

export const STAFF_USERS = {
  "maocafe": { password: "123", cafeteriaId: "Mao" },
  "mamascafe": { password: "123", cafeteriaId: "Mamas" },
  "shemachcafe": { password: "123", cafeteriaId: "Shemach" }
};
