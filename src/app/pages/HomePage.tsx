import { HeroCarousel } from '../components/HeroCarousel';
import { ProductGrid } from '../components/ProductGrid';
import { CategorySection } from '../components/CategorySection';
import { EditorialSection } from '../components/EditorialSection';
import { PageTransition } from '../components/PageTransition';

export function HomePage() {
  return (
    <PageTransition>
      <HeroCarousel />
      <ProductGrid />
      <CategorySection />
      <EditorialSection />
    </PageTransition>
  );
}
