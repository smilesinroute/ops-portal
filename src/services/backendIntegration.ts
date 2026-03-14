const API_URL = "https://api-backend-vmlt.onrender.com"

export async function getDriverOrders(token: string) {
  const res = await fetch(`${API_URL}/api/driver/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.json()
}

export async function acceptOrder(orderId: number, token: string) {
  const res = await fetch(`${API_URL}/api/driver/orders/${orderId}/accept`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  return res.json()
}

export async function getCourierQuote(data: any) {
  const res = await fetch(`${API_URL}/api/courier/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return res.json()
}