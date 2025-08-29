import Image from 'next/image';

const Slideshow = () => {
  return (
    <div className="slideshow">
      <Image src="/images/image1.jpeg" alt="Slide 1" layout="fill" objectFit="cover" className="active" />
      <Image src="/images/image2.jpg" alt="Slide 2" layout="fill" objectFit="cover" />
      <Image src="/images/image3.jpeg" alt="Slide 3" layout="fill" objectFit="cover" />
    </div>
  );
};

export default Slideshow;
