import React from "react";
import { Layout } from "antd";
import "./App.css";

import PokemonTable from "./components/PokemonTable/PokemonTable";

const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Content>
          <PokemonTable></PokemonTable>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
