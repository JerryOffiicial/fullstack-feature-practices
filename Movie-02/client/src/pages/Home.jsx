import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import MovieList from '../components/MovieList.jsx'
import Newsletter from '../components/Newsletter.jsx'
import Footer from '../components/Footer.jsx'


const Home = () => {
  return (
    <>
        <Navbar/>
        <Header/>
        <MovieList/>
        <Newsletter/>
        <Footer/>
    </>
  )
}

export default Home