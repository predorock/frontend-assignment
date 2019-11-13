import React from "react";
import { Layout } from "antd";
import "./App.css";

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import PokemonTable from "./components/PokemonTable/PokemonTable";

const { Content } = Layout;


const client = new ApolloClient({
  uri: 'http://localhost:4000',
});


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Layout>
          <Content>
            <PokemonTable></PokemonTable>
          </Content>
        </Layout>
      </div>
    </ApolloProvider>
  );
}

export default App;
