import { useEffect, useRef, useState, useCallback } from "react";

interface ActiveSectionState {
  activeIndex: number;
  /** 0–1 progress between current active node and the next node */
  interpolation: number;
  /** 0–1 overall fill progress across all nodes */
  fillProgress: number;
}

/**
 * Tracks which feature card is currently active using IntersectionObserver.
 * Timeline progress is derived from card visibility, NOT raw scroll position.
 */
export function useActiveSection(
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  containerRef: React.RefObject<HTMLElement | null>
): ActiveSectionState {
  const [state, setState] = useState<ActiveSectionState>({
    activeIndex: 0,
    interpolation: 0,
    fillProgress: 0,
  });

  const rafRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const visibilityMap = useRef<Map<number, number>>(new Map());

  // Use IntersectionObserver to track card visibility ratios
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cards.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            visibilityMap.current.set(index, entry.intersectionRatio);
          }
        });

        // Determine active card: the card with highest visibility in the
        // "activation zone" (top 40-70% of viewport)
        scheduleUpdate();
      },
      {
        // Multiple thresholds for granular tracking
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        // Activation zone: card must be in the upper-middle portion of viewport
        rootMargin: "-20% 0px -40% 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [cardRefs]);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      computeActive();
    });
  }, []);

  const computeActive = useCallback(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const container = containerRef.current;
    if (cards.length === 0 || !container) return;

    const viewportCenter = window.innerHeight * 0.4;

    // Find the card closest to the activation point (40% from top)
    let bestIndex = 0;
    let bestDistance = Infinity;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      // Only consider cards that are at least partially visible
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
    });

    // Calculate interpolation: how far between current and next node
    const activeCard = cards[bestIndex];
    if (!activeCard) return;

    const rect = activeCard.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    // How far past the activation point this card is (0 = just entered, 1 = about to leave)
    const cardProgress = Math.max(
      0,
      Math.min(1, (viewportCenter - rect.top) / rect.height)
    );

    // Overall fill: based on which node is active + interpolation toward next
    const totalNodes = cards.length;
    const baseProgress = bestIndex / Math.max(1, totalNodes - 1);
    const stepSize = 1 / Math.max(1, totalNodes - 1);
    const fillProgress = Math.min(1, baseProgress + cardProgress * stepSize);

    const newState: ActiveSectionState = {
      activeIndex: bestIndex,
      interpolation: cardProgress,
      fillProgress,
    };

    // Only update if meaningful change
    if (
      activeIndexRef.current !== bestIndex ||
      Math.abs(state.fillProgress - fillProgress) > 0.005
    ) {
      activeIndexRef.current = bestIndex;
      setState(newState);
    }
  }, [cardRefs, containerRef]);

  // Also listen to scroll for smooth interpolation between observer callbacks
  useEffect(() => {
    const onScroll = () => scheduleUpdate();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial computation
    scheduleUpdate();
    return () => window.removeEventListener("scroll", onScroll);
  }, [scheduleUpdate]);

  return state;
}
