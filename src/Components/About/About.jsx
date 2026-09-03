import NavBar from "../NavBar/NavBar"
import HospitalMessage from "./HospitalMessage/HospitalMessage"
import OurFuture from "./OurFuture/OurFuture"
import StatisticsSection from "./StatisticsSection/StatisticsSection"
import Team from "./Team/Team"
import './About.css'

const About = () => {
  return (
    <div id="topAbout">
        <NavBar/>
        <Team/>
        <HospitalMessage/>
        <StatisticsSection/>
        <OurFuture/>
    </div>
  )
}

export default About