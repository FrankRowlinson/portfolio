import { Outlet } from "react-router-dom"
import "./App.scss"

function App() {
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    console.log(event.currentTarget.scrollTop)
  }
  return (
    <div className='App' onScroll={handleScroll}>
      <Outlet />
    </div>
  )
}

export default App
