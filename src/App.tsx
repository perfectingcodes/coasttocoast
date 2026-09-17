import { Route, Router as WouterRouter, Switch } from "wouter";
import { MotionConfig } from "framer-motion";
import { ScrollToTop } from "@/components/scroll-to-top";
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
      <Route path="/privacy">{() => <LegalPage slug="privacy" />}</Route>
      <Route path="/terms">{() => <LegalPage slug="terms" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
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
        </WouterRouter>
      </HeadProvider>
    </MotionConfig>
  );
}
