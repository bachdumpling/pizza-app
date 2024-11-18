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
    <div className="w-full">
      <h2 className="text-xl font-bold text-center">Menu</h2>

      {/* Tabs for Specialty Pizzas & Custom Pizzas */}
      <Tabs
        defaultValue="specialty"
        className="w-full flex flex-col justify-center items-center"
      >
        <TabsList className="mb-8 mt-4 flex justify-center items-center">
          <TabsTrigger value="specialty">Specialty Pizzas 🍕</TabsTrigger>
          <TabsTrigger value="custom">Create Your Own 🛠️</TabsTrigger>
        </TabsList>

        {/* Specialty Pizzas */}
        <TabsContent value="specialty" className="grid grid-cols-2 gap-4">
          {specialtyPizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </TabsContent>

        {/* Custom Pizzas */}
        <TabsContent value="custom" className="w-full">
          {pricing && <CustomPizzaBuilder pricing={pricing} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Menu;
