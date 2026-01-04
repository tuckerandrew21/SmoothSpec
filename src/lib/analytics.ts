import { track } from "@vercel/analytics"

// Custom event types for type safety
export type AnalyticsEvent =
  | { name: "build_started" }
  | { name: "build_completed"; properties: { gamesCount: number; budget: number } }
  | { name: "recommendation_clicked"; properties: { componentType: string; priority: string } }
  | { name: "price_checked"; properties: { componentType: string; retailer: string } }
  | { name: "affiliate_link_clicked"; properties: { componentType: string; retailer: string } }
  | { name: "step_completed"; properties: { step: number; stepName: string } }

/**
 * Track a custom analytics event
 */
export function trackEvent(event: AnalyticsEvent) {
  if ("properties" in event) {
    track(event.name, event.properties)
  } else {
    track(event.name)
  }
}

/**
 * Track when a user starts the build analyzer
 */
export function trackBuildStarted() {
  trackEvent({ name: "build_started" })
}

/**
 * Track when a user completes their build analysis
 */
export function trackBuildCompleted(gamesCount: number, budget: number) {
  trackEvent({
    name: "build_completed",
    properties: { gamesCount, budget },
  })
}

/**
 * Track when a user clicks on a recommendation
 */
export function trackRecommendationClicked(componentType: string, priority: string) {
  trackEvent({
    name: "recommendation_clicked",
    properties: { componentType, priority },
  })
}

/**
 * Track when a user checks prices for a component
 */
export function trackPriceChecked(componentType: string, retailer: string) {
  trackEvent({
    name: "price_checked",
    properties: { componentType, retailer },
  })
}

/**
 * Track when a user clicks an affiliate link
 */
export function trackAffiliateClicked(componentType: string, retailer: string) {
  trackEvent({
    name: "affiliate_link_clicked",
    properties: { componentType, retailer },
  })
}

/**
 * Track wizard step completion
 */
export function trackStepCompleted(step: number, stepName: string) {
  trackEvent({
    name: "step_completed",
    properties: { step, stepName },
  })
}
