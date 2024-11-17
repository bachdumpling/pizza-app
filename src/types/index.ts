export enum HiringFrontendTakeHomePizzaSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum HiringFrontendTakeHomePizzaType {
  Specialty = "specialty",
  Custom = "custom",
}

export enum HiringFrontendTakeHomePizzaToppings {
  Pepperoni = "pepperoni",
  Mushrooms = "mushrooms",
  Onions = "onions",
  Sausage = "sausage",
  Bacon = "bacon",
  ExtraCheese = "extra cheese",
  BlackOlives = "black olives",
  GreenPeppers = "green peppers",
  Pineapple = "pineapple",
  Ham = "ham",
}

export enum HiringFrontendTakeHomeToppingQuantity {
  Light = "light",
  Regular = "regular",
  Extra = "extra",
}

// Represents a single topping with its quantity
export type PizzaTopping = {
  name: HiringFrontendTakeHomePizzaToppings;
  quantity: HiringFrontendTakeHomeToppingQuantity;
};

export type Pizza = {
  name?: string;
  type: HiringFrontendTakeHomePizzaType;
  size: HiringFrontendTakeHomePizzaSize;
  // For specialty pizzas, we only add extra toppings in the toppings array
  // For custom pizzas, we charge for all toppings
  toppings?: PizzaTopping[];
  // For specialty pizzas, we can exclude toppings that are already included in the pizza
  toppingExclusions?: HiringFrontendTakeHomePizzaToppings[];
  quantity: number;
  totalPrice: number;
};

export type OrderItem = {
  id: string;
  pizza: Pizza;
};

export enum HiringFrontendTakeHomeOrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Ready = "ready",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export enum HiringFrontendTakeHomePaymentMethod {
  CreditCard = "credit_card",
  Cash = "cash",
}

export enum HiringFrontendTakeHomeOrderType {
  Delivery = "delivery",
  Pickup = "pickup",
}

export type HiringFrontendTakeHomeOrderRequest = {
  //IMPORTANT: unique identifier for this pizza location (and your test)
  locationId: string;
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  paymentMethod: HiringFrontendTakeHomePaymentMethod;
  creditCardNumber?: string;
  type: HiringFrontendTakeHomeOrderType;
};

export type HiringFrontendTakeHomeOrderResponse =
  HiringFrontendTakeHomeOrderRequest & {
    id: string;

    status: HiringFrontendTakeHomeOrderStatus;
    // Note: these are Unix timestamps
    createdAt: number;
    updatedAt: number;
    // Only for "delivery" orders
    estimatedDeliveryTime?: number;
  };

enum HiringFrontendTakeHomeSpecialtyPizzaGroup {
  MeatLovers = "meat lovers",
  VeggieLovers = "veggie lovers",
  NewRecipes = "new recipes",
  Classics = "classics",
}

export type SpecialtyPizza = {
  id: string;
  name: string;
  group: HiringFrontendTakeHomeSpecialtyPizzaGroup;
  toppings: PizzaTopping[];
  description: string;
  price: Record<HiringFrontendTakeHomePizzaSize, number>;
};
