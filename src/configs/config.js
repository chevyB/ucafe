export const ROLES = {
  User: "user",
  Seller: "seller",
  Admin: "admin",
}

export const ORDER_STATUS_ARRAY = ["placed", "processing", "ready", "completed"]

export const ORDER_STATUS = {
  Placed: "placed",
  Processing: "processing",
  Ready: "ready",
  Completed: "completed",
}

export const ORDER_STATUS_SELLER = {
  placed: "Process Order",
  processing: "Ready for Pick-up",
  ready: "Complete Order",
  completed: "Completed",
}

export const ORDER_STATUS_NUM = {
  placed: 1,
  processing: 2,
  ready: 3,
  completed: 4,
}

export const PUBLIC_URLS = ["/login", "/register"]
