import type { CodegenConfig } from "@graphql-codegen/cli";

require("dotenv").config({
  path: ".env",
});

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  documents: "app/api/**/*.{tsx,ts}",
  generates: {
    "app/gql/": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
