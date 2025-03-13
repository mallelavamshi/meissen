import { FineClient } from "@fine-dev/fine-js";

/**
 * This variable will hold the Fine client. It will be populated automatically by Fine when you have a backend set up
 */
export const fine: FineClient = {
  auth: {
    signInWithPassword: async (credentials) => {
      if (credentials.email === "test@example.com" && credentials.password === "password") {
        return { error: null, session: { user: { id: "mock-user-id", email: credentials.email } } };
      }
      return { error: "Invalid credentials", session: null };
    },
    signUp: async (credentials) => {
      return { error: null, session: { user: { id: "mock-user-id", email: credentials.email } } };
    },
    signOut: async () => {
      return { error: null };
    },
    onAuthStateChange: (callback) => {
      const mockSubscription = {
        unsubscribe: () => {},
      };
      callback("SIGNED_IN", { user: { id: "mock-user-id", email: "test@example.com" } });
      return { data: { subscription: mockSubscription } };
    },
  },
  functions: {
    invoke: async (functionName, payload) => {
      return { error: null, data: { message: `Mock response for ${functionName}`, payload } };
    },
  },
};