import { Hero3DWebGL as Hero3D } from "@/components/hero-webgl"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SupportChat } from "@/components/support-chat"
import { MusicPlayer } from "@/components/music-player"
import { AccountsSection } from "@/components/accounts-section"
import { GamesSection } from "@/components/games-section"
import { MarketSection } from "@/components/market-section"
import { AdultSection } from "@/components/adult-section"
import { OrdersSection } from "@/components/orders-section"
import { RouletteSection } from "@/components/roulette-section"
import { RequestsSection } from "@/components/requests-section"
import { ManagementSection } from "@/components/management-section"
import { StatsCounter } from "@/components/stats-counter"
import { ReviewsSection } from "@/components/reviews-section"
import { TopProducts } from "@/components/top-products"

export default function Index() {
  return (
    <div className="dark">
      <Navbar />
      <main>
        <Hero3D />
        <StatsCounter />
        <AccountsSection />
        <GamesSection />
        <TopProducts />
        <MarketSection />
        <ReviewsSection />
        <OrdersSection />
        <RouletteSection />
        <RequestsSection />
        <ManagementSection />
        <AdultSection />
      </main>
      <Footer />
      <SupportChat />
      <MusicPlayer />
    </div>
  )
}
