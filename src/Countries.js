import React from "react";
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { FormControl, FormSelect, InputGroup } from "react-bootstrap";
class Countries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            showQueryInput: false,
            searchBy: "all",
            query: ""
        };
        this.onOptionChange = this.onOptionChange.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.parseCurrencies = this.parseCurrencies.bind(this);
        this.parseLanguages = this.parseLanguages.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }
    
    onOptionChange(event) {
        const option = event.target.value;
        this.fetchData(this.state.query);
        this.setState({
            showQueryInput: option != "all",
            query: "",
            searchBy: option
        });
    }

    onQueryChange(event) {
        const query = event.target.value;
        this.setState({
            query: query
        });
        this.fetchData(query);
    }

    fetchData(query) {
        const baseURL = "https://restcountries.com/v3.1";
        const { searchBy } = this.state;
        
        if (searchBy == "all" || query == "") {
            fetch(`${baseURL}/all`)
            .then ((res) => res.json())
            .then((json) => {
                this.setState({
                    countries: json
                })
            });
        } else {
            if(searchBy == "name") {
                fetch(`${baseURL}/name/${query}`)
                .then ((res) => res.json())
                .then((json) => {
                    this.setState({
                        countries: json
                    })
                })
                .catch(this.setState({countries: {}}));
            } else if(searchBy == "currency") {
                fetch(`${baseURL}/currency/${query}`)
                .then ((res) => res.json())
                .then((json) => {
                    this.setState({
                        countries: json
                    })
                })
                .catch(this.setState({countries: {}}));
            } else if (searchBy == "language") {
                fetch(`${baseURL}/lang/${query}`)
                .then ((res) => res.json())
                .then((json) => {
                    this.setState({
                        countries: json
                    })
                })
                .catch(this.setState({countries: {}}));
            } else if (searchBy == "region") {
                fetch(`${baseURL}/region/${query}`)
                .then ((res) => res.json())
                .then((json) => {
                    this.setState({
                        countries: json
                    })
                })
            }
        } 
    }

    parseCurrencies(currencyData) {
       let currencyText = "";
       if (!currencyData) return "None";
       let index = 0;
       const length = Object.entries(currencyData).length;
        Object.entries(currencyData).forEach((key, value) => {
           currencyText += index == length - 1 ? key[1].name : key[1].name + ",";
           index++;
        });
        return currencyText;
    }

    parseLanguages(languageData) {
        let languagesText = "";
        if (!languageData) return "None";
        let index = 0;
        const length = Object.entries(languageData).length;
        Object.entries(languageData).forEach((key, value) => {
            languagesText += index == length - 1 ? key[1] : key[1] + ",";
            index++;
        });
        return languagesText;
    }

    render() {
        const { countries, showQueryInput } = this.state;
        return <Container>
            <h1>Rest Countries API</h1>
            <h2>Select an option from below to filter countries:</h2>
            <select name="options" id="options" onChange={this.onOptionChange}>
                <option value="all">All</option>
                <option value="name">Name</option>
                <option value="currency">Currency</option>
                <option value="language">Language</option>
                <option value="region">Region</option>
            </select>

            { !!showQueryInput && <input type="text" id="query" name="query" onChange={this.onQueryChange}></input> }
            <Table>
                <thead class="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Capital</th>
                        <th>Flag</th>
                        <th>Region</th>
                        <th>Currencies</th>
                        <th>Languages</th>
                    </tr>
                </thead>
                <tbody>
                {
                    countries.length && countries.sort((a,b) => {
                        const nameA = a.name.common.toUpperCase();
                        const nameB = b.name.common.toUpperCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    }).map((item) => (
                        <tr key={item.name.common}>
                            <td>{item.name.common}</td>
                            <td>{item.capital}</td>
                            <td>{item.flag}</td>
                            <td>{item.region}</td>
                            <td>{this.parseCurrencies(item.currencies)}</td>
                            <td>{this.parseLanguages(item.languages)}</td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </Container>
    }
}

export default Countries;