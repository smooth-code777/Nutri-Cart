const db = require('./db');

const products = [
    {
        name: 'Grilled Chicken Salad',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        description: 'Fresh salad with grilled chicken breast',
        price: 350,
        stock: 50,
        is_vegetarian: 0,
        calories: 350,
        protein: 30,
        sugar: 2,
        warnings: ''
    },
    {
        name: 'Vegetable Stir Fry',
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        description: 'Mixed vegetables tossed in a light soy sauce',
        price: 280,
        stock: 40,
        is_vegetarian: 1,
        calories: 250,
        protein: 5,
        sugar: 4,
        warnings: 'High Sodium'
    },
    {
        name: 'Chocolate Lava Cake',
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
        description: 'Decadent chocolate cake with molten center',
        price: 220,
        stock: 20,
        is_vegetarian: 1,
        calories: 500,
        protein: 4,
        sugar: 30,
        warnings: 'High Sugar, Not for Diabetics'
    },
    {
        name: 'Quinoa Power Bowl',
        image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
        description: 'Nutrient-rich quinoa with avocado and beans',
        price: 320,
        stock: 35,
        is_vegetarian: 1,
        calories: 400,
        protein: 12,
        sugar: 1,
        warnings: ''
    },
    {
        name: 'Bacon Cheeseburger',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        description: 'Classic burger with cheese and bacon',
        price: 380,
        stock: 100,
        is_vegetarian: 0,
        calories: 800,
        protein: 25,
        sugar: 10,
        warnings: 'High Cholesterol, High Fat'
    },
    {
        name: 'Paneer Tikka Masala',
        image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        description: 'Rich and creamy paneer curry',
        price: 300,
        stock: 60,
        is_vegetarian: 1,
        calories: 600,
        protein: 18,
        sugar: 8,
        warnings: 'High Fat'
    }
];

const seed = () => {
    const insert = db.prepare(`
        INSERT INTO products (name, image_url, description, price, stock, is_vegetarian, calories, protein, sugar, warnings)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const clear = db.prepare('DELETE FROM products');
    clear.run();

    const transaction = db.transaction((items) => {
        for (const item of items) {
            insert.run(item.name, item.image_url, item.description, item.price, item.stock, item.is_vegetarian, item.calories, item.protein, item.sugar, item.warnings);
        }
    });

    transaction(products);
    console.log('Seeded products successfully');
};

seed();
