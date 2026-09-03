import CountUp from 'react-countup';
import { FaUserInjured, FaClock, FaSmile, FaHospital } from 'react-icons/fa';
import './StatsSection.css';
import { useInView } from 'react-intersection-observer';
const stats = [
{
    icon: <FaUserInjured />,
    value: 10000,
    suffix: '+',
    label: 'Patients per Year',
},
{
    icon: <FaClock />,
    value: 10,
    suffix: ' min',
    label: 'Avg. Waiting Time',
},
{
    icon: <FaSmile />,
    value: 98,
    suffix: '%',
    label: 'Patient Satisfaction',
},
{
    icon: <FaHospital />,
    value: 24,
    suffix: '/24',
    label: 'Emergency Coverage',
},
];

export default function StatsSection() {
    const {ref , inView}= useInView({
        threshold:0.3,
        triggerOnce:true,
    });
    return (
    <section className="stats-section" id='statsSection' ref={ref}>
        <div className="stats-container">
            {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">
                    {inView?<CountUp end={stat.value} duration={5} /> : '0'}
                    {stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
            </div>
            ))}
        </div>
    </section>
);
}