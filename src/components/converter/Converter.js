import React, { Component } from "react"
import './Converter.css'
export default class Converter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fromValue: "",
            toValue: 0,
            availableCurrencies: [],
            fromCurrency: "",
            toCurrency: ""
        }

        this.convert = this.convert.bind(this)
        this.findCurrenciesOptions = this.findCurrenciesOptions.bind(this)
    }

    convert() {
        const fromToStr = `${this.state.fromCurrency}-${this.state.toCurrency}`
        const url = `http://economia.awesomeapi.com.br/json/last/${fromToStr}`

        fetch(url)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let price = json[`${this.state.fromCurrency}${this.state.toCurrency}`].bid
                let toValue =  (parseFloat(this.state.fromValue) * price).toFixed(2)
                this.setState({ toValue })
            })
    }

    findCurrenciesOptions() {
        return fetch('https://economia.awesomeapi.com.br/json/available/uniq')
            .then((res) => res.json())
            .then((availableCurrenciesResponse) => {
                const availableCurrencies = Object
                    .keys(availableCurrenciesResponse)
                    .map((currency) => ({
                        value: currency,
                        text: availableCurrenciesResponse[currency]
                    }))

                this.setState({ availableCurrencies })
            })
    }

    handleCurrencyFromChange(event) {
        this.setState({ currentFromCurrency: event.target.value })
    }

    render() {
        this.findCurrenciesOptions()

        return (
            <div className="converter">
                <div>
                    <h1>Conversor de Moedas</h1>
                </div>
                <div className="currencySelector">
                    <div className="subtitle">De</div>
                    <select value={this.state.fromCurrency} onChange={ (event) => this.setState({ fromCurrency: event.target.value }) }>
                        {this.state.availableCurrencies.map((option, index) => (
                            <option key={index} value={option.value}>
                                {`${option.text} (${option.value})`}
                            </option>
                        ))}
                    </select>                    
                </div>

                <div className="currencySelector">
                    <div className="subtitle">Para</div>
                    <select value={this.state.toCurrency} onChange={ (event) => this.setState({ toCurrency: event.target.value }) }>
                        {this.state.availableCurrencies.map((option, index) => (
                            <option key={index} value={option.value}>
                                {`${option.text} (${option.value})`}
                            </option>
                        ))}
                    </select>                    
                </div>

                <div className="currencySelector">
                    <div className="subtitle">Valor</div>
                    <input type="text" onChange={ (event) => { this.setState({ fromValue: event.target.value }) }}></input>
                </div>

                <div>
                    <input className="ConvertButton" type="button" value="Converter" onClick={ this.convert }></input>                    
                </div>
                <h2>{ this.state.toValue }</h2>
            </div>
        )
    }
}