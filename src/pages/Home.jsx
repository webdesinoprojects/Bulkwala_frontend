import React, { useState, useEffect, useContext } from 'react'
// import mainbox from '../assets/38686812_8642509.jpg'
// import necband from '../assets/necband.png'
// import PromoCard from '../Componets/PromoCard '
// import cable from '../assets/cable.png'
// import handgame from '../assets/handgame.png'
// import watch from '../assets/watch.png'
// import phonestand from '../assets/phonestand.png'
// import taemp from '../assets/tamp.png'
// import ProductCard from '../Components/ProductCard '
// import TrendingBox from '../Components/TrendingBox'
// import Earphone from '../assets/Earphone.png'
// import pendrive from '../assets/pendrive.png'
// import watchphoto from '../assets/watchphoto.png'
// import temperimg from '../assets/temperimg.png'
// import section3 from '../assets/section-3.png'
// import PromotionalBanner from '../Components/PromotionalBanner '
// import mobile from '../assets/mobile.png'
// import electronics from '../assets/electronic.png'
// import axios from 'axios'
// import HeroSection from '../components/HeroSection'
// import Loading from '../Components/Loading'
// import Aff from '../Components/Aff'
// import aff from "../assets/afff.png"
// import affpic from '../assets/BULK_AFFILIATE_PROGRAM[2].png' 
// import { CartContext } from '../Context/CartContext'
// import Product from './Product'
import { Link } from 'react-router-dom'
// import PriceBands from '../Components/PriceBands'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
const Home = () => {
  // All your state and logic here (can paste your previous full code inside this function)

//   const [isLoading, setIsLoading] = useState(true);
//   const [isCatogrydata, setIsCatogrydata] = useState([]);
//   const [issubCatogry, setIssubCatogry] = useState([]);
//   const [isBannerData, setIsBannerData] = useState([]);
//   const [iscount, setIscount] = useState(0);

//   const { addtocart, cart } = useContext(CartContext);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIscount((prevIndex) => (prevIndex + 1) % isBannerData.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [isBannerData]);

//   useEffect(() => {
//     const fetchCategoryData = async () => {
//       try {
//         const response = await axios.get('https://bulk-backend-ci1g.onrender.com/api/category/all');
//         const data = response.data;
//         setIsCatogrydata(data);
//         setIssubCatogry(data[0]?.subcategories || []);
//         setIsBannerData(data[0]?.banner || []);
//       } catch (error) {
//         console.error('Error fetching category data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCategoryData();
//   }, []);

//   const handlecart = (Product) => {
//     addtocart(Product);
//   };

//   const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Header />
      <Navbar />
      <HeroSection />
    </>
  );
};

export default Home;
