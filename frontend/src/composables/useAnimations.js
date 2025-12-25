import { onMounted } from 'vue'
import { gsap } from 'gsap'

export function useAnimations() {
  const animateNumber = (element, from, to, duration = 1) => {
    return gsap.to(element, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: function() {
        if (element.textContent !== undefined) {
          element.textContent = this.targets()[0].value.toFixed(2)
        }
      }
    })
  }

  const animatePriceChange = (element, isPositive) => {
    const color = isPositive ? '#28a745' : '#dc3545'
    return gsap.to(element, {
      color,
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    })
  }

  const fadeIn = (element, delay = 0) => {
    return gsap.from(element, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay,
      ease: 'power2.out'
    })
  }

  const slideIn = (element, direction = 'left', delay = 0) => {
    const x = direction === 'left' ? -100 : direction === 'right' ? 100 : 0
    const y = direction === 'up' ? -100 : direction === 'down' ? 100 : 0
    
    return gsap.from(element, {
      x,
      y,
      opacity: 0,
      duration: 0.5,
      delay,
      ease: 'power2.out'
    })
  }

  const pulse = (element, scale = 1.1) => {
    return gsap.to(element, {
      scale,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    })
  }

  const shake = (element) => {
    return gsap.to(element, {
      x: -10,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'power2.inOut'
    })
  }

  const bounce = (element) => {
    return gsap.to(element, {
      y: -20,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    })
  }

  return {
    animateNumber,
    animatePriceChange,
    fadeIn,
    slideIn,
    pulse,
    shake,
    bounce
  }
}

