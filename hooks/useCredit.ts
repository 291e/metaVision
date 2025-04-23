import { useMutation } from "@apollo/client";
import { ADD_CREDITS } from "@/app/api/payment/mutation";

export const useCredit = () => {
  const [addCreditsMutation] = useMutation(ADD_CREDITS);

  const addCredits = async (amount: number, description: string) => {
    try {
      const { data } = await addCreditsMutation({
        variables: {
          amount,
          description,
        },
      });
      return data.addCredits;
    } catch (error) {
      console.error("Failed to add credits:", error);
      throw error;
    }
  };

  return {
    addCredits,
  };
};
