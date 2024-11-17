const BASE_URL = 'https://api.sparrowtest.com/v2/lmd/hiring/frontend/take-home';

export const pizzaApi = {
  async getSpecialtyPizzas() {
    const response = await fetch(`${BASE_URL}/specialty-pizzas`);
    return response.json();
  },

  async getPizzaPricing() {
    const response = await fetch(`${BASE_URL}/pizza-pricing`);
    return response.json();
  }
};