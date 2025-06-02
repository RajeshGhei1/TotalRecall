
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CompanySpotlight from '../components/CompanySpotlight';
import HowItWorks from '../components/HowItWorks';
import SignupForm from '../components/SignupForm';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <CompanySpotlight />
        <HowItWorks />
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
