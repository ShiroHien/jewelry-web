import React from 'react';
import Hero from '../components/Hero';
import ClassicalStyleSection from '../components/ClassicalStyleSection';
import AmberSection from '../components/AmberSection';
import BlogSection from '../components/BlogSection';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ClassicalStyleSection />
      <AmberSection />
      <BlogSection />
    </>
  );
};

export default HomePage;
