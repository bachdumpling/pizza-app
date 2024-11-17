import { HiringFrontendTakeHomeOrderRequest } from "@/types";

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

  async createOrder(orderData: HiringFrontendTakeHomeOrderRequest) {
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
  },
};
