import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./VisitorOpinionsStylee.css";
import { Autoplay } from "swiper/modules";
import imgZ from "./../assets/images/1755248454042.jpg";
import imgY from "./../assets/images/1755248454088.jpg";
import imgM from "./../assets/images/1755248454125.jpg";
import { useRef } from "react";

const testimonials = [
  {
    name: "Ali Ahmad",
    role: "visitor",
    image: imgZ,
    comment:
      "The medical environment in the hospital is excellent , and modern equipment makes the person compelety comfortable.",
    // البيئة الطبية بالمشفى ممتازة، والتجهيزات الحديثة بتخليني أشتغل بكل راحة.
  },
  {
    name: "Mohammad almahmmod",
    role: "visitor",
    image: imgY,
    comment:
      "Wonderful reception , the visitor feels attention and comfort from the moment he enters.",
    // 'استقبال ولا أروع، حسّيت بالاهتمام والراحة من لحظة دخولي.
  },
  {
    name: "Ali ALi",
    role: "visitor",
    image: imgM,
    comment:
      "The nursing team is very professional ,modern and distinctive techniques.",
    // 'فريق التمريض محترف جدًا، والتقنيات المستخدمة حديثة ومميزة.
  },
  {
    name: "Ali Ahmad",
    role: "visitor",
    image: imgZ,
    comment:
      "The medical environment in the hospital is excellent , and modern equipment makes the person compelety comfortable.",
    // البيئة الطبية بالمشفى ممتازة، والتجهيزات الحديثة بتخليني أشتغل بكل راحة.
  },
  {
    name: "Mohammad almahmmod",
    role: "visitor",
    image: imgY,
    comment:
      "Wonderful reception , the visitor feels attention and comfort from the moment he enters.",
    // 'استقبال ولا أروع، حسّيت بالاهتمام والراحة من لحظة دخولي.
  },
  {
    name: "Ali ALi",
    role: "visitor",
    image: imgM,
    comment:
      "The nursing team is very professional ,modern and distinctive techniques.",
    // 'فريق التمريض محترف جدًا، والتقنيات المستخدمة حديثة ومميزة.
  },
];

export default function VisitorOpinions() {
  const swiperRef = useRef(null);
  // let ig=[imgZ,imgY,imgM]

  return (
    <section className="testimonials-slider">
      <h2>Visitors opinions</h2>
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
        centeredSlides={true}
        // pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className="testimonial-card"
              onMouseEnter={() => {
                swiperRef.current?.autoplay?.stop();
              }}
              onMouseLeave={() => {
                swiperRef.current?.autoplay?.start();
              }}
            >
              <img src={item.image} />
              <p>“{item.comment}”</p>
              <h4>{item.name}</h4>
              <span>{item.role}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
