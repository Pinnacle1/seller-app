"use client"

interface Order {
  id: string
  date: string
  buyer: string
  items: string
  total: string
  payment: "paid" | "pending"
  fulfillment: "pending" | "shipped" | "delivered"
}

const mockOrders: Order[] = [
  {
    id: "#1234",
    date: "Dec 10",
    buyer: "Rahul M.",
    items: "2 items",
    total: "₹1,250",
    payment: "paid",
    fulfillment: "pending",
  },
  {
    id: "#1233",
    date: "Dec 9",
    buyer: "Priya S.",
    items: "1 item",
    total: "₹850",
    payment: "paid",
    fulfillment: "shipped",
  },
  {
    id: "#1232",
    date: "Dec 8",
    buyer: "Amit K.",
    items: "3 items",
    total: "₹2,100",
    payment: "paid",
    fulfillment: "delivered",
  },
  {
    id: "#1231",
    date: "Dec 7",
    buyer: "Sneha R.",
    items: "1 item",
    total: "₹450",
    payment: "pending",
    fulfillment: "pending",
  },
  {
    id: "#1230",
    date: "Dec 6",
    buyer: "Vikram T.",
    items: "2 items",
    total: "₹1,800",
    payment: "paid",
    fulfillment: "shipped",
  },
]

interface OrderListProps {
  filter: string
  onSelect: (order: Order) => void
}

export function OrderList({ filter, onSelect }: OrderListProps) {
  const filtered = filter === "all" ? mockOrders : mockOrders.filter((o) => o.fulfillment === filter)

  return (
    <div className="space-y-2">
      {filtered.map((order) => (
        <button
          key={order.id}
          onClick={() => onSelect(order)}
          className="w-full text-left p-4 border border-border rounded-xl hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{order.buyer}</p>
              <p className="text-xs text-muted-foreground">
                {order.id} · {order.date} · {order.items}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{order.total}</p>
              <div className="flex gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${order.payment === "paid" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}
                >
                  {order.payment}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${order.fulfillment === "delivered" ? "bg-green-500/10 text-green-500" : order.fulfillment === "shipped" ? "bg-blue-500/10 text-blue-500" : "bg-yellow-500/10 text-yellow-500"}`}
                >
                  {order.fulfillment}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
