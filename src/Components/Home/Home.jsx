import Achievements from "../Achievements/Achievements"
import BlogSection from "../BlogSection/BlogSection"
import Hero from "../Hero/Hero"
import HospitalInfo from "../Hospital info/HospitalInfo"
import NavBar from "../NavBar/NavBar"
import { PartnersSection } from "../PartnersSection/PartnersSection"
import Question from "../Question/Question"
import { RatingSection } from "../RatingSection/RatingSection"
import Svg from "../Svg/Svg"
import VisitorOpinions from "../VisitorOpinions/VisitorOpinions"
import './Home.css'
import 'aos/dist/aos.css'

const Home = () => {
  return (
    <div className="home" id='topHome' >
      <NavBar/>
      <Hero/>
      <Svg/>
      <HospitalInfo/>
      <VisitorOpinions/>
      <BlogSection/>
      <PartnersSection/>
      <Achievements/>
      <RatingSection/>
      <Question/>
    </div>
  )
}

export default Home