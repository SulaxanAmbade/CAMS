import React from 'react'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Sidebar from './Components/Sidebar'
const App = () => {
  return (
    <>
    <Header/>
    <div style={{display:'flex', height:'100vh'}}>
    <Sidebar/>
    <div style={{backgroundColor:'black', width:'100%'}}>
      hello
    </div>
    </div>
    <Footer/>
  </>
  )
}


export default App

