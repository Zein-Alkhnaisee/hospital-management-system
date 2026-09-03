import { useEffect, useRef, useState } from 'react';
import './StatisticsSectionStylee.css';
import { FaUserMd, FaHeartbeat, FaProcedures, FaSmile } from 'react-icons/fa';

const statsData = [
    { icon: <FaUserMd />, label: 'specialized doctors', target: 160 },
    { icon: <FaHeartbeat />, label: 'Successful operation', target: 2500 },
    { icon: <FaProcedures />, label: 'fitted bed', target: 200 },
    { icon: <FaSmile />, label: 'Patient satisfaction', target: 98, suffix: '%' },
];

export default function StatisticsSection() {
    const [counts, setCounts] = useState(statsData.map(() => 0));
    const sectionRef = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const observer =new IntersectionObserver(
            entries=>{
                if (entries[0].isIntersecting && !hasAnimated){
                    setHasAnimated(true)
                    
        const intervals = statsData.map((stat, idx) => {
        return setInterval(() => {
            setCounts(prev => {
            const newCounts = [...prev];
            if (newCounts[idx] < stat.target) {
                newCounts[idx] += Math.ceil(stat.target / 100);
            } else {
                newCounts[idx] = stat.target;
            }
            return newCounts;
            });
        }, 100);
        });

        return () => intervals.forEach(clearInterval);
        }
    }, {threshold:0.5});
    if(sectionRef.current){
        observer.observe(sectionRef.current);
    }
    return ()=>{
        if(sectionRef.current){
            observer.unobserve(sectionRef.current)
        }
    };
    },[hasAnimated,statsData]);

    return (
        <section ref={sectionRef} className="stats-section">
        <h2 className="stats-title">Our statistics</h2>
        <div className="stats-grid">
            {statsData.map((stat, index) => (
            <div key={index} className="stats-card">
                <div className="stats-icon">{stat.icon}</div>
                <div className="stats-number">
                {counts[index]}{stat.suffix || ''}
                </div>
                <p className="stats-label">{stat.label}</p>
            </div>
            ))}
        </div>
        </section>
    );
}