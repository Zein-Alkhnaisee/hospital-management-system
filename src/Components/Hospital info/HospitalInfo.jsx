import './HospitalInfoStylee.css'
const HospitalInfo = () => {
    return (
    <div>
        <section className="features-section">
            <div className="features-container">
                <h2>Why choose Alivia ?</h2>
                <div className="features-grid">
                <div className="feature-card">
                    <i className="fa-solid fa-user-doctor"></i>
                    <h3>Featured medical staff</h3>
                    <p>A selection of doctors with high experience provides the best care for you and your family.</p>
                </div>
                <div className="feature-card">
                    <i className="fa-solid fa-heart-pulse"></i>
                    <h3>Integrated medical care</h3>
                    <p>Comprehensive medical services 24/24 with the latest equipment and technologies.</p>
                </div>
                <div className="feature-card">
                    <i className="fa-solid fa-hospital"></i>
                    <h3>Modern infrastructure</h3>
                    <p>Advanced medical facilities and comfortable waiting hours to ensure your convenience.</p>
                </div>
                </div>
            </div>
        </section>
    </div>
)
}

export default HospitalInfo