import '../assets/styles/globals.css'
import '../assets/styles/reset.css'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from './registry'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rifas Beneficente Rio Amazonas',
  description: 'Crie sua rifa online aqui! Precisa fazer uma Rifa para sua faculdade, igreja ou escola? temos a solução prática e eficiente! Não gaste mais dinheiro imprimindo papéis.',
}

export default function RootLayout(props) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <body className={inter.className} 
        suppressHydrationWarning={true} >
          {props.children}
          {props.authModal}
        </body>
      </StyledComponentsRegistry>
    </html>
  )
}
