import React from 'react';
import { Table, Form, Input, Button, AutoComplete } from 'antd';
import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';


const POKEMONS = gql`
  query Pokemons($name: String, $limit: Int, $after: ID) {
    pokemons (q: $name, limit: $limit, after: $after) {
      edges {
        cursor
        node {
          name
          classification
          types
        }
      }
      pageInfo{
        hasNextPage,
        endCursor
      }
    }
  }
`;

const POKEMONS_BY_TYPE = gql`
  query Pokemons($type: String!, $limit: Int, $after: ID) {
    pokemonsByType  (type: $type, limit: $limit, after: $after) {
      edges {
        cursor
        node {
          name
          classification
          types
        }
      }
      pageInfo{
        hasNextPage,
        endCursor
      }
    }
  }
`;

const columns = [
  {
    title: 'Id',
    key: 'cursor',
    dataIndex: 'cursor',
  },
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'node.name',
  },
  {
    title: 'Image',
    key: 'image',
    dataIndex: 'cursor',
    render: (text, record) => (
      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(text, 10)}.png`}></img>
    )
  },
  {
    title: 'Classification',
    key: 'classification',
    dataIndex: 'node.classification',
  }
]
export default class PokemonTable extends React.Component {

  state = {
    query: POKEMONS,
    resultAdapter: (data) => data.pokemons,
    search: {
      name: '',
      type: '',
      limit: 10,
    }
  }

  constructor(props) {
    super(props)
  }


  byName() {
    return event => this.setState({
      query: POKEMONS,
      resultAdapter: (data) => data.pokemons,
      search: {
        name: event.target.value
      }
    })
  }

  byType = value => {
    this.setState({
      query: POKEMONS_BY_TYPE,
      resultAdapter: (data) => data.pokemonsByType,
      search: {
        type: value
      }
    })
  }


  updateSearch(field, query) {
    return event => this.setState({
      query: query,
      search: {
        [field]: event.target.value
      }
    })
  }

  loadMore(after) {
    return event => this.setState({search: {
      ...this.state.search,
      after
    }})
  }

  pokemonTypes () {
    return ['Normal', 'Fire',
    'Water',	'Grass',
    'Electric',	'Ice',
    'Fighting',	'Poison',
    'Ground',	'Flying',
    'Psychic',	'Bug',
    'Rock',	'Ghost',
    'Dark',	'Dragon',
    'Steel',	'Fairy' ].map(t => <AutoComplete.Option key={t}>{t}</AutoComplete.Option>)
  }

  render() {
    return(
      <Query query={this.state.query} variables={{...this.state.search}} fetchPolicy="network-only">
        {result => {
          const { loading, error, data } = result;

          console.log('data', data);

          const pokemons = !!data ? this.state.resultAdapter(data) : [];

          console.log('pokemons', pokemons);

          const dataSource = (!!pokemons && !!pokemons.edges) ? pokemons.edges : []; 
          
          let loadMore = ''
          if (!!pokemons && !!pokemons.pageInfo && pokemons.pageInfo.hasNextPage) {
            loadMore =  <Form.Item>
                          <Button type="primary" icon="reload" onClick={this.loadMore(pokemons.pageInfo.endCursor)}>
                            NextPage
                          </Button>
                        </Form.Item>
          } else {
            loadMore = 
              <Form.Item>
                <Button type="primary" onClick={this.loadMore('')}>
                  Reset
                </Button>
              </Form.Item>
          }

          return (
            <div>
              <Form
                layout="inline"
                className="query-form"
                style={{ marginBottom: 16 }}
              >
              <Form.Item label="Search by name">
                <Input placeholder="ex: pikatchu" value={this.state.search.name} onChange={this.byName()}/>
              </Form.Item>
              <Form.Item label="Filter by type">
                <AutoComplete placeholder="ex: fire" value={this.state.search.type} onSelect={this.byType}>
                  {this.pokemonTypes()}
                </AutoComplete>
              </Form.Item>
              {loadMore}
              </Form>
              <Table
                rowKey="cursor"
                loading={loading}
                dataSource={dataSource}
                columns={columns}
              />
            </div>
          )
        }
      }
      </Query>
    )
  }
}