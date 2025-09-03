import React from 'react';

const Hero: React.FC = () => {
  const handleScroll = () => {
    const section = document.getElementById('classical-style');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-screen flex items-center relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(./images/hero-banner.jpg)' }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="relative z-10 max-w-2xl text-left">
          <h1 className="text-5xl md:text-7xl lg:text-7xl font-serif-display text-gray-900 mb-8 leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
            KLORA: 
            <div className="mt-2">Vẻ Đẹp Vĩnh Cửu</div>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
            Khám phá những món trang sức được chế tác tỉ mỉ, vượt thời gian. Mỗi tác phẩm là một minh chứng cho sự thanh lịch và mang trong mình một câu chuyện riêng.
          </p>
          <button
            onClick={handleScroll}
            className="group relative inline-block px-12 py-4 text-sm font-bold tracking-widest uppercase text-black border-2 border-black overflow-hidden"
          >
            <span className="absolute inset-0 bg-black transition-transform duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 ease-in-out">
              Bắt đầu
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;