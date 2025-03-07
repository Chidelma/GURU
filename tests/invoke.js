const res = await fetch(`${process.env.API_URL}`, {
    method: 'POST',
    body: JSON.stringify({
        name: 'Cappuccino',
        description: 'Classic Italian coffee drink',
        price: 4.99,
        category: 'Coffee',
        isAvailable: true
    })
})

console.log(await res.text())