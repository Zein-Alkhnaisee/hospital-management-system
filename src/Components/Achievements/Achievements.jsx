import './Achievements.css';
import { useEffect } from 'react';
import 'aos/dist/aos.css'
import Aos from 'aos';

const achievements = [
    {
        year: '2021',
        title: 'Best Humanitarian Hospital',
        description: 'Awarded by the International Health Association for outstanding humanitarian efforts.',
        icon: '🏆',
    },
    {
        year: '2022',
        title: 'ISO 9001 Certification',
        description: 'Recognized for maintaining high standards in healthcare quality and safety.',
        icon: '✅',
    },
    {
        year: '2023',
        title: '300,000+ Patients Served',
        description: 'Achieved a milestone in providing care to over 300,000 patients with compassion.',
        icon: '❤️',
    },
    {
        year: '2024',
        title: 'Global Health Partnership',
        description: 'Joined a major global health network to expand our services internationally.',
        icon: '🌍',
    },
];

export default function Achievements() {
    useEffect(() => {
        Aos.init({
            offset:50,
            easing:'ease-in-out',
            once:false,
        });
        Aos.refresh();
    },[]);
    return (
    <section className="achievements-section">
        <h2 className="achievements-title">Achievements & Awards</h2>
        <div className="timeline">
        {achievements.map((item, index) => {
            let animationType = "fade-up";
            if(index === 0) animationType ="slide-right";
            else if (index === 1) animationType = "zoom-in";
            else if (index === 2) animationType = "flip-left";
            else if (index === 3) animationType = "zoom-in-up";
            return (
            <div className="timeline-item" key={index}
            data-aos={animationType}
            data-aos-delay={`${index*200}`}
            data-aos-duration={index === 3 ? 1400 : 1200}
            >
                <div className="timeline-icon">{item.icon}</div>
                <div className="timeline-content">
                    <h3>{item.year} - {item.title}</h3>
                    <p>{item.description}</p>
                </div>
            </div>
            );
    })}
        </div>
    </section>
    );
}