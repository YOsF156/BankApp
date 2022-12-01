import { useEffect, useState } from "react"

export default function ExchangeRates(props){

    const [value1,setValue1] = useState(0)
    const [value2,setValue2] = useState(0)
    const [convertTO,setConvertTo] =useState("EUR")
    const [multiple, setMultiple]=useState(1)
    useEffect(()=>{
        let requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: { apikey: "vgChD9ToRbsD5OYEMRUeEhysluRY3OyY" }
        };
    
        fetch(`https://api.apilayer.com/fixer/latest?base=${convertTO}`, requestOptions)
            .then(response => response.json())
            .then(result => setMultiple(result.rates.ILS))
            .catch(error => console.log('error', error));
    },[])
const updateValues=(e)=>{
setValue1(e.target.value)
setValue2(multiple*e.target.value)
}

    return(  <div id="main-content">
    <form id="form" className="budget">
        <h1>Exchange Rates:</h1>
        <div>convert your money to any coin you would like.</div>
        <input className="currencyInput" value={value1} type="number"placeholder="enter value to exchange" onChange={updateValues}></input>
        <input className="currencyInput" type="number" value={value2} placeholder="your value after exchange"></input>
    </form>
    
    
</div>
)
}
