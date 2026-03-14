import { useEffect, useState } from "react"
import { getDriverOrders } from "../services/backendIntegration"

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    getDriverOrders("1").then((data) => {
      if (data.ok) setOrders(data.orders)
    })
  }, [])

  return (
    <div>
      <h1>Dispatch Board</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Customer</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.status}</td>
              <td>{o.customer_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}