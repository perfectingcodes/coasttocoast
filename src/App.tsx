import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { MotionConfig } from "framer-motion";
import { ScrollToTop } from "@/components/scroll-to-top";
import { TrafficTracker } from "@/components/traffic-tracker";
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
import LandingPageView from "@/pages/landing";
import NotFound from "@/pages/not-found";

import AdminHome from "@/pages/admin/index";
import AdminSeo from "@/pages/admin/seo";
import AdminMarketing from "@/pages/admin/marketing";
import AdminCampaigns from "@/pages/admin/campaigns";
import AdminLeads from "@/pages/admin/leads";
import AdminResources from "@/pages/admin/resources";
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
      {/* Paid landing pages. Noindexed, excluded from the sitemap, no site
          navigation — see pages/landing.tsx. */}
      <Route path="/lp/:slug">{(params) => <LandingPageView slug={params.slug} />}</Route>
      {/* Internal dashboard. No auth — static build. Noindexed, disallowed
          in robots.txt and excluded from the sitemap. */}
      <Route path="/admin" component={AdminHome} />
      <Route path="/admin/seo" component={AdminSeo} />
      <Route path="/admin/marketing" component={AdminMarketing} />
      <Route path="/admin/campaigns" component={AdminCampaigns} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/resources" component={AdminResources} />
      <Route path="/admin/google" component={AdminGoogle} />
      <Route path="/admin/tracking" component={AdminTracking} />

      <Route path="/privacy">{() => <LegalPage slug="privacy" />}</Route>
      <Route path="/terms">{() => <LegalPage slug="terms" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Public marketing pages only. The dashboard has no use for it, and on a paid
 * landing page it is one more thing to click instead of converting.
 */
function SupportLauncher() {
  const [location] = useLocation();
  if (location.startsWith("/admin") || location.startsWith("/lp")) return null;
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
          <TrafficTracker />
          <Routes />
          <SupportLauncher />
        </WouterRouter>
      </HeadProvider>
    </MotionConfig>
  );
}
