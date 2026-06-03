export type Movement = {
  id: number;

  label: string;          // "Consumo", "Entrada", etc
  display_type: "in" | "out";

  quantity: number;

  product: {
    name: string;
    unit: string;
  };

  sector: {
    name: string;
  };

  user?: {
    name: string;
  };

  performed_at: string;
  performed_at_human: string; // "há 2 horas"
};