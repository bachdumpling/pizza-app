import {
  HiringFrontendTakeHomeOrderRequest,
  HiringFrontendTakeHomeOrderResponse,
} from "@/types";

const BASE_URL = "https://api.sparrowtest.com/v2/lmd/hiring/frontend/take-home";

export const pizzaApi = {
  async getSpecialtyPizzas() {
    const response = await fetch(`${BASE_URL}/specialty-pizzas`);
    return response.json();
  },

  async getPizzaPricing() {
    const response = await fetch(`${BASE_URL}/pizza-pricing`);
    return response.json();
  },

  async createOrder(
    orderData: HiringFrontendTakeHomeOrderRequest
  ): Promise<HiringFrontendTakeHomeOrderResponse> {
    console.log("Order Request:", JSON.stringify(orderData, null, 2));

    const response = await fetch(`${BASE_URL}/pizza`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    return response.json();
  },

  async getOrderById(orderId: string) {
    const response = await fetch(`${BASE_URL}/pizza?orderId=${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Order not found");
    }

    return response.json();
  },

  async cancelOrder(orderId: string) {
    const response = await fetch(`${BASE_URL}/pizza/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }

    return response.json();
  },
};
