import { Barlow, Chakra_Petch } from 'next/font/google'

export const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-chakra-petch',
  display: 'swap',
})

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const fontVariables = `${chakraPetch.variable} ${barlow.variable}`
