let res = await fetch(`${process.env.API_URL}`)

console.log("Retrieve All", await res.text())

res = await fetch(`${process.env.API_URL}`, {
    method: 'POST',
    body: JSON.stringify({
        productName: 'Cappuccino',
        description: 'Classic Italian coffee drink',
        price: 4.99,
        category: 'Coffee',
        isAvailable: true
    })
})

const data = await res.json()

const id = data.menuItem.id

res = await fetch(`${process.env.API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        productName: "Iced Capp"
    })
})

console.log("Update", await res.text())

res = await fetch(`${process.env.API_URL}/${id}`, {
    method: 'DELETE'
})

console.log("Delete", res.status)

res = await fetch(`${process.env.API_URL}/${id}`)

console.log("Retrieve", res.status)