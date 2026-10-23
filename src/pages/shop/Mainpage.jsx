
import DiscountProducts from './DiscountProducts';
import Header from './Header';
import Hero from './Hero';
import PromoSection from './PromoSection';
import PromotionSection2 from './PromotionSection2';
import HotPicks from './HotPicks';
import Footer from './Footer';
import CategoryStrip from './CategoryStrip';
import TrustBar from './TrustBar';

export default function Mainpage() {

    return (
        <div className="min-h-screen bg-slate-50">
            <Header/>
            <main >
                <Hero/>
                <CategoryStrip />
                <TrustBar />
                <DiscountProducts />
                <div className="max-w-7xl mx-auto px-4">
                    <PromoSection />
                </div>
                <HotPicks />
                <PromotionSection2 />
            </main>
            <Footer/>

        </div>
    );
}



