const url = 'https://api.covid19api.com'
let combo = document.getElementById('combo')
let today = document.getElementById('today')
let confirmed = document.getElementById('confirmed')
let death = document.getElementById('death')
let recovered = document.getElementById('recovered')
let active = document.getElementById('active')
let actives = document.getElementById('actives')

let tconfirmed = document.getElementById('tconfirmed')
let tdeath = document.getElementById('tdeath')
let trecovered = document.getElementById('trecovered')
let tactive = document.getElementById('tactive')
let tactives = document.getElementById('tactives')


window.addEventListener('load', ()=> {  
  combo.addEventListener('change', handleChange)
  today.addEventListener('change', handleChange)
     
  request()
})

const request=()=>{
  fetch(`${url}/summary`)
    .then(response=> response.json())
    .then(data => loadSummary(data))
    .catch(err=> console.log(err))

  fetch(`${url}/countries`)
    .then(response=> response.json())
    .then(data => loadCountries(data))
    .catch(err=> console.log(err))  
}  

const loadSummary=(data)=>{  
  confirmed.innerText = data.Global.TotalConfirmed.toLocaleString('PT')
  death.innerText = data.Global.TotalDeaths.toLocaleString('PT')
  recovered.innerText = data.Global.TotalRecovered.toLocaleString('PT')
  active.innerText = new Date(data.Global.Date).toLocaleDateString() + ' - ' + new Date(data.Global.Date).toLocaleTimeString()
  actives.innerText = 'Atualizações'  
}

const loadCountries=(data)=>{    
  const sortedCountries = data.sort((a,b)=> a.Country.localeCompare(b.Country))
  
  sortedCountries.map(item=> {
    let options = document.createElement('option')
    options.innerText = item.Country
    options.value = item.Slug
    combo.appendChild(options)
  })  
}

const handleChange=()=>{
  if(combo.value !== 'Global'){
    let startDate = new Date(today.value)
    let endDate = new Date(startDate.setDate(Number(startDate.getDate()) +1))    

    startDate = new Date(startDate.setDate(Number(startDate.getDate()) -1)) 

    console.log(startDate, endDate)
      
    fetch(`${url}/country/${combo.value}?from=${startDate.toISOString()}&to=${endDate.toISOString()}/status`)
      .then(response=> response.json())
      .then(data => loadData(data))
      .catch(err=> console.log(err)) 
  }
}


const loadData=(data)=>{
  console.log(data)
  let confirmedDelta = data[1].Confirmed - data[0].Confirmed
  let deathDelta= data[1].Deaths - data[0].Deaths
  let recoveredDelta = data[1].Recovered - data[0].Recovered
  let activeDelta = data[1].Active - data[0].Active

  confirmed.innerText = data[1].Confirmed.toLocaleString('PT')
  death.innerText =data[1].Deaths.toLocaleString('PT')
  recovered.innerText =data[1].Recovered.toLocaleString('PT')
  actives.innerText = 'Ativos'  
  active.innerText = data[1].Active.toLocaleString('PT')


  tconfirmed.innerHTML= confirmedDelta>0 ?`<img src='./assets/img/up.png'/> ${confirmedDelta.toLocaleString('PT')}`:`<img src='./assets/img/down.png'/> ${confirmedDelta.toLocaleString('PT')}`
  tdeath.innerHTML = deathDelta>0 ?`<img src='./assets/img/up.png'/> ${deathDelta.toLocaleString('PT')}`:`<img src='./assets/img/down.png'/> ${deathDelta.toLocaleString('PT')}`
  trecovered.innerHTML =recoveredDelta>0 ?`<img src='./assets/img/up.png'/> ${recoveredDelta.toLocaleString('PT')}`:`<img src='./assets/img/down.png'/> ${recoveredDelta.toLocaleString('PT')}`
  tactive.innerHTML = activeDelta>0 ?`<img src='./assets/img/up.png'/> ${activeDelta.toLocaleString('PT')}`:`<img src='./assets/img/down.png'/> ${activeDelta.toLocaleString('PT')}`  
  tactives.innerText = 'Ativos'  
}

