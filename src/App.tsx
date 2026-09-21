import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { MotionConfig } from "framer-motion";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SupportBot } from "@/components/support-bot";
import { HeadProvider, type HeadCollector } from "@/lib/head";

import Home from "@/pages/home";
import ServicesIndex from "@/pages/services-index";
import ServicePage from "@/pages/service";
import LocationsIndex from "@/pages/locations-index";
import LocationPage from "@/pages/location";
import CityServicePage from "@/pages/city-service";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Financing from "@/pages/financing";
import LegalPage from "@/pages/legal";
import NotFound from "@/pages/not-found";

import AdminHome from "@/pages/admin/index";
import AdminSeo from "@/pages/admin/seo";
import AdminMarketing from "@/pages/admin/marketing";
import AdminCampaigns from "@/pages/admin/campaigns";
import AdminGoogle from "@/pages/admin/google";
import AdminTracking from "@/pages/admin/tracking";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={ServicesIndex} />
      <Route path="/services/:slug">
        {(params) => <ServicePage slug={params.slug} />}
      </Route>
      <Route path="/locations" component={LocationsIndex} />
      <Route path="/locations/:city/:service">
        {(params) => (
          <CityServicePage city={params.city} service={params.service} />
        )}
      </Route>
      <Route path="/locations/:slug">
        {(params) => <LocationPage slug={params.slug} />}
      </Route>
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/financing" component={Financing} />
      {/* Internal dashboard. No auth — static build. Noindexed, disallowed
          in robots.txt and excluded from the sitemap. */}
      <Route path="/admin" component={AdminHome} />
      <Route path="/admin/seo" component={AdminSeo} />
      <Route path="/admin/marketing" component={AdminMarketing} />
      <Route path="/admin/campaigns" component={AdminCampaigns} />
      <Route path="/admin/google" component={AdminGoogle} />
      <Route path="/admin/tracking" component={AdminTracking} />

      <Route path="/privacy">{() => <LegalPage slug="privacy" />}</Route>
      <Route path="/terms">{() => <LegalPage slug="terms" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

/** Public pages only — the internal dashboard has no use for it. */
function SupportLauncher() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return null;
  return <SupportBot />;
}

export default function App({
  head,
  ssrPath,
}: {
  head?: HeadCollector;
  ssrPath?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <HeadProvider collector={head}>
        <WouterRouter ssrPath={ssrPath}>
          <ScrollToTop />
          <Routes />
          <SupportLauncher />
        </WouterRouter>
      </HeadProvider>
    </MotionConfig>
  );
}
