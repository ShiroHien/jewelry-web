import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClassicalStyle } from '../types';

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

const MOCK_STYLES: ClassicalStyle[] = [
  {
    image: 'https://images.unsplash.com/photo-1611652022417-a5734a2155c8?q=80&w=1974&auto=format&fit=crop',
    title: 'Nhẫn Vượt Thời Gian',
    description: 'Nét đẹp trường tồn, giá trị vĩnh cửu.',
    link: '/rings',
  },
  {
    image: 'https://images.unsplash.com/photo-1599643477877-53a8a21350a8?q=80&w=1974&auto=format&fit=crop',
    title: 'Vòng Cổ Sang Trọng',
    description: 'Điểm nhấn đặc trưng cho phong cách của bạn.',
    link: '/necklaces',
  },
  {
    image: 'https://images.unsplash.com/photo-1617038260897-41a189f41794?q=80&w=1974&auto=format&fit=crop',
    title: 'Vòng Tay Thanh Lịch',
    description: 'Một nét duyên dáng cho mọi sự kiện.',
    link: '/bracelets',
  }
];

const getClassicalStyles = async (): Promise<ClassicalStyle[]> => {
  // In a real app, this would fetch from an API.
  return new Promise(resolve => setTimeout(() => resolve(MOCK_STYLES), 500));
};


const FeatureCard: React.FC<FeatureCardProps> = ({ image, title, description, link }) => {
  return (
    <div className="group relative overflow-hidden text-white aspect-[4/5]">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/50 p-8 flex flex-col justify-end">
        <h3 className="text-3xl font-serif-display font-bold mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <Link to={link} className="font-bold uppercase tracking-widest text-sm self-start border-b-2 border-transparent hover:border-white transition-all duration-300">
          Khám Phá
        </Link>
      </div>
    </div>
  );
};

const ClassicalStyleSection: React.FC = () => {
  const [styles, setStyles] = useState<ClassicalStyle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClassicalStyles();
      setStyles(data);
      setLoading(false);
    };
    fetchData();
  }, []);


  return (
    <section id="classical-style" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif-display text-center mb-4">Phong Cách Cổ Điển</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-center">Mang dấu ấn của những kiệt tác nghệ thuật, tạo nên phong thái trang nhã và cuốn hút đặc biệt.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse aspect-[4/5]"></div>
            ))
          ) : (
            styles.map((item, index) => (
              <FeatureCard 
                key={index}
                image={item.image}
                title={item.title}
                description={item.description}
                link={item.link}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ClassicalStyleSection;
