import React from 'react';
import { Link } from 'react-router-dom';
import blogImg1 from './../assets/images/blog/tecnolog.jpg';
import blogImg2 from './../assets/images/blog/camp.jpg';
import blogImg3 from './../assets/images/blog/award.jpg';
import './BlogSectionStylee.css';

const blogPosts = [
  {
    title: "New MRI Technology Introduced",
    date: "April 25, 2025",
    desc: "Our hospital just acquired the latest MRI machine offering more accurate diagnostics in shorter times.",
    image: blogImg1,
  },
  {
    title: "Medical Seminars",
    date: "May 5, 2025",
    desc: "Join our medical seminars to learn about the latest advancements in healthcare.",
    image: blogImg2,
    link: "/seminars" // إضافة رابط للندوات الطبية
  },
  {
    title: "Award for Patient Satisfaction",
    date: "May 15, 2025",
    desc: "We are honored to receive the National Award for Excellence in Patient Care for the second year in a row.",
    image: blogImg3,
  }
];

export default function BlogSection() {
  return (
    <section className="blog-section">
      <h2 className="blog-title">Latest News & Updates</h2>
      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <div className="blog-card" key={index}>
            <img src={post.image} alt="blog post" className="blog-img" />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <span className="blog-date">{post.date}</span>
              <p>{post.desc}</p>
              {post.link && (
                <Link to={post.link} className="btn blog-link">
                  Learn More
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}