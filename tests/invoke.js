let res = await fetch(`${process.env.API_URL}`)

console.log(await res.text())

res = await fetch(`${process.env.API_URL}`, {
    method: 'POST',
    body: JSON.stringify({
        name: 'Cappuccino',
        description: 'Classic Italian coffee drink',
        price: 4.99,
        category: 'Coffee',
        isAvailable: true
    })
})

const data = await res.json()

console.log(data)

const id = data.menuItem.id

res = await fetch(`${process.env.API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        name: "Iced Capp"
    })
})

console.log(await res.text())

res = await fetch(`${process.env.API_URL}/${id}`, {
    method: 'DELETE'
})

console.log(await res.text())

