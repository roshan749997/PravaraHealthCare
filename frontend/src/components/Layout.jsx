import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop.jsx'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

