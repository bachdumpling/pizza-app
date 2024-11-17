import { pizzaApi } from "@/hooks/usePizzaApi";
import { SpecialtyPizza } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PizzaCard from "./PizzaCard";
import { GetPizzaPricingResponse } from "@/types/api";
import CustomPizzaBuilder from "./CustomPizzaBuilder";

function Menu() {
  const [specialtyPizzas, setSpecialtyPizzas] = useState<SpecialtyPizza[]>([]);
  const [pricing, setPricing] = useState<GetPizzaPricingResponse>();

  useEffect(() => {
    pizzaApi.getSpecialtyPizzas().then((data) => {
      const { specialtyPizzas } = data;
      setSpecialtyPizzas(specialtyPizzas);
    });

    pizzaApi.getPizzaPricing().then((data) => {
      setPricing(data);
    });
  }, []);

  return (
    <div>
      <h2>Menu</h2>

      {/* Tabs for Specialty Pizzas & Custom Pizzas */}
      <Tabs defaultValue="specialty" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="specialty">Specialty Pizzas</TabsTrigger>
          <TabsTrigger value="custom">Create Your Own</TabsTrigger>
        </TabsList>

        {/* Specialty Pizzas */}
        <TabsContent value="specialty">
          <div className="grid grid-cols-2 gap-4">
            {specialtyPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </TabsContent>

        {/* Custom Pizzas */}
        <TabsContent value="custom">
          {pricing && <CustomPizzaBuilder pricing={pricing} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Menu;
