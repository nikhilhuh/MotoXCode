import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UseFadeUpOptions {
  threshold?: number
  stagger?: number
  delay?: number
  y?: number
}

/**
 * Hook: animates .gsap-fade-up children in a container on scroll.
 */
export function useFadeUp(options: UseFadeUpOptions = {}) {
  const { threshold = 0.15, stagger = 0.1, delay = 0, y = 40 } = options
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll('.gsap-fade-up')
    if (targets.length === 0) {
      // If no children, animate the container itself
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          delay,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: `top ${(1 - threshold) * 100}%`,
            once: true,
          },
        }
      )
    } else {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          delay,
          duration: 0.9,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: `top ${(1 - threshold) * 100}%`,
            once: true,
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [threshold, stagger, delay, y])

  return ref
}

/**
 * Hook: horizontal parallax scroll for a single element.
 */
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tl = gsap.to(el, {
      y: () => -el.offsetHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => { tl.kill() }
  }, [speed])

  return ref
}
