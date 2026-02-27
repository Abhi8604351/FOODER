const User = require('./models/userModel');
const Food = require('./models/foodModel');

const importData = async () => {
    try {
        const foodCount = await Food.countDocuments();
        if (foodCount > 0) {
            console.log('Database already has data. Skipping auto-seed.');
            return;
        }

        console.log('Database empty. Starting auto-seed...');

        // Create Admin
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
            });
        }

        const indianFoods = [
            { name: 'Butter Chicken', description: 'Creamy and buttery tomato-based chicken curry.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
            { name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a rich and creamy tomato gravy.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7' },
            { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato mash.', category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
            { name: 'Idli Sambar', description: 'Steamed rice cakes served with flavorful lentil soup.', category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
            { name: 'Hyderabadi Biryani', description: 'Aromatic basmati rice cooked with spiced meat and saffron.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8' },
            { name: 'Pani Puri', description: 'Crispy hollow puris filled with tangy and spicy water.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1517244681291-4e0d76ac1f12' },
            { name: 'Vada Pav', description: 'The famous spicy potato slider from Mumbai.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1606491956689-2ea84b725c81' },
            { name: 'Pav Bhaji', description: 'Mashed vegetable curry served with buttered bread rolls.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1601050690597-df056fb1cd2a' },
            { name: 'Samosa', description: 'Deep-fried pastry filled with spiced potatoes and peas.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1601050690597-df056fb1cd2a' },
            { name: 'Chole Bhature', description: 'Spicy chickpeas served with fluffy deep-fried bread.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1596797038530-2c39fa4219c6' },
            { name: 'Dal Makhani', description: 'Slow-cooked black lentils in a creamy butter sauce.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d' },
            { name: 'Rajma Chawal', description: 'Red kidney beans curry served with steamed rice.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d' },
            { name: 'Tandoori Chicken', description: 'Chicken marinated in yogurt and spices, grilled in a clay oven.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a' },
            { name: 'Rogan Josh', description: 'Traditional Kashmiri lamb curry with aromatic spices.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d' },
            { name: 'Aloo Gobi', description: 'Spiced cauliflower and potato stir-fry.', category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d' },
            { name: 'Uttapam', description: 'Thick savory pancake topped with vegetables.', category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
            { name: 'Lemon Rice', description: 'Tangy and crunchy rice flavored with lemon and temper.', category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' },
            { name: 'Dabeli', description: 'Spicy potato filling in a pav with peanuts and pomegranate.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1606491956689-2ea84b725c81' },
            { name: 'Kachori', description: 'Flaky deep-fried pastry filled with spiced lentils.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1601050690597-df056fb1cd2a' },
            { name: 'Bhel Puri', description: 'Light snack made of puffed rice, veggies, and chutney.', category: 'Street Food', image: 'https://images.unsplash.com/photo-1517244681291-4e0d76ac1f12' },
            { name: 'Gulab Jamun', description: 'Deep-fried milk dumplings soaked in sugar syrup.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' },
            { name: 'Rasgulla', description: 'Spongy cottage cheese balls in light sugar syrup.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' },
            { name: 'Jalebi', description: 'Crispy deep-fried pretzels soaked in sugar syrup.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' },
            { name: 'Kaju Katli', description: 'Traditional cashew fudge with silver leaf.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' },
            { name: 'Laddu', description: 'Sweet round balls made from flour, ghee, and sugar.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' },
            { name: 'Rasmalai', description: 'Soft paneer discs in sweetened thickened milk.', category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' },
            { name: 'Mango Lassi', description: 'Creamy and refreshing mango yogurt drink.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696' },
            { name: 'Masala Chai', description: 'Aromatic spiced milk tea.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1544787210-22bb1e7e82e4' },
            { name: 'Filter Coffee', description: 'Traditional South Indian frothy milk coffee.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1544787210-22bb1e7e82e4' },
            { name: 'Nimbu Pani', description: 'Refreshing Indian lemonade with a hint of salt and spice.', category: 'Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696' },
        ];

        const foods = indianFoods.map(food => ({
            ...food,
            price: Math.floor(Math.random() * (600 - 80 + 1) + 80),
            isAvailable: true,
            countInStock: Math.floor(Math.random() * 20),
            isVeg: !food.name.toLowerCase().includes('chicken') && !food.name.toLowerCase().includes('lamb') && !food.name.toLowerCase().includes('fish') && !food.name.toLowerCase().includes('tandoori') && !food.name.toLowerCase().includes('rogan')
        }));

        await Food.insertMany(foods);
        console.log('Indian Food Data Auto-Imported Successfully!');
    } catch (error) {
        console.error(`Auto-seed Error: ${error.message}`);
    }
};

module.exports = { importData };
